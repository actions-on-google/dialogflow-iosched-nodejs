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
const welcomeReentry = (prefixPrompts) => [
  {
    'elements': [
      prefixPrompts,
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
        'Tell me about keynotes',
        'Tell me about sessions',
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
  },
  'date': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> This year’s developer festival will be held May <say-as interpret-as="ordinal">8</say-as> through <say-as interpret-as="ordinal">10</say-as> in California <break time="250ms"/> next to Google's main campus.<break time="750ms"/></speak>`,
        text: `This years developer festival will be held May 8-10 at the Shoreline Amphitheatre in Mountain View, CA`,
      }),
    ]),
  },
  'keynote': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak>There're actually two keynotes this year, <break time="250ms"/> since one keynote won't be enough to hold all the announcements Google's eager to share with developers. CEO Sundar Pichai will kick things off on May 8th at 10AM Pacific Standard Time. If you're attending, you'll be able to grab some lunch before the second keynote at 12:45PM. <break time="1s"/> Pro-Tip:<break time="500ms"/> <prosody rate="110%">The best seats will be assigned on a first-come, first-served basis, during badge pickup.</prosody> So, plan to arrive early. <break time="750ms"/>Of course, those of you watching via livestream will already have the best view.<break time="750ms"/></speak>`,
        text: `There're 2 keynotes this year. CEO Sundar Pichai will kick things off on May 8th at 10AM PST. The second keynote starts at 12:45PM. PRO-TIP: The best seats will be assigned on a first-come, first-served basis during badge pickup beginning at 7AM on May 7th, so plan to arrive early.`,
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
  'appReview': {
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
  'afterParty': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> These are two nights you don’t want to miss! Attendees are invited to enjoy music, games, and more during the evening of May 8, and to an exclusive concert in the Amphitheatre on May 9. Food and drinks will be served on both nights, with alcoholic beverages available for those 21 and over. Both After Hours events will be hosted at Shoreline Amphitheatre, and your attendee badge is required for entrance.<break time="750ms"/></speak>`,
        text: `These are two nights you don't want to miss! Attendees are invited to enjoy music, games, and more during the evening of May 8, and to an exclusive concert in the Amphitheatre on May 9. Food and drinks will be served on both nights, with alcoholic beverages available for those 21 and over. Both After Hours events will be hosted at Shoreline Amphitheatre, and your attendee badge is required for entrance.`,
      }),
    ]),
  },
  'watchRemotely': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> It'll be easy to stay plugged into what's happening at IO. All the keynotes and sessions will be livestreamed. And the recordings will be uploaded to the Google Developers YouTube channel. But if you're looking for something a little more social, you can attend or host an extended viewing party. Last year, developers all over the world created their own mini IO gatherings. 534 of them to be exact. Find out more at events.google.com/IO.<break time="750ms"/></speak>`,
        text: `It'll be easy to stay plugged into what's happening at I/O. All the keynotes and sessions will be livestreamed. And the recordings will be uploaded to the Google Developers YouTube channel. But if you're looking for something a little more social, you can attend or host an extended viewing party. Last year, developers all over the world created their own mini IO gatherings. 534 of them to be exact. Find out more at events.google.com/IO.`,
      }),
    ]),
  },
  'announcements': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> So you want to know what will be announced? Yeah, I can't really answer that. Just guess!<break time="750ms"/></speak>`,
        text: `So you want to know what will be announced? Yeah, I can't really answer that. Just guess!`,
      }),
      new SimpleResponse({
        speech: `<speak> You wanna know about the juicy stuff happening this year? Well, I guess you’ll just have to wait and find out at the event.<break time="750ms"/></speak>`,
        text: `You wanna know about the juicy stuff happening this year? Well, I guess you'll just have to wait and find out at the event.`,
      }),
    ]),
  },
  'lostAndFound': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> The lost and found station will be located at the Conference Help Desk during event hours. Any items left overnight will be turned over to the Conference Security Office. One important detail: Google IO badges aren’t replaceable, so don't lose yours, or you won’t be readmitted to the conference! <break time="750ms"/></speak>`,
        text: `The lost & found station will be located at the Conference Help Desk during event hours. Any items left overnight will be turned over to the Conference Security Office. One important detail: Google I/O badges aren’t replaceable, so don't lose yours, or you won’t be readmitted to the conference!`,
      }),
    ]),
  },
  'whatToWear': {
    'firstTime/repeat': welcomeReentry([
      new SimpleResponse({
        speech: `<speak> Google IO is an outdoor developer event, so I recommend something casual and comfortable. The Bay Area can be hot during the day and chilly in the evenings, so it's best to wear layers.<break time="750ms"/></speak>`,
        text: `Google I/O is an outdoor developer event, so I recommend something casual and comfortable. The Bay Area can be hot during the day and chilly in the evenings, so it's best to wear layers.`,
      }),
    ]),
  },
};
