
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();
const PORT = process.env.PORT || 7860;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Authorization middleware.
const jwtCheck = auth({
  audience: 'https://aibankinguniversity.us.auth0.com/api/v2/', // Updated to standard Auth0 audience or your specific API identifier
  issuerBaseURL: 'https://aibankinguniversity.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// Enforce on API routes (example pattern)
app.use('/api', jwtCheck);

// Protected endpoint
app.get('/api/authorized', (req, res) => {
    res.json({ message: 'Secured Resource Accessed Successfully' });
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all other routes by serving the index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on https://0.0.0.0:${PORT}`);
});
