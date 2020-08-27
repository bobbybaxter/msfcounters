# MSF Counters
A companion app for the mobile game Marvel Strike Force, which provides PvP team counters using React.js on the client side, Node.js on the server side, and Google Sheets as a data store.

**Website:** [https://msfcounters.com](https://msfcounters.com)

**Wiki:** [https://github.com/bobbybaxter/msfcounters/wiki](https://github.com/bobbybaxter/msfcounters/wiki)

**Discord:** [https://discord.gg/eCnE48h](https://discord.gg/eCnE48h)

**Patreon:** [https://patreon.com/saiastrange](https://patreon.com/saiastrange)

## Screenshots
![image of marvel strike force counters site](https://raw.githubusercontent.com/bobbybaxter/msfcounters/master/src/assets/screenshot1.png)

## Installation Instructions
- Clone down this repo
- At the root of the project, run `yarn`
- Set up your own environment and config variables:
  - `server/.config.json`
    - `sheetId` - create a Google Sheet, Publish it, and grab the Sheet ID from the URL
    - `apiKey` - create a Google Service Account to get this
    - `firebaseDbURL` - create a Firebase database for this
    - `patreonClientId` - create a Patreon Developer account for this
    - `patreonClientSecret` - create a Patreon Developer account for this
  - `server/.env` - should be the same, as it's for development, but you'll need to supply the production variables to your Elastic Beanstalk server
  - `server/firebase-config.js` - create Firebase database and get from settings
  - `server/firebase-service-account.js` - get from Firebase settings
  - `server/google-sheets-service-account.js` - create at Google APIs -> Credentials
    - also make sure to enable Google Sheets API in Library menu
  - `src/.firebase.config.json` - get from Firebase settings
  - `.env` - at root for production variables
  - `.env.development.local` - at root for development variables

## How to Run
- In your terminal, type `yarn run dev`

***Note**: if you want to make a production build of this project, type `yarn run build`.  This will create a folder called build with all the minified code you need.*

## How to deploy
Github Pages (I've currently moved away from this, but the functionality should still work in this build):
- In your terminal, type `yarn run deploy`
  - this will build what is currently on your branch and post it to your `origin gh-pages` ref, then delete the build folder

Client:
- In your terminal, at the root of the project, type `yarn run client:deploy`
  - this assumes you have installed the Amazon Web Services CLI and have created an S3 bucket
  - you will need to change the name of the bucket in `package.json` to the name of your bucket (which will normally also be your domain name), like so:
    ``` javascript
    "client:deploy": "yarn run build && aws s3 sync build/ s3://{yourS3bucketname}"
    ```
  - this doesn't require a commit - it will build what is currently on your branch and sync it with your S3 bucket
  - if you don't have Versioning enabled on your S3 bucket, you may need to go into your AWS CloudFront Distribution and create an Invalidation to `/*` so you don't have to wait ~24 hours for CloudFront's CDNs to distribute the changes to your bucket.

Server:
- In your terminal, while in the server folder, type `eb deploy`
  - this assumes you have installed the Elastic Beanstalk CLI and initialized it (`eb init`) and created an Elastic Beanstalk instance for the server to run on (use `eb help` for help).
  - this will deploy the latest commit
  - note: you'll need to provide your production environment variables to the Elastic Beanstalk environment.  I did this through the AWS website, not through the CLI.
