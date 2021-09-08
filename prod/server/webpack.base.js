module.exports = {
  // Tell webpack to run babel on every file it runs through
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            'react', // for JSX converstion
            'stage-0', // for async code
            ['env', {
              targets: {
                browsers: ['last 2 versions']
              }}
            ]
          ]
        }
      }
    ]
  }
};
