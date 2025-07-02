const express = require('express');
const cors = require('cors');
//Деректер қоры
const pool= require('./db');
const app = express();
app.use(cors());
app.use(express.json())
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// HW 1-books
app.get('/books/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const result = await pool.query('SELECT * FROM books WHERE id=$1', [id]);
        if(result.rows.length === 0){
            return res.status(404).json({error: 'Book not found'});
        }
        res.json(result.rows[0]);
    }catch(err){
        return res.status(500).json({error: 'Сервер қатесі'});
    }
})

app.get('/books', async (req, res) => {
    const {sort} =req.query;
    try{
        const result = await pool.query(`SELECT * FROM books order by title ${sort}`);
        res.json(result.rows); // get http://localhost:3000/books?sort=asc
    }catch(err){
        
        return res.status(500).json({error: 'Сервер қатесі'});
    }});

   

//users
app.put('/users/:id', async (req, res) => {
    const {id} = req.params;
    const {username,password, age, city} = req.body;
    if (!username || !password || !age || !city) {
        return res.status(400).json({error: 'All fields are required'});
    }
    try{
        const result = await pool.query('UPDATE users SET username=$1, password=$2, age=$3, city=$4 WHERE id=$5 RETURNING *', [username,password, age, city, id]);
        if(result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }
        res.json(result.rows[0]);
    }catch(err){
        return res.status(500).json({error: err.message});
    }
})

app.delete('/users/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
        if(result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }
        res.json(result.rows[0]);
    }catch(err){
        return res.status(500).json({error: 'Сервер қатесі'});
    }
})

//register
app.post('/register', async (req, res) => {
    const {username, password, age, city} = req.body;
    console.log(req.body);
    if (!username || !password || !age || !city) {
        return res.status(400).json({error: 'All fields are required'});
    }
    try{
        const existingUser = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({error: 'Username already exists'});
        }
        
        const result = await pool.query('INSERT INTO users (username, password, age, city) VALUES ($1, $2, $3, $4) RETURNING *', 
            [username, password, age, city]);
            
        res.status(201).json({message: 'User created successfully', user: result.rows[0]});
    }catch(err){
        return res.status(500).json({error: 'Сервер қатесі'});
    }
})

//login
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }
    try{
        const result = await pool.query('SELECT * FROM users WHERE username=$1 AND password=$2', [username, password]);
        const user =result.rows[0]

        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json({message: 'Login successful', user});
    }catch(err){
    
        return res.status(500).json({error: 'Сервер қатесі'});
    }
})


app.get('/users', async (req, res) => {
    const {sort} =req.query;
    try{
        const result = await pool.query(`SELECT * FROM users order by name ${sort}`);
        res.json(result.rows); // get http://localhost:3000/users?sort=asc
    }catch(err){
        
        return res.status(500).json({error: 'Сервер қатесі'});
    }});

   //get  http://localhost:3000/users/search?name=han  //han included in name
        app.get('/users/search', async (req, res) => {
            const {name} = req.query;
            try{
                const result = await pool.query(`SELECT * FROM users WHERE Lower(name) LIKE Lower('%${name}%')`);
                res.json(result.rows);
            }catch(err){
                return res.status(500).json({error: 'Сервер қатесі'});
            }});

 app.get('/users/:id', async (req, res) => {
        const {id} = req.params;
        try{
            const result = await pool.query(`SELECT * FROM users WHERE id=${id}`);
            if(result.rows.length === 0){
                return res.status(404).json({error: 'User not found'});
            }
            res.json(result.rows[0]);
        }catch(err){
            return res.status(500).json({error: 'Сервер қатесі'});
        }});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});