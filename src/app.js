const express = require('express');
const authRoutes = require('./modules/auth/authRoutes');
const professorRoutes = require('./modules/professors/professorRoutes');
const membershipRoutes = require('./modules/memberships/membershipRoutes');
const clientRoutes = require('./modules/clients/clientRoutes');
const enrollmentRoutes = require('./modules/enrollments/enrollmentRoutes');
const validateToken = require('./middlewares/validateToken');

const app = express();
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/professors', validateToken.validateToken, professorRoutes);
app.use('/api/memberships', validateToken.validateToken, membershipRoutes);
app.use('/api/clients', validateToken.validateToken, clientRoutes);
app.use('/apoi/enrollments', validateToken.validateToken, enrollmentRoutes);

//Test Route
app.get("/api/health", (req,res)=>{
    res.json({status: "ok"});
});


module.exports = app;