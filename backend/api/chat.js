import simpleMentalHealthML from './SimpleMentalHealthML';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Analyze message
    const analysis = await simpleMentalHealthML.analyzeMessage(message);
    
    // Generate response
    const response = await simpleMentalHealthML.generateResponse(message, analysis);

    // Return response
    res.status(200).json({
      response,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error. Please try again.',
      message: "I'm having trouble processing your message right now. Please try again in a moment."
    });
  }
}