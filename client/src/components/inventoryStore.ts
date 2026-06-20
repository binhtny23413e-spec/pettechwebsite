export const initialInventory:Record<number,number>={42:18,43:7,44:14,45:6,46:22,47:11,48:5,49:31,50:9,51:13,52:8,53:4,54:16,55:12,56:7,57:5,58:24,59:15};

export type InventoryStats={stock:Record<number,number>;sold:Record<number,number>;revenue:Record<number,number>};

export function readInventory():InventoryStats{
 try{
  const saved=JSON.parse(sessionStorage.getItem('pawfect_inventory')||'null');
  if(saved)return {stock:{...initialInventory,...saved.stock},sold:saved.sold||{},revenue:saved.revenue||{}};
 }catch{}
 return {stock:{...initialInventory},sold:{},revenue:{}};
}

export function saveInventory(data:InventoryStats){sessionStorage.setItem('pawfect_inventory',JSON.stringify(data));window.dispatchEvent(new Event('pawfect-inventory'))}

export function recordSale(id:number,price:number,quantity=1){const data=readInventory();if((data.stock[id]||0)<quantity)return data;data.stock[id]-=quantity;data.sold[id]=(data.sold[id]||0)+quantity;data.revenue[id]=(data.revenue[id]||0)+price*quantity;saveInventory(data);return data}

export function changeStock(id:number,delta:number){const data=readInventory();data.stock[id]=Math.max(0,(data.stock[id]||0)+delta);saveInventory(data);return data}
