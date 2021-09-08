import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import Routes from '../client/Routes';
import serialize from 'serialize-javascript';

/** Only Static Router implements context. BrowserRouter does not. */
export default (req, store, context) => {
  const content = renderToString(
    <Provider store={ store }>
      <StaticRouter
        location={ req.path }
        context={ context }>
        <div>{ renderRoutes(Routes) }</div>
      </StaticRouter>
    </Provider>
  );
  /**
   * We will manually pull all these tags out from Helmet lib
    and add them to our html here.
    eg: helmet.title.toString() or helmet.meta.toString()
    It will pull all meta tags with this one function call.
    This is server side behaviour.
    Since until now HTML is not generated and we do not
    have HEAD tag.

    In client side rendering, since HTML is already generated helmet will automatically
    inject tags into head of the document.
   */
  const helmet = Helmet.renderStatic();

  /**
   * Add the bundle.js from webpack.client.js as a script tag
   * so that browser sends a request to load the js file and then
   * attach all event handlers/functions/js in the html code(content) when
   * we do ReactDOM.hydrate in client.js
   *
   * Since we have set the public directory as static. We do not need to
   * add a path like <script src="../public/bundle.js"></script>
   * Express will directly look into public directory for bundle.js
   */
  return `
    <html>
      <head>
        ${helmet.title.toString()}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
      </head>
      <body>
        <div id="my-app-id">${content}</div>
        <script>window.INITIAL_SERVER_STATE=${serialize(store.getState())}</script>
        <script src="bundle.js"></script>
      </body>
    </html>
  `;
}
