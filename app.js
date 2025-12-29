import { startListening, speak } from "./ai/voice.js";
import { getAnswer } from "./ai/brain.js";

const micBtn = document.getElementById("micBtn");
const responseBox = document.getElementById("response");

micBtn.addEventListener("click", () => {
  responseBox.innerText = "🎧 Masanja AI inasikiliza...";

  startListening(
    async (text) => {
      responseBox.innerText = "⏳ Masanja AI inachakata...";

      const answer = await getAnswer(text);

      responseBox.innerText =
        "🗣️ Umesema:\n" +
        text +
        "\n\n🤖 Masanja AI:\n" +
        answer;

      // 🔊 AI IONGEE
      speak(answer);
    },
    (error) => {
      responseBox.innerText = "❌ Kosa la sauti: " + error;
    }
  );
});
