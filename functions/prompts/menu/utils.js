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

const prompts = require('./common');
const {
  parse,
  fallback,
  browse,
} = require('../common/utils');

const sortByName = (a, b) => a.name < b.name ? -1 : 1;
const randomSort = () => Math.random() - 0.5;
const sortByTimestamp = (a, b) => a.startTimestamp < b.startTimestamp ? -1 : 1;

const browseTopics = (conv, params) => {
  console.log(`Browsing for topics`);
  conv.data.sessionType = params['session-type'];
  return browse({
    conv,
    itemsPromise: conv.conference.topics(),
    sort: conv.screen ? sortByName : randomSort,
    prompts: conv.phase === 'post' ?
      prompts['browse-topics-after-io'] :
      prompts['browse-topics'],
  });
};

const browseTopicsNext = (conv) => {
  console.log('Browsing next set of topics');
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    sort: conv.screen ? sortByName : randomSort,
    prompts: prompts['browse-topics-next'],
  });
};

const browseTopicsRepeat = (conv) => {
  console.log('Repeating previously browsed topics');
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    sort: conv.screen ? sortByName : randomSort,
    prompts: prompts['browse-topics'],
  });
};

const browseTopicsOption = (conv) => {
  console.log('Browse Topics Option');
  if (conv.arguments.get('OPTION')) {
    const tagId = conv.arguments.get('OPTION');
    conv.data.tagId = tagId;
    if (conv.data.sessionType) {
      return checkSessionType(conv, {'session-type': conv.data.sessionType});
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
          return checkSessionType(conv, {
            'session-type': conv.data.sessionType,
          });
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
    conv.data.sessionsTag = tag.name;
    return conv.conference.sessions(tag.tag, conv.data.sessionType)
      .then((sessions) => {
        return browse({
          conv,
          itemsPromise: Promise.resolve(sessions),
          prompts: prompts['browse-sessions-first-set']({
            topic: tag.name,
            totalItems: sessions.length,
            sessionType: conv.data.sessionType,
          }),
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
  const nextSessionPrompts = prompts['browse-sessions-next'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    prompts: nextSessionPrompts(conv.data.sessionsTag, conv.data.sessionType),
    sort: sortByTimestamp,
    maxAudio: 2,
  });
};

const browseSessionsRepeat = (conv) => {
  console.log('Repeating previously browsed sessions');
  if (!conv.data.sessionType) {
    return fallback(conv);
  }
  const repeatSessionsPrompt = prompt['browse-sessions-repeat'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    prompts: repeatSessionsPrompt(conv.data.sessionsTag, conv.data.sessionType),
    sort: sortByTimestamp,
    maxAudio: 2,
  });
};

const showSession = (conv, {sessionId, ordinalChoice}, showPrompt) => {
  showPrompt = showPrompt || prompts['show-session'];
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
      return parse(conv, showPrompt({session})['presentSession']);
    } else {
      return parse(conv, showPrompt().error);
    }
  }).catch((error) => {
    console.error(`Error showing session: ${error}`);
    return parse(conv, showPrompt().error);
  });
};

const showBrowsedSession = (conv, {sessionId, ordinalChoice}) => {
  return showSession(conv, {sessionId, ordinalChoice});
};

const showScheduleSession = (conv, {sessionId, ordinalChoice}) => {
  return showSession(conv, {sessionId, ordinalChoice},
    prompts['show-schedule-session']);
};

const showSessionRepeat = (conv) => {
  console.log('Repeating previously shown session');
  const showSessionRepeatPrompt = prompts['show-session-repeat'];
  if (conv.data.sessionShown) {
    return parse(conv, showSessionRepeatPrompt({
      session: conv.data.sessionShown,
    })['presentSession']);
  } else {
    console.error(`Error repeating session: ${error}`);
    return parse(conv, showSessionRepeatPrompt().error);
  }
};

const askSessionType = (conv) => {
  console.log('Ask session type');
  return parse(conv, prompts['ask-type']().askSessionType);
};

const checkSessionType = (conv, params) => {
  console.log('Checking for session type');
  conv.contexts.set('type-checked', 3);
  conv.data.sessionType = params['session-type'];
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
