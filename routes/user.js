const express = require("express");
const UserController = require("../controllers/user");
const multipart = require('connect-multiparty')
const md_auth = require('../middlewares/authenticated')
const md_upload_avatar = multipart({uploadDir:'./uploads/avatar'})

const route = express.Router();

route.post("/sign-up", UserController.signUp);
route.post("/sign-in", UserController.signIn);
route.post("/sign-up-admin",[md_auth], UserController.signUpAdmin);


route.put("/upload-avatar/:id",[md_auth, md_upload_avatar], UserController.uploadAvatar);
route.put("/update-user/:id",[md_auth], UserController.updateUser)
route.put("/activate-user/:id",[md_auth], UserController.activateUser)

route.get("/users",[md_auth], UserController.getUsers);
route.get("/users-active",[md_auth], UserController.getUsersActive);
route.get("/get-avatar/:avatarName",UserController.getAvatar)

route.delete('/delete-user/:id',[md_auth],UserController.deleteUser)

module.exports = route;
