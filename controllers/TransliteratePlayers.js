const axios = require("axios");
async function transliteratePlayers(playerName) {
  const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
  const OPENAI_API_KEY = "";
  // const OPENAI_API_KEY = "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";
  try {
    const response = await axios.post(
      OPENAI_API_ENDPOINT,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `for the name given , return the transliteration
of the english name for amharic , somali and afan oromo, example :
for "Alex John" , return {
"EnglishName": "Alex John",
"AmharicName": "አሌክስ ጆን",
"OromoName": "Aleks Jon",
"SomaliName" : "Alex Jon" }
don't add any explanations! don't say player.EnglishName! just return the object!
don't add \ n too!!!
player : ${playerName}
`,
          },
        ],
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status == 200) {
      let jsonObject = eval(
        "(" + response.data.choices[0].message.content + ")"
      );
      return jsonObject;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error transliterating text: " + error);
    return false;
  }
}
module.exports = transliteratePlayers;
