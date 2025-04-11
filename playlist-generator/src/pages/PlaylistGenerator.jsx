import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

const PlaylistGenerator = () => {
  const [situation, setSituation] = useState("");
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("English");
  const [userPrompt, setUserPrompt] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlaylist = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://api.cohere.ai/v1/generate",
        {
          model: "command",
          prompt: `Generate a playlist based on: situation=${situation}, mood=${mood}, language=${language}, user prompt=${userPrompt}. Return a JSON list of objects with {title: string, artist: string}.`,
          max_tokens: 300,
        },
        {
          headers: { Authorization: `Bearer EjMfKCcTDL55sMKwOn6FvjredPSJKubSKJehCv1i` }, // Replace with your Cohere API key
        }
      );
      const text = response.data.generations[0].text;
      const parsedPlaylist = JSON.parse(text.replace(/```json|```/g, ""));
      setPlaylist(parsedPlaylist);
    } catch (err) {
      console.error("Error generating playlist:", err);
      setError("Failed to generate playlist. Please try again.");
      setPlaylist([{ title: "Error", artist: "Try again" }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (situation || mood || userPrompt) generatePlaylist();
  }, [situation, mood, userPrompt, language]);

  return (
    <div className="flex-1 overflow-auto bg-black min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto py-6 px-4 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="glass-card p-6 mb-8">
          <h1 className="text-2xl font-semibold text-white flex items-center">
            <Music className="mr-2" /> Playlist Generator
          </h1>
          <p className="text-gray-300 mt-2">
            Create a custom playlist based on your preferences!
          </p>
        </motion.div>
        <motion.div className="glass-card p-6 space-y-4">
          <input
            className="w-full p-2 bg-gray-800 text-white rounded-md"
            placeholder="Situation (e.g., road trip)"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />
          <input
            className="w-full p-2 bg-gray-800 text-white rounded-md"
            placeholder="Mood (e.g., happy)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <input
            className="w-full p-2 bg-gray-800 text-white rounded-md"
            placeholder="Language (e.g., English)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <textarea
            className="w-full p-2 bg-gray-800 text-white rounded-md h-24"
            placeholder="User Prompt (e.g., rain, I am very happy)"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
          <button
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            onClick={generatePlaylist}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Playlist"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-4">
            <h2 className="text-white text-lg">Suggested Playlist:</h2>
            <ul className="text-gray-300 space-y-2">
              {playlist.map((song, index) => (
                <li key={index}>
                  {song.title} by {song.artist}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlaylistGenerator;