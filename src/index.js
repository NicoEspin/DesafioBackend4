import express from "express";
import http from "http";
import { Server } from 'socket.io';
import path from 'path';
import exphbs from 'express-handlebars'; 

const app = express();
const server = http.createServer(app);

// Configura el motor de plantillas Handlebars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create(); // Crea una instancia de express-handlebars

app.engine('handlebars', hbs.engine); // Usa hbs.engine para configurar el motor
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Socket.io
const io = new Server(server);

const prods = [];

server.listen(3000, () => {
  console.log("Servidor en funcionamiento en el puerto 3000");
});

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("nuevoProducto", (nuevoProd) => {
    prods.push(nuevoProd);
    io.emit("prods", prods);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.get('/static', (req, res) => {
  res.render('realTimeProducts', {
    css: "style.css",
    title: "Chat",
    js: "realTimeProducts.js"
  });
});


app.post('/upload', upload.single('product'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  res.status(200).send("Imagen cargada")
})

