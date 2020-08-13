const express = require('express');
const apiRouter = express.Router();


const usersRouter = require('./users');
const routinesRouter = require('./routines');
const activitiesRouter = require('./activities');
const routineActivities = require('./routine_activities');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    console.log('this is the auth..', auth)
    if (!auth) { // nothing to see here
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        try {
            console.log('this is the token...', token)
            const { id } = jwt.verify(token, JWT_SECRET);
            console.log('attempting to find id...', id)
            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch ({ name, message }) {
            next({ name, message });
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
});
apiRouter.use('/users', usersRouter);
apiRouter.use('/routines', routinesRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/routineActivities', routineActivities);
apiRouter.use((error, req, res, next) => {
    res.send(error);
});


module.exports = apiRouter;