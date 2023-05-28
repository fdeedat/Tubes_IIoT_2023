// Logger Controllers
const bcrypt = require("bcrypt")
// database thingy
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loginData.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});

const logout = (req, res)=>{
    req.logOut((err)=>{
        if(err) return next(err);
        res.redirect('/');
    });
}

const postRegister = async(req,res)=>{
    console.log(req.body);
    const NIM = req.body.NIM;
    const userName = req.body.name;
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        // insert NIM dan password ke database 
        let insert = `
            INSERT INTO users(nama,NIM,password)
            VALUES(?,?,?)
            `;
        let values = [userName,NIM,hashedPassword]
        db.run(insert,values,(err)=>{
            if(err){
                console.error(err.message);
            }else{
                console.log(`inserted users name, NIM, and pass: ${userName}, ${NIM}, ${hashedPassword}`);
            };
        });
        res.redirect("/");
    }catch{
        res.redirect('/register');
    };
};

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  };
  
const checkNotAuthenticated = (req, res, next)=> {
    if (req.isAuthenticated()) {
        return res.redirect('/praktikum')
    }
    next()
}

module.exports = {
    logout,
    postRegister,
    checkAuthenticated,
    checkNotAuthenticated
};