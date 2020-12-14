const express = require('express')
const newsletterController = require('../controllers/newsletter')

const api = express.Router();

api.post('/subscribe-news/:email', newsletterController.SubscribeEmail)

module.exports = api
