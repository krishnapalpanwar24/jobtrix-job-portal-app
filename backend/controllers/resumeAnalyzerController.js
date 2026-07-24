const Groq = require("groq-sdk");
const { PDFParse } = require("pdf-parse");
const axios = require("axios");
const Job = require("../models/jobModel"); 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeResume = async (req, res) => {
  try {
    
    const { resumeUrl, jobId } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Resume URL is required",
      });
    }
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const jobDescription = job.description; 

    
    const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
    const resumeBuffer = Buffer.from(response.data);

   
    const parser = new PDFParse({ data: resumeBuffer });
    const pdfResult = await parser.getText();
    const resumeText = pdfResult.text;
    await parser.destroy();

   
    const prompt = `
You are an expert ATS (Applicant Tracking System) and technical recruiter helping an EMPLOYER screen a candidate.

Analyze the following RESUME against the given JOB DESCRIPTION.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object (no extra text, no markdown, no explanation outside JSON) in this exact format:
{
  "atsScore": <number between 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "strengths": ["point1", "point2"],
  "recommendation": "<2-3 sentence hiring recommendation for the employer>"
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0].message.content;

    let parsedResult;
    try {
      const cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();
      parsedResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
        rawResponse: aiResponse,
      });
    }

    return res.status(200).json({
      success: true,
      data: parsedResult,
    });

  } catch (error) {
    console.error("Resume Analyzer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while analyzing resume",
      error: error.message,
    });
  }
};

module.exports = { analyzeResume };