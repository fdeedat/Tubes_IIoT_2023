const bcrypt = require("bcrypt")
// database thingy
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loginData.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});

// admin stuffs
const homeAdmin = (req, res) => {
    //displaying sql data
    let sql = `SELECT * FROM users`;
    db.all(sql, [], (err,rows)=>{
        if(err) return console.error(err.message);
        res.send(rows);
        let userTemp = [];
        console.log(userTemp);
    });
}

const adminDelete = () => {
    //displaying sql data
    let sql = `DROP TABLE users`;
    db.run(sql);
};

const adminCreate = ()=>{
    //displaying sql data
    let sql = `CREATE TABLE users(nama,NIM,password)`;
    db.run(sql);
};

module.exports = {
    homeAdmin,
    adminCreate,
    adminDelete
};