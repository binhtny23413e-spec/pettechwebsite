import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InteractionRouter(){
 const navigate=useNavigate();
 useEffect(()=>{
  const sync=()=>{
   document.querySelectorAll('option').forEach(option=>{if(option.textContent?.trim()==='Chim')option.remove()});
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
   while(node=walker.nextNode()){if(node.nodeValue?.includes('PetTech')||node.nodeValue?.includes('PETTECH'))node.nodeValue=node.nodeValue.replace(/PetTech/g,'PAWFECT').replace(/PETTECH/g,'PAWFECT')}
   if(location.pathname.startsWith('/admin'))document.querySelectorAll<HTMLAnchorElement>('aside a.side-link').forEach(link=>link.classList.toggle('active',new URL(link.href).pathname===location.pathname));
   if(location.pathname.startsWith('/customer'))document.querySelectorAll<HTMLAnchorElement>('aside a.side-link').forEach(link=>{const path=new URL(link.href).pathname;const exact=path===location.pathname;const petChild=path==='/customer/pets'&&location.pathname.startsWith('/customer/pets/');link.classList.toggle('active',exact||petChild)});
  };
  sync();const observer=new MutationObserver(sync);observer.observe(document.body,{childList:true,subtree:true});
  const click=(event:MouseEvent)=>{
   const anchor=(event.target as HTMLElement).closest('a.side-link');
   if(anchor&&window.location.pathname==='/admin'){
    const label=anchor.textContent?.trim()||'';
    const adminRoutes:Record<string,string>={'Khách hàng':'/admin/customers','Thú cưng':'/admin/pets','Booking':'/admin/orders','Đơn hàng':'/admin/orders','Nhân viên & Ca làm':'/admin/staff','Pet Hotel':'/admin/hotel','Kho sản phẩm':'/admin/inventory','Doanh thu':'/admin/finance','Chi phí':'/admin/expenses','Membership':'/admin/memberships','Combo':'/admin/memberships','Analytics':'/admin/analytics'};
    if(adminRoutes[label]){event.preventDefault();navigate(adminRoutes[label]);return}
   }
   const button=(event.target as HTMLElement).closest('button');if(!button)return;
   const text=button.textContent?.trim()||'';
   if(window.location.pathname==='/staff'&&text.includes('Kho sản phẩm')){event.preventDefault();navigate('/staff/inventory');return}
   if(window.location.pathname.startsWith('/staff')||window.location.pathname.startsWith('/admin'))return;
   const routes:Record<string,string>={'Thêm thú cưng':'/customer/pets/new','Đặt lịch mới':'/pricing','Hồ sơ sức khỏe':'/customer/health','Nhật ký chăm sóc':'/customer/journal','Lịch sử thanh toán':'/customer/payments','Xem nhật ký':'/customer/journal','Xem toàn màn hình':'/customer/camera','Cài đặt':'/customer/settings'};
   const exact=Object.keys(routes).find(k=>text.includes(k));if(exact){event.preventDefault();navigate(routes[exact]);return}
   if(text.includes('Chỉnh sửa')||text.includes('Xem chi tiết')){const card=button.closest('.pet-manage-card');const name=card?.querySelector('h3')?.textContent?.trim().toLowerCase()||'mochi';navigate(`/customer/pets/${name}${text.includes('Chỉnh sửa')?'/edit':''}`)}
  };
  document.addEventListener('click',click);return()=>{document.removeEventListener('click',click);observer.disconnect()};
 },[navigate]);
 return null;
}
