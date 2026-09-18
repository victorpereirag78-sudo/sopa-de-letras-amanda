// GENERADORSOPA.JS — Generador procedural de sopas de letras.
// Recibe tamaño, lista de palabras, ejes permitidos y si acepta palabras
// invertidas; devuelve una grilla válida con todas las palabras colocadas
// (sin colocaciones imposibles ni palabras cortadas) y el resto de casillas
// rellenas con letras aleatorias. Prioriza cruzar palabras entre sí (compartir
// letras) cuando es posible, como en una sopa de letras clásica.
window.GeneradorSopa = (() => {
  const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function letraAleatoria() {
    return ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }

  function barajar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
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
    if (fila < 0 || fila >= tamano || columna < 0 || columna >= tamano) return false;
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

  // Busca todas las formas de colocar la palabra de modo que comparta al
  // menos una letra con lo ya colocado (un "cruce"), y elige una al azar.
  function buscarCruce(grilla, tamano, palabra, direcciones) {
    const opciones = [];
    for (let f = 0; f < tamano; f++) {
      for (let c = 0; c < tamano; c++) {
        const letra = grilla[f][c];
        if (letra === null) continue;
        for (let i = 0; i < palabra.length; i++) {
          if (palabra[i] !== letra) continue;
          for (const dir of direcciones) {
            const filaInicio = f - dir.dy * i;
            const colInicio = c - dir.dx * i;
            if (cabePalabra(grilla, tamano, palabra, filaInicio, colInicio, dir)) {
              opciones.push({ fila: filaInicio, columna: colInicio, dir });
            }
          }
        }
      }
    }
    if (opciones.length === 0) return null;
    const elegida = opciones[Math.floor(Math.random() * opciones.length)];
    return colocarPalabra(grilla, tamano, palabra, elegida.fila, elegida.columna, elegida.dir);
  }

  function colocarAlAzar(grilla, tamano, palabra, direcciones, intentosMax = 200) {
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

  function intentarColocar(grilla, tamano, palabra, direcciones) {
    return buscarCruce(grilla, tamano, palabra, direcciones) || colocarAlAzar(grilla, tamano, palabra, direcciones);
  }

  function normalizar(palabra) {
    return palabra
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-ZÑ]/g, '');
  }

  function generar({ tamano, bancoPalabras, cantidadPalabras, largoMin, largoMax, ejes, invertidas }) {
    const direcciones = construirListaDirecciones(ejes, invertidas);
    const elegibles = barajar(
      bancoPalabras
        .map(normalizar)
        .filter((p) => p.length >= largoMin && p.length <= Math.min(largoMax, tamano))
    );

    for (let intentoGeneral = 0; intentoGeneral < 40; intentoGeneral++) {
      const grilla = Array.from({ length: tamano }, () => Array(tamano).fill(null));
      const pool = intentoGeneral === 0 ? elegibles : barajar([...elegibles]);
      // Se elige el subconjunto de palabras al azar primero (para que cada
      // partida sea distinta) y recién ese subconjunto se ordena por largo
      // (para que al colocarlas, las más difíciles de encajar vayan primero).
      const seleccionadas = pool
        .slice(0, Math.min(cantidadPalabras + 6, pool.length))
        .sort((a, b) => b.length - a.length);
      const colocaciones = [];

      for (const palabra of seleccionadas) {
        if (colocaciones.length >= cantidadPalabras) break;
        const celdas = intentarColocar(grilla, tamano, palabra, direcciones);
        if (celdas) colocaciones.push({ palabra, celdas });
      }

      if (colocaciones.length >= Math.min(cantidadPalabras, elegibles.length)) {
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
