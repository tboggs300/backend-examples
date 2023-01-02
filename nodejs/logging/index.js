const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const port = process.env.PORT || 3000;

const app = express();

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    const stream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
    app.use(morgan('combined', { stream }));
    break;
}

app.get('*', (req, res) => res.send('Hello!'));

app.listen(port, () => {
  console.log(`Express started in ${app.get('env')} at http:localhost:${port}`);
});
