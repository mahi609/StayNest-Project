const User = require("../models/user");

module.exports.sigup =  async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const registeruser = new User({ username, email });
    await User.register(registeruser, password);
    req.logIn(registeruser,(err)=>{ // it automically login when we do signp not show signup and login  option
      if(err){
        return next(err);
      }
        req.flash("success", "Welcome!");
         res.redirect("/listings");
    })
  
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.login =   (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome ${username}`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }

  module.exports.logout =  (req, res, next)=>{
  req.logOut((err)=>{   // inbulit passport propert for logout
    if(err){
     return next(err);
    }
    req.flash("success", "User logged Out Succesfully!");
    res.redirect("/listings");
  })
}