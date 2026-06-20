import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminGuard(){
  const location=useLocation();
  const token=localStorage.getItem('token');
  let user:any=null;
  try{user=JSON.parse(localStorage.getItem('user')||'null')}catch{}
  if(!token)return <Navigate to="/login?role=admin" replace state={{from:location.pathname}}/>;
  if(user?.role!=='ADMIN')return <Navigate to={user?.role==='STAFF'?'/staff':'/customer'} replace/>;
  return <Outlet/>;
}
