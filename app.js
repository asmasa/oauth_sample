
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , everyauth = require('everyauth')
  , conf = require('./conf');

everyauth
    .everymodule
    .moduleTimeout(3000)
    .moduleErrback(function (err) {
        console.log(err);
    });

everyauth
    .twitter
    .myHostname(conf.twit.hostname)
    .consumerKey(conf.twit.consumerKey)
    .consumerSecret(conf.twit.consumerSecret)
    .handleAuthCallbackError(function (req, res) {
        console.log('handleAuthCallbackError');
    })
    .findOrCreateUser(function (session, accessToken, accessTokenExtra, twitterUserMetaData) {
        console.log('findOrCreateUser');
        console.log('twitterUser:' + twitterUserMetaData);
        for(var i in twitterUserMetaData) {
            console.log(i, ':', twitterUserMetaData[i]);
        }
    })
    .redirectPath('/');

everyauth
    .google
    .myHostname(conf.google.hostname)
    .scope('https://www.googleapis.com/auth/userinfo.profile')
    .appId(conf.google.clientId)
    .appSecret(conf.google.clientSecret)
    .handleAuthCallbackError(function (req, res) {
        console.log('handleAuthCallbackError');
    })
    .findOrCreateUser(function (session, accessToken, accessTokenExtra, twitterUserMetaData) {
        console.log('findOrCreateUser');
    })
    .redirectPath('/');

everyauth.debug = true;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.session({secret: 'bfdwwfjklds'}));
  app.use(express.bodyParser());
  app.use(everyauth.middleware());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
    res.render('index', {title: 'home'});
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
