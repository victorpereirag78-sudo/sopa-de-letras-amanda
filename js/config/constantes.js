// CONSTANTES.JS — Valores compartidos por todo el juego
window.Constantes = {
  CLAVE_ALMACENAMIENTO: 'sopaLetras_v1',
  VENTANA_COMBO_MS: 8000,
  DURACION_CONGELAR_MS: 10000,
  DIRECCIONES: {
    E:  { dx: 1,  dy: 0 },
    O:  { dx: -1, dy: 0 },
    S:  { dx: 0,  dy: 1 },
    N:  { dx: 0,  dy: -1 },
    SE: { dx: 1,  dy: 1 },
    SO: { dx: -1, dy: 1 },
    NE: { dx: 1,  dy: -1 },
    NO: { dx: -1, dy: -1 }
  },
  MENSAJES_COMBO: {
    3: ['¡Buen ritmo!', '¡Vas tomando vuelo!'],
    5: ['¡Vas volando!', '¡Racha encendida!'],
    8: ['¡INCREÍBLE!', '¡Imparable!'],
    12: ['¡COMBO IMPARABLE!', '¡Estás en llamas! 🔥']
  },
  MENSAJES_ANIMO: [
    '¡Vamos, {nombre}!',
    '¡Muy bien, {nombre}!',
    '¡Casi lo tienes, {nombre}!',
    '¡Excelente trabajo, {nombre}!',
    '¡Sigue así, {nombre}!'
  ]
};
