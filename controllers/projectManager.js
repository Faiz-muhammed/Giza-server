var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require("bcrypt");
var OtpMailer = require("./nodeMailer");
const jwt = require("jsonwebtoken");

var emailTemp;
// const { collection } = require("mongodb");

module.exports = {
  signUp: async (req, res) => {
    console.log(req.body);
    let registerData = req.body;
    let email = req.body.ProjectmanagerEmail;
    emailTemp = req.body.ProjectmanagerEmail;
    const { ProjectmanagerEmail, ProjectmanagerPWD, PmPasswordConfirm } =
      req.body;

    if (!ProjectmanagerEmail || !ProjectmanagerPWD || !PmPasswordConfirm) {
      console.log("hello");
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });
    }

    const userExist = await db
      .get()
      .collection(collection.PM_COLLECTION)
      .findOne({ ProjectmanagerEmail: email });

    if (userExist) {
      return res
        .status(400)
        .json({ errorMessage: "Account exist in entered email" });
    } else {
      delete registerData.PmPasswordConfirm;
      console.log("it is:", registerData);
      registerData.ProjectmanagerPWD = await bcrypt.hash(
        registerData.ProjectmanagerPWD,
        10
      );
      db.get()
        .collection(collection.PM_COLLECTION)
        .insertOne(registerData)
        .then(async (data) => {
          let otpSend = await OtpMailer.Mailer(
            registerData.ProjectmanagerEmail
          );
          if (otpSend) {
            console.log(otpSend);
            db.get()
              .collection(collection.PM_COLLECTION)
              .updateOne(
                { ProjectmanagerEmail: registerData.ProjectmanagerEmail },
                { $set: { otpNum: otpSend } }
              );
            return res.status(200).json({ message: "signup success" });
          } else {
            console.log("otp send error");
          }
        });
    }
  },

  Login: async (req, res) => {
    console.log(req.body);
    let Logindata = req.body;

    if (!Logindata.ProjectmanagerEmail || !Logindata.ProjectmanagerPWD) {
      return res
        .status(400)
        .json({ ErrorMessage: "Please enter all required fields" });
    }
    if (
      Logindata.ProjectmanagerPWD.length < 5 ||
      Logindata.ProjectmanagerPWD.length > 8
    ) {
      return res
        .status(400)
        .json({ ErrorMessage: "Please enter valid password" });
    } else {
      let manager = await db
        .get()
        .collection(collection.PM_COLLECTION)
        .findOne({ ProjectmanagerEmail: Logindata.ProjectmanagerEmail });
      if (manager) {
        bcrypt
          .compare(Logindata.ProjectmanagerPWD, manager.ProjectmanagerPWD)
          .then((status) => {
            if (status) {
              console.log(manager);
              //generate an access token
              const accessToken = jwt.sign(
                { id: manager._id, Email: manager.ProjectmanagerEmail },
                "mySecretKey"
              );
              return res.status(200).json({
                message: "Login successfull",
                status: status,
                accessToken,
              });
            } else {
              return res
                .status(400)
                .json({ ErrorMessage: "Password incorrrect" });
            }
          });
      } else {
        return res.status(400).json({ ErrorMessage: "User does not exist" });
      }
    }
  },

  Verify: async (req, res) => {
    console.log(req.body);
    let data = parseInt(req.body.otp);
    let manager = await db
      .get()
      .collection(collection.PM_COLLECTION)
      .findOne({ ProjectmanagerEmail: emailTemp });

    if (manager) {
      console.log(data);
      console.log("hey");

      if (manager.otpNum === data) {
        return res.status(200).json({ message: "signUp successfull" });
      }
    }
  },

  GoogleLogin: async (req, res) => {
    console.log(req.body);
    let Googledata = req.body;
    if (!Googledata) {
      return res.status(400).json({ ErrorMessage: "Something went wrong" });
    }
    let user = await db
      .get()
      .collection(collection.PM_COLLECTION)
      .findOne({ ProjectmanagerEmail: Googledata.email });
    console.log(user);
    if (user) {
      //generate an access token
      const accessToken = jwt.sign(
        { id: user._id, Email: user.ProjectmanagerEmail },
        "mySecretKey"
      );
      return res.status(200).json({
        message: "Login successfull",
        accessToken,
      });
    } else {
      return res.status(400).json({ message: "Login failed" });
    }
  },

  Invite: async (req, res) => {

      console.log(req.body);
      let inviteData = req.body;
      const accessToken = jwt.sign(
        { Email: inviteData.teamMemberEmail, Project: inviteData.memberProject },
        "mySecretKey"
        );
        console.log(accessToken);
        OtpMailer.inviteMail(accessToken, inviteData.teamMemberEmail);
      },
};
