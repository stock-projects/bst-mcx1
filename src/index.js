const express = require('express')
require('./db/mongoose')
const User = require('./models/bst')
const userRouter = require('./routers/bst')
require('env-cmd')

const app = express()
const port = process.env.PORT
console.log(port)

app.use(express.json())
app.use(userRouter)


app.listen(port,() => {
    console.log("The server started at port "+port)
})