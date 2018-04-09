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
  SimpleResponse,
} = require('actions-on-google');

/* eslint-disable max-len*/
const defaultFallbackPrompts = [
  {
    'response': new SimpleResponse({
      speech: `I'm getting a 4 O 4 error. What did you want to know about IO?`,
      text: `That's a 404. What did you want to know about I/O?`,
    }),
    'suggestions': {
      'required': [
        'Tell me about the keynotes',
        'Tell me about the sessions',
      ],
      'randomized': [
        'Where is it?', 'How can I watch remotely?', `Find office hours`,
        'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
      ],
    },
  },
  {
    'response': new SimpleResponse({
      speech: `Sorry. That's beyond my expertise. Can I interest you in info on the keynotes, the sessions, or how to watch remotely?`,
      text: `Sorry, that's beyond my expertise.\u00a0Can I interest you in info on the keynotes, the sessions, or how to watch remotely?`,
    }),
    'suggestions': {
      'required': [
        'Tell me about the keynotes',
        'Browse sessions',
      ],
      'randomized': [
        'Where is it?', 'How can I watch remotely?', `Find office hours`,
        'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
      ],
    },
  },
  {
    'response': new SimpleResponse({
      speech: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
      text: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
    }),
  },
];

const defaultNoInputPrompts = [
  `You're sending an empty signal here. What do you want to know about IO?`,
  `I can tell you about the keynotes, sessions, or anything else about IO. What would you like to know?`,
  `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
];

module.exports = {
  defaultFallbackPrompts,
  defaultNoInputPrompts,
};
