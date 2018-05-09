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
        speech: `Well that's a 4 0 4. Can I interest you in info on the keynotes, the sessions, or how to watch the recordings?`,
        text: `Can I interest you in info on the keynotes, the sessions, or how to watch the recordings?`,
      }),
    ],
    'suggestions': {
      'required': [
        'Keynotes',
        'Browse sessions',
      ],
      'randomized': [],
    },
  },
  {
    'elements': [
      new SimpleResponse({
        speech: `Sorry. That's beyond my expertise. Do you want to hear about the keynotes, browse sessions, or learn where you can watch the recordings?`,
        text: `Do you want to hear about the keynotes, browse sessions, or learn where you can watch the recordings?`,
      }),
    ],
    'suggestions': {
      'required': [
        'Keynotes',
        'Browse sessions',
      ],
      'randomized': [],
    },
  },
  {
    'elements': [
      new SimpleResponse({
        speech: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
        text: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
      }),
    ],
  },
];

// No Input Prompts should work only on speaker surfaces
exports.defaultNoInputPrompts = [
  new SimpleResponse({
    speech: `You're sending an empty signal here. What do you want to know about IO?`,
    text: `What do you want to know about IO?`,
  }),
  new SimpleResponse({
    speech: `I can tell you about the keynotes, sessions, or anything else about IO. What would you like to know?`,
    text: `What would you like to know?`,
  }),
  new SimpleResponse({
    speech: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
    text: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
  }),
];

exports.goodbye = [
  new SimpleResponse({
    speech: `<speak><prosody rate="fast">OK.</prosody> Goodbye.</speak>`,
    text: `OK. Goodbye.`,
  }),
];
