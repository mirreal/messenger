
var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments of Express
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var users = [];
var history = [];

app.get('/', function (req, res) {

  if (req.cookies.user == null) {
    res.redirect('/login');
  } else {
    res.sendfile('views/chat.html');
  }
});

app.get('/login', function (req, res) {
  res.sendfile('views/login.html');
});

app.get('/paint', function (req, res) {
  res.sendfile('views/paint.html');
});

app.post('/login', function (req, res) {

  if (users.indexOf(req.body.name) !== -1) {
    res.redirect('/login');
  } else {
    res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  socket.on('online', function (data) {
    socket.name = data.user;

    if (users.indexOf(data.user) == -1) {
      users.push(data.user);
    }
    io.sockets.emit('online', {
      users: users,
      user: data.user
    });
  });

  socket.on('message', function (data) {

    if (data.to == 'all') {
      socket.broadcast.emit('message', data);
    } else {
      var clients = io.sockets.clients();
      clients.forEach(function (client) {

        if (client.name == data.to) {
          client.emit('message', data);
        }
      });
    }
  });

  socket.on('disconnect', function() {
    var index;

    if ((index = users.indexOf(socket.name)) !== -1) {
      users.splice(index, 1);
      socket.broadcast.emit('offline', {
        users: users,
        user: socket.name
      });
    }
  });

  socket.emit('start', {
    history: history
  });

  socket.on('paint', function(data) {
    var msg = {
      circle: data,
      sessionId: data.sessionId
    }

    history.push(msg);

    //if (history.length > 2048) history.shift();
    socket.broadcast.emit('paint', msg);
  });

  socket.on('reset', function() {
    socket.broadcast.emit('reset');
  });

  socket.on('clear', function() {
    history = [];
    socket.broadcast.emit('clear');
  });

});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
