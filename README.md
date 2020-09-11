This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Project is a resoult of recruitment  assignment for Ardoq.

## Chalenge

1: Create a function that, given a list of integers, returns the highest product between three of those numbers. For example, given the list [1, 10, 2, 6, 5, 3] the highest product would be 10 * 6 * 5 = 300

2: Oslo city bikes has an open API showing real-time data on location and state of the bike stations. 

Your task is to create a small application that utilizes this api to show the stations and the amount of available bikes and free spots a station currently has. You’re free to choose which language and libraries you use. How you show the stations and status is also up to you. 

The api can be found at https://oslobysykkel.no/apne-data/sanntid

## Solution

1. Function can be find in src/taskFunction.ts with test in taskFunction.tes.ts 

2. I used **TypeScript** and **React.js** with **styled-components** and **google maps API** to show oslo city bikes stations.

    i also used some icons from flaticon.com


## Available Scripts

Pleas make sure at you create .env file with variable **REACT_APP_API_KEY**="YOUR_GOOGLE_API_KEY"

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### Live vesion 


Open [https://ardoq-assignment.netlify.app/](https://ardoq-assignment.netlify.app/) to view it in the browser.


