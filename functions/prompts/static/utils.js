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

exports.prompt = (conv) => {
  const prompts = require('./'+conv.phase+'.js');
  conv.contexts.output['browse-sessions-followup'] = {
    lifespan: 0,
  };
  conv.contexts.output['browse-topics-followup'] = {
    lifespan: 0,
  };
  conv.contexts.output['browse-schedule-followup'] = {
    lifespan: 0,
  };
  conv.contexts.output['show-schedule-session-followup'] = {
    lifespan: 0,
  };
  conv.contexts.output['show-schedule-followup'] = {
    lifespan: 0,
  };
  conv.contexts.output['show-session-followup'] = {
    lifespan: 0,
  };
  conv.contexts.output['type-checked'] = {
    lifespan: 0,
  };
  delete conv.data.sessionType;
  delete conv.data.tagId;
  parse(conv, prompts[conv.intent]);
};
