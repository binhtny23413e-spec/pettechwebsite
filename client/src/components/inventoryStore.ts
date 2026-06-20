export const initialInventory:Record<number,number>={41:18,42:7,43:14,44:6,45:12,46:22,47:11,49:31,50:9,51:13,52:8,53:4,54:16,55:12,56:7,57:5,58:24,59:15};
const initialSold:Record<number,number>={41:12,42:4,43:9,44:3,45:6,46:18,47:7,49:15,50:6,51:8,52:5,53:3,54:11,55:9,56:5,57:4,58:14,59:8};
const initialRevenue:Record<number,number>={41:1068000,42:1156000,43:981000,44:957000,45:774000,46:540000,47:630000,49:975000,50:1770000,51:2440000,52:1945000,53:1467000,54:1815000,55:1701000,56:1095000,57:2436000,58:910000,59:1192000};

export type InventoryStats={stock:Record<number,number>;sold:Record<number,number>;revenue:Record<number,number>};

export function readInventory():InventoryStats{
 try{
  const saved=JSON.parse(sessionStorage.getItem('pawfect_inventory')||'null');
  if(saved)return {stock:{...initialInventory,...saved.stock},sold:{...initialSold,...saved.sold},revenue:{...initialRevenue,...saved.revenue}};
 }catch{}
 return {stock:{...initialInventory},sold:{...initialSold},revenue:{...initialRevenue}};
}

export function saveInventory(data:InventoryStats){sessionStorage.setItem('pawfect_inventory',JSON.stringify(data));window.dispatchEvent(new Event('pawfect-inventory'))}

export function recordSale(id:number,price:number,quantity=1){const data=readInventory();if((data.stock[id]||0)<quantity)return data;data.stock[id]-=quantity;data.sold[id]=(data.sold[id]||0)+quantity;data.revenue[id]=(data.revenue[id]||0)+price*quantity;saveInventory(data);return data}

export function changeStock(id:number,delta:number){const data=readInventory();data.stock[id]=Math.max(0,(data.stock[id]||0)+delta);saveInventory(data);return data}
