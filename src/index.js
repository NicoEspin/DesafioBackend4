import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { __dirname } from "./path.js";
import exphbs from "express-handlebars";
import multer from "multer";

const app = express();
const server = http.createServer(app);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create(); 

app.engine("handlebars", hbs.engine); 
app.set("view engine", "handlebars"); 
app.set("views", path.resolve(__dirname, "./views"));
const upload = multer({ storage: storage });
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public"))); 

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

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    css: "style.css",
    title: "realTimeProducts",
    js: "realTimeProducts.js",
    productos: prods, // Pasa la lista de productos a la vista
  });
});

app.post("/upload", (req, res) => {
  const nuevoProd = {
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    category: req.body.category
  };

  prods.push(nuevoProd); // Agrega el nuevo producto a la lista de productos

  // Emitir la lista actualizada de productos a través de Socket.io
  io.emit("prods", prods);

  // Redirige de vuelta a la página de productos en tiempo real
  res.redirect("/realtimeproducts");
});

app.get("/home", (req, res) => {
  res.render("home", {
    title: "Productos",
    productos: prods, // Pasa la lista de productos a la vista
  });
});
