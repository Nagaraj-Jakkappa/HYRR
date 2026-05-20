const Groq = require("groq-sdk");
const crypto = require("crypto");
const redis = require("../config/redis");

// Initialize a single Groq client for all functions
const aiClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractKeywordsFromJD = async (jobDescription) => {
  try {
    const hash = crypto.createHash('sha256').update(jobDescription).digest('hex');
    const cacheKey = `jd:keywords:${hash}`;

    try {
      if (redis && typeof redis.get === 'function') {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      }
    } catch (redisErr) {
      console.warn(redisErr.message);
    }

    const response = await aiClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Extract the top 15-20 technical skills and soft skills from this job description. Return ONLY a comma-separated list of keywords."
        },
        { role: "user", content: jobDescription }
      ],
      temperature: 0.3,
    });

    const keywords = response.choices[0].message.content.split(',').map(k => k.trim());

    try {
      if (redis && typeof redis.set === 'function') {
        await redis.set(cacheKey, JSON.stringify(keywords), {
          EX: 86400
        });
      }
    } catch (cacheErr) {
      console.error(cacheErr.message);
    }

    return keywords;
  } catch (error) {
    return [];
  }
};

const analyzeResume = async (resumeText, jobDescription, keywords, socket) => {
  try {
    const sendUpdate = (event, data) => {
      if (typeof socket === 'function') {
        socket(event, data);
      }
    };

    sendUpdate('scan:progress', { step: 'Analyzing Structure', pct: 40 });

    const response = await aiClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS (Applicant Tracking System) optimizer. 
          Analyze the resume against the job description and keywords.
          You MUST return a VALID JSON object.
          
          CRITICAL: "suggestions" must be an array of OBJECTS.
          Each object needs:
          1. "text": The actionable advice.
          2. "type": One of ["info", "warning", "success", "tip"].

          Use this structure:
          {
            "atsScore": 85,
            "keywordMatchPct": 70,
            "formattingScore": 90,
            "matchedKeywords": ["React", "Node.js"],
            "missingKeywords": ["TypeScript", "AWS"],
            "suggestions": [{ "text": "Example", "type": "warning" }],
            "tokensUsed": 1000
          }`
        },
        {
          role: "user",
          content: `Job Description: ${jobDescription}\n\nKeywords: ${keywords.join(', ')}\n\nResume Content: ${resumeText}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    sendUpdate('scan:progress', { step: 'Finalizing Score', pct: 90 });

    const result = JSON.parse(response.choices[0].message.content);

    if (result.suggestions && Array.isArray(result.suggestions)) {
      result.suggestions = result.suggestions.map(s => ({
        text: s.text || s.message || "Improve resume alignment",
        type: s.type || 'info'
      }));
    } else {
      result.suggestions = [{ text: "Consider adding industry-specific keywords.", type: "info" }];
    }

    return result;
  } catch (error) {
    throw new Error(`AI Analysis Failed: ${error.message}`);
  }
};

// --- NEW: Magic Rewrite Function ---
const rewriteTextWithAI = async (text, jobTitle) => {
  try {
    const prompt = `You are an expert resume writer. Rewrite the following bullet point to make it sound highly professional, action-oriented, and impactful. Tailor the tone for a ${jobTitle || 'professional'} role. 
    Do not add introductory text, just return the improved bullet point.
    
    Original text: "${text}"`;

    const chatCompletion = await aiClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      // Using the more powerful model for rewriting if defined, falling back to versatile
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150,
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Rewrite Error:', error);
    throw new Error('Failed to rewrite text');
  }
};

module.exports = {
  analyzeResume,
  extractKeywordsFromJD,
  rewriteTextWithAI
};