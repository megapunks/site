'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAccount, usePublicClient, useWriteContract, useChainId } from 'wagmi';
import {
  decodeEventLog,
  formatEther,
  parseEther,
  parseGwei,
  type Hex,
  createPublicClient,
  defineChain,
  http,
} from 'viem';

import SlotResultModal from './SlotResultModal';

/* =========================
   Contract
========================= */
const CONTRACT_ADDRESS = '0xa697635aAc186eF41A2Ea23aBE939848f2BB1DFe' as const;

const ABI = [
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"adminWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"AlreadyCommitted","type":"error"},
  {"inputs":[],"name":"AlreadyRevealed","type":"error"},
  {"inputs":[],"name":"AlreadySpunToday","type":"error"},
  {"inputs":[],"name":"BadEntryFee","type":"error"},
  {"inputs":[],"name":"BadReveal","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"dayId","type":"uint256"},{"internalType":"bytes32","name":"seedHash","type":"bytes32"}],"name":"commitSeed","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"InsufficientReserve","type":"error"},
  {"inputs":[],"name":"NoCommit","type":"error"},
  {"inputs":[],"name":"NotOwner","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"newRemaining","type":"uint256"}],"name":"reduceFMRemaining","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"ReduceOnly","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"newRemaining","type":"uint256"}],"name":"reduceWLRemaining","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"Reentrant","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"dayId","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"name":"revealSeed","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"TransferFailed","type":"error"},
  {"inputs":[],"name":"ZeroAddress","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"dayId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fmRemainingAfter","type":"uint256"}],"name":"FreeMintWon","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Funded","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"dayId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"seedHash","type":"bytes32"}],"name":"SeedCommitted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"dayId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"seed","type":"bytes32"}],"name":"SeedRevealed","type":"event"},
  {"inputs":[{"internalType":"bool","name":"on","type":"bool"}],"name":"setAuditLog","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newReserve","type":"uint256"}],"name":"setMinReserve","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"spin","outputs":[],"stateMutability":"payable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"dayId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"spinIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeRoll","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeWei","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"entropy","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"daySaltHash","type":"bytes32"}],"name":"Spun","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"dayId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeRoll","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeWei","type":"uint256"}],"name":"SpunLite","type":"event"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"dayId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wlRemainingAfter","type":"uint256"}],"name":"WhitelistWon","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},
  {"stateMutability":"payable","type":"fallback"},
  {"stateMutability":"payable","type":"receive"},
  {"inputs":[],"name":"auditLog","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"canSpin","outputs":[{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint256","name":"today","type":"uint256"},{"internalType":"uint256","name":"lastDay","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ENTRY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"prizePool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"wlRemaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"fmRemaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;

/* ============ Gas caps (.env) ============ */
const ENV_MAX_FEE = process.env.NEXT_PUBLIC_MAX_FEE_GWEI;
const ENV_MAX_PRIO = process.env.NEXT_PUBLIC_MAX_PRIORITY_GWEI;

/* =========================
   Sounds
========================= */
const SOUND = {
  lever: '/sounds/lever.mp3',
  spin: '/sounds/spin_loop.mp3',
  brake: '/sounds/brake.mp3',
  tick:  '/sounds/tick.mp3',
  win:   '/sounds/win.mp3',
  ambience: '/sounds/casino_ambience.mp3',
};

/* =========================
   Helpers
========================= */
function fmtEth(v?: bigint, dp = 5) {
  if (typeof v === 'undefined') return '—';
  const s = formatEther(v);
  const [a, b = ''] = s.split('.');
  if (!dp) return a;
  const frac = (b + '000000000000000000').slice(0, dp);
  return `${a}.${frac}`.replace(/\.$/, '');
}

/* decodeEventLog safe wrapper */
function decodeLogSafe(log: { data?: Hex; topics?: readonly Hex[] | Hex[] }) {
  const topicsArr = (log.topics ?? []) as Hex[];
  if (topicsArr.length === 0) return null;
  try {
    const tuple = [topicsArr[0], ...topicsArr.slice(1)] as [Hex, ...Hex[]];
    return decodeEventLog({ abi: ABI, data: (log.data || '0x') as Hex, topics: tuple });
  } catch { return null; }
}

/* =========================
   PNG Symbols
========================= */
type SymbolKey = 'diamond'|'seven'|'lemon'|'cherry'|'bell'|'mystery'|'coin'|'clover';
const SYMBOLS: SymbolKey[] = ['diamond','seven','lemon','cherry','bell','mystery','coin','clover'];
const SYM_SRC: Record<SymbolKey, string> = {
  diamond: '/symbols/diamond.png',
  seven:   '/symbols/seven.png',
  lemon:   '/symbols/lemon.png',
  cherry:  '/symbols/cherry.png',
  bell:    '/symbols/bell.png',
  mystery: '/symbols/mystery.png',
  coin:    '/symbols/coin.png',
  clover:  '/symbols/clover.png',
};
const randSym = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
function nonMatch(): SymbolKey[] {
  const a = randSym(), b = randSym(); let c: SymbolKey = randSym();
  if (a === b) { while (c === a) c = randSym(); }
  else if (c === a || c === b) { let alt: SymbolKey = randSym(); while (alt === a || alt === b) alt = randSym(); c = alt; }
  return [a, b, c];
}
function twoKind(sym: SymbolKey): SymbolKey[] {
  let other: SymbolKey = randSym(); while (other === sym) other = randSym();
  const pos = Math.floor(Math.random() * 3);
  const arr: SymbolKey[] = [other, other, other];
  arr[pos] = sym; arr[(pos+1)%3] = sym;
  return arr;
}
function targetFromResult(prizeWei?: bigint, wl?: boolean, fm?: boolean): SymbolKey[] {
  if (fm) return ['diamond','diamond','diamond'];
  if (wl) return ['clover','clover','clover'];
  if (prizeWei && prizeWei >= parseEther('1'))   return ['seven','seven','seven'];
  if (prizeWei && prizeWei >= parseEther('0.5')) return ['bell','bell','bell'];
  if (prizeWei && prizeWei >= parseEther('0.2')) return twoKind('coin');
  if (prizeWei && prizeWei >= parseEther('0.1')) return twoKind('lemon');
  return nonMatch();
}

/* ------- 1559 caps ------- */
async function getCapped1559(pc: ReturnType<typeof usePublicClient> | null){
  if(!pc) return null;
  try{
    const fees = await pc.estimateFeesPerGas();
    const base = (fees.maxFeePerGas && fees.maxPriorityFeePerGas)
      ? (fees.maxFeePerGas - fees.maxPriorityFeePerGas)
      : (await pc.getBlock()).baseFeePerGas ?? BigInt(0);

    if(!ENV_MAX_FEE || !ENV_MAX_PRIO) return null;
    const capFee  = parseGwei(ENV_MAX_FEE);
    const capPrio = parseGwei(ENV_MAX_PRIO);

    let maxPriorityFeePerGas = fees.maxPriorityFeePerGas ?? capPrio;
    if(maxPriorityFeePerGas > capPrio) maxPriorityFeePerGas = capPrio;

    let maxFeePerGas = fees.maxFeePerGas ?? (base*BigInt(2) + maxPriorityFeePerGas);
    if(maxFeePerGas > capFee) maxFeePerGas = capFee;

    if(maxFeePerGas < base + maxPriorityFeePerGas) return null;
    return { maxFeePerGas, maxPriorityFeePerGas };
  }catch{ return null; }
}

/* =========================
   Small stat card
========================= */
function PixelCard({ children, className='' }:{children:React.ReactNode; className?:string}) {
  return (
    <div
      className={`rounded-2xl border border-cyan-500/30 bg-[#0b1020]/50 backdrop-blur-sm shadow-[0_0_24px_rgba(0,200,255,.12)] ${className}`}
      style={{ imageRendering:'pixelated' as any }}
    >
      {children}
    </div>
  );
}

/* =========================
   Sounds hooks + ambience
========================= */
function useSounds() {
  const [muted, setMuted] = useState(false);
  const refs = useRef<{[k: string]: HTMLAudioElement}>({} as any);

  useEffect(() => {
    refs.current.lever    = new Audio(SOUND.lever);
    refs.current.spin     = new Audio(SOUND.spin);
    refs.current.brake    = new Audio(SOUND.brake);
    refs.current.tick     = new Audio(SOUND.tick);
    refs.current.win      = new Audio(SOUND.win);
    refs.current.ambience = new Audio(SOUND.ambience);
    refs.current.spin.loop = true;
    refs.current.ambience.loop = true;
    Object.values(refs.current).forEach(a => { a.preload = 'auto'; a.volume = 0.9; a.muted = muted; });
    return () => Object.values(refs.current).forEach(a => a.pause());
  }, []);
  useEffect(() => { Object.values(refs.current).forEach(a => a.muted = muted); }, [muted]);

  const ensureAmbience = () => {
    const a = refs.current.ambience; if (!a) return;
    if (a.paused) { a.currentTime = 0; a.volume = 0.35; a.play().catch(()=>{}); }
  };

  const play = (key: keyof typeof SOUND, opt?: {restart?: boolean; volume?: number}) => {
    const a = refs.current[key]; if (!a) return;
    if (opt?.volume !== undefined) a.volume = opt.volume;
    if (opt?.restart ?? true) a.currentTime = 0;
    a.play().catch(()=>{});
  };
  const stop = (key: keyof typeof SOUND) => refs.current[key]?.pause();
  return { play, stop, muted, setMuted, ensureAmbience };
}

/* —— Silence global click sfx —— */
function useSilenceSiteClickSfx() {
  useEffect(() => {
    const hush = () => {
      document.querySelectorAll('audio').forEach((a) => {
        const el = a as HTMLAudioElement;
        if (el.dataset.role === 'ui-click' || /click|tap|button/i.test(el.src)) {
          el.muted = true;
          try { el.pause(); el.currentTime = 0; } catch {}
        }
      });
    };
    document.addEventListener('click', hush, true);
    return () => document.removeEventListener('click', hush, true);
  }, []);
}

/* —— Autostart ambience on first gesture —— */
function useAmbienceAutostart(ensureAmbience: () => void) {
  useEffect(() => {
    const kick = () => { ensureAmbience(); window.removeEventListener('pointerdown', kick); };
    window.addEventListener('pointerdown', kick);
    return () => window.removeEventListener('pointerdown', kick);
  }, [ensureAmbience]);
}

/* =========================
   Reel (dynamic height)
========================= */
type ReelMode='idle'|'spin'|'brake';
function Reel({
  targetSym, globalSpinning, stopDelayMs, onStop, idle,
}:{
  targetSym:SymbolKey; globalSpinning:boolean; stopDelayMs:number; onStop?:()=>void; idle:boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cellH, setCellH] = useState(176);
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const update = () => setCellH(el.clientHeight || 176);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const STRIP = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS];
  const CYCLE_H = SYMBOLS.length * cellH;

  const [mode,setMode]=useState<ReelMode>('idle');
  const [pos,setPos]=useState(0);
  const [landing,setLanding]=useState(false);

  const posRef=useRef(0);
  const rafRef=useRef<number|null>(null);
  const tRef=useRef<number>(0);
  const brakeCfg=useRef<{start:number;from:number;to:number;dur:number}|null>(null);
  const prevSpin=useRef(false);

  const SPIN_SPEED = 1200;
  const BRAKE_MS   = 1500;
  const EXTRA_CYCLES = 3;

  useEffect(()=>{ function loop(now:number){
    if(!tRef.current) tRef.current=now;
    const dt=(now-tRef.current)/1000; tRef.current=now;

    if(mode==='spin'){ const v=SPIN_SPEED; let np=posRef.current+v*dt; if(np>=1e7) np=np%CYCLE_H; posRef.current=np; setPos(np%CYCLE_H); rafRef.current=requestAnimationFrame(loop); return; }
    if(mode==='idle'){ const v=idle?60:0; const np=(posRef.current+v*dt)%CYCLE_H; posRef.current=np; setPos(np); rafRef.current=requestAnimationFrame(loop); return; }
    if(mode==='brake'&&brakeCfg.current){
      const {start,from,to,dur}=brakeCfg.current; const t=Math.min(1,(now-start)/dur);
      const eased=1-Math.pow(1-t,3); const np=from+(to-from)*eased; posRef.current=np; setPos(np%CYCLE_H);
      if(t>=1){ setLanding(true); setTimeout(()=>setLanding(false),240); setMode('idle'); onStop?.(); return; }
      rafRef.current=requestAnimationFrame(loop); return;
    }
  }
    cancelAnimationFrame(rafRef.current ?? -1);
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current ?? -1);
  },[mode,idle,CYCLE_H]);

  useEffect(()=>{ if(globalSpinning && !prevSpin.current){ setMode('spin'); }
    if(!globalSpinning && prevSpin.current){
      const timer=setTimeout(()=>{
        const idx=SYMBOLS.indexOf(targetSym);
        const current=posRef.current;
        const base=current-(current%CYCLE_H);
        let targetAbs=base+idx*cellH;
        if(targetAbs<=current) targetAbs+=CYCLE_H;
        targetAbs+=CYCLE_H*EXTRA_CYCLES;
        brakeCfg.current={start:performance.now(),from:current,to:targetAbs,dur:BRAKE_MS+stopDelayMs*0.18};
        setMode('brake');
      },stopDelayMs);
      return ()=>clearTimeout(timer);
    }
    prevSpin.current=globalSpinning;
  },[globalSpinning,stopDelayMs,targetSym,cellH,CYCLE_H]);

  useEffect(()=>{ if(!globalSpinning && idle) setMode('idle'); },[globalSpinning,idle]);

  const icon = Math.round(cellH * 0.74);

  return (
    <div ref={wrapRef} className="relative overflow-hidden"
      style={{ width:'100%', height:'100%', imageRendering:'pixelated' as any, borderRadius: 8, background:'transparent', border:'none' }}>
      <div className={`absolute left-0 top-0 w-full will-change-transform ${landing?'scale-105':''}`}
           style={{ transform:`translateY(-${pos}px)` }}>
        {STRIP.map((s,i)=>(
          <div key={i} className="flex items-center justify-center select-none" style={{height:cellH}}>
            <img src={SYM_SRC[s]} alt={s} style={{ width:icon, height:icon, imageRendering:'pixelated' as any }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   Skinned Slot (keep size)
========================= */
const SKIN_URL  = '/skins/slot-skin.png';
const LEVER_URL = '/skins/lvl.png';
const ASPECT_W = 850;
const ASPECT_H = 365;
const INNER = { left: 8.0, right: 8.0, top: 19.5, bottom: 26.5 };

function SkinnedSlot({
  spinning, target, onAllStopped, idle, leverKickSignal,
}:{
  spinning:boolean; target:SymbolKey[]; onAllStopped:()=>void; idle:boolean; leverKickSignal:number;
}) {
  const [stopped,setStopped]=useState(0);
  const [leverDown,setLeverDown]=useState(false);
  useEffect(()=>{ if(stopped===3){ onAllStopped(); setStopped(0);} },[stopped,onAllStopped]);
  useEffect(()=>{ if(leverKickSignal>0){ setLeverDown(true); const t=setTimeout(()=>setLeverDown(false),380); return ()=>clearTimeout(t);} },[leverKickSignal]);

  return (
    <div className="relative mx-auto w-full max-w-[900px]"
         style={{ aspectRatio:`${ASPECT_W} / ${ASPECT_H}`, imageRendering:'pixelated' as any }}>
      <div className="absolute inset-0 bg-no-repeat bg-center"
           style={{ backgroundImage:`url(${SKIN_URL})`, backgroundSize:'contain', imageRendering:'pixelated' as any }} aria-hidden />
      <img src={LEVER_URL} alt="lever"
           className="absolute pointer-events-none select-none transition-transform duration-300"
           style={{ top:'37.5%', right:'-3.5%', width:'9.8%', transform:leverDown?'translateY(10%)':'translateY(0)', transformOrigin:'top center', imageRendering:'pixelated' as any }} />
      <div className="absolute grid grid-cols-3"
           style={{ left:`${INNER.left}%`, right:`${INNER.right}%`, top:`${INNER.top}%`, bottom:`${INNER.bottom}%`, imageRendering:'pixelated' as any }}>
        <Reel targetSym={target[0]} globalSpinning={spinning} stopDelayMs={0}   idle={idle} onStop={()=>setStopped(v=>v+1)} />
        <Reel targetSym={target[1]} globalSpinning={spinning} stopDelayMs={250} idle={idle} onStop={()=>setStopped(v=>v+1)} />
        <Reel targetSym={target[2]} globalSpinning={spinning} stopDelayMs={500} idle={idle} onStop={()=>setStopped(v=>v+1)} />
      </div>
    </div>
  );
}

/* =========================
   Control Panel
========================= */
function MachinePanel({
  h, m, s, feeEth, onSpin, disabled,
}: { h: number; m: number; s: number; feeEth: string; onSpin: () => void; disabled?: boolean; }) {
  return (
    <div className="control-panel">
      <div className="panel-wood">
        <div className="panel-inner">
          <div className="lcd">
            <span className="label">Next reset (UTC) in</span>
            <span className="digits">
              {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
            </span>
          </div>
          <button className="slot-btn" onClick={onSpin} disabled={disabled} title={`Entry: ${feeEth} ETH`}>
            <span className="slot-btn-line">
              <span className="slot-btn-title">SLOT</span>
              <span className="slot-btn-badge">{feeEth} ETH</span>
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .control-panel{ margin-top: 10px; }
        .panel-wood{ position: relative; border-radius: 0 0 10px 10px; padding: 8px; background: transparent; backdrop-filter: none; box-shadow: none; border: none; image-rendering: pixelated; }
        .panel-inner{ display: grid; gap: 10px; justify-items: center; text-align: center; padding: 8px 10px 10px; border-radius: 6px; background: transparent; box-shadow: none; }
        .lcd{ display: inline-flex; align-items: baseline; gap: 10px; padding: 6px 10px; border-radius: 4px; background: transparent; box-shadow: none; font-family: ui-monospace, Menlo, Consolas, monospace; }
        .lcd .label{ font-size: 15px; color:#b8f1ff; opacity:.95; }
        .lcd .digits{ font-weight: 900; font-size: 20px; letter-spacing: .02em; color: #58F0FF; }
        .slot-btn{ position: relative; display: inline-flex; align-items: center; justify-content: center; padding: 22px 56px; font-weight: 900; color: #1a1300; border: 0; background: linear-gradient(180deg,#FFD84D,#FF9D00); image-rendering: pixelated; clip-path: polygon(0 10px,10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px)); box-shadow: 0 6px 0 #7a3b00, 0 0 0 2px #5b2a00 inset; text-shadow: 0 1px 0 rgba(255,255,255,.35); transition: filter .15s ease, transform .06s ease; }
        .slot-btn:hover{ filter: brightness(1.06); }
        .slot-btn:active{ transform: translateY(1px); }
        .slot-btn:disabled{ opacity:.6; cursor:not-allowed; filter:none; }
        .slot-btn-line{ display:inline-flex; align-items:center; gap:14px; }
        .slot-btn-title{ font-size:34px; letter-spacing:.02em; }
        .slot-btn-badge{ font-weight:900; padding:6px 10px; font-size:12px; color:#1a1300; background: rgba(0,0,0,.18); clip-path: polygon(0 8px,8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px)); box-shadow: 0 0 0 2px #5b2a00 inset; white-space: nowrap; }
        @media (max-width:640px){ .slot-btn-title{ font-size:28px; } .slot-btn{ padding:20px 44px; } .lcd .digits{ font-size:18px; } }
      `}</style>
    </div>
  );
}

/* =========================
   Live reads
========================= */
const MEGA_RPC = process.env.NEXT_PUBLIC_MEGA_RPC || '';
const MEGA_CHAIN_ID = Number(process.env.NEXT_PUBLIC_MEGA_CHAIN_ID || 0);
const megaChain = defineChain({
  id: MEGA_CHAIN_ID || 6342,
  name: 'Mega ETH Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [MEGA_RPC || ''] } },
  testnet: true,
});

function useLiveContractReads(args:{ publicClient: ReturnType<typeof usePublicClient> | null, address?:`0x${string}` }) {
  const { publicClient, address } = args;
  const [state,setState]=useState<{ entryFee?:bigint; prizePool?:bigint; wl?:bigint; fm?:bigint; canSpin?:boolean; auditLog?:boolean; owner?:`0x${string}`; }>({});

  const standalone=useMemo(()=>{ if(!MEGA_RPC) return null;
    try{ return createPublicClient({ chain:megaChain, transport:http(MEGA_RPC) }); }catch{ return null; }
  },[]);

  useEffect(()=>{ let alive=true;
    async function fetchAll(){ const client=standalone ?? publicClient; if(!client) return;
      try{
        const [ef,pp,wl,fm,auditLog,owner] = await Promise.all([
          client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'ENTRY_FEE' }) as Promise<bigint>,
          client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'prizePool' }) as Promise<bigint>,
          client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'wlRemaining' }) as Promise<bigint>,
          client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'fmRemaining' }) as Promise<bigint>,
          client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'auditLog' }) as Promise<boolean>,
          client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'owner' }) as Promise<`0x${string}`>,
        ]);
        let can: boolean | undefined = undefined;
        if(address){
          try{
            const [allowed] = await client.readContract({ address:CONTRACT_ADDRESS, abi:ABI, functionName:'canSpin', args:[address] }) as unknown as [boolean,bigint,bigint];
            can=allowed;
          }catch{}
        }
        if(alive) setState({ entryFee:ef, prizePool:pp, wl, fm, canSpin:can, auditLog, owner });
      }catch{}
    }
    fetchAll(); const id=setInterval(fetchAll,8000);
    return ()=>{ alive=false; clearInterval(id); };
  },[publicClient,standalone,address]);

  return state;
}

/* =========================
   Countdown
========================= */
function msUntilNextUtcMidnight(){
  const now=new Date();
  const next=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1,0,0,0));
  return next.getTime()-now.getTime();
}
function useCountdownToUtcMidnight(tick=1000){
  const [ms,setMs]=useState(msUntilNextUtcMidnight());
  useEffect(()=>{ const id=setInterval(()=>setMs(msUntilNextUtcMidnight()),tick); return ()=>clearInterval(id); },[tick]);
  const h=Math.floor(ms/3_600_000);
  const m=Math.floor((ms%3_600_000)/60_000);
  const s=Math.floor((ms%60_000)/1000);
  return {h,m,s};
}

/* =========================
   Page
========================= */
export default function SlotPage(){
  const { address, isConnected } = useAccount();
  const connectedChainId = useChainId();
  const wagmiPublic = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const activeChainId = isConnected ? connectedChainId : (wagmiPublic?.chain?.id as number | undefined);

  const live = useLiveContractReads({ publicClient: wagmiPublic ?? null, address: address ?? undefined });

  const feeWei = live.entryFee ?? parseEther('0.001');
  const prizePoolWei = live.prizePool;
  const wlRemaining = live.wl;
  const fmRemaining = live.fm;
  const allowedToday = live.canSpin ?? false;
  const auditOn = live.auditLog ?? true;
  const isOwner = isConnected && live.owner && address && live.owner.toLowerCase() === address.toLowerCase();

  const { h,m,s } = useCountdownToUtcMidnight();
  const { play, stop, muted, setMuted, ensureAmbience } = useSounds();

  useSilenceSiteClickSfx();
  useAmbienceAutostart(ensureAmbience);

  const [loading,setLoading] = useState(false);
  const [txHash,setTxHash] = useState<Hex|null>(null);
  const [result,setResult] = useState<{ prizeWei?:bigint; wl?:boolean; fm?:boolean } | null>(null);
  const [spinning,setSpinning] = useState(false);
  const [target,setTarget] = useState<SymbolKey[]>(['diamond','diamond','diamond']);
  const [grayscale,setGrayscale] = useState(false);
  const [leverKick,setLeverKick] = useState(0);
  const disablingAuditOnce = useRef(false);

  // auto-disable audit for owner (gas saver)
  useEffect(()=>{ (async ()=>{
    if(!isOwner || !auditOn || disablingAuditOnce.current || !activeChainId) return;
    disablingAuditOnce.current=true;
    try{ await writeContractAsync({ chainId:activeChainId, address:CONTRACT_ADDRESS, abi:ABI, functionName:'setAuditLog', args:[false] }); }catch{}
  })(); },[isOwner,auditOn,activeChainId,writeContractAsync]);

  const bigWin = (r?:{prizeWei?:bigint; wl?:boolean; fm?:boolean}) =>
    !!r && (r.fm || r.wl || (r.prizeWei && r.prizeWei>=parseEther('0.5')));

  async function handleSpin(){
    ensureAmbience();
    setLeverKick(x=>x+1);
    play('lever',{restart:true,volume:0.9});

    const canWrite = isConnected && activeChainId;
    if(!canWrite){
      // demo mode
      setResult(null); setGrayscale(false); setSpinning(true); play('spin',{restart:true,volume:0.6});
      const r=Math.random(); const demoTarget = r<0.15 ? twoKind('bell') : r<0.30 ? twoKind('lemon') : nonMatch();
      setTimeout(()=>{ setTarget(demoTarget); play('brake',{restart:true,volume:0.7}); setSpinning(false); },600);
      return;
    }
    if(!allowedToday || loading) return;

    try{
      setLoading(true); setResult(null); setGrayscale(false); setSpinning(true); play('spin',{restart:true,volume:0.6});

      // Estimate gas (+25%)
      let gas: bigint | undefined;
      try{
        const est = await wagmiPublic!.estimateContractGas({
          address:CONTRACT_ADDRESS, abi:ABI, functionName:'spin', value:feeWei, account:address!,
        });
        gas = (est * BigInt(125)) / BigInt(100);
      }catch(e:any){ console.warn('estimateContractGas failed', e?.shortMessage || e?.message); }

      const caps = await getCapped1559(wagmiPublic);

      const txArgs:any = { chainId: activeChainId, address: CONTRACT_ADDRESS, abi: ABI, functionName: 'spin', value: feeWei };
      if(gas) txArgs.gas = gas;
      if(caps){ txArgs.maxFeePerGas = caps.maxFeePerGas; txArgs.maxPriorityFeePerGas = caps.maxPriorityFeePerGas; }

      const hash = await writeContractAsync(txArgs);
      setTxHash(hash);
      const receipt = await wagmiPublic!.waitForTransactionReceipt({ hash });

      let prizeWei:bigint|undefined; let wl=false; let fm=false;
      for(const log of receipt.logs){
        const parsed = decodeLogSafe(log); if(!parsed) continue;
        if(parsed.eventName==='Spun'){ const a:any=parsed.args; prizeWei=a.prizeWei; }
        if(parsed.eventName==='SpunLite'){ const a:any=parsed.args; prizeWei=a.prizeWei; }
        if(parsed.eventName==='WhitelistWon') wl=true;
        if(parsed.eventName==='FreeMintWon')  fm=true;
      }

      setTarget(targetFromResult(prizeWei, wl, fm));
      play('brake',{restart:true,volume:0.75});
      setSpinning(false);

      setResult({ prizeWei, wl, fm });
      setTimeout(()=>{ stop('spin'); if(bigWin({prizeWei,wl,fm})) play('win',{restart:true,volume:1}); else play('tick',{restart:true,volume:0.85}); }, 1600);
    }catch(e:any){
      setSpinning(false); stop('spin');
      const msg = e?.shortMessage || e?.message || 'Transaction failed';
      alert(msg);
      console.error(e);
    }finally{ setLoading(false); }
  }

  async function disableAuditManually(){
    if(!isOwner || !activeChainId) return;
    try{ await writeContractAsync({ chainId:activeChainId, address:CONTRACT_ADDRESS, abi:ABI, functionName:'setAuditLog', args:[false] }); }catch{}
  }

  /** owner-only export (WL/FM) */
  async function exportSpotsCsv() {
    if (!isOwner || !wagmiPublic) return;
    const START = BigInt(14244229);
    const STEP  = BigInt(5000);
    const latest = await wagmiPublic.getBlockNumber();
    const rows: string[] = ['type,player,blockNumber,txHash,logIndex'];
    for (let from = START; from <= latest; from += STEP) {
      const to = (from + STEP - BigInt(1)) > latest ? latest : (from + STEP - BigInt(1));
      const logs = await wagmiPublic.getLogs({ address: CONTRACT_ADDRESS, fromBlock: from, toBlock: to });
      for (const log of logs) {
        const ev = decodeLogSafe(log); if(!ev) continue;
        if (ev.eventName === 'WhitelistWon' || ev.eventName === 'FreeMintWon') {
          const player = (ev as any).args.player as `0x${string}`;
          rows.push(`${ev.eventName},${player},${log.blockNumber?.toString() || ''},${log.transactionHash || ''},${log.logIndex?.toString() || ''}`);
        }
      }
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `megapunks_spots_${Number(START)}_${Number(latest)}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function onAllStopped(){
    stop('spin');
    setGrayscale(false);
    if (result) { if (bigWin(result)) play('win',{restart:true,volume:1}); else play('tick',{restart:true,volume:0.85}); }
    else play('tick',{restart:true,volume:0.85});
  }

  /* ===== Modal state & share props ===== */
  const isModalOpen = Boolean(result && !spinning && isConnected);
  const amountEth = typeof result?.prizeWei !== 'undefined' ? fmtEth(result?.prizeWei,5) : undefined;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/play/slot` : 'https://megapunks.org/play/slot';

  return (
    <main data-skin="neon" className={`mx-auto max-w-6xl px-4 py-3 text-zinc-100 ${grayscale ? 'grayscale' : ''}`} style={{ imageRendering:'pixelated' as any }}>
      {/* Hero + pixel sound */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[42px] leading-tight font-extrabold tracking-[0.02em] drop-shadow-[0_0_12px_rgba(0,229,255,.35)] text-cyan-200">
            Spin the MegaETH Slot
          </h1>
          <p className="mt-2 text-sm sm:text-base text-cyan-100/90">
            One spin a day. ETH &amp; spots up for grabs.
          </p>
        </div>
        <div className="mt-1">
          <button onClick={() => setMuted(m => !m)} className="pixel-sound-btn" title={muted ? 'Unmute' : 'Mute'}>
            <span className="inline-block mr-1">{muted ? '🔇' : '🔊'}</span>
            <span>Sound</span>
          </button>
        </div>
      </div>

      {/* Owner tools */}
      <div className="mt-3 flex items-center gap-2 justify-end">
        {isOwner && (
          <>
            {auditOn && (
              <button onClick={disableAuditManually} className="rounded-lg border border-amber-500/60 bg-amber-500/10 px-3 py-1 text-xs sm:text-sm hover:bg-amber-500/20">Disable audit</button>
            )}
            <button onClick={exportSpotsCsv} className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-xs sm:text-sm hover:bg-emerald-500/20">Export spots CSV</button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <PixelCard><div className="p-4"><div className="text-sm text-cyan-200/90">Prize Pool</div><div className="mt-1 text-2xl text-cyan-100">{prizePoolWei !== undefined ? `${fmtEth(prizePoolWei,5)} ETH` : '—'}</div></div></PixelCard>
        <PixelCard><div className="p-4"><div className="text-sm text-emerald-200/90">WL Remaining</div><div className="mt-1 text-2xl text-emerald-100">{wlRemaining !== undefined ? wlRemaining.toString() : '—'}</div></div></PixelCard>
        <PixelCard><div className="p-4"><div className="text-sm text-yellow-200/90">FreeMint Remaining</div><div className="mt-1 text-2xl text-yellow-100">{fmRemaining !== undefined ? fmRemaining.toString() : '—'}</div></div></PixelCard>
      </div>

      {/* Machine + panel */}
      <div className="machine-stack mt-6 sm:mt-8 space-y-0">
        <SkinnedSlot spinning={spinning} target={target} onAllStopped={onAllStopped} idle={!isConnected && !spinning} leverKickSignal={leverKick} />
        <MachinePanel h={h} m={m} s={s} feeEth={fmtEth(feeWei,5)} onSpin={handleSpin} disabled={(isConnected && (!allowedToday || loading))} />
      </div>

      {/* Result Modal (shared faucet style) */}
      <SlotResultModal
        isOpen={isModalOpen}
        onRequestClose={() => setResult(null)}
        twitterHandle="Megaeth_Punks"
        shareUrl={shareUrl}
        result={isModalOpen ? { amountEth, wonWL: !!result?.wl, wonFM: !!result?.fm, txHash: txHash || undefined } : null}
      />

      <style jsx>{`
        .machine-stack .control-panel .panel-wood{ border-top-left-radius: 0; border-top-right-radius: 0; }
        .pixel-sound-btn{
          display:inline-flex; align-items:center; gap:6px;
          padding: 8px 14px; font-weight:900; color:#1a1300; border:0;
          background: linear-gradient(180deg,#FFD84D,#FF9D00);
          clip-path: polygon(0 8px,8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px));
          box-shadow: 0 4px 0 #7a3b00, 0 0 0 2px #5b2a00 inset;
          image-rendering: pixelated;
        }
        @media (max-width: 640px){
          main { padding-left: 12px; padding-right: 12px; }
        }
      `}</style>
    </main>
  );
}
