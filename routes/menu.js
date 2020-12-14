const express = require('express')
const MenuController = require('../controllers/menu')

const md_auth = require('../middlewares/authenticated')

const api = express.Router()

api.post('/add-menu',[md_auth], MenuController.addMenu)

api.get('/get-menus', MenuController.getMenus)

api.put('/update-menu/:id',[md_auth],MenuController.updateMenu)
api.put('/active-menu/:id',[md_auth],MenuController.activateMenu)

api.delete('/delete-menu/:id',[md_auth],MenuController.deleteMenu)


module.exports= api