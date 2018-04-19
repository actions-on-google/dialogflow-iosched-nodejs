// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const {
  Suggestions,
} = require('actions-on-google');

const MAX_SUGGESTIONS = 8;
const DEFAULT_SCREEN_MAX = 30;
const DEFAULT_AUDIO_MAX = 6;

// Returns a single random element from some array
const getSingleRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Returns multiple random elements from some array
const getMultipleRandom = (arr) => arr.filter(() => Math.random() > 0.5);

// Returns a Suggestions object based off suggestions spec provided
const getSuggestions = (suggestions = {}) => {
  const finalSuggestions = suggestions.required || [];
  if (suggestions.randomized) {
    finalSuggestions.push(...getMultipleRandom(suggestions.randomized));
  }
  return new Suggestions(finalSuggestions.slice(0, MAX_SUGGESTIONS));
};

// Will choose a fallback prompt stored in conv.data based on fallback count.
// If conv.data doesn't have an appropriate fallback prompt array, will
// defer to the default fallback prompts from a prompt phase.
exports.fallback = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  const fallbackCount = conv.data.fallbackCount;
  let responses = conv.data.fallbackResponses;
  if (!responses || !Array.isArray(responses) || responses.length !== 2) {
    responses = prompts.defaultFallbackPrompts;
  }
  if (fallbackCount < 2) {
    conv.ask(...responses[fallbackCount].elements);
    conv.ask(getSuggestions(responses[fallbackCount].suggestions));
  } else {
    conv.close(...prompts.defaultFallbackPrompts[fallbackCount].elements);
  }
  conv.data.fallbackCount++;
};

// Will choose a no-input prompt stored in conv.data based on no-input count.
// If conv.data doesn't have an appropriate no-input prompt array, will
// defer to the default no-input prompts from a prompt phase.
exports.noInput = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  let responses = conv.data.noInputResponses;
  if (!responses || !Array.isArray(responses) || responses.length !== 2) {
    responses = prompts.defaultNoInputPrompts;
  }
  const noInputCount = conv.arguments.get('REPROMPT_COUNT') || 0;
  if (noInputCount < 2) {
    conv.ask(responses[noInputCount]);
  } else {
    conv.close(prompts.defaultNoInputPrompts[noInputCount]);
  }
};

exports.goodbye = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  conv.close(getSingleRandom(prompts.goodbye));
};

// Logic for parsing prompts. This function looks for prompts first by the
// current intent, then by the repeat status of the user.
// The function then locates the appropriate prompts
// for the surface on which the user is interacting. Finally, randomization
// is used to choose between variations of prompts.
exports.parse = (conv, prompts) => {
  try {
    // Get the right set of prompt variants by repeat status of user
    let responseVariations = prompts[conv.isRepeat] ||
      prompts['firstTime/repeat'];
    // Check for the appropriate surface variants to use (phone, speaker, etc)
    if (responseVariations.screen && conv.screen) {
        responseVariations = responseVariations.screen;
      } else if (responseVariations.speaker) {
      responseVariations = responseVariations.speaker;
    } else if (responseVariations['screen/speaker']) {
      responseVariations = responseVariations['screen/speaker'];
    }
    // Choose a random variant within the dimensions
    const responseVariant = getSingleRandom(responseVariations);
    for (element in responseVariant.elements) {
      if (responseVariant.elements.hasOwnProperty(element)) {
        conv.ask(getSingleRandom(responseVariant.elements[element]));
      }
    }
    if (responseVariant.suggestions) {
      conv.ask(getSuggestions(responseVariant.suggestions));
    }
    conv.data.noInputResponses = responseVariant.noInput;
    conv.data.fallbackResponses = responseVariant.fallback;
  } catch (error) {
    console.error(`Error parsing prompt: ${error}`);
    exports.fallback(conv);
    return;
  }
};

/**
 * Based on the parameters, displays a browsing prompt to the user.
 *
 * @param {Object} options
 * @param {Object} options.conv Client library conversation object.
 * @param {Promise} options.itemsPromise Promise which resolves with array of
 *     items.
 * @param {Function} options.prompts Function which returns the prompts object.
 * @param {number=} options.maxScreen Max items to show on screen.
 * @param {number=} options.maxAudio Max items to say on speaker.
 * @param {Function=} options.sort Function by which to sort browsed items.
 * @return {Promise} Promise which resolves with the parsed response.
 */
exports.browse = ({conv, itemsPromise, prompts,
  maxScreen=DEFAULT_SCREEN_MAX, maxAudio=DEFAULT_AUDIO_MAX, sort}) => {
    return itemsPromise.then((items) => {
      if (!items || items.length === 0) {
        return exports.parse(conv, prompts().emptyOptions);
      };
      // Sort items and split into current and next set to present.
      items.sort(sort);
      const currentItems = items.slice(0, conv.screen ? maxScreen : maxAudio);
      const nextItems = items.slice(conv.screen ? maxScreen : maxAudio);
      conv.data.currentItems = currentItems;
      conv.data.nextItems = nextItems;
      return exports.parse(conv, prompts(currentItems).presentItems);
    }).catch((error) => {
      console.error(`Error with browsing prompt: ${error}`);
      return exports.parse(conv, prompts().error);
    });
};

exports.sanitizeSsml = (str) => str.replace('&', 'and').replace('AR', 'A R');
