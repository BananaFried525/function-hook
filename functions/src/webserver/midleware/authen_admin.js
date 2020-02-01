const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const db = require("../../services/firestore");
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "LINEBOT_KMUTNB";
//สร้าง Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  try {
    // eslint-disable-next-line promise/catch-or-return
    db.collection("user_web")
      .where("username", "==", payload.username)
      .get()
      .then(snap => {
        console.log(snap.size);
        // eslint-disable-next-line promise/always-return
        if (snap.empty) {
          return done(null, false);
        } else {
          return done(null, true);
        }
      });
  } catch (error) {
    return done(null, false);
  }

  // done(null, true);
  // else done(null, false);
});
//เสียบ Strategy เข้า Passport
passport.use("admin", jwtAuth);
//ทำ Passport Middleware
const adminmiddleware = passport.authenticate("admin", { session: false });

module.exports = adminmiddleware;
