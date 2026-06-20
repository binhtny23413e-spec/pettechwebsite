import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function CustomerGuard(){
  const location=useLocation();
  const token=localStorage.getItem('token');
  let user:any=null;
  try{user=JSON.parse(localStorage.getItem('user')||'null')}catch{}
  if(!token)return <Navigate to="/login" replace state={{from:location.pathname}}/>;
  if(user?.role&&user.role!=='CUSTOMER')return <Navigate to={`/${String(user.role).toLowerCase()}`} replace/>;
  return <Outlet/>;
}
