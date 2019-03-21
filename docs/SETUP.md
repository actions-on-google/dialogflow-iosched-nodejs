## Setup Instructions

### Configuration
1. From the [Actions on Google Console](https://console.actions.google.com/), add a new project (this will become your *Project ID*) > **Create Project** > under **More options** > **Conversational**.
1. From the left navigation menu under **Build** > **Actions** > **Add Your First Action** > **BUILD** (this will bring you to the Dialogflow console) > Select language and time zone > **CREATE**.
1. In Dialogflow, go to **Settings** ⚙ > **Export and Import** > **Restore from zip**.
   + Follow the directions to restore from the `agent.zip` file in this repo.
1. `cd` to dialogflow-iosched-nodejs directory
1. Install the [Firebase CLI](https://developers.google.com/actions/dialogflow/deploy-fulfillment), `npm install -g firebase-tools`
1. Login to Firebase your Google account, `firebase login`
1. `cd functions`
1. Initialize and add your project to Firebase, `firebase init functions`
    + Set Firebase project to your **Project ID**
        + To find your **Project ID**: In [Dialogflow console](https://console.dialogflow.com/) under **Settings** ⚙ > **General** tab > **Project ID**.
    + Select `JavaScript` and `N` to ESLint
    + Overwrite index.js and package.json files? Select `N`
    + Run `npm install`
    + Run `firebase deploy --only functions`
1. In [Dialogflow Console](https://console.dialogflow.com) > **Fulfillment** > **Enable** Webhook > Set **URL** to the **Function URL** that was returned after the deploy command > **SAVE**.
    ```
    Function URL (googleio): https://<REGION>-<PROJECT_ID>.cloudfunctions.net/googleio
    ```

### Google Sign In (Account Linking)
**Required if testing the personal schedule feature.**
1. Create a copy of default.json in the `functions/config` directory called `dev.json`
1. In the [Actions on Google console](https://console.actions.google.com) > under **Advanced Options** > **Account Linking**:
    + **Account Creation**: select `Yes, allow users to sign up for new accounts via voice`
    + **Linking Type**: **Google Sign In**.
    + **Client Information**: copy the **Client ID** and paste into `functions/config/dev.json`

### Cloud Firestore on Firebase
**Required if testing the personal schedule feature.**
1. Log into the [Firebase Console](https://console.firebase.google.com) > select your *Project ID*.
1. Under **Develop** > **Authentication** > **Sign-in Method** tab > for Sign-in provider select **Email/Password** > **Enable** Allow users to sign up using their email address and password > **Save**.
1. From the **Users** tab > select **Add user** > add **Gmail** email address you will use for testing.
    + For testing this sample, the password can be "abc123"
    + Take note of the User UID.
1. Under **Develop** > **Database** > **Create Database** > select **Start in test mode** then > **Enable**.
1. Add some test user data for the User UID created previously. See the
[Firestore Data](DATA.md) format for information on how this data is
organized.
1. From the Firebase console, select ⚙ > **Project settings** >  **Service Accounts** tab > **Generate new private key** to download a service key > save key as `serviceKey.json` into the `functions/config` directory path.
1. Run `firebase deploy --only functions`

### Testing this Sample
1. Open up Assistant app then say or type `OK Google, talk to my test app` on a mobile device associated with your Action's account.
OR
1. In the [Dialogflow console](https://console.dialogflow.com), from the left navigation menu > **Integrations** > **Integration Settings** under Google Assistant > Enable **Auto-preview changes** >  **Test** to open the Actions on Google simulator then say or `Talk to my test app`.
