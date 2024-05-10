# Censhare Transfer Service

This service is developed to synchronize and update the assets of Censhare HCMS and the Wix site media collection.

### Tech Stack

- Node.js;
- Rabbit MQ;
- Redis;
- MongoDB;
- TypeScript;
- Express;
- mongoose;
- amqplib;
- ioredis;
- passport, passport-jwt;
- joi;
- lodash;
- axios;
- wix sdk (@wix/media, @wix/data, @wix/sdk);
- body-parser, cookie-parser, dotenv;

#### How to deploy:

- Set up .env file in the root folder with (See `example.env`);
- Build Docker Image `docker build -t censhare-transfer-service .`;
- Run Docker Container `docker run -p 8080:8080  --rm -it --env-file ./.env --name censhare-transfer-service censhare-transfer-service`;

#### How to Sign up:

- Make `HTTP Post` request to `https://transfer.marketing-laveba.ch/user/registration/step-one` with body `{ "email": "<value>", "password": "<value>" }`;
- Retrieve from response `access token`;
- Set `access token` in HTTP `Authorization` header;
- Make `HTTP Post` request to `https://transfer.marketing-laveba.ch/user/registration/step-two` with body `{
    "wix": {
        "apiKey": "<value>",
        "siteId": "<value>"
    },
    "censhare": {
        "username": "<value>",
        "password": "<value>"
    }
}`;
- Retrieve `access and refresh tokens` and use them in future `HTTP Requests` to Censhare Transfer Service;

#### How to Sign In:

- Make `HTTP Post` request to `https://transfer.marketing-laveba.ch/user/login` with body `{ "email": "<value>", "password": "<value>" }`;
- Retrieve `access and refresh tokens` and use them in future `HTTP Requests` to Censhare Transfer Service;

#### How to refresh access token:

- Make `HTTP Post` request to `https://transfer.marketing-laveba.ch/user/refresh` with body `{ "refreshToken": "<value>" }`;
- Retrieve new `access and refresh tokens` and use them in future `HTTP Requests` to Censhare Transfer Service;

#### How to change password of your account:

- Set `access token` in HTTP `Authorization` header;
- Make `HTTP Put` request to `https://transfer.marketing-laveba.ch/user/password/change` with body `{ "oldPassword": "<value>", "newPassword": "<value>" }`;
- Use new password for future sing in processes;

#### How to delete your account:

- Set `access token` in HTTP `Authorization` header;
- Make `HTTP Delete` request to `https://transfer.marketing-laveba.ch/user/delete/`;

#### How to start synchronization process:

- Sign In or Sign up;
- Set `access token` in HTTP `Authorization` header;
- Make `HTTP Post` request to `https://transfer.marketing-laveba.ch/message/synchronize`;

#### How to start assets upadting process:

- Set `access token` in HTTP `Authorization` header;
- Make `HTTP Post` request to `https://transfer.marketing-laveba.ch/message/notify` with body
  `{
    "ids": [
        "<value>"
    ],
    "subscription": {
        "filter": "<value>",
        "name": "<value>",
        "url": "<value>",
        "key": "<value>"
    }
}`;

### Warning:

- Assets with sizes exceeding the limit will not be uploaded to the Wix platform and will be recorded in the bug collection;

### Assets size limits in bytes:

`{
  Image: 26214400,
  Audio: 52428800,
  Video: 4194304000,
  Document: 1048576000,
  Gif: 15728640,
  Vector: 250000,
  Icon: 26214400,
  Archive: 1048576000,
  "3D": 26214400,
}`
