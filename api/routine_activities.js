const express = require('express');
const routineActivitiesRouter = express.Router();
const { getAllRoutineActivities, destroyRoutineActivities, getRoutineActivityByRoutineId, updateRoutineActivity, getRoutineById } = require('../db');
const { requireUser } = require('./utils');



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


routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routActivityId = req.params.routineActivityId
        const [{ routineId }] = await getRoutineActivityByRoutineId(routActivityId)
        const routObj = await getRoutineById(routineId)
        console.log('routactivityId....', routActivityId)
        console.log('routobj...', routObj)
        const { duration, count } = req.body
        const updateFields = {}
        if (duration) {
            updateFields.duration = duration;
        }
        if (count) {
            updateFields.count = count;
        }
        console.log('look for the update fields...', updateFields)
        const originalRoutActivity = await getRoutineActivityByRoutineId(routActivityId);
        console.log('this is the original Routineactivity...', originalRoutActivity)
        if (routObj.creator.id === req.user.id) {
            const updatedRoutActivity = await updateRoutineActivity(routActivityId, updateFields);
            console.log('this is the updated RoutineActivity...', updatedRoutActivity)
            res.send({ routine_activities: updatedRoutActivity })
        } else {
            next({ name: 'unauthorizedUserError', message: 'you cannot update a activity unless you are logged in' })
        }
    } catch ({ name, message }) {

        next({ hi: 'hello', name, message })
    }
})

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routActivityId = req.params.routineActivityId
        const [{ routineId }] = await getRoutineActivityByRoutineId(routActivityId)
        const routObj = await getRoutineById(routineId)
        // console.log('routactivityId....', routActivityId)
        // console.log('routid...', routObj)
        const originalRoutActivity = await getRoutineActivityByRoutineId(routActivityId);
        console.log('this is the original Routineactivity...', originalRoutActivity)
        if (routObj.creator.id === req.user.id) {
            const destroyRoutActivity = await destroyRoutineActivities(routActivityId);
            console.log('this is the destroyed RoutineActivity...', destroyRoutActivity)
            res.send({ routine_activities: destroyRoutActivity })
        } else {
            next({ name: 'unauthorizedUserError', message: 'you cannot update a activity unless you are logged in' })
        }
    } catch ({ name, message }) {

        next({ hi: 'hello', name, message })
    }
})





routineActivitiesRouter



module.exports = routineActivitiesRouter