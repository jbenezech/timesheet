An Offline-first Aurelia CLI progressive webapp using PouchDB/CouchDB for storage
============================================================

## Use Case
Staff of an organization need to report every month to their admin the time they spent each day on each projects.
At the end of the month, the admin allocates a budget for each work line and calculates the accounting implications of each budget which are then submitted to the accounting system.

## Production architecture
- Application stored on AWS S3
- Served from Cloudfront
- CouchDB from Cloudant

## Database design
Some fixed databases for shared content:
- accounting : stores accounting rules such as tax rate (see example in design/accounting/example_db.json)
- allocation : stores budget lines which need to be allocated
- interpret : stores the information of interprets used by the organization
- purpose : stores the information on the specific task/project staff spent time on

The timesheets are stored on a per-user database in order to control permissions (no document-level permission possible, at least with Cloudant). Naming convention is ``timesheet-<username>``.

### Users
Users are managed by the built-in ``_users`` database. See example in design/_users/example_doc.json.

### Permissions
- Reader/Writer/Replicator on fixed databases except accounting for everybody
- Reader/Writer/Replicator on user databases for own user and for admin
- Admin permission on _users database for admin, Reader permission for all

## Challenges
### Live sync
PouchDB/CouchDB live sync coupled with Aurelia bindings give a nice real time update of user screens when other users enter information. But this cannot be used for all databases due to browsers restrictions on the number of connections opened to a server.

Domain sharding is implemented for that purpose but it seems Cloudant doesn't support virtual hosts over https yet.

### Scallability
This application is developed for a particular organization with limited staff.
Because it manipulates financial data, it uses a library to do the math (Decmial.js) which cannot be used in CouchDB views.
Cloudant only allows Javascript views so aggregation and decimal calculations cannot be done in the view (due to floating point js limitations).
For these reasons, the application, in its admin part, loads all users timesheets for the month in memory and does the calculation. This will most certainly not scale well.
With a custom CouchDB install, Erlang views could probably solve this issue.

### Tests
They seem to be quite unstable, failing sometimes. Probably timing issues which are hard to predict when writing the tests. Should probably mock the remote couchDB but that seems a lot of work.

## Installation

Semantic-UI won't install with gulp 4.0 which is installed using aurelia cli.
So first, install gulp 3.x, install semantic, then re-install version 4.0

Also, you'll need to edit the downloaded package, see:
https://github.com/Semantic-Org/Semantic-UI/issues/4374#issuecomment-236729805

Install in default semantic folder

Then in the installation folder
```gulp build```

After installing gulp 4.x

```npm install```

Modify the environments file to point to your cloudant account

```
  remoteUrls: [
    'https://xxx.cloudant.com/'
  ]
```

## Run the tests

```au e2e```

## Run the app

```au run```

The app is available on http://localhost:9000