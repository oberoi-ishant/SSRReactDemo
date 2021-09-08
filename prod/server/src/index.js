/*
https://github.com/StephenGrider/ReactSSRCasts
const express = require('express');
const React = require('react');
const renderToString = require('react-dom/server').renderToString;
const Home = require('./client/components/Home').default;
const app = express();

Since we are using Webpack to handle all js files...server files and the (client)react files
we can use ES6 modules(import) in the server file as well.
Even though node does not have native support for them.
*/
import 'babel-polyfill'; // for async-await--generatorRuntime is not defined
import express from 'express';
import proxy from 'express-http-proxy';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';

const app = express();
app.use(express.static('public'));

/**
 * Set up proxy middleware before any route configuration.
 * Proxy any req starting with /api to https://react-ssr-api.herokuapp.com/
 * Normally just this is fine app.use('/api', proxy('https://react-ssr-api.herokuapp.com/'));
 * Here extra param to proxy function is passed based
 * on the setup from Stephen using Google oAuth flow.
 *
 * This proxy will only be used for follow up requests from brower->server.
 * It will not be used from intial request from this render server to api server hosted at
 * https://react-ssr-api.herokuapp.com.
 * So when after intial load browser makes ajax requests,  we will use this proxy to forward
 * request to https://react-ssr-api.herokuapp.com.
 *
 * This is required, because browser (renderServer this express server) may be running on a
 * different domain and api server is running on a different domain https://react-ssr-api.herokuapp.com/
 * So when want to authenticate user using cookies (which are DOMAIN based) we will need this.
 * Remember in intial load we just make a GET call to localhost:3000 and it is this server
 * which makes an api call using the same isomorphir action creators written in actions folder to fetch the data. This is server-server call.
 */
app.use('/api',
  proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
      opts.headers['x-forwarded-host'] = 'localhost:3000';
      return opts;
    }
}));

// all get requests
app.get('*', (req, res) => {
  // passing req object to store, to extract cookie from it and pass it to
  // api server during intial load server-server call, tricking the api server
  // and forcing it to believe that request came from a browser (as it has cookies)
  // instead of this render server. This way we can authenticate client for urls that
  // need authentication during intial load when we are rendering app on the server
  // on initial load.
  const store = createStore(req);
  // promises will have array of all network requested fired and returned from loadData

  /** Option 1 */
  // const promises = matchRoutes(Routes, req.path).map(({ route }) => {
  //   /** if loadData function exists in the component, call it */
  //   return route.loadData ? route.loadData(store) : null;
  // }).map((promise) => {
  //   if (promise) { // not null
  //     return new Promise((resolve, reject) => {
  //       // always resolve the promise so that all promises fed to Promise.all below are resolved. So it shows content on the screen. (admins page with 0 admins in case we are not logged in and the /admins api returns 401 not authenticated error)
  //       // Otherwise Promise.all will fail and since there is no .catch to Promise.all
  //       // browser will hand and will see unhandledRejection warning in terminal.
  //       promise
  //         .then(resolve)
  //         .catch(resolve);
  //     });
  //   }
  // });

  // promises will have array of all network requested fired and returned from loadData
  // remember all action creators in actions->index.js are async functions.
  // They will always return a Promise which will be resolved with the value
  // returned by the async function, or rejected with an exception thrown from,
  // or uncaught within, the async function.
  /** Option 2 */
  const promises = matchRoutes(Routes, req.path).map(({ route }) => {
    /** if loadData function exists in the component, call it */
    return route.loadData
      ? new Promise((resolve, reject) => {
        /**
         * wrap route.loadData(store) in a new Promise that always resolves.
         * Always resolve the outer promise so that all promises fed to Promise.all
         * below are resolved.
         * So it shows content on the screen. (admins page with 0 admins in case we are
         * not logged in and the /admins api returns 401 not
         * authenticated error and we are not redirecting the
         * user to other route if not logged in)
         * Otherwise Promise.all will fail and since there is no .catch to Promise.all
         * browser will hand and will see unhandledRejection warning in terminal.
         * */
        route.loadData(store)
          .then(resolve)
          .catch(resolve)
      })
      : null;
  });

  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req, store, context);

    /**
     * if there is a Redirect, check prod/server/src/client/components/hocs/requireAuth.js
     * redirect the user.
     */
    console.log(context);
    if (context.url) {
      res.redirect(301, context.url);
    }

    /**
     * See if route is not defined.
     * Check StaticRouter in renderer.js and NotFoundPage.js
     * */
    if (context.notFound) {
      res.status(404);
    }
    res.send(content);

    /**
     * If we use renderToNodeStream function instead of renderToString in renderer.js from react-dom/server.
     * We will be in trouble. renderToNodeStream builds part of html sends to browser, then builds some more html send to browser until complete html is generated. So it works like a stream. This reduces the time to first byte (TTFB) in network performance tab and user sees contents more quickly.
     * But gotcha here is. with renderToNodeStream when we start sending data to browser we are committed to it.
     * In out setup, here we see once we say res.send(content); we are instantaneously sending response to browser. Now if we realise that we should not show user admins page as he is not logged in...we cannot redirect to / with renderToNodeStream.
     * we cannot change the status code to 301 redirect.
     * Thus we are using renderToString. There are solutions to overcome the above issue in SSR but they are workaround. So just keep in mind. Important for Server Side Rendering. So maybe use renderToNodeStream when sending a large volume of data to browser like a news feed or lot of text content ...so as soon as some part is built user starts seeing it as opposed to waiting of entire html page to be ready before sending to browser.
     */

  });

});

app.listen(3000, () => {
  console.log('------------ Express Server listening at PORT 3000  ------------');
});