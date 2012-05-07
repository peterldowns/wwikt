/**
 * Module dependencies.
 */
var express = require('express'),
    request = require('request'),
    qs = require('querystring'),
    conf = require('./conf');
var app = module.exports = express.createServer();
app.debug = true;

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

app.get('/', function(req, res){
  // GET index
  req.session.place = req.query.place || req.session.place;
  data = {
    title: app.set('_title') + '— Error',
    appId: conf.appId || null,
    access_token: req.session.access_token || null,
    place: req.session.place || null
  };
  console.log(data);
  res.render('index', data);
});

app.get('/login', function(req, res){
  console.log(req.query);
  req.session.place = req.query.place;
  var url = 'https://www.facebook.com/dialog/oauth?'+
            'client_id='+ conf.appId +
            '&redirect_uri=' + 'http://wwikt-peterldowns.dotcloud.com/redirect'+
            //'&redirect_uri=' + 'http://localhost:8080' +
            '&scope=' + conf.perms.join(',') +
            '&state=' + req.session._csrf;
  console.log("Redirect URL = "+url);
  res.redirect(url);
});

app.get('/redirect', function(req, res){
  //var params = req.query;
  //var session= req.session;
  var url = 'https://graph.facebook.com/oauth/access_token' +
            '?client_id=' + conf.appId + 
            '&redirect_uri=' + 'http://wwikt-peterldowns.dotcloud.com/redirect' +
            '&client_secret=' + conf.appSecret +
            '&code=' + req.query.code;
  
  request.post({url:url}, function(e, r, body){
    console.log(body);
    if (!e && r.statusCode == 200) {
      var data = qs.parse(body);
      console.log(data);
      req.session.access_token = data.access_token;
      req.session.expires = data.expires
      res.redirect('/');
    }
    else {
      res.redirect('/error');
    }
  });
});

app.get('/error', function(req, res){
  res.render('error', {
    title: app.set('_title') + '— Error',
    appId: conf.appId || null,
    access_token: req.session.access_token || null,
    place: req.session.place || null
  });
});

app.get('/fb/*', function(req, res){
  var graph_url = 'https://graph.facebook.com';
  var url = graph_url + req.params[0] + '?access_token=' + req.session.access_token;
  console.log(url);
  request.get({url:url}, function(e, r, body){
    if (!e && r.statusCode == 200){
      var data = qs.parse(body);
      console.log(data);
      console.log(typeof data);
      res.send(body);
    }
    else{
      res.send("Error.");
    }
  });
});

app.get('/logout', function(req, res){
  req.session.access_token = null;
  req.session.expires = null;
  res.redirect('/');
});

app.listen(8080, function(){
  console.log("Loaded with configuration:");
  console.log(conf);
  console.log("---------");
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
