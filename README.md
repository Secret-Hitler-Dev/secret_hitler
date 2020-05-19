<h1 align="center">Welcome to Secret Hitler 👋</h1>
<p>
  <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/Secret-Hitler-Dev/secret_hitler?include_prereleases" >

  <a href="https://github.com/Secret-Hitler-Dev/secret_hitler/wiki" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>

  <a href="https://github.com/Secret-Hitler-Dev/secret_hitler/blob/master/LICENSE.md" target="_blank">
    <img alt="License: Creative Commons Attribution--NonCommercial--ShareAlike 4.0 International" src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg" />
  </a>
</p>

> A full-stack web application for the board game Secret Hitler.

### 🏠 [Homepage](https://github.com/Secret-Hitler-Dev/secret_hitler)

## Directory Structure

```
.
├── .github
├── services/
├── ├── __mocks__/ (any file type to mock)
│   ├── apis/
│   │   └── <all server apis>
│   ├── application/ (reactjs)
│   │   ├── media/
│   │   │   └── <all game assets>
│   │   ├── public/
│   │   └── src/
│   ├── models/
│   │   └── <db schemas>
│   ├── tests/
│   │   ├── controllers/
│   │   │   └── <all test controllers>  
│   │   ├── data/
│   │   │   └── <all test data> 
│   │   └── <backend tests>.js
│   ├── .babelrc
│   ├── .env.template
│   ├── package-lock.json
│   ├── package.json
│   ├── server-utils.js
│   ├── server.js
│   └── webpack.config.js
├── .gitignore
├── Code_OF_CONDUCT.md
├── LICENSE.md
└── README.md
```

## MongoDB Setup 

1. This project is created with MongoDb Cloud. Create your own project/cluster [here](https://www.mongodb.com/cloud) for testing purposes.
2. Make acopy and rename `secret_hitler/services/.env.template` to  `secret_hitler/services/.env`
3. Edit the all fields in `< ... >` with your mongo cluster information.

## .env Setup
> Make acopy and rename `secret_hitler/services/.env.template` to  `secret_hitler/services/.env` and Edit the all fields in `< ... >`.

```sh
# MongoDB connection URL
DB_HOST=mongodb+srv://<user>:<password>@<cluster url>/<DB name>?retryWrites=true
# Application secret for token generation and verification
SECRET=<secret>
# Gmail user and pass for sending verification emails for new users
MAIL_USER=<email username>
MAIL_PASS=<email password>
```

## Available commands

```sh
# install all prerequisites
npm install 
# compile and bundle all source code
npm run build
# start the main backend server with build files
npm start 
# start the react dev server
npm run dev 
# run both backend and frontend tests
npm run test 
# run frontend tests
npm run test-frontend 
# run backend tests
npm run dev 
```

## Authors

👤 **Janarthanan Manoharan**

* Github: [@janamano](https://github.com/janamano)

👤 **Kathryn Kodama**

* Github: [@kathrynkodama](https://github.com/kathrynkodama)

👤 **Kalindu De Costa**

* Website: http://kdecosta.com/
* Github: [@kalindudc](https://github.com/kalindudc)

👤 **Mahima Bhayana**

* Website: http://mahima.io/
* Github: [@mahimabhayana](https://github.com/mahimabhayana)

👤 **Mohammed Faizan**

* Github: [@gears961](https://github.com/gears961)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Secret-Hitler-Dev/secret_hitler/issues). 

Note: All PRs must pass existing unit tests and if any new features are introduced, please add necessary unittests.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Janarthanan Manoharan](https://github.com/janamano), [Kathryn Kodama](https://github.com/kathrynkodama), [Kalindu De Costa](https://github.com/kalindudc), [Mahima Bhayana](https://github.com/mahimabhayana), [Mohammed Faizan](https://github.com/gears961).<br />
This project is [Creative Commons Attribution--NonCommercial--ShareAlike 4.0 International](https://github.com/Secret-Hitler-Dev/secret_hitler/blob/master/LICENSE.md) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_