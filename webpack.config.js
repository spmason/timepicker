const path = require('path');

module.exports = {
  entry: './timepicker',
  context: path.join(__dirname, 'lib/timepicker'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  }
};
