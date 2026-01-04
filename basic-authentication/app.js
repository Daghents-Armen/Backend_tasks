require('dotenv').config({quiet: true});
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

const users = [
    {
        name: 'Alice',
        password: 'password123'
    },

    {
        name: 'Bob',
        password: 'password456'
    }
];

function authenticate(req, res, next){
    const credentials = req.headers.authorization;
    
    if(credentials && credentials.startsWith('Basic ')){
        const base64 = credentials.split(' ')[1];
        const decoded_base64 = Buffer.from(base64, 'base64').toString('utf8');
        const [username, password] = decoded_base64.split(':');
    
        
        for(const user of users){
            if(username === user.name && password === user.password){
                req.user = {username, password};
                return next();
            }
        }

        return res.status(401).send('Unauthorized');
        
    } else {
        return res.status(401).send('Unauthorized');
    }
}

app.get('/public', (req, res) => {
    res.status(200).send('hello');
});

app.get('/dashboard', authenticate, (req, res) => {
    res.send(`Hello ${req.user.username}: Welcome`);
});

app.listen(PORT, () => {
    console.log('server running...');
});