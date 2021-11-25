# 📖 Book Worm 🐛

## 1 | Project Overview

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Book Worm is an app that allows users to keep track of their favourite books as well as a reading list (or "to be read" list). I will retrieve book data from the [Google Books API](https://developers.google.com/books) and user's will be able to filter the books data via a search box.

This project serves as learning grounds for Material UI and Node.js, as well as application of React knowledge.

Future improvements may include:

- integration with [Embedded Viewer API](https://developers.google.com/books/docs/viewer/developers_guide) (also by Google).
- list of "quick access" checkbox filters that users can toggle to filter the books displayed

## 2 | Running This Project Locally

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

## 3 | Issues Faced During Development

[//]: # 'Pagination'

### 3.1 | Pagination of API Data Retrieved

#### 3.1.1 | The Problem

Requests to the Books API returns an object with various properties. To implement pagination I needed to know how many pages I could split the returned results into. In my initial implementation, I used the `totalItems` property along with a constant I defined (`MAX_SEARCH_RESULTS`) to calculate the total number of pages.

```
// Example - calculating number of pages
Math.ceil(books.totalItems / MAX_SEARCH_RESULTS)
```

The problem with this implementation is that `totalItems` is an inaccurate <strong>estimate</strong> of how many more search results there could be based on the current search term. As a result of this a few issues arose:

- The total number of pages calculated was overestimated - i.e. there were far more pages than there were books available. This was exaggerated as the number of books returned by a search grew.
- For every request made to the Books API, the estimated value of `totalItems` would change. This resulted in the number of pages fluctuating as a user would navigate between pages.

#### 3.1.2 | The Solution / Workaround

To resolve the issue with calculating the number of pages, I was left with a decision to either:

1. Simplify the UI by replacing the Pagination component with Next and Previous buttons - this way the number of pages would no longer have to be calculated.
2. Hard code the number of pages rendered by the Pagination component, thus manually limiting the number of viewable results.

I decided to go with option 2 because the Pagination component provides a better user experience than navigating pages with Next and Previous buttons. This is primarily due to the fact that with the Pagination component the user is aware of the number of pages they can click through, whereas with Next and Previous buttons they would not be aware. As a bonus, the Pagination component is also more aesthetically pleasing too.

#### 3.1.3 | Potential Improvements

Calculate the largest page number that is returned by the API which holds actual results. This could be useful for:

- Handling edge cases where the number of results returned fits within less pages than our hard-coded page limit
- Increasing the range (or number of pages) for viewable results

[//]: # 'Client-Server - Sending and Receiving Cookies'

### 3.2 | Sending and Receiving Cookies Between Client & Server

#### 3.2.1 | The Problem

- Upon successful Signup/Login, I wanted the server to respond with a JWT Cookie that can be used to authenticate user requests
- However, the CORS policy was blocking the client from making cross-origin requests

#### 3.2.2 | The Solution

- To resolve this, I ensured that the client request and server response were setting the correct CORS headers
- In the client’s fetch requests, I specified the `credentials: ‘include’` option
  - This ensures that credentials (such as Cookies) can be read from the response by the client
- On the server, I used the CORS middleware with the following options
  - `credentials: true`
  - `origin: true`
- These options ensure that the correct CORS headers are set in the server response; respectively:
  - Access-Control-Allow-Credentials → ensures that the server can respond with credentials (such as Cookies via Set-Cookie)
  - Access-Control-Allow-Origin → specifies the URL from which acceptable cross-origin requests can be made

[//]: # 'Destroying Auth Cookie On Logout'

### 3.3 | Destroying Auth Cookie On Logout

#### 3.3.1 | Desired Outcome

- In order to authenticate a logged in users’ requests to the server, I used a JWT stored in a Cookie
- For a logout request (i.e. clicking logout button), ideally:
  - client would send the jwt cookie to server
  - server would destroy the cookie by overwriting the cookie via the Set-Cookie header
  - client then sets the new short-lived cookie in the browser, which immediately expires and is removed by the browser

#### 3.3.2 | The Problem

- The client did not send the Cookie with the logout request
- The server did not respond with the new cookie in the Set-Cookie header
- As a result the cookie was not deleted from the browser on logout
- The issue was only present in Chromium browsers

#### 3.3.3 | Debugging & Finding A Solution

##### 3.3.3.1 | Initial Attempt

- Originally, I thought this might be a CORS headers issue
- I tried setting and allowing specific headers via the CORS middleware on the server; using the allowedHeaders & methods options
- I observed the preflight request via the Network tab in Chrome devtools, and tried to make the request “simple” as opposed to preflighted; this did not resolve the issue
- I tried setting headers manually on the server as opposed to leaving it to the CORS middleware and res.cookie() method
- None of the above worked as it was not a CORS related issue

##### 3.3.3.2 | The Solution

- Next I decided to test and observe the logout request in multiple browsers, which helped me realise that the issue was Chromium browser-specific (e.g. Chrome and MS Edge)
- By toggling the devtools' “Disable cache” feature, I observed that the server-response was unfavourably cached and reused by the browser
- After studying various documentation/articles on HTTP Caching, I found that I should specify the `Cache-Control: no-cache` header via the logout request’s init object
- This resulted in the desired headers being set, thus allowing the browser to successfully remove the authentication cookie
