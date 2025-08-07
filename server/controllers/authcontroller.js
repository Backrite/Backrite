import User from '../models/User.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const token = sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

export default { register, login };
