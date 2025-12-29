herefunction getAnswer(text) {
  text = text.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const item of window.MASANJA_KNOWLEDGE) {
    let score = 0;

    for (const key of item.keywords) {
      if (text.includes(key)) {
        score++;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.answer;
  }

  return "Sijapata jibu sahihi bado. Tafadhali eleza zaidi au taja mfumo unaozungumzia.";
}
