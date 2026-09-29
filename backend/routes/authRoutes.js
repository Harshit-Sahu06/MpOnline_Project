import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_campus_to_corporate_jwt_secret_2026';

const baseSkills = [
  { name: 'Data Structures & Algorithms', level: 75, category: 'Core CS' },
  { name: 'Java / Python', level: 70, category: 'Languages' },
  { name: 'SQL & Databases', level: 65, category: 'Backend' },
  { name: 'REST APIs', level: 60, category: 'Backend' },
  { name: 'Git & Version Control', level: 75, category: 'Tools' }
];

const USERS = [
  {
    id: 'usr_rohan',
    name: 'Rohan Sharma',
    email: 'rohan@campus.edu',
    password: 'password123',
    role: 'student',
    userTitle: 'Final Year Computer Science Student',
    degree: 'B.Tech in Computer Science & Engineering',
    year: 'Final Year (8th Sem)',
    cgpa: '8.4 / 10',
    targetRole: 'Software Engineer (Backend)',
    skills: baseSkills,
    academicHistory: [],
    resumeText: 'Rohan Sharma | Backend enthusiast | B.Tech Computer Science (8.4 CGPA).'
  },
  {
    id: 'usr_sarah',
    name: 'Sarah Jenkins',
    email: 'sarah@campus.edu',
    password: 'password123',
    role: 'student',
    userTitle: 'Senior Data Science & AI Major',
    degree: 'B.S. in Data Science & Machine Learning',
    year: 'Senior Year',
    cgpa: '9.1 / 10',
    targetRole: 'Data Scientist / AI Engineer',
    skills: baseSkills,
    academicHistory: [],
    resumeText: 'Sarah Jenkins | AI & Data Science Specialist.'
  },
  {
    id: 'usr_admin',
    name: 'Dr. Anita Verma',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    userTitle: 'Head of Training & Placement Cell',
    degree: 'Ph.D. in Computer Science',
    year: 'Faculty Administrator',
    cgpa: 'N/A',
    targetRole: 'College Placement Administrator',
    skills: [],
    academicHistory: [],
    resumeText: 'Head of Training & Placement Cell.'
  }
];

const publicUser = ({ password, ...user }) => user;
const issueToken = (user) => jwt.sign(
  { id: user.id, name: user.name, email: user.email, role: user.role, degree: user.degree, targetRole: user.targetRole },
  JWT_SECRET,
  { expiresIn: '24h' }
);

router.get('/personas', (req, res) => {
  res.json({ success: true, users: USERS.map(publicUser) });
});

router.post('/register', (req, res) => {
  const { name, email, password, targetRole, degree, cgpa } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }
  if (USERS.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ success: false, error: 'User with this email already exists' });
  }

  const user = {
    id: `usr_${Date.now()}`,
    name,
    email,
    password,
    role: 'student',
    userTitle: 'Registered Candidate',
    degree: degree || 'B.Tech in Computer Science',
    year: 'Final Year',
    cgpa: cgpa || '8.0 / 10',
    targetRole: targetRole || 'Software Engineer (Backend)',
    skills: baseSkills,
    academicHistory: [],
    resumeText: `${name} | Candidate seeking ${targetRole || 'software engineering'} opportunities.`
  };

  USERS.push(user);
  return res.status(201).json({ success: true, token: issueToken(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(
    (candidate) => candidate.email.toLowerCase() === String(email || '').toLowerCase() && candidate.password === password
  );
  if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials provided' });
  return res.json({ success: true, token: issueToken(user), user: publicUser(user) });
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = USERS.find((candidate) => candidate.id === decoded.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, valid: true, user: publicUser(user), decoded });
  } catch {
    return res.status(403).json({ success: false, valid: false, error: 'Token expired or invalid' });
  }
});

export default router;
