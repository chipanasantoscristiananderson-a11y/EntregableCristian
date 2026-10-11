/* 1. Datos de los productos */
var productos = [
  { id: 1, nombre: "Polo Básico Pima", cat: "Polos", precio: 59, icono: "👕", color: "#dfe9ff", desc: "Algodón pima suave y fresco. Corte regular y cuello reforzado que no se deforma." },
  { id: 2, nombre: "Polo Oversize", cat: "Polos", precio: 69, icono: "👕", color: "#ffe3d6", desc: "Corte holgado y caída relajada. Ideal para combinar con jeans o joggers." },
  { id: 3, nombre: "Polera con Capucha", cat: "Poleras", precio: 139, icono: "🧥", color: "#e4f5d8", desc: "Felpa interior suave, bolsillo canguro y cordón ajustable." },
  { id: 4, nombre: "Casaca Denim", cat: "Poleras", precio: 189, icono: "🧥", color: "#d6e6f5", desc: "Denim lavado de grosor medio. Se ve bien con todo." },
  { id: 5, nombre: "Jean Recto", cat: "Pantalones", precio: 159, icono: "👖", color: "#e7e0f7", desc: "Tiro medio y pierna recta. Denim con un poco de elasticidad." },
  { id: 6, nombre: "Jogger de Algodón", cat: "Pantalones", precio: 119, icono: "👖", color: "#f7ecd0", desc: "Cintura elástica, bolsillos laterales y puños ajustados." },
  { id: 7, nombre: "Gorra Trama", cat: "Accesorios", precio: 45, icono: "🧢", color: "#fbd9e1", desc: "Gorra de algodón con visera curva y cierre ajustable.", unica: true },
  { id: 8, nombre: "Bolso Tote", cat: "Accesorios", precio: 39, icono: "👜", color: "#d9f3ee", desc: "Tela gruesa, asas largas y espacio para laptop de 14 pulgadas.", unica: true },
  { id: 9, nombre: "Polo Rayas", cat: "Polos", precio: 64, icono: "👕", color: "#fdeec4", desc: "Rayas finas en algodón peinado. Un básico que se nota." },
  { id: 10, nombre: "Short de Playa", cat: "Pantalones", precio: 79, icono: "🩳", color: "#d5eefc", desc: "Secado rápido, bolsillo con cierre y forro interior." },
  { id: 11, nombre: "Polera Cuello Alto", cat: "Poleras", precio: 129, icono: "🧶", color: "#ecdcf5", desc: "Tejido grueso para las noches frías de Lima y la sierra." },
  { id: 12, nombre: "Medias Pack x3", cat: "Accesorios", precio: 29, icono: "🧦", color: "#e1f5e7", desc: "Tres pares de algodón con puño elástico.", unica: true }
];

/* 2. Funciones de ayuda */
function dinero(numero) {
  return "S/ " + numero;
}

function buscarProducto(id) {
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id == id) {
      return productos[i];
    }
  }
  return null;
}

/* 3. Carrito (se guarda en localStorage para verlo en todas las páginas) */
function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } catch (e) {}
  actualizarContador(false);
}

function actualizarContador(conSalto) {
  var carrito = leerCarrito();
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    total = total + carrito[i].cant;
  }
  var globo = document.getElementById("contador");
  globo.textContent = total;
  if (conSalto) {
    globo.classList.remove("salto");
    void globo.offsetWidth; // reinicia la animación
    globo.classList.add("salto");
  }
}

function agregarAlCarrito(id, talla, cantidad) {
  var carrito = leerCarrito();
  var encontrado = false;
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id && carrito[i].talla == talla) {
      carrito[i].cant = carrito[i].cant + cantidad;
      encontrado = true;
    }
  }
  if (!encontrado) {
    carrito.push({ id: id, talla: talla, cant: cantidad });
  }
  guardarCarrito(carrito);
  actualizarContador(true);
}

/* Foto del producto: se toma del bloque <div id="fotos"> del HTML. Si no hay imagen, se muestra el emoji */
function fotoHtml(p) {
  var img = document.querySelector('#fotos img[data-id="' + p.id + '"]');
  if (!img) {
    return "<span>" + p.icono + "</span>";
  }
  return '<img src="' + img.getAttribute("src") + '" alt="' + p.nombre + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'">' +
    '<span style="display:none">' + p.icono + '</span>';
}

/* 4. Tarjeta de producto (HTML que se repite en varias páginas) */
function crearTarjeta(p, posicion) {
  var retraso = (posicion % 4) * 0.1;
  return '<div class="col-6 col-lg-3 aparecer" style="transition-delay:' + retraso + 's">' +
    '<a class="prod" href="producto.html?id=' + p.id + '">' +
    '<div class="foto" style="background:' + p.color + '">' + fotoHtml(p) + '</div>' +
    '<div class="info"><small>' + p.cat + '</small><h3>' + p.nombre + '</h3>' +
    '<span class="precio">' + dinero(p.precio) + '</span></div></a></div>';
}

/* 5. Animación al hacer scroll: muestra los elementos con clase "aparecer" */
var observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visto");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12 });

function revelar() {
  var elementos = document.querySelectorAll(".aparecer:not(.visto)");
  for (var i = 0; i < elementos.length; i++) {
    observador.observe(elementos[i]);
  }
}

/* 6. Scroll: barra de progreso, sombra del menú y botón de subir */
var cabecera = document.querySelector("header");
var barra = document.getElementById("progreso");
var botonSubir = document.getElementById("subir");

function alHacerScroll() {
  var alto = document.documentElement.scrollHeight - window.innerHeight;
  var porcentaje = alto > 0 ? (window.scrollY / alto) * 100 : 0;
  barra.style.width = porcentaje + "%";
  cabecera.classList.toggle("sombra", window.scrollY > 10);
  botonSubir.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", alHacerScroll);
botonSubir.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* 7. Tema claro / oscuro */
var botonTema = document.getElementById("btnTema");

function ponerTema(tema) {
  document.documentElement.setAttribute("data-bs-theme", tema);
  botonTema.textContent = tema == "dark" ? "☀️" : "🌙";
  try {
    localStorage.setItem("tema", tema);
  } catch (e) {}
}

ponerTema(document.documentElement.getAttribute("data-bs-theme") || "light");
botonTema.addEventListener("click", function () {
  if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
    ponerTema("light");
  } else {
    ponerTema("dark");
  }
});

/* 8. Ayudas para los formularios */
function mostrarError(campo, mensaje) {
  var aviso = campo.parentElement.querySelector(".invalid-feedback");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "invalid-feedback";
    campo.after(aviso);
  }
  aviso.textContent = mensaje;
  campo.classList.add("is-invalid");
}

function quitarError(campo) {
  campo.classList.remove("is-invalid");
  var aviso = campo.parentElement.querySelector(".invalid-feedback");
  if (aviso) {
    aviso.remove();
  }
}

// Revisa una condición: si falla muestra el error y devuelve false
function revisar(campo, condicion, mensaje) {
  if (condicion) {
    quitarError(campo);
    return true;
  }
  mostrarError(campo, mensaje);
  return false;
}

function esCorreo(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto);
}

function esCelular(texto) {
  return /^9\d{8}$/.test(texto.replace(/\s/g, ""));
}

function soloNumeros(campo) {
  campo.addEventListener("input", function () {
    campo.value = campo.value.replace(/[^\d\s]/g, "").slice(0, 11);
  });
}

// Simula lo que viajaría al servidor con POST
function textoPost(ruta, formulario) {
  var texto = "POST " + ruta + "\nContent-Type: application/x-www-form-urlencoded\n";
  var datos = new FormData(formulario);
  datos.forEach(function (valor, nombre) {
    texto = texto + "\n" + nombre + "=" + valor;
  });
  return texto;
}

/* ===== Extras: cupones, avisos, favoritos y barra de anuncio (común a todas las páginas) ===== */
(function () {
  /* Cupones disponibles (puedes agregar más aquí) */
  window.CUPONES = {
    CRISTIANSPIDER2026: { tipo: "porc", valor: 10, texto: "10% de descuento" },
    ENVIOGRATIS: { tipo: "envio", texto: "envío gratis" }
  };
  window.cuponActivo = function () {
    try {
      var c = localStorage.getItem("cupon");
      if (c && window.CUPONES[c]) {
        var o = { codigo: c };
        for (var k in window.CUPONES[c]) o[k] = window.CUPONES[c][k];
        return o;
      }
    } catch (e) {}
    return null;
  };

  /* Dinero con 2 decimales solo cuando hace falta */
  dinero = function (n) {
    n = Math.round(n * 100) / 100;
    return "S/ " + (n % 1 === 0 ? n : n.toFixed(2));
  };

  /* Avisos flotantes */
  var cajaAvisos = document.createElement("div");
  cajaAvisos.id = "avisos";
  cajaAvisos.setAttribute("aria-live", "polite");
  document.body.appendChild(cajaAvisos);

  window.avisar = function (html, icono) {
    var a = document.createElement("div");
    a.className = "aviso";
    a.innerHTML = '<i class="bi ' + (icono || "bi-check-circle-fill") + '"></i><span>' + html + "</span>";
    cajaAvisos.appendChild(a);
    while (cajaAvisos.children.length > 3) cajaAvisos.removeChild(cajaAvisos.firstChild);
    setTimeout(function () {
      a.classList.add("saliendo");
      setTimeout(function () { a.remove(); }, 350);
    }, 3500);
  };

  /* Aviso al agregar al carrito */
  var agregarOriginal = agregarAlCarrito;
  agregarAlCarrito = function (id, talla, cantidad) {
    agregarOriginal(id, talla, cantidad);
    var pr = buscarProducto(id);
    window.avisar("<strong>" + cantidad + " × " + pr.nombre + '</strong> agregado. <a href="carrito.html">Ver carrito</a>', "bi-bag-check-fill");
  };

  /* Favoritos */
  function leerFav() {
    try { return JSON.parse(localStorage.getItem("favoritos")) || []; } catch (e) { return []; }
  }
  function guardarFav(lista) {
    try { localStorage.setItem("favoritos", JSON.stringify(lista)); } catch (e) {}
  }
  window.esFav = function (id) { return leerFav().indexOf(Number(id)) != -1; };

  function pintarFav() {
    var lista = leerFav();
    var botones = document.querySelectorAll(".fav");
    for (var i = 0; i < botones.length; i++) {
      var b = botones[i];
      var on = lista.indexOf(Number(b.dataset.id)) != -1;
      b.classList.toggle("activo", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      var ico = b.querySelector("i");
      if (ico) ico.className = on ? "bi bi-heart-fill" : "bi bi-heart";
      var tx = b.querySelector(".fav-texto");
      if (tx) tx.textContent = on ? "En favoritos" : "Guardar";
    }
    var c = document.getElementById("favContador");
    if (c) c.textContent = lista.length;
  }

  var tarjetaOriginal = crearTarjeta;
  crearTarjeta = function (p, posicion) {
    var h = tarjetaOriginal(p, posicion);
    var i = h.lastIndexOf("</div>");
    return h.slice(0, i) + '<button type="button" class="fav" data-id="' + p.id + '" aria-label="Guardar ' + p.nombre + ' en favoritos"><i class="bi bi-heart"></i></button>' + h.slice(i);
  };

  var revelarOriginal = revelar;
  revelar = function () {
    revelarOriginal();
    pintarFav();
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".fav");
    if (!b) return;
    e.preventDefault();
    var id = Number(b.dataset.id);
    var lista = leerFav();
    var pos = lista.indexOf(id);
    var pr = buscarProducto(id);
    if (pos == -1) {
      lista.push(id);
      window.avisar("<strong>" + pr.nombre + "</strong> guardado en favoritos", "bi-heart-fill");
    } else {
      lista.splice(pos, 1);
      window.avisar("<strong>" + pr.nombre + "</strong> quitado de favoritos", "bi-heart");
    }
    guardarFav(lista);
    pintarFav();
    if (typeof categoria !== "undefined" && categoria == "Favoritos" && typeof mostrarProductos == "function") {
      mostrarProductos();
    }
  });
  pintarFav();

  /* Barra de anuncio con el cupón */
  var cerrado = false;
  try { cerrado = sessionStorage.getItem("anuncioCerrado") == "1"; } catch (e) {}
  if (!cerrado) {
    var anuncio = document.createElement("div");
    anuncio.className = "anuncio";
    anuncio.innerHTML = '<span><i class="bi bi-gift"></i> Usa el cupón <strong>CRISTIANSPIDER2026</strong> y llévate 10% de descuento</span>' +
      '<button type="button" class="anuncio-copiar">Copiar código</button>' +
      '<button type="button" class="anuncio-x" aria-label="Cerrar anuncio"><i class="bi bi-x-lg"></i></button>';
    document.body.insertBefore(anuncio, document.body.firstChild);
    anuncio.querySelector(".anuncio-copiar").addEventListener("click", function () {
      var ok = function () { window.avisar("Código <strong>CRISTIANSPIDER2026</strong> copiado. Úsalo en tu carrito.", "bi-clipboard-check-fill"); };
      var falla = function () { window.avisar("Tu código es <strong>CRISTIANSPIDER2026</strong>", "bi-gift-fill"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("CRISTIANSPIDER2026").then(ok, falla);
      } else {
        falla();
      }
    });
    anuncio.querySelector(".anuncio-x").addEventListener("click", function () {
      anuncio.remove();
      try { sessionStorage.setItem("anuncioCerrado", "1"); } catch (e) {}
    });
  }
})();

actualizarContador(false);
alHacerScroll();
revelar();

/* ===== Cristian Store · asistente virtual ===== */
(function () {
  /* ---------- Utilidades ---------- */
  function limpiar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ\s]/g, " ");
  }
  function tiene(texto, palabras) {
    for (var i = 0; i < palabras.length; i++) {
      if (texto.indexOf(palabras[i]) !== -1) return true;
    }
    return false;
  }
  function listaProductos(lista) {
    var h = '<ul class="chat-lista">';
    for (var i = 0; i < lista.length; i++) {
      h += '<li><a href="producto.html?id=' + lista[i].id + '"><span>' + lista[i].nombre + "</span><strong>" + dinero(lista[i].precio) + "</strong></a></li>";
    }
    return h + "</ul>";
  }
  function porCategoria(cat) {
    return productos.filter(function (p) { return p.cat == cat; });
  }

  /* ---------- Respuestas ---------- */
  var sugerencias = ["Envíos", "Contraentrega", "Tallas", "Ver polos", "Lo más barato", "Cupón", "Mi carrito", "Contacto"];

  function responder(entrada) {
    var t = limpiar(entrada);

    if (tiene(t, ["gracias", "genial", "buenisimo", "ok listo"])) {
      return "¡De nada! 😊 Si necesitas algo más, aquí estoy.";
    }
    if (tiene(t, ["adios", "chau", "hasta luego", "bye"])) {
      return "¡Hasta pronto! Gracias por visitar Cristian Store 💚";
    }
    if (tiene(t, ["contraentrega", "contra entrega", "pagar al recibir", "yape", "efectivo"])) {
      return "La <strong>contraentrega</strong> es solo para <strong>Lima y Callao</strong>. Cuesta S/ 10, llega en 24 a 48 horas y pagas en efectivo o Yape al repartidor.";
    }
    if (tiene(t, ["envio", "enviar", "delivery", "demora", "cuanto tarda", "llega", "provincia", "todo el peru", "gratis"])) {
      return "Enviamos a <strong>todo el Perú</strong> en 2 a 5 días hábiles. Cuesta S/ 15 y es <strong>gratis desde S/ 200</strong> de compra. Para Lima y Callao también tienes contraentrega.";
    }
    if (tiene(t, ["pago", "pagar", "tarjeta", "transferencia", "metodo"])) {
      return "Con envío a provincias pagas en línea (te mandamos los datos por correo). En Lima y Callao puedes pagar al recibir con efectivo o Yape.";
    }
    if (tiene(t, ["talla", "medida", "size"])) {
      return "Manejamos tallas <strong>S, M, L y XL</strong> en polos, poleras y pantalones. Las gorras, bolsos y medias son de talla única. ¿Dudas entre dos tallas? Escríbenos por WhatsApp y te asesoramos.";
    }
    if (tiene(t, ["cambio", "devolucion", "devolver", "garantia"])) {
      return "Tienes <strong>cambios gratis</strong>. Si la prenda no te queda o llegó con algún detalle, escríbenos por WhatsApp al 974 288 700 con tu código de pedido.";
    }
    if (tiene(t, ["contacto", "whatsapp", "telefono", "celular", "correo", "email", "numero", "hablar con"])) {
      return 'Puedes escribirnos por <a href="https://wa.me/51974288700" target="_blank" rel="noopener">WhatsApp (974 288 700)</a> o usar el <a href="index.html#contacto">formulario de contacto</a>. Respondemos en menos de 24 horas.';
    }
    if (tiene(t, ["carrito", "mi pedido", "cuanto llevo", "total"])) {
      var carrito = leerCarrito();
      if (carrito.length == 0) {
        return 'Tu carrito está vacío por ahora. <a href="tienda.html">Mira la tienda</a> y agrega tus prendas 🛍️';
      }
      var cant = 0, sub = 0;
      for (var i = 0; i < carrito.length; i++) {
        var pr = buscarProducto(carrito[i].id);
        cant += carrito[i].cant;
        if (pr) sub += pr.precio * carrito[i].cant;
      }
      var falta = sub < 200 ? " Te faltan " + dinero(200 - sub) + " para envío gratis." : " ¡Ya tienes envío gratis!";
      return "Llevas <strong>" + cant + "</strong> prenda(s) por <strong>" + dinero(sub) + "</strong>." + falta + ' <a href="carrito.html">Ir al carrito</a>';
    }

    if (tiene(t, ["cupon", "descuento", "promo", "codigo"])) {
      return "Tenemos el cupón <strong>CRISTIANSPIDER2026</strong> (10% de descuento) y <strong>ENVIOGRATIS</strong> (envío gratis). Los aplicas en <a href=\"carrito.html\">tu carrito</a>, en el recuadro de cupón.";
    }
    if (tiene(t, ["favorito", "guardar", "me gusta", "lista de deseos"])) {
      return "Toca el corazón ♥ de cualquier prenda para guardarla. Tus guardadas están en <a href=\"tienda.html?cat=Favoritos\">Favoritos</a>.";
    }

    /* Presupuesto: "menos de 100", "hasta 80 soles" */
    var num = t.match(/(\d{2,3})/);
    if (num && tiene(t, ["menos", "hasta", "maximo", "presupuesto", "soles"])) {
      var tope = Number(num[1]);
      var baratos = productos.filter(function (p) { return p.precio <= tope; }).sort(function (a, b) { return a.precio - b.precio; });
      if (baratos.length == 0) return "Por ahora no tenemos prendas de hasta " + dinero(tope) + ". Lo más económico son las medias por " + dinero(29) + ".";
      return "Estas prendas están en " + dinero(tope) + " o menos:" + listaProductos(baratos.slice(0, 5));
    }

    if (tiene(t, ["barato", "economico", "oferta", "promocion", "descuento"])) {
      var ord = productos.slice().sort(function (a, b) { return a.precio - b.precio; }).slice(0, 4);
      return "Lo más económico de la tienda:" + listaProductos(ord);
    }
    if (tiene(t, ["recomienda", "recomendar", "sugerencia", "que me llevo", "mas pedido", "popular", "regalo"])) {
      return "Lo más pedido ahora mismo:" + listaProductos([buscarProducto(1), buscarProducto(3), buscarProducto(5), buscarProducto(7)]);
    }

    /* Categorías */
    var cats = [
      { cat: "Polos", claves: ["polo", "camiseta"] },
      { cat: "Poleras", claves: ["polera", "casaca", "hoodie", "capucha", "buzo"] },
      { cat: "Pantalones", claves: ["pantalon", "jean", "jogger", "short"] },
      { cat: "Accesorios", claves: ["accesorio", "gorra", "bolso", "tote", "media"] }
    ];

    /* Producto específico por nombre */
    for (var k = 0; k < productos.length; k++) {
      var nom = limpiar(productos[k].nombre);
      var piezas = nom.split(/\s+/).filter(function (w) { return w.length > 3; });
      if (t.indexOf(nom) !== -1 || (piezas.length && tiene(t, [piezas[piezas.length - 1]]) && piezas[piezas.length - 1].length > 4)) {
        var pe = productos[k];
        return "<strong>" + pe.nombre + "</strong> (" + pe.cat + ") cuesta <strong>" + dinero(pe.precio) + "</strong>. " + pe.desc + ' <a href="producto.html?id=' + pe.id + '">Ver prenda</a>';
      }
    }
    for (var c = 0; c < cats.length; c++) {
      if (tiene(t, cats[c].claves)) {
        return "Esto tenemos en <strong>" + cats[c].cat + "</strong>:" + listaProductos(porCategoria(cats[c].cat));
      }
    }
    if (tiene(t, ["catalogo", "productos", "que venden", "que tienen", "tienda", "ropa"])) {
      return 'Tenemos <strong>polos, poleras, pantalones y accesorios</strong> de algodón peruano. <a href="tienda.html">Mira todo el catálogo</a> o dime qué categoría te interesa.';
    }
    if (tiene(t, ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "ola"])) {
      return "¡Hola! 👋 Soy el asistente de Cristian Store. Pregúntame por envíos, tallas, precios o prendas.";
    }
    if (tiene(t, ["quien eres", "como te llamas", "eres un bot", "robot"])) {
      return "Soy el asistente virtual de Cristian Store 🤖. Respondo rápido dudas de la tienda; para algo más personal te paso con una persona por WhatsApp.";
    }
    if (tiene(t, ["horario", "atienden", "abierto"])) {
      return "La tienda online está abierta las 24 horas. Atendemos mensajes por WhatsApp y respondemos en menos de 24 horas.";
    }
    return 'No estoy seguro de haberte entendido 🤔. Prueba con una de las opciones de abajo o escríbenos por <a href="https://wa.me/51974288700" target="_blank" rel="noopener">WhatsApp</a>.';
  }

  /* ---------- Construcción de la interfaz ---------- */
  var boton = document.createElement("button");
  boton.id = "chatBtn";
  boton.type = "button";
  boton.setAttribute("aria-label", "Abrir chat de ayuda");
  boton.setAttribute("aria-expanded", "false");
  boton.innerHTML = '<i class="bi bi-chat-dots-fill"></i><span class="punto"></span>';

  var panel = document.createElement("section");
  panel.id = "chatPanel";
  panel.setAttribute("aria-label", "Asistente virtual");
  panel.innerHTML =
    '<div class="chat-cab"><div class="chat-avatar"><i class="bi bi-robot"></i></div>' +
    '<div><strong>Asistente Cristian</strong><small>En línea</small></div>' +
    '<button type="button" class="chat-cerrar" aria-label="Cerrar chat"><i class="bi bi-x-lg"></i></button></div>' +
    '<div id="chatMsgs" role="log" aria-live="polite"></div>' +
    '<div class="chat-chips" id="chatChips"></div>' +
    '<form class="chat-form" id="chatForm" autocomplete="off">' +
    '<input type="text" id="chatInput" placeholder="Escribe tu pregunta…" aria-label="Escribe tu pregunta" maxlength="120">' +
    '<button type="submit" aria-label="Enviar"><i class="bi bi-send-fill"></i></button></form>';

  document.body.appendChild(panel);
  document.body.appendChild(boton);

  var msgs = document.getElementById("chatMsgs");
  var chips = document.getElementById("chatChips");
  var entrada = document.getElementById("chatInput");
  var saludado = false;
  var ocupado = false;

  function bajar() { msgs.scrollTop = msgs.scrollHeight; }

  function agregar(clase, html, esTexto) {
    var d = document.createElement("div");
    d.className = "burbuja-msg " + clase;
    if (esTexto) d.textContent = html; else d.innerHTML = html;
    msgs.appendChild(d);
    bajar();
    return d;
  }

  function botDice(html) {
    ocupado = true;
    var tipeo = document.createElement("div");
    tipeo.className = "burbuja-msg bot escribiendo";
    tipeo.innerHTML = "<i></i><i></i><i></i>";
    msgs.appendChild(tipeo);
    bajar();
    setTimeout(function () {
      tipeo.remove();
      agregar("bot", html);
      ocupado = false;
    }, 550 + Math.random() * 350);
  }

  function enviar(texto) {
    texto = texto.trim();
    if (!texto || ocupado) return;
    agregar("yo", texto, true);
    botDice(responder(texto));
  }

  for (var i = 0; i < sugerencias.length; i++) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.textContent = sugerencias[i];
    chip.addEventListener("click", function () { enviar(this.textContent); });
    chips.appendChild(chip);
  }

  function abrir(estado) {
    panel.classList.toggle("abierto", estado);
    boton.classList.toggle("abierto", estado);
    boton.setAttribute("aria-expanded", estado ? "true" : "false");
    boton.innerHTML = estado ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-chat-dots-fill"></i><span class="punto"></span>';
    if (estado) {
      if (!saludado) {
        saludado = true;
        botDice("¡Hola! 👋 Soy el asistente de <strong>Cristian Store</strong>. ¿En qué te ayudo? Elige una opción o escribe tu pregunta.");
      }
      setTimeout(function () { entrada.focus(); }, 250);
    }
  }

  boton.addEventListener("click", function () { abrir(!panel.classList.contains("abierto")); });
  panel.querySelector(".chat-cerrar").addEventListener("click", function () { abrir(false); boton.focus(); });
  document.addEventListener("keydown", function (e) {
    if (e.key == "Escape" && panel.classList.contains("abierto")) { abrir(false); boton.focus(); }
  });
  document.getElementById("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (ocupado) return;
    var v = entrada.value;
    entrada.value = "";
    enviar(v);
  });
})();
