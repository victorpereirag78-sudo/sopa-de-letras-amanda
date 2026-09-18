// ESCENAPLATO.JS — Animación de preparación: un plato lleno de letras que
// rebotan, saltan, se dispersan por la pantalla y finalmente se acomodan
// formando el tablero de la sopa. Es un helper que EscenaTablero invoca
// antes de habilitar el juego; no es una Phaser.Scene independiente para
// evitar una transición de escena visible entre "plato" y "tablero".
window.AnimacionPlato = (() => {
  function dibujarPlato(scene, centroX, y, ancho) {
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(centroX, y + 10, ancho, ancho * 0.34);
    g.fillGradientStyle(0x8b5cf6, 0xec4899, 0x6c3ce9, 0xa78bfa, 1);
    g.fillEllipse(centroX, y, ancho, ancho * 0.4);
    g.lineStyle(4, 0xffffff, 0.35);
    g.strokeEllipse(centroX, y, ancho, ancho * 0.4);
    return g;
  }

  function crearTextura(scene, clave, colorFondo) {
    if (scene.textures.exists(clave)) return;
    const tam = 100;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(colorFondo, 1);
    g.fillRoundedRect(0, 0, tam, tam, 18);
    g.lineStyle(3, 0xffffff, 0.25);
    g.strokeRoundedRect(2, 2, tam - 4, tam - 4, 16);
    g.generateTexture(clave, tam, tam);
    g.destroy();
  }

  function reproducir(scene, { celdas, tamanoCelda, anchoEscena, altoEscena, alCambiarMensaje, alTerminar }) {
    crearTextura(scene, 'ficha-plato', 0x2a1359);

    const centroX = anchoEscena / 2;
    const yPlato = altoEscena * 0.72;
    const plato = dibujarPlato(scene, centroX, yPlato, Math.min(anchoEscena * 0.7, 420));

    const fichas = celdas.map((celda) => {
      const anguloAleatorio = Math.random() * Math.PI * 2;
      const radio = Math.random() * (Math.min(anchoEscena * 0.28, 150));
      const x = centroX + Math.cos(anguloAleatorio) * radio;
      const y = yPlato - 10 + Math.sin(anguloAleatorio) * radio * 0.35;

      const cont = scene.add.container(x, y);
      const fondo = scene.add.image(0, 0, 'ficha-plato').setDisplaySize(tamanoCelda * 0.88, tamanoCelda * 0.88);
      const texto = scene.add.text(0, 0, celda.letra, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${Math.round(tamanoCelda * 0.8)}px`,
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: Math.max(2, Math.round(tamanoCelda * 0.045))
      }).setOrigin(0.5);
      cont.add([fondo, texto]);
      cont.setScale(0.5);
      cont.setAlpha(0);
      cont.setAngle((Math.random() - 0.5) * 60);
      cont.setDepth(10);

      scene.tweens.add({
        targets: cont,
        alpha: 1,
        scale: 0.85,
        duration: 260,
        delay: Math.random() * 300,
        ease: 'Back.easeOut'
      });

      return { cont, destino: celda };
    });

    scene.time.delayedCall(700, () => {
      alCambiarMensaje && alCambiarMensaje('¡Aquí vamos!');
      scene.tweens.add({
        targets: plato,
        x: plato.x + 6,
        duration: 90,
        yoyo: true,
        repeat: 4,
        ease: 'Sine.easeInOut'
      });

      fichas.forEach(({ cont }, i) => {
        const anguloSalida = Math.random() * Math.PI * 2;
        const distancia = 60 + Math.random() * (Math.min(anchoEscena, altoEscena) * 0.42);
        const xSalida = Phaser.Math.Clamp(centroX + Math.cos(anguloSalida) * distancia, tamanoCelda, anchoEscena - tamanoCelda);
        const ySalida = Phaser.Math.Clamp(yPlato - Math.abs(Math.sin(anguloSalida)) * distancia - 40, tamanoCelda, altoEscena - tamanoCelda);

        scene.tweens.add({
          targets: cont,
          x: xSalida,
          y: ySalida,
          angle: (Math.random() - 0.5) * 420,
          scale: 0.95,
          duration: 520 + Math.random() * 220,
          delay: i * 12,
          ease: 'Cubic.easeOut'
        });
      });
    });

    const tiempoDispersión = 700 + 780;
    scene.time.delayedCall(tiempoDispersión, () => {
      alCambiarMensaje && alCambiarMensaje('Acomodando el tablero...');
      let restantes = fichas.length;

      fichas.forEach(({ cont, destino }, i) => {
        scene.tweens.add({
          targets: cont,
          x: destino.x,
          y: destino.y,
          angle: 0,
          scale: 1,
          duration: 480 + Math.random() * 160,
          delay: i * 10,
          ease: 'Cubic.easeInOut',
          onComplete: () => {
            restantes -= 1;
            if (restantes <= 0) {
              scene.tweens.add({
                targets: plato,
                alpha: 0,
                duration: 300,
                onComplete: () => plato.destroy()
              });
              alCambiarMensaje && alCambiarMensaje('¡A jugar!');
              scene.time.delayedCall(260, () => {
                fichas.forEach(({ cont: c }) => c.destroy());
                alTerminar && alTerminar();
              });
            }
          }
        });
      });
    });

    return {
      saltar() {
        scene.tweens.killAll();
        fichas.forEach(({ cont }) => cont.destroy());
        plato.destroy();
        alTerminar && alTerminar();
      }
    };
  }

  return { reproducir };
})();
