// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
 
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

// module.exports = authMiddleware; 
const admin = require("../config/firebase");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // Get Firebase ID token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Firebase token missing",
      });
    }

    // console.log(
    //   "Firebase token received:",
    //   token.substring(0, 30) + "..."
    // );

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // console.log("Firebase user:", decodedToken.uid);

    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
    };

    next();

  } catch (error) {
    console.error("Firebase auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

module.exports = protect;