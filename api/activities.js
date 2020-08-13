const express = require('express');
const activitiesRouter = express.Router();
const { requireUser } = require('./utils')
const { getAllActivities, createActivities } = require('../db')



activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /activities");

    // res.send({ message: 'hello from /routines!' });
    next();
});

activitiesRouter.get('/', async (req, res) => {
    const activities = await getAllActivities();

    res.send({
        activities
    });
});


activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body
    console.log('the post name  =..', name)
    console.log('the post description =..', description)
    const createActivity = await createActivities(name, description);
    console.log('creating an activity.....', createActivity)
    res.send({ message: 'under construction' });
})
module.exports = activitiesRouter