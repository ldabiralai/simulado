module.exports = {
  mode: 'development',
  entry: `${__dirname}/index.js`,
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/ui',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
