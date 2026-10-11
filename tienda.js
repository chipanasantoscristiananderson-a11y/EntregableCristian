/* ===== Cristian Store · tienda.js: lógica de tienda.html (requiere comun.js) ===== */
var categoria = "Todo";
var botones = document.querySelectorAll("#filtros button");
var buscador = document.getElementById("buscar");
var orden = document.getElementById("orden");

// Si llegamos desde el menú con ?cat=Polos, se usa esa categoría
var desdeUrl = new URLSearchParams(location.search).get("cat");
if (desdeUrl) {
  categoria = desdeUrl;
}

function mostrarProductos() {
  var texto = buscador.value.trim().toLowerCase();
  var lista = [];

  // Filtrar por categoría y texto
  for (var i = 0; i < productos.length; i++) {
    var p = productos[i];
    var coincideCat = categoria == "Todo" || p.cat == categoria || (categoria == "Favoritos" && esFav(p.id));
    var coincideTexto = p.nombre.toLowerCase().indexOf(texto) != -1;
    if (coincideCat && coincideTexto) {
      lista.push(p);
    }
  }

  // Ordenar por precio
  if (orden.value == "menor") {
    lista.sort(function (a, b) { return a.precio - b.precio; });
  } else if (orden.value == "mayor") {
    lista.sort(function (a, b) { return b.precio - a.precio; });
  }

  // Dibujar las tarjetas
  var html = "";
  for (var j = 0; j < lista.length; j++) {
    html = html + crearTarjeta(lista[j], j);
  }
  document.getElementById("productos").innerHTML = html;
  document.getElementById("vacio").textContent = categoria == "Favoritos"
    ? "Aún no tienes favoritos. Toca el corazón de una prenda para guardarla."
    : "No encontramos prendas con esa búsqueda. Prueba con otra palabra o categoría.";
  document.getElementById("vacio").hidden = lista.length > 0;

  // Marcar el botón activo
  for (var b = 0; b < botones.length; b++) {
    botones[b].classList.toggle("activo", botones[b].dataset.cat == categoria);
  }
  revelar();
}

for (var k = 0; k < botones.length; k++) {
  botones[k].addEventListener("click", function () {
    categoria = this.dataset.cat;
    mostrarProductos();
  });
}
buscador.addEventListener("input", mostrarProductos);
orden.addEventListener("change", mostrarProductos);
mostrarProductos();


