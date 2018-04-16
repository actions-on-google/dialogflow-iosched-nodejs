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
    if (responseVariations.screen &&
      conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
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
