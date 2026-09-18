// APP.JS — Orquestador principal: conecta pantallas, sistemas y la escena
// de Phaser. Es el único archivo que conoce el flujo completo de la app.
(() => {
  window.EventosJuego = new EventTarget();

  const P = window.Pantallas;
  const sesion = {
    tema: null,
    dificultad: null,
    modoRelax: false,
    ayudas: null,
    temporizador: null,
    palabrasFalladas: 0,
    ayudasUsadas: 0,
    animacionMostrada: false
  };

  let juegoPhaser = null;
  let juegoListo = false;

  function lanzarEscenaTablero(datos) {
    if (!juegoPhaser) {
      juegoPhaser = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'contenedor-phaser',
        width: 680,
        height: 680,
        transparent: true,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
      });
      juegoPhaser.events.once('ready', () => {
        juegoPhaser.scene.add('EscenaTablero', window.EscenaTablero, false);
        juegoListo = true;
        juegoPhaser.scene.start('EscenaTablero', datos);
      });
      return;
    }
    if (juegoListo) {
      juegoPhaser.scene.start('EscenaTablero', datos);
    } else {
      juegoPhaser.events.once('ready', () => juegoPhaser.scene.start('EscenaTablero', datos));
    }
  }

  // ---------- Pantalla: nombre ----------

  function irAPantallaNombre() {
    const nombreGuardado = window.Usuario.obtenerNombre();
    if (nombreGuardado) P.el('input-nombre').value = nombreGuardado;
    P.mostrar('pantalla-nombre');
  }

  P.el('form-nombre').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const valor = P.el('input-nombre').value;
    if (!valor.trim()) return;
    window.Usuario.establecerNombre(valor);
    irAPantallaTematica();
  });

  // ---------- Pantalla: temática ----------

  function irAPantallaTematica() {
    const nombre = window.Usuario.obtenerNombre();
    P.el('saludo-tematica').textContent = window.Usuario.saludoPorHora(nombre);
    P.mostrar('pantalla-tematica');
  }

  P.pintarGrillaTematicas((tema, elemento) => {
    sesion.tema = tema;
    P.marcarSeleccionUnica('grilla-tematicas', elemento, 'seleccionada');
    P.mostrar('pantalla-dificultad');
  });

  // ---------- Pantalla: dificultad ----------

  P.pintarListaDificultades((dif, elemento) => {
    sesion.dificultad = dif;
    P.marcarSeleccionUnica('lista-dificultades', elemento, 'seleccionada');
  });

  P.el('btn-volver-dificultad').addEventListener('click', () => P.mostrar('pantalla-tematica'));

  P.el('check-relax').addEventListener('change', (e) => { sesion.modoRelax = e.target.checked; });

  P.el('btn-jugar').addEventListener('click', () => {
    if (!sesion.dificultad) sesion.dificultad = window.Dificultades[0];
    iniciarPartida();
  });

  // ---------- Partida ----------

  function iniciarPartida() {
    const dif = sesion.dificultad;
    const tema = sesion.tema;

    let puzzle;
    try {
      puzzle = window.GeneradorSopa.generar({
        tamano: dif.tamano,
        bancoPalabras: tema.palabras,
        cantidadPalabras: dif.cantidadPalabras,
        largoMin: dif.largoMin,
        largoMax: dif.largoMax,
        ejes: dif.ejes,
        invertidas: dif.invertidas
      });
    } catch (error) {
      console.error(error);
      alert('No se pudo generar la sopa, intenta otra temática o dificultad.');
      return;
    }

    sesion.puzzle = puzzle;
    sesion.ayudas = new window.Ayudas(dif.ayudas);
    sesion.palabrasFalladas = 0;
    sesion.ayudasUsadas = 0;
    sesion.inicioMs = Date.now();

    P.el('panel-tematica-icono').textContent = tema.emoji;
    P.el('panel-tematica-nombre').textContent = tema.nombre;
    P.pintarListaPalabras(puzzle.colocaciones);
    P.actualizarCuposAyuda(sesion.ayudas);
    P.actualizarHudPuntos(0);
    P.actualizarHudCombo(1);

    const preferencias = window.Almacenamiento.obtener().preferencias;
    const vecesVistas = window.Almacenamiento.obtener().jugador.vecesAnimacionVista;
    const saltarAnimacion = vecesVistas >= 8;

    if (!saltarAnimacion) {
      window.Almacenamiento.actualizar((estado) => { estado.jugador.vecesAnimacionVista += 1; });
    }

    P.el('hud-principal').classList.add('en-intro');
    P.el('mensaje-plato').textContent = 'Preparando tu sopa...';
    P.el('mensaje-plato').classList.remove('oculto');
    P.el('btn-omitir-animacion').classList.toggle('oculto', saltarAnimacion || vecesVistas < 2);

    P.mostrar('pantalla-juego');

    lanzarEscenaTablero({
      puzzle,
      colorTema: tema.color,
      saltarAnimacion,
      multiplicadorDificultad: dif.multiplicador,
      animacionesReducidas: preferencias.animacionesReducidas
    });

    sesion.temporizador = new window.Temporizador({
      segundosTotales: dif.segundos,
      modoRelax: sesion.modoRelax,
      alActualizar: (restantes, totales) => P.actualizarHudTiempo(restantes, totales, sesion.modoRelax),
      alBajoTiempo: () => window.Sonido.tiempoBajo(),
      alTerminar: () => finalizarPartida({ tiempoAgotado: true })
    });
  }

  P.el('btn-omitir-animacion').addEventListener('click', () => {
    if (window.EscenaTableroInstancia) window.EscenaTableroInstancia.omitirAnimacion();
  });

  window.EventosJuego.addEventListener('mensaje-plato', (e) => {
    P.el('mensaje-plato').textContent = e.detail.mensaje;
  });

  window.EventosJuego.addEventListener('juego-listo', () => {
    P.el('hud-principal').classList.remove('en-intro');
    P.el('mensaje-plato').classList.add('oculto');
    P.el('btn-omitir-animacion').classList.add('oculto');
    sesion.temporizador.iniciar();
  });

  window.EventosJuego.addEventListener('combo-mensaje', (e) => P.crearMensajeFlotanteCombo(e.detail.mensaje));

  window.EventosJuego.addEventListener('palabra-encontrada', (e) => {
    P.marcarPalabraEnLista(e.detail.palabra);
    P.actualizarHudPuntos(e.detail.puntosTotal);
    P.actualizarHudCombo(e.detail.combo);
  });

  window.EventosJuego.addEventListener('seleccion-invalida', () => { sesion.palabrasFalladas += 1; });

  window.EventosJuego.addEventListener('nivel-completado', (e) => {
    finalizarPartida({ resumen: e.detail });
  });

  function finalizarPartida({ resumen, tiempoAgotado }) {
    if (sesion.temporizador) sesion.temporizador.detener();
    const tiempoSegundos = sesion.temporizador ? sesion.temporizador.segundosTranscurridos() : 0;
    const nombre = window.Usuario.obtenerNombre();

    const puntos = resumen ? resumen.puntos : (window.EscenaTableroInstancia ? window.EscenaTableroInstancia.puntuacion.total : 0);
    const encontradas = resumen ? resumen.palabras : (window.EscenaTableroInstancia ? window.EscenaTableroInstancia.encontradas.size : 0);
    const totalPalabras = sesion.puzzle.colocaciones.length;
    const mejorCombo = resumen ? resumen.mejorCombo : (window.EscenaTableroInstancia ? window.EscenaTableroInstancia.combo.mejor : 1);

    window.Estadisticas.registrarPartida({
      tematicaId: sesion.tema.id,
      palabrasEncontradas: encontradas,
      palabrasFalladas: sesion.palabrasFalladas,
      ayudasUsadas: sesion.ayudasUsadas,
      puntuacion: puntos,
      mejorCombo,
      tiempoMs: tiempoSegundos * 1000
    });

    let estrellas = 3;
    if (sesion.ayudasUsadas > 3) estrellas = 1;
    else if (sesion.ayudasUsadas > 0) estrellas = 2;
    if (tiempoAgotado && encontradas < totalPalabras) estrellas = 1;

    const tituloVictoria = ['¡Excelente', '¡Genial', '¡Increíble', '¡Muy bien'];
    P.el('resultado-titulo').textContent = tiempoAgotado && encontradas < totalPalabras
      ? `¡Se acabó el tiempo, ${nombre}!`
      : `${tituloVictoria[Math.floor(Math.random() * tituloVictoria.length)]}, ${nombre}!`;
    P.el('resultado-estrellas').textContent = '⭐'.repeat(estrellas) + '☆'.repeat(3 - estrellas);
    P.el('resultado-puntos').textContent = puntos;
    P.el('resultado-palabras').textContent = `${encontradas}/${totalPalabras}`;
    P.el('resultado-tiempo').textContent = P.formatearTiempo(tiempoSegundos);
    P.el('resultado-combo').textContent = `x${mejorCombo}`;

    if (!tiempoAgotado) window.Sonido.nivelCompletado();
    P.mostrar('pantalla-resultado');
  }

  // ---------- Ayudas ----------

  document.querySelectorAll('.btn-ayuda').forEach((boton) => {
    boton.addEventListener('click', () => aplicarAyuda(boton.dataset.ayuda));
  });

  function aplicarAyuda(tipo) {
    if (!sesion.ayudas || !sesion.ayudas.usar(tipo)) return;
    const escena = window.EscenaTableroInstancia;
    let exito = false;

    if (tipo === 'congelar') {
      sesion.temporizador.congelar(window.Constantes.DURACION_CONGELAR_MS);
      window.Sonido.ayuda();
      exito = true;
    } else if (escena) {
      if (tipo === 'pista') exito = escena.usarPista();
      else if (tipo === 'primeraLetra') exito = escena.usarPrimeraLetra();
      else if (tipo === 'revolver') exito = escena.usarRevolver();
    }

    if (!exito) {
      sesion.ayudas.cupos[tipo] += 1;
      return;
    }

    if ((tipo === 'pista' || tipo === 'primeraLetra') && escena) {
      escena.puntuacion.penalizarAyuda();
      P.actualizarHudPuntos(escena.puntuacion.total);
    }

    sesion.ayudasUsadas += 1;
    P.actualizarCuposAyuda(sesion.ayudas);
  }

  // ---------- Pausa ----------

  P.el('btn-pausa').addEventListener('click', () => {
    P.el('modal-pausa').classList.remove('oculta');
    P.el('check-sonido').checked = window.Sonido.estaActivo();
    P.el('check-animaciones').checked = window.Almacenamiento.obtener().preferencias.animacionesReducidas;
    if (sesion.temporizador) sesion.temporizador.congelado = true;
    if (juegoPhaser) juegoPhaser.scene.pause('EscenaTablero');
  });

  function reanudarDesdePausa() {
    P.el('modal-pausa').classList.add('oculta');
    if (sesion.temporizador) sesion.temporizador.congelado = false;
    if (juegoPhaser) juegoPhaser.scene.resume('EscenaTablero');
  }

  P.el('btn-continuar').addEventListener('click', reanudarDesdePausa);

  P.el('check-sonido').addEventListener('change', (e) => window.Sonido.activar(e.target.checked));
  P.el('check-animaciones').addEventListener('change', (e) => {
    window.Almacenamiento.actualizar((estado) => { estado.preferencias.animacionesReducidas = e.target.checked; });
  });

  P.el('btn-salir-inicio').addEventListener('click', () => {
    if (sesion.temporizador) sesion.temporizador.detener();
    P.el('modal-pausa').classList.add('oculta');
    irAPantallaNombre();
  });

  // ---------- Resultado ----------

  P.el('btn-jugar-otra').addEventListener('click', iniciarPartida);

  P.el('btn-cambiar-tema').addEventListener('click', () => {
    document.querySelectorAll('#grilla-tematicas .seleccionada').forEach((n) => n.classList.remove('seleccionada'));
    P.mostrar('pantalla-tematica');
    P.el('saludo-tematica').textContent = window.Usuario.saludoPorHora(window.Usuario.obtenerNombre());
  });

  P.el('btn-volver-inicio').addEventListener('click', irAPantallaNombre);

  // ---------- Arranque ----------

  irAPantallaNombre();
})();
