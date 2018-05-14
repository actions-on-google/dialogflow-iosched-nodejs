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
const menuFirstTime = (prefixPrompts) => {
  const elements = [
    [
      new SimpleResponse({
        speech: `<speak>As the Keeper of IO Specific Knowledge, consider me your guide. I can help you plan for IO by telling you about when it's happening, or how to watch remotely. You can also browse topics. So, what do you want to know?</speak>`,
        text: `As the Keeper of I/O Specific Knowledge, consider me your guide. So, what do you want to know about I/O?`,
      }),
    ],
  ];
  if (prefixPrompts) {
    elements.unshift(prefixPrompts);
  }
  return {
    'screen/speaker': [
      {
        'elements': elements,
        'suggestions': {
          'required': [
            'When is it?',
            'How to watch remotely',
            'Browse topics',
            'Keynotes',
            'Where is it?',
          ],
          'randomized': [

          ],
        },
      },
    ],
  };
};

const menuRepeat = (prefixPrompts) => {
  const elementList = [
    [
      [
        new SimpleResponse({
          speech: `<speak>I can tell you more about IO. For example, you might like to know about the keynote, <break time="250ms"/>or codelabs. <break time="500ms"/>You can also browse topics.<break time="250ms"/> So, what do you want to know?</speak>`,
          text: `I can tell you more about I/O. What do you want to know?`,
        }),
      ],
    ],
    [
      [
        new SimpleResponse({
          speech: `<speak>I have all kinds of info on IO, <break time="250ms"/>from codelabs and sandboxes, <break time="250ms"/>to the keynotes and sessions. So, tell me what you want to know about.</speak>`,
          text: `I have all kinds of info on I/O, so, tell me what you want to know.`,
        }),
      ],
    ],
    [
      [
        new SimpleResponse({
          speech: `<speak>All of my expertise, as keeper of IO specific knowledge <break time="200ms"/> is at your disposal. You can browse topics, <break time="250ms"/>manage your schedule, <break time="250ms"/>or ask about the food, swag, or after parties.  So, what's your query?</speak>`,
          text: `All of my expertise as keeper of I/O-specific knowledge is at your disposal. So, what's your query?`,
        }),
      ],
    ],
    [
      [
        new SimpleResponse({
          speech: `<speak>I've got more info about IO. You might be interested in where it's happening or how you can watch remotely. You can also browse topics. So, what are you interested in?</speak>`,
          text: `I've got more info about I/O. What are you interested in?`,
        }),
      ],
    ],
  ];
  if (prefixPrompts) {
    elementList.forEach((element) =>
      element.unshift(prefixPrompts));
  }
  return {
    'screen/speaker': [
      {
        'elements': elementList[0],
        'suggestions': {
          'required': [
            'Keynotes',
            'What are codelabs?',
            'Browse topics',
          ],
          'randomized': [
            'Find office hours',
          ],
        },
      },
      {
        'elements': elementList[1],
        'suggestions': {
          'required': [
            'Codelabs and sandboxes',
            'Keynotes',
            'Browse sessions',
          ],
        },
      },
      {
        'elements': elementList[2],
        'suggestions': {
          'required': [
            'Browse topics',
            'Manage my schedule',
            'Will there be food?',
            'Is there swag?',
            `When's the after party?`,
          ],
        },
      },
      {
        'elements': elementList[3],
        'suggestions': {
          'required': [
            'Where is it?',
            'How can I watch remotely?',
            'Browse topics',
          ],
          'randomized': [
            'Find office hours',
            'Keynotes',
          ],
        },
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
          speech: `Now, you can browse topics, manage your schedule, or ask me anything else you want to know about IO.`,
          text: `Now, you can ask me anything else you want to know about I/O.`,
        }),
      ],
    ],
    'suggestions': {
      'required': [
        'Browse topics',
        'Manage my schedule',
      ],
      'randomized': [
        'Where is it?', 'How can I watch remotely?', 'Keynotes', `Find office hours`,
        'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
      ],
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
        'Browse topics',
      ],
      'randomized': [
        'Where is it?', 'How can I watch remotely?', `Find office hours`,
        'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
      ],
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
  'things-to-do-menu': {
    'firstTime/repeat': menuRepeat(),
  },
  'relax-menu': {
    'firstTime/repeat': menuRepeat(),
  },
  'date': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>This year’s developer festival will be held May <say-as interpret-as="ordinal">8</say-as> through <say-as interpret-as="ordinal">10</say-as> at the Shoreline Amphitheatre. That's in, Mountain View, California, <break time="250ms"/> next to Google's main campus.<break time="750ms"/></speak>`,
        text: `This year's developer festival will be held May 8-10 at the Shoreline Amphitheatre in Mountain View, CA`,
      }),
    ]),
  },
  'keynote': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>There're actually two keynotes this year. CEO Sundar Pichai will kick things off on May 8th at 10AM PST. <prosody rate="110%">If you're attending, the best seats will be assigned on a first-come, first-served basis, during badge pickup.</prosody> So, plan to arrive early. <break time="750ms"/>If you're not attending, get the best view by watching the livestream. The Developer Keynote, hosted by Jason Titus, starts at 12:45PM PST.<break time="750ms"/></speak>`,
        text: `There're actually two keynotes this year. CEO Sundar Pichai will kick things off on May 8th at 10AM PST. If you're attending, the best seats will be assigned on a first-come, first-served basis during badge pickup. So, plan to arrive early. If you're not attending, get the best view by watching the livestream. The Developer Keynote, hosted by Jason Titus, starts at 12:45PM PST.`,
      }),
    ]),
  },
  'codelabs': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Codelabs and Sandboxes are all about hands-on inspiration.<break time="750ms"/> Come to the Codelabs to try out short coding experiences, with Googlers as your guide.<break time="750ms"/> Swing by the Sandboxes to chat with Googlers as they demo the latest interactive experiences built on the Google developer platform.<break time="750ms"/></speak>`,
        text: `Codelabs and Sandboxes are all about hands-on inspiration. Come to the Codelabs to try out short coding experiences, with Googlers as your guide. Swing by the Sandboxes to chat with Googlers as they demo the latest interactive experiences built on the Google developer platform.`,
      }),
    ]),
  },
  'app-review': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Attendees will be able to improve their projects by getting advice and on-the-spot reviews from Googlers during office hours and app reviews. You can choose between App Consultations and Design Reviews.<break time="750ms"/></speak>`,
        text: `Attendees will be able to improve their projects by getting advice and on-the-spot reviews from Googlers during app reviews. You can choose between App Consultations and Design Reviews.`,
      }),
    ]),
  },
  'food': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Attendees can enjoy complimentary breakfast, lunch, and snacks during the conference. They can also grab dinner during the after parties.<break time="750ms"/></speak>`,
        text: `Attendees can enjoy complimentary breakfast, lunch, and snacks during the conference. They can also grab dinner during the after parties.`,
      }),
    ]),
  },
  'swag': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>I can neither confirm nor deny the rumors of swag. You'll have to come and see for yourself. <break time="750ms"/></speak>`,
        text: `I can neither confirm nor deny the rumors of swag. You'll have to come and see for yourself.`,
      }),
    ]),
  },
  'after-party': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Attendees are invited to enjoy music, games, and more during the evening of May 8, and to an exclusive concert in the Amphitheatre on May 9. Food and drinks will be served on both nights, with alcoholic beverages available for those 21 and over.<break time="750ms"/></speak>`,
        text: `Attendees are invited to enjoy music, games, and more during the evening of May 8, and to an exclusive concert in the Amphitheatre on May 9. Food and drinks will be served on both nights, with alcoholic beverages available for those 21 and over.`,
      }),
    ]),
  },
  'watch-remotely': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>The keynotes and sessions will be livestreamed. And the recordings will be uploaded to the Google Developers YouTube channel. You can also attend or host an extended viewing party. Find out more at events.google.com/IO.<break time="750ms"/></speak>`,
        text: `Watch the keynotes and sessions via livestream or on the Google Developers YouTube channel. You can also attend or host an extended viewing party. Find out more at events.google.com/IO.`,
      }),
    ]),
  },
  'announcements': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>So you want to know what will be announced? Yeah, I can't really answer that. Just guess!<break time="750ms"/></speak>`,
        text: `So you want to know what will be announced? Yeah, I can't really answer that. Just guess!`,
      }),
      new SimpleResponse({
        speech: `<speak>You wanna know about the juicy stuff happening this year? Well, I guess you’ll just have to wait and find out at the event.<break time="750ms"/></speak>`,
        text: `You wanna know about the juicy stuff happening this year? Well, I guess you'll just have to wait and find out at the event.`,
      }),
    ]),
  },
  'lost-and-found': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>The lost and found station will be located at the Conference Help Desk during event hours. Any items left overnight will be turned over to the Conference Security Office. One important detail: Google IO badges aren’t replaceable, so don't lose yours, or you won’t be readmitted to the conference! <break time="750ms"/></speak>`,
        text: `The lost & found station will be located at the Conference Help Desk during event hours. Any items left overnight will be turned over to the Conference Security Office. One important detail: Google I/O badges aren’t replaceable, so don't lose yours, or you won’t be readmitted to the conference!`,
      }),
    ]),
  },
  'what-to-wear': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>Google IO is an outdoor developer event, so I recommend something casual and comfortable. The Bay Area can be hot during the day and chilly in the evenings, so it's best to wear layers.<break time="750ms"/></speak>`,
        text: `Google I/O is an outdoor developer event, so I recommend something casual and comfortable. The Bay Area can be hot during the day and chilly in the evenings, so it's best to wear layers.`,
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
        speech: `<speak>This year’s developer festival will be held May <say-as interpret-as="ordinal">8</say-as> through <say-as interpret-as="ordinal">10</say-as> at the Shoreline Amphitheatre. Once the event starts, I can provide you with directions to help navigate you throughout the event.</speak>`,
        text: `This year's developer festival will be held May 8-10 at the Shoreline Amphitheatre in Mountain View, CA. Once the event starts, I can provide you with directions to help navigate you throughout the event.`,
      }),
    ]),
  },
  'scavenger-hunt': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>There are rumors of a Scavenger hunt this year at I/O! I guess we'll have to wait and see.</speak>`,
        text: `There are rumors of a Scavenger hunt this year at I/O! I guess we'll have to wait and see.`,
      }),
    ]),
  },
  'concert': {
    'firstTime': menuFirstTime([
      `There will be a concert Wednesday night! You will have to wait till the event to see who's playing.`,
    ]),
    'repeat': menuRepeat([
      `There will be a concert Wednesday night! You will have to wait till the event to see who's playing.`,
    ]),
  },
  'popular-justice-songs': {
    'firstTime': menuFirstTime([
      `There will be a concert Wednesday night! You will have to wait till the event to see who's playing.`,
    ]),
    'repeat': menuRepeat([
      `There will be a concert Wednesday night! You will have to wait till the event to see who's playing.`,
    ]),
  },
  'popular-phantogram-songs': {
    'firstTime': menuFirstTime([
      `There will be a concert Wednesday night! You will have to wait till the event to see who's playing.`,
    ]),
    'repeat': menuRepeat([
      `There will be a concert Wednesday night! You will have to wait till the event to see who's playing.`,
    ]),
  },
};
