const express = require('express')
const router = express.Router();
const authenticatetoken = require('../services/auth')
const { get_subscriptions , new_subscriptions, update_subscriptions, delete_subscriptions} = require('../controllers/subscriptonsController')

router.get("/subscriptions" ,authenticatetoken , get_subscriptions );

router.post("/subscriptions" ,authenticatetoken, new_subscriptions);

router.put("/subscriptions/:id" ,authenticatetoken, update_subscriptions);

router.delete("/subscriptions/:id" ,authenticatetoken, delete_subscriptions);


module.exports = router;