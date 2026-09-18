// USUARIO.JS — Nombre del jugador y saludos personalizados según la hora local.
window.Usuario = (() => {
  function obtenerNombre() {
    return window.Almacenamiento.obtener().jugador.nombre;
  }

  function establecerNombre(nombre) {
    const limpio = (nombre || '').trim().slice(0, 18);
    window.Almacenamiento.actualizar((estado) => {
      estado.jugador.nombre = limpio;
    });
    return limpio;
  }

  function saludoPorHora(nombre) {
    const hora = new Date().getHours();
    if (hora >= 0 && hora < 12) return `¡Buenos días, ${nombre}! ☀️`;
    if (hora >= 12 && hora < 20) return `¡Buenas tardes, ${nombre}! 🌤️`;
    return `¡Buenas noches, ${nombre}! 🌙`;
  }

  function fraseAnimo(nombre) {
    const frases = window.Constantes.MENSAJES_ANIMO;
    const frase = frases[Math.floor(Math.random() * frases.length)];
    return frase.replace('{nombre}', nombre);
  }

  return { obtenerNombre, establecerNombre, saludoPorHora, fraseAnimo };
})();
