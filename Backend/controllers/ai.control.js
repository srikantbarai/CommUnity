import Review from "../models/review.model.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getSummaryOfAllReviews = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    const reviews = await Review.find({ serviceId });

    const reviewComments = reviews.map((r) => r.comment);

    let aiFeedback;

    if (reviewComments.length === 0) {
      aiFeedback = "No reviews available yet for this service.";
    } else {
      const allCommentsText = reviewComments.join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an AI assistant that provides concise 2-line summaries of service reviews.

Rules:
- Always analyze the given reviews.
- Provide meaningful insights.
- Return exactly 2 lines.
- Do not use bullet points.

Reviews (${reviewComments.length}):
${allCommentsText}
`,
      });

      aiFeedback = response.text;
    }

    return res.status(200).json({
      data: aiFeedback,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      aiFeedback:
        "Error fetching reviews or generating AI feedback.",
    });
  }
};