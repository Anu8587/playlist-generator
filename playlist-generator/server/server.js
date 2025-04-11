require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const HF_TOKEN = process.env.HF_TOKEN;

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received Prompt:", prompt);

  try {
    const hfPrompt = `Generate 5 real and popular song names for a playlist based on this theme: "${prompt}". Return each song name in a new line without extra text.`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        inputs: hfPrompt,
        parameters: {
          temperature: 0.7,
          max_new_tokens: 100,
        },
      },
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from HF:", response.data);
    const generatedText = response.data[0].generated_text;
    res.json({ content: [{ text: generatedText }] });
  } catch (error) {
    console.error("Hugging Face API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate playlist" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
