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

// The sets of times in UTC during which prompts rotate
const promptPhases = {
  pre: Date.UTC(2018, 4, 8, 12),
  during: Date.UTC(2018, 4, 11, 0),
};

// Compares a given current UTC time to prompt phases
const getPhase = (currentTime) => {
  if (!currentTime) {
    return null;
  }
  let phase = 'post';
  if (currentTime < promptPhases.during) {
    phase = 'during';
  }
  if (currentTime < promptPhases.pre) {
    phase = 'pre';
  }
  return phase;
};

module.exports = {
  getPhase,
};
