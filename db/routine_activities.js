
// const client = require('./client')
// const { getRoutineById } = require('./routines')
// const { createRoutineActivity } = require('./activities')



// async function addActivitiesToRoutine(routineId, activityList) {
//     try {
//         console.log(activityList)
//         const createActivitiesList = activityList.map(
//             activity => createRoutineActivity(routineId, activity.id)
//         );

//         await Promise.all(createActivitiesList);

//         return await getRoutineById(routineId);
//     } catch (error) {
//         throw error;
//     }
// }
// // async function updateRoutineActivity() {
// //     //code goes here
// // }
// // async function destroyRoutineActivity() {
// //     //code goes here
// // }
// module.exports = {
//     addActivitiesToRoutine,
// }