const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers["cookie"];

      if (!authHeader) return res.sendStatus(401);
      const cookie = authHeader.split("=")[1];
      jwt.verify(cookie, secretKey, async (error, decoded) => {
        if (error) {
          return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
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
