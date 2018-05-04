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
 parse,
 resetConversation,
} = require('../common/utils');

const {
  duringPrompt,
} = require('./utilsDuring');

const parsePromptByIntentName = (conv, prompts) => {
  return parse(conv, prompts[conv.intent]);
};

const prompt = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  return parsePromptByIntentName(conv, prompts);
};

module.exports = (conv, ...args) => {
  resetConversation(conv);
  if (conv.phase === 'during') {
    return duringPrompt(conv, ...args);
  } else {
    return prompt(conv, ...args);
  }
};
