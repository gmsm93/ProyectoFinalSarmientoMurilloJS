
function traerDatos(){
    fetch('./productos.json')
        .then(response => response.json())
        .then(data => { mostrarDatos(data) })
        .catch(error => console.log(error)); 
}

traerDatos()

let tarjetasProductos = document.querySelector('.products');
let carritoCompras = document.querySelector('.card-items');
let precioTotal = document.querySelector('.price-total')
let cantidadCarrito = document.querySelector('.count-product');

let compras = [];

let totalTarjeta = 0;
let cantidadProductos = 0;


function mostrarDatos(data){
    let stock = [] ;
    
    data.Producto.forEach(dato => {
        stock.push(new Producto (dato.names, parseFloat(dato.prices), dato.images)) 
    })
    
    localStorage.setItem('stock',JSON.stringify(stock));

    const Ltarjetas = document.getElementById("tarjetas");
    const fragmento = document.createDocumentFragment();

    let conteo = 1

    stock.forEach(elemento => {
        const nuevoDiv = document.createElement("div")
        nuevoDiv.classList.add('carts')
        const dv = document.createElement("div")
        const im = document.createElement('img')
        im.src = elemento.images
        const sp = document.createElement('span')
        sp.textContent = elemento.prices
        const pr = document.createElement('p')
        pr.textContent = '$'
        pr.appendChild(sp)
        const nm = document.createElement('p')
        nm.classList.add('title')
        nm.textContent = elemento.names
        const a = document.createElement('a')
        a.href=""
        a.setAttribute('data-id' ,conteo)
        a.classList.add('btn-add-cart')
        
        a.textContent = 'add to cart'

        dv.appendChild(im)
        dv.appendChild(pr)
        nuevoDiv.appendChild(dv)
        nuevoDiv.appendChild(nm)
        nuevoDiv.appendChild(a)

        fragmento.appendChild(nuevoDiv)    

        conteo++
    })
    Ltarjetas.appendChild(fragmento) }; 

cargarEventListeners();
function cargarEventListeners(){
    tarjetasProductos.addEventListener('click', aggProducto);

    carritoCompras.addEventListener('click', borrarProducto);
}

function aggProducto(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectProduct = e.target.parentElement; 
        leerProducto(selectProduct);
    }
}

function borrarProducto(e) {
    if (e.target.classList.contains('delete-product')) {
        const deleteId = e.target.getAttribute('data-id');

        compras.forEach(value => {
            if (value.id == deleteId) {
                let priceReduce = parseFloat(value.price) * parseFloat(value.amount);
                totalTarjeta =  totalTarjeta - priceReduce;
                totalTarjeta = totalTarjeta.toFixed(2);
            }
        });
        compras = compras.filter(product => product.id !== deleteId);
        
        cantidadProductos--;
    }

    if (compras.length === 0) {
        precioTotal.innerHTML = 0;
        cantidadCarrito.innerHTML = 0;
    }
    cargarCarrito();
}

function leerProducto(product){
    const infoProducto = {
        image: product.querySelector('div img').src,
        title: product.querySelector('.title').textContent,
        price: product.querySelector('div p span').textContent,
        id: product.querySelector('a').getAttribute('data-id'),
        amount: 1
    }

    totalTarjeta = parseFloat(totalTarjeta) + parseFloat(infoProducto.price);
    totalTarjeta = totalTarjeta.toFixed(2);

    const exist = compras.some(product => product.id === infoProducto.id);
    if (exist) {
        const pro = compras.map(product => {
            if (product.id === infoProducto.id) {
                product.amount++;
                return product;
            } else {
                return product
            }
        });
        compras = [...pro];
    } else {
        compras = [...compras, infoProducto]
        cantidadProductos++;
    }
    cargarCarrito();
   
}

function cargarCarrito(){
    limpiarCarrito();
    compras.forEach(product => {
        const {image, title, price, amount, id} = product;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">${price}$</h5>
                <h6>Amount: ${amount}</h6>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

        carritoCompras.appendChild(row);

        precioTotal.innerHTML = totalTarjeta;

        cantidadCarrito.innerHTML = cantidadProductos;
    });
}
 function limpiarCarrito(){
    carritoCompras.innerHTML = '';
 }


