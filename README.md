# 📖 Book Worm 🐛

## Project Overview

Book Worm is an app that allows users to keep track of their favourite books as well as a reading list (or "to be read" list). I will retrieve book data from the [Google Books API](https://developers.google.com/books) and user's will be able to filter the books data via a search box.

This project serves as learning grounds for Material UI and Node.js, as well as application of React knowledge.

Future improvements may include:

- integration with [Embedded Viewer API](https://developers.google.com/books/docs/viewer/developers_guide) (also by Google).
- list of "quick access" checkbox filters that users can toggle to filter the books displayed

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running This Project Locally

If you wish to run this project on your local machine, you will need to:

1. Clone this repo by running: `git clone https://github.com/Bilaal96/book-worm.git`
   <br/><br/>
1. Install client dependencies

```
# From the root of this project, navigate to the client dir:
cd client

# Then install client dependencies with:
npm install
```

3. Install server dependencies

```
# Navigate from /client dir to /server dir:
cd ../server

# Then install client dependencies with:
npm install
```

4.  Whilst in the `/server` directory, you can run the following npm scripts to run the project on your local machine:

- The server uses [concurrently](https://www.npmjs.com/package/concurrently) (as a development dependency) to run the server and client alongside one another. Run client and server concurrently:
  ```
  npm run dev // this runs both commands below
  ```
- Run client-only:

  ```
  npm run client
  ```

- Run server-only with [nodemon](https://www.npmjs.com/package/nodemon)
  ```
  npm run server
  ```
- Additional notes:

  - For other options check npm scripts (or create your own) in `/server/package.json` or `/client/package.json`

  - `/server/package.json` uses ES6 Imports by including the setting `"type": "module"`
