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

const eventsAdmin = require('firebase-admin');
eventsAdmin.initializeApp({
  credential: eventsAdmin.credential.cert(require('./eventsServiceKey.json')),
});
const db = eventsAdmin.firestore();

exports.getFirebaseUser = (email) => {
  console.log(`Fetching user from Firebase Auth`);
  return eventsAdmin.auth().getUserByEmail(email).then((userRecord) => {
    return userRecord.uid;
  }).catch((error) => {
    console.error(`Error fetching user`);
    throw error;
  });
};

exports.UserData = class UserData {
  /**
   * Constructor for UserData class. Initializes the db accessor for Firestore.
   *
   * @param {string} uid Firebase Auth UID
   */
  constructor(uid) {
    this.uid = uid;
  }

  /**
   * Utility for checking registered users.
   *
   * @return {boolean} True if user is registered to attend I/O.
   */
  isRegistered() {
    console.log('Checking if user is registered');
    return db.collection('users').doc(this.uid).get().then((user) => {
      return user.data().registered;
    }).catch((error) => {
      console.error(`Error checking if user is registered: ${error}`);
      throw error;
    });
  }

  /**
   * Gets the schedule for the user.
   *
   * @return {Promise<Array<Object>>} Promise which resolves with array of
   *     sessions. Each will have a Session ID and reservation status, where
   *     reservation status is optionally a  reservationStatus string property
   *     (either 'RESERVED' or 'WAITLISTED') and optional isStarred boolean
   *     property.
   */
  schedule() {
    console.log('Getting user schedule');
    return db.collection('users').doc(this.uid).collection('events').
      get().then((events) => {
        const schedule = [];
        for (const event of events) {
          const {id, isStarred, reservationStatus: status} = event.data();
          if (isStarred || status === 'RESERVED' || status === 'WAITLISTED') {
            schedule.push({id, reservationStatus: status, isStarred});
          }
        }
        return schedule;
    }).catch((error) => {
      console.error(`Error getting user schedule: ${error}`);
      throw error;
    });
  }
};
