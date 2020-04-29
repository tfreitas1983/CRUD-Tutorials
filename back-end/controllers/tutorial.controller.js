const db = require ('../models')
const Tutorial = db.tutorials

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Título deve ser preenchido."})
        return
    }

    const tutorial = new Tutorial ({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published: false
    })

    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erro ao criar tutorial."
            })
        })
}

exports.findAll = (req, res) => {
    const title = req.query.title
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {}

    Tutorial.find(condition)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erro ao carregar os tutoriais."
            })
        })
}

exports.findOne = (req, res) => {
    const id =  req.params.id

    Tutorial.findById(id)
        .then(data => {
            if(!data)
                res.status(404).send ({ 
                    message: "Não foi encontrado o tutorial com o id " + id })
            else res.send(data)
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Erro ao carregar tutorial com o id " + id })
        })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Os campos devem ser preenchidos."
        })
    }

    const id = req.params.id

    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if(!data) {
                res.status(404).send ({
                    message: `Não foi possível encontrar e alterar o tutorial com o id ${id}`
                })
            } else res.send({
                message: "Tutorial alterado com sucesso."
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "Erro ao alterar o tutorial com o id " + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Tutorial.findByIdAndRemove(id)
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: `Não foi possível encontrar e deletar o tutorial com o id ${id}`
                })
            } else {
                res.send({
                    message: "Tutorial deletado com sucesso."
                })
            }
        })
        .catch (err => {
            res.status(500).send({
                message: "Erro ao deletar o tutorial com o id " +id
            })
        })
    
}

exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} tutoriais foram deletados com sucesso.`
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erro ao remover todos os tutoriais."
            })
        })
}

exports.findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erro ao carregar todos os tutoriais."
            })
        })
}