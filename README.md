WUF Quick Start Application
=============================
The WUF Quick Start Application, which is a part of the WUF repos at [https://github.com/anvil-open-software/wuf](https://github.com/anvil-open-software/wuf), is intended to be used as a baseline, plain-vanilla application for quickly creating a new web-based application from scratch. 


Installation and Setup
-----------------------
The setup process includes the following steps, in order.  Additional details about each step follows below.

1. Set up your development environment
2. Create a new project based on Quick Start app
3. Customize App Code
4. Bootstrap the new app
5. Run the new app

### 1. Set Up Your Development Environment

Follow the steps below to set up your development environment and install dependencies.

#### Dependencies
The following are dependencies for WUF development:
* [Node.js](https://nodejs.org/en/) version 8.0.0 or greater, installed globally - A JavaScript runtime built on Chrome's V8 JavaScript engine. 
* [Yarn](https://yarnpkg.com/en/) version 1.10.0 or greater, installed globally - A dependency management system that replaces NPM.  Yarn is required over NPM for WUF development because of WUF's dependency on Yarn Workspaces for inter-linking package dependencies.  Do not use NPM with WUF because it has the potential to conflict with Yarn and cause problems.
* [Angular](https://angular.io/guide/Quick Start) version 6.1.0 or greater, installed globally - This is installation includes Angular-CLI.
* [Typescript](https://www.typescriptlang.org/) version 2.9.2 or greater, installed globally - Typescript is a typed superset of JavaScript that compiles to plain JavaScript and it is the language in which all of our Angular application development is done.

### 2. Create a New Project Based on the Quick Start App 

Clone this repo into a new project folder (e.g., `my-proj`):
```bash
git clone https://github.com/anvil-open-software/wuf-quick-start
cd my-proj
```

Discard everything "git-like" by deleting the `.git` folder:
```bash
rm -rf .git  # non-Windows
rd .git /S/Q # windows
```

#### Create a new git repo

Initialize this project as a *local git repo* and make the first commit:
```bash
git init
git add .
git commit -m "Initial commit"
```

Create a *remote repository* for this project on the service of your choice.

Grab its address (e.g. *`https://github.com/<my-org>/<project-name>.git`*) and push the *local repo* to the *remote*:
```bash
git remote add origin https://github.com/<my-org>/<project-name>
git push -u origin master
```

### 3. Customize App Code

There are a number of different places where the application code should be updated to reflect the needs of your own app.  You should make the following changes in each of these files:

#### package.json
* Replace the "name" field value ("@anviltech/wuf-quick-start") with your application name.
* Reset the version number to 1.0.0.
* Replace the "author" field with your own name.

#### angular.json
Replace the string "@anviltech/wuf-quick-start" with your application name.  The application name here should match that from the `package.json` file.

#### configuration.ts
Replace the "id", "name", and "copyright" properties in the file `./src/app/_internal/configuration/configuration.ts` with information specific to your app.  Refer to the [Living Style Guide](https://github.com/anvil-open-software/wuf) for more information on using the application configuration options.

##### app.module.ts (optional)
The application comes bundled with a fake backend provider (see below) to intercept API requests and return them with fake data.  This can be helpful when you are developing, but shouldn't be used in a production environment.  Reference the section below on the fake backend to learn how to disable or use the fake backend.

### 4. Bootstrap the New App

Follow these steps to bootstrap your new app:

1. `cd` to the project's root folder (`~/my-proj`)
2. Run the following command:

```bash
 $ npm run bootstrap
```

OR

```bash
 $ yarn bootstrap
```

The bootstrap script will install packages and then do an `ng build --prod` for the new app.

**NOTE:** The bootstrap script may take a while when run the first time.  

Once the above steps are completed, your new app should be ready to run (see below).

### 5. Run the New App

```bash
$ npm run start
```

OR

```bash
$ yarn start
```

The Quick Start application can now be viewed at:
[http://localhost:4200/](http://localhost:4200/)

BFF (Backend for Frontend)
-----------------------
The Quick Start app comes bundled with an Express.js backend which is enabled by default.  When running, the Express server functions as a [Backend for Frontend](https://samnewman.io/patterns/architectural/bff/) and is used to receive API request from the frontend application (i.e., Angular).  

When developing locally (`npm run start` or `yarn start`), the Angular application and the Express server both run in parallel and you'll see console log messages issued from both in the same terminal.  This allows the application to be viewed in a browser at [http://localhost:4200/](http://localhost:4200/) while any requests from the front end to `/api/[modelname]` are passed through by the Angular application to the Express server running on port :3000.  The mechanism that tells Angular to pass through request for any URL starting with `/api/[modelname]` is configured by the `proxy.conf.json` file along with the `proxyConfig` attribute in `angular.json`.  

The Express server will then handle the API request and return data via the standard HTTP protocol on the :3000 port.

Any changes made to local files during development are picked up by Angular and/or nodemon (which monitor local file changes) and refresh the application in the browser automatically.  This makes for a very handy (and efficient) development environment!

In a production environment (`npm run start:prod` or `yarn start:prod`) both the Angular application and the server files are compiled and the Angular server is no longer needed.  The BFF will handle all requests for the application itself ***and*** the API requests and both will be served on the :3000 port.

In this configuration the BFF can serve static data directly from the server files at `/server/routes/api` or (more practically) be configured to connect with more sophisticated API endpoints where the endpoints may retrieve data from databases, for example.  It is up to you to configure your BFF files at `/server/routes/api/*` to handle incoming requests.  You can handle such requests in the BFF files or you can kick off additional requests from the BFF to other API endpoints to retrieve data.  Which you do entirely up to you and beyond the scope of these instructions.

If, for whatever reason, you'd like to turn ***off*** the BFF and simply fake the API requests from the Angular application, you can do this using the Fake Backend Provider (see below).

Fake Backend Provider
-----------------------
The Quick Start app also comes bundled with a "Fake Backend Provider".  This provider includes an HttpInterceptor that will intercept certain API requests from the app (e.g., '/api/users') and return fake data.  It may be helpful for front-end developers to provide fake data in the UI during development without having to worry about any backend services (including the BFF).

The fake backend is enabled by default for development purposes but should NOT be used in a production environment.

To use the fake backend to intercept request before they are sent to the BFF, simply add route handling in `/src/app/_internal/fake-backend`.
1. Set the value for the `simulatedDelay` var in `/src/app/_internal/fake-backend/fake-backend.service.ts`.  This will determine how long to delay responses from the fake backend, simulating network latency.  WARNING: It's important to note that this delay is imposed on ALL requests before any are handled by the fake backend or passed through to the BFF.  The default delay is 0 seconds so be aware that increasing this value and failing to disable the fake backend will impose and additional delay on top of any real network latency.  This would be bad.
2. Add logic in `/src/app/_internal/fake-backend/fake-backend.service.ts` to intercept any API requests you expect to be issued by the application and return fake data.  Any API requests not handled in this file will get passed on to the BFF.

The fake backend isn't adding much (if any) overhead to the app, so unless you increase the simulatedDelay value above 0, it won't really harm anything.  However, it **is** extra code bloat and shouldn't be used in a production environment.  To turn off the fake backend when you no longer need it:
* Commend out the `fakeBackendProvider` line in the providers section of `/src/app/app.module.ts`.  That's it.  The fake backend will no longer be used.  All API requests will now pass through to the BFF.

***NOTE*** that the fake backend is (out of the box) providing the data used to perform fake user authentication, and return fake user configuration data.  Be sure to change this code so that such data is, instead, being provided from a ***real*** backend when such a backend is available.  Also be sure to read the relevant information on ***configuration*** and the use of the ***navigation component*** from the [Living Style Guide](https://github.com/anvil-open-software/wuf).

Testing the Application
-----------------------

Run unit tests on the app with:
```bash
$ npm run test
```

OR 

```bash
$ yarn test
```

Run integration (e2e) tests on the app with:
```bash
$ ng e2e
```

Running in Production Mode (no Docker)
--------------------------
To run the application in production mode, issue the following command:

```bash
$ npm run start:prod
```

OR 

```bash
$ yarn start:prod
```

The application and server files will be compiled and then the Express server will serve the app on port :3000.  The application can then be viewed in your browser at:
[http://localhost:4200/](http://localhost:3000/)


Using Docker
--------------------------
[Docker](https://www.docker.com/) is an excellent tool and is highly recommended for production deployments.

To build your application and wrap it into a docker image, issue the following command:

```bash
$ npm run docker:build
```

OR 

```bash
$ yarn docker:build
```

Your docker image is now ready for publishing.  To push your docker image to a docker repo at `myOrg/myApplicationName`, you would issue the following command:

```bash
docker push myOrg/myApplicationName
```

You can also build your application and run it in production mode directly from a docker image on your local machine.  The following command will build your application and server files, wrap them into a docker image, and then run the server from inside the docker image:

```bash
$ npm run docker:start
```

OR 

```bash
$ yarn docker:start
```


More Information
----------------
The [Living Style Guide](https://github.com/anvil-open-software/wuf) maintain copious instructions and examples on the usage of the components from the [WUF Library of Components](https://github.com/anvil-open-software/wuf) used by your new application.  It is highly recommended that your study this material and keep a link handy for reference.

The Living Style Guide will soon be available for reference as online material. [Link TBD]
