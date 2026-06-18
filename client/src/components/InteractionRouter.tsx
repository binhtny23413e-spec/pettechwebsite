import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InteractionRouter(){
 const navigate=useNavigate();
 useEffect(()=>{
  const removeBirdOptions=()=>document.querySelectorAll('option').forEach(option=>{if(option.textContent?.trim()==='Chim')option.remove()});
  removeBirdOptions();
  const observer=new MutationObserver(removeBirdOptions);
  observer.observe(document.body,{childList:true,subtree:true});
  const click=(event:MouseEvent)=>{
   const anchor=(event.target as HTMLElement).closest('a.side-link');
   if(anchor&&window.location.pathname==='/admin'){
    const label=anchor.textContent?.trim()||'';
    const adminRoutes:Record<string,string>={'Khách hàng':'/admin/customers','Thú cưng':'/admin/pets','Booking':'/admin/orders','Doanh thu':'/admin/finance','Membership':'/admin/memberships','Analytics':'/admin/analytics'};
    if(adminRoutes[label]){event.preventDefault();navigate(adminRoutes[label]);return}
   }
   const button=(event.target as HTMLElement).closest('button');
   if(!button)return;
   const text=button.textContent?.trim()||'';
   const routes:Record<string,string>={'Thêm thú cưng':'/customer/pets/new','Đặt lịch mới':'/booking','Hồ sơ sức khỏe':'/customer/health','Nhật ký chăm sóc':'/customer/journal','Lịch sử thanh toán':'/customer/payments','Xem nhật ký':'/customer/journal','Xem toàn màn hình':'/customer/camera','Cài đặt':'/customer/settings'};
   const exact=Object.keys(routes).find(k=>text.includes(k));
   if(exact){event.preventDefault();navigate(routes[exact]);return}
   if(text.includes('Chỉnh sửa')||text.includes('Xem chi tiết')){const card=button.closest('.pet-manage-card');const name=card?.querySelector('h3')?.textContent?.trim().toLowerCase()||'mochi';navigate(`/customer/pets/${name}${text.includes('Chỉnh sửa')?'/edit':''}`)}
  };
  document.addEventListener('click',click);return()=>{document.removeEventListener('click',click);observer.disconnect()}
 },[navigate]);
 return null
}
