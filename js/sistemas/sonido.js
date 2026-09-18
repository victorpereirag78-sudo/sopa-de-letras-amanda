// SONIDO.JS — Efectos de sonido sintetizados con Web Audio API (sin archivos
// externos). Se puede reemplazar cada efecto por un archivo .mp3/.ogg más
// adelante sin cambiar la API pública de este módulo.
window.Sonido = (() => {
  let contexto = null;
  let habilitado = window.Almacenamiento.obtener().preferencias.sonido;

  function obtenerContexto() {
    if (!contexto) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      contexto = new AudioCtx();
    }
    if (contexto.state === 'suspended') contexto.resume();
    return contexto;
  }

  function tono({ frecuencia, duracion = 0.12, tipo = 'sine', volumenInicial = 0.18, deslizarA = null }) {
    if (!habilitado) return;
    try {
      const ctx = obtenerContexto();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipo;
      osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);
      if (deslizarA) osc.frequency.exponentialRampToValueAtTime(deslizarA, ctx.currentTime + duracion);
      gain.gain.setValueAtTime(volumenInicial, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duracion + 0.02);
    } catch (error) {
      // Contextos de audio pueden fallar antes de la primera interacción; se ignora.
    }
  }

  return {
    activar(valor) {
      habilitado = valor;
      window.Almacenamiento.actualizar((estado) => { estado.preferencias.sonido = valor; });
    },
    estaActivo() { return habilitado; },
    seleccion() { tono({ frecuencia: 420, duracion: 0.05, tipo: 'square', volumenInicial: 0.06 }); },
    palabraEncontrada() { tono({ frecuencia: 520, duracion: 0.22, tipo: 'triangle', deslizarA: 900 }); },
    combo(nivel) { tono({ frecuencia: 600 + nivel * 40, duracion: 0.18, tipo: 'triangle', deslizarA: 1100 + nivel * 60 }); },
    error() { tono({ frecuencia: 180, duracion: 0.16, tipo: 'sawtooth', deslizarA: 110 }); },
    ayuda() { tono({ frecuencia: 700, duracion: 0.12, tipo: 'sine', deslizarA: 500 }); },
    nivelCompletado() {
      [523, 659, 784, 1046].forEach((frecuencia, i) => {
        setTimeout(() => tono({ frecuencia, duracion: 0.22, tipo: 'triangle' }), i * 110);
      });
    },
    tiempoBajo() { tono({ frecuencia: 300, duracion: 0.09, tipo: 'square', volumenInicial: 0.08 }); }
  };
})();
