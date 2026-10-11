/* ===== Cristian Store · carrito.js: lógica de carrito.html (requiere comun.js) ===== */
var form = document.getElementById("formPedido");
var f = form.elements;
soloNumeros(f.celular);

function tipoEntrega() {
  return f.entrega.value;
}

// Calcula el costo de envío según la modalidad
function costoEnvio(subtotal) {
  var cup = cuponActivo();
  if (cup && cup.tipo == "envio") {
    return 0;
  }
  if (tipoEntrega() == "contraentrega") {
    return 10;
  }
  if (subtotal >= 200) {
    return 0;
  }
  return 15;
}

// Dibuja la lista del carrito y los totales
function mostrarCarrito() {
  var carrito = leerCarrito();
  var html = "";
  var subtotal = 0;

  for (var i = 0; i < carrito.length; i++) {
    var item = carrito[i];
    var p = buscarProducto(item.id);
    if (!p) continue; // producto que ya no existe
    subtotal = subtotal + p.precio * item.cant;
    html = html + '<div class="fila">' +
      '<div class="mini" style="background:' + p.color + '">' + fotoHtml(p) + "</div>" +
      '<div><h3><a href="producto.html?id=' + p.id + '" class="text-reset text-decoration-none">' + p.nombre + "</a></h3>" +
      "<small>Talla " + item.talla + " · " + dinero(p.precio) + "</small></div>" +
      '<div class="cant"><button type="button" data-pos="' + i + '" data-cambio="-1">&minus;</button><span>' + item.cant + '</span><button type="button" data-pos="' + i + '" data-cambio="1">+</button></div>' +
      '<div class="d-flex align-items-center gap-2"><strong>' + dinero(p.precio * item.cant) + "</strong>" +
      '<button type="button" class="quitar" data-pos="' + i + '" data-cambio="0" aria-label="Quitar"><i class="bi bi-x-lg"></i></button></div></div>';
  }

  document.getElementById("lista").innerHTML = html;
  document.getElementById("vacioCarrito").hidden = carrito.length > 0;
  document.getElementById("compra").hidden = carrito.length == 0;

  var cupon = cuponActivo();
  var descuento = 0;
  if (cupon && cupon.tipo == "porc") {
    descuento = subtotal * cupon.valor / 100;
  }
  var envio = carrito.length > 0 ? costoEnvio(subtotal) : 0;
  var total = subtotal - descuento + envio;

  document.getElementById("rSub").textContent = dinero(subtotal);
  document.getElementById("rDescT").hidden = descuento == 0;
  document.getElementById("rDesc").hidden = descuento == 0;
  document.getElementById("rDesc").textContent = "- " + dinero(descuento);
  document.getElementById("rEnv").textContent = envio == 0 ? "Gratis" : dinero(envio);
  document.getElementById("rTot").textContent = dinero(total);

  // Barra de envío gratis
  var falta = 200 - subtotal;
  document.getElementById("envioTexto").innerHTML = falta > 0
    ? "Te faltan <strong>" + dinero(falta) + "</strong> para el envío gratis"
    : "¡Tienes envío gratis a todo el Perú! 🎉";
  document.getElementById("envioRelleno").style.width = Math.min(100, subtotal / 200 * 100) + "%";

  // Mensaje del cupón
  var mensajeCupon = document.getElementById("cuponMsg");
  if (cupon) {
    mensajeCupon.className = "small mt-2 mb-3";
    mensajeCupon.innerHTML = '<span class="descuento"><i class="bi bi-check-circle-fill"></i> <strong>' + cupon.codigo + "</strong> aplicado · " + cupon.texto + '</span><button type="button" class="enlace-quitar" id="quitarCupon">Quitar</button>';
  } else {
    mensajeCupon.innerHTML = "";
  }
  return total;
}

// Botones de sumar, restar y quitar
document.getElementById("lista").addEventListener("click", function (e) {
  var boton = e.target.closest("button");
  if (!boton) return;
  var carrito = leerCarrito();
  var pos = Number(boton.dataset.pos);
  var cambio = Number(boton.dataset.cambio);

  if (cambio == 0) {
    carrito.splice(pos, 1);
  } else {
    carrito[pos].cant = carrito[pos].cant + cambio;
    if (carrito[pos].cant < 1) {
      carrito.splice(pos, 1);
    }
  }
  guardarCarrito(carrito);
  mostrarCarrito();
});

document.getElementById("vaciar").addEventListener("click", function () {
  guardarCarrito([]);
  mostrarCarrito();
});

// Al cambiar la modalidad se recalcula el total
var radios = document.querySelectorAll("input[name=entrega]");
for (var r = 0; r < radios.length; r++) {
  radios[r].addEventListener("change", mostrarCarrito);
}

// Validación de los datos de entrega
function validarDatos() {
  var bien = true;
  var partes = f.nombres.value.trim().split(" ");
  if (!revisar(f.nombres, partes.length >= 2 && f.nombres.value.trim().length >= 5, "Escribe tu nombre y apellido.")) bien = false;
  if (!revisar(f.celular, esCelular(f.celular.value), "El celular debe tener 9 dígitos y empezar con 9.")) bien = false;
  if (!revisar(f.correo, esCorreo(f.correo.value), "Escribe un correo válido, como nombre@correo.com.")) bien = false;
  if (!revisar(f.departamento, f.departamento.value != "", "Elige tu departamento.")) bien = false;
  if (!revisar(f.direccion, f.direccion.value.trim().length >= 8, "Escribe tu dirección con distrito y referencia.")) bien = false;

  // La contraentrega solo existe en Lima y Callao
  var depto = f.departamento.value;
  if (bien && tipoEntrega() == "contraentrega" && depto != "Lima" && depto != "Callao") {
    mostrarError(f.departamento, "La contraentrega solo está disponible en Lima y Callao.");
    bien = false;
  }
  return bien;
}

// Enviar el pedido (simulación POST)
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var mensaje = document.getElementById("mensaje");

  if (!validarDatos()) {
    mensaje.innerHTML = '<div class="alert alert-danger mb-0">Revisa los campos marcados en rojo.</div>';
    return;
  }
  if (!f.terminos.checked) {
    mensaje.innerHTML = '<div class="alert alert-danger mb-0">Acepta los términos y condiciones para continuar.</div>';
    return;
  }

  var total = mostrarCarrito();
  var texto = textoPost("/pedidos", form) + "\ntotal=" + total + (cuponActivo() ? "\ncupon=" + cuponActivo().codigo : "");
  console.log(texto);

  var codigo = "TR-" + Math.floor(100000 + Math.random() * 900000);
  var nombre = f.nombres.value.trim().split(" ")[0];
  var textoEntrega = "Te enviaremos los datos de pago por correo. Tu pedido llega en 2 a 5 días hábiles.";
  if (tipoEntrega() == "contraentrega") {
    textoEntrega = "Te lo llevamos en 24 a 48 horas y pagas al recibir.";
  }

  guardarCarrito([]);
  try { localStorage.removeItem("cupon"); } catch (e) {}
  document.getElementById("compra").hidden = true;
  var caja = document.getElementById("confirmacion");
  caja.hidden = false;
  caja.innerHTML = '<h2>¡Gracias, <span id="cNombre"></span>! Tu pedido está confirmado.</h2>' +
    "<p>Código: <strong>" + codigo + "</strong> · Total: <strong>" + dinero(total) + "</strong></p>" +
    "<p>" + textoEntrega + "</p>" +
    '<details class="mb-3"><summary>Ver datos enviados (simulación POST)</summary><pre class="envio" id="cDatos"></pre></details>' +
    '<a href="tienda.html" class="btn btn-lima">Seguir comprando</a>';
  document.getElementById("cNombre").textContent = nombre;
  document.getElementById("cDatos").textContent = texto;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

form.addEventListener("reset", function () {
  var malos = form.querySelectorAll(".is-invalid");
  for (var i = 0; i < malos.length; i++) quitarError(malos[i]);
});

// Cupón de descuento
document.getElementById("formCupon").addEventListener("submit", function (e) {
  e.preventDefault();
  var entradaCupon = document.getElementById("cuponInput");
  var codigo = entradaCupon.value.trim().toUpperCase();
  var mensajeCupon = document.getElementById("cuponMsg");
  if (!CUPONES[codigo]) {
    mensajeCupon.className = "small mt-2 mb-3 text-danger";
    mensajeCupon.textContent = codigo == "" ? "Escribe un código de cupón." : "Ese cupón no existe. Revisa que esté bien escrito.";
    return;
  }
  try { localStorage.setItem("cupon", codigo); } catch (err) {}
  entradaCupon.value = "";
  mostrarCarrito();
  avisar("Cupón <strong>" + codigo + "</strong> aplicado: " + CUPONES[codigo].texto, "bi-tag-fill");
});

document.getElementById("cuponMsg").addEventListener("click", function (e) {
  if (e.target.closest("#quitarCupon")) {
    try { localStorage.removeItem("cupon"); } catch (err) {}
    mostrarCarrito();
  }
});

// Pedir por WhatsApp
document.getElementById("pedirWsp").addEventListener("click", function () {
  var items = leerCarrito();
  if (items.length == 0) {
    avisar("Tu carrito está vacío", "bi-bag");
    return;
  }
  var lineas = ["Hola Cristian Store, quiero hacer este pedido:", ""];
  for (var w = 0; w < items.length; w++) {
    var prod = buscarProducto(items[w].id);
    if (!prod) continue;
    lineas.push("• " + items[w].cant + " x " + prod.nombre + " (Talla " + items[w].talla + ") - " + dinero(prod.precio * items[w].cant));
  }
  var totalWsp = mostrarCarrito();
  var cuponWsp = cuponActivo();
  lineas.push("");
  if (cuponWsp) lineas.push("Cupón: " + cuponWsp.codigo);
  lineas.push("Entrega: " + (tipoEntrega() == "contraentrega" ? "Contraentrega (Lima/Callao)" : "Envío a todo el Perú"));
  lineas.push("Total: " + dinero(totalWsp));
  window.open("https://wa.me/51974288700?text=" + encodeURIComponent(lineas.join("\n")), "_blank", "noopener");
});

mostrarCarrito();


