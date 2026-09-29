import { useState } from 'react';
import { loginUser, registerUser } from '../services/auth';

export default function AuthPage({ onAuthSuccess }) {
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', targetRole:'Software Engineer (Backend)', degree:'B.Tech in Computer Science & Engineering', cgpa:'8.4 / 10' });
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const result = register ? await registerUser(form.name, form.email, form.password, form.targetRole, form.degree, form.cgpa) : await loginUser(form.email, form.password);
    if (result.success) onAuthSuccess(result.user, result.token);
    else setError(result.error || 'Authentication failed');
  };
  return <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-4">
    <div><p className="text-sm font-semibold text-indigo-600">MPOnline • Campus to Corporate</p><h1 className="text-3xl font-bold text-slate-900 mt-2">{register ? 'Create your profile' : 'Welcome back'}</h1><p className="text-slate-500 mt-1">AI-powered career readiness platform.</p></div>
    {register && <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full rounded-lg border p-3" />}
    <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full rounded-lg border p-3" />
    <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full rounded-lg border p-3" />
    {register && <><input placeholder="Target role" value={form.targetRole} onChange={e=>setForm({...form,targetRole:e.target.value})} className="w-full rounded-lg border p-3" /><input placeholder="Degree" value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})} className="w-full rounded-lg border p-3" /></>}
    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white">{register ? 'Create account' : 'Sign in'}</button>
    <button type="button" onClick={()=>setRegister(!register)} className="w-full text-sm text-indigo-600">{register ? 'Already have an account? Sign in' : 'Create a new account'}</button>
    {!register && <p className="text-xs text-slate-500 text-center">For local demo accounts, use the credentials configured in backend .env</p>}
  </form></div>;
}
