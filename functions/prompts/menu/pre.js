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

const sanitizeSsml = (str) => str.replace('&', 'and').replace('AR', 'A R');

module.exports = {
  'browse-topics': browseTopics,
  'browse-topics-next': browseTopicsNext,
};
