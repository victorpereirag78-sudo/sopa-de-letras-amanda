// AYUDAS.JS — Poderes de ayuda: pista, primera letra, revolver y congelar.
// No conoce Phaser ni el DOM: recibe callbacks desde EscenaTablero y solo
// controla cupos disponibles y penalización de puntaje.
window.Ayudas = class Ayudas {
  constructor(cupos) {
    this.cupos = Object.assign({}, cupos);
  }

  quedan(tipo) {
    return this.cupos[tipo] || 0;
  }

  usar(tipo) {
    if (this.quedan(tipo) <= 0) return false;
    this.cupos[tipo] -= 1;
    return true;
  }
};
