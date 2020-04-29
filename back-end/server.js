const express = require ('express')
const bodyParser = require ('body-parser')
const cors = require('cors')

const app = express ()

var corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const db = require('./models')
db.mongoose
.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado ao banco')
})
.catch(err => {
    console.log('Não foi possível conectar ao banco', err)
    process.exit()
})


app.get("/", (req, res) => {
    res.json({ message: "Welcome!!!!"})
})

require("./routes/tutorial.routes")(app)

const PORT = process.env.PORT ||8080
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

