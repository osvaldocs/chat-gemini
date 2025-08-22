// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  // Mensaje de bienvenida
  const welcome = document.createElement('p');
  welcome.innerHTML = '<strong>Gemini:</strong> ¡Bienvenido, coder! 👋';
  messages.appendChild(welcome);

  // Función para agregar mensajes al chat
  function addMsg(who, text) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${who}:</strong> ${text}`;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }

  // Función para enviar mensaje al servidor
  async function sendMessage(text) {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) {
      throw new Error('Error en la solicitud: ' + res.status);
    }

    const data = await res.json();
    return data.reply;
  }

  // Evento submit del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMsg('Vos', text);
    input.value = '';
    input.focus();

    try {
      const reply = await sendMessage(text);
      addMsg('Gemini', reply);
    } catch (err) {
      addMsg('Sistema', 'Hubo un error. Revisá la consola.');
      console.error(err);
    }
  });

  // Permitir enviar con Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });
});
