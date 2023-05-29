// const bcrypt = require("bcrypt")
// database thingy
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loginData.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});

// admin stuffs
const homeAdmin = (req, res) => {
    //displaying sql data
    let sql = `SELECT * FROM users`;
    db.all(sql, (err,rows)=>{
        if(err) return console.error(err.message);
        res.send(rows);
        userTemp = rows;
        console.log(userTemp);
    });
}

module.exports = {
    homeAdmin,
};