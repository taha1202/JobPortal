const express = require('express');
const { SendMessage, ReceiveMessage, ReceiveSelectedMessage } = require('../controllers/MessageController');


const router = express.Router();
router.post('/send-message/:id', SendMessage);
router.get('/get-messages',ReceiveMessage );
router.get('/get-messages/:id',ReceiveSelectedMessage );
module.exports = router;
