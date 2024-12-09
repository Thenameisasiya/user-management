const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltround = 10;

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await userSchema.findOne({ email });

        if (user) {
            console.log('User Already exists');
            req.session.message = 'User already exists';
            req.session.messageType = 'error';  // Set messageType to 'error'
            return res.redirect('/user/register');
        }

        const hashedPassword = await bcrypt.hash(password, saltround);

        const newUser = new userSchema({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        req.session.message = 'User created successfully! Please log in'; 
        req.session.messageType = 'success'; // Set messageType to 'success'
        res.redirect('/user/login');
    } catch (err) {
        console.error(err);
        req.session.message = 'An error occurred, please try again';
        req.session.messageType = 'error'; // Set messageType to 'error'
        return res.redirect('/user/register');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login Attempt:', { email, password });
        const user = await userSchema.findOne({ email });

        if (!user) {
            req.session.message = 'No User found!';
            req.session.messageType = 'error'; 
            return res.redirect('/user/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.message = 'Incorrect password';
            req.session.messageType = 'error'; // Set messageType to 'error'
            return res.redirect('/user/login');
        }

        req.session.user = {
            username: user.username,
            email: user.email,
            password: user.password,
        };

        console.log('Session after login:', req.session);
        
        req.session.user = user; 
        req.session.message = 'Login successful!';
        req.session.messageType = 'success'; 
        return res.redirect('/user/userHome');
    } catch (error) {
        console.error('Error during login',error);
        req.session.message = 'An error occurred, please try again';
        req.session.messageType = 'error'; // Set messageType to 'error'
        return res.redirect('/user/login');
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {  // Destroy the session
        if (err) {
            return res.redirect('/user/userHome');  
        }
        res.clearCookie('connect.sid');  
        res.redirect('/user/login'); 
    });
    console.log('User logged out');
};

const loadRegister = (req, res) => {
    const message = req.session.message || null;
    const messageType = req.session.messageType || 'info'; // Default to 'info' if no messageType
    req.session.message = null; // Clear message after displaying
    req.session.messageType = null; // Clear messageType
    res.render('user/register', { message, messageType });
};

const loadLogin = (req, res) => {
    const message = req.session.message || null;
    const messageType = req.session.messageType || 'info'; // Default to 'info' if no messageType
    req.session.message = null; // Clear message after displaying
    req.session.messageType = null; // Clear messageType
    res.render('user/login', { message, messageType });
};

const loadHome = (req, res) => {
    console.log('Session in loadHome:', req.session);
    const user = req.session.user || null;
    if (!user) {
        req.session.message = 'Please log in first';
        req.session.messageType = 'error'; // Set messageType to 'error'
        return res.redirect('/user/login');
    }
    res.render('user/userHome', { user });
};

module.exports = { registerUser, loadRegister, loadLogin, login, loadHome, logout };