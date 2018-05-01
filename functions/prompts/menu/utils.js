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
  parse,
  fallback,
  browse,
} = require('../common/utils');

const sortByName = (a, b) => a.name < b.name ? -1 : 1;
const randomSort = () => Math.random() - 0.5;
const sortByTimestamp = (a, b) => a.startTimestamp < b.startTimestamp ? -1 : 1;

const browseTopics = (conv, {sessionType}) => {
  console.log(`Browsing for topics`);
  conv.data.sessionType = sessionType;
  const prompts = require('./'+conv.phase+'.js')['browse-topics'];
  return browse({
    conv,
    itemsPromise: conv.conference.topics(),
    sort: conv.screen ? sortByName : randomSort,
    prompts,
  });
};

const browseTopicsNext = (conv) => {
  console.log('Browsing next set of topics');
  const prompts = require('./'+conv.phase+'.js')['browse-topics-next'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    sort: conv.screen ? sortByName : randomSort,
    prompts,
  });
};

const browseTopicsRepeat = (conv) => {
  console.log('Repeating previously browsed topics');
  const prompts = require('./'+conv.phase+'.js')['browse-topics'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    sort: conv.screen ? sortByName : randomSort,
    prompts,
  });
};

const browseTopicsOption = (conv) => {
  console.log('Browse Topics Option');
  if (conv.arguments.get('OPTION')) {
    const tagId = conv.arguments.get('OPTION');
    conv.data.tagId = tagId;
    if (conv.data.sessionType) {
      return checkSessionType(conv, {sessionType: conv.data.sessionType});
    } else {
      return askSessionType(conv);
    }
  } else {
    fallback(conv);
  }
};

const browseSessionsByTopic = (conv, {topic}) => {
  console.log('Browse Sessions by Topic');
  if (topic) {
    return conv.conference.tagByName(topic)
      .then((tag) => {
        conv.data.tagId = tag.tag;
        if (conv.data.sessionType) {
          return checkSessionType(conv, {sessionType: conv.data.sessionType});
        } else {
          return askSessionType(conv);
        }
      });
  } else {
    fallback(conv);
  }
};

const browseSessions = (conv) => {
  console.log(`Browsing for sessions`);
  return conv.conference.tag(conv.data.tagId).then((tag) => {
    const prompts = require('./'+conv.phase+'.js')['browse-sessions-first-set'];
    conv.data.sessionsTag = tag.name;
    return conv.conference.sessions(tag.tag, conv.data.sessionType)
      .then((sessions) => {
        return browse({
          conv,
          itemsPromise: Promise.resolve(sessions),
          prompts: prompts(tag.name, sessions.length, conv.data.sessionType),
          sort: sortByTimestamp,
          maxAudio: 2,
        });
    });
  });
};

const browseSessionsNext = (conv) => {
  console.log(`Browsing next set of sessions`);
  if (!conv.data.sessionType) {
    return fallback(conv);
  }
  const prompts = require('./'+conv.phase+'.js')['browse-sessions-next'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    prompts: prompts(conv.data.sessionsTag, conv.data.sessionType),
    sort: sortByTimestamp,
    maxAudio: 2,
  });
};

const browseSessionsRepeat = (conv) => {
  console.log('Repeating previously browsed sessions');
  if (!conv.data.sessionType) {
    return fallback(conv);
  }
  const prompts = require('./'+conv.phase+'.js')['browse-sessions-repeat'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    prompts: prompts(conv.data.sessionsTag, conv.data.sessionType),
    sort: sortByTimestamp,
    maxAudio: 2,
  });
};

const showSession = (conv, {sessionId, ordinalChoice}, prompts) => {
  prompts = prompts || require('./'+conv.phase+'.js')['show-session'];
  if (sessionId) {
    // User spoke session name directly
  } else if (conv.arguments.get('OPTION')) {
    // User tapped on session list
    sessionId = conv.arguments.get('OPTION');
  } else if (ordinalChoice && ordinalChoice === 'second' &&
    conv.data.currentItems && conv.data.currentItems[1]) {
      // User said e.g. 'the second one'
      sessionId = conv.data.currentItems[1].id;
  } else if (conv.data.currentItems && conv.data.currentItems[0]) {
    // User said e.g. 'the first one' or 'yes'
    sessionId = conv.data.currentItems[0].id;
  }
  console.log(`Showing session with ID: ${sessionId}`);
  return conv.conference.session(sessionId).then((session) => {
    if (session) {
      conv.data.sessionShown = session;
      return parse(conv, prompts({session})['presentSession']);
    } else {
      return parse(conv, prompts().error);
    }
  }).catch((error) => {
    console.error(`Error showing session: ${error}`);
    return parse(conv, prompts().error);
  });
};

const showBrowsedSession = (conv, {sessionId, ordinalChoice}) => {
  return showSession(conv, {sessionId, ordinalChoice});
};

const showScheduleSession = (conv, {sessionId, ordinalChoice}) => {
  const prompts = require('./'+conv.phase+'.js')['show-schedule-session'];
  return showSession(conv, {sessionId, ordinalChoice}, prompts);
};

const showSessionRepeat = (conv) => {
  console.log('Repeating previously shown session');
  const prompts = require('./'+conv.phase+'.js')['show-session-repeat'];
  if (conv.data.sessionShown) {
    return parse(conv, prompts({
      session: conv.data.sessionShown,
    })['presentSession']);
  } else {
    console.error(`Error repeating session: ${error}`);
    return parse(conv, prompts().error);
  }
};

const askSessionType = (conv) => {
  console.log('Ask session type');
  const prompts = require('./'+conv.phase+'.js')['ask-type'];
  return parse(conv, prompts().askSessionType);
};

const checkSessionType = (conv, {sessionType}) => {
  console.log('Checking for session type');
  conv.contexts.output['type-checked'] = {
    lifespan: 3,
  };
  conv.data.sessionType = sessionType;
  if (conv.data.sessionType && conv.data.tagId) {
    return browseSessions(conv);
  } else {
    return fallback(conv);
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
  'show-session': showBrowsedSession,
  'show-session-repeat': showSessionRepeat,
  'show-schedule-session': showScheduleSession,
  'show-schedule-session-repeat': showSessionRepeat,
  'check-type': checkSessionType,
};

module.exports = (conv, ...args) => {
  return intents[conv.intent](conv, ...args);
};
