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

app.use(express.static(__dirname+'/public'));

// set up sessions
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// views is directory for all template files
app.set('view engine', 'ejs');

// click login
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

app.get('/logout', function(req,res){
  req.session.github_access_token = null
  res.redirect('/')
})

// home page
app.get('/goals', (req, res) => {

  // access_token
  const { github_access_token } = req.session;

  // check if there is a token
  if(!github_access_token){
    res.send('<h1>Login here:</h1><br/><a href="login"><button>Login</button></a>')
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

app.get('/goal-detail', (req, res) => {
  // token
  const { github_access_token } = req.session;

  // get specific details
  const { number } = req.body;

  // request for issue/goals detail
  request({
    method: 'GET',
    url: `${github_url}/repos/GuildCrafts/web-development-js/issues/${number}`,
    headers: {
      'user-agent': 'node.js',
      'authorization': `Token ${ github_access_token }`
    }
  }, (error, response) => {
    if (error) throw error;

    const goals = JSON.parse(response.body);

    console.log( "These are the goals", goals);

    // these are the details that are returned
    res.json(goals);
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

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')) );
