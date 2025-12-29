hereimport { startListening } from "./ai/voice.js";
import { getAnswer } from "./ai/brain.js";

const micBtn = document.getElementById("micBtn");
const responseBox = document.getElementById("response");

micBtn.addEventListener("click", () => {
  responseBox.innerText = "🎧 Masanja AI inasikiliza...";

  startListening(
    (text) => {
      const answer = getAnswer(text);

      responseBox.innerText =
        "🗣️ Umesema:\n" +
        text +
        "\n\n🤖 Masanja AI:\n" +
        answer;
    },
    (error) => {
      responseBox.innerText = "❌ Kosa la sauti: " + error;
    }
  );
});
