hereconst output = document.getElementById("output");
const micBtn = document.getElementById("micBtn");

// Speech Recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  output.innerText = "Browser yako haiungi mkono sauti.";
}

const recognition = new SpeechRecognition();
recognition.lang = "sw-TZ";
recognition.interimResults = false;
recognition.continuous = false;

// Text to Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "sw-TZ";
  utterance.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

// Pata jibu sahihi
function getAnswer(text) {
  text = text.toLowerCase();

  let bestScore = 0;
  let bestAnswer = null;

  for (const item of window.MASANJA_KNOWLEDGE) {
    let score = 0;
    for (const key of item.keywords) {
      if (text.includes(key)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  return bestAnswer || "Samahani, bado sijapata jibu sahihi. Tafadhali eleza zaidi.";
}

// Button click
micBtn.onclick = () => {
  output.innerText = "🎧 Ninasikiliza...";
  recognition.start();
};

// Matokeo ya sauti
recognition.onresult = (event) => {
  const text = event.results[0][0].transcript;
  const answer = getAnswer(text);

  output.innerText =
    "🗣️ Umesema:\n" +
    text +
    "\n\n🤖 Masanja AI:\n" +
    answer;

  speak(answer);
};

recognition.onerror = () => {
  output.innerText = "Kuna tatizo la sauti. Jaribu tena.";
};
