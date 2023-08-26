const socket=io()
const form = document.getElementById("form");
const btnProductos = document.getElementById("btn-products")

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target)
  const datForm = new FormData(e.target)
  const product = Object.fromEntries(datForm)
  console.log(product)
  socket.emit('nuevo producto', product )
  e.target.reset()
});

btnProductos.addEventListener('click', ()=>{
    socket.on('prods', (productos) =>{
        console.log(productos)
    })
})