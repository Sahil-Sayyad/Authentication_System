//import all required packages
const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailMailer = require("../mailers/emailVerification");

//render sign-in page
module.exports.signIn = async (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Congrats you already Singed In");
    return res.redirect("/");
  }
  req.flash("success", "Please Sign In For Go To Home Page");
  return res.render("sign_in", {
    title: "Sign In",
  });
};

//render sign-up page
module.exports.signUp = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  req.flash("success", "Please Sign In Go To Home Page");
  return res.render("sign_up", {
    title: "Sign Up",
  });
};

//  Social login + local login

//get the sign up data and create new user with email
module.exports.create = async (req, res) => {
  try {
    //check password and confirm password is correct
    if (req.body.password != req.body.confirm_password) {
      console.log("password doest not match");
      req.flash("error", "Please Enter Correct Comfirm Password ");
      return res.redirect("back");
    }

    // Check if this user already exisits.
    let user = await User.findOne({ email: req.body.email });

    // Insert the new user if they do not exist yet.
    if (!user) {
      user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        isVerified: false,
      });

      // Hash the password before saving into database.
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      // Generating the token for user verification
      let users = await User.findOne({ email: req.body.email });
      const token = new Token({
        userId: users._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save();

      // Send varification email
      const link = `${process.env.BASE_URL}/users/confirm/${token.token}`;
      await emailMailer.emailSend(users.email, "Email Verification", link);
      req.flash("success", "Email Verification link sent to your email");
      return res.redirect("back");
    } else {
      req.flash("success", "Email already Exists Please Login");
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("error in create user controller ", err);
    return;
  }
};

// a. Account verification by email

// Verify Email address Api
module.exports.confirmationPost = async function (req, res, next) {
  // Find a matching token
  let token = await Token.findOne({ token: req.params.token });
  if (!token) {
    req.flash(
      "error",
      "We were unable to find a valid token.Your token my have expired."
    );
    return res.redirect("/users/sign-up");
  }

  // If we found a token, find a matching user
  let user = await User.findOne({ _id: token.userId });
  if (!user) {
    req.flash("error", "We were unable to find a user for this token.");
    return res.redirect("/users/sign-up");
  }
  //if already verified then return
  if (user.isVerified) {
    req.flash("success", "Email already Exists Please Login");
    return res.redirect("/users/sign-in");
  }
  // Verify and save the user
  user.isVerified = true;
  console.log(user.isVerified);
  user.save();
  req.flash("success", "Email Verified SuccessFully Please Login");
  //delete tokon form db after email verification success
  await Token.deleteOne(token);
  return res.redirect("/users/sign-in");
};

//sign in and create session for the user
module.exports.createSession = async function (req, res) {
  try {
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } catch (err) {
    console.log("error in create session ", err);
    return;
  }
};

//sign out and destory session of the user
module.exports.destroySession = function (req, res) {
  req.logout((err) => {
    if (err) {
      return done(err);
    }
  });
  req.flash("success", "Logged out Successfully");
  return res.redirect("/");
};

// b. Password reset option for login and after the sign in

// forrget password page
module.exports.forgetPasswordPage = function (req, res) {
  return res.render("forget_password", {
    title: "Forget Password",
  });
};

module.exports.forgetPasswordLink = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    req.flash("error", "User Not Found Please Sign Up or Try Correct Email");
    return res.redirect("/users/sign-up");
  }
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Please Enter Correct Confirm Password");
    return res.redirect("back");
  }
  if (req.body.password == req.body.confirm_password) {
    user.password = req.body.password;
    await user.updateOne({ password: req.body.password });
    req.flash("success", "Password Forget Sucessfully");
    return res.redirect("/users/sign-in");
  }
  return res.redirect("back");
};
