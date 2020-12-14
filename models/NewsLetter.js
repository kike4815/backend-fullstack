const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const NewsLetterschema = Schema({
    email:{
        type: String,
        unique: true
    }
})

module.exports= mongoose.model('Newsletter',NewsLetterschema)