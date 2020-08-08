// const client = require('./client.js')
// const { createActivities } = require('./activities');
// async function createRoutine({
//     creatorId,
//     name,
//     goal,
//     activities = []
// }) {
//     //await createActivities(name);
//     try {
//         //deconstructs the rows into post creates a query that will inside the values into the database.
//         const { rows: [routine] } = await client.query(`
//       INSERT INTO routines("creatorId", name, goal) 
//       VALUES($1, $2, $3)
//       RETURNING *;
//     `, [creatorId, name, goal]);
//         //updates the tags defined in create tags it also will assign a tag Id to a post. 
//         return routine
//     } catch (error) {
//         throw error;
//     }
// }
// async function getRoutineById(routineId) {
//     try {
//         const { rows: [routine] } = await client.query(`
//         SELECT *
//         FROM routines
//         WHERE id=$1;
//       `, [routineId]);
//         if (!routine) {
//             throw {
//                 name: 'postNotFound error',
//                 message: 'could not find a post with that postId'
//             }
//         }
//         console.log('routine work...', routine)
//         const { rows: [activities] } = await client.query(`
//         SELECT *
//         FROM activities
//         JOIN routine_activities ON activities.id=routine_activities."activityId"
//         WHERE routine_activities."routineId"=$1;
//       `, [routineId])
//         console.log('please work....', activities);
//         const { rows: [creator] } = await client.query(`
//         SELECT id, username
//         FROM users
//         WHERE id=$1;
//       `, [routine.creatorId])

//         routine.activities = activities;
//         routine.creator = creator;

//         delete routine.creatorId;

//         return routine;
//     } catch (error) {
//         throw error;
//     }
// }



// module.exports = {
//     createRoutine,
//     getRoutineById,

// }