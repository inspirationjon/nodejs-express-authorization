const express = require('express');
const sha1 = require('sha1');
const { sign, verify } = require('./jwt');
const { posts, users } = require('./data.js');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(async (req, res, next) => {
   if (req.url === '/login') {
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

app.get('/posts', async (_, res) => {
   res.send(posts);
});

app.post('/posts', async (req, res) => {
   const { role } = await verify(req.headers.token);

   if (role === 0) {
      const { title, body } = req.body;
      posts.push({
         id: posts.length,
         title: title,
         body: body,
      });

      res.send('Your post is added thank you!');
   } else {
      res.send(`Ooops,you can't create posts!`);
   }
});

app.post('/login', (req, res) => {
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
            name: user.username,
         });

         res.send({
            id: user.id,
            role: user.role,
            name: user.username,
            accessToken: accessToken,
         });
      } else {
         res.status(401);
      }
   }

   res.end();
});

app.listen(PORT, () => console.log(PORT));
