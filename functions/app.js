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

const getConfig = () => {
  let config;
  try {
    config = require('./config/dev.json');
  } catch (error) {
    console.debug(`Using default config, ${error}`);
    config = require('./config/default.json');
  }
  config.phase = config.phase || 'default';
};
const config = getConfig();

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
  clientId: config.clientId,
  init: () => ({
    data: {
      fallbackCount: 0,
      noInputCount: 0,
      noInputResponses: [],
      fallbackResponses: [],
      currentItems: [],
      nextItems: [],
      sessionType: null,
      sessionShown: null,
      sessionsTag: null,
      tagId: null,
    },
  }),
});

app.middleware((conv) => {
  conv.currentTime = Date.now();
  conv.phase = config.phase === 'default' ?
    getPhase(conv.currentTime) : config.phase;
  if (conv.phase === 'post') {
    delete conv.user.storage.uid;
    conv.data.sessionType = 'sessions';
  } else {
    conv.contexts.set('pre-or-during-io', 99);
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
});

app.intent([
  'menu',
  'welcome',
  'things-to-do-menu',
  'relax-menu',
  'date',
  'directions',
  'keynote',
  'codelabs',
  'app-review',
  'food',
  'swag',
  'unrecognized-deep-link',
  'after-party',
  'watch-remotely',
  'announcements',
  'lost-and-found',
  'what-to-wear',
  'ask-attending-yes',
  'ask-attending-no',
  'welcome',
  'concert',
  'popular-justice-songs',
  'popular-phantogram-songs',
  'scavenger-hunt',
  'show-session-directions',
  'show-schedule-session-directions',
], static);

app.intent([
  'browse-topics',
  'browse-topics-next',
  'browse-topics-repeat',
  'browse-topics-OPTION',
  'browse-sessions',
  'browse-sessions-repeat',
  'browse-sessions-next',
  'show-session',
  'show-session-repeat',
  'show-schedule-session',
  'show-schedule-session-repeat',
  'check-type',
], menu);

app.intent([
  'show-schedule',
  'schedule-sign-in',
  'show-schedule-browse-topics-yes',
  'show-schedule-browse-topics-no',
  'show-schedule-next',
  'show-schedule-repeat',
  'next-session-directions',
  'next-session-directions-sign-in',
], schedule);

app.intent('cancel', goodbye);

app.intent('no-input', noInput);

app.intent('fallback', fallback);

app.fallback((conv) => {
  console.error('No matching intent handler found: ' + conv.intent);
  fallback(conv);
});

exports.app = app;
