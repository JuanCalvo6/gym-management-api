const express = require('express');

const app = express();
const authRoutes = require('./modules/auth/authRoutes');

app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);


//Test Route
app.get("/api/health", (req,res)=>{
    res.json({status: "ok"});
});


module.exports = app;