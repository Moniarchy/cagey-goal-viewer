const express = require('express');
const request = require('request');
const qs = require('querystring');
const cookieSession = require('cookie-session');

const app = express();

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
  let token = req.session.github_access_token;

  console.log(`TOKEN: ${token}`);

  // check if there is a token
  if(!token){
    res.send('<h1>Please Login</h1><a href="login">Login</a>')
  } else {

    request({
      method: 'GET',
      url: `${github_url}/repos/GuildCrafts/web-development-js/issues`,
      headers: {
        'user-agent': 'node.js',
        'authorization': `Token ${token}`
      }
    }, (error, response) => {
      if (error) throw error;

      let goals = JSON.parse(response.body);

      console.log( "These are the goals", goals);

      res.json(goals);
    })
  }
});

app.get('/login', (req, res) => {
  // url to get code
  let url = `${github_url}/login/oauth/authorize?${qs.stringify({
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
  let url = `https://github.com/login/oauth/access_token?${tokenParams( req.query.code )}`

  // use the URL to get a token
  request({
    method: 'POST',
    url: url
  }, (error, response) => {
    if (error) throw error;

    // store that token in a session
    let accessToken = qs.parse(response.body).access_token;
    req.session.github_access_token = accessToken;

    // back to home
    res.redirect('/');
  })
});

app.get('/comments', (req, res) => {
  let token = req.session.github_access_token;

  let issueNumber = req.body.number;

  let url = `${github_url}/repos/GuildCrafts/web-development-js/issues/${issueNumber}/comments`
  // RR- is req.body.number right in the link above?
  request({
    method: 'GET',
    url: url,
    headers: {
      'user-agent': 'node.js',
      'authorization': `Token ${token}`
    }
  }, (error, response) => {
      if (error) throw error;
      let comments = JSON.parse(response.body);
      console.log( "These are the comments :D", comments);
      res.json(comments);
    })
});

app.post('/create-comment', (req, res) => {
  // let token = req.session.github_access_token;

  res.send( req.body.number )
  // Issue number to create comments
  // let issueNumber = req.body.number;
  // let url = `${github_url}/repos/GuildCrafts/web-development-js/issues/${issueNumber}/comments`;
  //
  // request({
  //   method: 'POST',
  //   url: url,
  //   headers: {
  //     'user-agent': 'node.js',
  //     'authorization': `Token ${token}`
  //   }
  // }, (error, response) => {
  //     if (error) throw error;
  //     let comments = JSON.parse(response.body);
  //     console.log( "These are the comments :D", comments);
  //     res.json(comments);
  // })
});

app.put('/update-comment', (req, res) => {
  let token = req.session.github_access_token;

  // Issue number to update comments
  let issueNumber = req.body.number;
  let commentId = req.body.commentId;

  let url = `${github_url}/repos/GuildCrafts/web-development-js/issues/${issueNumber}/comments/${commentId}`;

  request({
    method: 'POST',
    url: url,
    headers: {
      'user-agent': 'node.js',
      'authorization': `Token ${token}`
    }
  }, (error, response) => {
      if (error) throw error;
      let comments = JSON.parse(response.body);
      console.log( "These are the comments :D", comments);
      res.json(comments);
  })
})

app.use(express.static(__dirname+'/views'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/views/pages/index.html')
});

app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')) );
