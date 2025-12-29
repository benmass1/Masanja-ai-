// ai/voice.js
export function startListening(onResult, onError) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Browser yako haiungi mkono sauti.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "sw-TZ"; // Kiswahili
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onerror = (event) => {
    onError(event.error);
  };

  recognition.start();
}
// Fanya AI izungumze (Text → Speech)
export function speak(text) {
  if (!window.speechSynthesis) {
    console.log("Speech synthesis haipatikani");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "sw-TZ";
  utterance.rate = 0.95;
  utterance.pitch = 1;

  window.speechSynthesis.cancel(); // simamisha sauti nyingine
  window.speechSynthesis.speak(utterance);
}
