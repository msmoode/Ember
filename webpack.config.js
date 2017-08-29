const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src', 'app', 'app.js'),
  output: {
    path: path.join(__dirname, 'target'),
    filename: 'bundle.js'
  },
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ]
      }
    ]
  }
}
