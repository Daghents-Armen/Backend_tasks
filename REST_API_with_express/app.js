require('dotenv').config();
const express = require('express');
const fs = require('node:fs').promises;
const path = require('node:path'); 

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

const task_path = path.resolve(__dirname, 'data', 'task.json');

function auth(req, res, next){
    if(!req.headers['x-api-key']){
        return res.status(401).send('Unauthorized');
    } else if(req.headers['x-api-key'] !== API_KEY){
        return res.status(403).send('Forbidden');
    } else {
        return next();
    }
}

app.get('/tasks', async (req, res) => {
    
    try {
        let tasks_arr;

    try {
    const data = await fs.readFile(task_path, 'utf-8');
    tasks_arr = JSON.parse(data);
    } catch {
        tasks_arr = [];
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));
    };

    res.status(200).json(tasks_arr);


    } catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
    let tasks_arr;

        try {
        const data = await fs.readFile(task_path, 'utf-8');
        tasks_arr = JSON.parse(data);

        } catch {
        tasks_arr = [];
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));
        }

        const index = tasks_arr.findIndex(task => task.id === id);
        
        if(index === -1){
            return res.status(404).send('Invalid task');
        }
        
        res.status(200).json(tasks_arr[index]);

    } catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post('/tasks', auth, async (req, res) => {
    const body = req.body;

    if(!body.title || !body.description){
        return res.status(400).send('something is missing...');
    }

    try {
        let tasks_arr;

        try {
        const data = await fs.readFile(tasks_arr, 'utf-8');
        tasks_arr = JSON.parse(data);

        } catch {
        tasks_arr = [];
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));

        }

        body.id = Date.now().toString();
        body.completed = false;
        body.createdAt = new Date().toISOString().split('.')[0];

        tasks_arr.push(body);
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));

        res.status(200).json(body);

    } catch(error) {
        res.status(500).send({error: error.message});
    }
});

app.patch('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if(body.completed === undefined){
        return res.status(400).send('something is missing...');
    };
    

    try {
        let tasks_arr;

        try {
        const data = await fs.readFile(task_path, 'utf-8');
        tasks_arr = JSON.parse(data);

        } catch {
        tasks_arr = [];
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));

        }

        const index = tasks_arr.findIndex(task => task.id === id);

        if(index === -1){
            return res.status(404).send('Invalid task');
        };
        
        
        tasks_arr[index].completed = body.completed;
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));

        res.status(200).json(tasks_arr[index]);

    } catch(error){
        return res.status(500).json({error: error.message});
    }
});

app.delete('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id;

    try {
    let tasks_arr;

        try {
        const data = await fs.readFile(task_path, 'utf-8');
        tasks_arr = JSON.parse(data);

        } catch {
        tasks_arr = [];
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));

        }

        const index = tasks_arr.findIndex(task => task.id === id);

        if(index === -1){
            return res.status(404).send('Invalid task');
        }

        tasks_arr.splice(index, 1);
        
        await fs.writeFile(task_path, JSON.stringify(tasks_arr, null, 2));

        res.status(201).json({message: 'task deleted successfully'})

    } catch(error){
        return res.status(500).json({error: error.message});
    }
})

app.listen(PORT, () => {
    console.log('server is running...');
})


