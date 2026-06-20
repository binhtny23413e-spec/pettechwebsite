import { MouseEvent, ReactNode, useState } from 'react';
import { ArrowRight, PawPrint, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useCart } from './CartContext';

export const Img=({src,alt,className=''}:{src:string,alt:string,className?:string})=><img src={src} alt={alt} className={className} loading="lazy" onError={e=>{const img=e.currentTarget;img.onerror=null;img.src=alt.toLowerCase().includes('bella')?'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=85':'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=85'}}/>;
export function SectionTitle({eyebrow,title,desc,center=true}:{eyebrow?:string;title:string;desc?:string;center?:boolean}){return <div className={`section-title ${center?'center':''}`}>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{desc&&<p>{desc}</p>}</div>}

export function Button({to,children,variant='primary'}:{to:string;children:ReactNode;variant?:string}){
  const {addItem}=useCart();
  const [hotelPackage,setHotelPackage]=useState<null|{id:string;name:string;variant:string;price:number;description:string}>(null);
  const [hotelDates,setHotelDates]=useState({checkIn:'2026-06-20',checkOut:'2026-06-21'});
  const hotelDays=Math.max(1,Math.round((new Date(hotelDates.checkOut).getTime()-new Date(hotelDates.checkIn).getTime())/86400000));
  const parsePrice=(text:string)=>Number((text.match(/[\d.,]+/)?.[0]||'0').replace(/[.,]/g,''));
  const addCommerceItem=(e:MouseEvent<HTMLAnchorElement>)=>{
    if(to!=='/booking')return;
    if(!localStorage.getItem('token'))return;
    const el=e.currentTarget;
    const combo=el.closest('.combo');
    const term=el.closest('.term-options article');
    const tier=el.closest('.tier');
    const priceTier=el.closest('.pricing-tiers>div');
    const hero=el.closest('.service-detail-hero');
    if(hero)return;
    let name='',itemVariant='',price=0,description='';
    if(combo){name=combo.querySelector('h3')?.textContent||'Combo PAWFECT';itemVariant='Combo';price=parsePrice(combo.querySelector('div b')?.textContent||'0');description=combo.querySelector('p')?.textContent||''}
    else if(term){name='Gói Chăm Sóc Tiêu Chuẩn';itemVariant=term.querySelector('span')?.textContent||'';price=parsePrice(term.querySelector('b')?.textContent||'0');description=term.querySelector('p')?.textContent||'Gói đăng ký theo kỳ'}
    else if(tier){name=document.querySelector('.service-detail-hero h1')?.textContent||'Dịch vụ';itemVariant=tier.querySelector('h3')?.textContent||'Silver';price=parsePrice(tier.querySelector(':scope > b')?.textContent||'0');description=tier.querySelector(':scope > p')?.textContent||''}
    else if(priceTier){name=priceTier.closest('.pricing-service')?.querySelector('.pricing-name h3')?.textContent?.replace('Bảng giá dịch vụ ','')||'Dịch vụ';itemVariant=priceTier.querySelector('span')?.textContent||'Silver';price=parsePrice(priceTier.querySelector('b')?.textContent||'0');description=priceTier.querySelector('p')?.textContent||''}
    else return;
    e.preventDefault();
    const item={id:`${name}-${itemVariant}`.toLowerCase().replace(/\s+/g,'-'),name,variant:itemVariant,price,description};
    if(name==='Pet Hotel'){setHotelPackage(item);return}
    addItem(item);
  };
  const confirmHotel=()=>{if(!hotelPackage)return;addItem({...hotelPackage,quantity:hotelDays,hotelCheckIn:hotelDates.checkIn,hotelCheckOut:hotelDates.checkOut});setHotelPackage(null)};
  const hotelModal=hotelPackage?<div className="hotel-package-modal" onClick={()=>setHotelPackage(null)}><div onClick={e=>e.stopPropagation()}><button className="hotel-modal-close" onClick={()=>setHotelPackage(null)}>×</button><span>ĐẶT PHÒNG PET HOTEL</span><h2>{hotelPackage.variant} · {hotelPackage.price.toLocaleString('vi-VN')}đ/ngày</h2><p>{hotelPackage.description}</p><div className="hotel-modal-dates"><label>Ngày nhận bé<input type="date" value={hotelDates.checkIn} onChange={e=>setHotelDates({...hotelDates,checkIn:e.target.value})}/></label><i>→</i><label>Ngày trả bé<input type="date" min={hotelDates.checkIn} value={hotelDates.checkOut} onChange={e=>setHotelDates({...hotelDates,checkOut:e.target.value})}/></label></div><div className="hotel-modal-total"><span>Thời gian lưu trú<b>{hotelDays} ngày</b></span><span>Tiền dịch vụ<b>{(hotelPackage.price*hotelDays).toLocaleString('vi-VN')}đ</b></span><span>VAT 8%<b>{Math.round(hotelPackage.price*hotelDays*.08).toLocaleString('vi-VN')}đ</b></span><strong>Tổng cộng <b>{Math.round(hotelPackage.price*hotelDays*1.08).toLocaleString('vi-VN')}đ</b></strong></div><button className="btn primary hotel-confirm" onClick={confirmHotel}>Thêm {hotelDays} ngày vào giỏ hàng <ArrowRight size={17}/></button></div></div>:null;
  return <><Link className={`btn ${variant}`} to={to} onClick={addCommerceItem}>{children}<ArrowRight size={17}/></Link>{hotelModal&&createPortal(hotelModal,document.body)}</>;
}
export function PriceCard({name,price,features,featured}:{name:string;price:string;features:string[];featured?:boolean}){return <div className={`price-card ${featured?'featured':''}`}>{featured&&<span className="popular">Phổ biến nhất</span>}<div className="plan-icon"><PawPrint/></div><h3>{name}</h3><div className="price">{price}<small>/tháng</small></div><ul>{features.map(x=><li key={x}><Check size={17}/>{x}</li>)}</ul><Button to="/booking" variant={featured?'primary':'outline'}>Chọn gói</Button></div>}
export const Rating=()=> <div className="rating"><span className="avatars">🐶 🐱 🐕</span><span><b>4.9/5</b><br/><i><Star size={13} fill="currentColor"/> 1.200+ chủ nuôi tin chọn</i></span></div>;
