'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const DIETS = ['Vegetarian','Non-Vegetarian','Vegan','Jain','Keto','Paleo'] as const;

export default function Home() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    diet: DIETS[0],
    allergies: '',
    goal: ''
  });
  const [msg, setMsg] = useState<string | null>(null);

  async function register() {
    setMsg(null);
    // 1) Create auth user
    const { data: auth, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });
    if (authErr || !auth.user) { setMsg(authErr?.message || 'Sign up failed'); return; }

    // 2) Create profile row for the signed up user
    const { error: profErr } = await supabase.from('profiles').insert({
      id: auth.user.id,
      full_name: form.full_name,
      diet: form.diet,
      allergies: form.allergies
        ? form.allergies.split(',').map(a => a.trim())
        : [],
      goal: form.goal
    });
    if (profErr) { setMsg(profErr.message); return; }

    setMsg('Success! Check your email for verification (from Supabase).');
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] text-[#1b1f28]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">NutriFlow</h1>
        <p className="text-gray-600 mt-2">Personalised diets & schedules for every lifestyle.</p>

        {/* Register */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border bg-white">
            <h2 className="text-lg font-semibold">Create your account</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <input className="col-span-2 md:col-span-1 border rounded-xl px-3 py-2"
                placeholder="Full name"
                value={form.full_name}
                onChange={e=>setForm({...form, full_name:e.target.value})}
              />
              <input className="col-span-2 md:col-span-1 border rounded-xl px-3 py-2"
                placeholder="Email"
                value={form.email}
                onChange={e=>setForm({...form, email:e.target.value})}
              />
              <input type="password" className="col-span-2 md:col-span-1 border rounded-xl px-3 py-2"
                placeholder="Password"
                value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})}
              />
              <select className="col-span-2 md:col-span-1 border rounded-xl px-3 py-2"
                value={form.diet}
                onChange={e=>setForm({...form, diet:e.target.value as any})}
              >
                {DIETS.map(d => <option key={d}>{d}</option>)}
              </select>
              <input className="col-span-2 border rounded-xl px-3 py-2"
                placeholder="Allergies (comma-separated)"
                value={form.allergies}
                onChange={e=>setForm({...form, allergies:e.target.value})}
              />
              <input className="col-span-2 border rounded-xl px-3 py-2"
                placeholder="Goal (e.g., fat loss)"
                value={form.goal}
                onChange={e=>setForm({...form, goal:e.target.value})}
              />
              <button onClick={register}
                className="col-span-2 py-3 rounded-xl font-semibold text-white"
                style={{background:'#5b7cfa'}}
              >Register</button>
            </div>
            {msg && <p className="mt-3 text-sm">{msg}</p>}
          </div>

          {/* Sample plans (static for now) */}
          <div className="p-6 rounded-2xl border bg-white">
            <h3 className="font-semibold">Sample Diet Types</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
              {DIETS.map(d => <li key={d} className="border rounded-xl px-3 py-2">{d}</li>)}
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              After sign up, we’ll save your preferences and show matching weekly meal & activity schedules.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
