const Post = require('../models/Posts')

function addPost(req,res){
    const body = req.body
    const post = new Post(body)

    post.save((err,postStored) =>  {
        if(err){
            res.status(500).send({code:500, message: 'Error en el servidor'})
        }else {
            if(!postStored){
                res.status(404).send({code:404, message:'Error al crear el post'})
            }else {
                res.status(200).send({code:200, message:'Post creado correctamente'})
            }
        }
    })

}

function getPosts(req,res){
    const {page = 1,limit = 10} = req.query
    
    const options={
        page,
        limit:parseInt(limit),
        sort:{date:'desc'}
    }

    Post.paginate({},options,(err,postsStored) => {
        if(err){
            res.status(500).send({code:500, message: 'Error en el servidor'})
        }else {
            if(!postsStored){
                res.status(404).send({code:404, message:'no hay posts actualmente'})
            }else {
                res.status(200).send({code:200, posts: postsStored})
            }
        } 
    })
}

function updatePost(req,res){
    const postData = req.body
    const {id} = req.params 

    Post.findByIdAndUpdate(id,postData,(err, postUpdated) => {
        if(err){
            res.status(500).send({code:500, message: 'Error en el servidor'})
        }else {
            if(!postUpdated){
                res.status(404).send({code:404, message:'no hay posts actualmente'})
            }else {
                res.status(200).send({code:200, message: 'post actualizado correctamente'})
            }
        } 
    })
}

function deletePost(req,res){
    const {id} = req.params
    Post.findByIdAndRemove(id,(err,deletedPost) => {
        if(err){
            res.status(500).send({code:500, message: 'Error en el servidor'})
        }else {
            if(!deletedPost){
                res.status(404).send({code:404, message:'no se ha encontrado el post'})
            }else {
                res.status(200).send({code:200, message: 'post borrado correctamente'})
            }
        }
    })
}

function findPost(req,res){
    const {url} = req.params

    Post.findOne({url},(err,postStred)=> {
        if(err){
            res.status(500).send({code:500, message: 'Error en el servidor'})
        }else {
            if(!postStred){
                res.status(404).send({code:404, message:'no se ha encontrado el post'})
            }else {
                res.status(200).send({code:200, post: postStred})
            }
        }
    })
}


module.exports = {
    addPost,
    getPosts,
    updatePost,
    deletePost,
    findPost
}