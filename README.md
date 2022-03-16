<h1>📖 Book Worm 🐛 </h1>

A fullstack web app that allows users to:

-   query the [Google Books API](https://developers.google.com/books) for information about books
-   create an account
-   manage lists of books that they have read, wish to read or are currently reading

Book Worm may be used simply for tracking books (e.g. your personal favourites, good reads or those yet to be read); however, it is particularly useful for anyone who is studying a topic extensively and needs a quick and easy way to store and reference information about their books.

**Table of Contents**

-   [1 | Application Technologies & Features](#1--application-technologies--features)
    -   [1.1 | Tech Used](#11--tech-used)
    -   [1.2 | Features](#12--features)
-   [2 | API Endpoints](#2--api-endpoints)
    -   [2.1 | Querying the Google Books API](#21--querying-the-google-books-api)
    -   [2.2 | Authentication & Authorisation](#22--authentication--authorisation)
    -   [2.3 | Managing User Booklists'](#23--managing-user-booklists)
    -   [2.4 | Managing Books in User Booklists'](#24--managing-books-in-user-booklists)
-   [3 | Running This Project Locally](#3--running-this-project-locally)
-   [4 | Authorisation Implementation](#4--authorisation-implementation)
    -   [4.1 | Why I Used A Custom Implementation Over A Third Party Library](#41--why-i-used-a-custom-implementation-over-a-third-party-library)
    -   [4.2 | Authorisation Flow Overview](#42--authorisation-flow-overview)
        -   [4.2.1 | Silent Authentication - User Persistence via Token Rotation](#421--silent-authentication---user-persistence-via-token-rotation)
        -   [4.2.2 | Redis is used to cache & track valid Access & Refresh Tokens](#422--redis-is-used-to-cache--track-valid-access--refresh-tokens)
-   [5 | Issues Faced During Development](#5--issues-faced-during-development)
    -   [5.1 | Pagination of API Data Retrieved](#51--pagination-of-api-data-retrieved)
        -   [5.1.1 | The Problem](#511--the-problem)
        -   [5.1.2 | The Solution / Workaround](#512--the-solution--workaround)
        -   [5.1.3 | Potential Improvements](#513--potential-improvements)
    -   [5.2 | Sending and Receiving Cookies Between Client & Server](#52--sending-and-receiving-cookies-between-client--server)
        -   [5.2.1 | The Problem](#521--the-problem)
        -   [5.2.2 | The Solution](#522--the-solution)
    -   [5.3 | Destroying Auth Cookie On Logout](#53--destroying-auth-cookie-on-logout)
        -   [5.3.1 | Desired Outcome](#531--desired-outcome)
        -   [5.3.2 | The Problem](#532--the-problem)
        -   [5.3.3 | Debugging & Finding A Solution](#533--debugging--finding-a-solution)
            -   [5.3.3.1 | Initial Attempt](#5331--initial-attempt)
            -   [5.3.3.2 | The Solution](#5332--the-solution)

# 1 | Application Technologies & Features

## 1.1 | Tech Used

-   **Frontend:** React, React Router DOM (v5), [Material UI (v4)](https://v4.mui.com/), Browser Storage APIs
-   **Backend:** Node.js & Express, MongoDB, Mongoose, Redis
-   **Additional:** Google Books API, Fetch API, JSON Web Tokens & Cookies

## 1.2 | Features

-   Implemented a rich UI/UX, leveraging custom CSS in conjunction with Material UI components
-   User Authentication & Authorisation - using Bcrypt and a custom implementation of JWTs & Cookies, respectively

Guest users may:

-   find books using the search box, which queries the [Google Books API](https://developers.google.com/books)
-   view a paginated list of query results

Registered users may:

-   create their own booklists, specifying details (i.e. a name and optional summary of its contents)
-   update details of a booklist
-   view a top-level list — coined as the "Master List" — containing all user-created booklists
-   add, view or delete books in a booklist
-   delete a booklist and its contents

# 2 | API Endpoints

## 2.1 | Querying the Google Books API

-   `GET /api/books` - query the Google Books API with a user-defined search term and paginate the results
-   `GET /api/books/:bookId` - retrieve data for a single book (via its ID) from the Google Books API

## 2.2 | Authentication & Authorisation

-   `POST /api/auth/signup` - register a user (i.e. a DB document in `users` collection)
-   `POST /api/auth/login` - authenticate a user and generate JWTs for authorisation of subsequent requests
-   `GET /api/auth/refresh` - get new auth tokens on expiration of access token (i.e. rotate auth tokens)
-   `GET /api/auth/logout` - log user out & clear user-related data from client

> Note: an in-depth explanation of how I implemented user login & persistence can be found below _(see [here](## 3 | How Auth Works in Book Worm) section)_

## 2.3 | Managing User Booklists'

-   `POST /api/booklists` - create a booklist (i.e. a DB document in `booklists` collection)
-   `GET /api/booklists` - get all booklists owned by the current user
-   `PATCH /api/booklists/:listId` - update a single booklist's details (i.e. name or description)
-   `DELETE /api/booklists/:listId` - delete a single booklist

## 2.4 | Managing Books in User Booklists'

-   `PUT /api/booklists/:listId/books` - updates a booklist's `books` array with a new book object
-   `DELETE /api/booklists/:listId/books/:bookId` - delete a single book from a booklist

# 3 | Running This Project Locally

Follow the steps below, if you wish to run this project on your local machine.

1. Clone this repo by running:

```
git clone https://github.com/Bilaal96/book-worm.git
```

2. Install server dependencies. From the root directory of this project run:

```
npm install
```

3. Navigate to `/client` directory and install dependencies via:

```
cd client && npm install
```

4. Add your own [CRA environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) using `/client/.env.development` and `/client/.env.production`. Also see respective `.example` files.

5. Add your own server environment variables in `/.env`. Also see respective `.example` file. This will require a little extra work:

    - Create a [MongoDB](https://account.mongodb.com/account/login) Cluster and DB user. Set `MONGO_USER` & `MONGO_SECRET` to the username & password (respectively) of the DB user you previously created.
    - Follow [this](https://docs.redis.com/latest/rc/rc-quickstart/) guide to create a Redis DB. Find and set the following `.env` variables from the guide: `REDIS_HOST`, `REDIS_PORT` & `REDIS_SECRET`

6. From the root directory, you can run the project locally in a development environment using the following npm scripts.

    - Run the server and client alongside one another using [concurrently](https://www.npmjs.com/package/concurrently) :

        ```
        # This npm script runs both commands listed below simultaneously
        npm run dev
        ```

    - Run client-only :

        ```
        npm run client
        ```

    - Run server-only with [nodemon](https://www.npmjs.com/package/nodemon) :
        ```
        npm run server
        ```

-   Additional notes:

    -   For other options check npm scripts (or create your own) in `/package.json` or `/client/package.json`

    -   `/package.json` uses ES6 Imports by including the setting `"type": "module"`

# 4 | Authorisation Implementation

## 4.1 | Why I Used A Custom Implementation Over A Third Party Library

As mentioned earlier in the "Features" section, the authorisation flow in Book Worm is a custom solution; i.e. an amalgamation of researched ideas from various articles & tutorials.

This solution may not be the most secure authorisation flow. Extra steps can still be taken to mitigate concerns, such as using a CSRF token to prevent CSRF attacks. However, I took this approach because I wanted to consider and understand what may be happening (fundamentally) under-the-hood when using tools like Passport.js / OAuth for JWT auth flows. For most cases in the real-world, I would use a secure third party package.

## 4.2 | Authorisation Flow Overview

> 💡 Note: a full breakdown of how authorisation works in Book Worm can be found (commented) in the [authController.js](./controllers/authController.js) file.

### 4.2.1 | Silent Authentication - User Persistence via Token Rotation

Once a user is authenticated they are sent a pair of JSON Web Tokens (JWTs); namely an Access & Refresh Token (abbr: <abbr title="Access Token">AT</abbr> & <abbr title="Refresh Token">RT</abbr>, respectively).

To prevent client-side access to the tokens:

-   AT is stored in-memory (app state) on the client machine
-   RT is stored in a HTTP-only Cookie and sent to the client

ATs lifespan is short-lived to minimise security risks in case the token is intercepted by a malicious user; e.g. where the malicious user may impersonate a valid user.

RT has a longer lifespan; it can be set up to a year. When AT expires, as long as RT is valid, a fresh pair of tokens can be retrieved, thus allowing a user to remain logged in. Once RT expires a user must log back into the app.

RT-Cookie is inaccessible from the client, so a 2nd "PERSIST_SESSION" (PS) Cookie is sent alongside RT-Cookie to "shadow" it. As PS-Cookie exists ONLY when RT-Cookie exists, we can indirectly detect the existence of RT-Cookie without exposing the token itself. This check for PS-Cookie occurs whenever an AT expires.

### 4.2.2 | Redis is used to cache & track valid Access & Refresh Tokens

> Terminology:
>
> -   blacklisted -> added to Redis DB to indicate token is invalid
> -   whitelisted -> added to Redis DB to indicate token is valid

If an Access Token (AT) is:

-   valid -> it is sent to and stored in-memory by the client
-   invalid -> it is blacklisted

We compare incoming ATs against the blacklist. If it is blacklisted, the sender is unauthorized to make requests.

If a Refresh Token (RT) is:

-   valid -> it is whitelisted
-   invalid -> removed from whitelist

Incoming RTs are compared against the whitelist. Tokens can only be refreshed/renewed if the RT exists in the whitelist.

# 5 | Issues Faced During Development

[//]: # "Pagination"

## 5.1 | Pagination of API Data Retrieved

### 5.1.1 | The Problem

Requests to the Books API returns an object with various properties. To implement pagination I needed to know how many pages I could split the returned results into. In my initial implementation, I used the `totalItems` property along with a constant I defined (`MAX_SEARCH_RESULTS`) to calculate the total number of pages.

```
// Example - calculating number of pages
Math.ceil(books.totalItems / MAX_SEARCH_RESULTS)
```

The problem with this implementation is that `totalItems` is an inaccurate <strong>estimate</strong> of how many more search results there could be based on the current search term. As a result of this a few issues arose:

-   The total number of pages calculated was overestimated - i.e. there were far more pages than there were books available. This was exaggerated as the number of books returned by a search grew.
-   For every request made to the Books API, the estimated value of `totalItems` would change. This resulted in the number of pages fluctuating as a user would navigate between pages.

### 5.1.2 | The Solution / Workaround

To resolve the issue with calculating the number of pages, I was left with a decision to either:

1. Simplify the UI by replacing the Pagination component with Next and Previous buttons - this way the number of pages would no longer have to be calculated.
2. Hard code the number of pages rendered by the Pagination component, thus manually limiting the number of viewable results.

I decided to go with option 2 because the Pagination component provides a better user experience than navigating pages with Next and Previous buttons. This is primarily due to the fact that with the Pagination component the user is aware of the number of pages they can click through, whereas with Next and Previous buttons they would not be aware. As a bonus, the Pagination component is also more aesthetically pleasing too.

### 5.1.3 | Potential Improvements

Calculate the largest page number that is returned by the API which holds actual results. This could be useful for:

-   Handling edge cases where the number of results returned fits within less pages than our hard-coded page limit
-   Increasing the range (or number of pages) for viewable results

[//]: # "Client-Server - Sending and Receiving Cookies"

## 5.2 | Sending and Receiving Cookies Between Client & Server

### 5.2.1 | The Problem

-   Upon successful Signup/Login, I wanted the server to respond with a JWT Cookie that can be used to authenticate user requests
-   However, the CORS policy was blocking the client from making cross-origin requests

### 5.2.2 | The Solution

-   To resolve this, I ensured that the client request and server response were setting the correct CORS headers
-   In the client’s fetch requests, I specified the `credentials: ‘include’` option
    -   This ensures that credentials (such as Cookies) can be read from the response by the client
-   On the server, I used the CORS middleware with the following options
    -   `credentials: true`
    -   `origin: true`
-   These options ensure that the correct CORS headers are set in the server response; respectively:
    -   Access-Control-Allow-Credentials → ensures that the server can respond with credentials (such as Cookies via Set-Cookie)
    -   Access-Control-Allow-Origin → specifies the URL from which acceptable cross-origin requests can be made

[//]: # "Destroying Auth Cookie On Logout"

## 5.3 | Destroying Auth Cookie On Logout

### 5.3.1 | Desired Outcome

-   In order to authenticate a logged in users’ requests to the server, I used a JWT stored in a Cookie
-   For a logout request (i.e. clicking logout button), ideally:
    -   client would send the jwt cookie to server
    -   server would destroy the cookie by overwriting the cookie via the Set-Cookie header
    -   client then sets the new short-lived cookie in the browser, which immediately expires and is removed by the browser

### 5.3.2 | The Problem

-   The client did not send the Cookie with the logout request
-   The server did not respond with the new cookie in the Set-Cookie header
-   As a result the cookie was not deleted from the browser on logout
-   The issue was only present in Chromium browsers

### 5.3.3 | Debugging & Finding A Solution

#### 5.3.3.1 | Initial Attempt

-   Originally, I thought this might be a CORS headers issue
-   I tried setting and allowing specific headers via the CORS middleware on the server; using the allowedHeaders & methods options
-   I observed the preflight request via the Network tab in Chrome devtools, and tried to make the request “simple” as opposed to preflighted; this did not resolve the issue
-   I tried setting headers manually on the server as opposed to leaving it to the CORS middleware and res.cookie() method
-   None of the above worked as it was not a CORS related issue

#### 5.3.3.2 | The Solution

-   Next I decided to test and observe the logout request in multiple browsers, which helped me realise that the issue was Chromium browser-specific (e.g. Chrome and MS Edge)
-   By toggling the devtools' “Disable cache” feature, I observed that the server-response was unfavourably cached and reused by the browser
-   After studying various documentation/articles on HTTP Caching, I found that I should specify the `Cache-Control: no-cache` header via the logout request’s init object
-   This resulted in the desired headers being set, thus allowing the browser to successfully remove the authentication cookie
