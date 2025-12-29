herelet hydraulicData = null;

// pakua data ya hydraulic
async function loadHydraulic() {
  if (!hydraulicData) {
    const res = await fetch("./data/systems/hydraulic.json");
    hydraulicData = await res.json();
  }
}

export async function getAnswer(text) {
  await loadHydraulic();

  const message = text.toLowerCase();

  for (const problem of hydraulicData.problems) {
    for (const key of problem.keywords) {
      if (message.includes(key)) {
        return problem.answer;
      }
    }
  }

  return "Nimekuelewa, lakini bado sina jibu sahihi. Tafadhali eleza zaidi au taja mfumo kama hydraulic, engine au umeme.";
}
