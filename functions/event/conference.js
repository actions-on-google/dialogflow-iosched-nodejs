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

const request = require('request');

// The JSON file of I/O session data
const DATA_SOURCE = 'https://firebasestorage.googleapis.com/v0/b/io2018-festivus/o/sessions.json?alt=media&token=019af2ec-9fd1-408e-9b86-891e4f66e674';

/**
 * Session Data.
 *
 * This class contains mechanisms for retrieving session data by specific
 * dimensions, like tag, sessions, etc. It makes an external API call to fetch
 * session data JSON on the first use, and then caches thereafter.
 */
class ConferenceData {
  /**
   * Constructor for ConferenceData object.
   * Simply declares a cached data value.
   */
  constructor() {
    /**
     * Cached session data
     * @type {Object}
    */
    this.data = null;
  }

  /**
   * Method for fetching session data.
   * @private
   *
   * @param {Function} successCallback
   * @param {Function} errorCallback
   */
  data_(successCallback, errorCallback) {
    if (this.data) {
      successCallback(this.data);
    } else {
      request.get(DATA_SOURCE, (error, response, body) => {
        if (!error) {
          this.data = JSON.parse(body);
          successCallback(this.data);
        } else {
          if (errorCallback) {
            errorCallback(error);
          }
        }
      });
    }
  }

  /**
   * Method for fetching tag data.
   *
   * @return {Promise} A promise that resolves with the complete array of
   *     session tags.
   */
  tags() {
    return new Promise((resolve, reject) => {
      this.data_((data) => {
        if (!data.tags.length || data.tags.length === 0) {
          const reason = 'Empty tags array in session data';
          console.error(reason);
          reject(reason);
        } else {
          resolve(data.tags);
        }
      }, (error) => {
        console.error(`Error getting complete list of tags: ${error}`);
        reject(error);
      });
    });
  }

  /**
   * Method for fetching topics (not Misc, or Keynote).
   *
   * @return {Promise} A promise that resolves with the complete array of
   *     session topics.
   */
  topics() {
    return this.tags().then((tags) => {
      return tags.filter((tag) => {
        return tag.category === 'topic'
          && tag.name !== 'Misc'
          && tag.name !== 'Keynote';
      });
    }).catch((error) => {
      console.error(`Error getting complete topic list: ${error}`);
      throw error;
    });
  }

  /**
   * Method for fetching tags by tag "ID" (it's really tag.tag).
   *
   * @param {string} tag
   * @return {Promise} A promise that resolves with the found tag.
   */
  tag(tag) {
    return new Promise((resolve, reject) => {
      this.data_((data) => {
        const returnTag = data.tags.find((dataTag) => {
          return dataTag.tag === tag;
        });
        if (!returnTag) {
          const reason = `No tag found with ID: ${tag}`;
          console.error(reason);
          reject(reason);
        } else {
          resolve(returnTag);
        }
      }, (error) => {
        console.error(`Error finding tag by ID: ${error}`);
        reject(error);
      });
    });
  }

  /**
   * Method for fetching tags by tag name.
   *
   * @param {string} name
   * @return {Promise} A promise that resolves with the found tag.
   */
  tagByName(name) {
    return new Promise((resolve, reject) => {
      this.data_((data) => {
        const returnTag = data.tags.find((dataTag) => {
          return dataTag.name === name;
        });
        if (!returnTag) {
          const reason = `No tag found with name: ${name}`;
          console.error(reason);
          reject(reason);
        } else {
          resolve(returnTag);
        }
      }, (error) => {
        console.error(`Error finding tag by name: ${error}`);
        reject(error);
      });
    });
  }

  /**
   * Method for fetching session data by tag ID.
   *
   * @param {string} tag
   * @return {Promise} A promise that resolves with the complete list of
   *     Sessions (not incl Office Hours, Codelabs, etc)
   */
  sessions(tag) {
    return new Promise((resolve, reject) => {
      this.data_((data) => {
        resolve(data.sessions.filter((session) => {
          session.title = session.title.replace('[Session] ', '');
          return session.tagNames.includes(tag) && session.type === 'Sessions';
        }));
      }, (error) => {
        console.error(`Error getting complete session list: ${error}`);
        reject(error);
      });
    });
  }

  /**
   * Method for fetching session data by session ID.
   *
   * @param {string} id
   * @return {Promise} A promise that resolves with the found session.
   */
  session(id) {
    return new Promise((resolve, reject) => {
      this.data_((data) => {
        const returnSession = data.sessions.find((dataSession) => {
          return dataSession.id === id;
        });
        if (!returnSession) {
          const reason = `No session found with ID: ${id}`;
          console.error(reason);
          reject(reason);
        } else {
          returnSession.title = returnSession.title.replace('[Session] ', '');
          resolve(returnSession);
        }
      }, (error) => {
        console.error(`Error finding session by id: ${error}`);
        reject(error);
      });
    });
  }

  /**
   * Method for fetching set of session data by set of session ID.
   *
   * @param {Array<string>} ids
   * @return {Promise} A promise that resolves with array of found sessions.
   */
  sessionsById(ids) {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      this.data_((data) => {
        const returnSessions = data.sessions.filter((dataSession) => {
          return ids.includes(dataSession.id);
        });
        for (let returnSession of returnSessions) {
          returnSession.title = returnSession.title.replace('[Session] ', '');
        }
        resolve(returnSessions);
      }, (error) => {
        console.error(`Error finding sessions by id's: ${error}`);
        reject(error);
      });
    });
  }
};

module.exports = ConferenceData;
