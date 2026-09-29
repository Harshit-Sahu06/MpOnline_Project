import { useEffect,useState } from 'react';

export default function AdminDashboard({ onSelectStudent }) {
  const [users,setUsers]=useState([]);
  useEffect(()=>{
    fetch((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+'/auth/personas')
      .then(r=>r.json()).then(d=>setUsers((d.users||[]).filter(x=>x.role==='student'))).catch(()=>{});
  },[]);
  return <div className="space-y-6">
    <div><p className="text-sm text-indigo-600 font-semibold">Placement cell</p><h2 className="text-3xl font-bold">Admin analytics</h2><p className="text-slate-500">Monitor candidate readiness and profiles.</p></div>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Students</p><p className="text-4xl font-bold">{users.length}</p></div>
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">Career profiles</p><p className="text-4xl font-bold">{users.filter(x=>x.targetRole).length}</p></div>
      <div className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">AI platform</p><p className="text-4xl font-bold">Ready</p></div>
    </div>
    <div className="rounded-2xl border bg-white p-5"><h3 className="font-bold mb-3">Students</h3>{users.map(user=><button key={user.id} onClick={()=>onSelectStudent(user)} className="w-full flex justify-between border-b py-3 text-left px-2 hover:bg-slate-50"><span><b>{user.name}</b><span className="block text-sm text-slate-500">{user.targetRole}</span></span><span className="text-indigo-600">Open →</span></button>)}</div>
  </div>;
}
