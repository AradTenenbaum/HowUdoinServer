const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Function creates the userID
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

//  Validation checks
function userValidation(username, password) {
    if(username.length < 3) {
        return {status: false, error: 'Username is minimum 3 characters'};
    }
    if(password.length < 6) {
        return {status: false, error: 'Password is minimum 6 characters'};
    }
    return {status: true, error: ''};
}


// Register
// Expected req - username, password
router.post('/register', async (req, res) => {
    // User Validation
    const valid = userValidation(req.body.username, req.body.password);
    if(!valid.status) return res.status(400).send(valid.error);
    // If no username
    if(!req.body.username) return res.status(400).send('Enter username');
    // If no password
    if(!req.body.password) return res.status(400).send('Enter password');
    // If username exists
    const userExist = await User.findOne({username: req.body.username});
    if(userExist) return res.status(400).send('Username exist');
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create userID and check if exist
    let userID = makeid(8);
    let isUserID = await User.findOne({userID: userID});
    while(isUserID) {
        userID = makeid(8);
        isUserID = await User.findOne({userID: userID});
    }
    // Create new user
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        userID
    });
    // Save to DB 
    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login
// Expected req - username, password
router.post('/login', async (req, res) => {
    // If no username
    if(!req.body.username) return res.status(400).send('Enter username');
    // If no password
    if(!req.body.password) return res.status(400).send('Enter password');
    // Is username exists
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Wrong information');
    // Password Check
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Wrong information'); 
    // Send user
    res.send(user);
});

// Friend request
// Expected req - username, requestedUserID
router.post('/friendReq', async (req, res) => {
    // Get reqested user ID
    const user = await User.findOne({userID: req.body.requestedUserID});
    if(!user) return res.status(400).send('No such user');
    // Check if user is already in the requests
    const alreadyReq = user.requests.find(request => request === req.body.username);
    if(alreadyReq) return res.status(400).send('You already sent this user a friend request');
    // Check if user is already a friend
    const alreadyFriend = user.friends.find(friend => friend === req.body.username);
    if(alreadyFriend) return res.status(400).send('You already friend with this user');
    // Add to list
    user.requests.push(req.body.username);
    try {
        await user.save();
        res.send('Friend request has been sent');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Friend add
// Expected req - username, requestUsername
router.post('/friendAdd', async (req, res) => {
    // Get approved user
    const userApproved = await User.findOne({username: req.body.username});
    if(!userApproved) return res.status(400).send('No such user');
    // Get request user
    const userRequest = await User.findOne({username: req.body.requestUsername});
    if(!userRequest) return res.status(400).send('No such user');
    // Check if requestUsername is on the requests list
    const isRequests = userApproved.requests.find(request => request === userRequest.username);
    if(!isRequests) return res.status(400).send('User has not requested');
    // Add to list
    userApproved.friends.push(userRequest.username);
    userRequest.friends.push(userApproved.username);
    userApproved.requests.pull(userRequest.username);
    try {
        await userApproved.save();
        await userRequest.save();
        res.send('Friendship is approved');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;