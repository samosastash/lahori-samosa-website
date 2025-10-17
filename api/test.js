// Simple test endpoint to verify Vercel API is working
export default async function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method
  });
}
