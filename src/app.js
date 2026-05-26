const express = require('express');

const app = express();
const authRoutes = require('./modules/auth/authRoutes');
const professorRoutes = require('./modules/professors/professorRoutes');

app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/professors', professorRoutes);


//Test Route
app.get("/api/health", (req,res)=>{
    res.json({status: "ok"});
});


module.exports = app;