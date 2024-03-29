const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
// database thingy
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/loginData.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message);
});

let tempData =[];

// class Data{
  
//   constructor(nama,nim){
//     this.nama = tempData.nama;
//     this.nim = tempData.NIM
//   };

//   static initialize(passport){
//     console.log(passport);
//     passport.use(
//       new LocalStrategy({usernameField: 'NIM'},(NIM, password, done)=>{
//         db.get('SELECT * FROM users WHERE NIM = ?', NIM, (err,row)=>{
//           if(err) return done(err);
//           if(!row) return done(null,false,{message: "Tidak ada NIM"});
//           bcrypt.compare(password, row.password, (err, result) => {
//             if (err) {
//               return done(err);
//             }
//             if (!result) {
//               return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, row);
//           });
//         });
//       })
//       );
//       passport.serializeUser((user,done)=>done(null,user.id));
//       passport.deserializeUser((id,done)=> {
//         db.get('SELECT * FROM users WHERE id = ?', id, (err,row)=>{
//           tempData.push(row);
//           done(err,row);
//         });
//       });
//     }
// }
function initialize(passport){
  console.log(passport);
  passport.use(
    new LocalStrategy({usernameField: 'NIM'},(NIM, password, done)=>{
      db.get('SELECT * FROM users WHERE NIM = ?', NIM, (err,row)=>{
        if(err) return done(err);
        if(!row) return done(null,false,{message: "Tidak ada NIM"});
        bcrypt.compare(password, row.password, (err, result) => {
          if (err) {
            return done(err);
          }
          if (!result) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, row);
        });
      });
    })
  );
  passport.serializeUser((user,done)=>done(null,user.id));
  passport.deserializeUser((id,done)=> {
    db.get('SELECT * FROM users WHERE id = ?', id, (err,row)=>{
      console.log(row);
      
      tempData.push(row);

      console.log(tempData);
      done(err,row);
    });
  });
};

console.log(tempData);

module.exports = {
  initialize,
};