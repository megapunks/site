'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useChainId,
  useSwitchChain,
} from 'wagmi';
import {
  decodeEventLog,
  formatEther,
  parseEther,
  parseGwei,
  type Hex,
  createPublicClient,
  defineChain,
  http,
  type PublicClient,
  parseAbiItem,
} from 'viem';

/* =========================
   Contract (V6 aligned)
========================= */
const CONTRACT_ADDRESS = '0xC73AAA1294303AEb04419520c63c14BBbd7D4c8d' as const;

const ABI = [
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"adminWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"AlreadyCommitted","type":"error"},
  {"inputs":[],"name":"AlreadyRevealed","type":"error"},
  {"inputs":[],"name":"AlreadySpunThisPeriod","type":"error"},
  {"inputs":[],"name":"BadEntryFee","type":"error"},
  {"inputs":[],"name":"BadReveal","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"},{"internalType":"bytes32","name":"seedHash","type":"bytes32"}],"name":"commitSeed","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"InsufficientReserve","type":"error"},
  {"inputs":[],"name":"NoCommit","type":"error"},
  {"inputs":[],"name":"NotOwner","type":"error"},
  {"inputs":[],"name":"Reentrant","type":"error"},
  {"inputs":[],"name":"TransferFailed","type":"error"},
  {"inputs":[],"name":"ZeroAddress","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wlQuotaEff","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fmQuotaEff","type":"uint256"}],"name":"EpochInitialized","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fmRemainingInEpoch","type":"uint256"}],"name":"FreeMintWon","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Funded","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"name":"revealSeed","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"seedHash","type":"bytes32"}],"name":"SeedCommitted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"seed","type":"bytes32"}],"name":"SeedRevealed","type":"event"},
  {"inputs":[{"internalType":"bool","name":"on","type":"bool"}],"name":"setAuditLog","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"seconds_","type":"uint256"}],"name":"setBackstopWindow","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"wlPerEpoch","type":"uint256"},{"internalType":"uint256","name":"fmPerEpoch","type":"uint256"}],"name":"setEpochQuotas","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newReserve","type":"uint256"}],"name":"setMinReserve","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"spin","outputs":[],"stateMutability":"payable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"spinIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeRoll","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeWei","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"entropy","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"periodSaltHash","type":"bytes32"}],"name":"Spun","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeRoll","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prizeWei","type":"uint256"}],"name":"SpunLite","type":"event"},
  {"inputs":[],"name":"syncEpoch","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"periodId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wlRemainingInEpoch","type":"uint256"}],"name":"WhitelistWon","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},
  {"stateMutability":"payable","type":"fallback"},
  {"stateMutability":"payable","type":"receive"},
  {"inputs":[],"name":"auditLog","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"backstopWindow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"currentEpochId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"currentEpochStatus","outputs":[{"internalType":"uint256","name":"periodId","type":"uint256"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"},{"internalType":"uint256","name":"secsLeft","type":"uint256"},{"internalType":"uint256","name":"wlEff","type":"uint256"},{"internalType":"uint256","name":"fmEff","type":"uint256"},{"internalType":"uint256","name":"wlGiven","type":"uint256"},{"internalType":"uint256","name":"fmGiven","type":"uint256"},{"internalType":"uint256","name":"wlRemain","type":"uint256"},{"internalType":"uint256","name":"fmRemain","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ENTRY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochFMQuotaEff","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochSeedCommit","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochSeedReveal","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"}],"name":"epochTimes","outputs":[{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"}],"stateMutability":"pure","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"}],"name":"epochWinnerCounts","outputs":[{"internalType":"uint256","name":"wl","type":"uint256"},{"internalType":"uint256","name":"fm","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochWLQuotaEff","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"fmGivenInEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"fmQuotaPerEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"fmWinnerAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"fmWinnersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"},{"internalType":"uint256","name":"startIdx","type":"uint256"},{"internalType":"uint256","name":"endIdx","type":"uint256"}],"name":"getFMWinnersRange","outputs":[{"internalType":"address[]","name":"out","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"},{"internalType":"uint256","name":"startIdx","type":"uint256"},{"internalType":"uint256","name":"endIdx","type":"uint256"}],"name":"getWLWinnersRange","outputs":[{"internalType":"address[]","name":"out","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"gotFreeMint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"gotWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastInitializedEpochId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastSpinPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"minReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"RAND_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"RAND_MIN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"periodId","type":"uint256"}],"name":"secondsLeftInEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalPayout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSpins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"wlGivenInEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"wlQuotaPerEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"wlWinnerAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"wlWinnersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;

/* ============ Gas caps (.env) ============ */
const ENV_MAX_FEE = process.env.NEXT_PUBLIC_MAX_FEE_GWEI;
const ENV_MAX_PRIO = process.env.NEXT_PUBLIC_MAX_PRIORITY_GWEI;

/* ============ Export tuning (.env) ============ */
const DEPLOY_BLOCK = BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || '0');
const LOG_CHUNK    = BigInt(process.env.NEXT_PUBLIC_LOG_CHUNK   || '20000');
const RATE_SLEEPMS = Number(process.env.NEXT_PUBLIC_LOG_RATE_MS || '300');

const EV_WL = parseAbiItem('event WhitelistWon(address indexed player, uint256 indexed periodId, uint256 wlRemainingInEpoch)');
const EV_FM = parseAbiItem('event FreeMintWon(address indexed player, uint256 indexed periodId, uint256 fmRemainingInEpoch)');

/* =========================
   Sounds (+ ambience)
========================= */
const SOUND = {
  lever: '/sounds/lever.mp3',
  spin: '/sounds/spin_loop.mp3',
  brake: '/sounds/brake.mp3',
  tick: '/sounds/tick.mp3',
  win: '/sounds/win.mp3',
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

/** decodeEventLog (fallback decoder) */
function decodeLogSafe(log: { data?: Hex; topics?: readonly Hex[] | Hex[] }) {
  const topicsArr = (log.topics ?? []) as Hex[];
  if (topicsArr.length === 0) return null;
  try {
    const tuple = [topicsArr[0], ...topicsArr.slice(1)] as [Hex, ...Hex[]];
    return decodeEventLog({
      abi: ABI,
      data: (log.data || '0x') as Hex,
      topics: tuple,
    });
  } catch {
    return null;
  }
}

/* =========================
   PNG Symbols
========================= */
type SymbolKey = 'diamond' | 'seven' | 'lemon' | 'cherry' | 'bell' | 'mystery' | 'coin' | 'clover';
const SYMBOLS: SymbolKey[] = ['diamond', 'seven', 'lemon', 'cherry', 'bell', 'mystery', 'coin', 'clover'];
const SYM_SRC: Record<SymbolKey, string> = {
  diamond: '/symbols/diamond.png',
  seven: '/symbols/seven.png',
  lemon: '/symbols/lemon.png',
  cherry: '/symbols/cherry.png',
  bell: '/symbols/bell.png',
  mystery: '/symbols/mystery.png',
  coin: '/symbols/coin.png',
  clover: '/symbols/clover.png',
};
const randSym = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
function nonMatch(): SymbolKey[] {
  const a = randSym(), b = randSym();
  let c: SymbolKey = randSym();
  if (a === b) { while (c === a) c = randSym(); }
  else if (c === a || c === b) {
    let alt: SymbolKey = randSym();
    while (alt === a || alt === b) alt = randSym();
    c = alt;
  }
  return [a, b, c];
}
function twoKind(sym: SymbolKey): SymbolKey[] {
  let other: SymbolKey = randSym();
  while (other === sym) other = randSym();
  const pos = Math.floor(Math.random() * 3);
  const arr: SymbolKey[] = [other, other, other];
  arr[pos] = sym; arr[(pos + 1) % 3] = sym;
  return arr;
}
function targetFromResult(prizeWei?: bigint, wl?: boolean, fm?: boolean): SymbolKey[] {
  if (fm) return ['diamond', 'diamond', 'diamond'];
  if (wl) return ['clover', 'clover', 'clover'];
  if (prizeWei && prizeWei >= parseEther('1')) return ['seven', 'seven', 'seven'];
  if (prizeWei && prizeWei >= parseEther('0.5')) return ['bell', 'bell', 'bell'];
  if (prizeWei && prizeWei >= parseEther('0.2')) return twoKind('coin');
  if (prizeWei && prizeWei >= parseEther('0.1')) return twoKind('lemon');
  return nonMatch();
}

/* ------- 1559 caps ------- */
async function getCapped1559(pc: PublicClient | null) {
  if (!pc) return null;
  try {
    const fees = await pc.estimateFeesPerGas();
    const base = (fees.maxFeePerGas && fees.maxPriorityFeePerGas)
      ? (fees.maxFeePerGas - fees.maxPriorityFeePerGas)
      : (await pc.getBlock()).baseFeePerGas ?? BigInt(0);

    if (!ENV_MAX_FEE || !ENV_MAX_PRIO) return null;
    const capFee = parseGwei(ENV_MAX_FEE);
    const capPrio = parseGwei(ENV_MAX_PRIO);

    let maxPriorityFeePerGas = fees.maxPriorityFeePerGas ?? capPrio;
    if (maxPriorityFeePerGas > capPrio) maxPriorityFeePerGas = capPrio;

    let maxFeePerGas = fees.maxFeePerGas ?? (base * BigInt(2) + maxPriorityFeePerGas);
    if (maxFeePerGas > capFee) maxFeePerGas = capFee;

    if (maxFeePerGas < base + maxPriorityFeePerGas) return null;
    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch {
    return null;
  }
}

/* =========================
   Pixel Frame
========================= */
function PixelFrame({
  label,
  value,
  tone = 'cyan',
  pulse = false,
  compact = true,
  width,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'cyan' | 'emerald' | 'yellow' | 'pink';
  pulse?: boolean;
  compact?: boolean;
  width?: number | string;
}) {
  const palette = {
    cyan: { glow: 'rgba(0,229,255,.22)', border: '#46f0ff', text: 'text-cyan-100' },
    emerald: { glow: 'rgba(16,255,160,.20)', border: '#4bffb2', text: 'text-emerald-100' },
    yellow: { glow: 'rgba(255,216,0,.20)', border: '#ffd84d', text: 'text-yellow-100' },
    pink: { glow: 'rgba(255,0,128,.18)', border: '#ff78c9', text: 'text-pink-100' },
  }[tone];

  const H = compact ? 100 : 120;
  const W = typeof width === 'number' ? `${width}px` : (width ?? '300px');

  return (
    <div
      className={`mp-pixel-box ${pulse ? 'is-pulse' : ''}`}
      style={{ ['--mp-border' as any]: palette.border, ['--mp-glow' as any]: palette.glow, ['--h' as any]: `${H}px`, ['--w' as any]: W }}
    >
      <div className="mp-pixel-inner">
        <div className="text-[18px] sm:text-base opacity-90 text-cyan-200 leading-none">{label}</div>
        <div className={`mt-1.5 sm:mt-2 text-xl sm:text-2xl ${palette.text}`}>{value}</div>
      </div>

      <style jsx>{`
        .mp-pixel-box{ position: relative; padding: 9px 10px; height: var(--h); width: var(--w); background: linear-gradient(180deg, rgba(16,20,48,.9), rgba(10,14,32,.9)); clip-path: polygon(0 12px,12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px)); box-shadow: 0 0 0 2px rgba(0,0,0,.45) inset, 0 0 22px var(--mp-glow); image-rendering: pixelated; transition: box-shadow .2s ease, filter .2s ease; }
        .mp-pixel-box:before{ content:''; position:absolute; inset:6px; box-shadow: 0 0 0 4px var(--mp-border) inset; opacity:.35; pointer-events:none; clip-path: polygon(0 10px,10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px)); }
        .mp-pixel-box:after{ content:''; position:absolute; left:10px; right:10px; top:10px; height:10px; background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0)); opacity:.35; pointer-events:none; clip-path: polygon(0 0,100% 0,100% 10px,0 10px); }
        .mp-pixel-box:hover{ filter: brightness(1.03); }
        .mp-pixel-inner{ height: 100%; display: grid; align-content: center; border-radius: 3px; justify-items: center; padding: 10px 12px; background: linear-gradient(180deg, rgba(14,18,40,.85), rgba(9,12,26,.85)), radial-gradient(1px 1px at 1px 1px, rgba(255,255,255,.06) 1px, transparent 1px); background-size: auto, 6px 6px; box-shadow: 0 0 0 2px rgba(255,255,255,.04) inset; text-shadow: 0 1px 0 rgba(0,0,0,.35); }
        .mp-pixel-box.is-pulse{ animation: mpPulse 1.1s ease-in-out 3; }
        @keyframes mpPulse{ 0%,100%{ box-shadow: 0 0 0 2px rgba(0,0,0,.45) inset, 0 0 22px var(--mp-glow); } 50% { box-shadow: 0 0 0 2px rgba(0,0,0,.45) inset, 0 0 38px var(--mp-glow); } }
      `}</style>
    </div>
  );
}

/* =========================
   Sounds hooks + ambience
========================= */
function useSounds() {
  const [muted, setMuted] = useState(false);
  const refs = useRef<{ [k: string]: HTMLAudioElement }>({} as any);

  useEffect(() => {
    refs.current.lever = new Audio(SOUND.lever);
    refs.current.spin = new Audio(SOUND.spin);
    refs.current.brake = new Audio(SOUND.brake);
    refs.current.win = new Audio(SOUND.win);
    refs.current.ambience = new Audio(SOUND.ambience);
    refs.current.spin.loop = true;
    refs.current.ambience.loop = true;
    Object.values(refs.current).forEach(a => { a.preload = 'auto'; a.volume = 0.9; a.muted = muted; });
    return () => Object.values(refs.current).forEach(a => a.pause());
  }, []);

  useEffect(() => {
    Object.values(refs.current).forEach(a => { a.muted = muted; });
  }, [muted]);

  const ensureAmbience = () => {
    const a = refs.current.ambience;
    if (!a) return;
    if (a.paused) {
      a.currentTime = 0;
      a.volume = 0.35;
      a.play().catch(() => {});
    }
  };

  const play = (key: keyof typeof SOUND, opt?: { restart?: boolean; volume?: number }) => {
    const a = refs.current[key];
    if (!a) return;
    if (opt?.volume !== undefined) a.volume = opt.volume;
    if (opt?.restart ?? true) a.currentTime = 0;
    a.play().catch(() => {});
  };

  const stop = (key: keyof typeof SOUND) => {
    const a = refs.current[key];
    if (!a) return;
    try { a.pause(); } catch {}
  };

  return { play, stop, muted, setMuted, ensureAmbience };
}

/* —— Silence global click sfx (this page only) —— */
function useSilenceSiteClickSfx() {
  useEffect(() => {
    const hush = () => {
      document.querySelectorAll('audio').forEach((a) => {
        const el = a as HTMLAudioElement;
        if (el && (el.dataset.role === 'ui-click' || /click|tap|button/i.test(el.src))) {
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
   Reel
========================= */
type ReelMode = 'idle' | 'spin' | 'brake';
function Reel({
  targetSym, globalSpinning, stopDelayMs, onStop, idle,
}: {
  targetSym: SymbolKey; globalSpinning: boolean; stopDelayMs: number; onStop?: () => void; idle: boolean;
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

  const [mode, setMode] = useState<ReelMode>('idle');
  const [pos, setPos] = useState(0);
  const [landing, setLanding] = useState(false);

  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const tRef = useRef<number>(0);
  const brakeCfg = useRef<{ start: number; from: number; to: number; dur: number } | null>(null);
  const prevSpin = useRef(false);

  const SPIN_SPEED = 1200;
  const BRAKE_MS = 1500;
  const EXTRA_CYCLES = 3;

  useEffect(() => {
    function loop(now: number) {
      if (!tRef.current) tRef.current = now;
      const dt = (now - tRef.current) / 1000; tRef.current = now;

      if (mode === 'spin') {
        const v = SPIN_SPEED;
        let np = posRef.current + v * dt;
        if (np >= 1e7) np = np % CYCLE_H;
        posRef.current = np;
        setPos(np % CYCLE_H);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (mode === 'idle') {
        const v = idle ? 60 : 0;
        const np = (posRef.current + v * dt) % CYCLE_H;
        posRef.current = np;
        setPos(np);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (mode === 'brake' && brakeCfg.current) {
        const { start, from, to, dur } = brakeCfg.current;
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const np = from + (to - from) * eased;
        posRef.current = np;
        setPos(np % CYCLE_H);
        if (t >= 1) {
          setLanding(true);
          setTimeout(() => setLanding(false), 240);
          setMode('idle');
          onStop?.();
          return;
        }
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    cancelAnimationFrame(rafRef.current ?? -1);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current ?? -1);
  }, [mode, idle, CYCLE_H, onStop]);

  useEffect(() => {
    if (globalSpinning && !prevSpin.current) {
      setMode('spin');
    }
    if (!globalSpinning && prevSpin.current) {
      const timer = setTimeout(() => {
        const idx = SYMBOLS.indexOf(targetSym);
        const current = posRef.current;
        const base = current - (current % CYCLE_H);
        let targetAbs = base + idx * cellH;
        if (targetAbs <= current) targetAbs += CYCLE_H;
        targetAbs += CYCLE_H * EXTRA_CYCLES;
        brakeCfg.current = { start: performance.now(), from: current, to: targetAbs, dur: BRAKE_MS + stopDelayMs * 0.18 };
        setMode('brake');
      }, stopDelayMs);
      return () => clearTimeout(timer);
    }
    prevSpin.current = globalSpinning;
  }, [globalSpinning, stopDelayMs, targetSym, cellH, CYCLE_H]);

  useEffect(() => { if (!globalSpinning && idle) setMode('idle'); }, [globalSpinning, idle]);

  const icon = Math.round(cellH * 0.74);

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' as any, borderRadius: 8, background: 'transparent', border: 'none' }}>
      <div className={`absolute left-0 top-0 w-full will-change-transform ${landing ? 'scale-105' : ''}`} style={{ transform: `translateY(-${pos}px)` }}>
        {STRIP.map((s, i) => (
          <div key={i} className="flex items-center justify-center select-none" style={{ height: cellH }}>
            <img src={SYM_SRC[s]} alt={s} style={{ width: icon, height: icon, imageRendering: 'pixelated' as any }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   Skinned Slot
========================= */
const SKIN_URL = '/skins/slot-skin.png';
const LEVER_URL = '/skins/lvl.png';
const ASPECT_W = 850;
const ASPECT_H = 365;
const INNER = { left: 5.0, right: 9.0, top: 19.5, bottom: 26.5 };

function SkinnedSlot({
  spinning, target, onAllStopped, idle, leverKickSignal,
}: {
  spinning: boolean; target: SymbolKey[]; onAllStopped: () => void; idle: boolean; leverKickSignal: number;
}) {
  const [stopped, setStopped] = useState(0);
  const [leverDown, setLeverDown] = useState(false);

  useEffect(() => {
    if (stopped === 3) { onAllStopped(); setStopped(0); }
  }, [stopped, onAllStopped]);

  useEffect(() => {
    if (leverKickSignal > 0) {
      setLeverDown(true);
      const t = setTimeout(() => setLeverDown(false), 380);
      return () => clearTimeout(t);
    }
  }, [leverKickSignal]);

  return (
    <div className="relative mx-auto w-full max-w-[900px]" style={{ aspectRatio: `${ASPECT_W} / ${ASPECT_H}`, imageRendering: 'pixelated' as any }}>
      <div className="absolute inset-0 bg-no-repeat bg-center" style={{ backgroundImage: `url(${SKIN_URL})`, backgroundSize: 'contain', imageRendering: 'pixelated' as any }} aria-hidden />
      <img src={LEVER_URL} alt="lever" className="absolute pointer-events-none select-none transition-transform duration-300" style={{ top: '37.5%', right: '-3.5%', width: '9.8%', transform: leverDown ? 'translateY(10%)' : 'translateY(0)', transformOrigin: 'top center', imageRendering: 'pixelated' as any }} />
      <div className="absolute grid grid-cols-3" style={{ left: `${INNER.left}%`, right: `${INNER.right}%`, top: `${INNER.top}%`, bottom: `${INNER.bottom}%`, imageRendering: 'pixelated' as any }}>
        <Reel targetSym={target[0]} globalSpinning={spinning} stopDelayMs={0} idle={idle} onStop={() => setStopped(v => v + 1)} />
        <Reel targetSym={target[1]} globalSpinning={spinning} stopDelayMs={250} idle={idle} onStop={() => setStopped(v => v + 1)} />
        <Reel targetSym={target[2]} globalSpinning={spinning} stopDelayMs={500} idle={idle} onStop={() => setStopped(v => v + 1)} />
      </div>
    </div>
  );
}

/* =========================
   Control Panel
========================= */
function MachinePanel({ h, m, s, feeEth, onSpin, disabled }: { h: number; m: number; s: number; feeEth: string; onSpin: () => void; disabled?: boolean; }) {
  return (
    <div className="control-panel">
      <div className="panel-wood">
        <div className="panel-inner">
          <div className="lcd">
            <span className="label">Epoch ends in</span>
            <span className="digits">{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button className="slot-btn" onClick={onSpin} disabled={disabled} title={`Entry: ${feeEth} ETH`}>
              <span className="slot-btn-line"><span className="slot-btn-title">SLOT</span><span className="slot-btn-badge">{feeEth} ETH</span></span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .control-panel{ margin-top: 10px; }
        .panel-wood{ position: relative; border-radius: 0 0 10px 10px; padding: 8px; background: transparent; box-shadow: none; border: none; image-rendering: pixelated; }
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
        .slot-btn-badge{ font-weight:900; padding:6px 10px; font-size:12px; color:#1a1300; background: rgba(0,0,0,.18); clip-path: polygon(0 8px,8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%); box-shadow: 0 0 0 2px #5b2a00 inset; white-space: nowrap; }
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

type EpochStatus = {
  periodId: bigint; start: bigint; end: bigint; secsLeft: bigint;
  wlEff: bigint; fmEff: bigint; wlGiven: bigint; fmGiven: bigint; wlRemain: bigint; fmRemain: bigint;
};

function useLiveContractReads(args: { publicClient: PublicClient | null, address?: `0x${string}` }) {
  const { publicClient, address } = args;
  const [state, setState] = useState<{
    entryFee?: bigint;
    prizePool?: bigint;
    auditLog?: boolean;
    owner?: `0x${string}`;
    currentEpochId?: bigint;
    epoch?: EpochStatus;
    lastSpinPeriod?: bigint;
    canSpinNow?: boolean;
  }>({});

  const standalone = useMemo(() => {
    if (!MEGA_RPC) return null;
    try {
      return createPublicClient({ chain: megaChain, transport: http(MEGA_RPC) });
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    async function fetchAll() {
      const client = standalone ?? publicClient;
      if (!client) return;
      try {
        const [ef, auditLog, owner, epochId, epoch] = await Promise.all([
          client.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'ENTRY_FEE' }) as Promise<bigint>,
          client.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'auditLog' }) as Promise<boolean>,
          client.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'owner' }) as Promise<`0x${string}`>,
          client.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'currentEpochId' }) as Promise<bigint>,
          client.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'currentEpochStatus' }) as Promise<any>,
        ]);

        const pp = await client.getBalance({ address: CONTRACT_ADDRESS });

        let lastSpinPeriod: bigint | undefined = undefined;
        let canSpinNow: boolean | undefined = undefined;
        if (address) {
          try {
            lastSpinPeriod = await client.readContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'lastSpinPeriod', args: [address] }) as unknown as bigint;
            canSpinNow = (lastSpinPeriod !== epochId);
          } catch { /* ignore */ }
        }

        const epochStatus: EpochStatus = {
          periodId: epoch.periodId ?? epoch[0],
          start: epoch.start ?? epoch[1],
          end: epoch.end ?? epoch[2],
          secsLeft: epoch.secsLeft ?? epoch[3],
          wlEff: epoch.wlEff ?? epoch[4],
          fmEff: epoch.fmEff ?? epoch[5],
          wlGiven: epoch.wlGiven ?? epoch[6],
          fmGiven: epoch.fmGiven ?? epoch[7],
          wlRemain: epoch.wlRemain ?? epoch[8],
          fmRemain: epoch.fmRemain ?? epoch[9],
        };

        if (alive) setState({ entryFee: ef, prizePool: pp, auditLog, owner, currentEpochId: epochId, epoch: epochStatus, lastSpinPeriod, canSpinNow });
      } catch { /* silent */ }
    }
    fetchAll();
    const id = setInterval(fetchAll, 8000);
    return () => { alive = false; clearInterval(id); };
  }, [publicClient, standalone, address]);

  return state;
}

/* =========================
   Epoch countdown
========================= */
function useEpochCountdown(secsLeftFromChain?: bigint) {
  const [ms, setMs] = useState<number>(() => Number((secsLeftFromChain ?? BigInt(0))) * 1000);
  useEffect(() => { setMs(Number((secsLeftFromChain ?? BigInt(0))) * 1000); }, [secsLeftFromChain]);
  useEffect(() => { const id = setInterval(() => setMs(v => Math.max(0, v - 1000)), 1000); return () => clearInterval(id); }, []);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { h, m, s };
}

/* =========================
   FAQ (Accordion)
========================= */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const Accent = ({ children }: { children: React.ReactNode }) => (
    <span className="font-extrabold text-emerald-300">{children}</span>
  );
  const Danger = ({ children }: { children: React.ReactNode }) => (
    <span className="font-extrabold text-pink-300">{children}</span>
  );
  const Info = ({ children }: { children: React.ReactNode }) => (
    <span className="font-extrabold text-cyan-300">{children}</span>
  );

  const items: { q: string; a: React.ReactNode }[] = [
    { q: 'How often can I spin?', a: (<p className="leading-relaxed">Once every <Accent>6 hours</Accent> (<b>per epoch</b>). If you already spun in the current epoch, wait for the next one.</p>) },
    {
      q: 'Entry fee & ETH prizes', a: (
        <ul className="list-disc pl-5 space-y-2 leading-relaxed">
          <li>Entry per spin: <Accent>0.001 ETH</Accent>.</li>
          <li>Random band: <Accent>0.001 – 0.003 ETH</Accent> (<b>avg ≈ 0.002</b>).</li>
          <li>Bigger hits from the main roll: <Accent>0.01</Accent> / <Accent>0.1</Accent> / <Accent>0.2</Accent> / <Accent>0.5</Accent> / <Accent>1</Accent> ETH.</li>
        </ul>
      )
    },
    {
      q: 'What are the odds?', a: (
        <div className="overflow-x-auto">
          <table className="min-w-[520px] text-[15px] md:text[16px]">
            <thead>
              <tr className="text-cyan-200/90">
                <th className="text-left py-1 pr-4">Prize</th>
                <th className="text-left py-1 pr-4">Roll range</th>
                <th className="text-left py-1">Approx. chance</th>
              </tr>
            </thead>
            <tbody className="opacity-95">
              <tr><td>1 ETH</td><td>roll = 1</td><td><Accent>0.1%</Accent></td></tr>
              <tr><td>0.5 ETH</td><td>roll = 2</td><td><Accent>0.1%</Accent></td></tr>
              <tr><td>0.2 ETH</td><td>3..5</td><td><Accent>0.3%</Accent></td></tr>
              <tr><td>0.1 ETH</td><td>6..11</td><td><Accent>0.6%</Accent></td></tr>
              <tr><td>0.01 ETH</td><td>12..51</td><td><Accent>4.0%</Accent></td></tr>
              <tr><td>0.001–0.003</td><td>52..1000</td><td><Accent>94.9%</Accent></td></tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      q: 'How do Whitelist & Free Mint work?', a: (
        <ul className="list-disc pl-5 space-y-2 leading-relaxed">
          <li>Each epoch has at least <Accent>10 Whitelist</Accent> and <Accent>1 Free Mint</Accent>. Any unused spots will <Info>roll over</Info> to the next epoch.</li>
          <li>Awarded by the <b>same main roll</b> (single roll): about <Accent>1%</Accent> for WL (numbers <b>1..10</b>) and <Accent>0.1%</Accent> for Free Mint (e.g. <b>777</b>).</li>
          <li>Per-wallet lifetime cap: max <Accent>one WL</Accent> and <Accent>one Free Mint</Accent>.</li>
        </ul>
      )
    },
    { q: 'What if the prize pool is low?', a: (<p className="leading-relaxed">If the pre-fee contract balance is below <Info>minReserve</Info> or below the prize for that spin, the tx reverts with <Danger>InsufficientReserve</Danger> and <b>no funds move</b>.</p>) },
    { q: 'Which network and why gas?', a: (<p className="leading-relaxed">We are live on the <Accent>MegaEth Testnet</Accent>. Each spin is an on-chain tx; you pay gas <b>plus</b> the <Accent>0.001 ETH</Accent> entry fee.</p>) },
  ];

  return (
    <section className="mt-10 sm:mt-12">
      <div className="mb-2">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-cyan-200 text-xs sm:text-sm font-extrabold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          NETWORK: MegaEth Testnet
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,.35)] mb-4">FAQ / Rules</h2>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className={`rounded-[12px] border transition-colors ${open === idx
              ? 'border-cyan-300/70 bg-gradient-to-br from-cyan-900/25 to-indigo-900/20'
              : 'border-white/10 bg-white/5 hover:border-cyan-300/40'}`}
          >
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="w-full text-left px-5 py-4 font-extrabold flex items-center justify-between text-base md:text-lg tracking-wide"
            >
              <span className="text-cyan-100">{it.q}</span>
              <span className={`text-cyan-200 text-xl md:text-2xl leading-none ${open === idx ? 'rotate-90' : ''}`}>{open === idx ? '−' : '+'}</span>
            </button>
            {open === idx && (
              <div className="px-5 pb-5 pt-0 text-[15px] md:text-[16px] text-zinc-100/95">
                {it.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================
   Export helpers
========================= */
function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function getLogsWithRetry(client: PublicClient, params: any, maxRetries = 5) {
  let delay = 350;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await client.getLogs({ ...params, address: CONTRACT_ADDRESS, events: [EV_WL, EV_FM] });
    } catch (e: any) {
      const msg = (e?.shortMessage || e?.message || '').toLowerCase();
      const rateLimited = /429|rate|limit|too many|throttle/.test(msg);
      const sizeExceeded = /response size|too large|exceed/.test(msg);
      if (i === maxRetries) throw e;

      if (sizeExceeded && typeof params.fromBlock === 'bigint' && typeof params.toBlock === 'bigint') {
        // پرحجم بود، بازه را نصف می‌کنیم (مدیریتش در کالر)
        throw new Error('SPLIT_RANGE');
      }

      if (rateLimited || !msg) {
        await sleep(delay);
        delay = Math.min(delay * 2, 5000);
        continue;
      }
      throw e;
    }
  }
  return [];
}

/* =========================
   Page
========================= */
export default function SlotPage() {
  const expectedChainId = MEGA_CHAIN_ID || 6342;
  const { address, isConnected } = useAccount();
  const connectedChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const wagmiPublic = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const activeChainId = isConnected ? connectedChainId : (wagmiPublic?.chain?.id as number | undefined);
  const wrongNetwork = !!(activeChainId && activeChainId !== expectedChainId);

  const live = useLiveContractReads({ publicClient: wagmiPublic ?? null, address: address ?? undefined });

  const feeWei = live.entryFee ?? parseEther('0.001');
  const prizePoolWei = live.prizePool;
  const wlRemainEpoch = live.epoch?.wlRemain;
  const fmRemainEpoch = live.epoch?.fmRemain;
  const allowedNow = live.canSpinNow ?? false;
  const auditOn = live.auditLog ?? true;
  const isOwner = isConnected && live.owner && address && live.owner.toLowerCase() === address.toLowerCase();

  const { h, m, s } = useEpochCountdown(live.epoch?.secsLeft);
  const { play, stop, muted, setMuted, ensureAmbience } = useSounds();

  useSilenceSiteClickSfx();
  useAmbienceAutostart(ensureAmbience);

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [result, setResult] = useState<{ prizeWei?: bigint; wl?: boolean; fm?: boolean } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [target, setTarget] = useState<SymbolKey[]>(['diamond', 'diamond', 'diamond']);
  const [grayscale, setGrayscale] = useState(false);
  const [leverKick, setLeverKick] = useState(0);
  const disablingAuditOnce = useRef(false);

  const [ppPulse, setPpPulse] = useState(false);
  const prevPP = useRef<bigint | undefined>(undefined);

  // Auto-disable audit log once (owner convenience)
  useEffect(() => {
    (async () => {
      if (!isOwner || !auditOn || disablingAuditOnce.current || !activeChainId) return;
      disablingAuditOnce.current = true;
      try {
        await writeContractAsync({ chainId: activeChainId, address: CONTRACT_ADDRESS, abi: ABI, functionName: 'setAuditLog', args: [false] });
      } catch { /* ignore */ }
    })();
  }, [isOwner, auditOn, activeChainId, writeContractAsync]);

  // Prize pool pulse
  useEffect(() => {
    if (typeof prizePoolWei !== 'undefined' && prevPP.current !== undefined && prizePoolWei !== prevPP.current) {
      setPpPulse(true);
      const t = setTimeout(() => setPpPulse(false), 1400);
      return () => clearTimeout(t);
    }
    prevPP.current = prizePoolWei;
  }, [prizePoolWei]);

  const bigWin = (r?: { prizeWei?: bigint; wl?: boolean; fm?: boolean }) => !!r && (r.fm || r.wl || (r.prizeWei && r.prizeWei >= parseEther('0.5')));

  async function handleSpin() {
    ensureAmbience();
    setLeverKick(x => x + 1);
    play('lever', { restart: true, volume: 0.9 });

    // Ensure network
    if (isConnected && wrongNetwork) {
      try {
        await switchChainAsync({ chainId: expectedChainId });
      } catch {
        alert('Please switch to MegaEth Testnet to spin.');
        return;
      }
    }

    const canWrite = isConnected && activeChainId;
    if (!canWrite) {
      // demo spin
      setResult(null); setGrayscale(false); setSpinning(true); play('spin', { restart: true, volume: 0.6 });
      const r = Math.random(); const demoTarget = r < 0.15 ? twoKind('bell') : r < 0.30 ? twoKind('lemon') : nonMatch();
      setTimeout(() => { setTarget(demoTarget); play('brake', { restart: true, volume: 0.7 }); setSpinning(false); }, 600);
      return;
    }
    if (!allowedNow || loading) return;

    try {
      setLoading(true); setResult(null); setGrayscale(false); setSpinning(true); play('spin', { restart: true, volume: 0.6 });

      let gas: bigint | undefined;
      try {
        const est = await wagmiPublic!.estimateContractGas({ address: CONTRACT_ADDRESS, abi: ABI, functionName: 'spin', value: feeWei, account: address! });
        gas = (est * BigInt(110)) / BigInt(100);
      } catch (e: any) {
        console.warn('estimateContractGas failed', e?.shortMessage || e?.message);
      }

      const caps = await getCapped1559(wagmiPublic ?? null);

      const txArgs: any = { chainId: activeChainId, address: CONTRACT_ADDRESS, abi: ABI, functionName: 'spin', value: feeWei };
      if (gas) txArgs.gas = gas;
      if (caps) { txArgs.maxFeePerGas = caps.maxFeePerGas; txArgs.maxPriorityFeePerGas = caps.maxPriorityFeePerGas; }

      const hash = await writeContractAsync(txArgs);
      setTxHash(hash);
      const receipt = await wagmiPublic!.waitForTransactionReceipt({ hash });

      if (receipt.status !== 'success') {
        setSpinning(false);
        stop('spin');
        alert('Transaction reverted. Likely reasons: InsufficientReserve or AlreadySpunThisPeriod, or insufficient gas.');
        return;
      }

      let prizeWei: bigint | undefined; let wl = false; let fm = false;
      for (const log of receipt.logs) {
        const parsed = decodeLogSafe(log);
        if (!parsed) continue;
        if (parsed.eventName === 'Spun') { const a: any = parsed.args; prizeWei = a.prizeWei; }
        if (parsed.eventName === 'SpunLite') { const a: any = parsed.args; prizeWei = a.prizeWei; }
        if (parsed.eventName === 'WhitelistWon') wl = true;
        if (parsed.eventName === 'FreeMintWon') fm = true;
      }

      setTarget(targetFromResult(prizeWei, wl, fm));
      play('brake', { restart: true, volume: 0.75 });
      setSpinning(false);

      const res = { prizeWei, wl, fm };
      setResult(res);

      setTimeout(() => {
        stop('spin');
        if (bigWin(res)) play('win', { restart: true, volume: 1 });
      }, 1600);
    } catch (e: any) {
      setSpinning(false); stop('spin');
      const msg = e?.shortMessage || e?.message || 'Transaction failed';
      alert(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onAllStopped() {
    stop('spin');
    setGrayscale(false);
    if (result && bigWin(result)) {
      play('win', { restart: true, volume: 1 });
    }
  }

  /* ===== Export spots CSV (owner only) ===== */
  async function exportSpotsCsv() {
    if (!isOwner || !wagmiPublic) return;

    try {
      const latest = await wagmiPublic.getBlockNumber();
      const start  = DEPLOY_BLOCK > BigInt(0) ? DEPLOY_BLOCK : BigInt(0);

      const rows: string[] = ['type,player,blockNumber,txHash,logIndex'];

      async function scanRange(from: bigint, to: bigint) {
        let cursor = from;
        while (cursor <= to) {
          const end = (cursor + LOG_CHUNK > to) ? to : (cursor + LOG_CHUNK);
          try {
            const logs = await getLogsWithRetry(wagmiPublic, { fromBlock: cursor, toBlock: end });
            for (const lg of logs as any[]) {
              const type = lg.eventName; // 'WhitelistWon' | 'FreeMintWon'
              const player = lg.args?.player as `0x${string}`;
              rows.push(`${type},${player},${lg.blockNumber?.toString() || ''},${lg.transactionHash || ''},${lg.logIndex?.toString() || ''}`);
            }
            await sleep(RATE_SLEEPMS);
            cursor = end + BigInt(1);
          } catch (e: any) {
            if (e?.message === 'SPLIT_RANGE') {
              const mid = cursor + ((end - cursor) >> BigInt(1));
              await scanRange(cursor, mid);
              await scanRange(mid + BigInt(1), end);
              cursor = end + BigInt(1);
            } else {
              console.error(e);
              alert(`Export failed: ${e?.shortMessage || e?.message || e}`);
              return;
            }
          }
        }
      }

      await scanRange(start, latest);

      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `megapunks_spots_${Number(start)}_${Number(latest)}_${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      alert(`Export failed: ${e?.shortMessage || e?.message || e}`);
    }
  }

  const TW_HANDLE = 'Megaeth_Punks';
  const SHARE_TEMPLATES = (amt: string) => [
    `Spun the @${TW_HANDLE} slot and bagged ${amt} ETH 💰`,
    `Hit spin. Got paid. ${amt} ETH from the @${TW_HANDLE} slot ⚡`,
    `One pull, one win – ${amt} ETH in the wallet! 🎯 Thanks @${TW_HANDLE}`,
    `Lucky lever at @${TW_HANDLE}! Pulled and landed ${amt} ETH ✨`,
    `Epoch spin at @${TW_HANDLE}: ${amt} ETH secured 🧲`,
  ];

  function pickRandomShareText(r: { prizeWei?: bigint; wl?: boolean; fm?: boolean }) {
    const url = typeof window !== 'undefined' ? window.location.origin + '/play/slot' : 'https://megapunks.org/play/slot';
    const extras = r.fm ? ' + FreeMint 🎟️' : r.wl ? ' + Whitelist ✅' : '';
    const amount = typeof r.prizeWei !== 'undefined' ? fmtEth(r.prizeWei, 5) : '0';
    const base = SHARE_TEMPLATES(amount);
    const chosen = base[Math.floor(Math.random() * base.length)];
    return `${chosen}${extras}\n${url}\n#MegaPunks #MegaETH`;
  }

  function tweetShare(r: { prizeWei?: bigint; wl?: boolean; fm?: boolean }) {
    const text = pickRandomShareText(r);
    const intent = new URL('https://twitter.com/intent/tweet');
    intent.searchParams.set('text', text);
    window.open(intent.toString(), '_blank', 'noopener,noreferrer');
  }

  function closeModal() { setResult(null); setGrayscale(false); }

  return (
    <main data-skin="neon" className={`mx-auto max-w-6xl px-4 py-3 text-zinc-100 ${grayscale ? 'grayscale' : ''}`} style={{ imageRendering: 'pixelated' as any }}>
      {/* Hero title + sound button row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[42px] leading-tight font-extrabold tracking-[0.02em] drop-shadow-[0_0_12px_rgba(0,229,255,.35)] text-cyan-200">Spin the MegaETH Slot</h1>
          <p className="mt-2 text-sm sm:text-base text-cyan-100/90">One spin per <b>6h epoch</b>. ETH prizes + per-epoch WL/FM that roll over.</p>
        </div>

        {/* Pixel sound button */}
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
              <button onClick={() => {
                if (!isOwner || !activeChainId) return;
                (async () => {
                  try { await writeContractAsync({ chainId: activeChainId, address: CONTRACT_ADDRESS, abi: ABI, functionName: 'setAuditLog', args: [false] }); } catch {}
                })();
              }} className="rounded-lg border border-amber-500/60 bg-amber-500/10 px-3 py-1 text-xs sm:text-sm hover:bg-amber-500/20" title="Disable audit log to save gas">Disable audit</button>
            )}
            <button onClick={exportSpotsCsv} className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-xs sm:text-sm hover:bg-emerald-500/20" title="Export WL/FM winners to CSV">
              Export spots CSV
            </button>
          </>
        )}
      </div>

      {/* Network guard banner */}
      {isConnected && wrongNetwork && (
        <div className="mt-4 mb-2 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl border border-pink-400/60 bg-pink-500/10 px-4 py-2 text-pink-100">
            <span>You're on the wrong network. Please switch to <b>MegaEth Testnet</b>.</span>
            <button
              onClick={() => switchChainAsync({ chainId: expectedChainId })}
              className="rounded-md border border-pink-400/70 bg-pink-500/20 px-3 py-1 text-sm hover:bg-pink-500/30"
            >Switch</button>
          </div>
        </div>
      )}

      {/* Stats – pixel frames */}
      <div className="mt-5 sm:mt-6 grid grid-flow-col auto-cols-max gap-2 sm:gap-2 justify-center">
        <PixelFrame label="Prize Pool" value={prizePoolWei !== undefined ? `${fmtEth(prizePoolWei, 5)} ETH` : '—'} tone="cyan" pulse={ppPulse} />
        <PixelFrame label="Whitelist (epoch)" value={wlRemainEpoch !== undefined ? wlRemainEpoch.toString() : '—'} tone="emerald" />
        <PixelFrame label="Free Mint (epoch)" value={fmRemainEpoch !== undefined ? fmRemainEpoch.toString() : '—'} tone="yellow" />
      </div>

      {/* Machine + panel */}
      <div className="machine-stack mt-6 sm:mt-8 space-y-0">
        <SkinnedSlot spinning={spinning} target={target} onAllStopped={onAllStopped} idle={!isConnected && !spinning} leverKickSignal={leverKick} />
        <MachinePanel h={h} m={m} s={s} feeEth={fmtEth(feeWei, 5)} onSpin={handleSpin} disabled={(isConnected && (!allowedNow || loading || wrongNetwork))} />
      </div>

      <FAQSection />

      {/* Result Modal */}
      {result && !spinning && isConnected && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl border border-yellow-300 bg-[#1e1b4b] p-6 shadow-2xl text-yellow-200 font-pixel text-center">
            <h3 className="text-xl sm:text-2xl mb-3">🎉 Spin Complete!</h3>
            <div className="text-base leading-relaxed">
              {result.fm && <div className="mb-1">You snagged a <b>FreeMint</b> spot! 🪄</div>}
              {result.wl && <div className="mb-1">You won a <b>Whitelist</b> spot! ✅</div>}
              {typeof result.prizeWei !== 'undefined' ? (
                <div className="mb-1">You pocketed <b>{fmtEth(result.prizeWei, 5)} ETH</b> 🪙</div>
              ) : (
                <div className="mb-1">Spin confirmed. Good luck next time! ✌️</div>
              )}
              {txHash && <div className="text-[11px] opacity-70 mt-2 break-all">Tx: {txHash}</div>}
            </div>
            <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2">
              <button className="button-pixel bg-yellow-400 text-black" onClick={() => tweetShare(result)} title="Share on X">🐦 TWEET IT!</button>
              <button className="button-pixel bg-transparent text-yellow-200 border border-yellow-300/70" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .machine-stack .control-panel .panel-wood{ border-top-left-radius: 0; border-top-right-radius: 0; }
        .pixel-sound-btn{ display:inline-flex; align-items:center; gap:6px; padding: 8px 14px; font-weight:900; color:#1a1300; border:0; background: linear-gradient(180deg,#FFD84D,#FF9D00); clip-path: polygon(0 8px,8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%); box-shadow: 0 4px 0 #7a3b00, 0 0 0 2px #5b2a00 inset; image-rendering: pixelated; }
        .button-pixel{ font-weight:900; padding: 12px 18px; clip-path: polygon(0 10px,10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px)); box-shadow: 0 6px 0 rgba(0,0,0,.35), 0 0 0 2px rgba(0,0,0,.35) inset; }
        @media (max-width: 640px){ main { padding-left: 12px; padding-right: 12px; } }
      `}</style>
    </main>
  );
}
