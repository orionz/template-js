
let express = require('express');
let morgan = require('morgan');
let session = require('express-session')
let app = express();
let bodyParser = require('body-parser');
let sessionConfig = {
  secret: process.env.SESSION_SECRET || 'abc123',
  cookie: {}
}

app.use('/', express.static('public'));
app.use('/opt',  express.static('bower_components'));
app.use(morgan('tiny'));
app.set('trust proxy', 1) // trust first proxy
app.use(session(sessionConfig));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

let _tick = 1;
function tick() {
  _tick = _tick + 1;
  return _tick;
}

function genUserId() {
  return Math.random(10000).toString(36).substr(2,10)
}

function genSessionId() {
  return Math.random(10000).toString(36).substr(2,8)
}

function auth(handler) {
  return (req,res) => {
    let user_id = req.session.user_id || genUserId();
    req.session.user_id = user_id;
    handler(user_id,req,res);
  }
}

function strip_user(user) {
  return {
    session_id: user.session_id,
    active: true,
    state: "{}",
    user: "{}",
  }
}


function touchUser(group_id,user_id,session_id) {
  if (USERS[group_id] == undefined) {
    USERS[group_id] = []
  }
  // console.log("user_id",user_id,"session_id",session_id);
  let user = USERS[group_id].find((n) => { return n.user_id == user_id && n.session_id == session_id })
  if (user == undefined) {
    user = {
      user_id: user_id,
      group_id: group_id,
      arrivals_id: 0,
      messages: {}
    }
    USERS[group_id].push(user);
  }
  return user
}

let USERS = {}
let SESSIONS = {}
let LONGPOLL = {}

function longpoll_handler(session_id,f)
{
    if (LONGPOLL[session_id]) {
      LONGPOLL[session_id]();
    }
    LONGPOLL[session_id] = f;
}

function peers(user){
  return USERS[user.group_id].slice(user.arrivals_id).filter((n) => { return n.session_id != user.session_id }).map((n) => { return strip_user(n) })
}

function should_reply(user) {
  if (Object.keys(user.messages).length > 0) {
    return true;
  }
  if (peers(user).length > 0) {
    return true;
  }
  return false;
}

function gen_reply(user) {
    let reply = {
      session_id: user.session_id,
      user: "{}",
      state: "{}",
      messages: user.messages
    };
    if (user.arrivals_id == 0) {
      console.log(" ---- UPDATES");
      reply.updates = peers(user);
      reply.arrivals =  []
    } else {
      console.log(" ---- ARRIVALS");
      reply.updates =  []
      reply.arrivals = peers(user);
    }
    user.arrivals_id = USERS[user.group_id].length
    user.messages = {};
    return reply;
}

function dispatch_message(to,from,message) {
  if (SESSIONS[to]) {
    console.log("Sending message form ",from," to ", to);
    if (SESSIONS[to].messages[from] == undefined) {
      SESSIONS[to].messages[from] = [message];
    } else {
      SESSIONS[to].messages[from].push(message);
    }
    if (LONGPOLL[to]) {
      LONGPOLL[to]();
      delete LONGPOLL[to];
    }
  } else {
    console.log("Failed to send message form ",from," to ", to);
  }
}

function announce(user) {
  USERS[user.group_id].forEach((n) => {
    if (LONGPOLL[n.session_id]) {
      console.log("ANNOUNCE: ", n.session_id);
      LONGPOLL[n.session_id]();
      delete LONGPOLL[n.session_id];
    }
  })
}


app.get("/d/:id.rtc",auth((function(user_id,req,res) {
  let group_id = req.params.id
  let session_id = req.query.session
  let user = touchUser(group_id,user_id,session_id);
  if (user.session_id == undefined) {
    user.session_id = genSessionId();
    SESSIONS[user.session_id] = user;
    let reply = gen_reply(user);
    console.log("HELLO",reply);
    res.json(reply);
    announce(user);
  } else {
    if (should_reply(user)) {
      let reply = gen_reply(user);
      console.log("NO LONGPOLL",reply);
      res.json(reply);
    } else {
      console.log("SETUP LONGPOLL FOR ",session_id);
      longpoll_handler(session_id, function() {
        let reply = gen_reply(user);
        console.log("LONGPOLL",reply);
        res.json(reply);
      });
    }
  }
})));

app.post("/d/:id.rtc",auth(function(user_id,req,res) {
  let body = req.body;
  let to = body.to;
  let from = body.session_id;
  let message = body.message;
  dispatch_message(to,from,message);
  res.json({ok:true});
}));

/*
app.put("/d/:id.rtc",auth(function(req,res) {
  let body = req.body;
  console.log(body);
  res.json({x:"y"});
}));
*/


let port = process.env.PORT || '3000'
app.listen(port, () => {
  console.log('textnotes-serverlistening on port ' + port);
});

