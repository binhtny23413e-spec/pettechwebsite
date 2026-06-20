import { Navigate, Outlet, useLocation } from 'react-router-dom';
export default function StaffGuard(){const location=useLocation();const token=localStorage.getItem('token');let user:any=null;try{user=JSON.parse(localStorage.getItem('user')||'null')}catch{}if(!token||user?.role!=='STAFF')return <Navigate to="/login?role=staff" replace state={{from:location.pathname}}/>;return <Outlet/>}
