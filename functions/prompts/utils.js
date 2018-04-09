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

// Returns a single random element from some array
const getSingleRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Returns multiple random elements from some array
const getMultipleRandom = (arr) => arr.filter(() => Math.random() > 0.5);

// Chooses a random goodbye prompt from phase's set of goodbye prompts
const goodbye = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  conv.close(getSingleRandom(prompts.goodbyePrompts));
};

// Returns a Suggestions object based off suggestions spec provided
const getSuggestions = (suggestions = {}) => {
  const finalSuggestions = suggestions.required || [];
  if (suggestions.randomized) {
    finalSuggestions.push(...getMultipleRandom(suggestions.randomized));
  }
  return new Suggestions(finalSuggestions);
};

// Will choose a fallback prompt stored in conv.data based on fallback count.
// If conv.data doesn't have an appropriate fallback prompt array, will
// defer to the default fallback prompts from a prompt phase.
const fallback = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  const fallbackCount = conv.data.fallbackCount;
  let responses = conv.data.fallbackResponses;
  if (!responses || !Array.isArray(responses) || responses.length !== 3) {
    responses = prompts.defaultFallbackPrompts;
  }
  if (fallbackCount < 2) {
    conv.ask(responses[fallbackCount].response);
    conv.ask(getSuggestions(responses[fallbackCount].suggestions));
  } else {
    conv.close(responses[fallbackCount].response);
  }
  conv.data.fallbackCount++;
};

// Will choose a no-input prompt stored in conv.data based on no-input count.
// If conv.data doesn't have an appropriate no-inpu prompt array, will
// defer to the default no-input prompts from a prompt phase.
const noInput = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  let responses = conv.data.noInputResponses;
  if (!responses || !Array.isArray(responses) || responses.length !== 3) {
    responses = prompts.defaultNoInputPrompts;
  }
  console.log('**SACHIT '+ conv.arguments.get('REPROMPT_COUNT'));
  const noInputCount = conv.arguments.get('REPROMPT_COUNT') || 0;
  if (noInputCount < 2) {
    conv.ask(responses[noInputCount]);
  } else {
    conv.close(responses[noInputCount]);
  }
};

module.exports = {
  fallback,
  goodbye,
  noInput,
};
