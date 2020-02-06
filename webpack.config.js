const path = require('path');
const MiniCssExtractPlugin =  require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './content_scripts/src/main.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'content_scripts', 'dist'),
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
