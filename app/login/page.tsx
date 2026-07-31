'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userSession = {
      email: email,
      name: 'Shawn Ginn',
      role: 'admin',
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('sideline_ro_session_v1', JSON.stringify(userSession));
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-cyan-400 font-extrabold text-2xl tracking-wider">DSAapps</span>
          <span className="text-gray-500 mx-2 font-light">|</span>
          <span className="text-white font-bold text-2xl tracking-wide">SideLine RO</span>
          <p className="text-slate-400 text-sm mt-2">Sign in to your dealership account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shawn@dsaindustriesltd.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition-colors mt-6 shadow-lg shadow-cyan-500/20"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
