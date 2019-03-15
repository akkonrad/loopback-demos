'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
const readdirp = require('readdirp');
const settings = {
  root: './server/boot',
  entryType: 'directories',
};

const directories = [];
readdirp(settings)
  .on('data', entry => {
    directories.push(
      entry.fullPath,
    );
  })
  .on('end', () => {

    const options = {
      appRootDir: __dirname,
      bootDirs: [
        ...directories,
      ],
    };

    boot(app, options, function(err) {
      if (err) throw err;

      // start the server if `$ node server.js`
      if (require.main === module)
        app.start();
    });

  });
