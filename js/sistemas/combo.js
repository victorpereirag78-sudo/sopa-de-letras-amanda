// COMBO.JS — Rachas de aciertos consecutivos dentro de una ventana de tiempo.
window.Combo = class Combo {
  constructor(ventanaMs = window.Constantes.VENTANA_COMBO_MS) {
    this.ventanaMs = ventanaMs;
    this.contador = 1;
    this.mejor = 1;
    this.ultimoAcierto = 0;
  }

  registrarAcierto() {
    const ahora = Date.now();
    if (this.ultimoAcierto && (ahora - this.ultimoAcierto) <= this.ventanaMs) {
      this.contador += 1;
    } else {
      this.contador = 1;
    }
    this.ultimoAcierto = ahora;
    this.mejor = Math.max(this.mejor, this.contador);
    return this.contador;
  }

  mensajeParaNivelActual() {
    const niveles = Object.keys(window.Constantes.MENSAJES_COMBO).map(Number).sort((a, b) => b - a);
    const nivel = niveles.find((n) => this.contador === n);
    if (!nivel) return null;
    const opciones = window.Constantes.MENSAJES_COMBO[nivel];
    return opciones[Math.floor(Math.random() * opciones.length)];
  }
};
