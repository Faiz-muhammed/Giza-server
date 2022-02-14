const express = require('express');
const router = express.Router();
const member =require("../controllers/member");

router.post('/Login',member.doSignup)


// router.post('/signUp',projectManager.signUp)

module.exports = router;