const Groq = require("groq-sdk");
const crypto = require("crypto");
const redis = require("../config/redis");

// Global initialization of the Groq SDK client
const aiClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Extracts key domain competency metrics from target job postings text
 */
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

/**
 * Runs structural evaluations and keyword matrix density counts
 */
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

/**
 * Optimizes structural bullet phrases with clear action descriptors
 */
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

/**
 * Synthesizes a high-fidelity 3-paragraph cover letter using Groq Llama-3
 */
const generateCoverLetterWithAI = async (resumeData, companyName, jobTitle) => {
  try {
    const prompt = `
      You are an expert career consultant and copywriter. Draft a premium, high-impact cover letter based on the following professional applicant data.
      
      Target Context Parameters:
      - Company Name: ${companyName}
      - Target Role: ${jobTitle}
      
      Applicant Resume Data:
      ${JSON.stringify(resumeData)}

      STRICT RULES:
      1. Return exactly three paragraphs.
         - Paragraph 1: Hook the recruiter, state the role, and explain why this explicit company excites them.
         - Paragraph 2: Connect their top technical achievements (matching the metrics in their experience history) directly to what the role demands.
         - Paragraph 3: Call to action, reaffirm cultural alignment, and sign off professionally.
      2. Start directly with the greeting ("Dear Hiring Team at ${companyName},").
      3. Do NOT include markdown styling syntax, headers, preambles, introductory filler, or footer placeholder info blocks (like "Sincerely, Name" or address elements). Just return the raw 3 paragraphs separated by double linebreaks.
    `;

    // Re-uses the globally configured aiClient instance securely
    const completion = await aiClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.6
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Cover Letter Generation Error:', error.message);
    throw new Error('Failed to generate customized cover letter text.');
  }
};

module.exports = {
  analyzeResume,
  extractKeywordsFromJD,
  rewriteTextWithAI,
  generateCoverLetterWithAI
};