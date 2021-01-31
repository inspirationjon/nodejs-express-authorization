const express = require('express');
const sha1 = require('sha1');
const Config = require('./src/config.js');
const Middleware = require('./src/controller/middleware.js');
const Home = require('./src/controller/home.js');
const Login = require('./src/controller/login.js');

const app = express();

app.use(express.json());

app.use(Middleware.USE);
app.get('/', Home.GET);
app.get('/login', Login.POST);

app.listen(Config.PORT, () => console.log(Config.PORT));
