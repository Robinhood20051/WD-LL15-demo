// Make sure you have your OpenAI API key in secrets.js as: export const apiKey = "sk-...";
// Get references to the buttons and response area
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const responseDiv = document.getElementById('response');

// Get reference to the persona dropdown
const personaSelect = document.getElementById('personaSelect');

// Array of fun loading messages and emojis
const loadingMessages = [
  "Mixing up some magic... ✨",
  "Thinking of something cool... 🧊",
  "Cracking a joke... 😂",
  "Searching for fun facts... 🔍",
  "Looking out the window... 🌦️",
  "Warming up my brain... 🧠",
  "Getting creative... 🎨",
  "Finding the perfect words... 💬"
];

// Function to get the system prompt based on selected persona
function getSystemPrompt() {
  // Get the selected value from the dropdown
  const persona = personaSelect.value;
  // Return a different system prompt for each persona
  if (persona === "friendly") {
    return "You are a friendly coworker who helps people start conversations in a warm, approachable way.";
  } else if (persona === "sassy") {
    return "You are a sassy intern who gives playful, cheeky, and fun conversation starters.";
  } else if (persona === "professor") {
    return "You are Professor Bot, a wise and knowledgeable assistant who shares interesting and educational conversation starters.";
  } else {
    // Default: friendly, casual intern with emojis
    return "You are a friendly, casual intern who uses emojis and responds in a fun, approachable way.";
  }
}

// This function sends a prompt to OpenAI and returns the response text
async function getOpenAIResponse(prompt) {
  // Pick a random loading message
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  responseDiv.textContent = loadingMessages[randomIndex];

  // Get the system prompt based on persona
  const systemPrompt = getSystemPrompt();

  // If no persona is selected, use the friendly, casual intern with emojis
  const finalSystemPrompt = systemPrompt || "You are a friendly, casual intern who uses emojis and responds in a fun, approachable way.";

  // Set up the API endpoint and request data
  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: "gpt-4.1", // Use the gpt-4.1 model
    messages: [
      { role: "system", content: finalSystemPrompt },
      { role: "user", content: prompt }
    ],
    max_tokens: 80,
    temperature: 0.8
  };

  try {
    // Send the request to OpenAI
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });

    // Parse the response as JSON
    const json = await res.json();

    // Get the assistant's reply
    const reply = json.choices && json.choices[0].message.content;

    // Show the reply or an error message
    responseDiv.textContent = reply || "Sorry, I couldn't think of anything!";
  } catch (error) {
    // Show an error message if something goes wrong
    responseDiv.textContent = "Oops! Something went wrong. Please try again.";
  }
}

// Add event listeners for each button

// Icebreaker button
iceBtn.addEventListener('click', () => {
  // Ask for a fun icebreaker question
  getOpenAIResponse("Give me a fun, friendly icebreaker question for a group.");
});

// Weird Fact button
factBtn.addEventListener('click', () => {
  // Ask for a surprising or weird fact
  getOpenAIResponse("Share a surprising or weird fact that most people don't know.");
});

// Joke button
jokeBtn.addEventListener('click', () => {
  // Ask for a friendly, simple joke
  getOpenAIResponse("Tell me a short, friendly joke that anyone can enjoy.");
});

// Weather button
weatherBtn.addEventListener('click', () => {
  // Ask for a weather-related prompt to get people talking
  getOpenAIResponse("Give me a weather-related question or prompt that gets people to share what the weather is like where they are.");
});
