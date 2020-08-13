const express = require('express');
const apiRouter = express.Router();


const usersRouter = require('./users');
const routinesRouter = require('./routines');
const activitiesRouter = require('./activities');
const routineActivities = require('./routine_activities');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;
apiRouter.use('/users', usersRouter);
apiRouter.use('/routines', routinesRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/routineActivities', routineActivities);
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    if (!auth) { // nothing to see here
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        try {
            const { id } = jwt.verify(token, JWT_SECRET);
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
apiRouter.use((error, req, res, next) => {
    res.send(error);
});


module.exports = apiRouter;