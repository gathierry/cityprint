

function User(username, password, pathway) {
	this.username = username; // string
	this.password = password; // crypted string
	this.pathway = pathway; // set
}

module.exports = User;

User.prototype.save = function save(callback) {
    // save user info after register	
};

User.prototype.addPath = function addPath(callback) {
	// add pathway
};

User.get = function get(username, callback) {
	// get info of a user
};