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
  BasicCard,
  SimpleResponse,
} = require('actions-on-google');

const {
  parse,
 } = require('../common/utils');

const {
  isFirstDay,
  isSecondDay,
  isBeforeKeynotes,
  isAfterKeynotes,
  isBetweenKeynotes,
} = require('../../utils');

const duringPrompts = require('./during.js');

// Retrieves the appropriate keynote prompt
const keynotePrompt = (conv) => {
  const currentTime = Date.now();
  let prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  prompts = prompts.keynote.default;
  if (isBeforeKeynotes(currentTime)) {
    prompts = prompts.before;
  } else if (isBetweenKeynotes(currentTime)) {
    prompts = prompts.during;
  } else if (isAfterKeynotes(currentTime)) {
    prompts = prompts.after;
  }
  return parse(conv, prompts);
};

// Retrieves the appropriate after party prompt
const afterPartyPrompt = (conv) => {
  const currentTime = Date.now();
  let prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  prompts = prompts.afterParty.default;
  if (isFirstDay(currentTime)) {
    prompts = prompts.firstDay;
  } else if (isSecondDay(currentTime)) {
    prompts = prompts.secondDay;
  }
  return parse(conv, prompts);
};

// Retrieves the appropriate announcements prompt
const announcementsPrompt = (conv) => {
  const currentTime = Date.now();
  let prompts = conv.user.storage.isAttending ? duringPrompts.attending :
    duringPrompts.notAttending;
  prompts = prompts.announcements.default;
  if (isAfterKeynotes(currentTime)) {
    prompts = prompts.afterKeynote;
  }
  return parse(conv, prompts);
};

// Prompt to check if the user is attending the event
const askIfAttending = (conv) => {
  const prompts = duringPrompts.checkAttending;
  conv.contexts.output['welcome-followup'] = {
    lifespan: 3,
  };
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
  if (params.room) {
    return directionsFollowupPrompt(conv, params);
  }
  const prompts = conv.user.storage.isAttending ? duringPrompts.attending :
  duringPrompts.notAttending;
  prompt = prompts.directions;
  return parse(conv, prompt);
};

// Prompt the user for which room they would like directions for
const directionsFollowupPrompt = (conv, params) => {
  const rooms = require('../../event/map').rooms;
  let directions = `Sorry, I'm not familiar with that room.`;
  let prompt = {
    'firstTime/repeat': {
      'screen/speaker': [
        {
          'elements': [
            [
              new SimpleResponse({
                speech: directions,
                text: directions,
              }),
            ],
          ],
        },
      ],
    },
  };
  if (params.room) {
    const room = rooms[params.room];
    directions = room.directions;
    prompt = {
      'firstTime/repeat': {
        'screen': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: directions,
                  text: directions,
                }),
              ],
              [
                new BasicCard({
                  text: directions,
                  title: room.name,
                }),
              ],
            ],
          },
        ],
        'speaker': [
          {
            'elements': [
              [
                new SimpleResponse({
                  speech: directions,
                  text: directions,
                }),
              ],
            ],
          },
        ],
      },
    };
  }
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
  'afterParty': afterPartyPrompt,
  'announcements': announcementsPrompt,
  'welcome': welcomePrompt,
  'menu': generalPrompt,
  'thingsToDoMenu': generalPrompt,
  'relaxMenu': generalPrompt,
  'date': generalPrompt,
  'watchRemotely': generalPrompt,
  'lostAndFound': generalPrompt,
  'whatToWear': generalPrompt,
  'codelabs': generalPrompt,
  'food': generalPrompt,
  'appReview': generalPrompt,
  'swag': generalPrompt,
  'directions': directionsPrompt,
  'scavenger-hunt': generalPrompt,
  'concert': generalPrompt,
  'popular-justice-songs': generalPrompt,
  'popular-phantogram-songs': generalPrompt,
};

exports.duringPrompt = (conv, ...args) => {
  intents[conv.intent](conv, ...args);
};
