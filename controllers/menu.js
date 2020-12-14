const Menu = require('../models/Menu')

function addMenu (req,res){
    const {title, url, order, active} = req.body
    const menu = new Menu()

    menu.title = title
    menu.url = url
    menu.order = order
    menu.active = active

    menu.save((err,createdMenu) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else {
            if(!createdMenu){
                res.status(404).send({message:'Error al crear el menu'})
            }else {
                res.status(200).send({message:'Menu creado correctamente'})
            }
        }
    })
}

function getMenus(req,res){
    Menu.find()
    .sort({order:'asc'})
    .exec((err,menuStored) => {
        if(err){
            res.status(500).send({message:'Error en el servidor'})
        }else {
            if(!menuStored){
                res.status(404).send({message:'No existen menus'})
            }else {
                res.status(200).send({menu: menuStored})
            }
        }
    })  
}


function updateMenu(req,res){
    let menuData = req.body
    const params = req.params

    Menu.findByIdAndUpdate(params.id,menuData,(err,menuUpdate) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else {
            if(!menuUpdate){
                res.status(404).send({message:'No se ha encontrado ningun menu'})
            }else {
                res.status(200).send({message:'Menu actualizado correctamente'})
            }
        }
    })
}

function activateMenu(req,res){
    const {id} = req.params
    const {active} = req.body

    Menu.findByIdAndUpdate(id,{active},(err,menuUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else {
            if(!menuUpdated){
                res.status(404).send({message:'No se ha encontrado ningun menu'})
            }else {
                if(active === true){

                    res.status(200).send({message:'Menu activado correctamente correctamente'})
                }else {
                    
                    res.status(200).send({message:'Menu Desactivado correctamente correctamente'})
                }
            }
        }
    })
}

function deleteMenu(req,res){
    const {id}= req.params

    Menu.findByIdAndDelete(id,(err,userDeleted) =>{
        if(err){
            res.status(500).send({message:'error en el servidor'})
          }else {
            if(!userDeleted){
              res.status(404).send({message:'el curso no se ha encontrado '})
            }
            res.status(200).send({message:'curso borrado correctamente'})
          }
    })
} 

module.exports = {
    addMenu,
    getMenus,
    updateMenu,
    activateMenu,
    deleteMenu
}