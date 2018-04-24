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

const browseTopics = (conv) => {
  console.log('Browsing for topics');
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
      sort: sortByTimestamp,
      maxAudio: 2,
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
    sort: sortByTimestamp,
    maxAudio: 2,
  });
};

const browseSessionsRepeat = (conv) => {
  console.log('Repeating previously browsed sessions');
  const prompts = require('./'+conv.phase+'.js')['browse-sessions-repeat'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    prompts: prompts(conv.data.sessionsTag),
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
};

module.exports = (conv, ...args) => {
  return intents[conv.intent](conv, ...args);
};
