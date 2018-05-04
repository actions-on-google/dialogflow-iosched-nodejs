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

const keynote = {
  google: {
    start: moment.tz('2018-05-08 10:00', timezone),
    end: moment.tz('2018-05-08 11:30', timezone),
  },
  developer: {
    start: moment.tz('2018-05-09 12:45', timezone),
    end: moment.tz('2018-05-09 13:45', timezone),
  },
};

// Gets the day of the event given a timestamp
const getDay = (timestamp) => {
  let day = 0;
  if (!timestamp) return day;
  if (isFirstDay(timestamp)) {
    day = 1;
  } else if (isSecondDay(timestamp)) {
    day = 2;
  } else if (isThirdDay(timestamp)) {
    day = 3;
  }
  return day;
};

// Returns whether or not the given timestamp occurs on the first day
const isFirstDay = (timestamp) => {
  if (!timestamp) return false;
  const date = moment(timestamp).tz(timezone);
  date.isBetween(eventDay.first.start, eventDay.first.end);
};

// Returns whether or not the given timestamp occurs on the second day
const isSecondDay = (timestamp) => {
  if (!timestamp) return false;
  const date = moment(timestamp).tz(timezone);
  date.isBetween(eventDay.second.start, eventDay.second.end);
};

// Returns whether or not the given timestamp occurs on the third day
const isThirdDay = (timestamp) => {
  if (!timestamp) return false;
  const date = moment(timestamp).tz(timezone);
  date.isBetween(eventDay.third.start, eventDay.third.end);
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

// Returns whether or not the given timestamp occurs before the keynotes
const isBeforeKeynotes = (timestamp) => {
  return timestamp ? keynote.google.start.isAfter(timestamp) : false;
};

// Returns whether or not the given timestamp occurs after the keynotes
const isAfterKeynotes = (timestamp) => {
  return timestamp ? keynote.developer.end.isBefore(timestamp) : false;
};

// Returns whether or not the given timestamp is between the two keynotes
const isBetweenKeynotes = (timestamp) => {
  return timestamp ? keynote.google.start.isBefore(timestamp) &&
    keynote.developer.end.isAfter(timestamp) : false;
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
  isFirstDay,
  isSecondDay,
  isThirdDay,
  isBeforeKeynotes,
  isAfterKeynotes,
  isBetweenKeynotes,
};
