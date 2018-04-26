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
  BasicCard,
  Button,
} = require('actions-on-google');

const moment = require('moment-timezone');

const {sanitizeSsml} = require('../common/utils');

/* eslint-disable max-len*/
const browseTopics = (items=[], spokenIntro) => {
  spokenIntro = spokenIntro || {
    speech: `Here's a taste of what's coming at I O. <break time="500ms"/><emphasis level="moderate">They've got</emphasis><break time="500ms"/>`,
    text: `Here's a taste of what's coming at I/O. They've got`,
  };
  const screenItems = items.reduce((itemsObj, topic) => {
    itemsObj[topic.tag] = {
      title: topic.name,
    };
    return itemsObj;
  }, {});
  const spokenNames = items.map((topic) => sanitizeSsml(topic.name));
  const speakerItems = spokenNames.slice(0, spokenNames.length - 1)
    .join(', <break time="300ms"/>') +
    '<break time="300ms"/> and ' + spokenNames[spokenNames.length-1];

  return {
    'presentItems': {
      'firstTime/repeat': {
        'screen': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `There're talks on ${Object.keys(screenItems).length} different topics. Which most interests you?`,
                  text: `Which topic are you interested in?`,
                }),
              ],
              [
                new List({
                  title: 'Topics',
                  items: screenItems,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'None of those',
                'Do something else',
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
              ],
            },
            'fallback': [
              {
                'elements': [`Sorry, which topic was that?`],
              },
              {
                'elements': [`I'm still not sure, so go ahead and pick a topic from the list.`],
              },
            ],
          },
        ],
        'speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `<speak>${spokenIntro.speech} ${speakerItems}. Do any of those sound good?</speak>`,
                  text: `${spokenIntro.text} ${speakerItems}. Do any of those interest you?`,
                }),
              ],
            ],
            'noInput': [
              `Which topic do you want?`,
              `Which topic do you want to hear more about?`,
            ],
            'fallback': [
              {
                'elements': [`Sorry, which topic?`],
              },
              {
                'elements': [`Sorry, which topic was that?`],
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
                  speech: `Well that's a 500 error. I can't access the sessions right now, so is there something else I can help you with?`,
                  text: `Well that's a 500 error. I can't access the sessions right now, so is there something else I can help you with?`,
                }),
              ],
            ],
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
                  speech: `That was all the topics. So, let me know if you want to hear them again, or do something else?`,
                  text: `That was all the topics. So, let me know if you want to hear them again, or do something else?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'Do something else',
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
              ],
            },
          },
        ],
      },
    },
  };
};

const browseTopicsNext = (items) => {
  const spokenIntro = {
    speech: `Other topics include`,
    text: `Other topics include`,
  };
  return browseTopics(items, spokenIntro);
};

const browseSessionsFirstSet = (topic, totalItems, sessionType) => {
  const spokenIntro = {
    speech: `There's ${totalItems} ${sessionType} on ${topic}. Here's the first two.`,
    text: `There's ${totalItems} ${sessionType} on ${topic}. Here's the first two.`,
  };
  const displayIntro = (items=[]) =>
    new SimpleResponse({
      speech: `There's ${totalItems} ${sessionType} on ${sanitizeSsml(topic)}. ` + (items.length !== totalItems ? `Here are ${items.length}. ` : '') + `Which most interests you?`,
      text: `There's ${totalItems} ${sessionType} on ${topic}. ` + (items.length !== totalItems ? `Here are ${items.length}. ` : '') + `Which most interests you?`,
    });
  const itemsToSpeech = (items=[]) => {
    const spokenNames = items.map((session) => sanitizeSsml(session.title));
    return `One's called <break time="250ms"/>${spokenNames[0]}.<break time="750ms"/> The other's called <break time="250ms"/>${spokenNames[1]}`;
  };
  return (items) => browseSessions(items, topic, spokenIntro,
    displayIntro, itemsToSpeech(items), sessionType, totalItems === 1 ? 'only' : 'last');
};

const browseSessionsNext = (topic='that topic', sessionType) => {
  const spokenIntro = {
    speech: `There's also`,
    text: `There's also`,
  };
  const displayIntro = () => `There's also these options.`;
  const itemsToSpeech = (items=[]) => {
    const spokenNames = items.map((session) => sanitizeSsml(session.title));
    return `<break time="250ms"/>${spokenNames[0]}<break time="500ms"/>, and <break time="100ms"/>${spokenNames[1]}<break time="1s"/>`;
  };
  return (items) => browseSessions(items, topic, spokenIntro,
    displayIntro, itemsToSpeech(items), sessionType);
};

const browseSessionsRepeat = (topic='that topic', sessionType) => {
  const spokenIntro = {
    speech: `Again, those are`,
    text: `Again, those are`,
  };
  const displayIntro = () => `Here are the options again.`;
  const itemsToSpeech = (items=[]) => {
    const spokenNames = items.map((session) => sanitizeSsml(session.title));
    return `<break time="250ms"/>${spokenNames[0]}<break time="500ms"/>, and <break time="100ms"/>${spokenNames[1]}<break time="1s"/>`;
  };
  return (items) => browseSessions(items, topic, spokenIntro,
    displayIntro, itemsToSpeech(items), sessionType);
};

const browseSessions = (items=[], topic='that topic',
  spokenIntro, displayIntro, speakerItems, sessionType='sessions', lastItemPrefix='last') => {
  spokenIntro = spokenIntro || {
    speech: `Here are some sessions`,
    text: `Here are some sessions`,
  };
  displayIntro = displayIntro || (() => `Here are some sessions`);
  const screenItems = items.reduce((itemsObj, session) => {
    itemsObj[session.id] = {
      title: session.title,
      description: `${moment(session.startTimestamp).tz('America/Los_Angeles').format('ddd MMM D h:mmA')} / ${session.roomName}`,
    };
    return itemsObj;
  }, {});
  const sessionTypeSingular = sessionType.slice(0, -1);
  return {
    'presentItems': items.length === 1 ? {
      'firstTime/repeat': {
        'screen/speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `The ${lastItemPrefix} ${sessionTypeSingular} on ${sanitizeSsml(topic)} is called ${sanitizeSsml(items[0].title)}. Do you want to hear more about it?`,
                  text: `The ${lastItemPrefix} ${sessionTypeSingular} on ${topic} is called ${sanitizeSsml(items[0].title)}. Do you want to hear more about it?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'Sure',
                'Do something else',
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
              ],
            },
            'noInput': [
              `Do you want to hear more?`,
              `Do you want to hear more about that ${sessionTypeSingular}?`,
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
                  title: `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} on ${topic}`,
                  items: screenItems,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'None of those',
                'Do something else',
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
              ],
            },
            'fallback': [
              {
                'elements': [`Sorry, which ${sessionTypeSingular} was that?`],
              },
              {
                'elements': [`I'm still not sure, so go ahead and pick a ${sessionTypeSingular} from the list.`],
              },
            ],
          },
        ],
        'speaker': [
          {
            'elements': [
              [
                `<speak>${sanitizeSsml(spokenIntro.speech)} ${speakerItems}. Which of those interests you?</speak>`,
              ],
            ],
            'noInput': [
              `Which of the ${sessionType} interests you?`,
              `I can tell you more about the ${sessionTypeSingular}, the second one, or neither one.`,
            ],
            'fallback': [
              {
                'elements': [`Sorry, was that the first or second ${sessionTypeSingular}? Or neither?`],
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
                  speech: `Well that's a 500 error. I can't access the ${sessionType} right now, so is there something else I can help you with?`,
                  text: `Well that's a 500 error. I can't access the ${sessionType} right now, so is there something else I can help you with?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
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
                  speech: `That was all the ${sessionType} on ${sanitizeSsml(topic)}. So, let me know if you want to hear them again, or do something else?`,
                  text: `That was all the ${sessionType} on ${topic}. So, let me know if you want to hear them again, or do something else?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'Other topics',
                'Do something else',
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
              ],
            },
          },
        ],
      },
    },
  };
};

const showSession = ({session, prefixes, postfixes, buttonText,
  pivotSuggestion}) => {
  // Note: Prefixes must be SimpleResponses which use SSML
  if (!session) {
    session = {
      title: '',
    };
  }
  session.description = session.description || `Hmm, I can't find the description for that.`,
  prefixes = prefixes || [
    new SimpleResponse({
      speech: `<speak>That one sounds really cool. Here's more about it.<break time="250ms"/></speak>`,
      text: `That one sounds really cool. Here's more about it.`,
    }),
    new SimpleResponse({
      speech: `<speak>Nice. Here's the description.<break time="250ms"/></speak>`,
      text: `Nice. Here's the description.`,
    }),
    new SimpleResponse({
      speech: `<speak>Alright. Here's more info about it.<break time="250ms"/></speak>`,
      text: `Alright. Here's more info about it.`,
    }),
    new SimpleResponse({
      speech: `<speak>Here's the description.<break time="250ms"/></speak>`,
      text: `Here's the description.`,
    }),
    new SimpleResponse({
      speech: `<speak>Sure. Here's more about it.<break time="250ms"/></speak>`,
      text: `Sure. Here's more about it.`,
    }),
    new SimpleResponse({
      speech: `<speak>Here's a more detailed description.<break time="250ms"/></speak>`,
      text: `Here's a more detailed description.`,
    }),
  ];
  postfixes = postfixes || {
    'screen': [
      new SimpleResponse({
        speech: `<speak>Now, do you want to choose another topic, <break time="250ms"/>or do something else?</speak>`,
        text: `Now, do you want to choose another topic, or do something else?`,
      }),
    ],
    'speaker': [
      new SimpleResponse({
        speech: `<speak>Now, do you want to repeat that, <break time="250ms"/>choose another topic, <break time="250ms"/>or do something else?</speak>`,
        text: `Now, do you want to repeat that, choose another topic, or do something else?`,
      }),
    ],
  };
  return {
    'presentSession': {
      'firstTime/repeat': {
        'screen': [
          {
            'elements': [
              prefixes,
              [
                new BasicCard({
                  title: session.title,
                  subtitle: `${moment(session.startTimestamp).tz('America/Los_Angeles').format('ddd MMM D h:mmA')} / ${session.roomName}`,
                  text: session.description,
                  buttons: [
                    new Button({
                      title: buttonText || 'Add to my schedule',
                      url: `https://events.google.com/io/schedule/?sid=${session.id}`,
                    }),
                  ],
                }),
              ],
              postfixes.screen,
            ],
            'suggestions': {
              'required': [
                pivotSuggestion || 'Other topics',
                'Do something else',
              ],
              'randomized': [
                'How can I watch remotely?',
                'Keynotes',
                'Will there be food?',
                'Is there swag?',
                `When's the after party?`,
                'Codelabs and sandboxes',
              ],
            },
            'noInput': [
              `I can repeat that, or tell you about other sessions.`,
              `Do you want me to repeat that, or tell you about other sessions?`,
            ],
            'fallback': [
              {
                'elements': [`Sorry, did you want to repeat that, or hear other sessions?`],
              },
              {
                'elements': [`I'm still not sure. Do you want me to repeat that, or tell you about other sessions?`],
              },
            ],
          },
        ],
        'speaker': [
          {
            'elements': [
              prefixes.map((prefix) => {
                return prefix.textToSpeech
                  .replace('</speak>', `${session.description}</speak>`);
              }),
              postfixes.speaker,
            ],
            'noInput': [
              `I can repeat that, or tell you about other sessions.`,
              `Do you want me to repeat that, or tell you about other sessions?`,
            ],
            'fallback': [
              {
                'elements': [`Sorry, did you want to repeat that, or hear other sessions?`],
              },
              {
                'elements': [`I'm still not sure. Do you want me to repeat that, or tell you about other sessions?`],
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
            elements: [
              [
                new SimpleResponse({
                  speech: `Well that's a 500 error. I can't access that session right now, so is there something else I can help you with?`,
                  text: `Well that's a 500 error. I can't access that session right now, so is there something else I can help you with?`,
                }),
              ],
            ],
          },
        ],
      },
    },
  };
};

const showSessionRepeat = ({session}) => {
  const prefixes = [
    new SimpleResponse({
      speech: `<speak>Here's that description again.<break time="250ms"/></speak>`,
      text: `Here's that description again.`,
    }),
  ];
  const postfixes = {
    'screen': [
      new SimpleResponse({
        speech: `I can repeat that again, or tell you about other topics.`,
        text: `I can repeat that again, or tell you about other topics.`,
      }),
    ],
    'speaker': [
      new SimpleResponse({
        speech: `I can repeat that again, or tell you about other topics.`,
        text: `I can repeat that again, or tell you about other topics.`,
      }),
    ],
  };
  return showSession({session, prefixes, postfixes});
};

const showScheduleSession = ({session}) => {
  const postfixes = {
    'screen': [
      new SimpleResponse({
        speech: `<speak>Now, do you want to go back to your schedule, <break time="250ms"/>or do something else?</speak>`,
        text: `Now, do you want to go back to your schedule, or do something else?`,
      }),
    ],
    'speaker': [
      new SimpleResponse({
        speech: `<speak>Now, do you want to repeat that, <break time="250ms"/>go back to your schedule, <break time="250ms"/>or do something else?</speak>`,
        text: `Now, do you want to repeat that, go back to your schedule, or do something else?`,
      }),
    ],
  };
  const buttonText = 'Manage in my schedule';
  const pivotSuggestion = 'Back to my schedule';
  return showSession({session, postfixes, buttonText, pivotSuggestion});
};

const askSessionType = () => {
  return {
    'askSessionType': {
      'firstTime/repeat': {
        'screen/speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: `<speak>Now, I can help you browse for sessions, or office hours. Which would you like?</speak>`,
                  text: `Now, I can help you browse for sessions, or office hours. Which would you like?`,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'Browse sessions',
                'Office hours',
              ],
            },
            'fallback': [
              {
                'elements': [`Sorry, did you want me to help you find sessions, or office hours on this topic?`],
              },
              {
                'elements': [`I'm still not sure. Do did you want me to help you find sessions, or office hours on this topic?`],
              },
            ],
          },
        ],
      },
    },
  };
};

module.exports = {
  'browse-topics': browseTopics,
  'browse-topics-next': browseTopicsNext,
  'browse-sessions-first-set': browseSessionsFirstSet,
  'browse-sessions-next': browseSessionsNext,
  'browse-sessions-repeat': browseSessionsRepeat,
  'show-session': showSession,
  'show-schedule-session': showScheduleSession,
  'show-session-repeat': showSessionRepeat,
  'ask-type': askSessionType,
};
