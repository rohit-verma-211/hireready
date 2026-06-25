import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import blacklistModel from '../models/blacklist.model.js';
import cookieParser from 'cookie-parser';
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return res.status(400).json({
            message: "Username or email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
        username,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
        {
            id: newUser._id,
            username: newUser.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('token', token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    });
}

async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token);

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (token) {
        await blacklistModel.create({
            type: 'logout',
            token   
        });
    }
    res.clearCookie('token');
    res.status(200).json({
        message: "Logout successful"
    });
}
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}
export {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};