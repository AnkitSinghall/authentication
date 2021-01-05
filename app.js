const { urlencoded } = require('body-parser');
const express = require('express');

const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req,res)  =>{
    res.send('Dashboard');
})


//Mounting
app.use('/api/v1/users', userRouter);

module.exports = app;