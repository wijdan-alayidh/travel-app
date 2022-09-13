# Project Instructions

The project will include a simple form where you enter the location you are traveling to and the date you are leaving. If the trip is within a week, you will get the current weather forecast. If the trip is in the future, you will get a predicted forecast.

This Project using these technologyes:

- Node.js and Express Server in Backend
- Asynchronous JavaScript to deal with requests
- HTML , css, sass and js in FrontEnd
- This project also uses webpack 5 to bundle project dependencies
- Jest for testing
- Workbox

## Getting started

### Step 1: install node and npm in your device

1- This project requires you to have pre-installed node.js and npm or yarn to manage node packages:

- To check the node.js version use this command:

`node -v`

If you don't have node.js in your device you can visit [Node.js website to install Node](https://nodejs.org/en/).

- To check the npm version use this command:

`npm -v`

If you don't have npm in your device you can visit [npm website to install npm](https://www.npmjs.com/).

### Step 2 : Clone The project Folder.

### Step 3 : Install all project dependencies

After cloning the repo to your device move to the project Folder and run this command to install all project dependencies

`npm install`

## Setting up the API

### Step 1: Create your own account in Geonames.

This project needs you to create an account in [Geonames API](hhttp://www.geonames.org/export/web-services.html) to get API username use their API.

### Step 2: Create your own account in Weatherbit.

This project needs you to create an account in [Weatherbit API](https://www.weatherbit.io/account/create) to get API key to use their API.

### Step 3: Create your own account in Pixabay.

This project needs you to create an account in [Pixabay API](https://pixabay.com/api/docs/) to get API key to use their API.

### Step 4: Create .env file

Create a new file and name it like this (.env)
This file should have This information to run the project correctly.

`geonames_username='your user name'`
`weatherbit_key='your key'`
`pixabay_key='your key'`

## Run The project

you can run the project in your device using this commands:

- run express server:
  `npm run start`

- run jest test:
  `npm run test`

- run webpack dev version file:
  `npm run build-dev`

- run webpack prod version file:
  `npm run build-prod`
