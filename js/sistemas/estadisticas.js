// ESTADISTICAS.JS — Registro de estadísticas de juego y base para la
// adaptación progresiva de dificultad (punto 18 del brief: retroalimentación
// inteligente). No implementa aún recomendaciones automáticas de contenido,
// solo deja los datos listos para usarlas.
window.Estadisticas = (() => {
  function registrarPartida({ tematicaId, palabrasEncontradas, palabrasFalladas, ayudasUsadas, puntuacion, mejorCombo, tiempoMs }) {
    window.Almacenamiento.actualizar((estado) => {
      const e = estado.estadisticas;
      e.partidasJugadas += 1;
      e.palabrasEncontradas += palabrasEncontradas;
      e.palabrasFalladas += palabrasFalladas;
      e.ayudasUsadas += ayudasUsadas;
      e.mejorPuntuacion = Math.max(e.mejorPuntuacion, puntuacion);
      e.mejorCombo = Math.max(e.mejorCombo, mejorCombo);
      e.tiempoTotalMs += tiempoMs;

      if (!e.porTematica[tematicaId]) {
        e.porTematica[tematicaId] = { vecesJugada: 0, mejorPuntuacion: 0 };
      }
      e.porTematica[tematicaId].vecesJugada += 1;
      e.porTematica[tematicaId].mejorPuntuacion = Math.max(
        e.porTematica[tematicaId].mejorPuntuacion, puntuacion
      );
    });
  }

  function tematicaFavorita() {
    const porTematica = window.Almacenamiento.obtener().estadisticas.porTematica;
    let favorita = null;
    let max = 0;
    Object.keys(porTematica).forEach((id) => {
      if (porTematica[id].vecesJugada > max) {
        max = porTematica[id].vecesJugada;
        favorita = id;
      }
    });
    return favorita;
  }

  function obtener() {
    return window.Almacenamiento.obtener().estadisticas;
  }

  return { registrarPartida, tematicaFavorita, obtener };
})();
