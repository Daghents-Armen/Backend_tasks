const {User, validateUser, roles} = require('./userService');

let user = new User('james', 'admin');

console.log(validateUser(user));
console.log(roles);

