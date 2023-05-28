const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// function initialize(passport, getUserByNIM) {
//   const authenticateUser = async (NIM, password, done) => {
//     const user = getUserByNIM(NIM)
//     if (user == null) {
//       return done(null, false, { message: 'No user with that NIM' })
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
//   passport.serializeUser((user, done) => done(null,user.NIM))
//   passport.deserializeUser((NIM,done) => {
//     return done(null, getUserByNIM(NIM))
//   })
// }


function initialize(passport,getUserByNIM,dataTemp){
    console.log(dataTemp);
    passport.use(
      new LocalStrategy({ usernameField: 'NIM' }, (NIM, password, done) => {
        // Match user
        const userFound = getUserByNIM(NIM);
        if(userFound == null) return done(null,false, { message: 'NIM tidak terdaftar'});
        bcrypt.compare(password, userFound.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, userFound);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        });
        
        // User.findOne({
        //   NIM: NIM
        // }).then(user => {
        //   if (!user) {
        //     return done(null, false, { message: 'NIM is not registered' });
        //   }
  
          // Match password
        })
      );
    //   passport.use(new LocalStrategy({ usernameField: 'NIM' }, authenticateUser))
      passport.serializeUser((user, done) => done(null,user.NIM));
      passport.deserializeUser((NIM,done) => {
        return done(null, getUserByNIM(NIM))
      })
    // passport.serializeUser(function(user, done) {
    //   done(null, user.id);
    // });
  
    // passport.deserializeUser(function(id, done) {
    //   userFound.findById(id, function(err, user) {
    //     done(err, user);
    //   });
    // });
    
};

module.exports = initialize;