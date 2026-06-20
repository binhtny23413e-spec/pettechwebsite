import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type CartItem={id:string;name:string;variant:string;price:number;quantity:number;description?:string;hotelCheckIn?:string;hotelCheckOut?:string};
type AddCartItem=Omit<CartItem,'quantity'>&{quantity?:number};
type CartValue={items:CartItem[];count:number;addItem:(item:AddCartItem)=>void;removeItem:(id:string)=>void;setQuantity:(id:string,quantity:number)=>void;clear:()=>void};
const CartContext=createContext<CartValue|null>(null);

export function CartProvider({children}:{children:ReactNode}){
  const [items,setItems]=useState<CartItem[]>(()=>{try{return JSON.parse(localStorage.getItem('pawfect-cart')||'[]')}catch{return[]}});
  useEffect(()=>localStorage.setItem('pawfect-cart',JSON.stringify(items)),[items]);
  const addItem=(item:AddCartItem)=>setItems(old=>{const amount=item.quantity||1;const found=old.find(x=>x.id===item.id);return found?old.map(x=>x.id===item.id?{...x,...item,quantity:x.quantity+amount}:x):[...old,{...item,quantity:amount}]});
  const removeItem=(id:string)=>setItems(old=>old.filter(x=>x.id!==id));
  const setQuantity=(id:string,quantity:number)=>setItems(old=>quantity<1?old.filter(x=>x.id!==id):old.map(x=>x.id===id?{...x,quantity}:x));
  return <CartContext.Provider value={{items,count:items.reduce((n,x)=>n+x.quantity,0),addItem,removeItem,setQuantity,clear:()=>setItems([])}}>{children}</CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error('useCart must be used inside CartProvider');return value}
