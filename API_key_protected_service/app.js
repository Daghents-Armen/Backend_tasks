require('dotenv').config();
const express = require('express');

const app = express();

const PORT = process.env.PORT;

const start = new Date().toISOString();

let count = 0;

const services = [];

const api_keys = [
    {
        api_key: 'key123',
        name: "Service1",
        role: 'admin'
    },

    {
        api_key: 'key456', 
        name: 'Service2',
        role: 'admin'
    }
];

function check_api_key(req, res, next){
    if(!req.headers['x-api-key']){
       return res.status(401).send('missing api key');
    } else {
        for(const service of api_keys){
            if(req.headers['x-api-key'] === service.api_key){
                req.client = {...service};
                return next();
            }
        }

        return res.status(403).send('Forbidden');
    }
}

app.get('/status', check_api_key, (req, res) => {
    services.push(req.client.name);
    ++count;
    res.send(`${req.client.name} is running`);
});

app.get('/metrics', check_api_key, (req, res) => {
    res.json({
        count: count,
        start: start,
        services: services
    })
});

app.listen(PORT, () => {
    console.log('server running...');
});