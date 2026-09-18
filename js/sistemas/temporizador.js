// TEMPORIZADOR.JS — Cuenta regresiva de la partida. En modo relax simplemente
// no se inicia y todas las llamadas quedan inertes.
window.Temporizador = class Temporizador {
  constructor({ segundosTotales, modoRelax, alActualizar, alTerminar, alBajoTiempo }) {
    this.segundosTotales = segundosTotales;
    this.segundosRestantes = segundosTotales;
    this.modoRelax = modoRelax;
    this.alActualizar = alActualizar || (() => {});
    this.alTerminar = alTerminar || (() => {});
    this.alBajoTiempo = alBajoTiempo || (() => {});
    this.intervalo = null;
    this.congelado = false;
    this.avisoBajoTiempoEmitido = false;
  }

  iniciar() {
    if (this.modoRelax) {
      this.alActualizar(this.segundosRestantes, this.segundosTotales);
      return;
    }
    this.intervalo = setInterval(() => {
      if (this.congelado) return;
      this.segundosRestantes -= 1;
      if (!this.avisoBajoTiempoEmitido && this.segundosRestantes <= this.segundosTotales * 0.2) {
        this.avisoBajoTiempoEmitido = true;
        this.alBajoTiempo();
      }
      this.alActualizar(this.segundosRestantes, this.segundosTotales);
      if (this.segundosRestantes <= 0) {
        this.detener();
        this.alTerminar();
      }
    }, 1000);
  }

  congelar(ms) {
    if (this.modoRelax) return;
    this.congelado = true;
    setTimeout(() => { this.congelado = false; }, ms);
  }

  detener() {
    if (this.intervalo) clearInterval(this.intervalo);
    this.intervalo = null;
  }

  segundosTranscurridos() {
    return this.segundosTotales - this.segundosRestantes;
  }
};
