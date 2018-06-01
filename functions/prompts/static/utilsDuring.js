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
 } = require('../common/utils');

const {
  isFirstDay,
  isSecondDay,
  isBeforeKeynotes,
  isAfterKeynotes,
  isBetweenKeynotes,
} = require('../../timeUtils');

const duringPrompts = require('./during.js');

// Retrieves the appropriate keynote prompt
const keynotePrompt = (conv) => {
  const currentTime = conv.currentTime;
  let prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  prompts = prompts['keynote'];
  if (isBeforeKeynotes(currentTime)) {
    prompts = prompts.before;
  } else if (isBetweenKeynotes(currentTime)) {
    prompts = prompts.during;
  } else if (isAfterKeynotes(currentTime)) {
    prompts = prompts.after;
  } else {
    prompts = prompts.default;
  }
  return parse(conv, prompts);
};

// Retrieves the appropriate after party prompt
const afterPartyPrompt = (conv) => {
  const currentTime = conv.currentTime;
  let prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  prompts = prompts['after-party'];
  if (isFirstDay(currentTime)) {
    prompts = prompts.firstDay;
  } else if (isSecondDay(currentTime)) {
    prompts = prompts.secondDay;
  } else {
    prompts = prompts.default;
  }
  return parse(conv, prompts);
};

// Retrieves the appropriate announcements prompt
const announcementsPrompt = (conv) => {
  const currentTime = conv.currentTime;
  let prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  prompts = prompts['announcements'];
  if (isAfterKeynotes(currentTime)) {
    prompts = prompts.afterKeynote;
  } else {
    prompts = prompts.default;
  }
  return parse(conv, prompts);
};

// Prompt to check if the user is attending the event
const askIfAttending = (conv) => {
  const prompts = duringPrompts.checkAttending;
  conv.contexts.set('welcome-followup', 3);
  return parse(conv, prompts);
};

// Prompt to the user with the attendee menu
const attendingPrompt = (conv) => {
  conv.user.storage.isAttending = true;
  return generalPrompt(conv);
};

// Prompt to the user with the non-attendee menu
const notAttendingPrompt = (conv) => {
  conv.user.storage.isAttending = false;
  return generalPrompt(conv);
};

// Check if the user is attending and prompt with a welcome prompt
const welcomePrompt = (conv) => {
  if (conv.user.storage.isAttending === undefined ||
    conv.user.storage.isAttending === null) {
      return askIfAttending(conv);
  }
  return generalPrompt(conv);
};

// Checks if the user specified a room, and prompts them with directions
const directionsPrompt = (conv, params) => {
  const prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  if (params.room) {
    return parse(conv, prompts['session-directions'](params.room, conv.screen));
  } else if (conv.data.sessionShown &&
    (conv.contexts.input['show-session-followup'] ||
      conv.contexts.input['show-schedule-session-followup'])) {
    const roomId = conv.data.sessionShown.room;
    return parse(conv, prompts['session-directions'](roomId, conv.screen));
  }
  prompt = prompts.directions;
  return parse(conv, prompt);
};

// Returns a general static prompt for the given intent
const generalPrompt = (conv) => {
  const prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  return parse(conv, prompts[conv.intent]);
};

const intents = {
  'ask-attending-yes': attendingPrompt,
  'ask-attending-no': notAttendingPrompt,
  'keynote': keynotePrompt,
  'after-party': afterPartyPrompt,
  'announcements': announcementsPrompt,
  'welcome': welcomePrompt,
  'menu': generalPrompt,
  'things-to-do-menu': generalPrompt,
  'relax-menu': generalPrompt,
  'date': generalPrompt,
  'watch-remotely': generalPrompt,
  'lost-and-found': generalPrompt,
  'what-to-wear': generalPrompt,
  'codelabs': generalPrompt,
  'food': generalPrompt,
  'app-review': generalPrompt,
  'swag': generalPrompt,
  'directions': directionsPrompt,
  'scavenger-hunt': generalPrompt,
  'concert': generalPrompt,
  'show-session-directions': directionsPrompt,
  'show-schedule-session-directions': directionsPrompt,
  'popular-justice-songs': generalPrompt,
  'popular-phantogram-songs': generalPrompt,
};

exports.duringPrompt = (conv, ...args) => {
  intents[conv.intent](conv, ...args);
};
