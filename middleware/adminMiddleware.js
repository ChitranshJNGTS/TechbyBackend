// const jwt = require("jsonwebtoken");

// const adminMiddleware = (req, res, next) => {
//   try {
//     // Get token from Authorization header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     // Extract token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Check admin role
//     if (decoded.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin access required",
//       });
//     }

//     // Store admin information in request
//     req.admin = decoded;

//     next();

//   } catch (error) {

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Admin session expired",
//       });
//     }

//     return res.status(401).json({
//       success: false,
//       message: "Invalid admin token",
//     });
//   }
// };

// module.exports = adminMiddleware;  


const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers["x-admin-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin token required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.admin = decoded;

    next();

  } catch (error) {
    console.error("Admin auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }
};

module.exports = adminAuth;