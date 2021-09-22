# 📖 Book Worm 🐛

## 1 | Project Overview

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Book Worm is an app that allows users to keep track of their favourite books as well as a reading list (or "to be read" list). I will retrieve book data from the [Google Books API](https://developers.google.com/books) and user's will be able to filter the books data via a search box.

This project serves as learning grounds for Material UI and Node.js, as well as application of React knowledge.

Future improvements may include:

- integration with [Embedded Viewer API](https://developers.google.com/books/docs/viewer/developers_guide) (also by Google).
- list of "quick access" checkbox filters that users can toggle to filter the books displayed

## 2 | Issues Faced During Development

<details>
    <summary>
        <h3 style="display:inline-block">2.1 | Pagination of API Data Retrieved</h3>
    </summary>
    <div style="margin: 0 0 0 26px">
        <div style="margin: 16px 0 0">
            <h4>2.1.1 | The Problem</h4>
            <div style="margin: 8px 0 0 0">
                <p>Requests to the Books API returns an object with various properties. To implement pagination I needed to know how many pages I could split the returned results into. In my initial implementation, I used the <code>totalItems</code> property along with a constant I defined (<code>MAX_SEARCH_RESULTS</code>) to calculate the total number of pages.</p>
                <p style="margin: 0 0 0 16px"><code>// Example - calculating number of pages</code></p>
                <p style="margin: 0 0 8px 16px"><code>Math.ceil(books.totalItems / MAX_SEARCH_RESULTS)</code></p>
                <p>The problem with this implementation is that <code>totalItems</code> is an inaccurate <strong>estimate</strong> of how many more search results there could be based on the current search term. As a result of this a few issues arose:
                    <ul>
                        <li>The total number of pages calculated was overestimated - i.e. there were far more pages than there were books available. This was exaggerated as the number of books returned by a search grew.</li>
                        <li>For every request made to the Books API, the estimated value of <code>totalItems</code> would change. This resulted in the number of pages fluctuating as a user would navigate between pages.</li>
                    </ul>
                </p> 
            </div>
        </div>
        <hr>
        <div style="margin: 8px 0 0 0">
            <h4>2.1.2 | The Solution / Workaround</h4>
            <div style="margin: 8px 0 0 0">
                <p>To resolve the issue with calculating the number of pages, I was left with a decision to either:
                    <ol>
                        <li>Simplify the UI by replacing the Pagination component with Next and Previous buttons - this way the number of pages would no longer have to be calculated.</li>
                        <li>Hard code the number of pages rendered by the Pagination component, thus manually limiting the number of viewable results.</li>
                    </ol>
                </p>
                <p>I decided to go with option 2 because the Pagination component provides a better user experience than navigating pages with Next and Previous buttons. This is primarily due to the fact that with the Pagination component the user is aware of the number of pages they can click through, whereas with Next and Previous buttons they would not be aware. As a bonus, the Pagination component is also more aesthetically pleasing too.</p>
            </div>
        </div>
        <hr>
        <div style="margin: 8px 0 0 0">
            <h4>2.1.3 | Potential Improvements</h4>
            <div style="margin: 8px 0 0 0">
                <ul>
                    <li>Calculate the largest page number that is returned by the API which holds actual results. This could be useful for:
                        <ul>
                            <li>Handling edge cases where the number of results returned fits within less pages than our hard-coded page limit</li> 
                            <li>Increasing the range (or number of pages) for viewable results</li> 
                        </ul> 
                    </li>
                </ul>        
            </div>
        </div>
    </div>
</details>
<br/>

## 3 | Running This Project Locally

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
