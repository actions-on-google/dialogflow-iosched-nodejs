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

const {
  popularJusticeSongsCarousel,
  popularPhantogramSongsCarousel,
} = require('../common/concert');

/* eslint-disable max-len*/
const menuFirstTime = (prefixPrompts) => {
  const elements = [
    [
      new SimpleResponse({
        speech: `<speak>As the keeper of IO specific knowledge, consider me your guide. I can help you catch up on what you may have missed at IO 2018. For example, you can search for talks, or ask about the keynotes. So, what do you want to know?</speak>`,
        text: `As the Keeper of I/O-Specific Knowledge, consider me your guide. So, what do you want to know?`,
      }),
    ],
  ];
  const suggestions = {
    'required': [
      'Search for talks',
      'Keynotes',
    ],
    'randomized': [],
  };
  return menu(elements, suggestions, prefixPrompts);
};

const menuRepeat = (prefixPrompts) => {
  const elements = [
    [
      new SimpleResponse({
        speech: `<speak>IO may be over, but there's still plenty to explore. For example, you can search for talks, ask about the keynotes, or find out how to watch the recordings. So, what do you want to do?</speak>`,
        text: `I/O may be over, but there's still plenty to explore. So, what do you want to do?`,
      }),
    ],
  ];
  const suggestions = {
    'required': [
      'Search for talks',
      'Keynotes',
    ],
    'randomized': [],
  };
  return menu(elements, suggestions, prefixPrompts);
};

const menu = (elements, suggestions, prefixPrompts) => {
  if (prefixPrompts) {
      elements.unshift(prefixPrompts);
  }
  return {
    'screen/speaker': [
      {
        'elements': elements,
        'suggestions': suggestions,
      },
    ],
  };
};

const welcomeReentry = (prefixPrompts) => [
  {
    'elements': [
      prefixPrompts,
      [
        new SimpleResponse({
          speech: `Now, you can search for talks, find out how to watch the recordings, or ask me anything else you want to know about IO.`,
          text: `Now, you can ask me anything else you want to know about I/O.`,
        }),
      ],
    ],
    'suggestions': {
      'required': [
        'Search for talks',
      ],
      'randomized': [],
    },
  },
  {
    'elements': [
      prefixPrompts,
      [
        new SimpleResponse({
          speech: `Now, you can ask about the keynotes or sessions, or anything else you want to know about IO.`,
          text: `Now, you can ask anything else you want to know about I/O.`,
        }),
      ],
    ],
    'suggestions': {
      'required': [
        'Keynotes',
        'Browse sessions',
      ],
      'randomized': [],
    },
  },
];

module.exports = {
  'welcome': {
    'firstTime': menuFirstTime([
      new SimpleResponse({
        speech: `Welcome to your launchpad for all things Google IO.`,
        text: `Welcome to your launchpad for all things Google I/O.`,
      }),
    ]),
    'repeat': menuRepeat([
      'Hi again',
      'Welcome back',
    ]),
  },
  'menu': {
    'firstTime/repeat': menuRepeat(),
  },
  'thingsToDoMenu': {
    'firstTime/repeat': menuRepeat(),
  },
  'relaxMenu': {
    'firstTime/repeat': menuRepeat(),
  },
  'date': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Google IO 2018 <break time="100ms"/> was held May <say-as interpret-as="ordinal">8</say-as> through <say-as interpret-as="ordinal">10</say-as> at the Shoreline Amphitheatre <break time="200ms"/>in Mountain View, California.<break time="750ms"/></speak>`,
        text: `Google I/O 2018 was May 8-10 at the Shoreline Amphitheatre in Mountain View, CA`,
      }),
    ]),
  },
  'keynote': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> There were so many announcements Google wanted to share with developers that there were two keynotes. You can watch them both on the Google Developers YouTube channel.<break time="750ms"/></speak>`,
        text: `There were two keynotes. You can watch them both on the Google Developers YouTube channel.`,
      }),
    ]),
  },
  'codelabs': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Codelabs and Sandboxes are all about hands-on inspiration, and demoing the latest interactive experiences built on the Google developer platform. Codelabs are free, self-paced, online modules, so you can try them yourself at codelabs.developers.google.com <break time="750ms"/></speak>`,
        text: `Codelabs and Sandboxes are all about hands-on inspiration. You can try these free, self-paced, online modules at codelabs.developers.google.com`,
      }),
    ]),
  },
  'appReview': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> Developers who attended IO were able to drop by office hours and app reviews to get advice and on-the-spot reviews from Googlers. <break time="750ms"/></speak>`,
        text: `Developers who attended I/O were able to drop by office hours and app reviews to get advice and on-the-spot reviews from Googlers.`,
      }),
    ]),
  },
  'food': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Developers who attended IO were given breakfast, lunch, and snacks during the conference. They could also have dinner during the after parties.<break time="750ms"/></speak>`,
        text: `Developers who attended I/O were given breakfast, lunch, and snacks during the conference. They could also have dinner during the after parties.`,
      }),
    ]),
  },
  'swag': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Attendees this year got an Android Things kit and a Google Home Mini.<break time="750ms"/></speak>`,
        text: `Attendees this year got an Android Things kit and a Google Home Mini.`,
      }),
    ]),
  },
  'afterParty': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> There were two after parties featuring music, games, food, drinks and more. One was an exclusive concert in the Amphitheatre.<break time="750ms"/></speak>`,
        text: `There were two after parties featuring music, games, food, drinks and more. One was an exclusive concert in the Amphitheatre.`,
      }),
    ]),
  },
  'watchRemotely': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Every year, developers around the world host Google I/O Extended events. During these events, <break time="250ms"/> organizers can livestream the event <break time="250ms"/>and host their own sessions, including hackathons,<break time="250ms"/> codelabs, <break time="250ms"/>demos, and more.<break time="750ms"/></speak>`,
        text: `Every year, developers around the world host Google I/O Extended events. During these events, organizers can livestream the event and host their own sessions including hackathons, codelabs, demos, and more.`,
      }),
    ]),
  },
  'announcements': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>If you haven't already, I recommend watching the keynotes for the biggest announcements.<break time="750ms"/></speak>`,
        text: `If you haven't already, I recommend watching the keynotes for the biggest announcements.`,
      }),
    ]),
  },
  'lostAndFound': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> There was a lost & found station at the conference help desk. Any items left overnight were turned over to the conference security office.<break time="750ms"/></speak>`,
        text: `There was a lost & found station at the conference help desk. Any items left overnight were turned over to the conference security office.`,
      }),
    ]),
  },
  'whatToWear': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> Let me get this straight. You want to know what to wear to an event that already happened? In that case, why not wear something that matches your time machine?<break time="750ms"/></speak>`,
        text: `Let me get this straight. You want to know what to wear to an event that already happened? In that case, why not wear something that matches your time machine?`,
      }),
    ]),
  },
  'unrecognized-deep-link': {
    'firstTime': menuFirstTime([
      `I don't know anything about that, but here's what I can help you with.`,
    ]),
    'repeat': menuRepeat([
      `I don't know anything about that, but here's what I can help you with.`,
    ]),
  },
  'directions': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Google IO 2018 <break time="100ms"/> was held May <say-as interpret-as="ordinal">8</say-as> through <say-as interpret-as="ordinal">10</say-as> at the Shoreline Amphitheatre <break time="200ms"/>in Mountain View, California.<break time="750ms"/></speak>`,
        text: `Google I/O 2018 was May 8-10 at the Shoreline Amphitheatre in Mountain View, CA`,
      }),
    ]),
  },
  'scavenger-hunt': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>There was a Scavenger hunt this year at I/O! Attendees had the opportunity to find clues and unlock puzzles to collect an Android Things Developer Kit!</speak>`,
        text: `There was a Scavenger hunt this year at I/O! Attendees had the opportunity to find clues and unlock puzzles to collect an Android Things Developer Kit!`,
      }),
    ]),
  },
  'concert': {
    'firstTime': menuFirstTime([
      `This years concert was one to remember! It opened up with a phenomenal performance by Phantogram, followed by the main act, Justice taking the stage for the remainder of the night.`,
    ]),
    'repeat': menuRepeat([
      `This years concert was one to remember! It opened up with a phenomenal performance by Phantogram, followed by the main act, Justice taking the stage for the remainder of the night.`,
    ]),
  },
  'popular-justice-songs': {
    'firstTime/repeat':
    [
      {
        'elements':
        [
          [
            new SimpleResponse({
              speech: `Here are popular songs by Justice.`,
              text: `Here are popular songs by Justice.`,
            }),
          ],
          [
            popularJusticeSongsCarousel(),
          ],
        ],
        'suggestions': {
          'required': [
            `Songs by Phantogram`,
            'Do something else',
          ],
        },
      },
    ],
  },
  'popular-phantogram-songs': {
    'firstTime/repeat':
    [
      {
        'elements':
        [
          [
            new SimpleResponse({
              speech: `Here are popular songs by Phantogram.`,
              text: `Here are popular songs by Phantogram.`,
            }),
          ],
          [
            popularPhantogramSongsCarousel(),
          ],
        ],
        'suggestions': {
          'required': [
            `Songs by Justice`,
            'Do something else',
          ],
        },
      },
    ],
  },
};
