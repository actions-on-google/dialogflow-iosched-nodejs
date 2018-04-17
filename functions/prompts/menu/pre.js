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

/* eslint-disable max-len*/
const browseTopics = (items=[], spokenIntro) => {
  spokenIntro = spokenIntro || {
    speech: `Here's a taste of what's coming at I O. They've got`,
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
    ' and <break time="300ms"/>' + spokenNames[spokenNames.length-1];

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
                  speech: `<speak>${spokenIntro.speech} ${speakerItems}. Which of those sound good?</speak>`,
                  text: `${spokenIntro.speech} ${speakerItems}. Which of those sound good?`,
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

const browseSessionsFirstSet = (topic, totalItems) => {
  const spokenIntro = {
    speech: `There's ${totalItems} sessions on ${topic}. Here's the first two.`,
    text: `There's ${totalItems} sessions on ${topic}. Here's the first two.`,
  };
  const displayIntro = (items) =>
    (`There's ${totalItems} sessions on ${topic}. `) +
    (items.length !== totalItems ? `Here are ${items.length}. ` : '') +
    (`Which most interests you?`);
  const spokenNames =
    (items) => items.map((session) => sanitizeSsml(session.title));
  const speakerItems = `One's called <break time="250ms"/>${spokenNames[0]}.<break time="750ms"/> The other's called <break time="250ms"/>${spokenNames[1]}`;
  return (items) => browseSessions(items, topic, spokenIntro,
    displayIntro, speakerItems);
};

const browseSessionsNext = (topic='that topic') => {
  const spokenIntro = {
    speech: `There's also`,
    text: `There's also`,
  };
  const displayIntro = () => `There's also these options.`;
  const spokenNames =
    (items) => items.map((session) => sanitizeSsml(session.title));
  const speakerItems = `<break time="250ms"/>${spokenNames[0]}<break time="500ms"/>, and <break time="100ms"/>${spokenNames[1]}<break time="1s"/>`;
  return (items) => browseSessions(items, topic, spokenIntro,
    displayIntro, speakerItems);
};

const browseSessionsRepeat = (topic='that topic') => {
  const spokenIntro = {
    speech: `Again, those are`,
    text: `Again, those are`,
  };
  const displayIntro = (items) => `Here are the options again.`;
  const spokenNames =
    (items) => items.map((session) => sanitizeSsml(session.title));
  const speakerItems = `<break time="250ms"/>${spokenNames[0]}<break time="500ms"/>, and <break time="100ms"/>${spokenNames[1]}<break time="1s"/>`;
  return (items) => browseSessions(items, topic, spokenIntro,
    displayIntro, speakerItems);
};

const browseSessions = (items=[], topic='that topic',
  spokenIntro, displayIntro, speakerItems) => {
  topic = sanitizeSsml(topic);
  const screenItems = items.reduce((itemsObj, session) => {
    itemsObj[session.id] = {
      title: session.title,
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
                  speech: `The last session on ${topic} is called ${sanitizeSsml(items[0].title)}. Do you want to hear more about it?`,
                  text: `The last session on ${topic} is called ${sanitizeSsml(items[0].title)}. Do you want to hear more about it?`,
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
                  title: `Sessions on ${topic}`,
                  items: screenItems,
                }),
              ],
            ],
            'suggestions': {
              'required': [
                'What else?',
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
            elements: [
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
            elements: [
              [
                new SimpleResponse({
                  speech: `That was all the sessions. So, let me know if you want to hear them again, or do something else?`,
                  text: `That was all the sessions. So, let me know if you want to hear them again, or do something else?`,
                }),
              ],
            ],
          },
        ],
      },
    },
  };
};

const sanitizeSsml = (str) => str.replace('&', 'and').replace('AR', 'A R');

module.exports = {
  'browse-topics': browseTopics,
  'browse-topics-next': browseTopicsNext,
  'browse-sessions-first-set': browseSessionsFirstSet,
  'browse-sessions-next': browseSessionsNext,
  'browse-sessions-repeat': browseSessionsRepeat,
};
