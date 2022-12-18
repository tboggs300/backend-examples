const server = require('fastify')();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '4000';

console.log(`worker pid: process.pid`);

server.get('/hello', async (req, res) => {
    console.log(`worker request pid: ${process.pid}`);
    return {
        message:'Hello, World!'
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
})
