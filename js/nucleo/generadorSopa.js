// GENERADORSOPA.JS — Generador procedural de sopas de letras.
// Recibe tamaño, lista de palabras, ejes permitidos y si acepta palabras
// invertidas; devuelve una grilla válida con todas las palabras colocadas
// (sin colocaciones imposibles ni palabras cortadas) y el resto de casillas
// rellenas con letras aleatorias.
window.GeneradorSopa = (() => {
  const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function letraAleatoria() {
    return ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }

  function construirListaDirecciones(ejes, invertidas) {
    const D = window.Constantes.DIRECCIONES;
    const direcciones = [];
    if (ejes.includes('horizontal')) {
      direcciones.push(D.E);
      if (invertidas) direcciones.push(D.O);
    }
    if (ejes.includes('vertical')) {
      direcciones.push(D.S);
      if (invertidas) direcciones.push(D.N);
    }
    if (ejes.includes('diagonal')) {
      direcciones.push(D.SE);
      if (invertidas) direcciones.push(D.NO);
      direcciones.push(D.SO);
      if (invertidas) direcciones.push(D.NE);
    }
    return direcciones;
  }

  function cabePalabra(grilla, tamano, palabra, fila, columna, dir) {
    const filaFinal = fila + dir.dy * (palabra.length - 1);
    const colFinal = columna + dir.dx * (palabra.length - 1);
    if (filaFinal < 0 || filaFinal >= tamano || colFinal < 0 || colFinal >= tamano) return false;

    for (let i = 0; i < palabra.length; i++) {
      const f = fila + dir.dy * i;
      const c = columna + dir.dx * i;
      const actual = grilla[f][c];
      if (actual !== null && actual !== palabra[i]) return false;
    }
    return true;
  }

  function colocarPalabra(grilla, tamano, palabra, fila, columna, dir) {
    const celdas = [];
    for (let i = 0; i < palabra.length; i++) {
      const f = fila + dir.dy * i;
      const c = columna + dir.dx * i;
      grilla[f][c] = palabra[i];
      celdas.push({ fila: f, columna: c });
    }
    return celdas;
  }

  function intentarColocar(grilla, tamano, palabra, direcciones, intentosMax = 200) {
    for (let intento = 0; intento < intentosMax; intento++) {
      const dir = direcciones[Math.floor(Math.random() * direcciones.length)];
      const fila = Math.floor(Math.random() * tamano);
      const columna = Math.floor(Math.random() * tamano);
      if (cabePalabra(grilla, tamano, palabra, fila, columna, dir)) {
        return colocarPalabra(grilla, tamano, palabra, fila, columna, dir);
      }
    }
    return null;
  }

  function normalizar(palabra) {
    return palabra
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-ZÑ]/g, '');
  }

  function generar({ tamano, bancoPalabras, cantidadPalabras, largoMin, largoMax, ejes, invertidas }) {
    const direcciones = construirListaDirecciones(ejes, invertidas);
    const candidatas = bancoPalabras
      .map(normalizar)
      .filter((p) => p.length >= largoMin && p.length <= Math.min(largoMax, tamano))
      .sort(() => Math.random() - 0.5);

    for (let intentoGeneral = 0; intentoGeneral < 30; intentoGeneral++) {
      const grilla = Array.from({ length: tamano }, () => Array(tamano).fill(null));
      const seleccionadas = [...candidatas].sort((a, b) => b.length - a.length).slice(0, cantidadPalabras + 4);
      const colocaciones = [];

      for (const palabra of seleccionadas) {
        if (colocaciones.length >= cantidadPalabras) break;
        const celdas = intentarColocar(grilla, tamano, palabra, direcciones);
        if (celdas) colocaciones.push({ palabra, celdas });
      }

      if (colocaciones.length >= Math.min(cantidadPalabras, candidatas.length)) {
        for (let f = 0; f < tamano; f++) {
          for (let c = 0; c < tamano; c++) {
            if (grilla[f][c] === null) grilla[f][c] = letraAleatoria();
          }
        }
        return { grilla, colocaciones, tamano };
      }
    }

    throw new Error('No se pudo generar una sopa de letras válida con estos parámetros.');
  }

  return { generar };
})();
