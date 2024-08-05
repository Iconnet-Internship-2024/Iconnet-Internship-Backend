const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = {
  // authenticate: async (req, res, next) => {
  //   const token = req.headers["authorization"];

  //   if (!token) {
  //     return res.status(401).json({ message: "Token tidak tersedia" });
  //   }

  //   jwt.verify(token, secretKey, (err, decoded) => {
  //     if (err) {
  //       return res.status(403).json({ message: "Token tidak valid" });
  //     }

  //     req.user = decoded;
  //     next();
  //   });
  // },

  authenticate: async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Token not available" });
      }

      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }
  },

  authorize: async (allowedRoles) => {
    return (req, res, next) => {
      const { role } = req.user;

      if (allowedRoles.includes(role)) {
        next();
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    };
  },
};
