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

const {SignIn} = require('actions-on-google');

const prompts = require('./common');
const {
  parse,
  browse,
} = require('../common/utils');
const {getFirebaseUser} = require('../../auth/user');
const {UserData} = require('../../auth/user');

const {getMoment} = require('../../timeUtils');

const sortByTimestamp = (a, b) => a.startTimestamp < b.startTimestamp ? -1 : 1;

const showSchedule = (conv) => {
  return schedule(conv, (sessions) => {
    return browse({
      conv,
      itemsPromise: Promise.resolve(sessions),
      prompts: prompts['show-schedule-first-set'](sessions.length),
      maxAudio: 2,
      sort: sortByTimestamp,
    });
  });
};

const nextSessionDirections = (conv) => {
  return schedule(conv, (sessions) => {
    if (sessions.length === 0) {
      parse(conv, prompts['next-session-empty']);
    } else {
      sessions.sort(sortByTimestamp);
      for (const session of sessions) {
        if (getMoment(session.endTimestamp).
          isAfter(getMoment(conv.currentTime))) {
            const duringPrompts = require('../static/during');
            const prompts = conv.user.storage.isAttending ?
              duringPrompts.attending :
              duringPrompts.notAttending;
            const roomId = session.room;
            return parse(conv,
              prompts['session-directions'](roomId, conv.screen));
        }
      }
      parse(conv, prompts['next-session-finished']);
    }
  });
};

const schedule = (conv, callback) => {
  console.log('Showing the user their schedule');
  if (conv.user.storage.uid && conv.user.email) {
    const user = new UserData(conv.user.storage.uid);
    return user.schedule().then((schedule) => {
      if (schedule.length === 0) {
        conv.contexts.set('schedule-empty', 2);
      }
      const sessionIds = [];
      for (const session of schedule) {
        sessionIds.push(session.id);
      }
      return conv.conference.sessionsById(sessionIds).then((sessions) => {
        for (const session of sessions) {
          const scheduleSession = schedule.find((scheduleItem) => {
            return scheduleItem.id === session.id;
          });
          if (scheduleSession) {
            session.reservationStatus = scheduleSession.reservationStatus;
            session.isStarred = scheduleSession.isStarred;
          }
        }
        return callback(sessions);
      }).catch((error) => {
        console.error(`Error getting session data for user schedule ${error}`);
        parse(conv, prompts['show-schedule']().error);
      });
    }).catch((error) => {
      console.error(`Error getting user schedule: ${error}`);
      parse(conv, prompts['show-schedule']().error);
    });
  } else {
    conv.user.storage.uid = undefined;
    if (conv.screen) {
      conv.ask(new SignIn());
    } else {
      return parse(conv, prompts['sign-in-user-on-speaker']);
    }
  }
};

const showScheduleNext = (conv) => {
  console.log(`Browsing next set of schedule sessions`);
  const prompts = require('./'+conv.phase+'.js')['show-schedule-next'];
  if (!conv.data.nextItems || conv.data.nextItems.length === 0) {
    conv.contexts.set('schedule-empty', 3);
    return parse(conv,
      require('./'+conv.phase+'.js')['show-schedule']().noMoreOptions);
  }
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.nextItems),
    prompts: prompts(),
    maxAudio: 2,
  });
};

const showScheduleRepeat = (conv) => {
  console.log('Repeating previously browsed schedule sessions');
  const prompts = require('./'+conv.phase+'.js')['show-schedule-repeat'];
  return browse({
    conv,
    itemsPromise: Promise.resolve(conv.data.currentItems),
    prompts: prompts(),
    maxAudio: 2,
  });
};

const nextSessionDirectionsSignIn = (conv) => {
  return signIn(conv, nextSessionDirections);
};

const scheduleSignIn = (conv) => {
  return signIn(conv, showSchedule);
};

const signIn = (conv, callback) => {
  console.log('Handling SIGN_IN intent');
  if (conv.arguments.get('SIGN_IN').status === 'OK' && conv.user.email) {
    const email = conv.user.email;
    return getFirebaseUser(email).then((uid) => {
      conv.user.storage.uid = uid;
      return callback(conv);
    }).catch((error) => {
      console.error(`Error finding Firebase user: ${error}`);
      return parse(conv, prompts['sign-in-user-not-found']);
    });
  } else if (conv.arguments.get('SIGN_IN').status === 'CANCELLED') {
    console.error('User denied sign in');
    parse(conv, prompts['sign-in-denied']);
  } else {
    console.error('Unknown error signing in user');
    parse(conv, prompts['sign-in-error']);
  }
};

const doSomethingElse = (conv) => {
  console.log('User wants to do something else');
  return parse(conv, prompts['do-something-else']);
};

const intents = {
  'show-schedule': showSchedule,
  'schedule-sign-in': scheduleSignIn,
  'show-schedule-browse-topics-yes': (conv, ...args) => {
    conv.contexts.set('browse-topics-followup', 3);
    conv.intent = 'browse-topics';
    return require('../menu/utils')(conv, ...args);
  },
  'show-schedule-browse-topics-no': doSomethingElse,
  'show-schedule-next': showScheduleNext,
  'show-schedule-repeat': showScheduleRepeat,
  'next-session-directions': nextSessionDirections,
  'next-session-directions-sign-in': nextSessionDirectionsSignIn,
};

module.exports = (conv, ...args) => {
  return intents[conv.intent](conv, ...args);
};
