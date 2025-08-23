import Review from "../models/review.model.js"
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const getSummaryOfAllReviews = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const reviews = await Review.find({ serviceId })

        const reviewComments = reviews.map(r => r.comment);

        let aiFeedback;

        if (reviewComments.length === 0) {
        aiFeedback = "No reviews available yet for this service.";
        } else {
        const allCommentsText = reviewComments.join("\n");
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            { 
                role: "system", 
                content: `You are an AI assistant that provides concise 2-line summaries of service reviews. Always analyze the given reviews and provide meaningful insights in exactly 2 lines, regardless of whether there's 1 review or 100+ reviews.`
            },
            { 
                role: "user", 
                content: `Summarize these ${reviewComments.length} review${reviewComments.length > 1 ? 's' : ''} in exactly 2 lines: ${allCommentsText}`
            }
            ],
            temperature: 0.3, 
            max_tokens: 100 
        });
        aiFeedback = completion.choices[0].message.content;
        }
        return res.status(200).json({ data : aiFeedback});
    } catch (error) {
        return res.status(500).json({aiFeedback: "Error fetching reviews or generating AI feedback."});
    }
};