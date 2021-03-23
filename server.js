'use strict';
// bring in the express libraray
// don't forget to do an npm install express

const express = require('express');
// initalizing the express library so I can use it
const app = express();
const PORT = 3001;
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// turn on the server
app.listen(() => console.log(`listening on ${PORT}`));