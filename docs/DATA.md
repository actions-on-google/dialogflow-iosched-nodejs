# Data Format

There are 2 primary data sources used by this Action, Session Data and User
Schedule Data.

## Session Data

Session Data is held in a central JSON file. It includes all relevant data
on the conference agenda details, e.g.

* Session types
* Session start and end times
* Session rooms
* etc

This data is fetched from the web as shown in the `functions/event/conference.js`
file.

### Example Data

Below is an example JSON file representing the artifact fetched from the web.
The online file contains more metadata than shown below, but the required
attributes used by this Action are shown here.

```json
{
    "sessions": [
        {
            "id": "abc-123",
            "title": "[Session] Example Session",
            "description": "Come learn how to build accessible software.",
            "type": "Sessions",
            "contentLevels": [
                "Intermediate"
            ],
            "tagNames": [
                "topic_accessibility",
                "topic_design",
                "type_sessions",
                "level_intermediate"
            ],
            "startTimestamp": 1525824000000,
            "endTimestamp": 1525827600000,
            "livestream": true,
            "youtubeUrl": "https://www.youtube.com/",
            "room": "4902fc2b-dbf1-49dc-828f-2566dde55e03"
        },
        {
            "id": "xyz-456",
            "title": "[Office Hour] Example Office Hours",
            "description": "Come talk to us about using Google's great APIs!\n",
            "type": "Office Hours",
            "tagNames": [
                "type_officehours",
                "topic_cloud"
            ],
            "startTimestamp": 1525879800000,
            "endTimestamp": 1525883400000,
            "livestream": false,
            "youtubeUrl": "",
            "room": "4902fc2b-dbf1-49dc-828f-2566dde55e03"
        }
    ],
    "tags": [
        {
            "id": "0a87138f-6cf7-4a47-a749-0dafd0c84e9c",
            "name": "Accessibility",
            "category": "topic",
            "tag": "topic_accessibility"
        },
        {
            "id": "9f3855b4-62a0-4bc1-b28d-ea7352658cac",
            "name": "Cloud",
            "category": "topic",
            "tag": "topic_cloud"
        }
    ],
    "rooms": [
        {
            "id": "fb8f9af2-c4b3-4cd3-b571-421e2c6ebad1",
            "name": "Amphitheatre"
        },
        {
            "id": "4902fc2b-dbf1-49dc-828f-2566dde55e03",
            "name": "App Reviews tent - B"
        }
    ]
}
```

## User Schedule Data

User event data is stored in [Cloud Firestore](https://firebase.google.com/docs/firestore/).
There is a single top-level collection called 'users'. The data hierarchy is as
follows.

```
'users': collection of documents - keyed by User UID from Firebase Auth
    -> 'registered' : boolean
    -> 'events' : collection of documents - keyed by session ID from Session Data
        -> 'isStarred' : boolean
        -> 'reservationStatus' : string ('RESERVED', 'WAITLISTED', or 'NONE')
```

