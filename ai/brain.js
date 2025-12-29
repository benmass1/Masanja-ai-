import hydraulic from "../data/systems/hydraulic.json" assert { type: "json" };

export function getAnswer(text) {
  const message = text.toLowerCase();

  // Angalia hydraulic
  for (const problem of hydraulic.problems) {
    for (const key of problem.keywords) {
      if (message.includes(key)) {
        return problem.answer;
      }
    }
  }

  return "Nimekuelewa, lakini bado sina jibu sahihi. Tafadhali eleza zaidi au taja mfumo (engine, hydraulic, umeme).";
}
