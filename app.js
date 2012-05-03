/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express.createServer();

// Configuration
// > NODE_ENV=foo node app.js to run with config 'foo'

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.logger({format: ':method :url'}));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  // GET index
  res.render('index', { title: 'WWIKT — Who Will I Know There?' });
});

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
