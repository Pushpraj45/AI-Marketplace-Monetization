import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

// Configure Azure OpenAI client
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

// Create a secure HTTPS agent for Azure
const azureHttpsAgent = new https.Agent({
  rejectUnauthorized: true, // Best practice: validate certificates
  secureProtocol: 'TLSv1_2_method', // Force TLSv1.2
  secureOptions: require('constants').SSL_OP_NO_TLSv1 | require('constants').SSL_OP_NO_TLSv1_1, // Disable older protocols
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256' // Modern ciphers
});

// Initialize the Azure OpenAI client with proper TLS settings
const client = new OpenAIClient(
  endpoint, 
  new AzureKeyCredential(apiKey),
  { httpClient: { httpAgent: azureHttpsAgent } }
);

/**
 * Generate personalized assessment questions based on family and child information
 * @param {Object} childData - Child information
 * @param {Object} familyData - Family information
 * @param {string} concernArea - Primary concern area
 * @returns {Promise<Object>} - Assessment questions tailored to the child and family
 */
export const generatePersonalizedAssessment = async (
  childData,
  familyData,
  concernArea
) => {
  try {
    // Create a detailed context for the AI to work with
    const context = {
      child: {
        name: childData.name,
        age: childData.age,
        gender: childData.gender || "not specified",
        developmentalConcerns: childData.developmentalConcerns || [],
        medicalHistory:
          childData.medicalHistory || "No medical history provided",
        behavioralNotes:
          childData.behavioralNotes || "No behavioral notes provided",
      },
      family: {
        structure: familyData.familyStructure || "not specified",
        dynamics:
          familyData.familyDynamics ||
          "No family dynamics information provided",
        homeEnvironment:
          familyData.homeEnvironment ||
          "No home environment information provided",
      },
      primaryConcern: concernArea,
    };

    const prompt = `Generate a personalized assessment for ${
      childData.name
    }, a ${
      childData.age
    }-year-old child with concerns related to ${concernArea}.

Detailed Context:
- Child's Name: ${childData.name}
- Age: ${childData.age}
- Gender: ${childData.gender || "Not specified"}
- Family Structure: ${familyData.familyStructure || "Not specified"}
- Home Environment: ${familyData.homeEnvironment || "Not specified"}
- Developmental Concerns: ${
      childData.developmentalConcerns?.join(", ") || "Not specified"
    }
- Medical History: ${childData.medicalHistory || "None provided"}
- Behavioral Notes: ${childData.behavioralNotes || "None provided"}

Please create 10-15 age-appropriate questions that address:
1. The primary concern (${concernArea})
2. The specific child's developmental context
3. The family environment and dynamics
4. Daily routines and functioning

Format the response as a JSON object with this structure:
{
  "title": "Personalized Assessment for ${childData.name}",
  "description": "A detailed description of what this assessment focuses on",
  "questions": [
    {
      "text": "Question text",
      "type": "multiple-choice",
      "options": [
        {"text": "Option 1", "value": 0},
        {"text": "Option 2", "value": 1},
        {"text": "Option 3", "value": 2}
      ],
      "category": "behavior",
      "rationale": "Why this question is relevant"
    }
  ]
}

Category options: "behavior", "social", "emotional", "cognitive", "physical", "environmental", "family".
Question types: "multiple-choice", "scale", or "text".
For scale questions, create options from 0 to 4 representing frequency or intensity.`;

    const response = await client.getChatCompletions(deploymentName, [
      {
        role: "system",
        content:
          "You are a specialized child development expert who creates personalized assessments based on detailed child and family information.",
      },
      { role: "user", content: prompt },
    ]);

    // Get the generated content
    const generatedContent = response.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to generate valid assessment structure");
    }

    const assessmentData = JSON.parse(jsonMatch[0]);

    // Add metadata to the assessment
    return {
      ...assessmentData,
      childId: childData._id,
      familyId: familyData._id,
      category: concernArea,
      ageRange: {
        min: childData.age - 1,
        max: childData.age + 1,
      },
      isPersonalized: true,
      isAIGenerated: true,
      contextData: context,
    };
  } catch (error) {
    console.error("Error generating personalized assessment:", error);
    throw error;
  }
};

/**
 * Analyze assessment results with context awareness
 * @param {Object} assessmentData - Assessment data including questions and context
 * @param {Array} answers - User's answers to the assessment
 * @param {Object} childData - Child information
 * @param {Object} familyData - Family information
 * @returns {Promise<Object>} - Context-aware analysis results and recommendations
 */
export const analyzePersonalizedResults = async (
  assessmentData,
  answers,
  childData,
  familyData
) => {
  try {
    // Calculate scores
    let totalScore = 0;
    let maxPossibleScore = 0;
    let categoryScores = {};

    answers.forEach((answer) => {
      if (typeof answer.score === "number") {
        totalScore += answer.score;

        // Find the corresponding question to determine max score and category
        const question = assessmentData.questions.find(
          (q) => q._id.toString() === answer.questionId.toString()
        );

        if (question) {
          // Track score by category
          const category = question.category || "general";
          if (!categoryScores[category]) {
            categoryScores[category] = {
              score: 0,
              maxPossible: 0,
              questions: [],
            };
          }

          categoryScores[category].score += answer.score;

          // Determine max possible score based on question type
          let maxScore = 0;
          if (question.type === "multiple-choice") {
            maxScore = Math.max(...question.options.map((opt) => opt.value));
          } else if (question.type === "scale") {
            maxScore = 4; // Assuming scale from 0-4
          }

          maxPossibleScore += maxScore;
          categoryScores[category].maxPossible += maxScore;

          // Store the question and answer for detailed analysis
          categoryScores[category].questions.push({
            questionText: answer.questionText,
            answer: answer.answer,
            score: answer.score,
            maxScore: maxScore,
          });
        }
      }
    });

    // Format the answers for AI analysis
    const answersFormatted = answers.map((a) => {
      return {
        question: a.questionText,
        answer: typeof a.answer === "object" ? a.answer.text : a.answer,
        score: a.score,
        category: a.category || "general",
      };
    });

    // Prepare category analysis
    const categoryAnalysis = Object.keys(categoryScores).map((category) => {
      const data = categoryScores[category];
      return {
        category,
        score: data.score,
        maxPossible: data.maxPossible,
        percentage: Math.round((data.score / data.maxPossible) * 100),
        questions: data.questions,
      };
    });

    const prompt = `You are analyzing personalized assessment results for ${
      childData.name
    }, a ${childData.age}-year-old child with concerns related to ${
      assessmentData.category
    }.

Detailed Context:
- Child's Name: ${childData.name}
- Age: ${childData.age}
- Gender: ${childData.gender || "Not specified"}
- Family Structure: ${familyData.familyStructure || "Not specified"}
- Home Environment: ${familyData.homeEnvironment || "Not specified"}
- Developmental Concerns: ${
      childData.developmentalConcerns?.join(", ") || "Not specified"
    }
- Medical History: ${childData.medicalHistory || "None provided"}
- Behavioral Notes: ${childData.behavioralNotes || "None provided"}

Assessment Results:
- Overall Score: ${totalScore} out of ${maxPossibleScore} (${Math.round(
      (totalScore / maxPossibleScore) * 100
    )}%)
- Category Breakdown: ${JSON.stringify(categoryAnalysis, null, 2)}

Detailed Responses:
${JSON.stringify(answersFormatted, null, 2)}

Based on this comprehensive assessment, please provide:
1. A detailed analysis of the child's results across different categories (300-400 words)
2. Five specific, personalized recommendations for the parents that consider the family context (250-300 words)
3. Three potential next steps or resources to explore that are specific to this child's needs (150-200 words)
4. Three potential warning signs or areas to monitor closely (100-150 words)
5. A list of 5 personalized milestones that would be appropriate for this child

Format your response as a JSON object with these keys: "analysis", "recommendations", "nextSteps", "warningSignsToMonitor", "personalizedMilestones"`;

    const response = await client.getChatCompletions(deploymentName, [
      {
        role: "system",
        content:
          "You are a child development specialist providing detailed, context-aware assessment analysis.",
      },
      { role: "user", content: prompt },
    ]);

    // Get the generated content
    const generatedContent = response.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to generate valid analysis");
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    return {
      totalScore,
      maxPossibleScore,
      scorePercentage: (totalScore / maxPossibleScore) * 100,
      categoryScores,
      ...analysisData,
    };
  } catch (error) {
    console.error("Error analyzing personalized results:", error);
    throw error;
  }
};

export default {
  generatePersonalizedAssessment,
  analyzePersonalizedResults,
}; 