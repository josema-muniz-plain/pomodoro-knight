import './style.css';

// Sprite de muestra (nivel 1). El sistema de sprites real llega en la Fase 1.
const KNIGHT = `
       \\|/
     .-'''-.
    /  o o  \\
   |    ^    |
    \\  '-'  /
     '-----'
`;

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <main class="terminal">
      <header>
        <h1>🍅⚔️ PomodoroKnight</h1>
        <p class="muted">Concéntrate. Completa pomodoros. Forja a tu caballero tomate.</p>
      </header>
      <pre class="sprite" aria-label="Tomate caballero nivel 1">${KNIGHT}</pre>
      <p class="muted">El timer Pomodoro y el sistema de niveles llegan en la Fase 1.</p>
    </main>
  `;
}

render();
