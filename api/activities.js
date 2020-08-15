const express = require('express');
const activitiesRouter = express.Router();
const { requireUser } = require('./utils')
const { getAllActivities, createActivities, getActivityById, updateActivity, getPublicRoutineByActivity } = require('../db')



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
    res.send({ createActivity });
})
activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const activeId = req.params.activityId
    const { name, description } = req.body
    const updateFields = {}
    console.log('looking for req.body..', req.body)
    console.log('activityid=...', activeId)

    if (name) {
        updateFields.name = name;
    }
    if (description) {
        updateFields.description = description;
    }
    try {
        const originalActivity = await getActivityById(activeId);
        console.log('this is the original activity')
        if (originalActivity.id === req.user.id) {
            const updatedActivity = await updateActivity(activeId, updateFields);
            console.log('this is the updated activity', updatedActivity)
            res.send({ activity: updatedActivity })
        } else {
            next({ name: 'unauthorizedUserError', message: 'you cannot update a activity unless you are logged in' })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const activeId = req.params.activityId
    console.log('activeId...', activeId)
    try {
        const public = await getPublicRoutineByActivity({ activityId: activeId });
        console.log('this is the public', public)

        if (!public) {
            next({
                name: 'getPublicRoutineByActivity',
                message: 'cannot get public activity, or it does not exist'
            })

        } else {
            res.send(
                public
            );
        }
    } catch ({ name, message }) {
        next({ name, message })
    }


})





module.exports = activitiesRouter