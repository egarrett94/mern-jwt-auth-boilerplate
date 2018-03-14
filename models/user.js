var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 1,
		maxLength: 99
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minLength: 5,
		maxLength: 99
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		maxLength: 99
	}
})

userSchema.set('toJSON', {
	transform: function(doc, ret, options) {
		let returnJson = {
			_id: ret._id,
			email: ret.email,
			name: ret.name,
		}
		return returnJson
	}
})

userSchema.methods.authenticated = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, res) {
		if (err) {
			callback(err)
		} else {
			//checks to see if response is defined. 
			// ' this ' is the user model
			callback(null, res ? this : false)
		};
	});
}

//like beforeCreate
userSchema.pre('save', function(next) {
	console.log('we are in the pre save hook');
	var hash = bcrypt.hashSync(this.password, 10);
	this.password = hash;
	next();
})

var User = mongoose.model('User', userSchema);


module.exports = User;



