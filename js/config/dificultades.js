// DIFICULTADES.JS — Perfiles de dificultad. Cada uno ajusta tamaño de
// tablero, cantidad/longitud de palabras, direcciones permitidas, tiempo y ayudas.
window.Dificultades = [
  {
    id: 'facil',
    nombre: 'Fácil',
    emoji: '🟢',
    tamano: 8,
    cantidadPalabras: 6,
    largoMin: 3,
    largoMax: 6,
    ejes: ['horizontal', 'vertical', 'diagonal'],
    invertidas: true,
    segundos: 180,
    ayudas: { pista: 3, primeraLetra: 3, revolver: 2, congelar: 2 },
    multiplicador: 1
  },
  {
    id: 'normal',
    nombre: 'Normal',
    emoji: '🟡',
    tamano: 10,
    cantidadPalabras: 8,
    largoMin: 4,
    largoMax: 8,
    ejes: ['horizontal', 'vertical', 'diagonal'],
    invertidas: true,
    segundos: 150,
    ayudas: { pista: 2, primeraLetra: 2, revolver: 2, congelar: 1 },
    multiplicador: 1.3
  },
  {
    id: 'dificil',
    nombre: 'Difícil',
    emoji: '🔴',
    tamano: 12,
    cantidadPalabras: 10,
    largoMin: 4,
    largoMax: 9,
    ejes: ['horizontal', 'vertical', 'diagonal'],
    invertidas: true,
    segundos: 120,
    ayudas: { pista: 1, primeraLetra: 1, revolver: 1, congelar: 1 },
    multiplicador: 1.6
  },
  {
    id: 'experto',
    nombre: 'Experto',
    emoji: '🔥',
    tamano: 14,
    cantidadPalabras: 12,
    largoMin: 5,
    largoMax: 10,
    ejes: ['horizontal', 'vertical', 'diagonal'],
    invertidas: true,
    segundos: 100,
    ayudas: { pista: 1, primeraLetra: 0, revolver: 1, congelar: 0 },
    multiplicador: 2
  }
];
