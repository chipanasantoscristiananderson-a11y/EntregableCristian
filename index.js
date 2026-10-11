/* ===== Cristian Store · index.js: lógica de index.html (requiere comun.js) ===== */
/* Productos destacados */
var destacados = [1, 3, 5, 7];
var htmlDestacados = "";
for (var i = 0; i < destacados.length; i++) {
  htmlDestacados = htmlDestacados + crearTarjeta(buscarProducto(destacados[i]), i);
}
document.getElementById("destacados").innerHTML = htmlDestacados;
revelar();

/* Números que suben al llegar a ellos */
function contar(elemento) {
  var meta = Number(elemento.dataset.meta);
  var actual = 0;
  var paso = Math.ceil(meta / 60);
  var reloj = setInterval(function () {
    actual = actual + paso;
    if (actual >= meta) {
      actual = meta;
      clearInterval(reloj);
    }
    elemento.textContent = actual.toLocaleString("es-PE");
  }, 25);
}

var vigilante = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      contar(entrada.target);
      vigilante.unobserve(entrada.target);
    }
  });
}, { threshold: 0.6 });

var numeros = document.querySelectorAll("[data-meta]");
for (var n = 0; n < numeros.length; n++) {
  vigilante.observe(numeros[n]);
}

/* Formulario de contacto */
var form = document.getElementById("formContacto");
soloNumeros(form.elements.celular);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var bien = true;
  var f = form.elements;

  var partes = f.nombre.value.trim().split(" ");
  if (!revisar(f.nombre, partes.length >= 2 && f.nombre.value.trim().length >= 5, "Escribe tu nombre y apellido.")) bien = false;
  if (!revisar(f.correo, esCorreo(f.correo.value), "Escribe un correo válido, como nombre@correo.com.")) bien = false;
  if (!revisar(f.celular, esCelular(f.celular.value), "El celular debe tener 9 dígitos y empezar con 9.")) bien = false;
  if (!revisar(f.asunto, f.asunto.value != "", "Elige un tema.")) bien = false;
  if (!revisar(f.mensaje, f.mensaje.value.trim().length >= 10, "Escribe un mensaje de al menos 10 letras.")) bien = false;

  var respuesta = document.getElementById("respuesta");
  var faltas = [];
  if (f.cliente.value == "") faltas.push("cuéntanos si ya compraste antes");
  if (!f.terminos.checked) faltas.push("acepta los términos y condiciones");

  if (!bien || faltas.length > 0) {
    var extra = faltas.length > 0 ? " Además, " + faltas.join(" y ") + "." : "";
    respuesta.innerHTML = '<div class="alert alert-danger mb-0">Revisa los campos marcados en rojo.' + extra + "</div>";
    return;
  }

  var texto = textoPost("/contacto", form);
  console.log(texto);
  var primerNombre = partes[0];
  form.reset();
  respuesta.innerHTML = '<div class="alert alert-success mb-0">Gracias, <strong id="nom"></strong>. Te responderemos pronto.' +
    '<details class="mt-2"><summary>Ver datos enviados (simulación POST)</summary><pre class="envio" id="datos"></pre></details></div>';
  document.getElementById("nom").textContent = primerNombre;
  document.getElementById("datos").textContent = texto;
});

form.addEventListener("reset", function () {
  var malos = form.querySelectorAll(".is-invalid");
  for (var i = 0; i < malos.length; i++) quitarError(malos[i]);
  document.getElementById("respuesta").innerHTML = "";
});


