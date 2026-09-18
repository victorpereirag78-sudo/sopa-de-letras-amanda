// PUNTUACION.JS — Cálculo y acumulación del puntaje de la partida en curso.
window.Puntuacion = class Puntuacion {
  constructor(multiplicadorDificultad = 1) {
    this.multiplicadorDificultad = multiplicadorDificultad;
    this.total = 0;
  }

  puntosPorPalabra(palabra, comboActual) {
    const base = palabra.length * 10;
    const bonusLargo = palabra.length >= 8 ? 40 : palabra.length >= 6 ? 15 : 0;
    const bruto = (base + bonusLargo) * this.multiplicadorDificultad * comboActual;
    return Math.round(bruto);
  }

  sumar(puntos) {
    this.total += puntos;
    return this.total;
  }

  penalizarAyuda() {
    const penalizacion = 15;
    this.total = Math.max(0, this.total - penalizacion);
    return penalizacion;
  }
};
