const express = require('express');
const router = express.Router();
const projectManager =require("../controllers/projectManager");


router.post('/signUp',projectManager.signUp)
router.post('/Login',projectManager.Login)
router.post('/verify',projectManager.Verify)
router.post('/GoogleLogin',projectManager.GoogleLogin)
router.post('/invite',projectManager.Invite)
// router.post('/logout')
module.exports = router;