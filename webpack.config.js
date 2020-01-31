const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './content_scripts/src/main.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'content_scripts', 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js' ],
  },
};
