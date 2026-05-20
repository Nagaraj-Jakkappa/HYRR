const Groq = require("groq-sdk");
const crypto = require("crypto");
const redis = require("../config/redis");

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
      console.warn("Redis Cache Warning:", redisErr.message);
    }

    console.log("Calling Groq for Keyword Extraction...");
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

    const content = response.choices[0].message.content;
    const keywords = content.split(',').map(k => k.trim());

    try {
      if (redis && typeof redis.set === 'function') {
        await redis.set(cacheKey, JSON.stringify(keywords), { EX: 86400 });
      }
    } catch (cacheErr) {
      console.error("Redis Set Error:", cacheErr.message);
    }

    return keywords;
  } catch (error) {
    console.error("Keyword Extraction API Error:", error.message);
    return [];
  }
};

// --- UPDATED SIGNATURE: Added scanId ---
const analyzeResume = async (resumeText, jobDescription, keywords, socket, scanId) => {
  const sendUpdate = (event, data) => {
    if (typeof socket === 'function') {
      // Merges scanId automatically with progress updates so the client catches it
      socket(event, { scanId, ...data });
    }
  };

  try {
    sendUpdate('scan:progress', { step: 'Analyzing Structure', pct: 40 });

    console.log("Calling Groq for Resume Analysis...");
    const response = await aiClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS optimizer. Return a VALID JSON object. { "atsScore": 85, "keywordMatchPct": 70, "formattingScore": 90, "matchedKeywords": [], "missingKeywords": [], "suggestions": [{"text": "...", "type": "warning"}], "tokensUsed": 0 }`
        },
        {
          role: "user",
          content: `Job: ${jobDescription}\nKeywords: ${keywords.join(', ')}\nResume: ${resumeText}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    console.log("Groq Analysis Response Received.");

    const content = response.choices[0].message.content;
    const result = JSON.parse(content);

    sendUpdate('scan:progress', { step: 'Finalizing Score', pct: 90 });

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
    console.error("CRITICAL AI Analysis Error:", error);
    throw new Error(`AI Analysis Failed: ${error.message}`);
  }
};

const rewriteTextWithAI = async (text, jobTitle) => {
  try {
    const prompt = `Rewrite this bullet point to be impactful for a ${jobTitle} role. Original: "${text}"`;
    const chatCompletion = await aiClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150,
    });
    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Rewrite Error:', error.message);
    throw new Error('Failed to rewrite text');
  }
};

module.exports = { analyzeResume, extractKeywordsFromJD, rewriteTextWithAI };