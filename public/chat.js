// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  // Mensaje de bienvenida
  addMsg('Gemini', '¡Bienvenido, coder! 👋');

  // Función para agregar mensajes al chat con burbujas
  function addMsg(who, text) {
    const div = document.createElement('div');
    div.textContent = text;

    if (who.toLowerCase() === 'vos') {
      div.className = 'user-msg';
    } else if (who.toLowerCase() === 'gemini') {
      div.className = 'bot-msg';
    } else {
      div.className = 'bot-msg'; // fallback
    }

    messages.appendChild(div);
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
      addMsg('Sistema', '⚠️ Hubo un error. Revisá la consola.');
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
