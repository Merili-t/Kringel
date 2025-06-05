require('dotenv').config();
const express = require('express');
//const userRoutes = require('./routes/userRoutes');
const app = express()
app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Ühendatud")

const signupRouter = require('./routes/signupRoutes');
app.use("/signup", signupRouter);

// Prefix all user routes with /api
//app.use('/api', userRoutes);

app.listen(5179); 

