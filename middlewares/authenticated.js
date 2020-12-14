const jwt = require('jwt-simple')
const moment = require('moment')

const SECRET_KEY = 'el mundo expirara en 3,2,1'

const ensureAuth = (req,res,next) => {
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene cabecera de autentificación'})
    }
    const token = req.headers.authorization.replace(/['"]+/g,"")
    try {
        var payload = jwt.decode(token,SECRET_KEY)
        if(payload.exp <= moment.unix()){
            return res.status(404).send({message:'el token ha expirado'})
        }
    } catch (error) {
        return res.status(404).send({message:'Token invalido'})
    }
    req.user = payload
    next()
}

module.exports= ensureAuth