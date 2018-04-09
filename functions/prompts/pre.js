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
        'Tell me about keynotes',
        'Tell me about sessions',
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
        'Tell me about keynotes',
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
      text: `Since I'm having trouble, I'm going to call IT, though they'll probably just tell me to turn it off then on again. Bye for now.`,
    }),
  },
];

// No Input Prompts should work only on speaker surfaces
const defaultNoInputPrompts = [
  new SimpleResponse({
    speech: `You're sending an empty signal here. What do you want to know about IO?`,
    text: `You're sending an empty signal here. What do you want to know about I/O?`,
  }),
  new SimpleResponse({
    speech: `I can tell you about the keynotes, sessions, or anything else about IO. What would you like to know?`,
    text: `I can tell you about the keynotes, sessions, or anything else about I/O. What would you like to know?`,
  }),
  new SimpleResponse({
    speech: `Since I'm having trouble, I'm going to call I T, though they'll probably just tell me to turn it off then on again. Bye for now.`,
    text: `Since I'm having trouble, I'm going to call IT, though they'll probably just tell me to turn it off then on again. Bye for now.`,
  }),
];

module.exports = {
  'welcome': {
    'firstTime': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `Welcome to your launchpad for all things Google IO.`,
                text: `Welcome to your launchpad for all things Google I/O.`,
              }),
            ],
            [
              new SimpleResponse({
                speech: `<speak>As the Keeper of IO Specific Knowledge, consider me your guide. I can help you plan for IO by telling you about when it's happening, or how to watch remotely. I can also search for talks. So, what do you want to know?</speak>`,
                text: `As the Keeper of I/O Specific Knowledge, consider me your guide. So, what do you want to know about I/O?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'When is it?',
              'How can I watch remotely?',
              'Search for talks',
              'Tell me about keynotes',
            ],
            'randomized': [

            ],
          },
        },
      ],
    },
    'repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              'Hi again',
              'Welcome back',
            ],
            [
              new SimpleResponse({
                speech: `<speak>I can tell you more about IO. For example, you might like to know about the keynote, <break time="250ms"/>or app reviews. <break time="500ms"/>I can also help you find sessions, <break time="250ms"/>or office hours. So, what do you want to know?</speak>`,
                text: `I can tell you more about I/O. What do you want to know?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Tell me about keynotes', 'What are codelabs?', 'Can I get my app reviewed', 'Browse sessions', 'Find office hours',
            ],
          },
        },
        {
          'elements': [
            [
              'Hi again',
              'Welcome back',
            ],
            [
              new SimpleResponse({
                speech: `<speak>I have all kinds of info on IO, <break time="250ms"/>from codelabs and sandboxes, <break time="250ms"/>to the keynotes and sessions. So, tell me what you want to know about.</speak>`,
                text: `I have all kinds of info on I/O, so, tell me what you want to know.`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Codelabs and sandboxes', 'Tell me about keynotes', 'Browse sessions',
            ],
          },
        },
        {
          'elements': [
            [
              'Hi again',
              'Welcome back',
            ],
            [
              new SimpleResponse({
                speech: `<speak>All of my expertise, as keeper of IO specific knowledge <break time="200ms"/> is at your disposal. You can search for talks, <break time="250ms"/>manage your viewing schedule, <break time="250ms"/>or ask to hear about things like the food, swag, and after parties.  So, what's your query?</speak>`,
                text: `All of my expertise as keeper of I/O specific knowledge is at your disposal. So, what's your query?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks', 'Manage my schedule', 'Will there be food?', 'Is there swag?', `When's the after party?`,
            ],
          },
        },
        {
          'elements': [
            [
              'Hi again',
              'Welcome back',
            ],
            [
              new SimpleResponse({
                speech: `<speak>I've got more info about IO. You might be interested in where it's happening or how you can watch remotely. I can also tell you about the keynotes, sessions, and office hours. So, what are you interested in?</speak>`,
                text: `I've got more info about I/O. What are you interested in?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', 'Browse sessions', `Find office hours`,
            ],
          },
        },
      ],
    },
    'reentry': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `Now, you can search for talks, manage your viewing schedule, or ask me anything else you want to know about IO.`,
                text: `Now, you can ask me anything else you want to know about I/O.`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks',
              'Manage my schedule',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `Now, you can ask about the keynotes or sessions, or anything else you want to know about IO.`,
                text: `Now, you can ask anything else you want to know about I/O.`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Tell me about keynotes',
              'Tell me about sessions',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
      ],
    },
    'noInput': defaultNoInputPrompts,
    'fallback': defaultFallbackPrompts,
  },
  'date': {
    'firstTime/repeat': [
      {
        'appendReentry': 'welcome',
        'elements': [
          [
            new SimpleResponse({
              speech: `<speak> This year’s developer festival will be held May <say-as interpret-as="ordinal">8</say-as> through <say-as interpret-as="ordinal">10</say-as> in California <break time="250ms"/> next to Google's main campus.<break time="750ms"/></speak>`,
              text: `This years developer festival will be held May 8-10 at the Shoreline Amphitheatre in Mountain View, CA`,
            }),
          ],
        ],
      },
    ],
  },
  defaultFallbackPrompts,
  defaultNoInputPrompts,
  'goodbyePrompts': [
    // TODO: There is a bug that causes this not to work right now
    // new SimpleResponse({
    //   speech: `<speak><prosody rate="x-fast">OK.</prosody> <prosody rate="fast">Hope to talk to you again soon.</prosody></speak>`,
    //   text: `OK. Hope to talk to you again soon.`,
    // }),
    new SimpleResponse({
      speech: `Come back if there's anything else IO you'd like to know.`,
      text: `Come back if there's anything else I/O you'd like to know.`,
    }),
  ],
};
