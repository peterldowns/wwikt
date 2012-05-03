/**
 * Module dependencies.
 */
var express = require('express'),
    request = require('request'),
    qs = require('querystring'),
    conf = require('./conf');
var app = module.exports = express.createServer();

// Configuration
// > NODE_ENV=foo node app.js to run with config 'foo'
app.set('_title', 'WWIKT — Who Will I Know There?');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.methodOverride());
  app.use(express.session({secret: conf.secret}));
  app.use(express.csrf());
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
app.get('/test', function(req, res){
  console.log(req.query);
  res.send(req.query);
});
app.get('/', function(req, res){
  // GET index
  console.log(conf.perms.join(','));
  res.render('index', {
    title: app.set('_title')
  });
});

app.get('/login', function(req, res){
  var url = 'https://www.facebook.com/dialog/oauth?'+
            'client_id='+ conf.appId +
            '&redirect_uri=' + 'http://wwikt-peterldowns.dotcloud.com/red'+
            //'&redirect_uri=' + 'http://localhost:8080' +
            '&scope=' + conf.perms.join(',') +
            '&state=' + req.session._csrf;
  console.log("Redirect URL = "+url);
  res.redirect(url);
});

app.get('/red', function(req, res){
  //var params = req.query;
  //var session= req.session;
  var base_url = 'https://graph.facebook.com/oauth/access_token';
  var oauth = {
        client_id: conf.appId,
        redirect_uri: 'http://wwikt-peterldowns.dotcloud.com/find',
        client_secret: conf.appSecret,
        code: req.query.code
      };
  console.log(oauth);
  request.post({url:base_url, oauth:oauth}, function(e, r, body){
    console.log(body);
    var data = qs.parse(body);
    res.send(data);
  });
});

app.listen(8080, function(){
  console.log("Loaded with configuration:");
  console.log(conf);
  console.log("---------");
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
