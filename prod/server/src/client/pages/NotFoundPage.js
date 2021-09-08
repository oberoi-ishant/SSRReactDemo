import React from 'react';

/** Only Static Router implements context. BrowserRouter does not.
 * So the context props passed from Static Router gets renamed and is fed to component
 * with the name statiContext by StaticContext.
 * Since BrowserRouter does not implement context, this staticContext will be undefined
 * during client side rendering, here set a default value to {} to avoid error.
 */
const NotFoundPage = (props) => {
  const { staticContext = {} } = props;
  staticContext.notFound = true;

  return (
    <h1 className="center-align" style={{ marginTop: '200px' }}>
      OOPs! Route not found!
    </h1>
  );
};

export default {
  component: NotFoundPage
};