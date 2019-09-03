const server = require('./server.js')

const port = 8000;

server.listen(8000, () => console.log(`Server is listening on port ${port}`))