require('dotenv').config();
const express = require('express');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

function auth(req, res, next){
    const bearer_token = req.headers.authorization;

    if(bearer_token && bearer_token.startsWith('Bearer ')){
        const extracted_token = bearer_token.split(' ')[1];

        if(tokens[extracted_token]){
            req.user = tokens[extracted_token];
            return next();
        }

        return res.status(401).send('Unauthorized');

    } else {
        return res.status(401).send('Unauthorized');
    } 

}

const users = [
    {
        name: 'Alice',
        password: 'password123',
        role: 'admin'
    },

    {
        name: 'Bob',
        password: 'password456',
        role: 'user'
    }
];

const tokens = {};

app.post('/login', (req, res) => {
    const username = req.body.name;
    const pswd = req.body.password;

    for (const user of users){
        if(user.name === username && user.password === pswd){
            const token = Math.random().toString(36).substring(2, 15);

            
            tokens[token] = {
                username: username,
                role: user.role
            };
            
            return res.send(token);
        }
    }

    return res.status(401).send('Invalid');
    
});

app.get('/profile', auth, (req, res) => {
    res.json(req.user);
});

app.get('/admin', auth, (req, res) => {
    if(req.user.role !== 'admin'){
        res.status(403).send('only admins');
    }

    res.send('welcome');
})

app.listen(PORT, () => {
    console.log('server running...');
})