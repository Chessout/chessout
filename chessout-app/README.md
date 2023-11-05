## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# my notes

# deploy next

```yaml
# next js app.yaml file
env: standard
runtime: nodejs18
service: web-app
handlers:
  - url: /.*
    secure: always
    script: auto
```

## deploy react

```yaml
env: standard
runtime: nodejs18
service: web-app
handlers:
  # Serve all static files with url ending with a file extension
  - url: /(.*\..+)$
    static_files: build/\1
    upload: build/(.*\..+)$
  # Catch all handler to index.html
  - url: /.*
    static_files: build/index.html
    upload: build/index.html
```

### deploy workflow

```bash
# show current gcloud project
gcloud config get-value project

# set project
gcloud config set project chess-out-v2

# build
rm -rf ./build
npm run build

# remove all but build folder and app.yaml file
rm -rf future-next
rm -rf node_modules
rm package-lock.json
rm README.md
rm jsconfig.json
rm package.json
rm -rf public
rm -rf src
rm .gcloudignore
rm .gitignore

# deploy
gcloud app deploy
```
