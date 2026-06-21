import { useEffect, useState } from 'react';

export default function CountUp({end,duration=1200,format=(value)=>Math.round(value).toLocaleString('vi-VN')}:{end:number;duration?:number;format?:(value:number)=>string}){
 const [value,setValue]=useState(0);
 useEffect(()=>{let frame=0;const started=performance.now();const tick=(now:number)=>{const progress=Math.min((now-started)/duration,1);const eased=1-Math.pow(1-progress,3);setValue(end*eased);if(progress<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[end,duration]);
 return <>{format(value)}</>;
}
