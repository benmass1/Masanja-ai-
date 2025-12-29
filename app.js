import { startListening } from "./ai/voice.js";

const micBtn = document.getElementById("micBtn");
const responseBox = document.getElementById("response");

micBtn.addEventListener("click", () => {
  responseBox.innerText = "🎧 Masanja AI inasikiliza...";

  startListening(
    (text) => {
      responseBox.innerText =
        "🗣️ Umesema:\n\n" + text + "\n\n🤖 (Majibu ya AI yatafuata)";
    },
    (error) => {
      responseBox.innerText = "❌ Kosa la sauti: " + error;
    }
  );
});