const Groq = require("groq-sdk");
const crypto = require("crypto");
const redis = require("../config/redis");

// Groq SDK client — uses Llama 3.3 (70B) for analysis/rewrites and Llama 3.1 (8B) for fast extraction
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
    const hash = crypto.createHash('sha256').update(resumeText + jobDescription + keywords.join(',')).digest('hex');
    const cacheKey = `scan:${hash}`;

    try {
      if (redis && typeof redis.get === 'function') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log("Returning cached AI analysis");
          sendUpdate('scan:progress', { step: 'Finalizing Score', pct: 90 });
          return JSON.parse(cached);
        }
      }
    } catch (redisErr) {
      console.warn("Redis Cache Warning:", redisErr.message);
    }

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

    try {
      if (redis && typeof redis.set === 'function') {
        await redis.set(cacheKey, JSON.stringify(result), { EX: 86400 * 7 }); // Cache for 7 days
      }
    } catch (cacheErr) {
      console.error("Redis Set Error:", cacheErr.message);
    }

    return result;
  } catch (error) {
    console.error("CRITICAL AI Analysis Error:", error);
    throw new Error(`AI Analysis Failed: ${error.message}`);
  }
};

/**
 * Rewrites a single resume bullet point using Groq Llama 3.3 for impact optimization
 */
const rewriteTextWithAI = async (text, jobTitle) => {
  try {
    const hash = crypto.createHash('sha256').update(text + jobTitle).digest('hex');
    const cacheKey = `rewrite:${hash}`;

    try {
      if (redis && typeof redis.get === 'function') {
        const cached = await redis.get(cacheKey);
        if (cached) return cached;
      }
    } catch (redisErr) {
      console.warn("Redis Cache Warning:", redisErr.message);
    }

    const prompt = `Rewrite this bullet point to be impactful for a ${jobTitle} role. Original: "${text}"`;
    const chatCompletion = await aiClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150,
    });
    
    const result = chatCompletion.choices[0].message.content.trim();

    try {
      if (redis && typeof redis.set === 'function') {
        await redis.set(cacheKey, result, { EX: 86400 * 30 }); // Cache for 30 days
      }
    } catch (cacheErr) {
      console.error("Redis Set Error:", cacheErr.message);
    }

    return result;
  } catch (error) {
    console.error('AI Rewrite Error:', error.message);
    throw new Error('Failed to rewrite text');
  }
};

/**
 * Generates a tailored 3-paragraph cover letter using Groq Llama 3.1 (8B Instant)
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
    const stream = await aiClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      stream: true
    });

    return stream;
  } catch (error) {
    console.error('AI Cover Letter Generation Error:', error.message);
    throw new Error('Failed to generate customized cover letter text.');
  }
};

const parseLinkedInResumeWithAI = async (rawText) => {
  try {
    const prompt = `
      You are an expert resume parsing engine. Analyze the following raw text extracted from a LinkedIn "Save to PDF" profile document.
      Extract the personal metrics, professional summaries, work timelines, and academic instances.
      
      CRITICAL: You must return ONLY a clean JSON object conforming EXACTLY to the structure specified below. Do not add markdown blocks like \`\`\`json, do not write header descriptions or introductory texts.
      
      Target Structure Blueprint:
      {
        "personalInfo": {
          "fullName": "Extract string or fallback to empty string",
          "email": "Extract valid email or empty string",
          "phone": "Extract number or empty string",
          "location": "Extract city/state or empty string",
          "linkedin": "Extract profile url handle or empty string"
        },
        "summary": "Synthesize a professional overview text block based on their headline and summary section",
        "experience": [
          {
            "company": "Company Name",
            "position": "Job Title",
            "startDate": "YYYY-MM or string format",
            "endDate": "YYYY-MM or string format",
            "current": true/false based on timeline details,
            "description": "Construct comprehensive structural summary lines of achievements or metadata"
          }
        ],
        "education": [
          {
            "institution": "School or University Name",
            "degree": "BCA, B.E., etc.",
            "fieldOfStudy": "Computer Applications, etc.",
            "startDate": "Year string",
            "endDate": "Year string"
          }
        ],
        "skills": ["Array", "of", "skill", "strings"]
      }

      Raw LinkedIn Profile Content Stream:
      ${rawText}
    `;

    const chatCompletion = await aiClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error('LinkedIn Parsing Error:', error.message);
    throw new Error('Failed to parse LinkedIn PDF.');
  }
};

const rewriteResumeWithKeywords = async (rawText, jobDescription, missingKeywordsStr) => {
  try {
    const prompt = `You are a professional resume writer. Rewrite the resume to better match the job description by naturally incorporating specific missing keywords. 
          Return ONLY the improved resume text. DO NOT include any conversational filler, explanations, preambles, or concluding notes. Your output must start exactly with the resume content and end exactly with the resume content.`;

    const chatCompletion = await aiClient.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `RESUME TEXT: ${rawText}\n\nTARGET JOB: ${jobDescription}\n\nMISSING KEYWORDS TO INCLUDE: ${missingKeywordsStr}` }
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    let content = chatCompletion.choices[0]?.message?.content || rawText;

    // Strip conversational filler from the bottom (e.g. "Note: I've incorporated...")
    content = content.replace(/(?:\n|^)(?:Note:|Here is the|Here's the|Please note|Additionally,|I have incorporated).*[\s\S]*$/gi, '');
    // Strip conversational filler from the top (e.g. "Here is the revised resume:")
    content = content.replace(/^(?:Here is the|Here's the|Sure|Certainly|Below is the).*?\n/gi, '');

    return content.trim();
  } catch (error) {
    console.error('Resume Rewrite Error:', error.message);
    return rawText; // Fallback to raw text
  }
};

module.exports = {
  analyzeResume,
  extractKeywordsFromJD,
  rewriteTextWithAI,
  generateCoverLetterWithAI,
  parseLinkedInResumeWithAI,
  rewriteResumeWithKeywords
};