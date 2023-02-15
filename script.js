fetch("./Peliculas.json")
.then(resp => resp.json())
.then(peliculas => capturarInfo(peliculas))
.catch(error => mostrarSweetAlert("Error","No fue posible obtener la informacion de las peliculas", 'error', 5000, false))
let peliculasArray = []
const carroCompra = []
let totalCompra = 0

function AgregarProCarro(e) {
    const resultado = peliculasArray.find(pelicula => pelicula.id === Number(e.target.id))
    let mensaje
    if (carroCompra.find(pelicula => pelicula.id == resultado.id)) {
       mensaje = "Esta pelicula ya esta en el carro de compra"
    }
    else {
        carroCompra.push(resultado)
        renderizarCarroCompra(carroCompra)
        mensaje = "producto agregardo correctamente"
    }
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`style: 
        style: {
                background: "linear-gradient(to right, #581845, #ff5733)",
        }
    }).showToast();
    carroCompraGuardar()
}

function capturarInfo(peliculas){
    peliculasArray = peliculas
    renderizarPeliculas(peliculasArray)
}

let contenedorPeliculas = document.getElementById("contenedorPeliculas")
let contenedorCarroCompra = document.getElementById("contenedorCarroCompra")

let buscador = document.getElementById("buscadortxt")
buscador.oninput = BuscarPelicula

carroCompraRecuperar()

let verCarrito = document.getElementById("verCarrito")
verCarrito.addEventListener("click", mostrarOcultarC)

function mostrarOcultarC() {
    contenedorCarroCompra.classList.toggle("ocultar")
    contenedorPeliculas.classList.toggle("ocultar")
}


function BuscarPelicula() {
    let peliIngresada = peliculasArray.filter(peli => peli.nombre.includes(buscador.value.toUpperCase()) || peli.genero.includes(buscador.value.toUpperCase()))
    renderizarPeliculas(peliIngresada)
   
}

function renderizarPeliculas(arrayPeliculas) {
    contenedorPeliculas.innerHTML = ""
    arrayPeliculas.forEach(pelicula => {
        let tarjetaPelicula = document.createElement("div")
        //tarjetaPelicula = document.createElement("div")
        tarjetaPelicula.classList.add("pelicula")
        tarjetaPelicula.id = `tarjeta${pelicula.id}`
        tarjetaPelicula.innerHTML = `
            <h4>${pelicula.nombre}</h4>
            <img src=${pelicula.imgUrl}></img>
            <p>$${pelicula.precio}</p>
            <button type="button" class="btn btn-info" id=${pelicula.id}>Agregar</button>
        `
        contenedorPeliculas.append(tarjetaPelicula)
        let botonAgre = document.getElementById(pelicula.id)
        botonAgre.onclick = AgregarProCarro
    })
}

function renderizarCarroCompra(peliculasCarroCompra) {
    totalCompra = peliculasCarroCompra.reduce((acc, peli) => acc += peli.precio, 0)
    contenedorCarroCompra.innerText = ""
    peliculasCarroCompra.forEach(pelicula => {
        let tarjetaPelicula = document.createElement("div")
        tarjetaPelicula.classList.add("col-12")
        tarjetaPelicula.classList.add("itemCarroCompra")
        tarjetaPelicula.innerHTML += `
            <h5>${pelicula.nombre} $${pelicula.precio}</h5>
            <button type="button" class="btn btn-danger" onClick=eliminarPelicula(eliminar${pelicula.id}) id=eliminar${pelicula.id}>X</button>
        `
        contenedorCarroCompra.appendChild(tarjetaPelicula)
    })
    contenedorCarroCompra.innerHTML += `
        <div class="col-12">
            <p>___________________________</p>
        </div>
        <div class="col-12">
            <p>Total: $${totalCompra}</p>
        </div>
        <div class="col-12">
            <button type="button" class="btn btn-success" id="comprar">COMPRAR</button>
        </div>
    `
    
    let comprar = document.getElementById("comprar")
    comprar.addEventListener("click", finalizarCompra)
}

function eliminarPelicula(e){

    let id = e.id.substring(8)
    let indice = carroCompra.findIndex(pelicula => pelicula.id === Number(id))
    carroCompra.splice(indice, 1)
    renderizarCarroCompra(carroCompra)
    carroCompraGuardar()
}
function carroCompraGuardar(){
    let carroCompraJSON = JSON.stringify(carroCompra)
    localStorage.setItem("carroCompra", carroCompraJSON)
}
function carroCompraRecuperar(){
    let carritoCompra = localStorage.getItem("carroCompra")? JSON.parse(localStorage.getItem("carroCompra")):[]
    renderizarCarroCompra(carritoCompra)
}


function finalizarCompra(){
     mostrarSweetAlert("Compra Finalizada","Gracias por tu compra, el total a pagar es: $" + totalCompra, 'success', 5000, false)
     localStorage.removeItem("carroCompra")
     carritoCompra = []
     renderizarCarroCompra(carritoCompra)
 }
 
 function mostrarSweetAlert(titulo, texto, icono, tiempo, mostrarBoton, urlImagen, anchoImagen, altoImagen) {
     Swal.fire({
       title: titulo,
       text: texto,
       icon: icono,
       timer: tiempo,
       showConfirmButton: mostrarBoton,
       imageUrl: urlImagen,
       imageWidth: anchoImagen,
       imageHeight: altoImagen
     })
 }