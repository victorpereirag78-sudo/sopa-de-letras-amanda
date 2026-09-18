// TEMATICAS.JS — Catálogo de temáticas y sus bancos de palabras.
// Para agregar una temática nueva basta con sumar un objeto a esta lista;
// el motor del juego no necesita cambios. Cada banco tiene bastantes más
// palabras de las que se usan por partida, para que el generador pueda
// elegir un subconjunto distinto cada vez (ver nucleo/generadorSopa.js).
window.Tematicas = [
  {
    id: 'naturaleza',
    nombre: 'Naturaleza',
    emoji: '🌳',
    color: '#22c55e',
    palabras: ['ARBOL', 'MONTANA', 'RIO', 'BOSQUE', 'FLOR', 'HOJA', 'VOLCAN', 'CASCADA', 'SELVA', 'DESIERTO', 'LAGO', 'VALLE', 'SEMILLA', 'RAIZ', 'NUBE', 'ROCIO', 'JARDIN', 'PANTANO', 'GLACIAR', 'CORAL', 'TRONCO', 'RAMA', 'PIEDRA', 'ARENA', 'VIENTO', 'LLUVIA', 'TIERRA', 'PLANTA', 'FRUTO', 'ISLA', 'PLAYA', 'PRADERA', 'MANANTIAL', 'COLINA', 'ESTANQUE']
  },
  {
    id: 'futbol',
    nombre: 'Fútbol',
    emoji: '⚽',
    color: '#3b82f6',
    palabras: ['BALON', 'GOL', 'ARCO', 'CANCHA', 'EQUIPO', 'ARBITRO', 'PENAL', 'CORNER', 'DEFENSA', 'DELANTERO', 'PORTERO', 'TARJETA', 'CAMPEON', 'TIEMPO', 'FALTA', 'ESTADIO', 'LATERAL', 'SAQUE', 'REMATE', 'PASE', 'CENTRO', 'TACOS', 'SILBATO', 'BANCA', 'TECNICO', 'LIGA', 'TORNEO', 'CAPITAN', 'MUNDIAL', 'FANATICO', 'CAMISETA']
  },
  {
    id: 'musica',
    nombre: 'Música',
    emoji: '🎵',
    color: '#a78bfa',
    palabras: ['GUITARRA', 'PIANO', 'TAMBOR', 'CANCION', 'RITMO', 'MELODIA', 'CANTANTE', 'BANDA', 'VIOLIN', 'CONCIERTO', 'NOTA', 'COMPAS', 'ALBUM', 'ORQUESTA', 'FLAUTA', 'TROMPETA', 'BAJO', 'BATERIA', 'MICROFONO', 'ESCENARIO', 'LETRA', 'CORO', 'ARMONIA', 'SAXOFON', 'ACORDE', 'DUETO', 'GENERO', 'SINFONIA', 'DISCO', 'ARPA', 'CLARINETE', 'SOLISTA']
  },
  {
    id: 'animales',
    nombre: 'Animales',
    emoji: '🐶',
    color: '#fb923c',
    palabras: ['PERRO', 'GATO', 'LEON', 'TIGRE', 'ELEFANTE', 'JIRAFA', 'DELFIN', 'AGUILA', 'CONEJO', 'TORTUGA', 'CABALLO', 'MONO', 'OSO', 'LOBO', 'BALLENA', 'CEBRA', 'PANTERA', 'CANGURO', 'HIPOPOTAMO', 'MURCIELAGO', 'ZORRO', 'RATON', 'VACA', 'OVEJA', 'CERDO', 'PATO', 'GALLINA', 'LORO', 'SERPIENTE', 'RANA', 'PEZ', 'PULPO', 'ARDILLA', 'PINGUINO', 'KOALA', 'RINOCERONTE']
  },
  {
    id: 'paises',
    nombre: 'Países',
    emoji: '🌎',
    color: '#22d3ee',
    palabras: ['CHILE', 'PERU', 'BRASIL', 'MEXICO', 'ESPANA', 'FRANCIA', 'ITALIA', 'JAPON', 'CANADA', 'EGIPTO', 'GRECIA', 'CUBA', 'CHINA', 'INDIA', 'SUECIA', 'MARRUECOS', 'ARGENTINA', 'COLOMBIA', 'ALEMANIA', 'PORTUGAL', 'RUSIA', 'TURQUIA', 'NORUEGA', 'HOLANDA', 'BOLIVIA', 'ECUADOR', 'PANAMA', 'URUGUAY', 'VENEZUELA', 'IRLANDA', 'POLONIA', 'AUSTRALIA']
  },
  {
    id: 'comida',
    nombre: 'Comida',
    emoji: '🍕',
    color: '#ef4444',
    palabras: ['PIZZA', 'PASTA', 'HELADO', 'MANZANA', 'QUESO', 'PAN', 'ENSALADA', 'CHOCOLATE', 'SANDIA', 'TACO', 'AREPA', 'SOPA', 'GALLETA', 'NARANJA', 'HAMBURGUESA', 'FLAN', 'EMPANADA', 'LASAGNA', 'BURRITO', 'YOGUR', 'ARROZ', 'POLLO', 'PESCADO', 'HUEVO', 'LECHE', 'MIEL', 'LIMON', 'PLATANO', 'UVA', 'FRESA', 'PAPA', 'TOMATE', 'CEBOLLA', 'AJO', 'AVENA']
  },
  {
    id: 'autos',
    nombre: 'Autos',
    emoji: '🚗',
    color: '#fbbf24',
    palabras: ['MOTOR', 'RUEDA', 'VOLANTE', 'FRENO', 'CAMION', 'GARAJE', 'CARRETERA', 'BOCINA', 'ASIENTO', 'TANQUE', 'ESPEJO', 'PARABRISAS', 'MOTOCICLETA', 'CARRERA', 'PISTA', 'LLANTA', 'CHOFER', 'PUERTA', 'MALETERO', 'BATERIA', 'GASOLINA', 'SEMAFORO', 'AUTOPISTA', 'PEAJE', 'TALLER', 'MECANICO', 'BUJIA', 'EMBRAGUE', 'ACELERADOR', 'CAPOT', 'CINTURON', 'LICENCIA']
  },
  {
    id: 'peliculas',
    nombre: 'Películas',
    emoji: '🎬',
    color: '#ec4899',
    palabras: ['PANTALLA', 'ACTOR', 'ACTRIZ', 'GUION', 'DIRECTOR', 'ESTRENO', 'PALOMITAS', 'CAMARA', 'ESCENA', 'TRAILER', 'CINE', 'PREMIO', 'DRAMA', 'COMEDIA', 'AVENTURA', 'FANTASIA', 'TERROR', 'MUSICAL', 'ANIMACION', 'SUBTITULO', 'BOLETO', 'BUTACA', 'PRODUCTOR', 'VILLANO', 'HEROE', 'SECUELA', 'SAGA', 'ESTUDIO', 'ELENCO', 'DOBLAJE', 'TAQUILLA']
  },
  {
    id: 'espacio',
    nombre: 'Espacio',
    emoji: '🚀',
    color: '#6c3ce9',
    palabras: ['COHETE', 'PLANETA', 'ESTRELLA', 'LUNA', 'GALAXIA', 'ASTRONAUTA', 'COMETA', 'MARTE', 'SATURNO', 'ORBITA', 'TELESCOPIO', 'METEORO', 'UNIVERSO', 'NEBULOSA', 'ECLIPSE', 'GRAVEDAD', 'SOL', 'ASTRO', 'JUPITER', 'VENUS', 'MERCURIO', 'NEPTUNO', 'URANO', 'PLUTON', 'CRATER', 'SATELITE', 'ASTEROIDE', 'NAVE', 'CAPSULA', 'CONSTELACION', 'SUPERNOVA', 'ATMOSFERA']
  },
  {
    id: 'ciencia',
    nombre: 'Ciencia',
    emoji: '🧠',
    color: '#14b8a6',
    palabras: ['ATOMO', 'CELULA', 'ENERGIA', 'MOLECULA', 'GRAVEDAD', 'EXPERIMENTO', 'MICROSCOPIO', 'FORMULA', 'ELEMENTO', 'REACCION', 'LABORATORIO', 'GENETICA', 'CEREBRO', 'OXIGENO', 'VACUNA', 'TEORIA', 'ADN', 'GEN', 'FISICA', 'QUIMICA', 'BIOLOGIA', 'HIPOTESIS', 'BACTERIA', 'VIRUS', 'NEURONA', 'MAGNETISMO', 'HIDROGENO', 'CARBONO', 'NITROGENO', 'ECOSISTEMA', 'EVOLUCION', 'INVENTO', 'CIENTIFICO']
  },
  {
    id: 'colegio',
    nombre: 'Colegio',
    emoji: '📚',
    color: '#8b5cf6',
    palabras: ['CUADERNO', 'LAPIZ', 'MOCHILA', 'PIZARRA', 'PROFESOR', 'RECREO', 'EXAMEN', 'BIBLIOTECA', 'GOMA', 'REGLA', 'TAREA', 'PUPITRE', 'CALENDARIO', 'CIENCIA', 'HISTORIA', 'MATEMATICA', 'BORRADOR', 'TIJERA', 'COLA', 'MARCADOR', 'CARPETA', 'UNIFORME', 'DIRECTOR', 'COMPANERO', 'NOTA', 'CURSO', 'RECESO', 'LECTURA', 'ESCRITURA', 'GEOGRAFIA', 'ARTE', 'DEPORTE']
  },
  {
    id: 'videojuegos',
    nombre: 'Videojuegos',
    emoji: '🎮',
    color: '#f472b6',
    palabras: ['CONSOLA', 'MANDO', 'PANTALLA', 'NIVEL', 'PERSONAJE', 'PUNTAJE', 'MISION', 'VIDA', 'PIXEL', 'JUGADOR', 'ESTRATEGIA', 'AVENTURA', 'MUNDO', 'ENEMIGO', 'PODER', 'VICTORIA', 'BOTON', 'COMBO', 'DERROTA', 'GUARDAR', 'CARGAR', 'MAPA', 'ARMA', 'ESCUDO', 'MONEDA', 'LLAVE', 'PUZZLE', 'RANKING', 'TORNEO', 'MULTIJUGADOR', 'LOGRO', 'DESAFIO']
  }
];
