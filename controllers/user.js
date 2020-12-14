const bcrypt = require("bcrypt-nodejs");
const User = require("../models/User");
const jwt = require('../services/jwt')
const fs = require('fs')
const path = require('path')

function signUp(req, res) {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias" });
  } else if (password !== repeatPassword) {
    res.status(404).send({ message: "las contraseñas no son iguales" });
  } else {
    bcrypt.hash(password, null, null, function (err, hash) {
      if (err) {
        res.status(500).send({ message: "Error al encriptar el usuario" });
      } else {
        user.password = hash;
      }
      user.save((err, userStored) => {
        if (err) {
          res.status(500).send({ message: "usuario ya existe" });
        }
        if (!userStored) {
          res.status(404).send({ message: "Error al crear el usuario" });
        }
        res.status(200).send({ user: userStored });
      });
    });
  }
}
function signIn(req, res) {
  const params = req.body
  const email = params.email
  const password = params.password

  User.findOne({email}, (err,userStored) => {
    if(err){
      res.status(500).send({message:'Error en el servidor'})
    }else {
      if(!userStored){
        res.status(404).send({message:'Usuario no encontrado'})
      }else {
        bcrypt.compare(password,userStored.password,(err,check)=>{
          if(err){
            res.status(500).send({message:'Error del servidor'})
          }else if(!check){
            res.status(404).send({message:'la contraseña no es correcta'})
          }
          else {
            if(!userStored.active){
              res.status(200).send({code:200,message:'El usuario no se ha activado'})
            }else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.refreshToken(userStored)
              })
            }
          }
        })
      }
    }
  })
}
function getUsers(req,res){
  User.find().then(users => {
    if(!users){
      res.status(404).send({message: 'No existen usuarios'})
    }else {
      res.status(200).send({users})
    }
  })
}
function getUsersActive(req,res){
  const query = req.query
  
  User.find({active: query.active}).then(users => {
    if(!users){
      res.status(404).send({message: 'No existen usuarios'})
    }else {
      res.status(200).send({users})
    }
  })
}
function uploadAvatar(req,res){
const params = req.params
User.findById({_id:params.id}, (err,userData) => {
  if(err){
    res.status(500).send({message:'Error del servidor'})
  }else {
    if(!userData){
      res.status(404).send({message:'No se ha encontrado el usuario'})
    }else {
      let user = userData
      
      if(req.files){
        let filePath = req.files.avatar.path
        let fileSplit = filePath.split('\\')
        let fileName = fileSplit[2]

        let extFileName = fileName.split('.')
        let extSplit = extFileName[1]

        if(extSplit !== 'jpg' && extSplit !== 'png'){
          res.status(400).send({message: 'La extension de la imagen no es valida'})
        }else {
          user.avatar = fileName
          User.findByIdAndUpdate({_id:params.id},user,(err,userResult)=> {
            if(err){
              res.status(500).send({message: 'Error en el servidor'})
            }else {
              if(!res){
                res.status(404).send({message:'No se ha encontrado ningun usuario'})
              }else {
                res.status(200).send({avatarName: fileName})
              }
            }
          })
        }
      }
    }
  }
})
}

function getAvatar(req,res){
   const avatarName = req.params.avatarName
   const filePath = './uploads/avatar/' + avatarName

   
   fs.stat(filePath,(err) => {
     if(err){
       res.status(404).send({message:'el avatar que buscas no existe'})
     }else {
       res.sendFile(path.resolve(filePath))
     }
   })
}
async function updateUser(req,res){
  let userData = req.body
  userData.email = req.body.email.toLowerCase()
  const params = req.params

  if(userData.password){
      await bcrypt.hash(userData.password,null,null,(err,hash) => {
        if(err){
          res.status(500).send({message : 'Error al encriptar la contraseña'})
        }else {
          userData.password = hash
        }
      })
  }
  
  User.findByIdAndUpdate({_id :params.id},userData,(err,response)=>{
    if(err){
      res.status(500).send({message: 'Error del servidor'})
    }else {
      if(!response){
        res.status(404).send({message:'No se ha encontrado ningun usuario'})
      }else {
        res.status(200).send({message:'Usuario actualizado correctamente'})
      }
    }

  } )
}

function activateUser(req,res){
  const {id} = req.params
  const { active } = req.body

  User.findByIdAndUpdate(id, {active}, (err,userStored) => {
    if(err){
      res.status(500).send({message: 'error del servidor'})
    }else {
      if(!userStored){
        res.status(404).send({message:'No se ha encontrado el usuario'})
      }else {
        if( active === true ){
          res.status(200).send({message:' Usuario activado correctamente'})
        }else {
          res.status(200).send({message:' El Usuario se ha desactivado correctamente'})

        }
      }
    }
  })
}

function deleteUser(req,res){
  const {id} = req.params
  User.findByIdAndRemove(id,(err,response)=> {
    if(err){
      res.status(500).send({message:'error en el servidor'})
    }else {
      if(!response){
        res.status(404).send({message:'el usuario no se ha encontrado '})
      }
      res.status(200).send({message:'usuario borrado correctamente'})
    }
  })
}

function signUpAdmin(req,res){
  const user = new User()
  const {name, lastname, email, role, password} = req.body
  user.name = name
  user.lastname = lastname
  user.email = email.toLowerCase()
  user.role = role
  user.active = true

  if(!password){
    res.status(500).send({message: 'la contraseña es obligatoria'})
  }else{
    bcrypt.hash(password,null,null,(err,hash) =>{
      if(err){
        res.status(500).send({message:'error al encriptar la constraseña'})
      }else {
        user.password = hash
        user.save((err,userStored) => {
          if(err){
            res.status(500).send({message:'El usuario ya existe'})
          }else {
            if(!userStored){
              res.status(500).send({message:'error al crear al usuario'})

            }else {
              res.status(200).send({message: 'usuario creado correctamente'})
            }
          }
        })
      }
    })
  }

}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  signUpAdmin
};
