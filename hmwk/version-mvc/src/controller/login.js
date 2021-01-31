const sha1 = require('sha1');
const { users } = require('../model/users.js');
const { sign } = require('../jwt.js');

const POST = (req, res) => {
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
};

module.exports.POST = POST;
