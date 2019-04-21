const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const {email, name, password, notificationToken} = req.body;

    const user = new User({
        email, name: name.substring(0,25), password: bcrypt.hashSync(password, 8), notificationToken
    });

    user.save((err, user) => {
        if (err) res.status(500).json({err: 1, msg: err});
        else {
            const token = jwt.sign({ id: user._id }, 'sercretkeyereact');
            const usr = user._doc;
            delete usr.password;
            res.status(201).json({login: 1, token, user: usr});
        }
    });
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email }).populate('friends', 'name').exec((err, user) => {
        if (err) return res.status(500).send({err: 1, msg: err});
        if (!user) return res.status(404).send('No user found.');
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        const token = jwt.sign({ id: user._id }, 'sercretkeyereact');
        const usr = user._doc;
        delete usr.password;
        res.status(200).send({ auth: true, token, user: usr });
    });
};

exports.checkToken = (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'sercretkeyereact', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.findById(decoded.id, {password: 0}).populate('friends', 'name').exec((err, user) => {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");

            res.status(200).send(user);
        });
    });
};
