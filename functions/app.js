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
  dialogflow,
} = require('actions-on-google');
const {
  getPhase,
} = require('./timeUtils');
const static = require('./prompts/static/utils');
const menu = require('./prompts/menu/utils');
const {
  fallback,
  noInput,
  goodbye,
} = require('./prompts/common/utils');
const schedule = require('./prompts/schedule/utils');
const ConferenceData = require('./event/conference');

const app = dialogflow({
  debug: true,
  init: () => ({
    data: {
      fallbackCount: 0,
      noInputCount: 0,
      noInputResponses: [],
      fallbackResponses: [],
    },
  }),
});

app.middleware((conv) => {
  conv.currentTime = Date.now();
  conv.phase = getPhase(conv.currentTime);
  if (conv.phase === 'post') {
    conv.user.storage.uid = undefined;
  }
  conv.isRepeat = conv.phase === getPhase(conv.user.last.seen) ?
    'repeat' : 'firstTime';
  if (!(conv.intent === 'fallback' || conv.intent === 'no-input')) {
    conv.data.fallbackCount = 0;
    conv.data.noInputCount = 0;
    conv.data.fallbackResponses = [];
    conv.data.noInputResponses = [];
  }
  conv.conference = new ConferenceData();
  conv.screen = conv.surface.capabilities
    .has('actions.capability.SCREEN_OUTPUT');
});

app.intent('menu', static);

app.intent('welcome', static);

app.intent('thingsToDoMenu', static);

app.intent('relaxMenu', static);

app.intent('date', static);

app.intent('directions', static);

app.intent('keynote', static);

app.intent('codelabs', static);

app.intent('appReview', static);

app.intent('food', static);

app.intent('swag', static);

app.intent('unrecognized-deep-link', static);

app.intent('afterParty', static);

app.intent('watchRemotely', static);

app.intent('announcements', static);

app.intent('lostAndFound', static);

app.intent('whatToWear', static);

app.intent('ask-attending-yes', static);

app.intent('ask-attending-no', static);

app.intent('welcome', static);

app.intent('concert', static);

app.intent('popular-justice-songs', static);

app.intent('popular-phantogram-songs', static);

app.intent('scavenger-hunt', static);

app.intent('show-session-directions', static);

app.intent('show-schedule-session-directions', static);

app.intent('browse-topics', menu);

app.intent('browse-topics-next', menu);

app.intent('browse-topics-repeat', menu);

app.intent('browse-topics-OPTION', menu);

app.intent('browse-sessions', menu);

app.intent('browse-sessions-repeat', menu);

app.intent('browse-sessions-next', menu);

app.intent('show-session', menu);

app.intent('show-session-repeat', menu);

app.intent('show-schedule', schedule);

app.intent('schedule-sign-in', schedule);

app.intent('show-schedule-browse-topics-yes', schedule);

app.intent('show-schedule-browse-topics-no', schedule);

app.intent('show-schedule-next', schedule);

app.intent('show-schedule-repeat', schedule);

app.intent('show-schedule-session', menu);

app.intent('show-schedule-session-repeat', menu);

app.intent('check-type', menu);

app.intent('cancel', goodbye);

app.intent('no-input', noInput);

app.intent('fallback', fallback);

app.fallback((conv) => {
  console.error('No matching intent handler found: ' + conv.intent);
  fallback(conv);
});

exports.app = app;
