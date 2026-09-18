// SUPABASECLIENTE.JS — Punto de conexión futuro con Supabase.
// Hoy el juego funciona 100% con localStorage (ver almacenamiento.js).
// Cuando exista un proyecto Supabase para este juego:
//   1) Cargar el SDK de Supabase en index.html.
//   2) Completar SUPABASE_URL y SUPABASE_ANON_KEY abajo.
//   3) Cambiar ACTIVO a true.
// El resto del juego no necesita cambios: Almacenamiento.actualizar() ya
// llama a sincronizar() automáticamente cuando este cliente está activo.
window.SupabaseCliente = (() => {
  const ACTIVO = false;
  const SUPABASE_URL = '';
  const SUPABASE_ANON_KEY = '';

  let cliente = null;
  if (ACTIVO && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return {
    estaActivo() { return !!cliente; },
    async sincronizar(estado) {
      if (!cliente) return;
      // TODO: reemplazar por upsert real, por ejemplo:
      // await cliente.from('sopaletras_estadisticas').upsert({...});
    }
  };
})();
