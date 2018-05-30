# Setup

Follow the steps below (in order) to run and test this Action.

## Pre-requisites

1. Set up and initialize [Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk)
1. Compress the directory, `dialogflow-agent`, in this repo to a .zip file,
called `dialogflow-agent.zip`.

## Actions Console and Dialogflow

1. Use the [Actions on Google Console](https://console.actions.google.com) to
add a new project with a name of your choosing and click *Create Project*.
1. Click *Skip*, located on the top right to skip over category selection menu.
1. On the left navigation menu under *BUILD*, click on *Actions*. Click on
*Add Your First Action* and choose your app's language(s).
1. Select *Custom intent*, click *BUILD*. This will open a Dialogflow Console.
Click *CREATE*.
1. Click on the gear icon to see the project settings.
1. Select *Export and Import*.
1. Select *Restore from zip*. Follow the directions to restore from the
`dialogflow-agent.zip` file you created.

## Google Sign In (optional)

Note: This is only required if testing the personal schedule feature.

1. In the [Actions on Google Console](https://console.actions.google.com), click
*Account Linking* under the *ADVANCED OPTIONS* section of the left panel.
1. Click the radio button next to
*Yes, allow users to sign up for new accounts via voice*.
1. Under *Linking type*, choose *Google Sign In*.
1. Copy the Client ID shown under *Client Information*.
1. Create a copy of `default.json` in the `functions/config` directory, called
`dev.json`.
1. In `dev.json`, replace the Client ID with the string copied from the console.

## Cloud Firestore on Firebase (optional)

Note: This is only required if testing the personal schedule feature.

1. Log into the [Firebase Console](https://console.firebase.google.com)
and choose the same project used in the
[Actions on Google Console](https://console.actions.google.com).
1. Click *Authentication* under *DEVELOP* in the left panel.
1. In the top navigation bar, select *SIGN-IN METHOD*.
1. Choose *Email/Password*, toggle the *Enable* slider, and click *SAVE*.
1. Click *USERS* in the top navigation bar, and select *ADD USER*.
1. Add any Gmail addresses you want to use for testing. The password won't be
used, so any value will work, like "abc123". Take note of the User UID.
1. Click *Database* under *DEVELOP* in the left panel.
1. Click *GET STARTED* under *Cloud Firestore Beta*.
1. Choose *Start in test mode*, then click *ENABLE*.
1. Add some test user data for the User UID created previously. See the
[Firestore Data](DATA.md) format for information on how this data is
organized.
1. Click the gear symbol next to *Project Overview* in the left panel to
navigate to the *Project settings*.
1. Click *SERVICE ACCOUNTS* in the top navigation bar.
1. Click *GENERATE NEW PRIVATE KEY* to download a service key to use with the
Firebase Admin SDK in the project.
1. Copy the downloaded key file to the `functions/config` directory, and rename
the file to `serviceKey.json`.

## Running in Simulator or on Device

1. Deploy the fulfillment webhook provided in the `functions` folder using
[Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).
    1. Run `firebase deploy --only functions` and take note of the endpoint
    where the fulfillment webhook has been published. It should look like
    `Function URL (googleio): https://${REGION}-${PROJECT}.cloudfunctions.net/googleio`
1. Go back to the Dialogflow Console and select *Fulfillment* from the
left navigation menu. Enable *Webhook*, set the value of *URL* to the
`Function URL` from the previous step, then click *Save*.
1. Select *Integrations* from the left navigation menu and open the
*Integration Settings* menu for Actions on Google.
1. Enable *Auto-preview changes* and click *Test*. This will open the Actions
on Google simulator.
1. Type `Talk to my test app` in the simulator, or say
`OK Google, talk to my test app` to any Assistant enabled device signed into
your developer account.

For more detailed information on deployment, see the [documentation](https://developers.google.com/actions/samples/).