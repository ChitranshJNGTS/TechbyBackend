const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  console.log("Login request received:", req.body); // Debugging line
  try {
    const { email, password } = req.body;
    

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

   if (password !== process.env.ADMIN_PASSWORD) {
  return res.status(401).json({
    success: false,
    message: "Invalid Password",
  });
}

    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};