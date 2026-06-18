const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export async function api(path:string, options:RequestInit={}) {
  const token=localStorage.getItem('token');
  const res=await fetch(BASE+path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers}});
  const data=await res.json(); if(!res.ok) throw new Error(data.message||'Có lỗi xảy ra'); return data;
}
