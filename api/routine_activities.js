const express = require('express');
const routineActivitiesRouter = express.Router();
const { getAllRoutineActivities } = require('../db')



routineActivitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /routines");

    // res.send({ message: 'hello from /routines!' });
    next();
});

routineActivitiesRouter.get('/', async (req, res) => {
    const routineActivities = await getAllRoutineActivities();

    res.send({
        routineActivities
    });
});
module.exports = routineActivitiesRouter