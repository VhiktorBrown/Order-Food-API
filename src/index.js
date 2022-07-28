const express = require('express')
require('./db/mongoose')
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(productRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log('Server now up and running on port ' + port)
})