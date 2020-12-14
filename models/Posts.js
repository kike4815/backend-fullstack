const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate')

const Schema = mongoose.Schema

const PostSchema = Schema({
    title: String,
    url:{
        type:String,
        unique: true
    },
    description: String,
    date: Date
})
PostSchema.plugin(mongoosePagination)

module.exports = mongoose.model('Posts',PostSchema)
