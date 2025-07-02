require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve static files (HTML, CSS, JS)

// Load Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is missing. Add it to your .env file.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chatbot API Route
app.post("/chat", async (req, res) => {
  let userMessage = req.body.message;

  try {
    // Generate AI Response from Gemini
    const result = await model.generateContent(userMessage);
    let botReply = result.response.text().trim(); // Trim extra spaces

    // Convert Markdown-like formatting to HTML
    botReply = botReply
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Bold: **text** → <b>text</b>
      .replace(/\*(.*?)\*/g, "<i>$1</i>");    // Italic: *text* → <i>text</i>

    // If response is long (more than 150 characters), format it in pointwise manner
    if (botReply.length > 150) {
      let sentences = botReply.split(".").map(sentence => sentence.trim()).filter(sentence => sentence !== "");
      
      // Ensure no empty bullet points are added
      botReply = sentences
          .filter(sentence => sentence.length > 0) // Remove empty sentences
          .map(sentence => `• ${sentence}`) // Add bullet only for valid sentences
          .join("<br>")
          .trim(); // Remove trailing spaces or breaks
  }
  
  // Ensure no trailing dot or extra line break
  botReply = botReply.replace(/(\.•\s*<br>)+$/, "").replace(/\.$/, "");
  

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Error generating response:", error);
    res.json({ reply: "Sorry, I encountered an error. Please try again!" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
