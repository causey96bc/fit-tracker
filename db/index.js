
const client = require('./client.js')
//
//
//
//USERS
async function createUser({
    username,
    password,
}) {
    try {
        const { rows: user } = await client.query(`
      INSERT INTO users (username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);

        return user;
    } catch (error) {
        throw error;
    }
}
async function getAllUsers() {
    // grabs all the users from the database
    try {
        const { rows: user } = await client.query(`
      SELECT id, username
      FROM users;
    `);

        return user;
    } catch (error) {
        throw error;
    }
}
async function updateUser(id, fields = {}) {
    // build the set string
    // Object.keys(feilds) = [name, location]
    /*
    const setString = [name, location].map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    setString = ["name"=1, "location"=2]
    */
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }
    // deconstructs the row array into a user object that can be returned 
    // the "setstring" updates the fields that are mapped above based on
    // the user input.
    try {
        const { rows: [user] } = await client.query(`
      UPDATE users
      SET ${ setString}
      WHERE id=${ id}
      RETURNING *;
    `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    }
}

async function getUser({ username }) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1
        `, [username]);
        return user;
    } catch (error) {
        throw error;
    }
}
//
//Routines
//
//
//
async function createRoutine({
    creatorId,
    name,
    goal,
    activities = []
}) {
    //await createActivities(name);
    try {
        //deconstructs the rows into post creates a query that will inside the values into the database.
        const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", name, goal) 
      VALUES($1, $2, $3)
      RETURNING *;
    `, [creatorId, name, goal]);
        //updates the tags defined in create tags it also will assign a tag Id to a post. 
        const activityList = await Promise.all(activities.map(activity => {
            return createActivities(activity.name, activity.description);
        }));
        return await addActivitiesToRoutine(routine.id, activityList);
    } catch (error) {
        throw error;
    }
}
async function createRoutineActivity(routineId, activityId) {
    try {

        await client.query(`
        INSERT INTO routine_activities("routineId", "activityId")
        VALUES ($1, $2)
        ON CONFLICT ("routineId", "activityId") DO NOTHING;
      `, [routineId, activityId]);

    } catch (error) {
        throw error;
    }
}
async function addActivitiesToRoutine(routineId, activityList) {
    try {
        console.log(activityList)
        const createActivitiesList = activityList.map(
            activity => createRoutineActivity(routineId, activity.id)
        );

        await Promise.all(createActivitiesList);

        return await getRoutineById(routineId);
    } catch (error) {
        throw error;
    }
}
async function getAllRoutines() {
    try {
        const { rows: routineIds } = await client.query(`
        SELECT id
        FROM routines;
      `);

        const routines = await Promise.all(routineIds.map(
            routine => getRoutineById(routine.id)
        ));

        return routines;
    } catch (error) {
        throw error;
    }
}
async function getRoutineById(routineId) {
    try {
        const { rows: [routine] } = await client.query(`
        SELECT *
        FROM routines
        WHERE id=$1;
      `, [routineId]);
        if (!routine) {
            throw {
                name: 'postNotFound error',
                message: 'could not find a post with that postId'
            }
        }
        console.log('routine work...', routine)
        const { rows: [activities] } = await client.query(`
        SELECT *
        FROM activities
        JOIN routine_activities ON activities.id=routine_activities."activityId"
        WHERE routine_activities."routineId"=$1;
      `, [routineId])
        console.log('please work....', activities);
        const { rows: [creator] } = await client.query(`
        SELECT id, username
        FROM users
        WHERE id=$1;
      `, [routine.creatorId])

        routine.activities = activities;
        routine.creator = creator;

        delete routine.creatorId;

        return routine;
    } catch (error) {
        throw error;
    }
}


async function updateRoutine(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }
    // deconstructs the row array into a user object that can be returned 
    // the "setstring" updates the fields that are mapped above based on
    // the user input.
    try {
        const { rows: [routine] } = await client.query(`
  UPDATE routines
  SET ${ setString}
  WHERE "creatorId"=${ id}
  RETURNING *;
`, Object.values(fields));

        return routine;
    } catch (error) {
        throw error;
    }


}



async function getPublicRoutines() {
    try {
        const { rows: [routine] } = await client.query(`
        SELECT *
        FROM routines
        WHERE public=true;
        `);
        return routine
    } catch (error) {
        throw error
    }
}
async function getAllRoutinesByUser({ username }) {
    try {
        const { rows: [userId] } = await client.query(`
    SELECT id
    FROM users
    WHERE username=$1;
    
    `, [username])
        // console.log('this is the username', userId)
        const id = userId.id
        const { rows: routines } = await client.query(`
    SELECT * 
    FROM routines
    WHERE "creatorId"=$1;
    
    `, [id])
        return routines
    } catch (error) {
        throw error
    }
}
async function getPublicRoutineByActivity({ activityId }) {
    try {
        const { rows: [activId] } = await client.query(`
SELECT id
FROM routine_activities
WHERE "activityId"=$1
`, [activityId])
        const id = activId.id
        const { rows: routines } = await client.query(`
SELECT id, public, name, goal
FROM routines
WHERE id=$1;

`, [id])
        return routines
    } catch (error) {
        throw error
    }




}



async function destroyRoutine(id) {
    try {
        const destroy = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineid"=${id}
    DELETE FROM routines
    WHERE id=${id}
    `)
        return destroy
    } catch (error) {
        throw error
    }
}





//
//
//
//
//
// ACTIVITIES
//
async function createActivities(name, description) {
    // maps the taglist into an array of items that can be returned with a constantly updating index.
    // inserts the newly mapped/created values into the databse and selects them when a new tag is created. 
    try {
        await client.query(`
    INSERT INTO activities(name, description)
        VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING;`, [name, description]);
        const { rows } = await client.query(`  SELECT * FROM activities
        WHERE name
            IN  ($1, $2);
    `, [name, description]);
        return rows[0]
    } catch (error) {
        throw error;
    }
}
async function getAllActivities() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM activities;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}
// async function getActivityById(activityId) {
//     try {
//         const { rows: [activity] } = await client.query(`
//         SELECT *
//         FROM activities
//         WHERE id=$1;
//       `, [activityId]);
//         if (!activity) {
//             throw {
//                 name: 'activityNotFound error',
//                 message: 'could not find a activity with that activId'
//             }
//         }
//         console.log('activity work...', activity)
//         //     const { rows: [activities] } = await client.query(`
//         //     SELECT public
//         //     FROM routines
//         //     JOIN routine_activities ON routines.id=routine_activities."routineId"
//         //     WHERE routine_activities."activityId"=$1;
//         //   `, [activityId])
//         console.log('please work....', activity);
//         const { rows: [name, description] } = await client.query(`
//         SELECT id, username
//         FROM users
//         WHERE id=$1;
//       `, [activityId])

//         activity.name = name;
//         activity.description = description


//         delete activity.activityId;

//         return activity;
//     } catch (error) {
//         throw error;
//     }
// }
async function updateActivity(id, fields = {}) {

    // build the set string
    // Object.keys(feilds) = [name, location]
    /*
    const setString = [name, location].map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    setString = ["name"=1, "location"=2]
    */
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }
    // deconstructs the row array into a user object that can be returned 
    // the "setstring" updates the fields that are mapped above based on
    // the user input.
    try {
        const { rows: [activities] } = await client.query(`
  UPDATE activities
  SET ${ setString}
  WHERE id=${ id}
  RETURNING *;
`, Object.values(fields));

        return activities;
    } catch (error) {
        throw error;
    }

}



module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    createRoutine,
    getAllRoutines,
    getRoutineById,
    createRoutineActivity,
    createActivities,
    getAllRoutinesByUser,
    getRoutineById,
    addActivitiesToRoutine,
    getAllActivities,
    getUser,
    updateActivity,
    destroyRoutine,
    updateRoutine,
    getPublicRoutineByActivity,
    getPublicRoutines,
    // getPublicRoutines,

}
