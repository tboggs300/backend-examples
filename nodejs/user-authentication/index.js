const server = require('express')();
const bodyParser = require ('body-parser');
const cors = require('cors');

const { tokenAuthenication } = require('./middleware/auth');
const { AuthRouter } = require('./routes/auth');
require('./db');

const LOCAL_IPV4 = process.env.IP_ADDRESS || '10.0.0.200';
const PORT = process.env.PORT || 8080;


server.use('/api', cors());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.use('/auth', AuthRouter);

server.get('/welcome', cors(), tokenAuthenication, (req, res) => {
  res.status(200);
  res.type('text/plain');
  res.send('Hello World');
})

server.use((req,res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Endpoint not found.');
});

server.use((err, req, res, next) => {
  console.log({err});
  res.type('text/plain');
  res.status(500);
  res.send('Server error');
});

if(require.main === module) {
  server.listen(PORT, LOCAL_IPV4, () => {
    console.log(`Listening on port ${LOCAL_IPV4}:${PORT}`);
  });
} else {
  module.exports = server;
}

