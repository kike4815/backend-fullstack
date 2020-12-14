const express = require('express')
const PostController = require('../controllers/posts')

const md_auth = require('../middlewares/authenticated')

const api = express.Router()

api.post('/add-post',[md_auth], PostController.addPost)
api.get('/get-posts', PostController.getPosts)
api.get('/get-post/:url', PostController.findPost)
api.put('/update-post/:id',[md_auth], PostController.updatePost)
api.delete('/delete-post/:id',[md_auth], PostController.deletePost)

module.exports = api