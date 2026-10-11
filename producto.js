/* ===== Cristian Store · producto.js: lógica de producto.html (requiere comun.js) ===== */
var id = new URLSearchParams(location.search).get("id");
var p = buscarProducto(id);
var detalle = document.getElementById("detalle");

if (p == null) {
  detalle.innerHTML = '<div class="vacio">No encontramos esa prenda. <a href="tienda.html">Volver a la tienda</a></div>';
  document.getElementById("tituloRel").hidden = true;
} else {
  document.title = p.nombre + " · Cristian Store";
  document.getElementById("rutaNombre").textContent = p.nombre;
  var cantidad = 1;

  // Botones de talla (las prendas únicas no llevan talla)
  var htmlTallas = "";
  if (!p.unica) {
    var lista = ["S", "M", "L", "XL"];
    htmlTallas = '<p class="form-label mb-0">Talla</p><div class="tallas">';
    for (var i = 0; i < lista.length; i++) {
      var marcado = lista[i] == "M" ? "checked" : "";
      htmlTallas = htmlTallas + '<label><input type="radio" name="talla" value="' + lista[i] + '" ' + marcado + "><span>" + lista[i] + "</span></label>";
    }
    htmlTallas = htmlTallas + "</div>";
  }

  detalle.innerHTML = '<div class="detalle">' +
    '<div class="foto-grande aparecer" style="background:' + p.color + '">' + fotoHtml(p) + "</div>" +
    '<div class="aparecer"><small>' + p.cat + "</small><h1>" + p.nombre + "</h1>" +
    '<p class="precio fs-3">' + dinero(p.precio) + "</p><p>" + p.desc + "</p>" + htmlTallas +
    '<div class="d-flex flex-wrap gap-3 align-items-center">' +
    '<div class="cant"><button type="button" id="menos" aria-label="Menos">&minus;</button><span id="cant">1</span><button type="button" id="mas" aria-label="Más">+</button></div>' +
    '<button type="button" id="agregar" class="btn btn-lima btn-lg"><i class="bi bi-bag-plus"></i> Agregar al carrito</button>' +
    '<button type="button" class="btn btn-borde btn-lg fav fav-detalle" data-id="' + p.id + '"><i class="bi bi-heart"></i> <span class="fav-texto">Guardar</span></button></div>' +
    '<p id="aviso" class="mt-3 mb-0"></p>' +
    '<p class="small mt-3"><i class="bi bi-truck"></i> Envío a todo el Perú o contraentrega en Lima y Callao.</p></div></div>';

  document.getElementById("menos").addEventListener("click", function () {
    if (cantidad > 1) cantidad = cantidad - 1;
    document.getElementById("cant").textContent = cantidad;
  });
  document.getElementById("mas").addEventListener("click", function () {
    if (cantidad < 10) cantidad = cantidad + 1;
    document.getElementById("cant").textContent = cantidad;
  });

  document.getElementById("agregar").addEventListener("click", function () {
    var talla = "Única";
    if (!p.unica) {
      talla = document.querySelector("input[name=talla]:checked").value;
    }
    agregarAlCarrito(p.id, talla, cantidad);
    document.getElementById("aviso").innerHTML = "Agregaste " + cantidad + " × " + p.nombre + " (" + talla + '). <a href="carrito.html">Ver carrito</a>';
  });

  // Productos relacionados: los de la misma categoría primero
  var relacionados = "";
  var total = 0;
  for (var j = 0; j < productos.length && total < 4; j++) {
    if (productos[j].cat == p.cat && productos[j].id != p.id) {
      relacionados = relacionados + crearTarjeta(productos[j], total);
      total++;
    }
  }
  for (var k = 0; k < productos.length && total < 4; k++) {
    if (productos[k].cat != p.cat) {
      relacionados = relacionados + crearTarjeta(productos[k], total);
      total++;
    }
  }
  document.getElementById("relacionados").innerHTML = relacionados;
}
revelar();


