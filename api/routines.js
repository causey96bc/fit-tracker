
const express = require('express');
const routinesRouter = express.Router();

const { getAllRoutines, createRoutine, getRoutineById, destroyRoutine, updateRoutine, addActivitiesToRoutine, getActivityById } = require('../db');
const { requireUser } = require('./utils')



routinesRouter.use((req, res, next) => {
    console.log("A request is being made to /routines");

    // res.send({ message: 'hello from /routines!' });
    next();
});

routinesRouter.get('/', async (req, res) => {
    const routines = await getAllRoutines();

    res.send({
        routines
    });
});
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, public, goal, activities = "" } = req.body;
    const creatorId = req.user.id

    const activArr = activities.trim().split(/\s+/)
    const routineData = {};

    // only send the tags if there are some to send
    if (activArr.length) {
        routineData.activities = activArr;
    }
    console.log("getting the activityArr", activArr)
    console.log('looking for a name...', name)

    try {

        console.log('getting routine data.....', routineData)
        const routine = await createRoutine({ creatorId, name, public, goal })
        console.log("looking for a new routine...", routine)
        if (routine) {
            res.send(routine)
        } else {
            next({ name: 'routine creation error', message: 'there was an error creating a routine ' });
        }
        // add authorId, title, content to postData object
        // const post = await createPost(postData);
        // this will create the post and the tags for us
        // if the post comes back, res.send({ post });
        // otherwise, next an appropriate error object 
    } catch ({ name, message }) {
        next({ name, message });
    }

})
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routine = await getRoutineById(req.params.routineId);

        if (routine && routine.creatorId === req.user.id) {
            const destroyThis = await destroyRoutine(routine.id);

            res.send({ routine: destroyThis });
        } else {
            next(routine ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours"
            } : {
                    name: "PostNotFoundError",
                    message: "That post does not exist"
                });
        }

    } catch ({ name, message }) {
        next({ name, message })
    }
});
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routine = await getRoutineById(req.params.routineId)
        const { public, name, goal } = req.body
        const updateFields = {}
        console.log('this is the routine...', routine)
        console.log('this is req.body...', req.body)
        if (name) { updateFields.name = name }
        if (public) { updateFields.public = public }
        if (goal) { updateFields.goal = goal }
        console.log('this is the updatedFields...', updateFields)
        console.log('is creratorid working..', routine.creator.id)
        if (routine && routine.creator.id === req.user.id) {

            const updatedRoutine = await updateRoutine(routine.id, updateFields);
            console.log('get the name....', name)
            console.log('this is the updated routine', updatedRoutine)
            res.send({ routine: updatedRoutine });
        } else {
            console.log('this shit isnt working....')
        }



    } catch ({ name, message }) {
        next({ name, message })
    }



});
routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    const routine = await getRoutineById(req.params.routineId)
    console.log('this is the routine........', routine)
    const activityObj = await getActivityById(req.body.activityId)

    console.log('get activity object....', activityObj)

    try {
        const addActivity = await addActivitiesToRoutine(routine.id, [activityObj])
        console.log(' looking for a added activty...', addActivity)
        res.send(addActivity)
    } catch ({ name, message }) {
        next({ name, message })

    }
})





module.exports = routinesRouter