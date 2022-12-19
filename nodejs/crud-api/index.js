const { MongoClient } = require('mongodb');
const server = require('fastify')();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '4000';
const username = '<USERNAME>';
const pass = '<PASSWORD>';
const cluster = '<CLUSTER_NAME>.<UUID>.mongodb.net';
const uri = `mongodb+srv://${username}:${pass}@${cluster}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const db = client.db('users');
const users = db.collection('users');

server.get('/users', async (req, res) => {
  const allowedMethods = ['GET'];
  if (!allowedMethods.includes(req.method)) {
    res.send({
      statusCode: 403,
      message: 'Method not supported.',
    });
    return;
  }
  const result = users.find({});
  res.send({
    statusCode: 200,
    data: result });
  return;
});

server.get('/users/new', async (req, res) => {
  const allowedMethods = ['POST'];
  try {
    if (!allowedMethods.includes(req.method)) {
      res.send({
        statusCode: 403,
        message: 'Method not supported.',
      });
      return;
    }
    const parseBody = req.body.parse();
    await users.insertOne({
      id: parseBody.user_id,
      name: parseBody.user_name,
      age: parseBody.user_age,
    });
    return;
  } catch (err) {
    console.log(err);
  }
});

server.get('/users/:id', async (req, res) => {
  try {
    const allowedMethods = ['PUT', 'DELETE'];
    if (!allowedMethods.includes(req.method)) {
      res.send({
        statusCode: 403,
        message: 'Method not supported.',
      });
      return;
    }

    const userId = req.params.id;
    if (!userId) {
      res.send({
        statusCode: 401,
        message: 'User ID not provided.'
      });
      return;
    }

    if (req.method === 'DELETE') {
      await users.deleteOne({id: userId});
      res.send({
        statusCode: 200,
        message: `User ${userId} successfully deleted.`,
      });
    }

    if (req.method === 'PUT') {
      const parseBody = req.body.parse();
      const name = parseBody.user_name;
      const age = parseBody.user_age;

      if (!name || !age) {
        res.send({
          statusCode: 401,
          message: 'User name or age not provided',
        });
        return;
      }

      await users.updateOne({id: userId}, 
        [{$set: {age, name}}]
      );

      res.send({
        statusCode: 200,
        message: `Successfully updated user ${userId}`,
      });

      return;
    }
  } catch (err) {
    console.log(err);
  }
});

server.listen(PORT, HOST, (error) => {
  if (error) {
    console.log(error);
    client.close();
  }
  console.log(`Worker ${process.pid} listening on http://127.0.0.1:4000`);
});