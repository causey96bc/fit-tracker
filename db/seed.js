const client = require('./client.js');

const {

    getAllUsers,
    createUser,
    updateUser,
    createRoutine,
    getAllRoutines,
    getRoutineById,
    createRoutineActivity,
    createActivities,
    getAllRoutinesByUser,
    addActivitiesToRoutine,
    updateActivity,
    getAllActivities,
    getUser,
    getPublicRoutines,
    getPublicRoutineByActivity,
    updateRoutine,
} = require('./index.js')

async function dropTables() {
    try {
        console.log("starting to drop tables");
        await client.query(`
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS users;`);
        console.log("finished dropping...");
    } catch (error) {
        console.error("Error dropping tables!")
        throw error
    }
}
async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
        CREATE TABLE routines (
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );
        CREATE TABLE activities (
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE routine_activities (
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            UNIQUE("routineId", "activityId"),
            duration INTEGER,
            count INTEGER);
        `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        await createUser({
            username: 'albert',
            password: 'bertie99',
        });
        await createUser({
            username: 'sandra',
            password: '2sandy4me',

        });
        await createUser({
            username: 'glamgal',
            password: 'soglam',

        });

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}
async function createInitialRoutine() {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        console.log("Starting to create routines...");
        await createRoutine({
            creatorId: albert.id,
            name: "Major Gains",
            goal: 'max weight bench press sets',
            activities: [{ name: 'benchpress', description: 'sling the dough' }]
        });

        await createRoutine({
            creatorId: sandra.id,
            name: "fatBurner",
            goal: '5 mile run in 1 hour',
            activities: [{ name: 'newname', description: 'new workout' }]
        });

        await createRoutine({
            creatorId: glamgal.id,
            name: "gluteus maximus",
            goal: '200 squats a night',
            activities: [{ name: 'circuit from hell', description: 'just die' }]
        });
        console.log("Finished creating routines!");
    } catch (error) {
        console.log("Error creating routiness!");
        throw error;
    }
}
async function createInitialActivities() {
    const activityArr = [{
        name: 'workout', description: 'stop being fat',

    },
    {
        name: 'workout', description: 'dont be a wimp'
    }]
    try {
        console.log("starting to create activities...")
        const activity = await Promise.all(activityArr.map(object => {
            createActivities(object.name, object.description)
        }))
        console.log("finished creating activities")
    } catch (error) {
        console.log("error creating activities...")
        throw error
    }
}

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialRoutine();
        await createInitialActivities();
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}







async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log('Calling getUser on users[0]');
        const getUserResult = await getUser({
            username: 'sandra'
        });
        console.log('Result:', getUserResult);

        console.log("Calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id, {
            username: "newname"
        });
        console.log("Result:", updateUserResult);

        console.log('Calling getAllRoutines');
        const routines = await getAllRoutines();
        console.log('Result:', routines);


        console.log('calling getAllActivities');
        const activities = await getAllActivities();
        console.log('getting activities', activities[0]);

        console.log('trying to update activities');
        const actupdate = await updateActivity(activities[0].id, {
            name: 'new activity', description: 'this is new'
        });
        console.log('will you update?', actupdate);



        console.log('trying to update routines');
        const update = await updateRoutine(routines[0].id, {
            public: true, name: "crunch king", goal: '500 crunches'
        });
        console.log('update workout', update)



        console.log('getting a public routine');
        const publicroute = await getPublicRoutines()
        console.log('get the public!!!!', publicroute)


        console.log(' get public by the user');
        const publicUser = await getAllRoutinesByUser({ username: 'newname' });
        console.log('do the damn thing', publicUser);

        console.log('get routine by activityid');
        const routineActivity = await getPublicRoutineByActivity({ activityId: 1 });
        console.log('routineactivityID......', routineActivity)


        // console.log('get public routines')
        // const publicroutine = await getPublicRoutines()
        // console.log('public routine????', publicroutine)


        // console.log("Calling updateRoutine on routines[1], only updating activities");
        // const updateRoutineActivitiesResult = await updateRoutine(routine[0].id, {
        //     activities: [
        //         { name: 'go', description: 'Go for it.' },
        //         { name: 'do', description: 'Just do it.' },
        //         { name: 'be', description: 'Be one with the force.' }
        //     ]
        // });
        // console.log("Result:", updateRoutineActivitiesResult);
        //  console.log("Result:", updateRoutineActivitiesResult);
        //  console.log('Calling getUserById with 1');
        //  const albert = await getUserById(1);
        //  console.log('Result:', johndoe);
        //  console.log('Finished database tests!');
        //  console.log("Calling getRoutinesByActivityName with stop");
        //  const postsWithStop = await getRoutinesByActivityName("stop");
        //  console.log("Result:", postsWithStop);
    } catch (error) {
        console.log("Error during testDB");
        throw error;
    }
}
// async function rebuildDB() {
//     try {
//         client.connect();
//         await dropTables();
//         await createTables();
//         await createInitialUsers();
//         await createInitialRoutine();
//         await createInitialActivities();
//     } catch (error) {
//         console.log("Error during rebuildDB")
//         throw error;
//     }
// }


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());

// testDB();