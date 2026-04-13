require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());

// Auth Middleware
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await db.query('SELECT id, email, is_admin FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) throw new Error('User not found');
    
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const isFirstUser = (await db.query('SELECT COUNT(*) FROM users')).rows[0].count == 0;

    const newUser = await db.query(
      'INSERT INTO users (email, password, is_admin, credits) VALUES ($1, $2, $3, 2000) RETURNING id, email, is_admin, credits',
      [email, hashedPassword, isFirstUser || email === process.env.ADMIN_EMAIL]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, email: user.email, is_admin: user.is_admin }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', verifyJWT, async (req, res) => {
  try {
    const result = await db.query('SELECT id, email, credits, is_admin FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CORE LOGIC ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/credits', verifyJWT, async (req, res) => {
  try {
    const result = await db.query('SELECT credits, is_admin, email FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/projects', verifyJWT, async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(projects.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/generate', verifyJWT, async (req, res) => {
  const { projectIdea, designStyle, platform, appType, primaryColor, format, complexity, audience, tone, appTheme } = req.body;

  if (!projectIdea) return res.status(400).json({ error: 'Project idea is required' });

  try {
    // Check credits (Admins bypass)
    const userResult = await db.query('SELECT credits, is_admin FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];
    
    if (!user.is_admin && user.credits < 500) {
      return res.status(403).json({ error: 'Insufficient credits. Each generation costs 500 tokens.' });
    }

    // Check project limit (max 2 for non-admins)
    if (!user.is_admin && !req.body.id) {
       const projectsCount = await db.query('SELECT COUNT(*) FROM projects WHERE user_id = $1', [req.user.id]);
       if (parseInt(projectsCount.rows[0].count) >= 2) {
         return res.status(403).json({ error: 'Project limit reached. Upgrade to create more than 2 projects.' });
       }
    }

    const systemPrompt = `You are a world-class CTO and Lead AI Architect specializing in ${platform} and ${appType}.
    Your goal is to generate a comprehensive, PRODUCTION-READY system prompt that can guide another AI (like Claude or GPT-4) to build a high-end ${appType}.

    CONTEXT:
    - Target Platform: ${platform}
    - App Type: ${appType}
    - Visual Style: ${designStyle} in ${appTheme}
    - Brand Color: ${primaryColor}
    - Technical Complexity: ${complexity}
    - Target Audience: ${audience}
    - Communication Tone: ${tone}
    - Core Idea: "${projectIdea}"

    INSTRUCTIONS FOR THE OUTPUT:
    1. ARCHITECTURE: Define a scalable folder structure and state management pattern.
    2. TECH STACK: Suggest a modern, high-performance stack suitable for ${platform}.
    3. UI/UX: Provide specific design tokens, animation guidelines (using Framer Motion or Similar), and accessibility (A11y) requirements.
    4. DATA MODEL: Define specific tables/collections, relationships, and validation schemas.
    5. API & SECURITY: Outline critical REST/GraphQL endpoints and security protocols (JWT, RBAC, Rate Limiting).
    6. FEATURES: List out at least 5 advanced features specific to the project idea.

    OUTPUT FORMAT REQUIREMENTS:
    You must return ONLY a JSON object with strictly these keys:
    {
      "text": "Detailed Markdown string containing all the sections above, formatted for maximum clarity and depth.",
      "json": { 
         "architecture": {}, 
         "stack": [], 
         "features": [],
         "data_model": {},
         "ui_config": { "colors": ["${primaryColor}"], "theme": "${appTheme}" }
      },
      "yaml": "A clean YAML representation of the technical specification."
    }

    FINAL RULE: Do not include any talk before or after the JSON. Start with { and end with }.`;

    let output;
    try {
      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: systemPrompt }]
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "Content-Type": "application/json"
        }
      });
      const content = response.data.choices[0].message.content;
      console.log('OpenRouter Response:', content);

      try {
        // Strip out any markdown code blocks if the model wrapped the JSON
        const cleanJson = content.replace(/```json\n?|```/g, '').trim();
        output = JSON.parse(cleanJson);
        
        // Ensure all required fields exist
        if (!output.text || !output.json || !output.yaml) {
           throw new Error('Incomplete JSON structure');
        }
      } catch (e) {
        console.warn('JSON parsing failed, structured output not detected. Formatting raw response.');
        output = { 
          text: content, 
          json: { rawContent: content }, 
          yaml: content 
        };
      }
    } catch (apiErr) {
      console.error('Generation API call failed:', apiErr.message, apiErr.response?.data);
      output = { text: "Generation failed", json: {}, yaml: "" };
    }

    // Deduct tokens (Admins bypass)
    if (!user.is_admin) {
        await db.query('UPDATE users SET credits = credits - 500 WHERE id = $1', [req.user.id]);
    }

    let finalProjectId;
    if (req.body.id) {
        // Update existing project
        await db.query(
            'UPDATE projects SET name = $1, platform = $2, app_type = $3, prompt_text = $4, prompt_json = $5, prompt_yaml = $6 WHERE id = $7 AND user_id = $8',
            [projectIdea, platform, appType, output.text, JSON.stringify(output.json), output.yaml, req.body.id, req.user.id]
        );
        finalProjectId = req.body.id;
    } else {
        // Save new project
        const projectResult = await db.query(
            'INSERT INTO projects (user_id, name, platform, app_type, prompt_text, prompt_json, prompt_yaml) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [req.user.id, projectIdea, platform, appType, output.text, JSON.stringify(output.json), output.yaml]
        );
        finalProjectId = projectResult.rows[0].id;
    }

    const { rows: updatedUser } = await db.query('SELECT credits FROM users WHERE id = $1', [req.user.id]);

    res.json({
      output,
      newCredits: updatedUser[0].credits,
      projectId: finalProjectId
    });

  } catch (err) {
    console.error('SERVER FATAL ERROR:', err);
    res.status(500).json({ error: 'Critical failure in generation pipeline' });
  }
});

// --- ADMIN DASHBOARD ROUTES ---

app.get('/api/admin/users', verifyJWT, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
  try {
    const result = await db.query('SELECT id, email, credits, is_admin, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/update-credits', verifyJWT, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
  const { userId, credits } = req.body;
  try {
    await db.query('UPDATE users SET credits = $1 WHERE id = $2', [credits, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
