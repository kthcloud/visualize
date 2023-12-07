export const getNextCallToAction = async () => {
  try {
    const prompt =
      'This is a conversation between user and llama, a friendly chatbot. respond in simple markdown.\n\nUser: Write a new call to action for our website, kthcloud. It is a cloud computing service for students and researchers at KTH, the royal institute of technology in stockholm, sweden. Keep it short - a couple words. Return as a JSON with the call to action as the "call" object. \n\n\nllama: {"call": "Deploy now!"}\n\nUser: Another one? Make it fun, use emojis!\n\n\nllama:';

    const url = "https://llama.app.cloud.cbh.kth.se/completion";

    const body = JSON.stringify({
      prompt: prompt,
      temperature: 10 + Math.random(),
    });

    const response = await fetch(url, { method: "POST", body: body });
    const data = await response.json();
    const completion = JSON.parse(data.content);

    if (Object.hasOwn(completion, "call")) {
      if (completion.call.length < 50) return completion.call;
    }
  } catch (error) {
    console.log(error);
  }
};
