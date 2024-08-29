const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = {
  // authenticate: async (req, res, next) => {
  //   try {
  //     const token = req.cookies.token;

  //     if (!token) {
  //       return res.status(401).json({ message: "No token provided. Please login" });
  //     }

  //     jwt.verify(token, secretKey, (error, decoded) => {
  //       if (error) {
  //         return res.status(401).json({ message: "Invalid token or this session has expired. Please login" });
  //       }

  //       req.user = decoded;
  //       next();
  //     });
  //   } catch (error) {
  //     return res.status(403).json({ message: "Token is not valid" });
  //   }
  // },

  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      if (!token) {
        return res.status(401).json({ message: "No token provided. Please login" });
      }

      jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
          return res.status(401).json({ message: "Invalid token or this session has expired. Please login" });
        }

        req.user = decoded;
        next();
      });
    } catch (error) {
      return res.status(403).json({ message: "Token is not valid" });
    }
  },

  authorize: (allowedRoles) => {
    return (req, res, next) => {
      const { roleId } = req.user;

      if (allowedRoles.includes(roleId)) {
        next();
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    };
  },
};
