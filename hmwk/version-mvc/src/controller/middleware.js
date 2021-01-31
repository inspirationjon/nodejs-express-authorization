const { verify } = require('../jwt.js');

const USE = async (req, res, next) => {
   if (req.url === 'login') {
      next();
   } else {
      try {
         await verify(req.headers.token);

         next();
      } catch (error) {
         res.status(401).send(error);
      }
   }
};

module.exports.USE = USE;
