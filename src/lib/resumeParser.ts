import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

function isOpenRouterCreditError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /requires more credits|can only afford|credit/i.test(message);
}

function toResumeAnalysisError(error: unknown) {
  if (isOpenRouterCreditError(error)) {
    return new Error(
      "Resume analysis could not be completed because OpenRouter credits are exhausted. Please try again later or add credits."
    );
  }

  return error instanceof Error ? error : new Error("Unknown error while processing resume analysis.");
}

function buildFallbackAnalysis(parsedResume: Record<string, unknown>, goal = "") {
  const skills = Array.isArray(parsedResume.skills)
    ? parsedResume.skills.filter((skill): skill is string => typeof skill === "string")
    : [];
  const experience = Array.isArray(parsedResume.experience)
    ? parsedResume.experience.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    : [];
  const education = Array.isArray(parsedResume.education)
    ? parsedResume.education.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    : [];

  const skillNames = skills.slice(0, 4);
  const experienceSummary = experience.length
    ? experience[0]?.title || experience[0]?.company || "Professional experience"
    : "Professional experience";
  const educationSummary = education.length
    ? education[0]?.degree || education[0]?.institution || "Education"
    : "Education";

  const strengthItems = skillNames.length
    ? skillNames.map((skill) => ({
        name: skill,
        score: 78,
        reason: `The resume highlights ${skill} as a relevant capability for your target role.`,
      }))
    : [
        {
          name: experienceSummary,
          score: 74,
          reason: "The resume shows meaningful experience and qualifications that support your career growth.",
        },
      ];

  const improvementItems = [
    {
      name: goal?.toLowerCase().includes("manager") ? "Leadership communication" : "Communication",
      gap: 35,
      reason: `The profile would benefit from stronger ${goal?.toLowerCase().includes("manager") ? "leadership and" : ""} communication examples aligned to ${goal || "your target role"}.`,
    },
    {
      name: "Strategic planning",
      gap: 28,
      reason: "Adding stronger planning and execution examples can increase readiness for senior responsibilities.",
    },
  ];

  const topSkill = skillNames[0] || "Core professional skills";

  return {
    strengths: strengthItems,
    improvements: improvementItems,
    courses: [
      {
        title: "Communication & Stakeholder Management",
        reason: `A strong next step for ${goal || "your career growth"} based on the resume profile.`,
      },
      {
        title: "Leadership Essentials",
        reason: `Useful for advancing beyond ${experienceSummary || "current experience"}.`,
      },
      {
        title: `${educationSummary} + Career Growth Path`,
        reason: "Builds on your academic background and helps align it with current market expectations.",
      },
    ],
    highestGap: {
      name: topSkill || "Professional growth",
      gap: 35,
    },
  };
}

export async function parseResume(resumeText: string) {
  try {
    const compactResumeText = resumeText.slice(0, 3000);
    const response = await client.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a resume parser. Extract structured information and return only JSON.",
        },
        {
          role: "user",
          content: `
            Extract the following resume into this JSON format:

            {
              "name":"",
              "email":"",
              "phone":"",
              "skills":[],
              "education":[],
              "experience":[],
              "projects":[]
            }

            Resume:

            ${compactResumeText}
          `,
        },
      ],
      response_format: {
        type: "json_object",
      },
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let parsedContent: Record<string, unknown> = {};

    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = {};
    }

    return parsedContent;
  } catch (error) {
    throw toResumeAnalysisError(error);
  }
}

export async function analyzeResume(parsedResume: Record<string, unknown>, goal = "") {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a career growth assistant. Analyze a parsed resume and return only JSON with strengths, improvements, courses, and the highest skill gap.",
        },
        {
          role: "user",
          content: `
            Analyze this resume JSON and create a professional development plan.
            User goal: ${goal || "general career growth"}

            Resume JSON:
            ${JSON.stringify(parsedResume, null, 2)}

            Return JSON in this exact structure:
            {
              "strengths": [
                { "name": "", "score": 0, "reason": "" }
              ],
              "improvements": [
                { "name": "", "gap": 0, "reason": "" }
              ],
              "courses": [
                { "title": "", "reason": "" }
              ],
              "highestGap": { "name": "", "gap": 0 }
            }
          `,
        },
      ],
      response_format: {
        type: "json_object",
      },
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let parsedContent: Record<string, unknown> = {};

    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = {};
    }

    const fallback = buildFallbackAnalysis(parsedResume, goal);
    const strengths = Array.isArray(parsedContent.strengths) && parsedContent.strengths.length
      ? parsedContent.strengths
      : fallback.strengths;
    const improvements = Array.isArray(parsedContent.improvements) && parsedContent.improvements.length
      ? parsedContent.improvements
      : fallback.improvements;
    const courses = Array.isArray(parsedContent.courses) && parsedContent.courses.length
      ? parsedContent.courses
      : fallback.courses;
    const highestGap = parsedContent.highestGap && typeof parsedContent.highestGap === "object"
      ? parsedContent.highestGap
      : fallback.highestGap;

    return {
      strengths,
      improvements,
      courses,
      highestGap,
    };
  } catch (error) {
    throw toResumeAnalysisError(error);
  }
}