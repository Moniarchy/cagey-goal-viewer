const express = require('express');
const request = require('request');
const qs = require('querystring');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser')

const app = express();

app.use( bodyParser.json() );


const github_url = 'https://api.github.com';

app.set('port', (process.env.PORT || 5000));

// file to use .env variable
if (app.get('env') !== 'production'){
  require('dotenv').config();
}

// set up sessions
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// views is directory for all template files
app.set('view engine', 'ejs');

// home page
app.get('/', (req, res) => {

  // access_token
  const { github_access_token } = req.session;

  console.log(`TOKEN: ${ github_access_token }`);

  // check if there is a token
  if(!token){
    res.send('<h1>Please Login</h1><a href="login">Login</a>')
  } else {

    request({
      method: 'GET',
      url: `${github_url}/repos/GuildCrafts/web-development-js/issues`,
      headers: {
        'user-agent': 'node.js',
        'authorization': `Token ${ github_access_token }`
      }
    }, (error, response) => {
      if (error) throw error;

      const goals = JSON.parse(response.body);

      console.log( "These are the goals", goals);

      res.json(goals);
    })
  }
});

app.get('/login', (req, res) => {
  // url to get code
  const url = `https://github.com/login/oauth/authorize?${qs.stringify({
    scope: 'repo',
    client_id: process.env.GITHUB_CLIENT_ID
  })}`

  // authorize user
  res.redirect(url);
});

const tokenParams = ( code ) => {
  const client_id = process.env.GITHUB_CLIENT_ID
  const client_secret = process.env.GITHUB_CLIENT_SECRET
  return qs.stringify({ code, client_id, client_secret })
}

app.get('/oauth_callback', (req, res) => {
  // url for token
  const url = `https://github.com/login/oauth/access_token?${tokenParams( req.query.code )}`

  // use the URL to get a token
  request({
    method: 'POST',
    url: url
  }, (error, response) => {
    if (error) throw error;

    // store that token in a session
    const accessToken = qs.parse(response.body).access_token;
    req.session.github_access_token = accessToken;

    // back to home
    res.redirect('/');
  })
});

app.get('/comments', (req, res) => {
  const { github_access_token } = req.session;

  const { number } = req.body;

  const url = `${github_url}/repos/GuildCrafts/web-development-js/issues/${number}/comments`
  // RR- is req.body.number right in the link above?
  request({
    method: 'GET',
    url: url,
    headers: {
      'user-agent': 'node.js',
      'authorization': `Token ${ github_access_token }`
    }
  }, (error, response) => {
      if (error) throw error;

      // these are the commets for an issues
      let comments = JSON.parse(response.body);
      res.json(comments);
    })
});

app.post('/create-comment', (req, res) => {
  const { github_access_token } = req.session;

  // Issue number to create comments
  const { issueNumber, comment } = req.body;

  // test data is below
  // const issueNumber = 36;
  // const comment = { body: 'HELLO WE did it, DEV & MONICA' };

  request({
    method: 'POST',
    url: `${github_url}/repos/GuildCrafts/web-development-js/issues/${issueNumber}/comments`,
    headers: {
      'user-agent': 'node.js',
      'authorization': `Token ${ github_access_token }`
    },
    body: comment,
    json: true
  }, (error, response) => {
      if (error) throw error;

      // let comments = JSON.parse(response.body);
      console.log('created comment', response.body);
      res.json(response.body);
  })
});

app.put('/update-comment', (req, res) => {
  let { github_access_token } = req.session;

  // Issue number to update comments
  const { issueNumber, comment, commentId } = req.body;

  // let issueNumber = req.body.number;
  // let commentId = req.body.commentId;

  let url = `${github_url}/repos/GuildCrafts/web-development-js/issues/${issueNumber}/comments/${commentId}`;

  request({
    method: 'POST',
    url: url,
    headers: {
      'user-agent': 'node.js',
      'authorization': `Token ${ github_access_token }`
    },
    body: comment,
  }, (error, response) => {
      if (error) throw error;

      console.log( "updated comments", response.body);
      res.json(response.body);
  })
})

// test route for ajax calls
app.get('/test', (request, response) => {
  response.sendFile(__dirname + '/views/pages/test.html')
})

app.use(express.static(__dirname+'/views'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/views/pages/index.html')
});

app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')) );
