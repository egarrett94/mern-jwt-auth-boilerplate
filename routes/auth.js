require('dotenv').config();
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt');

var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

//gotta post the data otherwise plaintext username/pass
//would be available 
router.post('/login', (req, res, next) => {
	let hashedPass = ''
	let passwordMatch = false

	//look up the user
	User.findOne({email: req.body.email}).then( function(user, err) {
		hashedPass = user.password
		//compare hashedPass to submitted password
		passwordMatch = bcrypt.compareSync(req.body.password, hashedPass)
		if (passwordMatch) {
			//the passwords match, make a token

			var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
				expiresIn: 60*60*24 // expires in 24 hours
			})

			res.json({user, token})
		} else {
			//the passwords don't match
			console.log('passwords dont match')
			res.status(401).json({
				error: true,
				message: 'email or password is incorrect.'
			});
		};
	});
});

router.post('/signup', (req, res, next) => {
	User.findOne({email: req.body.email}).then( function(err, user) {
		if (user) { 
			res.redirect('/auth/signup')
		} else {
			User.create({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			}).then( function(err, user) {
				if (err) {
					res.send(err)
				} else {
					var token = jwt.sign(user, process.env.JWT_SECRET, {
						expiresIn: 60*60*24
					})
					//sends json object
					res.json({user, token})
				};
			});
		};
	});
});

router.post('/me/from/token', (req, res, next) => {
	//check for presence of a token 
	var token = req.body.token;
	//if no token, then...
	if (!token) {
		res.status(401).json({
			message: 'must pass the token'
		});
	} else {
		jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
			if (err) {
				//if token doesn't exist or is invalid
				res.status(401).send(err)
			} else {
				//finds the token and user
				// TODO: why does the "_id" need to be in quotes?
				User.findById({
					'_id': user._id
				}), function(err,user) {
					if (err) {
						res.status(401).send(err)
					} else {
						res.json({user, token})
					}
				}
			}
		})
	}
});


module.exports = router;



