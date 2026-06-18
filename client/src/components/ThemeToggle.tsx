import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme='light'|'dark';
export default function ThemeToggle(){const [theme,setTheme]=useState<Theme>(()=>(localStorage.getItem('pettech-theme') as Theme)||'light');useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('pettech-theme',theme)},[theme]);return <button className="theme-toggle" onClick={()=>setTheme(theme==='light'?'dark':'light')} aria-label={theme==='light'?'Bật chế độ tối':'Bật chế độ sáng'} title={theme==='light'?'Chuyển sang chế độ tối':'Chuyển sang chế độ sáng'}>{theme==='light'?<Moon/>:<Sun/>}<span>{theme==='light'?'Tối':'Sáng'}</span></button>}
