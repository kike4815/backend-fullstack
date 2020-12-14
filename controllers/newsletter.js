const Newsletter = require('../models/NewsLetter')

function SubscribeEmail(req,res){
    const email = req.params.email
    const newsletter = new Newsletter()

    if(!email){
        res.status(404).send({
            code:404,
            message:'El email es obligatorio'
        })
    }else {
        newsletter.email = email.toLowerCase()
        newsletter.save((err,newsletterStore) => {
            if(err){
                res.status(500).send({message: 'Email ya existe'})
            }else {
                if(!newsletterStore){
                    res.status(404).send({message:'Error al registrar el email'})
                }else {
                    res.status(200).send({code:200,message:'Email creado correctamente'})
                }
            }
        })
    }
}

module.exports ={
    SubscribeEmail
}