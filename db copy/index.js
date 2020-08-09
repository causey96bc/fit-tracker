
// const client = require('./client.js')

// //Routines
// //
// //
// //
// // async function createRoutine({
// //     creatorId,
// //     name,
// //     goal,
// //     activities = []
// // }) {
// //     //await createActivities(name);
// //     try {
// //         //deconstructs the rows into post creates a query that will inside the values into the database.
// //         const { rows: [routine] } = await client.query(`
// //       INSERT INTO routines("creatorId", name, goal) 
// //       VALUES($1, $2, $3)
// //       RETURNING *;
// //     `, [creatorId, name, goal]);
// //         //updates the tags defined in create tags it also will assign a tag Id to a post. 
// //         const activityList = await Promise.all(activities.map(activity => {
// //             return createActivities(activity.name, activity.description);
// //         }));
// //         return await addActivitiesToRoutine(routine.id, activityList);
// //     } catch (error) {
// //         throw error;
// //     }
// // }

// async function getAllRoutines() {
//     try {
//         const { rows: routineIds } = await client.query(`
//         SELECT id
//         FROM routines;
//       `);

//         const routines = await Promise.all(routineIds.map(
//             routine => getRoutineById(routine.id)
//         ));

//         return routines;
//     } catch (error) {
//         throw error;
//     }
// }
// // async function getRoutineById(routineId) {
// //     try {
// //         const { rows: [routine] } = await client.query(`
// //         SELECT *
// //         FROM routines
// //         WHERE id=$1;
// //       `, [routineId]);
// //         if (!routine) {
// //             throw {
// //                 name: 'postNotFound error',
// //                 message: 'could not find a post with that postId'
// //             }
// //         }
// //         console.log('routine work...', routine)
// //         const { rows: [activities] } = await client.query(`
// //         SELECT *
// //         FROM activities
// //         JOIN routine_activities ON activities.id=routine_activities."activityId"
// //         WHERE routine_activities."routineId"=$1;
// //       `, [routineId])
// //         console.log('please work....', activities);
// //         const { rows: [creator] } = await client.query(`
// //         SELECT id, username
// //         FROM users
// //         WHERE id=$1;
// //       `, [routine.creatorId])

// //         routine.activities = activities;
// //         routine.creator = creator;

// //         delete routine.creatorId;

// //         return routine;
// //     } catch (error) {
// //         throw error;
// //     }
// // }


// async function updateRoutine(id, fields = {}) {

//     const setString = Object.keys(fields).map(
//         (key, index) => `"${key}"=$${index + 1}`
//     ).join(', ');

//     // return early if this is called without fields
//     if (setString.length === 0) {
//         return;
//     }
//     // deconstructs the row array into a user object that can be returned 
//     // the "setstring" updates the fields that are mapped above based on
//     // the user input.
//     try {
//         const { rows: [routine] } = await client.query(`
//   UPDATE routines
//   SET ${ setString}
//   WHERE "creatorId"=${ id}
//   RETURNING *;
// `, Object.values(fields));

//         return routine;
//     } catch (error) {
//         throw error;
//     }


// }



// async function getPublicRoutines() {
//     try {
//         const { rows: [routine] } = await client.query(`
//         SELECT *
//         FROM routines
//         WHERE public=true;
//         `);
//         return routine
//     } catch (error) {
//         throw error
//     }
// }
// async function getAllRoutinesByUser({ username }) {
//     try {
//         const { rows: [userId] } = await client.query(`
//     SELECT id
//     FROM users
//     WHERE username=$1;

//     `, [username])
//         // console.log('this is the username', userId)
//         const id = userId.id
//         const { rows: [routines] } = await client.query(`
//     SELECT * 
//     FROM routines
//     WHERE "creatorId"=$1;

//     `, [id])
//         return routines
//     } catch (error) {
//         throw error
//     }
// }

// async function getPublicRoutinesByUser({ username }) {
//     try {
//         const { rows: [userId] } = await client.query(`
//             SELECT *
//             FROM users
//             WHERE username=$1;
//         `, [username]);
//         console.log(userId)
//         const routineId = userId.id
//         console.log('my routine id', routineId)
//         const { rows: [routines] } = await client.query(`
//             SELECT *
//             FROM routines
//             WHERE "creatorId"=$1 AND public=true;
//         `, [routineId]);
//         return routines;
//     } catch (error) {
//         throw error;
//     }
// }


// async function getPublicRoutineByActivity({ activityId }) {
//     try {
//         const { rows: [activId] } = await client.query(`
// SELECT id
// FROM routine_activities
// WHERE "activityId"=$1
// `, [activityId])
//         const id = activId.id
//         const { rows: routines } = await client.query(`
// SELECT id, public, name, goal
// FROM routines
// WHERE id=$1;

// `, [id])
//         return routines
//     } catch (error) {
//         throw error
//     }
// }



// async function destroyRoutine(id) {
//     try {
//         const destroy = await client.query(`
//     DELETE FROM routine_activities
//     WHERE "routineid"=${id}
//     DELETE FROM routines
//     WHERE id=${id}
//     `)
//         return destroy
//     } catch (error) {
//         throw error
//     }
// }
// //
// //
// //
// //
// //
// // ACTIVITIES
// //
// async function createActivities(name, description) {
//     // maps the taglist into an array of items that can be returned with a constantly updating index.
//     // inserts the newly mapped/created values into the databse and selects them when a new tag is created. 
//     try {
//         await client.query(`
//     INSERT INTO activities(name, description)
//         VALUES ($1, $2)
//             ON CONFLICT (name) DO NOTHING;`, [name, description]);
//         const { rows } = await client.query(`  SELECT * FROM activities
//         WHERE name
//             IN  ($1, $2);
//     `, [name, description]);
//         return rows[0]
//     } catch (error) {
//         throw error;
//     }
// }
// async function getAllActivities() {
//     try {
//         const { rows } = await client.query(`
//             SELECT * FROM activities;
//         `);
//         return rows;
//     } catch (error) {
//         throw error;
//     }
// }

// async function updateActivity(id, fields = {}) {


//     const setString = Object.keys(fields).map(
//         (key, index) => `"${key}"=$${index + 1}`
//     ).join(', ');

//     // return early if this is called without fields
//     if (setString.length === 0) {
//         return;
//     }
//     // deconstructs the row array into a user object that can be returned 
//     // the "setstring" updates the fields that are mapped above based on
//     // the user input.
//     try {
//         const { rows: [activities] } = await client.query(`
//   UPDATE activities
//   SET ${ setString}
//   WHERE id=${ id}
//   RETURNING *;
// `, Object.values(fields));

//         return activities;
//     } catch (error) {
//         throw error;
//     }

// }
// //
// //
// //ROUTINE_ACTIVITIES
// //
// //
// // async function createRoutineActivity(routineId, activityId) {
// //     try {

// //         await client.query(`
// //         INSERT INTO routine_activities("routineId", "activityId")
// //         VALUES ($1, $2)
// //         ON CONFLICT ("routineId", "activityId") DO NOTHING;
// //       `, [routineId, activityId]);

// //     } catch (error) {
// //         throw error;
// //     }
// // }
// // async function addActivitiesToRoutine(routineId, activityList) {
// //     try {
// //         console.log(activityList)
// //         const createActivitiesList = activityList.map(
// //             activity => createRoutineActivity(routineId, activity.id)
// //         );

// //         await Promise.all(createActivitiesList);

// //         return await getRoutineById(routineId);
// //     } catch (error) {
// //         throw error;
// //     }
// // }
// async function updateRoutineActivity(id, fields = {}) {

//     const setString = Object.keys(fields).map(
//         (key, index) => `"${key}"=$${index + 1}`
//     ).join(', ');
//     // console.log("id", id)
//     // console.log("fields", fields)
//     // console.log("string", setString)
//     // return early if this is called without fields
//     if (setString.length === 0) {
//         return;
//     }
//     // deconstructs the row array into a user object that can be returned 
//     // the "setstring" updates the fields that are mapped above based on
//     // the user input.
//     try {

//         const { rows: [activities] } = await client.query(`
//   UPDATE routine_activities
//   SET ${ setString}
//   WHERE "routineId"=${ id}
//   RETURNING *;
// `, Object.values(fields));
//         console.log(activities)
//         return activities;
//     } catch (error) {
//         throw error;
//     }

// }

// async function destroyRoutineActivities(id) {

//     try {
//         const destroy = await client.query(`
//     DELETE FROM routine_activities
//     WHERE id=${id};
//     `)
//         return destroy
//     } catch (error) {
//         throw error
//     }


// }



// module.exports = {

//     // createRoutine,
//     getAllRoutines,
//     // getRoutineById,
//     // createRoutineActivity,
//     createActivities,
//     getAllRoutinesByUser,
//     // getRoutineById,
//     // addActivitiesToRoutine,
//     getAllActivities,
//     updateActivity,
//     destroyRoutine,
//     updateRoutine,
//     updateRoutineActivity,
//     getPublicRoutineByActivity,
//     getPublicRoutinesByUser,
//     getPublicRoutines,
//     // getPublicRoutines,

// }
