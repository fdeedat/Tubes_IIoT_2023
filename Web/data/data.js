// run only once
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./loginData.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});

// CREATE TABLE users(NIM,password,timestamp)
// CREATE TABLE users(nama,NIM,password)
// DROP TABLE users
let sql = `
CREATE TABLE users(id,nama,NIM,password) 
`;

db.run(sql);