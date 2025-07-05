import { split, toString , pipe } from 'ramda';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Red Calendar Editor Access"');
      return res.status(401).send('Authentication required');
    }
    const credentials = pipe(
        Buffer.from,
        toString,
    )(split(' ', authHeader)[1], 'base64');
    const [username, password] = split(':', credentials);
    
    const validUsername = process.env.EDITOR_USERNAME || 'editor';
    const validPassword = process.env.EDITOR_PASSWORD || 'redcalendar2025';
    
    if (username === validUsername && password === validPassword) {
      next();
    } else {
      res.setHeader('WWW-Authenticate', 'Basic realm="Red Calendar Editor Access"');
      res.status(401).send('Invalid credentials');
    }
  };
