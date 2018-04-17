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

const functions = require('firebase-functions');
const {
  dialogflow,
} = require('actions-on-google');
const {
  getPhase,
} = require('./utils');
const static = require('./prompts/static/utils');
const menu = require('./prompts/menu/utils');
const {
  fallback,
  noInput,
  goodbye,
} = require('./prompts/common/utils');
const ConferenceData = require('./event/conference');

const app = dialogflow({
  debug: true,
  init: () => ({
    data: {
      fallbackCount: 0,
      noInputResponses: [],
      fallbackResponses: [],
    },
  }),
});

app.middleware((conv) => {
  conv.currentTime = Date.now();
  conv.phase = getPhase(conv.currentTime);
  conv.isRepeat = conv.phase === getPhase(conv.user.last.seen) ?
    'repeat' : 'firstTime';
  if (!(conv.intent === 'fallback' || conv.intent === 'no-input')) {
    conv.data.fallbackCount = 0;
    conv.data.fallbackResponses = [];
    conv.data.noInputResponses = [];
  }
  conv.conference = new ConferenceData();
});

app.intent('welcome', static.prompt);

app.intent('date', static.prompt);

app.intent('keynote', static.prompt);

app.intent('codelabs', static.prompt);

app.intent('appReview', static.prompt);

app.intent('food', static.prompt);

app.intent('swag', static.prompt);

app.intent('afterParty', static.prompt);

app.intent('watchRemotely', static.prompt);

app.intent('announcements', static.prompt);

app.intent('lostAndFound', static.prompt);

app.intent('whatToWear', static.prompt);

app.intent('browse-topics', menu);

app.intent('browse-topics-next', menu);

app.intent('browse-topics-repeat', menu);

app.intent('browse-topics-OPTION', menu);

app.intent('browse-sessions', menu);

app.intent('browse-sessions-repeat', menu);

app.intent('browse-sessions-next', menu);

app.intent('cancel', goodbye);

app.intent('no-input', noInput);

app.intent('fallback', fallback);

app.fallback((conv) => {
  console.error('No matching intent handler found: ' + conv.intent);
  fallback(conv);
});

exports.googleio = functions.https.onRequest(app);
