const { z } = require('zod');

/**
 * Common helpers
 */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid resume ID format.');

const nonEmptyString = (fieldName, min = 2) =>
  z
    .string()
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters long.`);

const optionalString = z.string().trim().optional().or(z.literal(''));

/**
 * Resume nested schemas
 */
const personalInfoSchema = z.object({
  fullName: optionalString,
  email: z.string().trim().email('Invalid email format.').optional().or(z.literal('')),
  phone: optionalString,
  location: optionalString,
  linkedin: optionalString,
  portfolio: optionalString,
  github: optionalString,
}).partial();

const experienceSchema = z.object({
  jobTitle: optionalString,
  company: optionalString,
  location: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  description: optionalString,
});

const educationSchema = z.object({
  degree: optionalString,
  institution: optionalString,
  location: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  description: optionalString,
});

const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema.optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(z.string().trim()).optional(),
  summary: optionalString,
});

/**
 * Zod Schemas for Resume Routes
 */
const magicRewriteSchema = z.object({
  text: z
    .string()
    .trim()
    .min(5, 'Text must be at least 5 characters long for AI rewriting.'),

  jobTitle: nonEmptyString('Job title', 2),
});

const generateCoverLetterSchema = z.object({
  resumeData: resumeDataSchema,

  companyName: nonEmptyString('Company name', 2),

  jobTitle: nonEmptyString('Job title', 2),
});

/**
 * Zod Schemas for Scan Routes
 */
const scanResumeSchema = z.object({
  resumeId: objectIdSchema,

  jobDescription: z
    .string()
    .trim()
    .min(50, 'Job description is too short to analyze effectively.'),

  jobTitle: nonEmptyString('Job title', 2),

  companyName: nonEmptyString('Company name', 2),
});

module.exports = {
  magicRewriteSchema,
  generateCoverLetterSchema,
  scanResumeSchema,
};
