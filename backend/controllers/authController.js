import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 1. Login Compare Password with Hash and Generate JWT Token directly with the admin_account collection (No Mongoose Model needed since it's a single admin)
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Username and Password are required!",
      });
    }

    // Access the admin_account collection directly to find the admin by email/username
    const adminCollection = mongoose.connection.db.collection("admin_account");

    const admin = await adminCollection.findOne({
      identifier: String(identifier).toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    // Generate a JWT token for the authenticated admin
    const token = generateToken(String(admin._id), admin.identifier);

    return res.json({
      message: "Login successful.",
      data: {
        token,
        user: {
          _id: admin._id,
          name: "OVIU Admin",
          email: admin.identifier,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Error while logging in.",
    });
  }
};

// 2. Logout (Since JWT is stateless, we just return a success message. The frontend should handle token removal.)
export const logout = (req, res) => {
  return res.json({
    message: "Logout successful.",
  });
};
