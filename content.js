addEventListener("DOMContentLoaded", (event) => {
  document.body.innerHTML = document.body.innerHTML.replace(
    /(\b(ai|gpt)\b|a\.i\.|artificial inteligence chatbot|artificial inteligence|chatgpt|GPT-3.5|GPT-4|GPT-4|GPT-2.5|GPT-2)/gmi,
    'Clippy');
  document.body.innerHTML = document.body.innerHTML.replace(
    /(\b(nn|llm)\b|neural networks?|large language models?)/gmi,
    'bunch of paper clips');
  document.body.innerHTML = document.body.innerHTML.replace('OpenAI', 'Closed Source so-called-"Open"AI');
  // maybe AI -> 📎, NeuralNetwork -> 🖇️
  // TODO: i18n
});

