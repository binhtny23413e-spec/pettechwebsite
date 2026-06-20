import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, Minus, PawPrint, Plus, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { api } from '../services/api';

const money=(value:number)=>`${value.toLocaleString('vi-VN')}đ`;
const times=['08:00','09:30','11:00','13:30','15:00','16:30'];

function Totals({subtotal}:{subtotal:number}){
  const vat=Math.round(subtotal*.08);
  return <div className="cart-totals">
    <p><span>Tổng tiền dịch vụ</span><b>{money(subtotal)}</b></p>
    <p><span>Thuế VAT (8%)</span><b>{money(vat)}</b></p>
    <p className="cart-grand"><span>Tổng cộng</span><b>{money(subtotal+vat)}</b></p>
  </div>;
}

export default function CartPage(){
  const {items,count,setQuantity,removeItem,clear}=useCart();
  const [step,setStep]=useState(1);
  const [data,setData]=useState({petType:'Mèo',pet:'Mochi · Scottish Fold',date:'2026-06-20',time:'09:30',note:'',method:'MoMo'});
  const [checkoutError,setCheckoutError]=useState('');
  const [hotelStay,setHotelStay]=useState({checkIn:'2026-06-20',checkOut:'2026-06-21'});
  const [confirmation,setConfirmation]=useState<null|{code:string;subtotal:number;vat:number;total:number;lines:string[]}>(null);
  const subtotal=useMemo(()=>items.reduce((sum,item)=>sum+item.price*item.quantity,0),[items]);
  const vat=Math.round(subtotal*.08);
  const total=subtotal+vat;
  const hotelItems=items.filter(item=>item.name==='Pet Hotel');
  const hotelDays=Math.max(1,Math.round((new Date(hotelStay.checkOut).getTime()-new Date(hotelStay.checkIn).getTime())/86400000));
  const changeHotelDate=(field:'checkIn'|'checkOut',value:string)=>{const next={...hotelStay,[field]:value};setHotelStay(next);const days=Math.round((new Date(next.checkOut).getTime()-new Date(next.checkIn).getTime())/86400000);if(days>0){hotelItems.forEach(item=>setQuantity(item.id,days));setData(old=>({...old,date:next.checkIn}))}};

  const finish=async()=>{
    setCheckoutError('');
    if(!localStorage.getItem('token')){setCheckoutError('Vui lòng đăng nhập trước khi xác nhận để đơn hàng được đồng bộ sang trang quản trị.');return}
    const lines=items.map(item=>`${item.name} · ${item.variant} × ${item.quantity}${item.name==='Pet Hotel'?` ngày (${hotelStay.checkIn} → ${hotelStay.checkOut})`:''}`);
    const snapshot={code:`PF-${Date.now().toString().slice(-6)}`,subtotal,vat,total,lines};
    try{await api('/bookings',{method:'POST',body:JSON.stringify({...data,service:lines.join(', '),subtotal,vat,totalPrice:total,hotelCheckIn:hotelItems.length?hotelStay.checkIn:null,hotelCheckOut:hotelItems.length?hotelStay.checkOut:null,hotelDays:hotelItems.length?hotelDays:null})})}catch(e:any){setCheckoutError(e.message||'Chưa thể tạo đơn hàng. Vui lòng thử lại.');return}
    setConfirmation(snapshot); clear();
  };

  if(confirmation)return <main className="cart-page cart-success"><div className="cart-success-card">
    <CheckCircle2/><span>ĐẶT DỊCH VỤ THÀNH CÔNG</span><h1>Cảm ơn bạn đã chọn PAWFECT!</h1>
    <p>Mã đơn hàng <b>#{confirmation.code}</b>. Thông tin lịch hẹn đã được ghi nhận.</p>
    <div className="cart-confirm-lines">{confirmation.lines.map(line=><p key={line}><PawPrint/><span>{line}</span></p>)}</div>
    <Totals subtotal={confirmation.subtotal}/>
    <div className="cart-success-actions"><Link className="btn outline" to="/services">Tiếp tục xem dịch vụ</Link><Link className="btn primary" to="/customer">Quản lý đơn hàng</Link></div>
  </div></main>;

  if(!items.length)return <main className="cart-page cart-empty"><div><ShoppingBag/><h1>Giỏ hàng đang trống</h1><p>Chọn dịch vụ hoặc combo phù hợp cho bé, sản phẩm sẽ xuất hiện tại đây.</p><div><Link className="btn primary" to="/services">Xem dịch vụ</Link><Link className="btn outline" to="/membership">Xem combo tiết kiệm</Link></div></div></main>;

  return <main className="cart-page">
    <header className="cart-header"><Link to="/" className="cart-brand"><PawPrint/> PAWFECT</Link><div><span>GIỎ HÀNG CỦA BẠN</span><h1>{count} lựa chọn cho bé</h1></div></header>
    <div className="cart-steps">{['Giỏ hàng','Thông tin lịch hẹn','Thanh toán'].map((label,index)=><div className={step>=index+1?'active':''} key={label}><i>{step>index+1?<CheckCircle2/>:index+1}</i><span>{label}</span></div>)}</div>
    <div className="cart-layout"><section className="cart-main">
      {step===1&&<><div className="cart-section-head"><div><span>01 · KIỂM TRA ĐƠN</span><h2>Dịch vụ và combo đã chọn</h2></div><button onClick={clear}><Trash2/> Xóa tất cả</button></div>
        <div className="cart-items">{items.map(item=><article className="cart-item" key={item.id}><div className="cart-item-icon"><PawPrint/></div><div className="cart-item-info"><small>{item.name.toLowerCase().includes('combo')?'COMBO TIẾT KIỆM':'DỊCH VỤ'}</small><h3>{item.name}</h3><b>{item.variant}</b>{item.description&&<p>{item.description}</p>}</div><div className="cart-item-price"><b>{money(item.price)}</b><small>{item.name==='Pet Hotel'?'mỗi ngày':'mỗi lần/gói'}</small></div><div className="cart-quantity"><button aria-label="Giảm số lượng" onClick={()=>setQuantity(item.id,item.quantity-1)}><Minus/></button><strong>{item.quantity}</strong><button aria-label="Tăng số lượng" onClick={()=>setQuantity(item.id,item.quantity+1)}><Plus/></button><span>{item.name==='Pet Hotel'?'ngày':'lần'}</span></div><button className="cart-remove" aria-label="Xóa" onClick={()=>removeItem(item.id)}><Trash2/></button></article>)}</div>{hotelItems.length>0&&<div className="hotel-date-range"><div><span>LỊCH LƯU TRÚ PET HOTEL</span><h3>Chọn ngày gửi và ngày đón bé</h3><p>Số ngày và giá tiền được cập nhật tự động.</p></div><label>Ngày gửi<input type="date" value={hotelStay.checkIn} onChange={e=>changeHotelDate('checkIn',e.target.value)}/></label><i>→</i><label>Ngày đón<input type="date" min={hotelStay.checkIn} value={hotelStay.checkOut} onChange={e=>changeHotelDate('checkOut',e.target.value)}/></label><strong>{hotelDays} ngày<br/><small>{money(hotelItems.reduce((sum,item)=>sum+item.price*hotelDays,0))}</small></strong></div>}
        <Link className="cart-more" to="/services"><Plus/> Thêm dịch vụ khác</Link></>}
      {step===2&&<><div className="cart-section-head"><div><span>02 · LỊCH HẸN</span><h2>Thông tin của bé</h2></div></div><div className="cart-form-grid"><label>Loại thú cưng<select value={data.petType} onChange={e=>setData({...data,petType:e.target.value,pet:e.target.value==='Chó'?'Bella · Poodle':e.target.value==='Mèo'?'Mochi · Scottish Fold':`${e.target.value} của tôi`})}><option>Mèo</option><option>Chó</option><option>Thỏ</option><option>Khác</option></select></label><label>Chọn bé<select value={data.pet} onChange={e=>setData({...data,pet:e.target.value})}>{data.petType==='Mèo'?<><option>Mochi · Scottish Fold</option><option>Bông · Mèo Anh lông ngắn</option></>:data.petType==='Chó'?<><option>Bella · Poodle</option><option>Milo · Corgi</option></>:<option>{data.petType} của tôi</option>}</select></label><label>Ngày hẹn<input type="date" value={data.date} onChange={e=>setData({...data,date:e.target.value})}/></label></div><p className="cart-label">Khung giờ còn trống</p><div className="cart-time-grid">{times.map(time=><button className={data.time===time?'active':''} onClick={()=>setData({...data,time})} key={time}>{time}</button>)}</div><label className="cart-note">Ghi chú cho PAWFECT<textarea value={data.note} onChange={e=>setData({...data,note:e.target.value})} placeholder="Tính cách, tình trạng da lông hoặc lưu ý đặc biệt của bé..."/></label></>}
      {step===3&&<><div className="cart-section-head"><div><span>03 · THANH TOÁN</span><h2>Chọn phương thức thanh toán</h2></div></div><div className="cart-payments">{['MoMo','ZaloPay','Thẻ ngân hàng','Tiền mặt tại cửa hàng'].map(method=><label className={data.method===method?'active':''} key={method}><input type="radio" checked={data.method===method} onChange={()=>setData({...data,method})}/><CreditCard/><span>{method}</span><i>{data.method===method?'✓':''}</i></label>)}</div><p className="cart-secure"><ShieldCheck/> Thanh toán được bảo vệ. Đây là môi trường mô phỏng, không phát sinh giao dịch thật.</p>{checkoutError&&<p className="cart-error">{checkoutError} {!localStorage.getItem('token')&&<Link to="/login">Đăng nhập ngay</Link>}</p>}</>}
      <div className="cart-actions">{step>1&&<button className="btn outline" onClick={()=>setStep(step-1)}><ChevronLeft/> Quay lại</button>}<button className="btn primary" onClick={()=>step===3?finish():setStep(step+1)}>{step===3?'Xác nhận & thanh toán':'Tiếp tục'}<ChevronRight/></button></div>
    </section><aside className="cart-summary"><span>TÓM TẮT ĐƠN HÀNG</span><h2>{count} sản phẩm</h2><div className="cart-summary-lines">{items.map(item=><p key={item.id}><span>{item.name} · {item.variant}<small>× {item.quantity}</small></span><b>{money(item.price*item.quantity)}</b></p>)}</div><Totals subtotal={subtotal}/>{step<3&&<p className="cart-vat-note">Giá cuối cùng đã bao gồm VAT 8%.</p>}</aside></div>
  </main>;
}
