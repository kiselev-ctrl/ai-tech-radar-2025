import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  X,
  Layers,
  Activity,
  Newspaper,
  Terminal,
  Disc,
  Radio,
  Cpu,
  Send,
  Video,
  Music,
  PenTool,
  Database,
  Crosshair,
  Bug,
  Trophy,
  RotateCcw,
  ArrowUp
} from 'lucide-react';

// --- BRUTALIST STYLES ---
const STYLES = `
  :root {
    --acid-lime: #ccff00;
    --acid-pink: #ff00ff;
    --electric-blue: #00ffff;
    --deep-black: #ffffff; /* White background for body */
    --off-white: #000000; /* Black text */
    --grid-line: #e5e5e5;
  }

  ::selection {
    background: var(--acid-lime);
    color: black;
  }

  body {
    background-color: var(--deep-black);
    color: var(--off-white);
    font-family: 'JetBrains Mono', monospace;
    overflow-x: hidden;
    cursor: crosshair;
  }

  .font-display { font-family: 'Archivo Black', sans-serif; }
  .font-body { font-family: 'Inter', sans-serif; }

  /* Utility Classes for Custom Colors */
  .text-acid-lime { color: var(--acid-lime); }
  .bg-acid-lime { background-color: var(--acid-lime); }
  .bg-deep-black { background-color: var(--deep-black); }
  .border-acid-lime { border-color: var(--acid-lime); }
  
  /* Hover states optimized for light mode */
  .hover\:text-acid-lime:hover { color: #a3cc00; } 
  .hover\:bg-acid-lime:hover { background-color: var(--acid-lime); }
  .hover\:border-acid-lime:hover { border-color: var(--acid-lime); }

  /* CRT Scanline Effect - Very subtle for white */
  .scanlines {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05));
    background-size: 100% 3px;
    pointer-events: none;
    z-index: 50;
    opacity: 0.4;
  }

  /* Marquee Animation */
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
  }
  .marquee-content {
    display: inline-block;
    animation: marquee 40s linear infinite;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Glitch Effect */
  @keyframes glitch {
    0% { transform: translate(0) }
    20% { transform: translate(-2px, 2px) }
    40% { transform: translate(-2px, -2px) }
    60% { transform: translate(2px, 2px) }
    80% { transform: translate(2px, -2px) }
    100% { transform: translate(0) }
  }
  .glitch-hover:hover {
    animation: glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite;
  }

  /* Brutalist Scrollbar */
  ::-webkit-scrollbar { width: 12px; background: #fff; }
  ::-webkit-scrollbar-thumb { background: #000; border: 2px solid #fff; }

  /* Custom Utilities */
  .border-brutal { border: 2px solid #000; }
  
  /* Neo-Retro Card */
  .retro-card {
    background: #ffffff;
    color: #000000;
    border: 2px solid #000000;
    transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
    position: relative;
  }
  .retro-card:hover {
    transform: translate(-4px, -4px);
    box-shadow: 6px 6px 0px #000000;
    z-index: 10;
  }
  
  /* Grid Background */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, #333 1px, transparent 1px),
                      linear-gradient(to bottom, #333 1px, transparent 1px);
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  }
  
  .bg-grid-pattern-light {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, #e5e5e5 1px, transparent 1px),
                      linear-gradient(to bottom, #e5e5e5 1px, transparent 1px);
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  }

  /* Spark Animation */
  @keyframes spark-fly {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  
  .spark {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #000;
    pointer-events: none;
    animation: spark-fly 0.6s ease-out forwards;
    z-index: 100;
  }

  /* Boot Screen */
  .boot-screen {
    position: fixed; inset: 0; background: black; z-index: 9999;
    display: flex; flex-direction: column; justify-content: center; padding: 2rem;
    font-family: 'JetBrains Mono', monospace;
    overflow: hidden;
  }
  
  .boot-text {
    color: var(--acid-lime);
    font-size: 14px;
    line-height: 1.5;
    opacity: 0.8;
  }

  .boot-cursor {
    display: inline-block; width: 10px; height: 18px; background: var(--acid-lime);
    animation: blink 0.1s infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  @keyframes curtain-up {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100%); }
  }
  .curtain-reveal {
    animation: curtain-up 0.8s cubic-bezier(0.87, 0, 0.13, 1) forwards;
    animation-delay: 2.5s;
  }

  /* Game & Animation */
  .game-cursor {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>') 16 16, crosshair !important;
  }

  .shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }

  @keyframes float-target {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -10px) rotate(5deg); }
    50% { transform: translate(-5px, 10px) rotate(-5deg); }
    75% { transform: translate(-10px, -5px) rotate(2deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }

  .hyper-glitch {
    animation: hyper-glitch-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  @keyframes hyper-glitch-anim {
    0% { transform: translate(0); filter: none; }
    20% { transform: translate(-5px, 5px); filter: invert(1); }
    40% { transform: translate(5px, -5px); filter: sepia(1) saturate(3); }
    60% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
    80% { transform: translate(2px, -2px); filter: none; }
    100% { transform: translate(0); filter: none; }
  }
`;

// --- TYPES ---
type CategoryKey = 'CODING' | 'VIDEO' | 'DESIGN' | 'AUDIO' | 'INFO';

interface Category {
  id: CategoryKey;
  label: string;
  fullLabel: string;
  color: string;
  icon: React.ElementType;
}

interface DataItem {
  id: string;
  category: CategoryKey;
  title: string;
  tag: string;
  size: 'large' | 'medium' | 'small';
  desc: string;
  benefit: string;
  price: string;
  link: string;
}

// --- CATEGORIES (Reverted to Neon for Black Tags) ---
const CATEGORIES: Record<CategoryKey, Category> = {
  CODING: { id: 'CODING', label: 'КОДИНГ', fullLabel: 'LLM & IDE', color: '#ccff00', icon: Terminal },
  VIDEO: { id: 'VIDEO', label: 'ВИДЕО', fullLabel: 'Video Gen & Avatars', color: '#ff00ff', icon: Video },
  DESIGN: { id: 'DESIGN', label: 'ДИЗАЙН', fullLabel: 'Art, 3D & Vector', color: '#00ffff', icon: PenTool },
  AUDIO: { id: 'AUDIO', label: 'АУДИО', fullLabel: 'Music & Voice', color: '#ff9900', icon: Music }, 
  INFO: { id: 'INFO', label: 'ИНФО', fullLabel: 'Search & Research', color: '#ffffff', icon: Database } 
};

// --- DATA SET ---
const DATA_SET: DataItem[] = [
  { id: 'v1', category: 'VIDEO', title: 'GOOGLE VEO 3', tag: 'SIMULATION', size: 'large', desc: 'Лидер рынка. Симулятор реальности, а не просто генератор. Создает видео синхронно с аудио (диалоги, шумы). Интеграция с Vertex AI.', benefit: 'AUDIO-VISUAL SYNERGY.', price: 'GOOGLE CLOUD', link: 'https://deepmind.google/technologies/veo/' },
  { id: 'v2', category: 'VIDEO', title: 'OPENAI SORA 2', tag: 'CREATIVE', size: 'medium', desc: 'Инструмент для сюрреализма и концептов. "Бесшовное" редактирование (stitching) и инпаинтинг.', benefit: 'SEAMLESS EDITING.', price: 'CHATGPT PRO', link: 'https://openai.com/sora' },
  { id: 'v3', category: 'VIDEO', title: 'RUNWAY GEN-3', tag: 'CONTROL', size: 'medium', desc: 'Adobe Photoshop для видео. Полный контроль камеры и Motion Brush для оживления отдельных частей кадра.', benefit: 'TOTAL DIRECTOR CONTROL.', price: '$15 / МЕС', link: 'https://runwayml.com' },
  { id: 'v4', category: 'VIDEO', title: 'KLING AI', tag: 'PHYSICS', size: 'small', desc: 'Лучшая физика тела и сложные движения (танцы, спорт). Генерирует клипы до 2 минут.', benefit: 'REALISTIC MOTION.', price: 'БЕСПЛАТНО / PRO', link: 'https://kling.kuaishou.com' },
  { id: 'v5', category: 'VIDEO', title: 'HEYGEN 3.0', tag: 'AVATAR', size: 'small', desc: 'Аватары с динамической мимикой. Лучший видео-перевод (Video Translate) на рынке.', benefit: 'HYPER-REALISTIC AVATARS.', price: '$29 / МЕС', link: 'https://heygen.com' },
  { id: 'c1', category: 'CODING', title: 'GEMINI 3.0 PRO', tag: 'MULTIMODAL', size: 'large', desc: 'Новый "король" бенчмарков. Невероятное понимание видео и длинных контекстов. Лучшая модель для мультимодального анализа.', benefit: 'KING OF REASONING.', price: 'БЕСПЛАТНО / API', link: 'https://deepmind.google/technologies/gemini/' },
  { id: 'c2', category: 'CODING', title: 'CURSOR', tag: 'IDE_LEADER', size: 'medium', desc: 'Безусловный лидер. Режим Tab предсказывает намерения. Composer редактирует весь проект одной командой.', benefit: 'MIND READING AI.', price: '$20 / МЕС', link: 'https://cursor.sh' },
  { id: 'c3', category: 'CODING', title: 'CLAUDE 3.5', tag: 'AGENTIC', size: 'medium', desc: 'Стандарт для кодинга. Функция "Computer Use" позволяет управлять мышью и клавиатурой.', benefit: 'AUTONOMOUS CODING.', price: '$20 / МЕС', link: 'https://anthropic.com' },
  { id: 'c4', category: 'CODING', title: 'BOLT.NEW', tag: 'VIBE_CODING', size: 'small', desc: 'Создает и разворачивает веб-приложения в браузере из одного промпта. Идеально для MVP.', benefit: 'INSTANT DEPLOY.', price: 'ЗА ТОКЕНЫ', link: 'https://bolt.new' },
  { id: 'c5', category: 'CODING', title: 'GROK 4.1', tag: 'UNFILTERED', size: 'small', desc: 'Самая "живая" модель с чувством юмора и режимом Thinking. Минимум цензуры.', benefit: 'FAST & FUN.', price: 'X PREMIUM', link: 'https://x.ai' },
  { id: 'd1', category: 'DESIGN', title: 'RECRAFT V3', tag: 'VECTOR', size: 'large', desc: 'Первый ИИ, который "думает" как дизайнер. Генерирует редактируемые SVG-векторы и иконки. Настоящий прорыв.', benefit: 'NATIVE VECTOR GEN.', price: 'БЕСПЛАТНО / PRO', link: 'https://recraft.ai' },
  { id: 'd2', category: 'DESIGN', title: 'FLUX 1.1 PRO', tag: 'OPEN_SOURCE', size: 'medium', desc: 'Эталон для локального запуска. Без жесткой цензуры. Пугающий реализм текстуры кожи.', benefit: 'UNCENSORED REALISM.', price: 'ОТКРЫТЫЙ КОД', link: 'https://blackforestlabs.ai' },
  { id: 'd3', category: 'DESIGN', title: 'MIDJOURNEY V7', tag: 'ART', size: 'medium', desc: 'Король стиля. Новый веб-редактор позволяет перерисовывать элементы и менять текстуры.', benefit: 'WEB EDITOR & 3D COHERENCE.', price: '$10 / МЕС', link: 'https://midjourney.com' },
  { id: 'd4', category: 'DESIGN', title: 'IDEOGRAM 3.0', tag: 'TYPO', size: 'small', desc: 'Лучший инструмент для текста. Идеально вписывает надписи в иллюстрации и логотипы.', benefit: 'FLAWLESS TEXT RENDER.', price: 'БЕСПЛАТНО / PRO', link: 'https://ideogram.ai' },
  { id: 'd5', category: 'DESIGN', title: 'GAMMA', tag: 'SLIDES', size: 'small', desc: 'Превращает текст в красивые презентации и документы за секунды.', benefit: 'INSTANT DECK DESIGN.', price: 'БЕСПЛАТНО / PRO', link: 'https://gamma.app' },
  { id: 'a1', category: 'AUDIO', title: 'UDIO V2', tag: 'PRO_MUSIC', size: 'medium', desc: 'Инструмент для музыкальных гурманов. Сложные, многослойные композиции с высоким качеством сведения.', benefit: 'PROFESSIONAL MIXING.', price: 'БЕСПЛАТНО / PRO', link: 'https://udio.com' },
  { id: 'a2', category: 'AUDIO', title: 'SUNO V5', tag: 'HIT_MAKER', size: 'medium', desc: 'Радио-хиты одной кнопкой. Создает полные песни (куплет-припев) за секунды.', benefit: 'FULL SONG STRUCTURE.', price: 'БЕСПЛАТНО / PRO', link: 'https://suno.com' },
  { id: 'a3', category: 'AUDIO', title: 'ELEVENLABS', tag: 'VOICE', size: 'small', desc: 'Conversational AI 2.0. Боты с задержкой <150мс, которые могут слышать и перебивать.', benefit: 'LOW LATENCY BOT.', price: 'ОПЛАТА ПО ФАКТУ', link: 'https://elevenlabs.io' },
  { id: 'i1', category: 'INFO', title: 'PERPLEXITY', tag: 'SEARCH_2.0', size: 'medium', desc: 'Google 2.0 для аналитиков. Pro Search выполняет многоступенчатый поиск с WolframAlpha.', benefit: 'DEEP RESEARCH AGENT.', price: 'БЕСПЛАТНО / PRO', link: 'https://perplexity.ai' },
  { id: 'i2', category: 'INFO', title: 'NOTEBOOK_LM', tag: 'PODCAST', size: 'medium', desc: 'Превращает документы и лекции в живой аудио-подкаст с двумя ведущими. Продукт года.', benefit: 'DOCS TO AUDIO OVERVIEW.', price: 'БЕСПЛАТНО', link: 'https://notebooklm.google.com' }
];

const NEWS_DATA = [
  { id: 1, date: '22.11', title: 'GEMINI 3.0 ВЫШЕЛ В ПАБЛИК', tag: 'BREAKING', desc: 'Новая модель от Google бьет рекорды во всех бенчмарках. Мультимодальность на новом уровне.', link: 'https://blog.google/technology/ai/' },
  { id: 2, date: '21.11', title: 'OPENAI SORA: ДОСТУП ОТКРЫТ', tag: 'VIDEO', desc: 'Sora теперь доступна в подписке Pro. Генерация видео до 1 минуты в 1080p.', link: 'https://openai.com/sora' },
  { id: 3, date: '20.11', title: 'GITHUB COPILOT X', tag: 'DEV', desc: 'Полная интеграция с терминалом и голосовое управление. Кодинг без рук.', link: 'https://github.com/features/copilot' },
  { id: 4, date: '19.11', title: 'NVIDIA H200 SOLD OUT', tag: 'HARDWARE', desc: 'Новые чипы раскуплены до 2026 года. Дефицит вычислительных мощностей сохраняется.', link: 'https://nvidianews.nvidia.com/' },
];

// --- COMPONENTS ---

const Marquee = () => (
  <div className="bg-acid-lime text-black font-bold font-mono text-sm py-2 border-b-2 border-black relative z-40 overflow-hidden">
    <div className="marquee-container">
        <div className="marquee-content" style={{ color: '#000' }}> 
            /// GEMINI 3.0 УСТАНАВЛИВАЕТ РЕКОРДЫ /// VEO 3 МЕНЯЕТ КИНОИНДУСТРИЮ /// RECRAFT V3 ГЕНЕРИРУЕТ ВЕКТОРЫ /// АГЕНТЫ ПИШУТ КОД /// GEMINI 3.0 УСТАНАВЛИВАЕТ РЕКОРДЫ /// VEO 3 МЕНЯЕТ КИНОИНДУСТРИЮ /// RECRAFT V3 ГЕНЕРИРУЕТ ВЕКТОРЫ /// АГЕНТЫ ПИШУТ КОД
        </div>
    </div>
  </div>
);

const HackerText = ({ text, className }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  
  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 30);
  };

  return (
    <span 
      className={className} 
      onMouseEnter={scramble}
      onClick={scramble} 
    >
      {displayText}
    </span>
  );
};

const SystemBoot = ({ onComplete }: { onComplete: () => void }) => {
    const [lines, setLines] = useState<string[]>([]);
    const bootText = [
        "INITIALIZING NEURAL LINK...",
        "BYPASSING SECURE PROTOCOLS...",
        "CONNECTING TO GLOBAL DATABASE [SUCCESS]",
        "LOADING ASSETS: VEO3, SORA, GEMINI...",
        "OPTIMIZING RENDER ENGINE...",
        "SYSTEM READY. WELCOME, USER."
    ];

    useEffect(() => {
        let delay = 0;
        bootText.forEach((line, index) => {
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (index === bootText.length - 1) {
                    setTimeout(onComplete, 800);
                }
            }, delay);
            delay += Math.random() * 300 + 100;
        });
    }, []);

    return (
        <div className="boot-screen curtain-reveal">
            {lines.map((line, i) => (
                <div key={i} className="boot-text">
                    &gt; {line}
                </div>
            ))}
            <div className="boot-text mt-2">
                &gt; <span className="boot-cursor"></span>
            </div>
        </div>
    );
};

const CyberSparks = ({ x, y }: { x: number, y: number }) => {
    const sparks = Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const distance = Math.random() * 100 + 50;
        const tx = Math.cos(angle * Math.PI / 180) * distance + 'px';
        const ty = Math.sin(angle * Math.PI / 180) * distance + 'px';
        return { id: i, tx, ty };
    });

    return (
        <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
            {sparks.map(s => (
                <div 
                    key={s.id} 
                    className="spark" 
                    // @ts-ignore custom property
                    style={{ '--tx': s.tx, '--ty': s.ty }}
                />
            ))}
        </div>
    );
};

// Updated Header: Black Background, White Text, Neon Accents
const BrutalRadar = ({ onStartGame }: { onStartGame: () => void }) => (
  <div className="w-full h-80 flex items-center justify-center relative overflow-hidden border-y-2 border-black bg-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      <button 
        onClick={() => onStartGame()}
        className="absolute top-4 right-4 z-50 bg-black border-2 border-acid-lime p-2 text-acid-lime hover:bg-acid-lime hover:text-black transition-colors group"
        title="START CYBER HUNT"
      >
        <Crosshair size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-2">
             <Disc className="text-acid-lime animate-spin-slow w-10 h-10 md:w-12 md:h-12" />
             <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase text-white italic">
                <HackerText text="TECH RADAR" />
             </h1>
          </div>
          
          <div className="flex flex-col items-center mt-2 border-t-2 border-[#333] pt-2 w-full max-w-md">
              <span className="text-sm font-mono text-gray-500 uppercase tracking-widest font-bold">
                  BY ДМИТРИЙ КИСЕЛЁВ
              </span>
              <a 
                href="https://t.me/dima_kiselev" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-sm font-mono text-acid-lime hover:bg-acid-lime hover:text-black px-2 py-0.5 mt-1 transition-colors"
              >
                  <Send size={12} /> @dima_kiselev
              </a>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
             <div className="w-2 h-2 bg-acid-lime animate-pulse"></div>
             <span className="text-[10px] font-mono text-acid-lime">SYSTEM_ONLINE</span>
          </div>
      </div>

      <div className="absolute top-0 left-10 w-[1px] h-full bg-[#222]"></div>
      <div className="absolute top-0 right-10 w-[1px] h-full bg-[#222]"></div>
  </div>
);

// Updated RetroCard: White Card, Black Tags, Neon Text
const RetroCard = ({ item, onClick }: { item: DataItem; onClick: (item: DataItem) => void }) => {
  const isLarge = item.size === 'large';
  const isMedium = item.size === 'medium';
  const colSpan = isLarge ? 'md:col-span-2 md:row-span-2' : isMedium ? 'md:col-span-2' : 'col-span-1';
  const cat = CATEGORIES[item.category];
  
  return (
    <div 
      className={`retro-card p-6 flex flex-col justify-between cursor-pointer group ${colSpan}`}
      onClick={() => onClick(item)}
    >
      {/* Corner decorations - Black */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-black"></div>
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-black"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-black"></div>
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-black"></div>

      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            {/* Category Tag: Black BG, Neon Text */}
            <span 
                className="text-xs font-bold font-mono px-2 py-1 uppercase tracking-wider bg-black" 
                style={{ color: cat.color }}
            >
                {cat.label}
            </span>
          </div>
          {item.tag && (
            <div className="flex items-center gap-1 text-[10px] font-mono border border-black px-1 text-black bg-white">
                <Radio size={10} /> {item.tag}
            </div>
          )}
        </div>
        
        {/* Title: Black */}
        <h3 className={`font-display font-black uppercase leading-[0.9] mb-4 text-black transition-colors ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
          {item.title}
        </h3>
        
        <p className={`font-body text-gray-600 leading-snug text-sm ${isLarge ? 'line-clamp-4' : 'line-clamp-3'}`}>
          {item.desc}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-black group-hover:border-black transition-colors">
        <div className="flex items-end justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase font-mono mb-1">KEY_BENEFIT</span>
              <span className="text-xs font-bold text-black uppercase tracking-tight">{item.benefit}</span>
           </div>
           <ArrowUpRight size={24} className="text-black group-hover:text-black transition-colors" />
        </div>
      </div>
    </div>
  );
};

const BrutalModal = ({ item, onClose }: { item: DataItem | null; onClose: () => void }) => {
  if (!item) return null;
  const cat = CATEGORIES[item.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-black border-4 border-black shadow-[10px_10px_0px_#ccff00] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        <div className="bg-white text-black p-2 flex justify-between items-center border-b-4 border-black sticky top-0 z-20">
            <span className="font-bold font-mono uppercase text-lg">/// SYSTEM_OVERVIEW</span>
            <button 
                onClick={() => onClose()} 
                className="bg-black text-white hover:bg-acid-lime hover:text-black p-1 transition-colors border border-transparent hover:border-black"
            >
                <X size={24} strokeWidth={3} />
            </button>
        </div>

        <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
                 <span className="text-4xl md:text-6xl font-display font-black uppercase italic leading-none text-white">
                    {item.title}
                 </span>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1 bg-white text-black font-mono text-sm uppercase" style={{ color: cat.color, backgroundColor: 'black' }}>
                    КАТЕГОРИЯ: {cat.label}
                </span>
                <span className="px-3 py-1 border border-white/40 text-gray-300 font-mono text-sm uppercase">
                    ЦЕНА: {item.price}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h4 className="text-acid-lime font-mono text-xs uppercase mb-2 border-b border-white/20 pb-1">ОПИСАНИЕ</h4>
                    <p className="text-xl text-white font-body leading-relaxed">
                        {item.desc}
                    </p>
                </div>
                <div>
                    <h4 className="text-acid-lime font-mono text-xs uppercase mb-2 border-b border-white/20 pb-1">АНАЛИЗ ЭФФЕКТИВНОСТИ</h4>
                    <p className="text-lg text-gray-400 font-mono uppercase">
                        &gt; {item.benefit}<br/>
                        &gt; {item.tag}_ENABLED<br/>
                        &gt; OPTIMIZED_FOR_2025
                    </p>
                </div>
            </div>

            <a 
                href={item.link} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full bg-acid-lime text-black font-display font-black text-2xl uppercase text-center py-6 hover:bg-white hover:text-black transition-colors border-4 border-transparent hover:border-acid-lime"
            >
                ЗАПУСТИТЬ ПРОТОКОЛ -&gt;
            </a>
        </div>
      </div>
    </div>
  );
};

const CyberHunt = ({ isActive, onClose }: { isActive: boolean; onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(10);
  const [targets, setTargets] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  
  const [leaderboard, setLeaderboard] = useState([
    { name: 'NEO', score: 5000 },
    { name: 'TRINITY', score: 4200 },
    { name: 'MORPHEUS', score: 3800 },
    { name: 'CIPHER', score: 1500 },
  ]);

  const requestRef = useRef<number>();
  
  useEffect(() => {
    if (!isActive || gameOver) return;
    
    const spawnInterval = setInterval(() => {
      if (targets.length < 5) {
        const id = Date.now();
        const newTarget = {
          id,
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 200) + 100,
          speedX: (Math.random() - 0.5) * 4,
          speedY: (Math.random() - 0.5) * 4,
          type: Math.random() > 0.8 ? 'gold' : 'normal'
        };
        setTargets(prev => [...prev, newTarget]);
      }
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [isActive, gameOver, targets.length]);

  const updateGame = () => {
    setTargets(prev => prev.map(t => {
      let nextX = t.x + t.speedX;
      let nextY = t.y + t.speedY;

      if (nextX < 0 || nextX > window.innerWidth - 50) t.speedX *= -1;
      if (nextY < 100 || nextY > window.innerHeight - 50) t.speedY *= -1;

      return { ...t, x: nextX, y: nextY };
    }));
    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    if (isActive && !gameOver) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, gameOver]);

  const handleShoot = (e: any) => {
    if (gameOver) return;
    
    if (e.target.dataset.type !== 'target') {
        setAmmo(prev => {
            const newAmmo = prev - 1;
            if (newAmmo <= 0) endGame();
            return newAmmo;
        });
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }
  };

  const hitTarget = (e: any, id: number, type: string) => {
    e.stopPropagation();
    const points = type === 'gold' ? 500 : 100;
    setScore(prev => prev + points);
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const endGame = () => {
    setGameOver(true);
    const newEntry = { name: 'YOU', score: score };
    const newBoard = [...leaderboard, newEntry].sort((a,b) => b.score - a.score).slice(0, 5);
    setLeaderboard(newBoard);
  };

  const resetGame = () => {
    setScore(0);
    setAmmo(10);
    setTargets([]);
    setGameOver(false);
  };

  if (!isActive) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] overflow-hidden game-cursor ${shake ? 'shake' : ''}`}
      onClick={handleShoot}
      style={{ background: 'rgba(255,255,255,0.5)' }} 
    >
      <div className="absolute top-4 left-4 flex gap-6 font-display text-2xl text-black bg-white p-4 border-2 border-black z-50 select-none pointer-events-none shadow-[4px_4px_0px_#000]">
         <div>SCORE: {score}</div>
         <div className={ammo < 3 ? 'text-red-600 animate-pulse' : ''}>AMMO: {ammo}</div>
      </div>

      <button 
        onClick={() => onClose()}
        className="absolute top-4 right-4 bg-red-600 text-white p-2 font-bold border-2 border-black hover:bg-red-700 z-50"
      >
        <X />
      </button>

      {targets.map(t => (
        <div
          key={t.id}
          data-type="target"
          onClick={(e) => hitTarget(e, t.id, t.type)}
          className="absolute cursor-pointer hover:scale-125 transition-transform"
          style={{ 
            left: t.x, 
            top: t.y,
            color: t.type === 'gold' ? '#d4af37' : '#000',
            filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.2))',
            animation: 'float-target 2s infinite ease-in-out'
          }}
        >
           {t.type === 'gold' ? <Cpu size={48} /> : <Bug size={40} />}
        </div>
      ))}

      {gameOver && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-[100]">
            <div className="bg-white border-4 border-black p-8 max-w-md w-full text-center relative shadow-[10px_10px_0px_#000]">
                <h2 className="text-5xl font-display text-red-600 mb-2 animate-pulse">SYSTEM FAILURE</h2>
                <p className="text-black font-mono mb-6">OUT OF AMMO</p>
                
                <div className="bg-gray-100 p-4 border border-black mb-6">
                    <h3 className="text-black font-mono border-b border-black pb-2 mb-2 flex items-center justify-center gap-2">
                        <Trophy size={16}/> LEADERBOARD
                    </h3>
                    {leaderboard.map((p, i) => (
                        <div key={i} className={`flex justify-between font-mono text-sm py-1 ${p.name === 'YOU' ? 'text-black bg-acid-lime' : 'text-gray-600'}`}>
                            <span>{i+1}. {p.name}</span>
                            <span>{p.score}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => resetGame()}
                        className="bg-black text-white font-bold py-3 px-6 hover:bg-acid-lime hover:text-black flex items-center gap-2"
                    >
                        <RotateCcw size={18} /> RETRY
                    </button>
                    <button 
                        onClick={() => onClose()}
                        className="border-2 border-black text-black font-bold py-3 px-6 hover:bg-black hover:text-white"
                    >
                        EXIT
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const NewsFeed = () => (
    <div className="max-w-3xl mx-auto space-y-6">
        {NEWS_DATA.map(news => (
            <a 
                href={news.link}
                target="_blank"
                rel="noreferrer"
                key={news.id} 
                className="retro-card p-6 border border-black hover:shadow-[8px_8px_0px_black] transition-all block text-decoration-none group cursor-pointer"
            >
                <div className="flex justify-between items-start mb-3">
                    <span className="text-black font-mono text-xs border border-white px-2 py-0.5 bg-acid-lime">
                        {news.tag}
                    </span>
                    <span className="text-gray-400 font-mono text-xs">{news.date}</span>
                </div>
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-display font-black text-black uppercase mb-2 leading-tight group-hover:text-acid-lime transition-colors">
                        {news.title}
                    </h3>
                    <ArrowUpRight size={20} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-gray-600 font-body text-sm">
                    {news.desc}
                </p>
            </a>
        ))}
    </div>
);

const StatsView = ({ onCategorySelect }: { onCategorySelect: (catId: CategoryKey) => void }) => {
    const counts = Object.values(CATEGORIES).map(cat => ({
        ...cat,
        count: DATA_SET.filter(i => i.category === cat.id).length
    }));

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="retro-card p-8 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 font-mono text-sm uppercase mb-2">ВСЕГО ИНСТРУМЕНТОВ</h3>
                    <span className="text-8xl font-display font-black text-black leading-none">{DATA_SET.length}</span>
                </div>
                <div className="retro-card p-8 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 font-mono text-sm uppercase mb-2">ОБНОВЛЕНИЕ БАЗЫ</h3>
                    <span className="text-4xl font-display font-black text-black leading-none">22.11.25</span>
                </div>
            </div>

            <h3 className="text-black font-mono text-sm uppercase mb-4 border-b border-black pb-2">РАСПРЕДЕЛЕНИЕ ПО КАТЕГОРИЯМ</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {counts.map(c => (
                    <div 
                        key={c.id} 
                        onClick={() => onCategorySelect(c.id)}
                        className="border border-black p-4 bg-white hover:bg-black hover:text-white transition-colors cursor-pointer group"
                    >
                        <div className="mb-2 group-hover:scale-110 transition-transform">
                            <c.icon size={24} style={{ color: c.color }} />
                        </div>
                        <div className="text-2xl font-display font-bold text-black group-hover:text-white mb-1">{c.count}</div>
                        <div className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">{c.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Updated Footer: Black Background, White Text
const Footer = () => {
    return (
        <footer className="bg-black border-t-8 border-acid-lime text-white pt-20 pb-32 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
            
            <div className="max-w-[1600px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div className="flex-1">
                        <h2 className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-[0.8] mb-8 hover:text-acid-lime transition-colors cursor-default select-none">
                            FUTURE<br/>IS NOW
                        </h2>
                        <div className="flex gap-6">
                            <a href="https://t.me/dima_kiselev" target="_blank" rel="noreferrer" className="border-2 border-white px-6 py-3 font-mono font-bold hover:bg-white hover:text-black transition-all">
                                TELEGRAM
                            </a>
                            <a href="#" className="border-2 border-white px-6 py-3 font-mono font-bold hover:bg-white hover:text-black transition-all">
                                GITHUB
                            </a>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="border-2 border-[#333] p-6 bg-black min-w-[300px]">
                            <h3 className="text-acid-lime font-mono text-xs mb-4 uppercase border-b border-[#333] pb-2">
                                /// SYSTEM STATUS
                            </h3>
                            <div className="space-y-2 font-mono text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>SERVER:</span>
                                    <span className="text-white font-bold">ONLINE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>PING:</span>
                                    <span className="text-black font-bold bg-acid-lime px-1">12ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>VERSION:</span>
                                    <span className="text-white">2.5.0 (BETA)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>LOCATION:</span>
                                    <span className="text-white">RU</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
                    <div className="flex gap-8">
                        <span>© 2025 AI TECH RADAR</span>
                        <span>DESIGNED BY DMITRY KISELEV</span>
                    </div>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                        BACK TO TOP <ArrowUp size={14} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default function App() {
  const [selectedCat, setSelectedCat] = useState<CategoryKey | 'all'>('all');
  const [activeItem, setActiveItem] = useState<DataItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'radar' | 'feed' | 'stats'>('radar');
  const [booted, setBooted] = useState(false);
  const [sparkBurst, setSparkBurst] = useState<{x: number, y: number, id: number} | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [glitching, setGlitching] = useState(false);
  
  // Ref for the main content container
  const mainRef = useRef<HTMLElement>(null);
  
  const handleCategorySelect = (catId: CategoryKey | 'all') => {
      setGlitching(true);
      setTimeout(() => {
          setSelectedCat(catId);
          setCurrentView('radar');
          setGlitching(false);
          
          // Scroll to the main content area
          if(mainRef.current) {
            mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 300);
  };

  const changeView = (view: 'radar' | 'feed' | 'stats') => {
      // Scroll to main content even if already on the view (per user request implication)
      if (mainRef.current) {
          mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      if (view === currentView) return;
      setGlitching(true);
      setTimeout(() => {
          setCurrentView(view);
          setGlitching(false);
      }, 300);
  };

  const handleSpark = (e: React.MouseEvent) => {
      const burst = { x: e.clientX, y: e.clientY, id: Date.now() };
      setSparkBurst(burst);
      setTimeout(() => setSparkBurst(null), 600);
  };

  const filteredData = useMemo(() => {
    let data = DATA_SET;
    if (selectedCat !== 'all') data = data.filter(i => i.category === selectedCat);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
    }
    return data;
  }, [selectedCat, searchQuery]);

  return (
    <div className="min-h-screen relative bg-white text-black">
      <style>{STYLES}</style>
      
      {!booted && <SystemBoot onComplete={() => setBooted(true)} />}
      {sparkBurst && <CyberSparks x={sparkBurst.x} y={sparkBurst.y} />}
      <CyberHunt isActive={gameActive} onClose={() => setGameActive(false)} />

      <div className="scanlines" /> 
      <Marquee />

      <BrutalRadar onStartGame={() => setGameActive(true)} />

      {/* MAIN CONTENT REF ATTACHED HERE */}
      <main ref={mainRef} className={`max-w-[1600px] mx-auto relative z-10 px-4 md:px-8 pt-12 ${glitching ? 'hyper-glitch' : ''}`}>
        
        {currentView === 'radar' && (
            <>
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b-2 border-black pb-6">
                    <div>
                        <p className="font-mono text-acid-lime text-xs mb-2 bg-black inline-block px-2 py-0.5">ВЫБОР_СЕКТОРА</p>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={(e) => { handleCategorySelect('all'); handleSpark(e); }}
                                className={`px-4 py-2 font-bold font-mono text-sm uppercase border-2 transition-all ${
                                    selectedCat === 'all' 
                                    ? 'bg-acid-lime text-black border-acid-lime shadow-[4px_4px_0px_black]' 
                                    : 'border-black text-black hover:bg-black hover:text-white'
                                }`}
                            >
                                ВСЕ
                            </button>
                            
                            {Object.values(CATEGORIES).map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={(e) => { handleCategorySelect(cat.id); handleSpark(e); }}
                                    className={`px-4 py-2 font-bold font-mono text-sm uppercase border-2 transition-all flex items-center gap-2 ${
                                        selectedCat === cat.id 
                                        ? 'text-black border-black shadow-[4px_4px_0px_black]' 
                                        : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'
                                    }`}
                                    style={{ backgroundColor: selectedCat === cat.id ? cat.color : 'transparent' }}
                                >
                                    <HackerText text={cat.label} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <p className="font-mono text-acid-lime text-xs mb-2 bg-black inline-block px-2 py-0.5">ПОИСК_БД</p>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ЗАПРОС..."
                                className="w-full md:w-80 bg-transparent border-b-2 border-black text-xl font-display uppercase text-black py-2 focus:outline-none focus:border-acid-lime placeholder-gray-400"
                            />
                            <Search className="absolute right-0 top-2 text-gray-400 group-focus-within:text-black" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredData.map((item, idx) => (
                        <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                            <RetroCard 
                                item={item} 
                                onClick={setActiveItem} 
                            />
                        </div>
                    ))}
                </div>
                
                {filteredData.length === 0 && (
                    <div className="py-32 text-center border-2 border-dashed border-black">
                        <Terminal size={48} className="mx-auto text-black mb-4" />
                        <h2 className="text-2xl font-mono uppercase text-gray-500">ДАННЫЕ_НЕ_НАЙДЕНЫ</h2>
                    </div>
                )}
            </>
        )}

        {currentView === 'feed' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-4">
                    <Newspaper size={32} className="text-black" />
                    <h2 className="text-4xl font-display font-black text-black uppercase">ЛЕНТА СОБЫТИЙ</h2>
                </div>
                <NewsFeed />
            </div>
        )}

        {currentView === 'stats' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-4">
                    <Activity size={32} className="text-black" />
                    <h2 className="text-4xl font-display font-black text-black uppercase">СИСТЕМНАЯ СТАТИСТИКА</h2>
                </div>
                <StatsView onCategorySelect={handleCategorySelect} />
            </div>
        )}

      </main>

      <div className="mt-32">
        <Footer />
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
          <div className="bg-white border-2 border-black p-2 flex justify-around items-center shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
              
              <button 
                onClick={() => changeView('radar')}
                className={`flex flex-col items-center gap-1 p-2 w-full transition-colors ${
                  currentView === 'radar'
                    ? 'text-black bg-acid-lime font-bold'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                  <Layers size={20} />
                  <span className="text-[10px] font-mono">РАДАР</span>
              </button>
              
              <div className="w-[2px] h-8 bg-gray-200"></div>
              
              <button 
                onClick={() => changeView('feed')}
                className={`flex flex-col items-center gap-1 p-2 w-full transition-colors ${
                  currentView === 'feed'
                    ? 'text-black bg-acid-lime font-bold'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                  <Newspaper size={20} />
                  <span className="text-[10px] font-mono">ЛЕНТА</span>
              </button>
              
               <div className="w-[2px] h-8 bg-gray-200"></div>
              
              <button 
                onClick={() => changeView('stats')}
                className={`flex flex-col items-center gap-1 p-2 w-full transition-colors ${
                  currentView === 'stats'
                    ? 'text-black bg-acid-lime font-bold'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                  <Activity size={20} />
                  <span className="text-[10px] font-mono">СТАТЫ</span>
              </button>
          
          </div>
      </div>

      <BrutalModal item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}

