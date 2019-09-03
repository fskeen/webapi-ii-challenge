const express = require('express')
const postRoutes = require('./posts/postRoutes')
const port = 8000;
const cors = require('cors')

const server = express()
server.use(express.json())
server.use(cors())

server.use('/api/posts', postRoutes)

server.listen(8000, () => console.log(`Server is listening on port ${port}`))