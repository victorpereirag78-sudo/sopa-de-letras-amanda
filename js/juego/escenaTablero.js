// ESCENATABLERO.JS — Escena principal de Phaser: dibuja la grilla, gestiona
// la selección por arrastre (mouse y táctil), detecta palabras, dispara
// animaciones/partículas y expone eventos para que la capa DOM (pantallas.js)
// actualice el HUD. No conoce el temporizador ni el DOM directamente.
window.EscenaTablero = class EscenaTablero extends Phaser.Scene {
  constructor() {
    super('EscenaTablero');
  }

  init(data) {
    this.puzzle = data.puzzle;
    this.colorTema = data.colorTema || '#8b5cf6';
    this.saltarAnimacion = !!data.saltarAnimacion;
    this.multiplicadorDificultad = data.multiplicadorDificultad || 1;
    this.animacionesReducidas = !!data.animacionesReducidas;

    this.ANCHO = 680;
    this.ALTO = 680;
    this.margen = 10;
    this.tamano = this.puzzle.tamano;
    this.cellSize = Math.floor((this.ANCHO - this.margen * 2) / this.tamano);
    this.gridPx = this.cellSize * this.tamano;
    this.offsetX = (this.ANCHO - this.gridPx) / 2;
    this.offsetY = (this.ALTO - this.gridPx) / 2;

    this.puntuacion = new window.Puntuacion(this.multiplicadorDificultad);
    this.combo = new window.Combo();
    this.arrastrando = false;
    this.inicioSel = null;
    this.pathActual = [];
    this.fichas = [];
    this.encontradas = new Set();
  }

  colorHexANumero(hex) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  crearTexturas() {
    if (!this.textures.exists('ficha-tablero')) {
      const tam = 100;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(0, 0, tam, tam, 20);
      g.generateTexture('ficha-tablero', tam, tam);
      g.destroy();
    }
    if (!this.textures.exists('ficha-plato')) {
      const tam = 100;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x2a1359, 1);
      g.fillRoundedRect(0, 0, tam, tam, 18);
      g.lineStyle(3, 0xffffff, 0.25);
      g.strokeRoundedRect(2, 2, tam - 4, tam - 4, 16);
      g.generateTexture('ficha-plato', tam, tam);
      g.destroy();
    }
    if (!this.textures.exists('particula')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      g.fillCircle(8, 8, 8);
      g.generateTexture('particula', 16, 16);
      g.destroy();
    }
  }

  create() {
    this.crearTexturas();
    window.EscenaTableroInstancia = this;

    this.grupoSeleccion = this.add.graphics().setDepth(5);
    this.grupoFichas = this.add.container(0, 0).setDepth(6);

    const celdasPlano = [];
    this.fichas = [];
    for (let f = 0; f < this.tamano; f++) {
      this.fichas.push([]);
      for (let c = 0; c < this.tamano; c++) {
        const letra = this.puzzle.grilla[f][c];
        const x = this.offsetX + c * this.cellSize + this.cellSize / 2;
        const y = this.offsetY + f * this.cellSize + this.cellSize / 2;
        celdasPlano.push({ fila: f, columna: c, letra, x, y });

        const cont = this.add.container(x, y);
        const fondo = this.add.image(0, 0, 'ficha-tablero').setDisplaySize(this.cellSize * 0.98, this.cellSize * 0.98);
        fondo.setTint(0x241154);
        const texto = this.add.text(0, 0, letra, {
          fontFamily: 'Arial, sans-serif',
          fontSize: `${Math.round(this.cellSize * 0.88)}px`,
          fontStyle: 'bold',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: Math.max(2, Math.round(this.cellSize * 0.045))
        }).setOrigin(0.5);
        cont.add([fondo, texto]);
        this.grupoFichas.add(cont);
        this.fichas[f][c] = { cont, fondo, texto, encontrada: false, revelada: false };
      }
    }

    this.inputHabilitado = false;

    const iniciarJuego = () => {
      this.inputHabilitado = true;
      this.configurarInput();
      this.emitir('juego-listo', {});
    };

    if (this.saltarAnimacion || this.animacionesReducidas) {
      this.grupoFichas.setAlpha(0);
      this.grupoFichas.list.forEach((cont, i) => {
        cont.setScale(0.6);
        this.tweens.add({
          targets: cont,
          scale: 1,
          alpha: 1,
          duration: 220,
          delay: Math.min(i * 4, 300),
          ease: 'Back.easeOut'
        });
      });
      this.grupoFichas.setAlpha(1);
      this.time.delayedCall(350, iniciarJuego);
    } else {
      this.grupoFichas.setAlpha(0);
      this.controlAnimacion = window.AnimacionPlato.reproducir(this, {
        celdas: celdasPlano,
        tamanoCelda: this.cellSize,
        anchoEscena: this.ANCHO,
        altoEscena: this.ALTO,
        alCambiarMensaje: (msg) => this.emitir('mensaje-plato', { mensaje: msg }),
        alTerminar: () => {
          this.grupoFichas.setAlpha(1);
          iniciarJuego();
        }
      });
      this.emitir('animacion-plato-iniciada', {});
    }
  }

  omitirAnimacion() {
    if (this.controlAnimacion) this.controlAnimacion.saltar();
  }

  emitir(tipo, detalle) {
    if (window.EventosJuego) window.EventosJuego.dispatchEvent(new CustomEvent(tipo, { detail: detalle }));
  }

  configurarInput() {
    this.input.on('pointerdown', (pointer) => this.alPresionar(pointer));
    this.input.on('pointermove', (pointer) => this.alMover(pointer));
    this.input.on('pointerup', () => this.alSoltar());
    this.input.on('pointerupoutside', () => this.alSoltar());
  }

  celdaDesdePuntero(pointer) {
    const c = Phaser.Math.Clamp(Math.floor((pointer.x - this.offsetX) / this.cellSize), 0, this.tamano - 1);
    const f = Phaser.Math.Clamp(Math.floor((pointer.y - this.offsetY) / this.cellSize), 0, this.tamano - 1);
    return { fila: f, columna: c };
  }

  alPresionar(pointer) {
    if (!this.inputHabilitado) return;
    this.arrastrando = true;
    this.inicioSel = this.celdaDesdePuntero(pointer);
    this.pathActual = [this.inicioSel];
    this.pintarSeleccion();
  }

  alMover(pointer) {
    if (!this.inputHabilitado || !this.arrastrando) return;
    const actual = this.celdaDesdePuntero(pointer);
    const dx = actual.columna - this.inicioSel.columna;
    const dy = actual.fila - this.inicioSel.fila;
    if (dx === 0 && dy === 0) {
      this.pathActual = [this.inicioSel];
    } else {
      const angulo = Math.atan2(dy, dx);
      const anguloSnap = Math.round(angulo / (Math.PI / 4)) * (Math.PI / 4);
      const dirX = Math.round(Math.cos(anguloSnap));
      const dirY = Math.round(Math.sin(anguloSnap));
      const divisor = Math.max(Math.abs(dirX), Math.abs(dirY), 1);
      let longitud = Math.round(Math.max(Math.abs(dx), Math.abs(dy)) / divisor);

      const path = [this.inicioSel];
      for (let i = 1; i <= longitud; i++) {
        const f = this.inicioSel.fila + dirY * i;
        const c = this.inicioSel.columna + dirX * i;
        if (f < 0 || f >= this.tamano || c < 0 || c >= this.tamano) break;
        path.push({ fila: f, columna: c });
      }
      if (path.length !== this.pathActual.length) this.sonido('seleccion');
      this.pathActual = path;
    }
    this.pintarSeleccion();
  }

  sonido(nombre) {
    if (window.Sonido && window.Sonido[nombre]) window.Sonido[nombre]();
  }

  pintarSeleccion() {
    this.grupoSeleccion.clear();
    if (this.pathActual.length === 0) return;

    if (this.pathActual.length > 1) {
      const inicio = this.fichas[this.pathActual[0].fila][this.pathActual[0].columna].cont;
      const fin = this.fichas[this.pathActual[this.pathActual.length - 1].fila][this.pathActual[this.pathActual.length - 1].columna].cont;
      this.grupoSeleccion.lineStyle(this.cellSize * 0.62, this.colorHexANumero(this.colorTema), 0.32);
      this.grupoSeleccion.beginPath();
      this.grupoSeleccion.moveTo(inicio.x, inicio.y);
      this.grupoSeleccion.lineTo(fin.x, fin.y);
      this.grupoSeleccion.strokePath();
    }

    this.pathActual.forEach(({ fila, columna }) => {
      const ficha = this.fichas[fila][columna];
      if (!ficha.encontrada) ficha.fondo.setTint(this.colorHexANumero(this.colorTema));
    });

    this.fichas.forEach((fila) => fila.forEach((ficha) => {
      const enPath = this.pathActual.some((p) => this.fichas[p.fila][p.columna] === ficha);
      if (!enPath && !ficha.encontrada) ficha.fondo.setTint(0x241154);
    }));
  }

  alSoltar() {
    if (!this.inputHabilitado || !this.arrastrando) return;
    this.arrastrando = false;

    if (this.pathActual.length > 1) {
      const colocacion = this.buscarCoincidencia(this.pathActual);
      if (colocacion) {
        this.marcarPalabraEncontrada(colocacion);
      } else {
        this.marcarSeleccionInvalida(this.pathActual);
      }
    }

    this.pathActual = [];
    this.grupoSeleccion.clear();
    this.fichas.forEach((fila) => fila.forEach((ficha) => {
      if (!ficha.encontrada) ficha.fondo.setTint(0x241154);
    }));
  }

  buscarCoincidencia(path) {
    return this.puzzle.colocaciones.find((colocacion) => {
      if (this.encontradas.has(colocacion.palabra)) return false;
      if (colocacion.celdas.length !== path.length) return false;
      const igualAdelante = colocacion.celdas.every((cel, i) => cel.fila === path[i].fila && cel.columna === path[i].columna);
      const igualAtras = colocacion.celdas.every((cel, i) => {
        const p = path[path.length - 1 - i];
        return cel.fila === p.fila && cel.columna === p.columna;
      });
      return igualAdelante || igualAtras;
    });
  }

  marcarPalabraEncontrada(colocacion) {
    this.encontradas.add(colocacion.palabra);
    const contador = this.combo.registrarAcierto();
    const puntos = this.puntuacion.puntosPorPalabra(colocacion.palabra, contador);
    this.puntuacion.sumar(puntos);
    this.sonido('palabraEncontrada');

    const colorEncontrada = this.colorHexANumero(this.colorTema);
    let cxTotal = 0, cyTotal = 0;
    colocacion.celdas.forEach(({ fila, columna }) => {
      const ficha = this.fichas[fila][columna];
      ficha.encontrada = true;
      ficha.fondo.setTint(colorEncontrada);
      cxTotal += ficha.cont.x;
      cyTotal += ficha.cont.y;
      if (!this.animacionesReducidas) {
        this.tweens.add({
          targets: ficha.cont,
          scale: 1.18,
          duration: 160,
          yoyo: true,
          ease: 'Sine.easeOut'
        });
      }
    });

    const cx = cxTotal / colocacion.celdas.length;
    const cy = cyTotal / colocacion.celdas.length;
    this.lanzarParticulas(cx, cy, colorEncontrada);
    this.mostrarPuntosFlotantes(cx, cy, puntos);

    if (contador >= 2) {
      this.sonido('combo');
      const mensaje = this.combo.mensajeParaNivelActual();
      if (mensaje) this.emitir('combo-mensaje', { mensaje });
    }

    this.emitir('palabra-encontrada', {
      palabra: colocacion.palabra,
      encontradas: this.encontradas.size,
      total: this.puzzle.colocaciones.length,
      puntosTotal: this.puntuacion.total,
      puntosSumados: puntos,
      combo: contador
    });

    if (this.encontradas.size === this.puzzle.colocaciones.length) {
      this.time.delayedCall(500, () => {
        this.emitir('nivel-completado', {
          puntos: this.puntuacion.total,
          palabras: this.puzzle.colocaciones.length,
          mejorCombo: this.combo.mejor
        });
      });
    }
  }

  marcarSeleccionInvalida(path) {
    this.sonido('error');
    this.emitir('seleccion-invalida', { largo: path.length });
    path.forEach(({ fila, columna }) => {
      const ficha = this.fichas[fila][columna];
      if (ficha.encontrada) return;
      this.tweens.add({
        targets: ficha.cont,
        x: ficha.cont.x + 4,
        duration: 40,
        yoyo: true,
        repeat: 3,
        ease: 'Sine.easeInOut'
      });
    });
  }

  lanzarParticulas(x, y, color) {
    if (this.animacionesReducidas) return;
    const emisor = this.add.particles(x, y, 'particula', {
      speed: { min: 80, max: 220 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.9, end: 0 },
      lifespan: 500,
      quantity: 14,
      tint: color,
      blendMode: 'ADD'
    });
    this.time.delayedCall(550, () => emisor.destroy());
  }

  mostrarPuntosFlotantes(x, y, puntos) {
    const texto = this.add.text(x, y - 10, `+${puntos}`, {
      fontFamily: 'Baloo 2, sans-serif',
      fontSize: '26px',
      fontStyle: '800',
      color: '#fbbf24'
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: texto,
      y: y - 70,
      alpha: 0,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => texto.destroy()
    });
  }

  // --- Ayudas ---

  palabraNoEncontradaAleatoria() {
    const disponibles = this.puzzle.colocaciones.filter((c) => !this.encontradas.has(c.palabra));
    if (disponibles.length === 0) return null;
    return disponibles[Math.floor(Math.random() * disponibles.length)];
  }

  usarPista() {
    const colocacion = this.palabraNoEncontradaAleatoria();
    if (!colocacion) return false;
    const celda = colocacion.celdas[Math.floor(Math.random() * colocacion.celdas.length)];
    this.destacarCeldaTemporal(celda);
    this.sonido('ayuda');
    return true;
  }

  usarPrimeraLetra() {
    const colocacion = this.palabraNoEncontradaAleatoria();
    if (!colocacion) return false;
    this.destacarCeldaTemporal(colocacion.celdas[0]);
    this.sonido('ayuda');
    return true;
  }

  destacarCeldaTemporal(celda) {
    const ficha = this.fichas[celda.fila][celda.columna];
    const colorDorado = 0xfbbf24;
    const original = 0x241154;
    ficha.fondo.setTint(colorDorado);
    this.tweens.add({
      targets: ficha.cont,
      scale: 1.15,
      duration: 220,
      yoyo: true,
      repeat: 2,
      onComplete: () => { if (!ficha.encontrada) ficha.fondo.setTint(original); }
    });
  }

  usarRevolver() {
    const posicionesLibres = [];
    for (let f = 0; f < this.tamano; f++) {
      for (let c = 0; c < this.tamano; c++) {
        const esParteDePalabra = this.puzzle.colocaciones.some((col) =>
          col.celdas.some((cel) => cel.fila === f && cel.columna === c)
        );
        if (!esParteDePalabra) posicionesLibres.push({ fila: f, columna: c });
      }
    }
    if (posicionesLibres.length < 2) return false;

    const letras = posicionesLibres.map((p) => this.puzzle.grilla[p.fila][p.columna]);
    for (let i = letras.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letras[i], letras[j]] = [letras[j], letras[i]];
    }

    posicionesLibres.forEach((pos, i) => {
      this.puzzle.grilla[pos.fila][pos.columna] = letras[i];
      const ficha = this.fichas[pos.fila][pos.columna];
      ficha.texto.setText(letras[i]);
      this.tweens.add({ targets: ficha.cont, scaleX: 0, duration: 120, yoyo: true, ease: 'Sine.easeIn' });
    });
    this.sonido('ayuda');
    return true;
  }
};
