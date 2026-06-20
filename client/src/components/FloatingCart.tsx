import { ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';

export default function FloatingCart(){
  const {count}=useCart();
  const {pathname}=useLocation();
  let user=null;try{user=JSON.parse(localStorage.getItem('user')||'null')}catch{}
  if(!localStorage.getItem('token')||user?.role!=='CUSTOMER'||pathname.startsWith('/admin')||pathname.startsWith('/staff'))return null;
  return <Link className="floating-cart" to="/cart" title="Mở giỏ hàng">
    <ShoppingBag/><span>Giỏ hàng</span>{count>0&&<b>{count}</b>}
  </Link>;
}
