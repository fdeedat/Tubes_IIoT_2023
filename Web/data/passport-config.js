const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByNIM,dataTemp){
    console.log(dataTemp);
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

module.exports = initialize;