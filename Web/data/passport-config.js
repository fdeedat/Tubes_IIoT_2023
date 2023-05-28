const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByNIM){
    passport.use(
      new LocalStrategy({ usernameField: 'NIM' }, (NIM, password, done) => {
        // Match user
        const userFound = getUserByNIM(NIM);
        if(userFound === undefined||null) return done(null,false, { message: 'NIM tidak terdaftar'});
        bcrypt.compare(password, userFound.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            return done(null, userFound);
        } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      })
    );
  passport.serializeUser((user, done) => done(null,user.NIM));
  passport.deserializeUser((NIM,done) => {
    return done(null, getUserByNIM(NIM))
  })
};

// function initialize(passport, getUserByNIM, getUserByName) {
//   const authenticateUser = async (NIM, password, done) => {
//     const user = getUserByNIM(NIM)
//     if (user == undefined) {
//       return done(null, false, { message: 'No user with that email' })
//     }

//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: 'Password incorrect' })
//       }
//     } catch (e) {
//       return done(e)
//     }
//   }

//   passport.use(new LocalStrategy({ usernameField: 'NIM' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.name))
//   passport.deserializeUser((name, done) => {
//     return done(null, getUserByName(name))
//   })
// }

module.exports = initialize;