import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'organi_default_secret_key_12345';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;

