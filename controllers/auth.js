const jwt = require('../services/jwt');
const User = require('../models/User')
const moment = require('moment')

function willExpireToken(token) {
    const {exp} = jwt.decodedToken(token)
    const currentDate = moment().unix()

    if(currentDate > exp){
        return true
    }
    return false
}

function refreshAccesToken(req,res){
    const {refreshToken} = req.body
    const isTokenExpired = willExpireToken(refreshToken)

    if(isTokenExpired) {
        res.status(404).send({message:'El token ha expirado'})
    }else {
        const {id} = jwt.decodedToken(refreshToken)

        User.findOne({_id:id},(err,userStored)=> {
            if(err){
                res.status(500).send({message:'Error en el servidor'})
            }else{
                if(!userStored){
                    res.status(404).send({message:'Usuario no encontrado'})
                }else{
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    })
                }
            }
        })
    }
}

module.exports = {
    refreshAccesToken
}