const express = require('express');
const usersRouter = express.Router();
const { getAllUsers, getUser, createUser, getUserByUsername, getPublicRoutinesByUser } = require('../db');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const token = jwt.sign({ id: 2, username: 'sandra' }, 'my security');
const recoveredData = jwt.verify(token, 'my security');

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
    next();
});

usersRouter.get('/', async (req, res) => {
    // const users = await getAllUsers();
    const users = await getAllUsers();

    res.send({
        users
    });
});
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const SALT_COUNT = 10;
    console.log('body....', req.body)
    try {
        const _user = await getUserByUsername(username);
        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            });
        } if (password.length <= 7) {
            next({
                name: 'PasswordLengthError',
                message: 'The password must be a minimum of at least 8 characters.',
            });
        } else {
            bcrypt.hash(password, SALT_COUNT, async (err, hashedPassword) => {
                // console.log('hashed password', hashedPassword);
                // securedPassword = hashedPassword;
                // console.log('just work please, get the password already,', hashedPassword)
                console.log('_user', hashedPassword)
                const user = await createUser({
                    username,
                    password: `${hashedPassword}`
                });

                const token = jwt.sign({
                    id: user.id,
                    username
                }, process.env.JWT_SECRET, {
                    expiresIn: '1w'
                });
                console.log('getuser', _user)
                //console.log(user)
                res.send({
                    message: "thank you for signing up",
                    token,
                    user
                });
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    // request must have both
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }
    try {
        const user = await getUser({ username, password });
        if (!user) {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        } else {
            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: '1w'
            });
            res.send({ message: "you're logged in!", token: `${token}` });
        }
        // console.log('my user', user)
    } catch (error) {
        console.log(error);
        next(error);
    }
});
usersRouter.get('/:username/routines', async (req, res, next) => {
    const thisUser = req.params.username
    try {
        const routines = await getPublicRoutinesByUser({ username: thisUser });

        if (!routines) {
            next({
                name: 'getPublicRoutineByUserError',
                message: 'cannot get public routine'
            })

        } else {
            res.send(
                routines
            );
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})




module.exports = usersRouter;