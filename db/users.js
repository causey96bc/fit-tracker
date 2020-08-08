// const client = require('./client.js')

// async function getAllUsers() {
//     // grabs all the users from the database
//     try {
//         const { rows: user } = await client.query(`
//       SELECT id, username
//       FROM users;
//     `);

//         return user;
//     } catch (error) {
//         throw error;
//     }
// }
// async function createUser({
//     username,
//     password,
// }) {
//     try {
//         const { rows: user } = await client.query(`
//       INSERT INTO users (username, password) 
//       VALUES($1, $2) 
//       ON CONFLICT (username) DO NOTHING 
//       RETURNING *;
//     `, [username, password]);

//         return user;
//     } catch (error) {
//         throw error;
//     }
// }
// async function updateUser(id, fields = {}) {
//     // build the set string
//     // Object.keys(feilds) = [name, location]
//     /*
//     const setString = [name, location].map(
//         (key, index) => `"${key}"=$${index + 1}`
//     ).join(', ');
//     setString = ["name"=1, "location"=2]
//     */
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
//         const { rows: [user] } = await client.query(`
//       UPDATE users
//       SET ${ setString}
//       WHERE id=${ id}
//       RETURNING *;
//     `, Object.values(fields));

//         return user;
//     } catch (error) {
//         throw error;
//     }
// }
// async function getUser({ username }) {
//     try {
//         const { rows: [user] } = await client.query(`
//             SELECT *
//             FROM users
//             WHERE username=$1
//         `, [username]);
//         return user;
//     } catch (error) {
//         throw error;
//     }
// }











// module.exports = {
//     getAllUsers,
//     createUser,
//     updateUser,
//     getUser,

// }