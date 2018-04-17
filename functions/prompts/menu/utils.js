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

// const Handler = require('./handler');
const {
  parse,
  fallback,
} = require('../common/utils');

const DEFAULT_SCREEN_MAX = 30;
const DEFAULT_AUDIO_MAX = 6;

/**
 * Based on the parameters, displays a browsing prompt to the user.
 *
 * @param {Object} options
 * @param {Object} options.conv Client library conversation object.
 * @param {Promise} options.itemsPromise Promise which resolves with array of
 *     items.
 * @param {Function} options.prompts Function which returns the prompts object.
 * @param {boolean} options.maxScreen Max items to show on screen.
 * @param {boolean} options.maxAudio Max items to say on speaker.
 * @return {Promise} Promise which resolves with the parsed response.
 */
const browse = ({conv, itemsPromise, prompts,
  maxScreen=DEFAULT_SCREEN_MAX, maxAudio=DEFAULT_AUDIO_MAX}) => {
    return itemsPromise.then((items) => {
      if (!items || items.length === 0) {
        return parse(conv, prompts().emptyOptions);
      };
      // Shuffle items and split into current and next set to present.
      items.sort(() => Math.random() - 0.5);
      const hasScreen = conv.surface.capabilities
        .has('actions.capability.SCREEN_OUTPUT');
      const currentItems = items.slice(0, hasScreen ? maxScreen : maxAudio);
      const nextItems = items.slice(hasScreen ? maxScreen : maxAudio);
      conv.data.currentItems = currentItems;
      conv.data.nextItems = nextItems;
      return parse(conv, prompts(currentItems).presentItems);
    }).catch((error) => {
      console.error(`Error with browsing prompt: ${error}`);
      return parse(conv, prompts().error);
    });
};

const browseTopics = (conv) => {
  console.log('Browsing for topics');
  const prompts = require('./'+conv.phase+'.js')['browse-topics'];
  return browse({
    conv,
    itemsPromise: conv.conference.topics(),
    prompts,
  });
};

const browseTopicsNext = (conv) => {
  console.log('Browsing next set of topics');
  const prompts = require('./'+conv.phase+'.js')['browse-topics-next'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    prompts,
  });
};

const browseTopicsRepeat = (conv) => {
  console.log('Repeating previously browsed topics');
  const prompts = require('./'+conv.phase+'.js')['browse-topics'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    prompts,
  });
};

const browseTopicsOption = (conv) => {
  if (conv.arguments.get('OPTION')) {
    const tagID = conv.arguments.get('OPTION');
    return conv.conference.tag(tagID).then((tag) => browseSessions(conv, tag));
  } else {
    fallback(conv);
  }
};

const browseSessionsByTopic = (conv, {topic}) => {
  if (topic) {
    return conv.conference.tagByName(topic)
      .then((tag) => browseSessions(conv, tag));
  } else {
    fallback(conv);
  }
};

const browseSessions = (conv, tag) => {
  console.log(`Browsing for sessions with tag: ${tag.tag}`);
  const prompts = require('./'+conv.phase+'.js')['browse-sessions-first-set'];
  conv.data.sessionsTag = tag.name;
  return conv.conference.sessions(tag.tag).then((sessions) => {
    return browse({
      conv,
      itemsPromise: Promise.resolve(sessions),
      prompts: prompts(tag.name, sessions.length),
    });
  });
};

const browseSessionsNext = (conv) => {
  console.log(`Browsing next set of sessions`);
  const prompts = require('./'+conv.phase+'.js')['browse-sessions-next'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    prompts: prompts(conv.data.sessionsTag),
  });
};

const browseSessionsRepeat = (conv) => {
  console.log('Repeating previously browsed sessions');
  const prompts = require('./'+conv.phase+'.js')['browse-sessions-repeat'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    prompts: prompts(conv.data.sessionsTag),
  });
};

const showSession = (conv, {sessionId, ordinalChoice}) => {
  const prompts = require('./'+conv.phase+'.js')['show-session'];
  if (sessionId) {
    // User spoke session name directly
  } else if (conv.arguments.get('OPTION')) {
    // User tapped on session list
    sessionId = conv.arguments.get('OPTION');
  } else if (ordinalChoice && ordinalChoice === 'second' &&
    conv.data.currentOptions && conv.data.currentOptions[1]) {
      // User said e.g. 'the second one'
      sessionId = conv.data.currentOptions[1].id;
  } else if (conv.data.currentOptions && conv.data.currentOptions[0]) {
    // User said e.g. 'the first one' or 'yes'
    sessionId = conv.data.currentOptions[0].id;
  }
  console.log(`Showing session with ID: ${sessionId}`);
  return conv.conference.session(sessionId).then((session) => {
    if (session) {
      conv.data.sessionShown = session;
      return parse(conv, prompts(session)['presentSession']);
    } else {
      return parse(conv, prompts().error);
    }
  }).catch((error) => {
    console.error(`Error showing session: ${error}`);
    return parse(conv, prompts().error);
  });
};

const showSessionRepeat = (conv) => {
  console.log('Repeating previously shown session');
  const prompts = require('./'+conv.phase+'.js')['show-session-repeat'];
  if (conv.data.sessionShown) {
    return parse(conv, prompts(conv.data.sessionShown)['presentSession']);
  } else {
    console.error(`Error repeating session: ${error}`);
    return parse(conv, prompts().error);
  }
};

const intents = {
  'browse-topics': browseTopics,
  'browse-topics-next': browseTopicsNext,
  'browse-topics-repeat': browseTopicsRepeat,
  'browse-topics-OPTION': browseTopicsOption,
  'browse-sessions': browseSessionsByTopic,
  'browse-sessions-repeat': browseSessionsRepeat,
  'browse-sessions-next': browseSessionsNext,
  'show-session': showSession,
  'show-session-repeat': showSessionRepeat,
};

module.exports = (conv, ...args) => {
  return intents[conv.intent](conv, ...args);
};
