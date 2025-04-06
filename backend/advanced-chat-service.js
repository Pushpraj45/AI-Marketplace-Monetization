// Advanced Azure OpenAI Chat Service
require('dotenv').config();
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const https = require("https");

// Set up Azure OpenAI credentials
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

// Utility functions to extract information from user input
// These are based on the working example provided

/**
 * Extracts lead details from user input.
 * @param {string} userInput - User's message
 * @returns {Object} - Extracted lead information
 */
const extractLeadInfo = (userInput) => {
  const nameMatch = userInput.match(/lead for (\w+)\s+(\w+)/i);
  const emailMatch = userInput.match(/email\s+(\S+@\S+)/i);
  const phoneMatch = userInput.match(/phone\s+(\+?\d{10,15})/i);
  
  const firstname = nameMatch ? nameMatch[1] : null;
  const lastname = nameMatch ? nameMatch[2] : null;
  const email = emailMatch 
    ? emailMatch[1] 
    : (firstname && lastname ? `${firstname.toLowerCase()}.${lastname.toLowerCase()}@example.com` : null);
  const phone = phoneMatch ? phoneMatch[1] : null;
  
  return { firstname, lastname, email, phone };
};

/**
 * Extracts update information from user input.
 * @param {string} userInput - User's message
 * @returns {Object} - Extracted update information
 */
const extractUpdateInfo = (userInput) => {
  const match = userInput.match(/update (\w+)\s+(\w+)'s\s+(\w+)\s+to\s+(\S+)/i);
  
  if (match) {
    const [_, firstname, lastname, field, value] = match;
    const lowerField = field.toLowerCase();
    
    if (lowerField === "phone" || lowerField === "email") {
      return { firstname, lastname, updateField: { [lowerField]: value } };
    }
  }
  
  return { firstname: null, lastname: null, updateField: null };
};

/**
 * Extracts lead retrieval information from user input.
 * @param {string} userInput - User's message
 * @returns {Object} - Extracted lead retrieval information
 */
const extractLeadRetrieval = (userInput) => {
  const match = userInput.match(
    /(?:phone number|email|lead details|contact details|meeting details|upcoming meeting)\s*(?:of|for)?\s*([\w]+)\s+([\w]+)/i
  );
  
  if (match) {
    const [_, firstname, lastname] = match;
    return { firstname, lastname };
  }
  
  return { firstname: null, lastname: null };
};

/**
 * Extracts meeting information from user input.
 * @param {string} userInput - User's message
 * @returns {Object} - Extracted meeting information
 */
const extractMeetingInfo = (userInput) => {
  const nameMatch = userInput.match(/meeting for (\w+)\s+(\w+)/i);
  if (!nameMatch) return { firstname: null, lastname: null, googleMeetLink: null, meetingTime: null, reminderTime: null };
  
  const [_, firstname, lastname] = nameMatch;
  const meetLinkMatch = userInput.match(/google meet[:\s]+(\S+)/i);
  const googleMeetLink = meetLinkMatch ? meetLinkMatch[1] : null;
  
  const meetingTimeMatch = userInput.match(/meeting (?:at|on)[\s:]+([\d\-\:T]+)/i);
  const meetingTime = meetingTimeMatch ? meetingTimeMatch[1] : null;
  
  const reminderTimeMatch = userInput.match(/reminder (?:at|on)[\s:]+([\d\-\:T]+)/i);
  const reminderTime = reminderTimeMatch ? reminderTimeMatch[1] : null;
  
  return { firstname, lastname, googleMeetLink, meetingTime, reminderTime };
};

/**
 * Chat with the Azure OpenAI model
 * @param {string} userInput - The user's message to the chatbot
 * @returns {Promise<string>} - The chatbot's response
 */
const chatWithBot = async (userInput) => {
  try {
    const lowerInput = userInput.toLowerCase();
    
    // Handle different types of requests based on user input
    // In a real implementation, these would connect to actual services
    
    // Create a lead
    if (lowerInput.includes("create a lead")) {
      const { firstname, lastname, email, phone } = extractLeadInfo(userInput);
      
      if (firstname && lastname && email && phone) {
        // This would call a lead creation service in a real implementation
        return `✅ Lead created successfully for ${firstname} ${lastname} with email ${email} and phone ${phone}`;
      } else {
        return "❌ Missing information! Please provide full name, email, and a valid phone number.";
      }
    }
    
    // Update a lead
    if (lowerInput.includes("update")) {
      const { firstname, lastname, updateField } = extractUpdateInfo(userInput);
      
      if (firstname && updateField) {
        // This would call a lead update service in a real implementation
        return `✅ Updated ${firstname} ${lastname}'s information: ${JSON.stringify(updateField)}`;
      } else {
        return "❌ Could not process update request. Please use the format: update [FirstName LastName]'s [phone/email] to [value].";
      }
    }
    
    // Retrieve lead info
    if (lowerInput.includes("phone number") || lowerInput.includes("email") || 
        lowerInput.includes("lead details") || lowerInput.includes("contact details")) {
      const { firstname, lastname } = extractLeadRetrieval(userInput);
      
      if (firstname && lastname) {
        // This would call a lead retrieval service in a real implementation
        if (lowerInput.includes("phone")) {
          return `📞 ${firstname} ${lastname}'s Phone: +1234567890 (sample)`;
        } else if (lowerInput.includes("email")) {
          return `📧 ${firstname} ${lastname}'s Email: ${firstname.toLowerCase()}.${lastname.toLowerCase()}@example.com (sample)`;
        } else {
          return `📌 Lead Details for ${firstname} ${lastname}:\nEmail: ${firstname.toLowerCase()}.${lastname.toLowerCase()}@example.com (sample)\nPhone: +1234567890 (sample)`;
        }
      } else {
        return "❌ Invalid request format for lead retrieval.";
      }
    }
    
    // Schedule a meeting
    if (lowerInput.includes("schedule meeting")) {
      const { firstname, lastname, googleMeetLink, meetingTime, reminderTime } = extractMeetingInfo(userInput);
      
      if (firstname && lastname && googleMeetLink && meetingTime && reminderTime) {
        // This would call a meeting scheduling service in a real implementation
        return `✅ Meeting scheduled successfully for ${firstname} ${lastname} at ${meetingTime} with reminder at ${reminderTime}!`;
      } else {
        return "❌ Missing or incorrect meeting details. Please provide name, Google Meet link, meeting time, and reminder time.";
      }
    }
    
    // Meeting details
    if (lowerInput.includes("meeting details") || lowerInput.includes("upcoming meeting")) {
      const { firstname, lastname } = extractLeadRetrieval(userInput);
      
      if (firstname && lastname) {
        // This would call a meeting details service in a real implementation
        return `📅 Meeting Details for ${firstname} ${lastname}:\nGoogle Meet Link: https://meet.google.com/sample-link\nMeeting Time: 2023-06-15T15:00 (sample)\nReminder Time: 2023-06-15T14:45 (sample)`;
      } else {
        return "❌ Invalid request format for meeting details.";
      }
    }
    
    // Default: use Azure OpenAI for general conversation
    const response = await client.getChatCompletions(deploymentName, [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userInput }
    ]);

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error chatting with Azure OpenAI:", error);
    throw error;
  }
};

module.exports = {
  chatWithBot
}; 