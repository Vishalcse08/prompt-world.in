async function testGeneration() {
  const payload = {
    projectIdea: "make a project as a saas",
    designStyle: "Modern SaaS",
    platform: "Web App",
    appType: "Booking System",
    primaryColor: "#00FF88",
    format: "text"
  };

  console.log("Testing AI Generation...");
  try {
    const response = await fetch('http://localhost:5000/test-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (data.output) {
      console.log("\n✅ PROMPT GENERATED SUCCESSFULLY:");
      console.log("-----------------------------------");
      const textOutput = typeof data.output === 'object' ? (data.output.text || JSON.stringify(data.output)) : data.output;
      console.log(textOutput.substring(0, 1000) + "..."); // Print first 1000 chars
      console.log("-----------------------------------");
    } else {
      console.log("❌ Failed to generate prompt:", data.error);
    }
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
  }
}

testGeneration();
