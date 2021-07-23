require("dotenv").config();
const express = require("express");

// CORS

    app.all('/*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');

        res.header('Access-Control-Allow-Methods', '*');

        res.header(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
        );

        next();
    });


const { MongoClient, ObjectId } = require("mongodb");

(async () => {
  const host = process.env.DB_HOST;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASS;
  const dbName = process.env.DB_NAME;

  const url = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;

  console.info("Conectando ao banco de dados...");

  const client = await MongoClient.connect(url, { useUnifiedTopology: true });

  console.info("MongoDB conectado com sucesso!");

  const db = client.db(dbName);

  const app = express();

  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello World Node");
  });

  const lista = ["Senhor dos Anéis", "Harry Potter"];

  const filmes = db.collection("filmes");

  // [GET] - Read All
  app.get("/filmes", async (req, res) => {
    const listaFilmes = await filmes.find().toArray();
    res.send(listaFilmes);
  });

  // [GET] - Read Single (ou Read by ID/Index)
  app.get("/filmes/:id", async (req, res) => {
    const id = req.params.id;
    const item = await filmes.findOne({ _id: ObjectId(id) });

    if (!item) {
      res.status(404).send("Item não encontrado");
      return;
    } else {
      res.send(item);
    }
  });

  // [POST] - Create
  app.post("/filmes", async (req, res) => {
    const item = req.body;
    await filmes.insertOne(item);
    res.send(item);
  });

  // [PUT] - Update
  app.put("/filmes/:id", async (req, res) => {
    const id = req.params.id;

    const item = req.body;

    await filmes.updateOne({ _id: ObjectId(id) }, { $set: item });

    res.send(item);
  });

  // [DELETE] - Remove um objeto
  app.delete("/filmes/:id", async (req, res) => {
    const id = req.params.id;

    await filmes.deleteOne({ _id: ObjectId(id) });

    res.send("Item removido com sucesso");
  });

  app.listen(process.env.PORT || 3000);
})();
