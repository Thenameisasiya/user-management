const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const usermodel = require('../model/userModel');


// Load Login Page
const loadlogin = async (req, res) => {
    const messageObj = req.session.message;
    req.session.message = null; // Clear the message from session

    res.render('admin/login', {
        message: messageObj ? messageObj.text : null,
        messageType: messageObj ? (messageObj.isSuccess ? 'success' : 'error') : null,
    });
};

// Admin Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            req.session.message = { text: 'Invalid credentials!', isSuccess: false };
            return res.redirect('/admin/login');
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            req.session.message = { text: 'Invalid credentials!', isSuccess: false };
            return res.redirect('/admin/login');
        }

        req.session.admin = true;
        res.redirect('/admin/dashBoard');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/login');
    }
};


// Load Dashboard
const loaddashBoard = async (req, res) => {
    try {
        if (!req.session.admin) return res.redirect('/admin/login');

        const users = await usermodel.find({});
        const message = req.session.message; // Grab message from session
        req.session.message = null; // Clear the message from session

        res.render('admin/dashBoard', { users, message });
    } catch (error) {
        console.error(error);
        res.render('admin/dashBoard')
    }
};



// Edit User
const editUser = async (req, res) => {
    try {
        const { username } = req.body; // Extracting the updated username from the request body
        const id = req.params.id;

        // Update user in the database
        const user = await usermodel.findByIdAndUpdate(id, { username });

        console.log('User updated successfully:', user);
        res.status(200).json({ success: true, message: 'User updated successfully!' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user!' });
    }
};


// Delete User
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await usermodel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'User deleted successfully!' });
    } catch (error) {
        console.log('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user!' });
    }
};


const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user
        const newuser = new usermodel({
            username,
            email,
            password: hashedPassword
        });

        await newuser.save(); // Save user to the database
        console.log({ username, email, password });
        // Send success response
        res.status(200).json({ success: true, message: 'User added successfully!' });
    } catch (error) {
        console.error('Error adding user:', error); // Log error for debugging
        res.status(500).json({ success: false, message: 'An error occurred while adding user!' });
    }
};




const logout = (req, res) => {
    req.session.admin = null;
    req.session.message = { text: 'Logged out successfully.', isSuccess: true };  // Save message in session
    res.redirect('/admin/login');  // Redirect to avoid resubmission when navigating back
};





module.exports = {
    loadlogin,
    login,
    loaddashBoard,
    editUser,
    deleteUser,
    addUser,
    logout
};