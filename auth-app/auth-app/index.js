const express = require('express');
const sha1 = require('sha1');

const { sign, verify } = require('./jwt');

const { books, users } = require('./data');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4020;

app.use(async (req, res, next) => {
   if (req.url === '/token') {
      next();
   } else {
      try {
         await verify(req.headers.token);

         next();
      } catch (error) {
         res.status(401).send({ error: error });
      }
   }
});

app.get('/books', async (req, res) => {
   res.send(books);
});

app.get('/users', async (req, res) => {
   const { role } = verify(req.headers.token);

   if (role === 0) {
      res.send(users);
   } else {
      res.send([]);
   }
});

app.post('/token', (req, res) => {
   if (req.body.username && req.body.password) {
      const login = (user) => {
         return (
            user.username === req.body.username &&
            user.password === sha1(req.body.password)
         );
      };

      const user = users.find(login);

      if (user) {
         const accessToken = sign({
            id: user.id,
            role: user.role,
         });

         res.send({
            id: user.id,
            role: user.role,
            username: user.username,
            accessToken: accessToken,
         });
      } else {
         res.status(401);
      }
   }

   res.end();
});

app.listen(PORT, () => console.log(PORT));

/*
	GET /books -> string[]
	POST /token { username: string, password: string }
	GET users -> string[]
*/
