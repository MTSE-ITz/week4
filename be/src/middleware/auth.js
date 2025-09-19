import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const white_lists = ['/', '/register', '/login'];
  if (white_lists.find((item) => '/v1/api' + item === req.originalUrl)) {
    next();
  } else {
    if (req?.headers?.authorization?.split(' ')?.[1]) {
      const token = req.headers.authorization.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          createdBy: 'dopamine',
        };

        console.log('>>> check token: ', decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: 'Invalid or expired token',
        });
      }
    } else {
      return res.status(401).json({
        message: 'Invalid or no access token provided',
      });
    }
  }
};

export default auth;
