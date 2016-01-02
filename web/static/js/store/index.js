if (PRODUCTION) {
  module.exports = require('./configure_store.prod');
} else {
  module.exports = require('./configure_store.dev');
}
