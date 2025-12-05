class User{
    constructor(user, role){
        this.user = user;
        this.role = role;
    }
}

function validateUser(user){
    if(!user.name) return false;
    if(!roles.includes(user.name)) return false;
    return true;
}

const roles = ['student', 'roles'];

module.exports = {User, validateUser, roles};

