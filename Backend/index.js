require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const User = require('./models/User');
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Admin Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Gemini Init (Replaced by OpenRouter)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());

// Auth Middleware
const verifyJWT = async (req, res, next) => {
  // Temporary: Mock user for testing without Supabase keys
  req.user = { id: 'mock-user-id', email: process.env.ADMIN_EMAIL || 'test@example.com' };
  return next();

  /* Original Auth Logic (Disabled Temporarily)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error('Invalid token');
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
  */
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Get User Credits / Register on first check
app.get('/credits', verifyJWT, async (req, res) => {
  // Temporary: Return mock credits for testing without DB
  return res.json({
    credits: 100000,
    isAdmin: true,
    email: req.user.email
  });

  /* Original DB Logic
  try {
    let user = await User.findOne({ userId: req.user.id });
    ...
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  */
});

// Get User Projects
app.get('/projects', verifyJWT, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generate Prompt
app.post('/generate', verifyJWT, async (req, res) => {
  const { projectIdea, designStyle, platform, appType, primaryColor, format, complexity, audience, tone, appTheme } = req.body;

  if (!projectIdea) return res.status(400).json({ error: 'Project idea is required' });

  try {
    // model init is handled inside the axios call now

    const systemPrompt = `You are a professional AI prompt engineer. 
    Generate a high-fidelity system prompt for an AI to build a ${appType} on ${platform}.
    Target Deployment Platform: ${platform}
    UI Base Theme: ${appTheme}
    Design Style: ${designStyle}
    Primary Color: ${primaryColor}
    Total Complexity: ${complexity}
    Target Audience: ${audience}
    Desired Tone: ${tone}
    
    CRITICAL: Design the prompt specifically to be used on ${platform}. If ${platform} is Claude, use Artifact-friendly structures. If ${platform} is Lovable or Bolt, optimize for modern React component generation.
    
    The user's project idea: "${projectIdea}"
    
    CRITICAL INSTRUCTION: You must return the output EXACTLY as a strict JSON object with exactly three keys: "text", "json", and "yaml".
    
    The "text" key must contain the full system prompt.
    The "yaml" key must contain a technical YAML configuration.
    The "json" key MUST be a JSON object following this EXACT structure:
    {
      "task": "A descriptive task name (e.g., build_sass_dashboard)",
      "product_name": "${appType}",
      "brand": "${designStyle}",
      "features": ["3-5 core technical features"],
      "target_audience": "${audience}",
      "tone": "${tone}"
    }
    
    Do NOT include any markdown formatting blocks around your JSON response. Return STRICTLY the raw JSON object.`;

    let output;
    try {
      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: systemPrompt }]
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5174",
          "Content-Type": "application/json"
        }
      });
      const content = response.data.choices[0].message.content;
      try {
        output = JSON.parse(content.replace(/^\`\`\`json\s*/, '').replace(/\`\`\`$/, '').trim());
      } catch (e) {
        output = { text: content, json: content, yaml: content };
      }
    } catch (apiErr) {
      console.warn('OpenRouter API Error (using fallback):', apiErr.message);

      // DETAILED FALLBACK
      const mockJson = JSON.stringify({
        project: { name: projectIdea, type: appType, platform: platform, style_guide: { aesthetic: designStyle, base_color: primaryColor } }
      }, null, 2);
      const mockYaml = `project:\n  name: ${projectIdea}\n  type: ${appType}\n  platform: ${platform}\n`;
      const mockText = `# 🚀 FULL TECHNICAL BLUEPRINT: ${projectIdea}\n\n## 1. STRATEGIC OVERVIEW\nYou are commissioned to build a professional-grade ${appType} localized for ${platform}.`;

      output = {
        text: mockText,
        json: mockJson,
        yaml: mockYaml
      };
    }

    res.json({
      output,
      newCredits: 99500,
      projectId: 'mock-project-id'
    });

  } catch (err) {
    console.error('SERVER FATAL ERROR:', err);
    res.status(500).json({ error: 'Critical failure in generation pipeline' });
  }
});

// Test Route: Generate Prompt without Auth/DB
app.post('/test-generate', async (req, res) => {
  const { projectIdea, designStyle, platform, appType, primaryColor, format } = req.body;

  try {
    // model init handled in axios call

    const systemPrompt = `You are a professional AI prompt engineer. 
    Generate a high-fidelity system prompt for an AI to build a ${appType} ${platform}.
    Style: ${designStyle}
    Primary Color: ${primaryColor}
    
    The user's project idea: "${projectIdea}"
    
    CRITICAL INSTRUCTION: You must return the output EXACTLY as a strict JSON object with exactly three keys: "text", "json", and "yaml".
    - "text": a beautifully structured markdown document containing the prompt.
    - "json": a pure JSON string representation of the prompt.
    - "yaml": a pure YAML string representation of the prompt.
    
    Do NOT include any markdown formatting blocks around your JSON response. Return STRICTLY the raw JSON object.`;

    let output;
    try {
      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: systemPrompt }]
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5174",
          "Content-Type": "application/json"
        }
      });
      const content = response.data.choices[0].message.content;
      try {
        output = JSON.parse(content.replace(/^\`\`\`json\s*/, '').replace(/\`\`\`$/, '').trim());
      } catch (e) {
        output = { text: content, json: content, yaml: content };
      }
    } catch (apiErr) {
      console.warn('OpenRouter API Error (using fallback):', apiErr.message);
      // DETAILED FALLBACK
      const mockJson = JSON.stringify({
        project: { name: projectIdea, type: appType, platform: platform, style_guide: { aesthetic: designStyle, base_color: primaryColor } }
      }, null, 2);
      const mockYaml = `project:\n  name: ${projectIdea}\n  type: ${appType}\n  platform: ${platform}\n`;
      const mockText = `# 🚀 FULL TECHNICAL BLUEPRINT: ${projectIdea}\n\n## 1. STRATEGIC OVERVIEW\nYou are commissioned to build a professional-grade ${appType} localized for ${platform}.`;

      output = {
        text: mockText,
        json: mockJson,
        yaml: mockYaml
      };
    }

    res.json({ output });

  } catch (err) {
    console.error('Test Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate test prompt' });
  }
});

// Mock Buy Tokens (Phase 3)
app.post('/buy-tokens', verifyJWT, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findOne({ userId: req.user.id });
    user.credits += parseInt(amount);
    await user.save();
    res.json({ credits: user.credits });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Stripe Integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', verifyJWT, async (req, res) => {
  const { tokens, priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/pricing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/pricing?canceled=true`,
      metadata: {
        userId: req.user.id,
        tokens: tokens.toString()
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe Webhook (Raw body required)
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, tokens } = session.metadata;

    await User.findOneAndUpdate(
      { userId },
      { $inc: { credits: parseInt(tokens) } }
    );
    console.log(`Fulfilled ${tokens} tokens for user ${userId}`);
  }

  res.json({ received: true });
});

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
