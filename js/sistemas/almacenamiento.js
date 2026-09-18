// ALMACENAMIENTO.JS — Persistencia local (localStorage). Toda lectura/escritura
// de progreso pasa por aquí, para poder cambiar el backend a Supabase (ver
// supabaseCliente.js) sin tocar el resto del juego.
window.Almacenamiento = (() => {
  const CLAVE = window.Constantes.CLAVE_ALMACENAMIENTO;

  function estadoInicial() {
    return {
      version: 1,
      jugador: { nombre: '', vecesAnimacionVista: 0 },
      preferencias: { sonido: true, animacionesReducidas: false },
      estadisticas: {
        partidasJugadas: 0,
        palabrasEncontradas: 0,
        palabrasFalladas: 0,
        ayudasUsadas: 0,
        mejorPuntuacion: 0,
        mejorCombo: 0,
        tiempoTotalMs: 0,
        porTematica: {}
      }
    };
  }

  function leer() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (!crudo) return estadoInicial();
      const datos = JSON.parse(crudo);
      return Object.assign(estadoInicial(), datos, {
        jugador: Object.assign(estadoInicial().jugador, datos.jugador),
        preferencias: Object.assign(estadoInicial().preferencias, datos.preferencias),
        estadisticas: Object.assign(estadoInicial().estadisticas, datos.estadisticas)
      });
    } catch (error) {
      console.warn('No se pudo leer el progreso guardado, se usa uno nuevo.', error);
      return estadoInicial();
    }
  }

  function guardar(estado) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (error) {
      console.warn('No se pudo guardar el progreso.', error);
    }
  }

  let estado = leer();

  return {
    obtener() { return estado; },
    actualizar(mutador) {
      mutador(estado);
      guardar(estado);
      if (window.SupabaseCliente && window.SupabaseCliente.estaActivo()) {
        window.SupabaseCliente.sincronizar(estado);
      }
      return estado;
    }
  };
})();
