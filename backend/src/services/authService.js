// services/userService.js
import { pool } from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '76348734687346874363443434343443333333333'; // Ensure this is set in your .env file

// Register User
export const registerUser = async (user) => {
    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email]);
        if (existingUser.length > 0) {
            return { success: false, message: 'User already exists' };
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = `INSERT INTO users (name, email, mobile, password, userType) VALUES (?, ?, ?, ?,?)`;
        const values = [user.username, user.email, user.mobile, hashedPassword,user.userType];
        await pool.query(query, values);
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: 'Registration failed. Please try again later.' };
    }
};

// Login User with JWT token
export const loginUser = async (email, password) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return { success: false, message: 'Incorrect password' };
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, userType:user.userType },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("Generated token:", token); // For debugging
        
        return { 
            success: true, 
            message: 'Login successful', 
            token, 
            user: { id: user.id, email: user.email, userType:user.userType } 
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: 'Login failed. Please try again later.' };
    }
};

// Get User Details from Token
export const getUserFromToken = async (token) => {
    try {
        const trimmedToken = token.trim();
        console.log("Received token:", trimmedToken);

        // Verify token (no `await` needed here)
        const decoded = jwt.verify(trimmedToken, JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Retrieve user details from the database
        const [rows] = await pool.query('SELECT id, name, email, mobile, userType FROM users WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const user = rows[0];
        return { success: true, user };
    } catch (error) {
        console.error("Token verification error:", error);
        return { success: false, message: 'Invalid or expired token' };
    }
};
export const getAllUsersFromService = async (token) => {
    try {
        const trimmedToken = token.trim();
        console.log("Received token:", trimmedToken);

        // Verify token (no `await` needed here)
        const decoded = jwt.verify(trimmedToken, JWT_SECRET);
        console.log("Decoded token:", decoded);

        // You can add logic to check the role if needed (like admin access)
        // Example: if (decoded.role !== 'admin') return { success: false, message: 'Permission denied' }

        // Query to fetch all users
        const [rows] = await pool.query('SELECT id, name, email, mobile, userType FROM users');

        if (rows.length === 0) {
            return { success: false, message: 'No users found' };
        }

        return { success: true, users: rows }; // Return the users from the database
    } catch (error) {
        console.error('Error in getAllUsersFromService:', error);
        return { success: false, message: 'Invalid or expired token or an error occurred' };
    }
};