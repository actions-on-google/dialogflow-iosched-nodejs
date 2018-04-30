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

const moment = require('moment-timezone');
const timezone = 'America/Los_Angeles';
// The sets of times in UTC for each day of the event
const eventDay = {
  first: {
    start: moment.tz('2018-05-08 00:00', timezone),
    end: moment.tz('2018-05-08 23:59', timezone),
  },
  second: {
    start: moment.tz('2018-05-09 00:00', timezone),
    end: moment.tz('2018-05-09 23:59', timezone),
  },
  third: {
    start: moment.tz('2018-05-10 00:00', timezone),
    end: moment.tz('2018-05-10 23:59', timezone),
  },
};

// Returns whether or not the given timestamp occurs before the event
const isPreEvent = (timestamp) => {
  return timestamp ? eventDay.first.start.isAfter(timestamp) : false;
};

// Returns whether or not the given timestamp occurs after the event
const isPostEvent = (timestamp) => {
  return timestamp ? eventDay.third.end.isBefore(timestamp) : false;
};

// Returns whether or not the given timestamp occurs during the event
const isDuringEvent = (timestamp) => {
  return !(isPreEvent(timestamp) || isPostEvent(timestamp));
};

// Gets the day of the event given a timestamp
const getDay = (timestamp) => {
  let day = 0;
  if (!timestamp) return day;
  const date = moment(timestamp).tz(timezone);
  if (date.isBetween(eventDay.first.start, eventDay.first.end)) {
    day = 1;
  } else if (date.isBetween(eventDay.second.start, eventDay.second.end)) {
    day = 2;
  } else if (date.isBetween(eventDay.third.start, eventDay.third.end)) {
    day = 3;
  }
  return day;
};

// Compares a given current UTC time to prompt phases
const getPhase = (currentTime) => {
  if (isPreEvent(currentTime)) {
    return 'pre';
  } else if (isDuringEvent(currentTime)) {
    return 'during';
  } else if (isPostEvent(currentTime)) {
    return 'post';
  } else {
    throw new Error('Current time does not fall into phase');
  }
};

module.exports = {
  getDay,
  getPhase,
};
