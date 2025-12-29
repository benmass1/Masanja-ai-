const output = document.getElementById("output");
const micBtn = document.getElementById("micBtn");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.lang = "sw-TZ";
  recognition.interimResults = false;
  recognition.continuous = false;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "sw-TZ";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function getAnswer(text) {
  text = text.toLowerCase();

  for (const item of window.MASANJA_KNOWLEDGE) {
    for (const key of item.keywords) {
      if (text.includes(key)) {
        return item.answer;
      }
    }
  }
  return "Samahani, bado sijapata jibu sahihi. Tafadhali eleza zaidi.";
}

micBtn.onclick = () => {
  if (!recognition) {
    output.innerText = "Browser yako haiungi mkono sauti.";
    return;
  }

  output.innerText = "🎧 Ninasikiliza...";
  recognition.start();
};

if (recognition) {
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
}
