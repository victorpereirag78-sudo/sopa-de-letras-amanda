// PANTALLAS.JS — Gestor de las pantallas DOM (nombre, temática, dificultad,
// HUD del juego, pausa, resultado) y su cableado con los eventos que emite
// EscenaTablero a través de window.EventosJuego. No contiene reglas del
// juego: solo refleja su estado en la interfaz.
window.Pantallas = (() => {
  const el = (id) => document.getElementById(id);

  function mostrar(idPantalla) {
    document.querySelectorAll('[data-pantalla]').forEach((s) => s.classList.add('oculta'));
    el(idPantalla).classList.remove('oculta');
  }

  function formatearTiempo(segundos) {
    const s = Math.max(0, Math.round(segundos));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  function crearMensajeFlotanteCombo(mensaje) {
    const capa = el('capa-flotantes');
    const div = document.createElement('div');
    div.className = 'mensaje-combo';
    div.textContent = mensaje;
    capa.appendChild(div);
    setTimeout(() => div.remove(), 1350);
  }

  function pintarGrillaTematicas(alSeleccionar) {
    const cont = el('grilla-tematicas');
    cont.innerHTML = '';
    window.Tematicas.forEach((tema) => {
      const div = document.createElement('div');
      div.className = 'tarjeta-tematica';
      div.dataset.id = tema.id;
      div.innerHTML = `<span class="emoji">${tema.emoji}</span><span class="nombre">${tema.nombre}</span>`;
      div.addEventListener('click', () => alSeleccionar(tema, div));
      cont.appendChild(div);
    });
  }

  function pintarListaDificultades(alSeleccionar) {
    const cont = el('lista-dificultades');
    cont.innerHTML = '';
    window.Dificultades.forEach((dif) => {
      const div = document.createElement('div');
      div.className = 'opcion-dificultad';
      div.dataset.id = dif.id;
      div.innerHTML = `
        <span class="emoji">${dif.emoji}</span>
        <span class="info">
          <span class="nombre">${dif.nombre}</span>
          <span class="detalle">${dif.tamano}×${dif.tamano} · ${dif.cantidadPalabras} palabras</span>
        </span>`;
      div.addEventListener('click', () => alSeleccionar(dif, div));
      cont.appendChild(div);
    });
  }

  function marcarSeleccionUnica(contenedorId, elementoActivo, claseActiva) {
    el(contenedorId).querySelectorAll('.' + claseActiva).forEach((n) => n.classList.remove(claseActiva));
    elementoActivo.classList.add(claseActiva);
  }

  function pintarListaPalabras(colocaciones) {
    const ul = el('lista-palabras');
    ul.innerHTML = '';
    colocaciones.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = c.palabra;
      li.dataset.palabra = c.palabra;
      ul.appendChild(li);
    });
  }

  function marcarPalabraEnLista(palabra) {
    const li = el('lista-palabras').querySelector(`[data-palabra="${palabra}"]`);
    if (li) li.classList.add('encontrada');
  }

  function actualizarCuposAyuda(ayudas) {
    ['pista', 'primeraLetra', 'revolver', 'congelar'].forEach((tipo) => {
      const mapaId = { pista: 'cant-pista', primeraLetra: 'cant-primera', revolver: 'cant-revolver', congelar: 'cant-congelar' };
      const mapaBoton = { pista: 'ayuda-pista', primeraLetra: 'ayuda-primera', revolver: 'ayuda-revolver', congelar: 'ayuda-congelar' };
      const cupos = ayudas.quedan(tipo);
      el(mapaId[tipo]).textContent = cupos;
      el(mapaBoton[tipo]).disabled = cupos <= 0;
    });
  }

  function actualizarHudPuntos(total) {
    el('hud-puntos').textContent = total;
  }

  function actualizarHudCombo(contador) {
    const caja = el('hud-combo-caja');
    el('hud-combo').textContent = `x${contador}`;
    if (contador > 1) {
      caja.classList.add('combo-activo');
      setTimeout(() => caja.classList.remove('combo-activo'), 700);
    }
  }

  function actualizarHudTiempo(segundosRestantes, segundosTotales, modoRelax) {
    const caja = el('hud-tiempo-caja');
    const barra = el('barra-tiempo');
    if (modoRelax) {
      el('hud-tiempo').textContent = '∞';
      el('barra-tiempo-contenedor').classList.add('oculto');
      return;
    }
    el('hud-tiempo').textContent = formatearTiempo(segundosRestantes);
    const proporcion = Math.max(0, segundosRestantes / segundosTotales);
    barra.style.width = `${proporcion * 100}%`;
    const bajo = proporcion <= 0.2;
    barra.classList.toggle('alerta', bajo);
    caja.classList.toggle('tiempo-alerta', bajo);
  }

  return {
    el, mostrar, formatearTiempo, crearMensajeFlotanteCombo,
    pintarGrillaTematicas, pintarListaDificultades, marcarSeleccionUnica,
    pintarListaPalabras, marcarPalabraEnLista, actualizarCuposAyuda,
    actualizarHudPuntos, actualizarHudCombo, actualizarHudTiempo
  };
})();
