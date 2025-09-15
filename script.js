const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeInput = document.getElementById("volume");
const errorMsg = document.getElementById("errorMsg");
const visualizer = document.getElementById("visualizer");

let isPlaying = true;
let visualInterval;

// Init visual bars
for (let i = 0; i < 8; i++) {
  const bar = document.createElement("div");
  bar.style.height = "10px";
  visualizer.appendChild(bar);
}

// Default autoplay state
playBtn.textContent = "Pause";
startVisualizer();

playBtn.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      await audio.play();
      isPlaying = true;
      playBtn.textContent = "Pause";
      startVisualizer();
    } else {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = "Play";
      stopVisualizer();
    }
  } catch (err) {
    errorMsg.textContent = "Gagal memutar audio.";
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
});

audio.addEventListener("ended", () => {
  isPlaying = false;
  playBtn.textContent = "Play";
  stopVisualizer();
});

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

volumeInput.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function startVisualizer() {
  stopVisualizer();
  visualInterval = setInterval(() => {
    const bars = visualizer.children;
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.height = 10 + Math.random() * 50 + "px";
    }
  }, 120);
}

function stopVisualizer() {
  clearInterval(visualInterval);
  const bars = visualizer.children;
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.height = "10px";
  }
}

// Chat
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, role) {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  chatInput.value = "";
  setTimeout(() => {
    addMessage("Bot: aku terima \"" + text + "\"", "bot");
  }, 600);
}

// Init welcome message
addMessage("Halo! Ini chat v3.", "bot");
