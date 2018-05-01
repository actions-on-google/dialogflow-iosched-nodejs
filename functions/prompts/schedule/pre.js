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
  List,
} = require('actions-on-google');
const moment = require('moment-timezone');

const {sanitizeSsml} = require('../common/utils');

/* eslint-disable max-len*/
const sanitizedTitleWithStatus = (items=[]) => {
  return items.map((session) => {
    sanitizeSsml(session.title);
    let sessionString = session.title + `<break time="450ms"/>`;
    if (session.isStarred && session.reservationstatus === 'RESERVED') {
      sessionString += ` You've starred and reserved it`;
    } else if (session.isStarred && session.reservationstatus === 'WAITLISTED') {
      sessionString += ` You've starred it, and you're waitlisted for a reservation`;
    } else if (session.reservationstatus === 'RESERVED') {
      sessionString += ` You reserved a seat for it`;
    } else if (session.reservationstatus === 'WAITLISTED') {
      sessionString += ` You're waitlisted for a reservation`;
    } else if (session.isStarred) {
      sessionString += ` You've starred that one`;
    }
    return sessionString;
  });
};

const showScheduleFirstSet = (totalItems) => {
  const spokenIntro = {
    speech: `There's ${totalItems} sessions on your schedule. Here's the first two.`,
    text: `There's ${totalItems} sessions on your schedule. Here's the first two.`,
  };
  const displayIntro = (items=[]) =>
    (`There's ${totalItems} sessions on your schedule. `) +
    (items.length !== totalItems ? `Here are ${items.length}. ` : '') +
    (`Which most interests you?`);
  const speakerItems = (items=[]) => {
    const spokenNames = sanitizedTitleWithStatus(items);
    return `One's called <break time="250ms"/>${spokenNames[0]}.<break time="750ms"/> The other's called <break time="250ms"/>${spokenNames[1]}`;
  };
  return (items) => showSchedule(items, spokenIntro, displayIntro,
    speakerItems(items), totalItems === 1 ? 'only' : 'last');
};

const showScheduleNext = () => {
  const spokenIntro = {
    speech: `There's also`,
    text: `There's also`,
  };
  const displayIntro = () => `There's also these sessions.`;
  const speakerItems = (items=[]) => {
    const spokenNames = sanitizedTitleWithStatus(items);
    return `<break time="250ms"/>${spokenNames[0]}.<break time="500ms"/> and <break time="100ms"/>${spokenNames[1]}<break time="1s"/>`;
  };
  return (items) => showSchedule(items, spokenIntro, displayIntro,
    speakerItems(items));
};

const showScheduleRepeat = () => {
  const spokenIntro = {
    speech: `Again, those are`,
    text: `Again, those are`,
  };
  const displayIntro = () => `Here's your schedule again.`;
  const speakerItems = (items=[]) => {
    const spokenNames = sanitizedTitleWithStatus(items);
    return `<break time="250ms"/>${spokenNames[0]}.<break time="500ms"/> and <break time="100ms"/>${spokenNames[1]}<break time="1s"/>`;
  };
  return (items) => showSchedule(items, spokenIntro, displayIntro,
    speakerItems(items));
};

const showSchedule = (items=[], spokenIntro, displayIntro, speakerItems, lastItemPrefix='last') => {
  spokenIntro = spokenIntro || {
    speech: `Here's your schedule`,
    text: `Here's your schedule`,
  };
  displayIntro = displayIntro || (() => `Here's your schedule`);
  const screenItems = items.reduce((itemsObj, session) => {
    itemsObj[session.id] = {
      title: (session.isStarred ? '★ ' : '') + session.title,
      description: `${(session.reservationStatus ? `${session.reservationStatus} ` : '')} ${moment(session.startTimestamp).tz('America/Los_Angeles').format('ddd MMM D h:mmA')} /  ${session.roomName}`,
    };
    return itemsObj;
  }, {});
  return {
    'presentItems': items.length === 1 ? {
      'firstTime/repeat': {
        'screen/speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `The ${lastItemPrefix} session on your schedule is called ${sanitizeSsml(items[0].title)}. Do you want to hear more about it?`,
                  text: `The ${lastItemPrefix} session on your schedule is called ${items[0].title}. Do you want to hear more about it?`,
                }),
              ],
            ],
            'noInput': [
              `Do you want to hear more?`,
              `Do you want to hear more about that session?`,
            ],
            'fallback': [
              {
                'elements': [`Sorry, did you want to hear more?`],
              },
              {
                'elements': [`I'm still not sure. Do you want to hear more?`],
              },
            ],
          },
        ],
      },
    } : {
      'firstTime/repeat': {
        'screen': [
          {
            'elements': [
              [
                displayIntro(items),
              ],
              [
                new List({
                  title: `Your Schedule`,
                  items: screenItems,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'None of those',
              ],
            },
            'fallback': [
              {
                'elements': [`Sorry, which session was that?`],
              },
              {
                'elements': [`I'm still not sure, so go ahead and pick a session from the list.`],
              },
            ],
          },
        ],
        'speaker': [
          {
            'elements': [
              [
                `<speak>${spokenIntro.speech} ${speakerItems}. Which of those interests you?</speak>`,
              ],
            ],
            'noInput': [
              `Which of the sessions interests you?`,
              `I can tell you more about the session, the second one, or neither one.`,
            ],
            'fallback': [
              {
                'elements': [`Sorry, was that the first or second session? Or neither?`],
              },
              {
                'elements': [`I'm getting a 4 0 4 error. Did you want the first one, the second one, or neither?`],
              },
            ],
          },
        ],
      },
    },
    'error': {
      'firstTime/repeat': {
        'screen/speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `Well that's a 500 error. I can't access your schedule right now, so is there something else I can help you with?`,
                  text: `Well that's a 500 error. I can't access your schedule right now, so is there something else I can help you with?`,
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
        ],
      },
    },
    'noMoreOptions': {
      'firstTime/repeat': {
        'screen/speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `It looks like that was your whole schedule. Would you like to browse some session topics?`,
                  text: `It looks like that was your whole schedule. Would you like to browse some session topics?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'Sure',
                'Not now',
              ],
              'randomized': [
                'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
                'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
              ],
            },
          },
        ],
      },
    },
    'emptyOptions': {
      'firstTime/repeat': {
        'screen/speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `It looks like your schedule is empty. Would you like to browse some session topics?`,
                  text: `It looks like your schedule is empty. Would you like to browse some session topics?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'Sure',
                'Not now',
              ],
              'randomized': [
                'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
                'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
              ],
            },
          },
        ],
      },
    },
  };
};

module.exports = {
  'show-schedule-first-set': showScheduleFirstSet,
  'show-schedule-next': showScheduleNext,
  'show-schedule-repeat': showScheduleRepeat,
  'show-schedule': showSchedule,
  'do-something-else': {
    'firstTime/repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `No problem. Is there something else I can help you with?`,
                text: `No problem. Is there something else I can help you with?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
      ],
    },
  },
  'sign-in-error': {
    'firstTime/repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `Well that's a 500 error. I can't access your account right now, so is there something else I can help you with?`,
                text: `Well that's a 500 error. I can't access your account right now, so is there something else I can help you with?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
      ],
    },
  },
  'sign-in-denied': {
    'firstTime/repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `No problem. Is there something else I can help you with?`,
                text: `No problem. Is there something else I can help you with?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
      ],
    },
  },
  'sign-in-user-not-found': {
    'firstTime/repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `<speak>Before I can do that, you'll need to download the IO 2018 app for Android or i OS and login with your Google Account. Then I'll be able to help with your schedule.<break time="1s"/>Is there something else I can help you with?</speak>`,
                text: `Before I can do that, you'll need to download the I/O 2018 app for Android or iOS and login with your Google Account. Then I'll be able to help with your schedule. Is there something else I can help you with?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
      ],
    },
  },
  'sign-in-user-on-speaker': {
    'firstTime/repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: `<speak>To do that, first you'll need to link IO 2018 to your Google Account. You can do that in the Google Home app. Or you can talk to me on your phone, and I'll help you through it. Then, if you haven't already, download the IO 2018 app for Android or I OS.<break time="1s"/> Is there something else I can help you with?</speak>`,
                text: `To do that, first you'll need to link I/O 2018 to your Google Account. You can do that in the Google Home app. Or you can talk to me on your phone, and I'll help you through it. Then, if you haven't already, download the I/O 2018 app for Android or iOS. Is there something else I can help you with?`,
              }),
            ],
          ],
          'suggestions': {
            'required': [
              'Search for talks',
            ],
            'randomized': [
              'Where is it?', 'How can I watch remotely?', 'Tell me about keynotes', `Find office hours`,
              'Will there be food?', 'Is there swag?', `When's the after party?`, 'Codelabs and sandboxes',
            ],
          },
        },
      ],
    },
  },
};
