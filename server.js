require('dotenv').config();
const pool = require('./db');

console.log('📦 Iniciando server.js'); // <- Este log es clave


async function obtenerFecha() {
  console.log('🔄 Ejecutando función obtenerFecha()');

  try {
    const [rows] = await pool.query('SELECT NOW() AS fecha');
    console.log('🕒 Fecha actual desde MySQL:', rows[0].fecha);
  } catch (error) {
    console.error('❌ Error en la consulta:', error.message);
  }
}

obtenerFecha();
