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
exports.defaultFallbackPrompts = [
  {
    'elements': [
        new SimpleResponse({
        speech: `I'm getting a 4 0 4 error. Which did you want?`,
        text: `That's a 404. What did you want help with?`,
      }),
    ],
    'suggestions': {
      'required': [
        'Manage my schedule',
        'Find things to do',
        'Get directions',
      ],
      'randomized': [
        'Where is it?', 'How can I watch remotely?', `Find office hours`,
        'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
      ],
    },
  },
  {
    'elements': [
        new SimpleResponse({
        speech: `Sorry. That's beyond my expertise. Can I help you manage your schedule, find things to do, or give you directions?`,
        text: `Sorry, that's beyond my expertise. Can I help you manage your schedule, find things to do, or give you directions?`,
      }),
    ],
    'suggestions': {
      'required': [
        'Manage my schedule',
        'Find things to do',
        'Get directions',
      ],
    },
  },
  {
    'elements': [
      new SimpleResponse({
        speech: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
        text: `Since I'm having trouble, I'm going to call IT, though they'll probably just tell me to turn it off then on again. Bye for now.`,
      }),
    ],
  },
];

// No Input Prompts should work only on speaker surfaces
exports.defaultNoInputPrompts = [
  new SimpleResponse({
    speech: `You’re sending an empty signal here. I can manage your schedule, help you find things to do, or give you directions. Which do you need?`,
    text: `What can I help you with?`,
  }),
  new SimpleResponse({
    speech: `Do you want me to manage your schedule, help you find things to do, or give you directions?`,
    text: `Do you want me to manage your schedule, help you find things to do, or give you directions?`,
  }),
  new SimpleResponse({
    speech: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
    text: `Since I'm having trouble, I'm going to call IT, though they'll probably just tell me to turn it off then on again. Bye for now.`,
  }),
];

exports.goodbye = [
  new SimpleResponse({
    speech: `<speak><prosody rate="fast">OK.</prosody> Hope to talk to you again soon.</speak>`,
    text: `OK. Hope to talk to you again soon.`,
  }),
  new SimpleResponse({
    speech: `Come back if there's anything else IO you'd like to know.`,
    text: `Come back if there's anything else I/O you'd like to know.`,
  }),
];
