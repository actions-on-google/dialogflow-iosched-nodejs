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

const {google} = require('googleapis');
const plus = google.plus('v1');
const OAuth2 = google.auth.OAuth2;
const oauthKey = require('./oauthClientKey.json');

module.exports = (accessToken) => {
  return new Promise((resolve, reject) => {
    const oauth2Client = new OAuth2(
      oauthKey.web.client_id,
      oauthKey.web.client_secret,
      oauthKey.web.redirect_uris[0]
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    plus.people.get({
      userId: 'me',
      auth: oauth2Client,
    }, function(error, response) {
      if (!error) {
        const email = response.data.emails.find((element) => {
          return element.type === 'account';
        }).value;
        resolve(email);
      } else {
        console.error(`Error getting user Google account: ${error}`);
        reject(error);
      }
    });
  });
};
