var db = require("../config/connection");
const jwt = require("jsonwebtoken");
var collection = require("../config/collections");
var bcrypt = require("bcrypt");

module.exports = {
  doSignup: async (req, res) => {
    console.log(req.body);
    let inviteData = req.body;
    if (!inviteData) {
        console.log("nope")
      return res.status(400).json({ message: "no login data" });
    }
    if (inviteData.params.Email === inviteData.ProjectmanagerEmail) {
  
      let member = await db.get().collection(collection.TM_COLLECTION).findOne({email: inviteData.params.Email})  
      if(member){
          return res.status(400).json({message:"user already exist in this mail"})
      }
      else{
          let password=await bcrypt.hash(inviteData.ProjectmanagerPWD,10)
          db.get().collection(collection.TM_COLLECTION).insertOne({email: inviteData.params.Email,password:password}).then(()=>{
              console.log("done")
              return res.status(200).json({message:"login successful"})  
          })
      }
    }
  },
};
