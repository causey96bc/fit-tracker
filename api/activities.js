const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities } = require('../db')



activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /routines");

    // res.send({ message: 'hello from /routines!' });
    next();
});

activitiesRouter.get('/', async (req, res) => {
    const activities = await getAllActivities();

    res.send({
        activities
    });
});
module.exports = activitiesRouter