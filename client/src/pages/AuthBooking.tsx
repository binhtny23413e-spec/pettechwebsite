import { FormEvent, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, PawPrint, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { serviceData } from './CommercePages';

export function Login({register=false}:{register?:boolean}) {
  const nav=useNavigate();
  const [form,setForm]=useState({name:'',phone:'',email:register?'':'customer@pettech.vn',password:register?'':'123456',confirm:''});
  const [error,setError]=useState('');
  const submit=async(e:FormEvent)=>{e.preventDefault();setError('');try{const data=await api(register?'/auth/register':'/auth/login',{method:'POST',body:JSON.stringify(form)});localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user));nav('/'+data.user.role.toLowerCase())}catch(e:any){setError(e.message)}};
  return <section className="auth-page"><div className="auth-art"><Link to="/" className="auth-logo"><PawPrint/> PetTech</Link><div><span>CHĂM SÓC THÔNG MINH</span><h2>Luôn gần bé,<br/>dù bạn ở đâu.</h2><p>Theo dõi sức khỏe, lịch hẹn và mọi khoảnh khắc của người bạn nhỏ.</p></div></div><form className="auth-form" onSubmit={submit}><div><span className="eyebrow">CHÀO MỪNG BẠN</span><h1>{register?'Tạo tài khoản':'Đăng nhập PetTech'}</h1><p>{register?'Bắt đầu hành trình chăm sóc thông minh.':'Quản lý mọi điều bé cần trong một nơi.'}</p></div>{register&&<><label>Họ và tên<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Số điện thoại<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label></>}<label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Mật khẩu<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{register&&<label>Xác nhận mật khẩu<input type="password" required value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/></label>}{error&&<p className="form-error">{error}</p>}<button className="btn primary" type="submit">{register?'Đăng ký':'Đăng nhập'}<ChevronRight/></button><p className="auth-switch">{register?'Đã có tài khoản?':'Chưa có tài khoản?'} <Link to={register?'/login':'/register'}>{register?'Đăng nhập':'Đăng ký ngay'}</Link></p><small className="demo-note">Demo: admin@pettech.vn / staff@pettech.vn / customer@pettech.vn — mật khẩu 123456</small></form></section>
}

const times=['08:00','09:30','11:00','13:30','15:00','16:30'];
const numberPrice=(text:string)=>Number((text.match(/[\d.]+/)?.[0]||'0').replace(/\./g,''));
const money=(value:number)=>`${value.toLocaleString('vi-VN')}đ`;
type TierName='Silver'|'Gold'|'Premium';

function OrderSummary({subtotal,vat,total,compact=false}:{subtotal:number,vat:number,total:number,compact?:boolean}) {
  return <div className={`order-summary ${compact?'compact':''}`}><p><span>Tiền dịch vụ</span><b>{money(subtotal)}</b></p><p><span>Thuế VAT (8%)</span><b>{money(vat)}</b></p><p className="grand-total"><span>Tổng cộng</span><b>{money(total)}</b></p></div>
}

export function Booking(){
  const [params]=useSearchParams();
  const incoming=serviceData.find(s=>s.slug===params.get('service'));
  const incomingTier=(['Silver','Gold','Premium'].includes(params.get('tier')||'')?params.get('tier'):'Silver') as TierName;
  const initial=incoming?{[incoming.name]:incomingTier}:{'Grooming':'Silver' as TierName};
  const [step,setStep]=useState(1);
  const [selected,setSelected]=useState<Record<string,TierName>>(initial);
  const [data,setData]=useState({petType:'Mèo',pet:'Mochi · Scottish Fold',date:'2026-06-20',time:'09:30',note:'',method:'MoMo'});
  const [hotelDays,setHotelDays]=useState(1);
  const [done,setDone]=useState(false);
  const subtotal=useMemo(()=>serviceData.reduce((sum,s)=>{const tier=selected[s.name];if(!tier)return sum;const item=s.tiers.find(t=>t[0]===tier);const multiplier=s.name==='Pet Hotel'?hotelDays:1;return sum+numberPrice(item?.[1]||'0')*multiplier},0),[selected,hotelDays]);
  const vat=Math.round(subtotal*0.08);
  const grandTotal=subtotal+vat;
  const choose=(name:string)=>setSelected(old=>old[name]?Object.fromEntries(Object.entries(old).filter(([k])=>k!==name)):{...old,[name]:'Silver'});
  const setTier=(name:string,tier:TierName)=>setSelected(old=>({...old,[name]:tier}));
  const lines=serviceData.filter(s=>selected[s.name]).map(s=>`${s.name} ${selected[s.name]}${s.name==='Pet Hotel'?` · ${hotelDays} ngày`:''}`);
  const finish=async()=>{try{await api('/bookings',{method:'POST',body:JSON.stringify({...data,service:lines.join(', '),hotelDays,subtotal,vat,totalPrice:grandTotal})})}catch{}setDone(true)};

  if(done)return <section className="booking-page success"><div className="success-icon"><CheckCircle2/></div><span>ĐẶT LỊCH THÀNH CÔNG</span><h1>Hẹn gặp {data.pet.split(' · ')[0]} tại PetTech!</h1><p>Mã lịch hẹn <b>#PT-260620</b> đã được gửi tới email của bạn.</p><div className="confirm-card"><p><span>Dịch vụ</span><b>{lines.join(' + ')}</b></p><p><span>Thời gian</span><b>{data.time} · {data.date}</b></p><OrderSummary subtotal={subtotal} vat={vat} total={grandTotal}/><p><span>Thanh toán</span><b>Đã thanh toán · {data.method}</b></p></div><Link className="btn primary" to="/customer">Về trang quản lý</Link></section>;

  return <section className="booking-page"><div className="booking-head"><span>ĐẶT LỊCH TRỰC TUYẾN</span><h1>Chọn đúng gói cho từng dịch vụ</h1><p>Mỗi dịch vụ có thể chọn Silver, Gold hoặc Premium riêng; tổng tiền cập nhật tức thì.</p></div><div className="steps">{['Dịch vụ & cấp gói','Thời gian','Thanh toán','Xác nhận'].map((x,i)=><div className={step>=i+1?'active':''} key={x}><i>{step>i+1?<CheckCircle2/>:i+1}</i><span>{x}</span></div>)}</div><div className="booking-card booking-wide">
    {step===1&&<><h2>Chọn dịch vụ và cấp độ chăm sóc</h2><div className="booking-tier-services">{serviceData.slice(0,5).map(s=>{const I=s.icon;const active=!!selected[s.name];return <div className={active?'booking-service-row selected':'booking-service-row'} key={s.name}><button className="service-toggle" onClick={()=>choose(s.name)}><I/><span><b>{s.name}</b><small>{s.duration}</small></span><i>{active?'✓':'+'}</i></button>{active&&<><div className="tier-picker">{s.tiers.map(t=><button className={selected[s.name]===t[0]?'active':''} onClick={()=>setTier(s.name,t[0] as TierName)} key={t[0]}><span>{t[0]}</span><b>{t[1]}</b><small>{t[2]}</small></button>)}</div>{s.name==='Pet Hotel'&&<div className="hotel-days-picker"><div><b>Số ngày lưu trú</b><small>Giá Pet Hotel được tính theo ngày</small></div><div><button onClick={()=>setHotelDays(Math.max(1,hotelDays-1))}>−</button><input type="number" min="1" max="30" value={hotelDays} onChange={e=>setHotelDays(Math.max(1,Math.min(30,Number(e.target.value)||1)))}/><button onClick={()=>setHotelDays(Math.min(30,hotelDays+1))}>+</button><span>ngày</span></div></div>}</>}</div>})}</div><div className="booking-running-total"><span>{Object.keys(selected).length} dịch vụ · {lines.join(', ')}</span><b>{money(subtotal)}</b></div><OrderSummary compact subtotal={subtotal} vat={vat} total={grandTotal}/><div className="pet-select"><label>Loại thú cưng<select value={data.petType} onChange={e=>setData({...data,petType:e.target.value,pet:e.target.value==='Chó'?'Bella · Poodle':e.target.value==='Mèo'?'Mochi · Scottish Fold':`${e.target.value} của tôi`})}><option>Mèo</option><option>Chó</option><option>Chim</option><option>Thỏ</option><option>Khác</option></select></label><label>Chọn bé / giống<select value={data.pet} onChange={e=>setData({...data,pet:e.target.value})}>{data.petType==='Mèo'?<><option>Mochi · Scottish Fold</option><option>Bông · Mèo Anh lông ngắn</option><option>Mèo khác</option></>:data.petType==='Chó'?<><option>Bella · Poodle</option><option>Milo · Corgi</option><option>Chó khác</option></>:<option>{data.petType} của tôi</option>}</select></label></div></>}
    {step===2&&<><h2>Chọn ngày và giờ</h2><label>Ngày hẹn<input type="date" value={data.date} onChange={e=>setData({...data,date:e.target.value})}/></label><p className="label">Khung giờ còn trống</p><div className="time-grid">{times.map(x=><button className={data.time===x?'selected':''} onClick={()=>setData({...data,time:x})} key={x}>{x}</button>)}</div><label>Ghi chú đặc biệt<textarea value={data.note} onChange={e=>setData({...data,note:e.target.value})}/></label></>}
    {step===3&&<><h2>Thanh toán an toàn</h2><OrderSummary subtotal={subtotal} vat={vat} total={grandTotal}/>{['MoMo','ZaloPay','Thẻ ngân hàng','Tiền mặt tại cửa hàng'].map(x=><label className="payment-option" key={x}><input type="radio" checked={data.method===x} onChange={()=>setData({...data,method:x})}/><CreditCard/><span>{x}</span></label>)}<p className="secure"><ShieldCheck/> Đây là thanh toán mô phỏng, không phát sinh giao dịch thật.</p></>}
    {step===4&&<><h2>Xác nhận thông tin</h2><div className="review">{[['Thú cưng',`${data.petType} · ${data.pet}`],['Dịch vụ & cấp gói',lines.join(' + ')],['Ngày & giờ',`${data.date} · ${data.time}`],['Thanh toán',data.method]].map(x=><p key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></p>)}</div><OrderSummary subtotal={subtotal} vat={vat} total={grandTotal}/></>}
    <div className="booking-actions">{step>1&&<button className="btn outline" onClick={()=>setStep(step-1)}><ChevronLeft/> Quay lại</button>}<button disabled={step===1&&lines.length===0} className="btn primary" onClick={()=>step===4?finish():setStep(step+1)}>{step===4?'Xác nhận & thanh toán':'Tiếp tục'}<ChevronRight/></button></div>
  </div></section>
}
