import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import {
  Sparkles, MapPin, Palette, UtensilsCrossed, ShoppingBag, Mountain,
  Waves, Ticket, Clapperboard, Building2, Sun, Moon, Sunset,
  Clock, Calendar, Coffee, Pizza, Wine, Footprints, Car, Star,
  TreePalm, Heart, BookOpen, Landmark, Music, ChevronRight, ChevronLeft,
  Bell, Menu, Plus, Bookmark, Search, Home, Sliders, Map as MapIcon,
  Flame, Zap, CalendarCheck, Users, Filter, ArrowRight, Plane,
  Camera, Trophy, Compass, Globe, Instagram, ExternalLink, Info,
  CloudSun, Banknote, Languages, ShieldCheck, Train, Video
} from 'lucide-react';

// ============ パレット（編集デザイン版） ============
const C = {
  bg:     '#F2EAD3',
  paper:  '#FBF5E5',
  ink:    '#1A1410',
  ink2:   '#5C4A38',
  ink3:   '#A99A82',
  line:   '#DDD0B0',
  accent: '#B8412C',
  sub:    '#2E5572',
  gold:   '#A07530',
  ochre:  '#C8862E',
  moss:   '#5C7A3A',

  // SVGイラスト内で参照されている既存名（変えない）
  blue:   '#0077FF',
  coral:  '#FF6B6B',
  yellow: '#FFCA28',
  green:  '#22C55E',
  cyan:   '#00CFEA',
  cream:  '#FFF6E6',
  navy:   '#1A2B6B',
  sand:   '#FFE0A6',
};

// ============ 拠点 ============
const HOME_BASE = {
  name: 'パーラ・オン・ブロードウェイ',
  nameEn: 'Pala on Broadway',
  address: '400 S Broadway, Los Angeles, CA 90013',
  area: 'Downtown LA',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pala+on+Broadway+400+S+Broadway+Los+Angeles+CA+90013',
  airbnbUrl: 'https://www.airbnb.jp/rooms/590725126714089771?modal=PHOTO_TOUR_SCROLLABLE',
};

// ============ 興味カテゴリー（11種） ============
const INTERESTS = [
  { id: 'art',        label: 'アート',       en: 'Art',        icon: Palette,         color: '#B8412C' },
  { id: 'food',       label: 'グルメ',       en: 'Cuisine',    icon: UtensilsCrossed, color: '#A07530' },
  { id: 'nature',     label: '自然',         en: 'Nature',     icon: TreePalm,        color: '#5C7A3A' },
  { id: 'beach',      label: 'ビーチ',       en: 'Beach',      icon: Waves,           color: '#2E5572' },
  { id: 'shopping',   label: 'ショッピング', en: 'Shopping',   icon: ShoppingBag,     color: '#7A3A6B' },
  { id: 'themepark',  label: 'テーマパーク', en: 'Theme',      icon: Ticket,          color: '#C8862E' },
  { id: 'movie',      label: '映画',         en: 'Cinema',     icon: Clapperboard,    color: '#3A2F5C' },
  { id: 'history',    label: '歴史・建築',   en: 'Heritage',   icon: Landmark,        color: '#8A5A2A' },
  { id: 'photo',      label: '映えスポット', en: 'Photogenic', icon: Camera,          color: '#C44A6E' },
  { id: 'sports',     label: 'スポーツ',     en: 'Sports',     icon: Trophy,          color: '#2A6B4E' },
  { id: 'experience', label: '体験',         en: 'Experience', icon: Compass,         color: '#6B4A2A' },
];
const interestById = Object.fromEntries(INTERESTS.map(i => [i.id, i]));

// ============ お気に入り（端末ローカル保存） ============
const FAV_KEY = 'la_trip_favs_v1';

const FavContext = createContext(null);

// localStorageへの安全なアクセス（アーティファクト環境では失敗しうるのでtry/catch）
function loadFavs() {
  try {
    const raw = window.localStorage.getItem(FAV_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function saveFavs(obj) {
  try {
    window.localStorage.setItem(FAV_KEY, JSON.stringify(obj));
  } catch {
    /* 保存できない環境では何もしない（メモリ上では保持される） */
  }
}

function FavProvider({ children }) {
  // favs: { [name]: { name, reading, kind, area, mapUrl, url, insta } }
  const [favs, setFavs] = useState({});

  // 初回マウントでlocalStorageから復元
  useEffect(() => {
    setFavs(loadFavs());
  }, []);

  const toggleFav = (item) => {
    setFavs((prev) => {
      const next = { ...prev };
      if (next[item.name]) {
        delete next[item.name];
      } else {
        next[item.name] = item;
      }
      saveFavs(next);
      return next;
    });
  };

  const isFav = (name) => !!favs[name];
  const favList = Object.values(favs);

  return (
    <FavContext.Provider value={{ favs, favList, toggleFav, isFav }}>
      {children}
    </FavContext.Provider>
  );
}

function useFavs() {
  const ctx = useContext(FavContext);
  // Provider外でも壊れないようフォールバック
  if (!ctx) return { favs: {}, favList: [], toggleFav: () => {}, isFav: () => false };
  return ctx;
}

// ============ 詳細SVGイラスト集（写真風） ============
const Scenes = {
  // ==== サンタモニカ・ピア（観覧車つき夕景） ====
  pier: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF9A6B"/>
          <stop offset="40%" stopColor="#FFC89E"/>
          <stop offset="75%" stopColor="#FFE5C9"/>
          <stop offset="100%" stopColor="#A8DCEF"/>
        </linearGradient>
        <linearGradient id="pSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5BA8D8"/>
          <stop offset="100%" stopColor="#1A4A78"/>
        </linearGradient>
      </defs>
      <rect width="80" height="58" fill="url(#pSky)"/>
      <ellipse cx="15" cy="14" rx="9" ry="2" fill="#FFF" opacity="0.7"/>
      <ellipse cx="12" cy="16" rx="6" ry="1.5" fill="#FFF" opacity="0.6"/>
      <ellipse cx="62" cy="10" rx="7" ry="1.5" fill="#FFF" opacity="0.55"/>
      <circle cx="60" cy="22" r="9" fill="#FFE5A8" opacity="0.5"/>
      <circle cx="60" cy="22" r="6" fill="#FFCA28"/>
      <path d="M0 47 L18 38 L36 44 L54 36 L80 44 L80 50 L0 50 Z" fill="#7A95B5" opacity="0.45"/>
      <path d="M0 50 L14 44 L30 49 L50 43 L80 50 Z" fill="#5A7895" opacity="0.5"/>
      <rect width="80" height="22" y="50" fill="url(#pSea)"/>
      <path d="M0 53 Q5 52, 10 53 T20 53 T30 53 T40 53 T50 53 T60 53 T70 53 T80 53" stroke="#FFF" strokeWidth="0.4" fill="none" opacity="0.6"/>
      <path d="M0 57 Q5 56, 10 57 T20 57 T30 57 T40 57 T50 57 T60 57 T70 57 T80 57" stroke="#FFF" strokeWidth="0.4" fill="none" opacity="0.4"/>
      <path d="M0 62 Q5 61, 10 62 T20 62 T30 62 T40 62 T50 62 T60 62 T70 62 T80 62" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.7"/>
      <ellipse cx="60" cy="58" rx="3" ry="1.5" fill="#FFCA28" opacity="0.4"/>
      <g transform="translate(28, 35)">
        <polygon points="-3,15 -1,15 -0.5,29 -2,29" fill="#5C5C5C"/>
        <polygon points="3,15 1,15 0.5,29 2,29" fill="#5C5C5C"/>
        <circle r="14" fill="none" stroke="#FF6B6B" strokeWidth="1.5"/>
        <circle r="14" fill="none" stroke="#C8163A" strokeWidth="0.5"/>
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#FF6B6B" strokeWidth="0.8"/>
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#FF6B6B" strokeWidth="0.8"/>
        <line x1="-9.9" y1="-9.9" x2="9.9" y2="9.9" stroke="#FF6B6B" strokeWidth="0.8"/>
        <line x1="-9.9" y1="9.9" x2="9.9" y2="-9.9" stroke="#FF6B6B" strokeWidth="0.8"/>
        <circle r="2" fill="#5C5C5C"/>
        <rect x="-1.6" y="-15.6" width="3.2" height="3.2" rx="0.5" fill="#FFD60A" stroke="#000" strokeWidth="0.3"/>
        <rect x="-1.6" y="12.4" width="3.2" height="3.2" rx="0.5" fill="#00CFEA" stroke="#000" strokeWidth="0.3"/>
        <rect x="-15.6" y="-1.6" width="3.2" height="3.2" rx="0.5" fill="#22C55E" stroke="#000" strokeWidth="0.3"/>
        <rect x="12.4" y="-1.6" width="3.2" height="3.2" rx="0.5" fill="#FF6B6B" stroke="#000" strokeWidth="0.3"/>
        <rect x="-11.6" y="-11.6" width="3.2" height="3.2" rx="0.5" fill="#FFD60A" stroke="#000" strokeWidth="0.3"/>
        <rect x="-11.6" y="8.4" width="3.2" height="3.2" rx="0.5" fill="#FF6B6B" stroke="#000" strokeWidth="0.3"/>
        <rect x="8.4" y="-11.6" width="3.2" height="3.2" rx="0.5" fill="#22C55E" stroke="#000" strokeWidth="0.3"/>
        <rect x="8.4" y="8.4" width="3.2" height="3.2" rx="0.5" fill="#00CFEA" stroke="#000" strokeWidth="0.3"/>
      </g>
      <rect x="0" y="65" width="48" height="1.5" fill="#7A5A38"/>
      <rect x="0" y="66.5" width="48" height="1.2" fill="#5C3F22"/>
      <rect x="4" y="67.7" width="1.2" height="3.5" fill="#4A331C"/>
      <rect x="12" y="67.7" width="1.2" height="3.5" fill="#4A331C"/>
      <rect x="20" y="67.7" width="1.2" height="3.5" fill="#4A331C"/>
      <rect x="28" y="67.7" width="1.2" height="3.5" fill="#4A331C"/>
      <rect x="36" y="67.7" width="1.2" height="3.5" fill="#4A331C"/>
      <rect x="44" y="67.7" width="1.2" height="3.5" fill="#4A331C"/>
      <path d="M0 71 Q20 69, 40 71 T80 70 L80 80 L0 80 Z" fill="#FFE0A6"/>
      <circle cx="10" cy="74" r="0.3" fill="#D9B070"/>
      <circle cx="22" cy="76" r="0.3" fill="#D9B070"/>
      <circle cx="36" cy="74" r="0.3" fill="#D9B070"/>
      <circle cx="50" cy="76" r="0.3" fill="#D9B070"/>
      <circle cx="64" cy="74" r="0.3" fill="#D9B070"/>
      <circle cx="72" cy="76" r="0.3" fill="#D9B070"/>
      <rect x="62" y="42" width="2.2" height="30" fill="#5C3A1A"/>
      <ellipse cx="63" cy="46" rx="1.3" ry="0.4" fill="#3A2410"/>
      <ellipse cx="63" cy="52" rx="1.3" ry="0.4" fill="#3A2410"/>
      <ellipse cx="63" cy="58" rx="1.3" ry="0.4" fill="#3A2410"/>
      <ellipse cx="63" cy="42" rx="13" ry="2.5" fill="#1A8C5C" transform="rotate(-25 63 42)"/>
      <ellipse cx="63" cy="42" rx="13" ry="2.5" fill="#1A8C5C" transform="rotate(25 63 42)"/>
      <ellipse cx="63" cy="42" rx="13" ry="2.5" fill="#22C55E" transform="rotate(-70 63 42)"/>
      <ellipse cx="63" cy="42" rx="13" ry="2.5" fill="#22C55E" transform="rotate(70 63 42)"/>
      <ellipse cx="63" cy="42" rx="12" ry="2" fill="#1A8C5C" transform="rotate(-100 63 42)"/>
      <circle cx="61" cy="44" r="1.3" fill="#5C3A1A"/>
      <circle cx="65" cy="45" r="1.3" fill="#5C3A1A"/>
      <path d="M22 18 Q24 16, 26 18 Q24 17, 22 18 Z" fill="#3A4A5A"/>
      <path d="M38 14 Q40 12, 42 14 Q40 13, 38 14 Z" fill="#3A4A5A"/>
    </svg>
  ),

  // ==== ビーチ（一般、椰子の木とサンセット） ====
  beach: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB58A"/>
          <stop offset="55%" stopColor="#FFE5C9"/>
          <stop offset="100%" stopColor="#A0DBED"/>
        </linearGradient>
        <linearGradient id="bSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5DC4E5"/>
          <stop offset="100%" stopColor="#2A7AA8"/>
        </linearGradient>
      </defs>
      <rect width="80" height="58" fill="url(#bSky)"/>
      <ellipse cx="20" cy="13" rx="10" ry="2.5" fill="#FFF" opacity="0.65"/>
      <ellipse cx="14" cy="16" rx="6" ry="1.5" fill="#FFF" opacity="0.5"/>
      <circle cx="56" cy="22" r="10" fill="#FFE5A8" opacity="0.5"/>
      <circle cx="56" cy="22" r="7" fill="#FFCA28"/>
      <circle cx="56" cy="22" r="4.5" fill="#FFE89E"/>
      <rect width="80" height="22" y="50" fill="url(#bSea)"/>
      <path d="M0 53 Q5 52, 10 53 T20 53 T30 53 T40 53 T50 53 T60 53 T70 53 T80 53" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.6"/>
      <path d="M0 58 Q5 57, 10 58 T20 58 T30 58 T40 58 T50 58 T60 58 T70 58 T80 58" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.5"/>
      <ellipse cx="56" cy="56" rx="3" ry="1" fill="#FFCA28" opacity="0.4"/>
      <ellipse cx="56" cy="62" rx="2" ry="0.7" fill="#FFCA28" opacity="0.3"/>
      <path d="M0 67 Q20 64, 40 67 T80 66 L80 80 L0 80 Z" fill="#FFE0A6"/>
      <path d="M0 70 Q15 69, 30 70 T60 70 T80 70" stroke="#E8B870" strokeWidth="0.3" fill="none" opacity="0.6"/>
      <circle cx="12" cy="72" r="0.4" fill="#D9B070"/>
      <circle cx="28" cy="74" r="0.4" fill="#D9B070"/>
      <circle cx="44" cy="73" r="0.4" fill="#D9B070"/>
      <circle cx="58" cy="76" r="0.4" fill="#D9B070"/>
      <circle cx="68" cy="74" r="0.4" fill="#D9B070"/>
      <rect x="20" y="38" width="2.5" height="32" fill="#5C3A1A"/>
      <ellipse cx="21.2" cy="44" rx="1.5" ry="0.4" fill="#3A2410"/>
      <ellipse cx="21.2" cy="52" rx="1.5" ry="0.4" fill="#3A2410"/>
      <ellipse cx="21.2" cy="60" rx="1.5" ry="0.4" fill="#3A2410"/>
      <ellipse cx="21.2" cy="38" rx="14" ry="3" fill="#1A8C5C" transform="rotate(-22 21.2 38)"/>
      <ellipse cx="21.2" cy="38" rx="14" ry="3" fill="#1A8C5C" transform="rotate(22 21.2 38)"/>
      <ellipse cx="21.2" cy="38" rx="14" ry="3" fill="#22C55E" transform="rotate(-65 21.2 38)"/>
      <ellipse cx="21.2" cy="38" rx="14" ry="3" fill="#22C55E" transform="rotate(65 21.2 38)"/>
      <ellipse cx="21.2" cy="38" rx="13" ry="2.5" fill="#1A8C5C" transform="rotate(-100 21.2 38)"/>
      <ellipse cx="21.2" cy="38" rx="13" ry="2.5" fill="#1A8C5C" transform="rotate(100 21.2 38)"/>
      <circle cx="19" cy="40" r="1.5" fill="#5C3A1A"/>
      <circle cx="23" cy="41" r="1.5" fill="#5C3A1A"/>
      <rect x="40" y="48" width="2" height="24" fill="#5C3A1A"/>
      <ellipse cx="41" cy="48" rx="10" ry="2.5" fill="#1A8C5C" transform="rotate(-22 41 48)"/>
      <ellipse cx="41" cy="48" rx="10" ry="2.5" fill="#1A8C5C" transform="rotate(22 41 48)"/>
      <ellipse cx="41" cy="48" rx="10" ry="2.5" fill="#22C55E" transform="rotate(-70 41 48)"/>
      <ellipse cx="41" cy="48" rx="10" ry="2.5" fill="#22C55E" transform="rotate(70 41 48)"/>
      <rect x="64" y="58" width="2" height="14" fill="#5C3A1A"/>
      <ellipse cx="65" cy="58" rx="6" ry="1.5" fill="#1A8C5C" transform="rotate(-20 65 58)"/>
      <ellipse cx="65" cy="58" rx="6" ry="1.5" fill="#22C55E" transform="rotate(60 65 58)"/>
      <ellipse cx="65" cy="58" rx="6" ry="1.5" fill="#1A8C5C" transform="rotate(-60 65 58)"/>
    </svg>
  ),

  // ==== グリフィス天文台（建物の細部、庭、遠景LA） ====
  observatory: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="oSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BCBEA"/>
          <stop offset="100%" stopColor="#D4ECF7"/>
        </linearGradient>
      </defs>
      <rect width="80" height="50" fill="url(#oSky)"/>
      <ellipse cx="14" cy="12" rx="9" ry="2" fill="#FFF" opacity="0.7"/>
      <ellipse cx="10" cy="15" rx="6" ry="1.5" fill="#FFF" opacity="0.6"/>
      <ellipse cx="60" cy="8" rx="7" ry="1.5" fill="#FFF" opacity="0.5"/>
      <ellipse cx="66" cy="11" rx="4" ry="1" fill="#FFF" opacity="0.5"/>
      <path d="M0 42 L8 38 L16 42 L24 36 L34 41 L44 36 L54 40 L62 36 L74 40 L80 38 L80 50 L0 50 Z" fill="#8AA5C5" opacity="0.5"/>
      <rect x="2" y="42" width="1.5" height="6" fill="#5A7895" opacity="0.6"/>
      <rect x="8" y="40" width="2" height="8" fill="#5A7895" opacity="0.6"/>
      <rect x="14" y="42" width="1.5" height="6" fill="#5A7895" opacity="0.6"/>
      <rect x="22" y="38" width="2.5" height="10" fill="#5A7895" opacity="0.5"/>
      <rect x="30" y="40" width="1.5" height="8" fill="#5A7895" opacity="0.5"/>
      <rect x="40" y="38" width="2" height="10" fill="#5A7895" opacity="0.5"/>
      <rect x="50" y="40" width="1.5" height="8" fill="#5A7895" opacity="0.5"/>
      <rect x="58" y="38" width="2" height="10" fill="#5A7895" opacity="0.5"/>
      <rect x="68" y="40" width="2" height="8" fill="#5A7895" opacity="0.5"/>
      <rect x="0" y="48" width="80" height="2" fill="#7A8FA5" opacity="0.6"/>
      <rect x="6" y="46" width="68" height="20" fill="#F5EDD8"/>
      <rect x="6" y="46" width="68" height="2" fill="#E3D8B5"/>
      <ellipse cx="40" cy="38" rx="14" ry="9" fill="#FAF3DD"/>
      <ellipse cx="40" cy="38" rx="14" ry="9" fill="none" stroke="#D0C5A8" strokeWidth="0.4"/>
      <rect x="26" y="38" width="28" height="10" fill="#FAF3DD"/>
      <rect x="26" y="38" width="28" height="1" fill="#E3D8B5"/>
      <rect x="37" y="32" width="6" height="10" fill="#A5A5A5"/>
      <rect x="38" y="30" width="4" height="3" fill="#666"/>
      <rect x="39" y="27" width="2" height="4" fill="#A5A5A5"/>
      <ellipse cx="14" cy="50" rx="8" ry="5" fill="#FAF3DD"/>
      <rect x="6" y="50" width="16" height="8" fill="#FAF3DD"/>
      <rect x="6" y="50" width="16" height="1" fill="#E3D8B5"/>
      <rect x="10" y="54" width="3" height="4" fill="#5A7895"/>
      <rect x="15" y="54" width="3" height="4" fill="#5A7895"/>
      <ellipse cx="66" cy="50" rx="8" ry="5" fill="#FAF3DD"/>
      <rect x="58" y="50" width="16" height="8" fill="#FAF3DD"/>
      <rect x="58" y="50" width="16" height="1" fill="#E3D8B5"/>
      <rect x="62" y="54" width="3" height="4" fill="#5A7895"/>
      <rect x="67" y="54" width="3" height="4" fill="#5A7895"/>
      <rect x="26" y="48" width="3" height="10" fill="#E0D5B5"/>
      <rect x="32" y="48" width="3" height="10" fill="#E0D5B5"/>
      <rect x="38" y="48" width="3" height="10" fill="#E0D5B5"/>
      <rect x="44" y="48" width="3" height="10" fill="#E0D5B5"/>
      <rect x="50" y="48" width="3" height="10" fill="#E0D5B5"/>
      <rect x="0" y="58" width="80" height="3" fill="#C9BDA0"/>
      <rect x="0" y="61" width="80" height="2" fill="#B8AB8E"/>
      <rect x="0" y="63" width="80" height="17" fill="#7AB67E"/>
      <ellipse cx="6" cy="64" rx="1" ry="0.5" fill="#22C55E"/>
      <ellipse cx="36" cy="65" rx="1.5" ry="0.5" fill="#22C55E"/>
      <ellipse cx="74" cy="64" rx="1" ry="0.5" fill="#22C55E"/>
      <rect x="38" y="63" width="4" height="17" fill="#D9C8A8"/>
      <path d="M0 68 Q40 66, 80 68 Q40 70, 0 68 Z" fill="#9BC99E" opacity="0.4"/>
    </svg>
  ),

  // ==== ハリウッドサイン ====
  hollywood: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB876"/>
          <stop offset="60%" stopColor="#FFDFA8"/>
          <stop offset="100%" stopColor="#FFF0D8"/>
        </linearGradient>
      </defs>
      <rect width="80" height="48" fill="url(#hSky)"/>
      <ellipse cx="58" cy="14" rx="9" ry="2" fill="#FFF" opacity="0.55"/>
      <ellipse cx="64" cy="17" rx="5" ry="1.2" fill="#FFF" opacity="0.45"/>
      <circle cx="20" cy="20" r="9" fill="#FFE5B0" opacity="0.5"/>
      <circle cx="20" cy="20" r="6" fill="#FFD888"/>
      <path d="M2 22 L20 20 L8 25 Z" fill="#FFE5B0" opacity="0.3"/>
      <path d="M0 50 L18 28 L36 46 L54 25 L80 48 L80 60 L0 60 Z" fill="#B57F4A"/>
      <path d="M0 56 L16 36 L34 52 L56 30 L80 56 L80 65 L0 65 Z" fill="#9D6A37"/>
      <path d="M18 28 L20 32 L16 32 Z" fill="#7A4A28" opacity="0.4"/>
      <path d="M54 25 L58 30 L50 30 Z" fill="#7A4A28" opacity="0.4"/>
      <path d="M0 60 L20 45 L40 58 L60 42 L80 60 L80 80 L0 80 Z" fill="#7A4A28"/>
      <g fill="#FFF">
        <rect x="12" y="36" width="2.5" height="6"/>
        <rect x="15.5" y="36" width="2.5" height="6"/>
        <rect x="19" y="36" width="2.5" height="6"/>
        <rect x="22.5" y="36" width="2.5" height="6"/>
        <rect x="26" y="36" width="2.5" height="6"/>
        <rect x="29.5" y="36" width="2.5" height="6"/>
        <rect x="33" y="36" width="2.5" height="6"/>
        <rect x="36.5" y="36" width="2.5" height="6"/>
        <rect x="40" y="36" width="2.5" height="6"/>
      </g>
      <g fill="#000" opacity="0.15">
        <rect x="12.5" y="42" width="2.5" height="0.8"/>
        <rect x="16" y="42" width="2.5" height="0.8"/>
        <rect x="19.5" y="42" width="2.5" height="0.8"/>
        <rect x="23" y="42" width="2.5" height="0.8"/>
        <rect x="26.5" y="42" width="2.5" height="0.8"/>
        <rect x="30" y="42" width="2.5" height="0.8"/>
        <rect x="33.5" y="42" width="2.5" height="0.8"/>
        <rect x="37" y="42" width="2.5" height="0.8"/>
        <rect x="40.5" y="42" width="2.5" height="0.8"/>
      </g>
      <path d="M0 72 Q40 70, 80 72 L80 80 L0 80 Z" fill="#5C3A1F"/>
      <rect x="2" y="62" width="1.8" height="18" fill="#3A1F0A"/>
      <ellipse cx="2.8" cy="62" rx="6" ry="2" fill="#1A8C5C" transform="rotate(-25 2.8 62)"/>
      <ellipse cx="2.8" cy="62" rx="6" ry="2" fill="#22C55E" transform="rotate(-70 2.8 62)"/>
      <ellipse cx="2.8" cy="62" rx="6" ry="2" fill="#1A8C5C" transform="rotate(25 2.8 62)"/>
      <rect x="74" y="60" width="2" height="20" fill="#3A1F0A"/>
      <ellipse cx="75" cy="60" rx="7" ry="2.5" fill="#1A8C5C" transform="rotate(-25 75 60)"/>
      <ellipse cx="75" cy="60" rx="7" ry="2.5" fill="#22C55E" transform="rotate(-70 75 60)"/>
      <ellipse cx="75" cy="60" rx="7" ry="2.5" fill="#1A8C5C" transform="rotate(25 75 60)"/>
      <ellipse cx="75" cy="60" rx="7" ry="2.5" fill="#22C55E" transform="rotate(70 75 60)"/>
    </svg>
  ),

  // ==== DTLA夜景スカイライン（昼） ====
  skyline: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="sSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5BB0E5"/>
          <stop offset="100%" stopColor="#B7DEF2"/>
        </linearGradient>
      </defs>
      <rect width="80" height="50" fill="url(#sSky)"/>
      <ellipse cx="58" cy="12" rx="10" ry="2.5" fill="#FFF" opacity="0.75"/>
      <ellipse cx="62" cy="14" rx="6" ry="1.5" fill="#FFF" opacity="0.6"/>
      <ellipse cx="18" cy="18" rx="8" ry="2" fill="#FFF" opacity="0.65"/>
      <circle cx="12" cy="14" r="5" fill="#FFE5A8" opacity="0.6"/>
      <circle cx="12" cy="14" r="3" fill="#FFCA28"/>
      <rect x="2" y="35" width="6" height="32" fill="#7A95B5"/>
      <rect x="9" y="32" width="7" height="35" fill="#5A7895"/>
      <rect x="17" y="22" width="5" height="45" fill="#4A6890"/>
      <rect x="23" y="28" width="8" height="39" fill="#2F4D78"/>
      <polygon points="23,28 27,18 31,28" fill="#1F3D68"/>
      <rect x="32" y="14" width="7" height="53" fill="#5A7895"/>
      <rect x="40" y="20" width="6" height="47" fill="#3F5B8F"/>
      <polygon points="40,20 43,12 46,20" fill="#2F4D78"/>
      <rect x="47" y="26" width="9" height="41" fill="#5A7895"/>
      <rect x="57" y="30" width="6" height="37" fill="#4A6890"/>
      <rect x="64" y="36" width="5" height="31" fill="#7A95B5"/>
      <rect x="70" y="33" width="7" height="34" fill="#5A7895"/>
      <g fill="#FFE89E">
        <rect x="3" y="38" width="1" height="1.5"/><rect x="5" y="38" width="1" height="1.5"/>
        <rect x="3" y="42" width="1" height="1.5"/><rect x="5" y="42" width="1" height="1.5"/>
        <rect x="3" y="46" width="1" height="1.5"/><rect x="5" y="46" width="1" height="1.5"/>
        <rect x="10" y="34" width="1" height="1.5"/><rect x="13" y="34" width="1" height="1.5"/><rect x="15" y="34" width="1" height="1.5"/>
        <rect x="10" y="38" width="1" height="1.5"/><rect x="13" y="38" width="1" height="1.5"/>
        <rect x="10" y="42" width="1" height="1.5"/><rect x="13" y="42" width="1" height="1.5"/><rect x="15" y="42" width="1" height="1.5"/>
        <rect x="18" y="26" width="1" height="1.5"/><rect x="20" y="26" width="1" height="1.5"/>
        <rect x="18" y="30" width="1" height="1.5"/><rect x="20" y="32" width="1" height="1.5"/>
        <rect x="24" y="32" width="1" height="1.5"/><rect x="26" y="32" width="1" height="1.5"/><rect x="28" y="32" width="1" height="1.5"/>
        <rect x="24" y="36" width="1" height="1.5"/><rect x="28" y="38" width="1" height="1.5"/>
        <rect x="24" y="42" width="1" height="1.5"/><rect x="26" y="42" width="1" height="1.5"/>
        <rect x="33" y="18" width="1" height="1.5"/><rect x="36" y="18" width="1" height="1.5"/>
        <rect x="33" y="24" width="1" height="1.5"/><rect x="36" y="22" width="1" height="1.5"/>
        <rect x="33" y="30" width="1" height="1.5"/><rect x="36" y="30" width="1" height="1.5"/>
        <rect x="41" y="24" width="1" height="1.5"/><rect x="44" y="24" width="1" height="1.5"/>
        <rect x="41" y="30" width="1" height="1.5"/><rect x="44" y="30" width="1" height="1.5"/>
        <rect x="48" y="30" width="1" height="1.5"/><rect x="50" y="30" width="1" height="1.5"/><rect x="53" y="30" width="1" height="1.5"/>
        <rect x="48" y="36" width="1" height="1.5"/><rect x="50" y="36" width="1" height="1.5"/>
        <rect x="58" y="34" width="1" height="1.5"/><rect x="60" y="34" width="1" height="1.5"/>
        <rect x="65" y="40" width="1" height="1.5"/><rect x="67" y="40" width="1" height="1.5"/>
        <rect x="71" y="37" width="1" height="1.5"/><rect x="73" y="37" width="1" height="1.5"/><rect x="75" y="37" width="1" height="1.5"/>
      </g>
      <rect x="0" y="67" width="80" height="3" fill="#2D4670"/>
      <rect x="0" y="70" width="80" height="10" fill="#3F5B8F"/>
      <path d="M0 70 Q20 71, 40 70 T80 70" stroke="#FFF" strokeWidth="0.3" fill="none" opacity="0.4"/>
      <rect x="22" y="64" width="2" height="3" fill="#1A8C5C"/>
      <polygon points="23,60 26,67 20,67" fill="#1A8C5C"/>
      <rect x="56" y="64" width="2" height="3" fill="#1A8C5C"/>
      <polygon points="57,60 60,67 54,67" fill="#1A8C5C"/>
    </svg>
  ),

  // ==== アート（LACMA Urban Light風） ====
  art: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="aSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8AB5"/>
          <stop offset="60%" stopColor="#FFC8D8"/>
          <stop offset="100%" stopColor="#FFE8B5"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" fill="url(#aSky)"/>
      <circle cx="64" cy="14" r="5" fill="#FFF" opacity="0.7"/>
      <ellipse cx="14" cy="22" rx="8" ry="2" fill="#FFF" opacity="0.45"/>
      <rect x="0" y="60" width="80" height="20" fill="#4A4135"/>
      <rect x="0" y="60" width="80" height="2" fill="#5C5040"/>
      <g>
        <rect x="6"  y="36" width="2" height="26" fill="#F4E8C8"/>
        <circle cx="7" cy="36" r="3.5" fill="#FFE8B5"/>
        <circle cx="7" cy="36" r="2" fill="#FFCA28"/>
        <rect x="14" y="32" width="2" height="30" fill="#F4E8C8"/>
        <circle cx="15" cy="32" r="3.5" fill="#FFE8B5"/>
        <circle cx="15" cy="32" r="2" fill="#FFCA28"/>
        <rect x="22" y="34" width="2" height="28" fill="#F4E8C8"/>
        <circle cx="23" cy="34" r="3.5" fill="#FFE8B5"/>
        <circle cx="23" cy="34" r="2" fill="#FFCA28"/>
        <rect x="30" y="30" width="2" height="32" fill="#F4E8C8"/>
        <circle cx="31" cy="30" r="3.5" fill="#FFE8B5"/>
        <circle cx="31" cy="30" r="2" fill="#FFCA28"/>
        <rect x="38" y="34" width="2" height="28" fill="#F4E8C8"/>
        <circle cx="39" cy="34" r="3.5" fill="#FFE8B5"/>
        <circle cx="39" cy="34" r="2" fill="#FFCA28"/>
        <rect x="46" y="32" width="2" height="30" fill="#F4E8C8"/>
        <circle cx="47" cy="32" r="3.5" fill="#FFE8B5"/>
        <circle cx="47" cy="32" r="2" fill="#FFCA28"/>
        <rect x="54" y="36" width="2" height="26" fill="#F4E8C8"/>
        <circle cx="55" cy="36" r="3.5" fill="#FFE8B5"/>
        <circle cx="55" cy="36" r="2" fill="#FFCA28"/>
        <rect x="62" y="34" width="2" height="28" fill="#F4E8C8"/>
        <circle cx="63" cy="34" r="3.5" fill="#FFE8B5"/>
        <circle cx="63" cy="34" r="2" fill="#FFCA28"/>
        <rect x="70" y="38" width="2" height="24" fill="#F4E8C8"/>
        <circle cx="71" cy="38" r="3.5" fill="#FFE8B5"/>
        <circle cx="71" cy="38" r="2" fill="#FFCA28"/>
      </g>
      <ellipse cx="7" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="15" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="23" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="31" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="39" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="47" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="55" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="63" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
      <ellipse cx="71" cy="62" rx="4" ry="0.8" fill="#FFCA28" opacity="0.3"/>
    </svg>
  ),

  // ==== 自然・山・ハイキング ====
  mountain: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BCAE8"/>
          <stop offset="100%" stopColor="#D4ECF7"/>
        </linearGradient>
      </defs>
      <rect width="80" height="45" fill="url(#mSky)"/>
      <ellipse cx="14" cy="14" rx="9" ry="2.5" fill="#FFF" opacity="0.7"/>
      <ellipse cx="10" cy="17" rx="6" ry="1.5" fill="#FFF" opacity="0.6"/>
      <ellipse cx="60" cy="9" rx="8" ry="2" fill="#FFF" opacity="0.55"/>
      <ellipse cx="65" cy="12" rx="5" ry="1.2" fill="#FFF" opacity="0.5"/>
      <circle cx="62" cy="20" r="6" fill="#FFE5A8" opacity="0.55"/>
      <circle cx="62" cy="20" r="4" fill="#FFCA28"/>
      <path d="M0 45 L20 18 L40 40 L60 14 L80 42 L80 60 L0 60 Z" fill="#3A6850"/>
      <path d="M40 40 L46 36 L50 40 Z" fill="#2A5340"/>
      <path d="M60 14 L66 18 L66 22 Z" fill="#FFF" opacity="0.5"/>
      <path d="M20 18 L24 22 L24 24 Z" fill="#FFF" opacity="0.4"/>
      <path d="M0 52 L14 36 L30 50 L48 30 L66 48 L80 38 L80 65 L0 65 Z" fill="#5A8870"/>
      <path d="M0 60 L18 50 L36 58 L54 46 L72 58 L80 54 L80 75 L0 75 Z" fill={C.green}/>
      <rect x="8" y="62" width="1" height="4" fill="#5C3A1A"/>
      <polygon points="8.5,57 11,64 6,64" fill="#1A8C5C"/>
      <polygon points="8.5,54 11,60 6,60" fill="#1A8C5C"/>
      <rect x="22" y="60" width="1" height="4" fill="#5C3A1A"/>
      <polygon points="22.5,55 25,62 20,62" fill="#1A8C5C"/>
      <polygon points="22.5,52 25,58 20,58" fill="#1A8C5C"/>
      <rect x="42" y="58" width="1" height="4" fill="#5C3A1A"/>
      <polygon points="42.5,53 45,60 40,60" fill="#1A8C5C"/>
      <polygon points="42.5,50 45,56 40,56" fill="#1A8C5C"/>
      <rect x="58" y="60" width="1" height="4" fill="#5C3A1A"/>
      <polygon points="58.5,55 61,62 56,62" fill="#1A8C5C"/>
      <rect x="68" y="63" width="1" height="4" fill="#5C3A1A"/>
      <polygon points="68.5,58 71,65 66,65" fill="#1A8C5C"/>
      <path d="M30 68 Q40 65, 50 70 Q60 72, 70 70 L80 80 L0 80 Z" fill="#7A4A28"/>
      <path d="M30 68 Q40 65, 50 70 Q60 72, 70 70" stroke="#D9C8A8" strokeWidth="0.5" fill="none"/>
      <path d="M0 75 Q40 73, 80 75 L80 80 L0 80 Z" fill="#5A8870"/>
    </svg>
  ),

  // ==== テーマパーク（ディズニー風城） ====
  themepark: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB8E0"/>
          <stop offset="50%" stopColor="#FFD9F0"/>
          <stop offset="100%" stopColor="#B5E5FF"/>
        </linearGradient>
      </defs>
      <rect width="80" height="55" fill="url(#tSky)"/>
      <g fill={C.coral} opacity="0.85">
        <polygon points="14,10 15,14 19,14 16,17 17,21 14,18 11,21 12,17 9,14 13,14"/>
      </g>
      <g fill={C.blue} opacity="0.85">
        <polygon points="64,8 65,12 69,12 66,15 67,19 64,16 61,19 62,15 59,12 63,12"/>
      </g>
      <g fill={C.yellow}>
        <polygon points="40,4 41,8 45,8 42,11 43,15 40,12 37,15 38,11 35,8 39,8"/>
      </g>
      <ellipse cx="22" cy="20" rx="5" ry="1.5" fill="#FFF" opacity="0.6"/>
      <ellipse cx="58" cy="18" rx="4" ry="1.2" fill="#FFF" opacity="0.5"/>
      <rect x="14" y="42" width="52" height="28" fill="#FF92B3"/>
      <rect x="14" y="42" width="52" height="3" fill="#9D2D5E"/>
      <rect x="32" y="34" width="16" height="36" fill="#FF6B98"/>
      <polygon points="14,42 22,30 30,42" fill={C.coral}/>
      <polygon points="32,34 40,18 48,34" fill={C.coral}/>
      <polygon points="50,42 58,30 66,42" fill={C.coral}/>
      <line x1="22" y1="30" x2="22" y2="22" stroke="#9D2D5E" strokeWidth="0.8"/>
      <polygon points="22,22 28,24 22,26" fill={C.yellow}/>
      <line x1="40" y1="18" x2="40" y2="10" stroke="#9D2D5E" strokeWidth="0.8"/>
      <polygon points="40,10 48,12 40,14" fill={C.yellow}/>
      <line x1="58" y1="30" x2="58" y2="22" stroke="#9D2D5E" strokeWidth="0.8"/>
      <polygon points="58,22 64,24 58,26" fill={C.yellow}/>
      <path d="M36 52 Q36 46, 40 46 Q44 46, 44 52 L44 60 L36 60 Z" fill="#5C2D4A"/>
      <circle cx="38" cy="50" r="0.6" fill={C.yellow}/>
      <circle cx="42" cy="50" r="0.6" fill={C.yellow}/>
      <rect x="20" y="48" width="3" height="6" fill="#FFE5B0"/>
      <rect x="20" y="48" width="3" height="0.8" fill="#9D2D5E"/>
      <rect x="56" y="48" width="3" height="6" fill="#FFE5B0"/>
      <rect x="56" y="48" width="3" height="0.8" fill="#9D2D5E"/>
      <rect x="20" y="60" width="3" height="4" fill="#FFE5B0"/>
      <rect x="20" y="60" width="3" height="0.8" fill="#9D2D5E"/>
      <rect x="56" y="60" width="3" height="4" fill="#FFE5B0"/>
      <rect x="56" y="60" width="3" height="0.8" fill="#9D2D5E"/>
      <rect x="0" y="68" width="80" height="12" fill="#FFB87A"/>
      <path d="M0 72 Q20 71, 40 72 T80 72" stroke="#E89A4E" strokeWidth="0.3" fill="none"/>
      <circle cx="6" cy="74" r="3" fill="#1A8C5C"/>
      <circle cx="9" cy="73" r="3" fill="#22C55E"/>
      <circle cx="72" cy="74" r="3" fill="#1A8C5C"/>
      <circle cx="75" cy="73" r="3" fill="#22C55E"/>
    </svg>
  ),

  // ==== ショッピング街 ====
  shopping: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="shSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D0FF"/>
          <stop offset="100%" stopColor="#FFF0E5"/>
        </linearGradient>
      </defs>
      <rect width="80" height="56" fill="url(#shSky)"/>
      <ellipse cx="20" cy="14" rx="8" ry="1.5" fill="#FFF" opacity="0.7"/>
      <ellipse cx="60" cy="10" rx="6" ry="1.2" fill="#FFF" opacity="0.6"/>
      <rect x="0" y="32" width="36" height="36" fill="#FFE5C9"/>
      <rect x="0" y="32" width="36" height="3" fill="#E89A6B"/>
      <rect x="2" y="38" width="14" height="18" fill="#5C3A1A"/>
      <rect x="3" y="40" width="12" height="14" fill="#FFDA7A" opacity="0.7"/>
      <circle cx="9" cy="46" r="2" fill="#FFF"/>
      <rect x="6" y="46" width="6" height="6" fill={C.coral}/>
      <path d="M2 35 L16 35 L14 40 L4 40 Z" fill={C.coral}/>
      <path d="M2 35 L16 35 L16 38 L2 38 Z" fill="none" stroke={C.coral} strokeWidth="0.3"/>
      <line x1="4" y1="35" x2="4" y2="38" stroke={C.coral} strokeWidth="0.3"/>
      <line x1="8" y1="35" x2="8" y2="38" stroke={C.coral} strokeWidth="0.3"/>
      <line x1="12" y1="35" x2="12" y2="38" stroke={C.coral} strokeWidth="0.3"/>
      <rect x="20" y="38" width="14" height="18" fill="#9D2D5E"/>
      <rect x="22" y="40" width="10" height="12" fill="#FFB5C7"/>
      <text x="27" y="50" fontSize="6" fontWeight="900" textAnchor="middle" fill="#FFF">LA</text>
      <path d="M20 35 L34 35 L32 40 L22 40 Z" fill={C.yellow}/>
      <path d="M20 35 L34 35 L34 38 L20 38 Z" fill="none" stroke="#E0A800" strokeWidth="0.3"/>
      <rect x="44" y="40" width="36" height="28" fill="#FFFFFF"/>
      <rect x="44" y="40" width="36" height="3" fill="#7A95B5"/>
      <rect x="48" y="46" width="11" height="16" fill="#5C5040"/>
      <rect x="50" y="48" width="7" height="12" fill="#E8D5C0"/>
      <ellipse cx="53.5" cy="51" rx="2" ry="2" fill="#FFE0B5"/>
      <rect x="51" y="53" width="5" height="6" fill={C.blue}/>
      <rect x="64" y="46" width="13" height="16" fill="#5C5040"/>
      <rect x="66" y="48" width="9" height="12" fill="#E8D5C0"/>
      <ellipse cx="70.5" cy="51" rx="2" ry="2" fill="#FFE0B5"/>
      <rect x="67" y="53" width="7" height="6" fill={C.coral}/>
      <path d="M44 35 L80 35 L78 41 L46 41 Z" fill={C.blue}/>
      <path d="M58 18 Q61 14, 64 18 Q64 22, 58 26 Q52 22, 52 18 Q55 14, 58 18 Z" fill={C.coral}/>
      <path d="M14 20 Q17 16, 20 20 Q20 24, 14 28 Q8 24, 8 20 Q11 16, 14 20 Z" fill={C.yellow} opacity="0.7"/>
      <rect x="0" y="68" width="80" height="12" fill="#7A6850"/>
      <rect x="0" y="68" width="80" height="2" fill="#5C4E3A"/>
      <rect x="6" y="73" width="12" height="2" fill="#FFD60A" opacity="0.5"/>
      <rect x="22" y="73" width="12" height="2" fill="#FFD60A" opacity="0.5"/>
      <rect x="38" y="73" width="12" height="2" fill="#FFD60A" opacity="0.5"/>
      <rect x="54" y="73" width="12" height="2" fill="#FFD60A" opacity="0.5"/>
    </svg>
  ),

  // ==== リトル東京（提灯と鳥居） ====
  little_tokyo: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="ltSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB876"/>
          <stop offset="60%" stopColor="#FFDFA8"/>
          <stop offset="100%" stopColor="#FFF0D8"/>
        </linearGradient>
      </defs>
      <rect width="80" height="58" fill="url(#ltSky)"/>
      <ellipse cx="18" cy="14" rx="9" ry="2" fill="#FFF" opacity="0.65"/>
      <ellipse cx="14" cy="17" rx="5" ry="1.2" fill="#FFF" opacity="0.5"/>
      <circle cx="40" cy="20" r="13" fill="#FF5C5C"/>
      <circle cx="38" cy="18" r="11" fill="#FF8585" opacity="0.4"/>
      <g stroke="#FFF" strokeWidth="0.5" opacity="0.5">
        <line x1="40" y1="2" x2="40" y2="38"/>
        <line x1="22" y1="20" x2="58" y2="20"/>
        <line x1="29" y1="9" x2="51" y2="31"/>
        <line x1="29" y1="31" x2="51" y2="9"/>
      </g>
      <g>
        <line x1="14" y1="30" x2="14" y2="33" stroke="#5C3A1A" strokeWidth="0.6"/>
        <ellipse cx="14" cy="40" rx="6" ry="9" fill="#C8163A"/>
        <ellipse cx="13" cy="38" rx="2.5" ry="3" fill="#FF6B6B" opacity="0.4"/>
        <rect x="9.5" y="34" width="9" height="1.2" fill="#1A1A1A"/>
        <rect x="9.5" y="45" width="9" height="1.2" fill="#1A1A1A"/>
        <rect x="13" y="49" width="2" height="3" fill="#FFD60A"/>
        <rect x="11" y="52" width="6" height="0.6" fill="#5C3A1A"/>
        <line x1="11" y1="52" x2="9" y2="56" stroke="#1A1A1A" strokeWidth="0.4"/>
        <line x1="17" y1="52" x2="19" y2="56" stroke="#1A1A1A" strokeWidth="0.4"/>
        <line x1="14" y1="52" x2="14" y2="56" stroke="#1A1A1A" strokeWidth="0.4"/>
      </g>
      <g>
        <line x1="66" y1="28" x2="66" y2="31" stroke="#5C3A1A" strokeWidth="0.6"/>
        <ellipse cx="66" cy="40" rx="7" ry="10" fill="#C8163A"/>
        <ellipse cx="64" cy="37" rx="3" ry="3.5" fill="#FF6B6B" opacity="0.4"/>
        <rect x="60.5" y="33" width="11" height="1.2" fill="#1A1A1A"/>
        <rect x="60.5" y="46" width="11" height="1.2" fill="#1A1A1A"/>
        <rect x="65" y="50" width="2" height="3" fill="#FFD60A"/>
        <rect x="63" y="53" width="6" height="0.6" fill="#5C3A1A"/>
        <line x1="63" y1="53" x2="61" y2="58" stroke="#1A1A1A" strokeWidth="0.4"/>
        <line x1="69" y1="53" x2="71" y2="58" stroke="#1A1A1A" strokeWidth="0.4"/>
        <line x1="66" y1="53" x2="66" y2="58" stroke="#1A1A1A" strokeWidth="0.4"/>
      </g>
      <g>
        <rect x="30" y="50" width="2.5" height="20" fill="#9D2D5E"/>
        <rect x="47.5" y="50" width="2.5" height="20" fill="#9D2D5E"/>
        <path d="M26 48 L54 48 L52 52 L28 52 Z" fill="#9D2D5E"/>
        <rect x="29" y="52" width="22" height="2.5" fill="#9D2D5E"/>
        <path d="M26 48 L54 48 L52 47 L28 47 Z" fill="#7A1F4A"/>
      </g>
      <rect x="0" y="70" width="80" height="10" fill="#7A5A38"/>
      <path d="M0 73 L80 73" stroke="#5C3F22" strokeWidth="0.4"/>
      <path d="M0 76 L80 76" stroke="#5C3F22" strokeWidth="0.4"/>
      <circle cx="6" cy="14" r="0.5" fill="#FFB5D8"/>
      <circle cx="74" cy="18" r="0.5" fill="#FFB5D8"/>
      <circle cx="30" cy="6" r="0.5" fill="#FFB5D8"/>
    </svg>
  ),

  // ==== 歴史的建築（柱のあるクラシカル） ====
  historic: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="hiSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC899"/>
          <stop offset="100%" stopColor="#FFE5C0"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" fill="url(#hiSky)"/>
      <ellipse cx="14" cy="12" rx="9" ry="2" fill="#FFF" opacity="0.6"/>
      <ellipse cx="65" cy="10" rx="6" ry="1.5" fill="#FFF" opacity="0.5"/>
      <polygon points="10,30 40,12 70,30 70,32 10,32" fill="#C8163A"/>
      <polygon points="10,30 40,12 70,30" fill="#9D2D5E" opacity="0.4"/>
      <line x1="40" y1="12" x2="40" y2="30" stroke="#7A1F4A" strokeWidth="0.4" opacity="0.5"/>
      <rect x="14" y="30" width="52" height="40" fill="#FAF3DD"/>
      <rect x="14" y="30" width="52" height="3" fill="#E3D8B5"/>
      <rect x="18" y="36" width="3" height="32" fill="#E0D5B5"/>
      <rect x="18" y="33" width="3" height="3" fill="#C9BDA0"/>
      <rect x="17.5" y="68" width="4" height="2" fill="#A8A088"/>
      <rect x="26" y="36" width="3" height="32" fill="#E0D5B5"/>
      <rect x="26" y="33" width="3" height="3" fill="#C9BDA0"/>
      <rect x="25.5" y="68" width="4" height="2" fill="#A8A088"/>
      <rect x="34" y="36" width="3" height="32" fill="#E0D5B5"/>
      <rect x="34" y="33" width="3" height="3" fill="#C9BDA0"/>
      <rect x="33.5" y="68" width="4" height="2" fill="#A8A088"/>
      <rect x="42" y="36" width="3" height="32" fill="#E0D5B5"/>
      <rect x="42" y="33" width="3" height="3" fill="#C9BDA0"/>
      <rect x="41.5" y="68" width="4" height="2" fill="#A8A088"/>
      <rect x="50" y="36" width="3" height="32" fill="#E0D5B5"/>
      <rect x="50" y="33" width="3" height="3" fill="#C9BDA0"/>
      <rect x="49.5" y="68" width="4" height="2" fill="#A8A088"/>
      <rect x="58" y="36" width="3" height="32" fill="#E0D5B5"/>
      <rect x="58" y="33" width="3" height="3" fill="#C9BDA0"/>
      <rect x="57.5" y="68" width="4" height="2" fill="#A8A088"/>
      <line x1="18.5" y1="40" x2="18.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="19.5" y1="40" x2="19.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="20.5" y1="40" x2="20.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="34.5" y1="40" x2="34.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="35.5" y1="40" x2="35.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="36.5" y1="40" x2="36.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="50.5" y1="40" x2="50.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="51.5" y1="40" x2="51.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <line x1="52.5" y1="40" x2="52.5" y2="66" stroke="#C9BDA0" strokeWidth="0.2"/>
      <rect x="38" y="55" width="4" height="15" fill="#5C3A1A"/>
      <path d="M38 55 Q40 50, 42 55" fill="#5C3A1A"/>
      <rect x="10" y="70" width="60" height="2" fill="#C9BDA0"/>
      <rect x="6" y="72" width="68" height="2" fill="#C9BDA0"/>
      <rect x="2" y="74" width="76" height="2" fill="#C9BDA0"/>
      <rect x="0" y="76" width="80" height="4" fill="#9C9078"/>
    </svg>
  ),

  // ==== 朝食 / コーヒー＆ペストリー ====
  food_breakfast: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id="fbBg" cx="0.5" cy="0.5" r="0.8">
          <stop offset="0%" stopColor="#FFF6E0"/>
          <stop offset="100%" stopColor="#FFE0A8"/>
        </radialGradient>
      </defs>
      <rect width="80" height="80" fill="url(#fbBg)"/>
      <rect x="0" y="60" width="80" height="20" fill="#7A5638"/>
      <rect x="0" y="58" width="80" height="2" fill="#9D7250"/>
      <path d="M0 58 L80 58" stroke="#5C3F22" strokeWidth="0.3" opacity="0.5"/>
      <ellipse cx="28" cy="62" rx="20" ry="3.5" fill="#1A1A1A" opacity="0.2"/>
      <path d="M14 36 Q14 30, 22 30 L36 30 Q44 30, 44 36 L44 56 Q44 60, 36 60 L22 60 Q14 60, 14 56 Z" fill="#FFFFFF"/>
      <rect x="14" y="36" width="30" height="4" fill="#5C3A1A"/>
      <ellipse cx="29" cy="40" rx="14" ry="2.5" fill="#3A1F0A"/>
      <ellipse cx="29" cy="40" rx="12" ry="1.5" fill="#5C3A1A"/>
      <path d="M44 42 Q56 42, 56 50 Q56 58, 44 58" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
      <path d="M44 42 Q56 42, 56 50 Q56 58, 44 58" stroke="#E8E2D0" strokeWidth="0.5" fill="none"/>
      <path d="M22 28 Q20 24, 22 18 Q24 14, 22 8" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.75"/>
      <path d="M29 28 Q31 24, 29 18 Q27 14, 29 8" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M36 28 Q34 24, 36 18 Q38 14, 36 8" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.65"/>
      <ellipse cx="62" cy="56" rx="15" ry="3" fill="#E8E2D0" opacity="0.5"/>
      <path d="M50 54 Q50 46, 56 44 Q60 42, 64 44 Q70 45, 74 50 Q74 54, 70 54 Z" fill="#D49A4E" transform="rotate(-15 62 50)"/>
      <path d="M52 52 Q52 46, 57 45 Q62 44, 67 47 Q71 49, 71 52" stroke="#A87A3A" strokeWidth="0.4" fill="none" transform="rotate(-15 62 50)"/>
      <path d="M54 51 Q56 47, 60 47" stroke="#F4C474" strokeWidth="0.4" fill="none" transform="rotate(-15 62 50)"/>
      <path d="M58 49 Q62 46, 66 48" stroke="#F4C474" strokeWidth="0.4" fill="none" transform="rotate(-15 62 50)"/>
      <ellipse cx="62" cy="58" rx="16" ry="2.5" fill="#FFFFFF" opacity="0.6"/>
      <ellipse cx="62" cy="58" rx="16" ry="2.5" fill="none" stroke="#E8E2D0" strokeWidth="0.3"/>
      <ellipse cx="62" cy="55" rx="13" ry="1.5" fill="none" stroke="#E8E2D0" strokeWidth="0.3"/>
    </svg>
  ),

  // ==== バーガー ====
  food_burger: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="fbu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE2A8"/>
          <stop offset="100%" stopColor="#FFB876"/>
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#fbu)"/>
      <ellipse cx="40" cy="68" rx="32" ry="4" fill="#1A1A1A" opacity="0.15"/>
      <path d="M12 36 Q12 16, 40 16 Q68 16, 68 36 L68 38 Q40 42, 12 38 Z" fill="#E89A4E"/>
      <path d="M12 36 Q12 16, 40 16 Q68 16, 68 36" stroke="#C97A30" strokeWidth="0.4" fill="none"/>
      <ellipse cx="20" cy="24" rx="1.2" ry="1" fill="#FFE5B0"/>
      <ellipse cx="28" cy="20" rx="1.2" ry="1" fill="#FFE5B0"/>
      <ellipse cx="36" cy="18" rx="1.2" ry="1" fill="#FFE5B0"/>
      <ellipse cx="44" cy="18" rx="1.2" ry="1" fill="#FFE5B0"/>
      <ellipse cx="52" cy="20" rx="1.2" ry="1" fill="#FFE5B0"/>
      <ellipse cx="60" cy="24" rx="1.2" ry="1" fill="#FFE5B0"/>
      <ellipse cx="24" cy="30" rx="1" ry="0.8" fill="#FFE5B0"/>
      <ellipse cx="40" cy="26" rx="1" ry="0.8" fill="#FFE5B0"/>
      <ellipse cx="56" cy="30" rx="1" ry="0.8" fill="#FFE5B0"/>
      <path d="M10 38 Q20 33, 30 38 Q40 33, 50 38 Q60 33, 70 38 L70 44 L10 44 Z" fill={C.green}/>
      <path d="M10 38 Q20 33, 30 38 Q40 33, 50 38 Q60 33, 70 38" stroke="#1A8C5C" strokeWidth="0.4" fill="none"/>
      <path d="M16 38 Q18 35, 20 38" stroke="#1A8C5C" strokeWidth="0.3" fill="none"/>
      <path d="M36 38 Q38 35, 40 38" stroke="#1A8C5C" strokeWidth="0.3" fill="none"/>
      <path d="M56 38 Q58 35, 60 38" stroke="#1A8C5C" strokeWidth="0.3" fill="none"/>
      <rect x="10" y="44" width="60" height="4" fill={C.yellow}/>
      <path d="M10 44 L70 44" stroke="#E0A800" strokeWidth="0.4"/>
      <path d="M10 48 L18 50 L30 47 L42 49 L54 47 L66 49 L70 48 L70 52 L10 52 Z" fill="#5C3A1A"/>
      <path d="M10 48 L18 50 L30 47 L42 49 L54 47 L66 49 L70 48" stroke="#3A1F0A" strokeWidth="0.4" fill="none"/>
      <ellipse cx="22" cy="50" rx="1.5" ry="0.6" fill="#7A4A28"/>
      <ellipse cx="44" cy="51" rx="1.5" ry="0.6" fill="#7A4A28"/>
      <ellipse cx="58" cy="50" rx="1.5" ry="0.6" fill="#7A4A28"/>
      <path d="M12 52 L68 52 Q68 64, 40 64 Q12 64, 12 52 Z" fill="#E89A4E"/>
      <path d="M12 52 L68 52" stroke="#C97A30" strokeWidth="0.4" fill="none"/>
      <path d="M12 56 Q40 60, 68 56" stroke="#C97A30" strokeWidth="0.3" fill="none" opacity="0.7"/>
    </svg>
  ),

  // ==== タコス ====
  food_taco: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="ftSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE8A8"/>
          <stop offset="100%" stopColor="#FFC890"/>
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#ftSky)"/>
      <ellipse cx="40" cy="62" rx="30" ry="3.5" fill="#1A1A1A" opacity="0.2"/>
      <path d="M8 56 Q40 12, 72 56 Q72 60, 40 60 Q8 60, 8 56 Z" fill="#F4B86E"/>
      <path d="M8 56 Q40 12, 72 56" stroke="#C97A30" strokeWidth="0.5" fill="none"/>
      <path d="M14 50 Q40 20, 66 50" stroke="#C97A30" strokeWidth="0.3" fill="none" opacity="0.6"/>
      <ellipse cx="20" cy="40" rx="1" ry="0.8" fill="#C97A30" opacity="0.6"/>
      <ellipse cx="32" cy="30" rx="1" ry="0.8" fill="#C97A30" opacity="0.6"/>
      <ellipse cx="48" cy="30" rx="1" ry="0.8" fill="#C97A30" opacity="0.6"/>
      <ellipse cx="60" cy="40" rx="1" ry="0.8" fill="#C97A30" opacity="0.6"/>
      <ellipse cx="40" cy="48" rx="26" ry="6" fill={C.green}/>
      <path d="M14 48 Q16 45, 18 48" stroke="#1A8C5C" strokeWidth="0.5" fill="none"/>
      <path d="M22 47 Q24 44, 26 47" stroke="#1A8C5C" strokeWidth="0.5" fill="none"/>
      <path d="M30 46 Q32 43, 34 46" stroke="#1A8C5C" strokeWidth="0.5" fill="none"/>
      <path d="M40 45 Q42 42, 44 45" stroke="#1A8C5C" strokeWidth="0.5" fill="none"/>
      <path d="M50 46 Q52 43, 54 46" stroke="#1A8C5C" strokeWidth="0.5" fill="none"/>
      <ellipse cx="40" cy="52" rx="25" ry="4" fill="#7A2D1A"/>
      <ellipse cx="22" cy="51" rx="1.5" ry="1" fill="#9D3D22" opacity="0.6"/>
      <ellipse cx="36" cy="52" rx="1.5" ry="1" fill="#9D3D22" opacity="0.6"/>
      <ellipse cx="52" cy="51" rx="1.5" ry="1" fill="#9D3D22" opacity="0.6"/>
      <circle cx="20" cy="48" r="1.8" fill={C.coral}/>
      <circle cx="20" cy="48" r="0.8" fill="#FFF" opacity="0.4"/>
      <circle cx="30" cy="46" r="1.8" fill={C.coral}/>
      <circle cx="30" cy="46" r="0.8" fill="#FFF" opacity="0.4"/>
      <circle cx="44" cy="46" r="1.8" fill={C.coral}/>
      <circle cx="44" cy="46" r="0.8" fill="#FFF" opacity="0.4"/>
      <circle cx="56" cy="48" r="1.8" fill={C.coral}/>
      <circle cx="56" cy="48" r="0.8" fill="#FFF" opacity="0.4"/>
      <ellipse cx="26" cy="50" rx="1.2" ry="0.6" fill="#FFFFFF"/>
      <ellipse cx="38" cy="49" rx="1.2" ry="0.6" fill="#FFFFFF"/>
      <ellipse cx="50" cy="50" rx="1.2" ry="0.6" fill="#FFFFFF"/>
      <ellipse cx="62" cy="49" rx="1.2" ry="0.6" fill="#FFFFFF"/>
      <path d="M16 56 L18 58 L20 56 L22 58 L24 56 L26 58 L28 56 L30 58 L32 56" stroke={C.yellow} strokeWidth="0.6" fill="none"/>
      <path d="M48 56 L50 58 L52 56 L54 58 L56 56 L58 58 L60 56 L62 58 L64 56" stroke={C.yellow} strokeWidth="0.6" fill="none"/>
    </svg>
  ),

  // ==== 寿司 ====
  food_sushi: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="80" height="80" fill="#FFEEDD"/>
      <rect x="0" y="50" width="80" height="30" fill="#3D2A1A"/>
      <path d="M0 50 L80 50" stroke="#5C3F22" strokeWidth="0.5"/>
      <rect x="4" y="54" width="72" height="22" fill="#5C3F22"/>
      <rect x="4" y="54" width="72" height="1" fill="#7A5638"/>
      <ellipse cx="40" cy="64" rx="30" ry="2" fill="#000" opacity="0.2"/>
      <ellipse cx="14" cy="42" rx="10" ry="5" fill="#FFF"/>
      <ellipse cx="14" cy="40" rx="10" ry="3.5" fill="none" stroke="#E5D9C0" strokeWidth="0.3"/>
      <circle cx="11" cy="42" r="0.5" fill="#E5D9C0"/>
      <circle cx="14" cy="44" r="0.5" fill="#E5D9C0"/>
      <circle cx="17" cy="42" r="0.5" fill="#E5D9C0"/>
      <ellipse cx="14" cy="38" rx="9.5" ry="3" fill="#FF5C5C"/>
      <ellipse cx="14" cy="37" rx="9.5" ry="2.5" fill="#FF8585" opacity="0.7"/>
      <line x1="6" y1="38" x2="22" y2="38" stroke="#FF3A3A" strokeWidth="0.4" opacity="0.6"/>
      <line x1="6" y1="36" x2="22" y2="36" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.4"/>
      <line x1="6" y1="40" x2="22" y2="40" stroke="#FF3A3A" strokeWidth="0.4" opacity="0.5"/>
      <rect x="5" y="38" width="18" height="2.5" fill="#1A4A6B"/>
      <ellipse cx="40" cy="44" rx="11" ry="5" fill="#FFF"/>
      <ellipse cx="40" cy="42" rx="11" ry="4" fill="none" stroke="#E5D9C0" strokeWidth="0.3"/>
      <circle cx="36" cy="44" r="0.5" fill="#E5D9C0"/>
      <circle cx="40" cy="46" r="0.5" fill="#E5D9C0"/>
      <circle cx="44" cy="44" r="0.5" fill="#E5D9C0"/>
      <ellipse cx="40" cy="40" rx="10.5" ry="3" fill="#FFA570"/>
      <ellipse cx="40" cy="39" rx="10.5" ry="2.5" fill="#FFC090" opacity="0.6"/>
      <line x1="30" y1="40" x2="50" y2="40" stroke="#E8843A" strokeWidth="0.4" opacity="0.6"/>
      <line x1="30" y1="38" x2="50" y2="38" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.4"/>
      <rect x="29" y="40" width="22" height="2.5" fill="#1A4A6B"/>
      <ellipse cx="66" cy="44" rx="6" ry="3" fill="#1A4A6B"/>
      <rect x="60" y="38" width="12" height="8" fill="#1A4A6B"/>
      <rect x="60" y="38" width="12" height="0.4" fill="#0F2A40"/>
      <ellipse cx="66" cy="38" rx="6" ry="2" fill="#FFA500"/>
      <circle cx="63" cy="37.5" r="1" fill="#FF5500"/>
      <circle cx="65" cy="36.5" r="1" fill="#FF5500"/>
      <circle cx="67" cy="37.5" r="1" fill="#FF5500"/>
      <circle cx="69" cy="37" r="1" fill="#FF5500"/>
      <circle cx="64" cy="38.5" r="1" fill="#FF5500"/>
      <circle cx="68" cy="38.5" r="1" fill="#FF5500"/>
      <ellipse cx="56" cy="62" rx="7" ry="3" fill="#FFFFFF"/>
      <ellipse cx="56" cy="61" rx="6" ry="2.5" fill="#1A4A6B" opacity="0.85"/>
      <line x1="8" y1="20" x2="36" y2="32" stroke="#5C3A1A" strokeWidth="1.2"/>
      <line x1="8" y1="22" x2="36" y2="34" stroke="#5C3A1A" strokeWidth="1.2"/>
      <line x1="8" y1="20" x2="6" y2="18" stroke="#3A2410" strokeWidth="0.5"/>
      <line x1="8" y1="22" x2="6" y2="22" stroke="#3A2410" strokeWidth="0.5"/>
    </svg>
  ),

  // ==== ディナー（ワイン＆プレート） ====
  food_dinner: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id="fdBg" cx="0.5" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#FFB87A"/>
          <stop offset="100%" stopColor="#7A4828"/>
        </radialGradient>
      </defs>
      <rect width="80" height="80" fill="url(#fdBg)"/>
      <rect x="0" y="58" width="80" height="22" fill="#3A1F10"/>
      <rect x="0" y="56" width="80" height="2" fill="#5C3A1A"/>
      <ellipse cx="64" cy="40" rx="12" ry="2" fill="#1A1A1A" opacity="0.3"/>
      <path d="M52 12 L72 12 L70 18 L54 18 Z" fill="#9D2D5E"/>
      <path d="M54 18 Q56 22, 60 24 Q64 24, 68 22 Q70 22, 70 18" fill="#FFFFFF" opacity="0.95"/>
      <path d="M54 18 Q56 22, 60 24 Q64 24, 68 22 Q70 22, 70 18" fill="none" stroke="#E5D9C0" strokeWidth="0.3"/>
      <path d="M54 18 Q56 22, 60 24 Q64 24, 68 22 Q70 22, 70 18 L70 22 Q62 27, 54 22 Z" fill="#7A1F4A"/>
      <ellipse cx="62" cy="22" rx="6" ry="1" fill="#9D2D5E" opacity="0.6"/>
      <ellipse cx="62" cy="20" rx="4" ry="0.6" fill="#FF6B6B" opacity="0.7"/>
      <rect x="61" y="24" width="2" height="20" fill="#FFF" opacity="0.9"/>
      <ellipse cx="62" cy="46" rx="9" ry="2" fill="#FFFFFF"/>
      <ellipse cx="62" cy="44" rx="9" ry="2" fill="none" stroke="#E5D9C0" strokeWidth="0.4"/>
      <ellipse cx="28" cy="48" rx="22" ry="6" fill="#FFFFFF"/>
      <ellipse cx="28" cy="46" rx="22" ry="6" fill="none" stroke="#E5D9C0" strokeWidth="0.4"/>
      <ellipse cx="28" cy="43" rx="18" ry="3" fill="none" stroke="#E5D9C0" strokeWidth="0.3"/>
      <circle cx="28" cy="44" r="7" fill="#7A4A28"/>
      <ellipse cx="28" cy="42" rx="6" ry="2" fill="#9D5A38" opacity="0.7"/>
      <path d="M22 44 Q24 41, 26 44 Q28 41, 30 44 Q32 41, 34 44" stroke="#5C3A1A" strokeWidth="0.5" fill="none"/>
      <circle cx="18" cy="46" r="2.5" fill={C.green}/>
      <ellipse cx="17" cy="45" rx="1.5" ry="0.5" fill="#1A8C5C"/>
      <circle cx="40" cy="47" r="2" fill={C.coral}/>
      <circle cx="40" cy="47" r="0.8" fill="#FFB5C7"/>
      <circle cx="14" cy="47" r="1" fill={C.yellow}/>
      <circle cx="42" cy="44" r="1.2" fill={C.yellow}/>
      <line x1="52" y1="45" x2="50" y2="55" stroke="#C0C0C0" strokeWidth="1"/>
      <line x1="52" y1="45" x2="51" y2="44" stroke="#A0A0A0" strokeWidth="0.4"/>
      <line x1="52" y1="45" x2="53" y2="44" stroke="#A0A0A0" strokeWidth="0.4"/>
      <line x1="52" y1="45" x2="52" y2="43" stroke="#A0A0A0" strokeWidth="0.4"/>
      <rect x="6" y="18" width="2" height="20" fill="#FFE5B0"/>
      <ellipse cx="7" cy="14" rx="2" ry="3.5" fill={C.yellow}/>
      <ellipse cx="7" cy="13" rx="1.2" ry="2" fill="#FFF" opacity="0.5"/>
      <rect x="4" y="38" width="6" height="2" fill="#9D7250"/>
    </svg>
  ),

  // ==== 夜景（高層ビル＋月＋星） ====
  night_city: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="ncSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D1444"/>
          <stop offset="50%" stopColor="#2A2E68"/>
          <stop offset="100%" stopColor="#4A4080"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" fill="url(#ncSky)"/>
      <circle cx="14" cy="10" r="0.6" fill="#FFF"/>
      <circle cx="22" cy="6" r="0.5" fill="#FFF" opacity="0.8"/>
      <circle cx="34" cy="14" r="0.4" fill="#FFF" opacity="0.7"/>
      <circle cx="46" cy="8" r="0.6" fill="#FFF"/>
      <circle cx="58" cy="6" r="0.4" fill="#FFF" opacity="0.7"/>
      <circle cx="50" cy="18" r="0.4" fill="#FFF" opacity="0.6"/>
      <circle cx="70" cy="22" r="0.5" fill="#FFF" opacity="0.7"/>
      <circle cx="38" cy="22" r="0.4" fill="#FFF" opacity="0.5"/>
      <g transform="translate(60, 14)">
        <circle r="9" fill="#FFE5A8" opacity="0.2"/>
        <circle r="7" fill="#FFE8B5"/>
        <circle cx="2" cy="-1" r="6" fill="url(#ncSky)" opacity="0.85"/>
        <circle cx="-2" cy="1" r="0.6" fill="#E0D5A8"/>
        <circle cx="-3" cy="-2" r="0.4" fill="#E0D5A8"/>
        <circle cx="-1" cy="3" r="0.5" fill="#E0D5A8"/>
      </g>
      <rect x="2" y="32" width="8" height="34" fill="#2A2E68"/>
      <rect x="11" y="26" width="9" height="40" fill="#3A3F78"/>
      <rect x="21" y="22" width="6" height="44" fill="#1F2455"/>
      <polygon points="21,22 24,16 27,22" fill="#1A1F4A"/>
      <rect x="28" y="18" width="10" height="48" fill="#2A2E68"/>
      <polygon points="28,18 33,12 38,18" fill="#1F2455"/>
      <rect x="40" y="24" width="7" height="42" fill="#3A3F78"/>
      <rect x="48" y="28" width="11" height="38" fill="#2A2E68"/>
      <rect x="60" y="32" width="6" height="34" fill="#3A3F78"/>
      <rect x="67" y="28" width="9" height="38" fill="#1F2455"/>
      <polygon points="67,28 71,22 76,28" fill="#1A1F4A"/>
      <g fill="#FFE89E">
        <rect x="3" y="36" width="0.8" height="1.5"/><rect x="5" y="36" width="0.8" height="1.5"/><rect x="7" y="36" width="0.8" height="1.5"/>
        <rect x="3" y="42" width="0.8" height="1.5"/><rect x="7" y="42" width="0.8" height="1.5"/>
        <rect x="3" y="48" width="0.8" height="1.5"/><rect x="5" y="48" width="0.8" height="1.5"/>
        <rect x="3" y="54" width="0.8" height="1.5"/><rect x="7" y="54" width="0.8" height="1.5"/>
        <rect x="3" y="60" width="0.8" height="1.5"/><rect x="5" y="60" width="0.8" height="1.5"/><rect x="7" y="60" width="0.8" height="1.5"/>
        <rect x="12" y="30" width="0.8" height="1.5"/><rect x="14" y="30" width="0.8" height="1.5"/><rect x="16" y="30" width="0.8" height="1.5"/><rect x="18" y="30" width="0.8" height="1.5"/>
        <rect x="12" y="36" width="0.8" height="1.5"/><rect x="16" y="36" width="0.8" height="1.5"/>
        <rect x="12" y="42" width="0.8" height="1.5"/><rect x="14" y="42" width="0.8" height="1.5"/><rect x="18" y="42" width="0.8" height="1.5"/>
        <rect x="12" y="48" width="0.8" height="1.5"/><rect x="16" y="48" width="0.8" height="1.5"/>
        <rect x="12" y="54" width="0.8" height="1.5"/><rect x="14" y="54" width="0.8" height="1.5"/>
        <rect x="12" y="60" width="0.8" height="1.5"/><rect x="18" y="60" width="0.8" height="1.5"/>
        <rect x="22" y="26" width="0.8" height="1.5"/><rect x="24" y="26" width="0.8" height="1.5"/>
        <rect x="22" y="32" width="0.8" height="1.5"/><rect x="24" y="32" width="0.8" height="1.5"/>
        <rect x="22" y="38" width="0.8" height="1.5"/><rect x="24" y="38" width="0.8" height="1.5"/>
        <rect x="22" y="44" width="0.8" height="1.5"/><rect x="24" y="44" width="0.8" height="1.5"/>
        <rect x="22" y="50" width="0.8" height="1.5"/><rect x="24" y="50" width="0.8" height="1.5"/>
        <rect x="29" y="22" width="0.8" height="1.5"/><rect x="32" y="22" width="0.8" height="1.5"/><rect x="35" y="22" width="0.8" height="1.5"/>
        <rect x="29" y="28" width="0.8" height="1.5"/><rect x="35" y="28" width="0.8" height="1.5"/>
        <rect x="29" y="34" width="0.8" height="1.5"/><rect x="32" y="34" width="0.8" height="1.5"/>
        <rect x="29" y="40" width="0.8" height="1.5"/><rect x="32" y="40" width="0.8" height="1.5"/><rect x="35" y="40" width="0.8" height="1.5"/>
        <rect x="29" y="46" width="0.8" height="1.5"/><rect x="35" y="46" width="0.8" height="1.5"/>
        <rect x="29" y="52" width="0.8" height="1.5"/><rect x="32" y="52" width="0.8" height="1.5"/>
        <rect x="41" y="28" width="0.8" height="1.5"/><rect x="44" y="28" width="0.8" height="1.5"/>
        <rect x="41" y="34" width="0.8" height="1.5"/><rect x="41" y="40" width="0.8" height="1.5"/><rect x="44" y="40" width="0.8" height="1.5"/>
        <rect x="41" y="46" width="0.8" height="1.5"/>
        <rect x="49" y="32" width="0.8" height="1.5"/><rect x="51" y="32" width="0.8" height="1.5"/><rect x="54" y="32" width="0.8" height="1.5"/><rect x="56" y="32" width="0.8" height="1.5"/>
        <rect x="49" y="38" width="0.8" height="1.5"/><rect x="54" y="38" width="0.8" height="1.5"/>
        <rect x="49" y="44" width="0.8" height="1.5"/><rect x="51" y="44" width="0.8" height="1.5"/><rect x="56" y="44" width="0.8" height="1.5"/>
        <rect x="61" y="36" width="0.8" height="1.5"/><rect x="63" y="36" width="0.8" height="1.5"/>
        <rect x="61" y="42" width="0.8" height="1.5"/><rect x="63" y="42" width="0.8" height="1.5"/>
        <rect x="68" y="32" width="0.8" height="1.5"/><rect x="71" y="32" width="0.8" height="1.5"/><rect x="74" y="32" width="0.8" height="1.5"/>
        <rect x="68" y="38" width="0.8" height="1.5"/><rect x="71" y="38" width="0.8" height="1.5"/>
        <rect x="68" y="44" width="0.8" height="1.5"/><rect x="74" y="44" width="0.8" height="1.5"/>
      </g>
      <rect x="0" y="66" width="80" height="14" fill="#0A0F30"/>
      <g fill="#FFE89E" opacity="0.5">
        <rect x="2" y="68" width="0.8" height="0.4"/><rect x="6" y="68" width="0.8" height="0.4"/>
        <rect x="14" y="68" width="0.8" height="0.4"/><rect x="20" y="68" width="0.8" height="0.4"/>
        <rect x="28" y="68" width="0.8" height="0.4"/><rect x="36" y="68" width="0.8" height="0.4"/>
        <rect x="42" y="68" width="0.8" height="0.4"/><rect x="50" y="68" width="0.8" height="0.4"/>
        <rect x="58" y="68" width="0.8" height="0.4"/><rect x="68" y="68" width="0.8" height="0.4"/>
      </g>
    </svg>
  ),

  // ==== 音楽・ライブ ====
  music: (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="muSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1F4A"/>
          <stop offset="100%" stopColor="#5A2D7A"/>
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#muSky)"/>
      <circle cx="12" cy="10" r="0.6" fill="#FFF"/>
      <circle cx="68" cy="6" r="0.5" fill="#FFF"/>
      <circle cx="40" cy="4" r="0.4" fill="#FFF" opacity="0.7"/>
      <path d="M30 6 L40 50 L34 50 Z" fill="#FFE5A8" opacity="0.35"/>
      <path d="M50 6 L40 50 L46 50 Z" fill="#FFE5A8" opacity="0.35"/>
      <path d="M5 14 L40 50 L10 50 Z" fill="#FFE5A8" opacity="0.25"/>
      <path d="M75 14 L40 50 L70 50 Z" fill="#FFE5A8" opacity="0.25"/>
      <ellipse cx="40" cy="40" rx="36" ry="8" fill="#3A1F4A"/>
      <ellipse cx="40" cy="40" rx="32" ry="6" fill="#5A2D7A" opacity="0.6"/>
      <path d="M8 50 L72 50 Q74 50, 74 52 L74 62 L6 62 L6 52 Q6 50, 8 50 Z" fill={C.coral}/>
      <path d="M8 50 L72 50" stroke="#9D2D5E" strokeWidth="0.4"/>
      <rect x="6" y="62" width="68" height="2" fill="#9D2D5E"/>
      <rect x="38" y="44" width="2" height="6" fill="#3A1F4A"/>
      <circle cx="39" cy="46" r="2" fill="#3A1F4A"/>
      <rect x="34" y="46" width="2" height="4" fill="#3A1F4A"/>
      <rect x="42" y="46" width="2" height="4" fill="#3A1F4A"/>
      <ellipse cx="39" cy="44" rx="1.5" ry="0.8" fill="#FFE5B0"/>
      <ellipse cx="14" cy="32" rx="3" ry="2.5" fill="#FFF"/>
      <rect x="16.5" y="20" width="1.5" height="12" fill="#FFF"/>
      <path d="M18 20 L26 18 L26 22 Z" fill="#FFF"/>
      <ellipse cx="58" cy="24" rx="3" ry="2.5" fill="#FFF"/>
      <rect x="60.5" y="12" width="1.5" height="12" fill="#FFF"/>
      <path d="M62 12 L70 10 L70 14 Z" fill="#FFF"/>
      <ellipse cx="28" cy="38" rx="2.5" ry="2" fill="#FFF"/>
      <rect x="30" y="28" width="1.2" height="10" fill="#FFF"/>
      <ellipse cx="48" cy="36" rx="2.5" ry="2" fill="#FFF"/>
      <rect x="50" y="26" width="1.2" height="10" fill="#FFF"/>
      <rect x="29.5" y="28" width="22.5" height="0.8" fill="#FFF"/>
      <rect x="0" y="64" width="80" height="16" fill="#1A1F4A"/>
      <circle cx="6" cy="68" r="0.5" fill="#FFB5C7" opacity="0.7"/>
      <circle cx="18" cy="70" r="0.5" fill="#FFB5C7" opacity="0.7"/>
      <circle cx="32" cy="68" r="0.5" fill="#FFB5C7" opacity="0.7"/>
      <circle cx="48" cy="70" r="0.5" fill="#FFB5C7" opacity="0.7"/>
      <circle cx="62" cy="68" r="0.5" fill="#FFB5C7" opacity="0.7"/>
      <circle cx="74" cy="70" r="0.5" fill="#FFB5C7" opacity="0.7"/>
    </svg>
  ),
};
// ============ アクティビティDB（営業時間・バッジ・URL・SNS付き） ============
// url: 公式サイト or 検索URL
// insta: Instagramハンドル (なければnull)
const ACTIVITIES = {
  breakfast: [
    { name: 'Grand Central Market',  desc: '100年続く屋台フードホール。Eggslutのサンドが人気',  area: 'DTLA',         distance: '徒歩 5分',  mode: 'walk', icon: Coffee, cat: 'food',    rating: 4.6, price: '~$15', scene: 'food_breakfast', hours: '8:00-22:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://grandcentralmarket.com', insta: '@grandcentralmarket' },
    { name: 'Sqirl',                 desc: 'リコッタトーストとジャム瓶で有名なカフェ',         area: 'Silver Lake',  distance: '車 15分',   mode: 'car',  icon: Coffee, cat: 'food',    rating: 4.5, price: '~$20', scene: 'food_breakfast', hours: '8:00-15:00', dayBadge: { text: '行列予想', kind: 'hot' }, url: 'https://www.sqirlla.com', insta: '@sqirlla' },
    { name: 'Republique',            desc: '美しい歴史的建築の中のフレンチカフェ',             area: 'Mid-Wilshire', distance: '車 15分',   mode: 'car',  icon: Coffee, cat: 'food',    rating: 4.6, price: '~$20', scene: 'food_breakfast', hours: '8:00-23:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://republiquela.com', insta: '@republiquela' },
    { name: 'Bottega Louie',         desc: '大理石の店内とマカロンで映える朝食',               area: 'DTLA',         distance: '徒歩 8分',  mode: 'walk', icon: Coffee, cat: 'food',    rating: 4.4, price: '~$25', scene: 'food_breakfast', hours: '8:00-23:00', dayBadge: { text: '予約推奨', kind: 'hot' }, url: 'https://bottegalouie.com', insta: '@bottegalouie' },
    { name: 'Cofax Coffee',          desc: 'ドーナツとコーヒーで朝の小休止',                   area: 'Fairfax',      distance: '車 20分',   mode: 'car',  icon: Coffee, cat: 'food',    rating: 4.5, price: '~$10', scene: 'food_breakfast', hours: '7:00-15:00', dayBadge: null, url: 'https://www.cofaxcoffee.com', insta: '@cofaxcoffee' },
  ],
  lunch: [
    { name: "Howlin' Ray's",         desc: 'ナッシュビル・ホットチキンの行列店',               area: 'Chinatown',    distance: '車 5分',    mode: 'car',  icon: Pizza, cat: 'food',     rating: 4.7, scene: 'food_burger', hours: '11:00-21:00', dayBadge: { text: '行列予想', kind: 'hot' }, url: 'https://www.howlinrays.com', insta: '@howlinrays' },
    { name: 'Philippe the Original', desc: '1908年創業、フレンチディップ発祥の店',             area: 'Chinatown',    distance: '車 5分',    mode: 'car',  icon: Pizza, cat: 'food',     rating: 4.5, price: '~$15', scene: 'food_burger', hours: '6:00-22:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.philippes.com', insta: '@philippestheoriginal' },
    { name: 'Sushi Gen',             desc: 'リトル東京のお値打ち寿司ランチ',                   area: 'Little Tokyo', distance: '徒歩 15分', mode: 'walk', icon: Pizza, cat: 'food',     rating: 4.5, price: '$20~30', scene: 'food_sushi', hours: '11:15-14:00 / 17:30-21:30', dayBadge: { text: 'ランチ営業中', kind: 'open' }, url: 'https://www.google.com/search?q=Sushi+Gen+Little+Tokyo', insta: null },
    { name: 'Mendocino Farms',       desc: 'カリフォルニア式サンドイッチでヘルシーに',         area: 'DTLA',         distance: '徒歩 10分', mode: 'walk', icon: Pizza, cat: 'food',     rating: 4.6, price: '~$18', scene: 'food_burger', hours: '11:00-21:00', dayBadge: null, url: 'https://www.mendocinofarms.com', insta: '@mendocinofarms' },
    { name: 'In-N-Out Burger',       desc: 'カリフォルニア定番。Double-Doubleを',              area: '各地',          distance: '車 15分',   mode: 'car',  icon: Pizza, cat: 'food',     rating: 4.5, price: '~$10', scene: 'food_burger', hours: '10:30-1:00', dayBadge: null, url: 'https://www.in-n-out.com', insta: '@innout' },
    { name: 'Guisados',              desc: '本場メキシカン・タコスの名店',                     area: 'Boyle Heights',distance: '車 10分',   mode: 'car',  icon: Pizza, cat: 'food',     rating: 4.6, price: '~$15', scene: 'food_taco', hours: '11:00-22:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.guisados.co', insta: '@guisadostacos' },
  ],
  dinner: [
    { name: 'Bestia',                desc: 'アーツ・ディストリクトの予約困難イタリアン',       area: 'Arts District',distance: '車 10分',   mode: 'car',  icon: Wine, cat: 'food',      rating: 4.7, price: '$60~100', scene: 'food_dinner', hours: '17:00-23:00', dayBadge: { text: '予約必須', kind: 'hot' }, url: 'https://bestiala.com', insta: '@bestiala' },
    { name: 'Bavel',                 desc: '中東料理。ラム肩肉のスローローストが看板',         area: 'Arts District',distance: '車 10分',   mode: 'car',  icon: Wine, cat: 'food',      rating: 4.7, price: '$60~100', scene: 'food_dinner', hours: '17:30-22:30', dayBadge: { text: '予約推奨', kind: 'hot' }, url: 'https://baveldtla.com', insta: '@bavel_la' },
    { name: "Park's BBQ",            desc: '韓国焼肉のトップクラス。マリネ肉が絶品',           area: 'Koreatown',    distance: '車 15分',   mode: 'car',  icon: Wine, cat: 'food',      rating: 4.6, scene: 'food_dinner', hours: '11:00-23:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.parksbbq.com', insta: '@parks_bbq' },
    { name: 'Republique（夜）',       desc: '昼カフェ・夜ビストロの二面性',                     area: 'Mid-Wilshire', distance: '車 15分',   mode: 'car',  icon: Wine, cat: 'food',      rating: 4.5, price: '$40~70', scene: 'food_dinner', hours: '17:30-22:30', dayBadge: null, url: 'https://republiquela.com', insta: '@republiquela' },
    { name: 'Daikokuya Ramen',       desc: 'リトル東京の老舗ラーメン。トンコツ系',             area: 'Little Tokyo', distance: '徒歩 15分', mode: 'walk', icon: Wine, cat: 'food',      rating: 4.4, price: '~$20', scene: 'food_sushi', hours: '11:00-24:00', dayBadge: { text: '深夜営業', kind: 'open' }, url: 'https://www.daikoku-ten.com', insta: '@daikokuyaramen' },
    { name: 'Night + Market Song',   desc: 'タイ屋台料理。クラフトビールと一緒に',             area: 'Silver Lake',  distance: '車 15分',   mode: 'car',  icon: Wine, cat: 'food',      rating: 4.5, price: '$30~50', scene: 'food_taco', hours: '17:00-23:00', dayBadge: null, url: 'https://www.nightmarketsong.com', insta: '@nightmarketsong' },
  ],
  morning: {
    art: [
      { name: 'The Broad',            desc: '無料の現代美術館。クサマのInfinity Roomで予約必須',area: 'DTLA',         distance: '徒歩 10分', mode: 'walk', icon: Palette, cat: 'art',     rating: 4.7, price: '無料（特別展は有料）', scene: 'art', hours: '11:00-17:00', dayBadge: { text: '特別展中', kind: 'event' }, url: 'https://www.thebroad.org', insta: '@thebroadmuseum' },
      { name: 'MOCA Grand Avenue',    desc: '現代美術の常設展と特別展。建築も見もの',          area: 'DTLA',         distance: '徒歩 10分', mode: 'walk', icon: Palette, cat: 'art',     rating: 4.4, price: '$18前後', scene: 'art', hours: '11:00-18:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.moca.org', insta: '@moca' },
      { name: 'Hauser & Wirth',       desc: 'アーツ・ディストリクトの巨大ギャラリー。入場無料',area: 'Arts District',distance: '車 10分',   mode: 'car',  icon: Palette, cat: 'art',     rating: 4.6, price: '無料', scene: 'art', hours: '11:00-18:00', dayBadge: null, url: 'https://www.hauserwirth.com/locations/los-angeles', insta: '@hauserwirth' },
    ],
    nature: [
      { name: 'Runyon Canyon ハイキング',desc: 'ハリウッドの定番。市街地を見下ろす絶景の朝活',  area: 'Hollywood',    distance: '車 25分',   mode: 'car',  icon: Mountain, cat: 'nature', rating: 4.5, price: '無料', scene: 'mountain', hours: '日の出-日没', dayBadge: null, url: 'https://www.laparks.org/runyon', insta: null },
      { name: 'Echo Park Lake',       desc: 'スワンボートと蓮の花。DTLAの背景が映える',        area: 'Echo Park',    distance: '車 10分',   mode: 'car',  icon: Mountain, cat: 'nature', rating: 4.5, price: '無料（ボート$13~）', scene: 'mountain', hours: '終日', dayBadge: null, url: 'https://www.laparks.org/aquatic/lake/echo-park-lake', insta: null },
      { name: 'Griffith Park 散策',   desc: '広大な都市公園でハイキング。涼しい朝のうちに',    area: 'Los Feliz',    distance: '車 25分',   mode: 'car',  icon: Mountain, cat: 'nature', rating: 4.6, price: '無料', scene: 'mountain', hours: '5:00-22:30', dayBadge: null, url: 'https://www.laparks.org/griffithpark', insta: null },
    ],
    beach: [
      { name: 'Santa Monica Pier',    desc: '観覧車のあるピアと真っ白なビーチ',                area: 'Santa Monica', distance: '車 30分',   mode: 'car',  icon: Waves, cat: 'beach',    rating: 4.6, price: '無料（乗物別）', scene: 'pier', hours: '6:00-25:00', dayBadge: { text: '今夜花火 21:00', kind: 'event' }, url: 'https://www.santamonicapier.org', insta: '@santamonicapier' },
      { name: 'Venice Beach 朝活',    desc: 'ボードウォーク散歩とマッスルビーチ見物',          area: 'Venice',       distance: '車 35分',   mode: 'car',  icon: Waves, cat: 'beach',    rating: 4.4, price: '無料', scene: 'beach', hours: '終日', dayBadge: null, url: 'https://www.venicebeach.com', insta: '@visitvenice' },
      { name: 'Manhattan Beach',      desc: '高級住宅街の静かなビーチでのんびり',              area: 'South Bay',    distance: '車 30分',   mode: 'car',  icon: Waves, cat: 'beach',    rating: 4.7, price: '無料', scene: 'beach', hours: '終日', dayBadge: null, url: 'https://www.citymb.info', insta: null },
    ],
    history: [
      { name: 'Bradbury Building',    desc: '1893年築の鉄細工の名建築。Palaの目の前',          area: 'DTLA',         distance: '徒歩 1分',  mode: 'walk', icon: Building2, cat: 'history',rating: 4.6, price: '無料（ロビーのみ）', scene: 'historic', hours: '9:00-17:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.laconservancy.org/learn/historic-places/bradbury-building', insta: null },
      { name: 'Olvera Street',        desc: 'LA発祥の地。メキシカン・マーケットと教会',        area: 'DTLA',         distance: '車 5分',    mode: 'car',  icon: Building2, cat: 'history',rating: 4.4, price: '無料', scene: 'little_tokyo', hours: '10:00-19:00', dayBadge: null, url: 'https://www.olvera-street.com', insta: '@olverastreet' },
      { name: 'Walt Disney Concert Hall',desc: 'フランク・ゲーリー設計。外観だけでも価値あり', area: 'DTLA',         distance: '徒歩 15分', mode: 'walk', icon: Building2, cat: 'history',rating: 4.7, price: '無料（外観/ツアー別）', scene: 'skyline', hours: '10:00-21:00', dayBadge: { text: '今夜公演 20:00', kind: 'event' }, url: 'https://www.laphil.com/visit/wdch', insta: '@laphil' },
      { name: 'Union Station',        desc: '1939年築のスパニッシュ・コロニアル様式の駅舎',    area: 'DTLA',         distance: '車 5分',    mode: 'car',  icon: Building2, cat: 'history',rating: 4.5, price: '無料', scene: 'historic', hours: '24時間', dayBadge: null, url: 'https://unionstationla.com', insta: '@unionstationla' },
    ],
    movie: [
      { name: 'Walk of Fame 散策',    desc: 'スターの星をたどってハリウッドを歩く',            area: 'Hollywood',    distance: '車 20分',   mode: 'car',  icon: Clapperboard, cat: 'movie',rating: 4.3, price: '無料', scene: 'hollywood', hours: '終日', dayBadge: null, url: 'https://walkoffame.com', insta: '@hollywoodwalkoffame' },
      { name: 'Warner Bros. Studio Tour',desc: '映画スタジオの裏側を見学。要予約',             area: 'Burbank',      distance: '車 30分',   mode: 'car',  icon: Clapperboard, cat: 'movie',rating: 4.7, price: '$70前後', scene: 'hollywood', hours: '9:00-16:00', dayBadge: { text: '予約必須', kind: 'hot' }, url: 'https://www.wbstudiotour.com', insta: '@wbtourhollywood' },
    ],
    photo: [
      { name: 'Angels Flight',        desc: '世界最短のケーブルカー。レトロな赤い車体が映える', area: 'DTLA',         distance: '徒歩 8分',  mode: 'walk', icon: Camera, cat: 'photo',   rating: 4.4, price: '$1（片道）', scene: 'historic', hours: '6:45-22:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.angelsflight.org', insta: '@angelsflightrailway' },
      { name: 'The Last Bookstore',   desc: '本のトンネル「Book Tunnel」とラビリンス書棚',     area: 'DTLA',         distance: '徒歩 5分',  mode: 'walk', icon: Camera, cat: 'photo',   rating: 4.7, price: '無料', scene: 'historic', hours: '11:00-20:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://lastbookstorela.com', insta: '@lastbookstorela' },
      { name: 'Venice Wall Murals',   desc: 'ヴェニスの壁画ストリート。ストリートアートの宝庫', area: 'Venice',       distance: '車 35分',   mode: 'car',  icon: Camera, cat: 'photo',   rating: 4.6, price: '無料', scene: 'art', hours: '終日', dayBadge: null, url: 'https://www.google.com/search?q=Venice+Beach+murals+art+walk', insta: null },
    ],
    sports: [
      { name: 'Dodger Stadium ツアー', desc: 'MLB球場の裏側を見学。ベンチ・記者室・記念室',    area: 'Elysian Park', distance: '車 10分',   mode: 'car',  icon: Trophy, cat: 'sports',  rating: 4.7, price: '$30前後', scene: 'skyline', hours: '10:00-15:00（試合日除く）', dayBadge: { text: '試合日制限', kind: 'closed' }, url: 'https://www.mlb.com/dodgers/ballpark/tours', insta: '@dodgers' },
      { name: 'Manhattan Beach サーフィン体験', desc: '初心者向けサーフレッスン。ボード・ウェット付き', area: 'South Bay',   distance: '車 30分', mode: 'car', icon: Trophy, cat: 'sports', rating: 4.8, price: '$80~120', scene: 'beach', hours: '8:00-11:00', dayBadge: { text: '波あり', kind: 'open' }, url: 'https://www.google.com/search?q=Manhattan+Beach+surf+lesson', insta: null },
    ],
    experience: [
      { name: 'Wi Spa Korean Sauna',  desc: '24時間営業の韓国スパ。岩盤浴と汗蒸幕',             area: 'Koreatown',    distance: '車 15分',   mode: 'car',  icon: Compass, cat: 'experience',rating: 4.3, price: '$45前後', scene: 'historic', hours: '24時間', dayBadge: { text: '24h営業', kind: 'open' }, url: 'https://www.wispausa.com', insta: '@wi_spa_la' },
      { name: 'Helicopter LA Tour',   desc: 'ハリウッドサインとDTLAを上空から。45分プラン',    area: '空港発',        distance: '車 25分',   mode: 'car',  icon: Compass, cat: 'experience',rating: 4.9, price: '$200~', scene: 'hollywood', hours: '要予約', dayBadge: { text: '予約必須', kind: 'hot' }, url: 'https://www.google.com/search?q=Los+Angeles+helicopter+tour', insta: null },
    ],
  },
  afternoon: {
    art: [
      { name: 'LACMA',                desc: 'Urban Lightの前で写真。コレクションも巨大',       area: 'Mid-Wilshire', distance: '車 20分',   mode: 'car',  icon: Palette, cat: 'art',     rating: 4.5, price: '$28前後', scene: 'art', hours: '11:00-18:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.lacma.org', insta: '@lacma' },
      { name: 'Getty Center',         desc: '丘の上の白亜の美術館。建築・庭園・コレクション全部',area: 'Brentwood',   distance: '車 40分',   mode: 'car',  icon: Palette, cat: 'art',     rating: 4.8, price: '無料（駐車場$25）', scene: 'historic', hours: '10:00-17:30', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.getty.edu', insta: '@gettymuseum' },
      { name: 'Academy Museum',       desc: '映画芸術科学アカデミー博物館。映画好き必訪',      area: 'Mid-Wilshire', distance: '車 20分',   mode: 'car',  icon: Palette, cat: 'art',     rating: 4.6, price: '$25前後', scene: 'hollywood', hours: '10:00-18:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.academymuseum.org', insta: '@academymuseum' },
    ],
    nature: [
      { name: 'Huntington Library',   desc: '日本庭園・中国庭園が美しい広大なエステート',      area: 'San Marino',   distance: '車 30分',   mode: 'car',  icon: Mountain, cat: 'nature',  rating: 4.8, price: '$29前後', scene: 'mountain', hours: '10:00-17:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://www.huntington.org', insta: '@thehuntingtonlibrary' },
      { name: 'Griffith Observatory', desc: '昼の見学＆夕方からの夜景も狙える絶景スポット',    area: 'Griffith Park',distance: '車 25分',   mode: 'car',  icon: Mountain, cat: 'nature',  rating: 4.7, price: '無料（駐車場有料）', scene: 'observatory', hours: '12:00-22:00', dayBadge: { text: '今夜 天体観望会', kind: 'event' }, url: 'https://griffithobservatory.org', insta: '@griffithobservatory' },
    ],
    beach: [
      { name: 'El Matador State Beach',desc: 'マリブの隠れ家ビーチ。岩のアーチが絵になる',      area: 'Malibu',       distance: '車 50分',   mode: 'car',  icon: Waves, cat: 'beach',    rating: 4.7, price: '駐車場$8前後', scene: 'beach', hours: '日の出-日没', dayBadge: null, url: 'https://www.parks.ca.gov/?page_id=619', insta: null },
      { name: 'Venice Canals 散歩',   desc: 'ヴェネツィア風運河と橋の住宅街をのんびり',        area: 'Venice',       distance: '車 35分',   mode: 'car',  icon: Waves, cat: 'beach',    rating: 4.6, price: '無料', scene: 'pier', hours: '終日', dayBadge: null, url: 'https://www.google.com/search?q=Venice+Canals+Los+Angeles', insta: null },
    ],
    shopping: [
      { name: 'The Grove',            desc: 'オープンエア・モール。隣接のFarmers Marketも◎',   area: 'Fairfax',      distance: '車 20分',   mode: 'car',  icon: ShoppingBag, cat: 'shopping',rating: 4.6, price: '無料（散策）', scene: 'shopping', hours: '10:00-21:00', dayBadge: { text: '今日 路上ライブ', kind: 'event' }, url: 'https://thegrovela.com', insta: '@thegrovela' },
      { name: 'Rodeo Drive',          desc: 'ビバリーヒルズの高級ブランド街',                  area: 'Beverly Hills',distance: '車 25分',   mode: 'car',  icon: ShoppingBag, cat: 'shopping',rating: 4.4, price: '無料（散策）', scene: 'shopping', hours: '10:00-19:00', dayBadge: null, url: 'https://www.rodeodrive-bh.com', insta: '@rodeodrivebh' },
      { name: 'Melrose Avenue',       desc: 'ヴィンテージ・ストリート系・壁画スポット',        area: 'WeHo',         distance: '車 20分',   mode: 'car',  icon: ShoppingBag, cat: 'shopping',rating: 4.5, price: '無料（散策）', scene: 'shopping', hours: '11:00-20:00', dayBadge: null, url: 'https://www.google.com/search?q=Melrose+Avenue+shopping', insta: null },
      { name: 'Abbot Kinney Blvd',    desc: 'ヴェニスの個性派ショップとカフェが並ぶ通り',      area: 'Venice',       distance: '車 35分',   mode: 'car',  icon: ShoppingBag, cat: 'shopping',rating: 4.6, price: '無料（散策）', scene: 'shopping', hours: '10:00-21:00', dayBadge: null, url: 'https://abbotkinneyblvd.com', insta: '@abbotkinney' },
    ],
    themepark: [
      { name: 'Universal Studios Hollywood',desc: 'ハリポタ、マリオ、スタジオツアーを1日で',   area: 'Universal City',distance:'車 25分',  mode: 'car',  icon: Ticket, cat: 'themepark',rating: 4.7, price: '$109~', scene: 'themepark', hours: '9:00-22:00', dayBadge: { text: '夜の延長OPEN', kind: 'event' }, url: 'https://www.universalstudioshollywood.com', insta: '@unistudios' },
      { name: 'Disneyland Park',      desc: '元祖ディズニーランドへ日帰り遠征',                area: 'Anaheim',      distance: '車 45分',   mode: 'car',  icon: Ticket, cat: 'themepark',rating: 4.8, price: '$104~', scene: 'themepark', hours: '8:00-24:00', dayBadge: { text: '花火 21:30', kind: 'event' }, url: 'https://disneyland.disney.go.com', insta: '@disneyland' },
      { name: 'Six Flags Magic Mountain',desc: '絶叫マシンの天国。コースター好きはマスト',     area: 'Valencia',     distance: '車 1時間',  mode: 'car',  icon: Ticket, cat: 'themepark',rating: 4.5, price: '$70~', scene: 'themepark', hours: '10:30-22:00', dayBadge: null, url: 'https://www.sixflags.com/magicmountain', insta: '@sixflagsmagicmountain' },
    ],
    movie: [
      { name: 'TCL Chinese Theatre',  desc: 'スターの手形足型と歴史的劇場',                    area: 'Hollywood',    distance: '車 20分',   mode: 'car',  icon: Clapperboard, cat: 'movie',rating: 4.5, price: '無料（鑑賞別）', scene: 'hollywood', hours: '10:00-23:00', dayBadge: { text: 'プレミア試写あり', kind: 'event' }, url: 'https://www.tclchinesetheatres.com', insta: '@tclchinesetheatre' },
      { name: 'Griffith Observatory（La La Land）', desc: '「La La Land」のロケ地。LA市街を見下ろす', area: 'Griffith Park',distance: '車 25分', mode: 'car',  icon: Clapperboard, cat: 'movie',rating: 4.7, price: '無料', scene: 'observatory', hours: '12:00-22:00', dayBadge: null, url: 'https://griffithobservatory.org', insta: '@griffithobservatory' },
    ],
    history: [
      { name: 'The Last Bookstore',   desc: 'DTLAの名物書店。本のトンネルが写真スポット',      area: 'DTLA',         distance: '徒歩 5分',  mode: 'walk', icon: BookOpen, cat: 'history',rating: 4.7, price: '無料', scene: 'historic', hours: '11:00-20:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://lastbookstorela.com', insta: '@lastbookstorela' },
      { name: 'Little Tokyo 散策',    desc: 'リトル東京の小路と日系雑貨店をめぐる',            area: 'Little Tokyo', distance: '徒歩 15分', mode: 'walk', icon: Building2, cat: 'history',rating: 4.6, price: '無料', scene: 'little_tokyo', hours: '終日', dayBadge: null, url: 'https://www.visitlittletokyo.com', insta: '@littletokyola' },
      { name: 'Arts District 散策',   desc: '倉庫街リノベの壁画とカフェ・ギャラリー',          area: 'Arts District',distance: '車 5分',    mode: 'car',  icon: Building2, cat: 'history',rating: 4.5, price: '無料', scene: 'historic', hours: '終日', dayBadge: null, url: 'https://artsdistrictla.org', insta: '@artsdistrictla' },
    ],
    photo: [
      { name: 'Urban Light @ LACMA',  desc: '202本の街灯のインスタレーション。夕方が一番映える',area: 'Mid-Wilshire', distance: '車 20分',   mode: 'car',  icon: Camera, cat: 'photo',   rating: 4.7, price: '無料', scene: 'art', hours: '終日（点灯は日没後）', dayBadge: { text: '日没後点灯', kind: 'event' }, url: 'https://www.lacma.org/art/installation/urban-light', insta: '@lacma' },
      { name: 'Pink Wall（Paul Smith）',desc: 'ピンク色の壁。インスタの定番フォトスポット',     area: 'Melrose',      distance: '車 20分',   mode: 'car',  icon: Camera, cat: 'photo',   rating: 4.2, price: '無料', scene: 'shopping', hours: '終日（店舗 11:00-18:00）', dayBadge: null, url: 'https://www.google.com/search?q=Paul+Smith+Pink+Wall+Melrose', insta: '@paulsmithdesign' },
      { name: 'Salt & Straw Venice', desc: 'ピンク壁とアイスクリーム。並んでも撮りたい',      area: 'Venice',       distance: '車 35分',   mode: 'car',  icon: Camera, cat: 'photo',   rating: 4.6, price: '~$8', scene: 'shopping', hours: '11:00-23:00', dayBadge: { text: '営業中', kind: 'open' }, url: 'https://saltandstraw.com', insta: '@saltandstraw' },
      { name: 'Vista Theater',        desc: 'クエンティン・タランティーノ所有の映画館の外観',   area: 'Los Feliz',    distance: '車 20分',   mode: 'car',  icon: Camera, cat: 'photo',   rating: 4.6, price: '鑑賞料による', scene: 'hollywood', hours: '上映時のみ', dayBadge: null, url: 'https://www.google.com/search?q=Vista+Theater+Los+Feliz', insta: null },
    ],
    sports: [
      { name: 'Crypto.com Arena 見学', desc: 'Lakers/Clippers/Kingsの本拠地。Star Plazaも',     area: 'DTLA',         distance: '車 5分',    mode: 'car',  icon: Trophy, cat: 'sports',  rating: 4.5, price: '公演による', scene: 'skyline', hours: 'イベントによる', dayBadge: { text: '今夜 試合あり', kind: 'event' }, url: 'https://www.cryptoarena.com', insta: '@cryptocomarena' },
      { name: 'Rose Bowl Stadium',    desc: 'パサデナの伝統的スタジアム。UCLAサッカーの聖地',  area: 'Pasadena',     distance: '車 30分',   mode: 'car',  icon: Trophy, cat: 'sports',  rating: 4.7, price: 'イベントによる', scene: 'historic', hours: 'イベントによる', dayBadge: null, url: 'https://rosebowlstadium.com', insta: '@rosebowlstadium' },
      { name: 'SoFi Stadium ツアー',  desc: 'Rams/Chargersの最新スタジアム。建築自体が見もの', area: 'Inglewood',    distance: '車 25分',   mode: 'car',  icon: Trophy, cat: 'sports',  rating: 4.6, price: '$45前後', scene: 'themepark', hours: '10:00-15:00', dayBadge: null, url: 'https://www.sofistadium.com', insta: '@sofistadium' },
    ],
    experience: [
      { name: 'クッキングクラス（メキシカン）', desc: '本場の料理人と作るタコス・サルサ・モレ', area: 'Boyle Heights',distance: '車 10分',   mode: 'car',  icon: Compass, cat: 'experience',rating: 4.8, price: '$70前後', scene: 'food_taco', hours: '14:00-17:00', dayBadge: { text: '予約必須', kind: 'hot' }, url: 'https://www.google.com/search?q=Los+Angeles+mexican+cooking+class', insta: null },
      { name: 'E-Bike Tour（DTLA）',  desc: '電動アシスト自転車で2時間DTLAをガイドツアー',    area: 'DTLA',         distance: '徒歩 5分',  mode: 'walk', icon: Compass, cat: 'experience',rating: 4.7, price: '$60前後', scene: 'skyline', hours: '10:00 / 14:00', dayBadge: null, url: 'https://www.google.com/search?q=Los+Angeles+ebike+tour', insta: null },
      { name: 'Pottery Workshop',     desc: '陶芸ワークショップ。1日でカップやボウルを作る',    area: 'Echo Park',    distance: '車 10分',   mode: 'car',  icon: Compass, cat: 'experience',rating: 4.8, price: '$50前後', scene: 'art', hours: '13:00-16:00', dayBadge: null, url: 'https://www.google.com/search?q=Los+Angeles+pottery+workshop', insta: null },
      { name: 'Old Town Music Hall', desc: '1920年代の映画を生伴奏で。週末限定の貴重な体験',  area: 'El Segundo',   distance: '車 35分',   mode: 'car',  icon: Compass, cat: 'experience',rating: 4.9, price: '$10前後', scene: 'hollywood', hours: '週末 14:30 / 20:00', dayBadge: { text: '週末限定', kind: 'event' }, url: 'https://oldtownmusichall.org', insta: null },
    ],
  },
  evening: [
    { name: 'Griffith Observatory 夜景',desc: 'LAの夜景は天文台から。日没後がベスト',           area: 'Griffith Park',distance: '車 25分',   mode: 'car',  icon: Moon, cat: 'movie',    rating: 4.8, price: '無料', scene: 'night_city', hours: '12:00-22:00', dayBadge: { text: '天体観望会', kind: 'event' }, url: 'https://griffithobservatory.org', insta: '@griffithobservatory' },
    { name: 'OUE Skyspace（DTLA夜景）',desc: '高層ビル屋上の展望台とガラススライダー',          area: 'DTLA',         distance: '徒歩 10分', mode: 'walk', icon: Moon, cat: 'movie',    rating: 4.4, price: '$25前後', scene: 'night_city', hours: '10:00-22:00', dayBadge: null, url: 'https://oue-skyspace.com', insta: '@oueskyspacela' },
    { name: 'Hollywood Bowl コンサート',desc: '夏季開催の野外コンサート。ピクニックスタイル',   area: 'Hollywood',    distance: '車 25分',   mode: 'car',  icon: Music, cat: 'movie',   rating: 4.7, price: '公演による', scene: 'music', hours: '19:30開演', dayBadge: { text: '今夜 Yo-Yo Ma', kind: 'event' }, url: 'https://www.hollywoodbowl.com', insta: '@hollywoodbowl' },
    { name: 'Walt Disney Concert Hall', desc: '夜の外観ライトアップとコンサート',                area: 'DTLA',         distance: '徒歩 15分', mode: 'walk', icon: Music, cat: 'history', rating: 4.7, price: '無料（外観/ツアー別）', scene: 'music', hours: '20:00開演', dayBadge: { text: 'LAフィル公演', kind: 'event' }, url: 'https://www.laphil.com/visit/wdch', insta: '@laphil' },
    { name: 'Sunset Strip でドリンク',  desc: 'WeHoのバーや音楽ハコ巡り',                       area: 'WeHo',         distance: '車 25分',   mode: 'car',  icon: Wine, cat: 'food',     rating: 4.4, price: 'ドリンク$15~', scene: 'night_city', hours: '18:00-2:00', dayBadge: null, url: 'https://www.google.com/search?q=Sunset+Strip+bars', insta: null },
    { name: 'Santa Monica Pier の夕陽', desc: '観覧車と夕陽の太平洋',                           area: 'Santa Monica', distance: '車 30分',   mode: 'car',  icon: Sunset, cat: 'beach',  rating: 4.7, price: '無料', scene: 'pier', hours: '6:00-25:00', dayBadge: { text: '夜花火 21:00', kind: 'event' }, url: 'https://www.santamonicapier.org', insta: '@santamonicapier' },
    { name: 'Dodgers Game 観戦',         desc: 'MLBドジャース戦。LA市民の聖地で熱狂',           area: 'Elysian Park', distance: '車 10分',   mode: 'car',  icon: Trophy, cat: 'sports', rating: 4.8, price: '$30~150', scene: 'skyline', hours: '19:10開始', dayBadge: { text: '今夜 vs Giants', kind: 'event' }, url: 'https://www.mlb.com/dodgers', insta: '@dodgers' },
    { name: 'Speakeasy バー巡り',        desc: '隠れ家バーで本物のクラフトカクテルを体験',       area: 'DTLA',         distance: '徒歩 10分', mode: 'walk', icon: Compass, cat: 'experience',rating: 4.7, price: 'ドリンク$15~', scene: 'night_city', hours: '19:00-2:00', dayBadge: null, url: 'https://www.google.com/search?q=Los+Angeles+speakeasy+bar', insta: null },
  ],
};

// ============ 今日のイベント ============
const TODAYS_EVENTS = [
  { time: '19:30', title: 'Yo-Yo Ma クラシック演奏会', venue: 'Hollywood Bowl',         scene: 'music',       cat: 'movie',     ticketsLeft: 'あと わずか',     price: '$40~150',     url: 'https://www.hollywoodbowl.com',                  insta: '@hollywoodbowl' },
  { time: '21:00', title: 'サマー花火大会',           venue: 'Santa Monica Pier',      scene: 'pier',        cat: 'beach',     ticketsLeft: '無料',           price: '無料',         url: 'https://www.santamonicapier.org',                insta: '@santamonicapier' },
  { time: '19:10', title: 'Dodgers vs Giants',        venue: 'Dodger Stadium',         scene: 'skyline',     cat: 'sports',    ticketsLeft: '一塁側 残席あり', price: '$30~150',     url: 'https://www.mlb.com/dodgers',                    insta: '@dodgers' },
  { time: '20:00', title: 'LAフィル「夏の夜」',        venue: 'Walt Disney Concert Hall', scene: 'music',     cat: 'history',   ticketsLeft: '残席わずか',     price: '$50~120',     url: 'https://www.laphil.com',                         insta: '@laphil' },
  { time: '終日',  title: '特別展: Kusama "New Works"', venue: 'The Broad',              scene: 'art',         cat: 'art',       ticketsLeft: '当日整理券',     price: '$20前後',      url: 'https://www.thebroad.org',                       insta: '@thebroadmuseum' },
  { time: '21:30', title: 'ディズニーランド花火',       venue: 'Disneyland Park',        scene: 'themepark',   cat: 'themepark', ticketsLeft: '入園券要',       price: '$104~',       url: 'https://disneyland.disney.go.com',               insta: '@disneyland' },
  { time: '17:00', title: 'ファーマーズマーケット',     venue: 'The Grove',              scene: 'shopping',    cat: 'shopping',  ticketsLeft: '入場無料',       price: '無料',         url: 'https://thegrovela.com',                         insta: '@thegrovela' },
  { time: '20:30', title: '夜間天体観望会',             venue: 'Griffith Observatory',   scene: 'observatory', cat: 'nature',    ticketsLeft: '無料',           price: '無料',         url: 'https://griffithobservatory.org',                insta: '@griffithobservatory' },
];

// ============ LA INFO（基本データ・移動・季節など） ============
const LA_INFO = {
  basics: [
    { label: '時差',       value: '日本 −16h',    sub: 'PST／夏時間 −15h（PDT）' },
    { label: '通貨',       value: 'USドル',       sub: '主要店舗はカードのみ可' },
    { label: '言語',       value: '英語＋スペイン語', sub: '日系エリアで一部日本語' },
    { label: 'チップ',     value: '15〜20%',      sub: 'レストラン・タクシー・スパ' },
  ],
  weather: [
    { season: '春 3-5月',  temp: '15-22℃',  note: '快適。雨少なめ。ベストシーズンの一つ' },
    { season: '夏 6-8月',  temp: '20-29℃',  note: '湿度低めで過ごしやすい。海風で夜は涼しい' },
    { season: '秋 9-11月', temp: '18-26℃',  note: '残暑あり。観光のピークは過ぎる' },
    { season: '冬 12-2月', temp: '10-20℃',  note: '雨季。短い雨が多いが日中は晴れる' },
  ],
  transport: [
    { name: 'レンタカー', desc: '広いLAの基本。高速道路網（フリーウェイ）の活用が前提',     pros: '自由度が高い', cons: '駐車場代と渋滞' },
    { name: 'Uber/Lyft',  desc: '配車アプリ。空港・夜間移動・遠距離は割高だが便利',         pros: '手軽で安心',   cons: '混雑時に高騰' },
    { name: 'メトロ',     desc: 'DTLA・ハリウッド・サンタモニカは地下鉄/ライトレールで可', pros: '安い（$1.75）', cons: '夜は治安に注意' },
    { name: '徒歩・自転車', desc: 'DTLA・サンタモニカ・ヴェニス内は徒歩可。E-bike貸出多数', pros: '街の発見が多い', cons: '坂道と暑さに注意' },
  ],
  tips: [
    { title: '空港から市内',     body: 'LAX空港からDTLAまでタクシーで30〜50分（$50前後）。FlyAwayバスは$10で30分。' },
    { title: '治安',           body: '一部のダウンタウン東側・スキッドロウ・ハリウッド裏通りは夜間避ける。観光地は概ね安全。' },
    { title: '日焼け対策',       body: '紫外線が強い。日焼け止め・サングラス・帽子を年中携帯すると安心。' },
    { title: 'チップ計算',       body: '請求書に「Gratuity included」とあれば不要。Apple Pay/カード端末でも選択できる。' },
  ],
  japaneseGuides: [
    {
      name: 'Discover Los Angeles 日本語版',
      desc: 'LA観光局公式の日本語サイト。エリア別記事・最新イベント情報',
      url:  'https://www.discoverlosangeles.com/jp/%E6%97%A5%E6%9C%AC%E8%AA%9E',
    },
    {
      name: 'LocoPlace ロサンゼルス',
      desc: 'LA在住日本人による情報メディア。グルメ・観光・生活情報',
      url:  'https://locoplace.jp/visit',
    },
    {
      name: 'BUYMA TRAVEL ロサンゼルス',
      desc: '日本人ガイドツアーとエリア別観光ガイド記事',
      url:  'https://travel.buyma.com/contents/magazine/america-losangeles-tourguide/',
    },
    {
      name: '地球の歩き方 ロサンゼルス',
      desc: '定番旅行ガイドブックの記事を検索',
      url:  'https://www.google.com/search?q=' + encodeURIComponent('地球の歩き方 ロサンゼルス') + '&hl=ja',
    },
    {
      name: '4travel 旅行記',
      desc: '実際に行った人の体験記・旅行記コミュニティ',
      url:  'https://www.google.com/search?q=' + encodeURIComponent('4travel ロサンゼルス 旅行記') + '&hl=ja',
    },
    {
      name: 'トリップアドバイザー（日本版）',
      desc: '世界最大級のクチコミと観光ランキング',
      url:  'https://www.tripadvisor.jp/Tourism-g32655-Los_Angeles_California-Vacations.html',
    },
    {
      name: 'ロコタビ',
      desc: 'LA在住の日本人ガイドに直接相談・予約代行',
      url:  'https://locotabi.jp/losangeles',
    },
  ],
};

// ============ AREAS（深い情報つき） ============

// ============ AREAS（深い情報つき） ============
// articles の type: 'sns' | 'video' | 'blog' | 'article' | 'review' | 'wiki'
// 各エリアに必ず: SNS / YouTube動画 / 記事 / クチコミ が含まれる
const AREAS = [
  {
    jp: 'ダウンタウン',
    en: 'Downtown',
    scene: 'skyline',
    imageQuery: 'downtown+los+angeles+skyline',
    leadDesc: '歴史的建築と新しいアートが同居する街の中心',
    longDesc: 'LA発祥の地。20世紀初頭のボザール様式と21世紀の現代建築が共存し、フードホール、現代美術館、ジャズバーが徒歩圏内に集まる。再開発で住む街としても活気がある。',
    bestFor: ['アート', '建築', '夜景', '食文化'],
    duration: '半日〜1日',
    walkability: '徒歩で完結',
    highlights: [
      { name: 'The Broad',                kind: '無料の現代美術館' },
      { name: 'Walt Disney Concert Hall', kind: 'ゲーリーの代表作' },
      { name: 'Grand Central Market',     kind: '100年続くフードホール' },
      { name: 'Bradbury Building',        kind: '1893年築の鉄細工建築' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Downtown+Los+Angeles+CA',
    articles: [
      { src: 'Instagram',      type: 'sns',     title: '#ダウンタウンロサンゼルス でタグ検索',                       url: 'https://www.instagram.com/explore/tags/%E3%83%80%E3%82%A6%E3%83%B3%E3%82%BF%E3%82%A6%E3%83%B3%E3%83%AD%E3%82%B5%E3%83%B3%E3%82%BC%E3%83%AB%E3%82%B9/' },
      { src: 'Instagram',      type: 'sns',     title: '#dtla で街の今を見る',                                       url: 'https://www.instagram.com/explore/tags/dtla/' },
      { src: 'YouTube',        type: 'video',   title: 'ロサンゼルス観光Vlog 王道スポット（ハリウッド/DTLA/マリブ）', url: 'https://www.youtube.com/watch?v=16_0A0ASo3o' },
      { src: 'YouTube (HIS)',  type: 'video',   title: 'ダウンタウンの魅力を徹底ガイド',                              url: 'https://www.youtube.com/watch?v=eDpg2CxOnAM' },
      { src: 'ライトハウス',    type: 'article', title: '最新！ダウンタウンおすすめ情報（現地情報誌）',                url: 'https://www.us-lighthouse.com/la-guide/spot/downtown-la.html' },
      { src: 'Hilton',         type: 'article', title: 'ロサンゼルスのダウンタウン究極のガイド',                      url: 'https://www.hilton.com/ja/travel/articles/your-ultimate-guide-to-downtown-los-angeles/' },
      { src: '4travel',        type: 'review',  title: 'ダウンタウンの観光スポット ランキング（口コミ）',              url: 'https://4travel.jp/overseas/area/north_america/america/los_angeles/downtown_wilshire_la/kankospot' },
    ],
  },
  {
    jp: 'ハリウッド',
    en: 'Hollywood',
    scene: 'hollywood',
    imageQuery: 'hollywood+sign+california',
    leadDesc: '映画の街、丘の上の星',
    longDesc: 'アメリカ映画産業の心臓部。Walk of Fame、TCL Chinese Theatre、Hollywood Signなど誰もが見たことのあるアイコンが集中する。観光地化が進む一方、夜のライブハウスや古い劇場は健在。',
    bestFor: ['映画', '観光', '写真', 'ライブ'],
    duration: '半日',
    walkability: '一部徒歩',
    highlights: [
      { name: 'Walk of Fame',         kind: 'スターの星をたどる' },
      { name: 'TCL Chinese Theatre',  kind: '手形・足型と歴史' },
      { name: 'Hollywood Bowl',       kind: '夏の野外コンサート' },
      { name: 'Runyon Canyon',        kind: 'ハリウッドを見下ろす' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Hollywood+Los+Angeles',
    articles: [
      { src: 'Instagram',          type: 'sns',     title: '#ハリウッド でタグ検索',                                   url: 'https://www.instagram.com/explore/tags/%E3%83%8F%E3%83%AA%E3%82%A6%E3%83%83%E3%83%89/' },
      { src: 'Instagram',          type: 'sns',     title: '#hollywoodsign でリアル写真を見る',                         url: 'https://www.instagram.com/explore/tags/hollywoodsign/' },
      { src: 'YouTube',            type: 'video',   title: 'ハリウッドサインを効率よく見よう（動画ガイド）',             url: 'https://www.youtube.com/watch?v=xJtaYqrj11o' },
      { src: 'YouTube (水越みさと)', type: 'video',   title: '人生初7泊9日LA旅行Vlog（ハリウッド/ドジャース）',         url: 'https://www.youtube.com/watch?v=ZpJNl70Wssc' },
      { src: 'ロコタビ',            type: 'blog',    title: 'ハリウッド観光に必須！おすすめ人気観光スポット13選',        url: 'https://locotabi.jp/losangeles/guide/tp-sp-tourism_hollywood' },
      { src: 'WiFi-Travel',        type: 'blog',    title: 'ハリウッドのおすすめ観光スポット5選【在住者厳選】',           url: 'https://www.wifi-travel.jp/blog/hollywood-tourist-attractions/' },
      { src: 'BUYMA TRAVEL',       type: 'article', title: 'ロサンゼルス ハリウッドのおすすめ観光スポット',              url: 'https://travel.buyma.com/contents/magazine/america-losangeles-hollywood/' },
      { src: 'トリップアドバイザー', type: 'review',  title: 'ハリウッド観光名所・人気スポット（口コミ）',                url: 'https://www.tripadvisor.jp/Attractions-g32655-Activities-zfn7231035-Los_Angeles_California.html' },
    ],
  },
  {
    jp: 'サンタモニカ',
    en: 'Santa Monica',
    scene: 'pier',
    imageQuery: 'santa+monica+pier+sunset',
    leadDesc: '太平洋とピアと夕陽の街',
    longDesc: '観覧車のあるピアと真っ白なビーチで知られる海辺のリゾート。ルート66の西の終点でもあり、ショッピング街サードストリート・プロムナードはオープンエアで賑わう。夕陽の時間帯は必見。',
    bestFor: ['ビーチ', '夕陽', 'ショッピング', '家族'],
    duration: '半日〜1日',
    walkability: '徒歩で快適',
    highlights: [
      { name: 'Santa Monica Pier',        kind: '観覧車と夕陽' },
      { name: 'Third Street Promenade',   kind: 'オープンモール' },
      { name: 'Palisades Park',           kind: '海を見下ろす緑地' },
      { name: 'Santa Monica Beach',       kind: '広い砂浜' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Santa+Monica+CA',
    articles: [
      { src: 'Instagram',          type: 'sns',     title: '#サンタモニカ でタグ検索',                                url: 'https://www.instagram.com/explore/tags/%E3%82%B5%E3%83%B3%E3%82%BF%E3%83%A2%E3%83%8B%E3%82%AB/' },
      { src: 'Instagram',          type: 'sns',     title: '#santamonicapier でピアの今',                              url: 'https://www.instagram.com/explore/tags/santamonicapier/' },
      { src: 'YouTube (シノ社長)',  type: 'video',   title: 'サンタモニカVLOG 2025年冬最新名所を散策',                  url: 'https://www.youtube.com/watch?v=cMCiEAVtuQc' },
      { src: 'YouTube',            type: 'video',   title: 'サンタモニカPIER & ビーチ観光',                            url: 'https://www.youtube.com/watch?v=Y6R7XHxOPbI' },
      { src: 'YouTube (HIS)',      type: 'video',   title: 'LA最大の"映え"スポット サンタモニカを徹底ガイド',          url: 'https://www.youtube.com/watch?v=tEdd790b-uI' },
      { src: 'ロコタビ',            type: 'blog',    title: 'サンタモニカのおすすめ観光スポット4選（在住者執筆）',       url: 'https://locotabi.jp/losangeles/guide/tp-sp-tourism_santa-monica' },
      { src: 'Share my Life',      type: 'blog',    title: '初めてのロサンゼルス旅行 サンタモニカ編',                    url: 'https://saowalker.com/santa_monica/' },
      { src: '4travel',            type: 'review',  title: 'サンタモニカ/ヴェニス 観光スポット ランキング',             url: 'https://4travel.jp/overseas/area/north_america/america/los_angeles/santa_monica_venice_la/kankospot' },
    ],
  },
  {
    jp: 'ヴェニス',
    en: 'Venice',
    scene: 'beach',
    imageQuery: 'venice+beach+california+boardwalk',
    leadDesc: '運河と個性派ショップの自由地区',
    longDesc: '20世紀初頭にイタリアのヴェネツィアを模して作られた運河と、自由な雰囲気のボードウォーク。Abbot Kinney Blvdは個人経営の店とカフェが並ぶ、LAで最もクールな通りの一つ。',
    bestFor: ['アート', 'ショッピング', '散歩', '個性派'],
    duration: '半日',
    walkability: '徒歩・自転車',
    highlights: [
      { name: 'Venice Canals',     kind: '運河と橋の住宅街' },
      { name: 'Abbot Kinney Blvd', kind: '個性派ショップ通り' },
      { name: 'Muscle Beach',      kind: '青空ジムの聖地' },
      { name: 'Venice Boardwalk',  kind: 'ストリートアート' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Venice+Los+Angeles+CA',
    articles: [
      { src: 'Instagram',        type: 'sns',     title: '#venicebeach でタグ検索',                             url: 'https://www.instagram.com/explore/tags/venicebeach/' },
      { src: 'Instagram',        type: 'sns',     title: '#abbotkinney でお洒落な通りを覗く',                    url: 'https://www.instagram.com/explore/tags/abbotkinney/' },
      { src: 'YouTube',          type: 'video',   title: 'ベニスビーチ＆運河が綺麗すぎた！',                      url: 'https://www.youtube.com/watch?v=nHbw4QjHxp8' },
      { src: 'YouTube',          type: 'video',   title: 'ベニスビーチ観光動画 日本語ガイド案内',                  url: 'https://www.youtube.com/watch?v=_zMOOgcAx08' },
      { src: 'YouTube (HAPA)',   type: 'video',   title: 'ロサンゼルスの超人気スポット「ベニスビーチ」を散策',     url: 'https://www.youtube.com/watch?v=UDmqemi8OJQ' },
      { src: 'Shigieブログ',      type: 'blog',    title: 'ベニスビーチ｜100%ロサンゼルス感満載の超人気スポット',    url: 'https://www.shigie.com/venicebeach' },
      { src: 'LocoPlace',        type: 'article', title: 'ロサンゼルス観光ガイド（ビーチ・カルチャー）',           url: 'https://locoplace.jp/visit' },
      { src: '4travel',          type: 'review',  title: 'サンタモニカ/ヴェニス 観光スポット ランキング',          url: 'https://4travel.jp/overseas/area/north_america/america/los_angeles/santa_monica_venice_la/kankospot' },
    ],
  },
  {
    jp: 'ビバリーヒルズ',
    en: 'Beverly Hills',
    scene: 'shopping',
    imageQuery: 'beverly+hills+rodeo+drive',
    leadDesc: '高級ブランドと並木道',
    longDesc: 'ロデオドライブの高級ブランド街と、ヤシの並木が続く美しい住宅街。映画や音楽業界の有名人が住むエリアでもあり、街全体が映画のセットのよう。Greystone Mansionの庭園は無料で入れる隠れた名所。',
    bestFor: ['ショッピング', '建築', '映画ロケ地'],
    duration: '半日',
    walkability: 'ロデオは徒歩',
    highlights: [
      { name: 'Rodeo Drive',           kind: '高級ブランド街' },
      { name: 'Greystone Mansion',     kind: '映画ロケ地と庭園' },
      { name: 'Beverly Wilshire',      kind: '"プリティ・ウーマン"の舞台' },
      { name: 'Two Rodeo',             kind: 'ヨーロッパ風の小路' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Beverly+Hills+CA',
    articles: [
      { src: 'Instagram',          type: 'sns',     title: '#ビバリーヒルズ でタグ検索',                              url: 'https://www.instagram.com/explore/tags/%E3%83%93%E3%83%90%E3%83%AA%E3%83%BC%E3%83%92%E3%83%AB%E3%82%BA/' },
      { src: 'Instagram',          type: 'sns',     title: '#rodeodrive でロデオドライブの今',                          url: 'https://www.instagram.com/explore/tags/rodeodrive/' },
      { src: 'YouTube',            type: 'video',   title: 'LA Vlog（ビバリーヒルズ/ロデオ含む全行程）',               url: 'https://www.youtube.com/watch?v=16_0A0ASo3o' },
      { src: 'note (福原たまねぎ)',  type: 'blog',    title: 'ロサンゼルス旅行記 -"表参道感"のあるビバリーヒルズ',       url: 'https://note.com/fukuharatamanegi/n/nb940c499281d' },
      { src: 'KNT',                type: 'article', title: 'ロサンゼルス観光におすすめのスポット（ビバリーヒルズ含む）', url: 'https://www.knt.co.jp/travelguide/kaigai/018/' },
      { src: '4travel',            type: 'review',  title: 'ビバリーヒルズ 観光スポット ランキング（口コミ）',          url: 'https://4travel.jp/overseas/area/north_america/america/los_angeles/beverly_hills/kankospot' },
    ],
  },
  {
    jp: 'グリフィス',
    en: 'Griffith',
    scene: 'observatory',
    imageQuery: 'griffith+observatory+los+angeles',
    leadDesc: '丘の上の天文台と広大な都市公園',
    longDesc: '4,300エーカーの広大な都市公園。Griffith Observatoryは1935年築のアール・デコ建築で、無料で開放されている。展望からはLA市街、ハリウッドサイン、太平洋まで一望。「La La Land」のロケ地としても有名。',
    bestFor: ['夜景', '自然', '映画', '建築'],
    duration: '半日',
    walkability: '車で訪問',
    highlights: [
      { name: 'Griffith Observatory',  kind: '天文台と夜景' },
      { name: 'Hollywood Sign Trail',  kind: 'ハリウッドの裏側へ' },
      { name: 'LA Zoo',                kind: '動物園' },
      { name: 'Greek Theatre',         kind: '野外音楽堂' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Griffith+Park+Los+Angeles',
    articles: [
      { src: 'Instagram',          type: 'sns',     title: '#グリフィス天文台 でタグ検索',                            url: 'https://www.instagram.com/explore/tags/%E3%82%B0%E3%83%AA%E3%83%95%E3%82%A3%E3%82%B9%E5%A4%A9%E6%96%87%E5%8F%B0/' },
      { src: 'Instagram',          type: 'sns',     title: '#griffithobservatory で世界中の写真を',                    url: 'https://www.instagram.com/explore/tags/griffithobservatory/' },
      { src: 'YouTube',            type: 'video',   title: 'LA Vlog（グリフィス含む王道スポット）',                    url: 'https://www.youtube.com/watch?v=16_0A0ASo3o' },
      { src: 'ロコタビ',            type: 'blog',    title: 'グリフィス天文台（在住ミナさんのおすすめ）',               url: 'https://locotabi.jp/losangeles/recommends/kanko/5823' },
      { src: 'ロコタビ',            type: 'blog',    title: 'グリフィス天文台（夜景スポット）',                         url: 'https://locotabi.jp/losangeles/recommends/nightview/17704' },
      { src: 'note (えいきち)',     type: 'blog',    title: 'アメリカ旅行記 LA② ベニスビーチ＆グリフィス天文台',       url: 'https://note.com/ymstekc/n/n9d407e5aa96a' },
      { src: 'ネイティブキャンプ',    type: 'blog',    title: 'グリフィス天文台とは？アクセス・料金・魅力',              url: 'https://nativecamp.net/blog/20251023_study_abroad_fee' },
      { src: '4travel',            type: 'review',  title: 'グリフィス天文台 クチコミ・アクセス・周辺情報',            url: 'https://4travel.jp/os_shisetsu/10266328' },
      { src: 'トリップアドバイザー', type: 'review',  title: 'グリフィス天文台 出発前に知っておくべきこと',              url: 'https://www.tripadvisor.jp/Attraction_Review-g32655-d116887-Reviews-Griffith_Observatory-Los_Angeles_California.html' },
    ],
  },
  {
    jp: 'リトル東京',
    en: 'Little Tokyo',
    scene: 'little_tokyo',
    imageQuery: 'little+tokyo+los+angeles',
    leadDesc: '北米最大級の日本人街',
    longDesc: '1880年代から続く北米最大級の日本人街。ラーメン、寿司、和菓子の老舗が並び、全米日系人博物館（JANM）では日系移民の歴史を学べる。週末は祭りやマーケットも頻繁に開催される。',
    bestFor: ['食文化', '歴史', '日本好き'],
    duration: '半日',
    walkability: '徒歩で完結',
    highlights: [
      { name: '全米日系人博物館（JANM）', kind: '日系の歴史' },
      { name: 'Daikokuya Ramen',          kind: '老舗トンコツ' },
      { name: 'Japanese Village Plaza',    kind: 'ショッピング' },
      { name: 'Suehiro Cafe',              kind: '70年続く定食屋' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Little+Tokyo+Los+Angeles',
    articles: [
      { src: 'Instagram',          type: 'sns',     title: '#リトル東京 でタグ検索',                                  url: 'https://www.instagram.com/explore/tags/%E3%83%AA%E3%83%88%E3%83%AB%E6%9D%B1%E4%BA%AC/' },
      { src: 'Instagram',          type: 'sns',     title: '#littletokyola でローカル投稿を見る',                       url: 'https://www.instagram.com/explore/tags/littletokyola/' },
      { src: 'YouTube',            type: 'video',   title: 'アメリカにある日本人街「リトルトーキョー」に行ってみた！',  url: 'https://www.youtube.com/watch?v=MjXU6Bp3C8c' },
      { src: 'YouTube',            type: 'video',   title: 'リトルトーキョー：アメリカ目線の小さな日本村',              url: 'https://www.youtube.com/watch?v=1mZU-gcWWBs' },
      { src: 'YouTube',            type: 'video',   title: '【4K】リトル東京をドライブ＆散策',                          url: 'https://www.youtube.com/watch?v=qJ9t6LoDO2s' },
      { src: 'くふうトリップ',       type: 'article', title: 'アメリカ最大の日本人街！リトル東京の名所7選',              url: 'https://rtrp.jp/articles/49417/' },
      { src: 'JCBたびらば',          type: 'blog',    title: 'リトル東京でアメリカにある日本を楽しんでみよう！',          url: 'https://tabilover.jcb.jp/usa/blog/restaurant/la_little_tokyo' },
      { src: 'Travel×Girl',         type: 'blog',    title: 'リトル東京で行くべき大人気スポット・お店',                  url: 'https://travelxgirl.com/usa/california/los-angeles_little-tokyo.html' },
      { src: 'トリップアドバイザー', type: 'review',  title: 'リトル東京 出発前に知っておくべきことすべて',             url: 'https://www.tripadvisor.jp/Attraction_Review-g32655-d144151-Reviews-Little_Tokyo-Los_Angeles_California.html' },
    ],
  },
  {
    jp: 'アーツ地区',
    en: 'Arts District',
    scene: 'historic',
    imageQuery: 'arts+district+los+angeles+mural',
    leadDesc: '倉庫街リノベの壁画とギャラリー',
    longDesc: 'かつての工業倉庫街がアーティスト・コミュニティ、ギャラリー、ロフトに生まれ変わった地区。Bestia、Bavelなどの予約困難レストランや、Hauser & Wirthのような巨大ギャラリーが集まる。壁画の宝庫。',
    bestFor: ['アート', '食', '撮影', '建築'],
    duration: '半日',
    walkability: '徒歩・E-bike',
    highlights: [
      { name: 'Hauser & Wirth',        kind: '無料の大型ギャラリー' },
      { name: 'Bestia',                kind: '予約困難イタリアン' },
      { name: 'Urth Caffe',            kind: 'カフェの聖地' },
      { name: 'Arts District Murals',  kind: 'ストリートアート' },
    ],
    mapUrl: 'https://www.google.com/maps/place/Arts+District+Los+Angeles',
    articles: [
      { src: 'Instagram',          type: 'sns',     title: '#artsdistrictla でアートの今',                              url: 'https://www.instagram.com/explore/tags/artsdistrictla/' },
      { src: 'Instagram',          type: 'sns',     title: '#artsdistrict_la で壁画・カフェの投稿',                       url: 'https://www.instagram.com/explore/tags/artsdistrict_la/' },
      { src: 'YouTube',            type: 'video',   title: 'LA Vlog（DTLA・アーツ地区含む街歩き）',                       url: 'https://www.youtube.com/watch?v=16_0A0ASo3o' },
      { src: 'Shigieブログ',        type: 'blog',    title: 'ロサンゼルス観光スポット動画集（The Broad/MOCA他）',          url: 'https://www.shigie.com/youtube' },
      { src: 'LocoPlace',          type: 'article', title: 'LAアート・建築・カルチャーガイド',                            url: 'https://locoplace.jp/visit' },
      { src: 'Hilton',             type: 'article', title: 'DTLAガイド（アーツ地区の魅力にも触れる）',                    url: 'https://www.hilton.com/ja/travel/articles/your-ultimate-guide-to-downtown-los-angeles/' },
      { src: '4travel',            type: 'review',  title: 'ダウンタウン・アーツ地区周辺の観光スポット（口コミ）',         url: 'https://4travel.jp/overseas/area/north_america/america/los_angeles/downtown_wilshire_la/kankospot' },
    ],
  },
];
// ============ ユーティリティ ============
const formatJPDate = (d) => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]}曜日`;
};
const formatShortDate = (d) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${days[d.getDay()]}`;
};
const pick = (arr, exclude = new Set()) => {
  const pool = arr.filter(a => !exclude.has(a.name));
  if (pool.length === 0) return arr[Math.floor(Math.random() * arr.length)];
  return pool[Math.floor(Math.random() * pool.length)];
};
const poolFor = (slot, interests) => {
  const out = [];
  interests.forEach(i => { if (ACTIVITIES[slot][i]) out.push(...ACTIVITIES[slot][i]); });
  return out;
};

// 旅程生成（1日分）
function generateOneDay(interests, date) {
  const used = new Set();
  const safeInterests = interests.length ? interests : ['history', 'food'];
  const morningPool   = poolFor('morning',   safeInterests);
  const afternoonPool = poolFor('afternoon', safeInterests);

  const themePark = safeInterests.includes('themepark') && Math.random() < 0.35;

  const breakfast = pick(ACTIVITIES.breakfast, used); used.add(breakfast.name);
  const lunch     = pick(ACTIVITIES.lunch, used);     used.add(lunch.name);
  const dinner    = pick(ACTIVITIES.dinner, used);    used.add(dinner.name);

  let morning, afternoon;
  if (themePark && ACTIVITIES.afternoon.themepark.length > 0) {
    const park = pick(ACTIVITIES.afternoon.themepark, used);
    used.add(park.name);
    morning   = { ...park, fullDay: true };
    afternoon = { ...park, fullDay: true, skip: true };
  } else {
    morning   = morningPool.length   ? pick(morningPool, used)   : pick(ACTIVITIES.morning.history, used);
    afternoon = afternoonPool.length ? pick(afternoonPool, used) : pick(ACTIVITIES.afternoon.history, used);
    used.add(morning.name); used.add(afternoon.name);
  }

  const eveningPool = ACTIVITIES.evening.filter(e => safeInterests.includes(e.cat) || safeInterests.length === 0);
  const evening = (eveningPool.length ? pick(eveningPool, used) : pick(ACTIVITIES.evening, used));
  used.add(evening.name);

  return {
    date, themePark,
    slots: [
      { time: '08:30', label: '朝',   en: 'morning',   act: breakfast },
      { time: '10:00', label: '午前', en: 'forenoon',  act: morning },
      ...(!themePark ? [{ time: '13:00', label: '昼', en: 'lunch', act: lunch }] : []),
      { time: '15:00', label: '午後', en: 'afternoon', act: afternoon },
      { time: '19:00', label: '夕',   en: 'dinner',    act: dinner },
      { time: '21:00', label: '夜',   en: 'evening',   act: evening },
    ],
  };
}

// 発見モード用
function generateDiscover(interests, date) {
  const safeInterests = interests.length ? interests : INTERESTS.map(i => i.id);
  const all = [];

  if (safeInterests.includes('food')) {
    all.push(...ACTIVITIES.breakfast, ...ACTIVITIES.lunch, ...ACTIVITIES.dinner);
  }
  safeInterests.forEach(i => {
    if (ACTIVITIES.morning[i])   all.push(...ACTIVITIES.morning[i]);
    if (ACTIVITIES.afternoon[i]) all.push(...ACTIVITIES.afternoon[i]);
  });
  all.push(...ACTIVITIES.evening.filter(e => safeInterests.includes(e.cat)));

  const seen = new Set();
  const unique = [];
  all.forEach(a => { if (!seen.has(a.name)) { seen.add(a.name); unique.push(a); } });

  return {
    date,
    spots: unique,
    events: TODAYS_EVENTS.filter(e => safeInterests.includes(e.cat) || safeInterests.length === 0).slice(0, 6),
  };
}

// URL から表示用ドメインを抜く（http://とパスを除去）
function hostOf(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

// ============ スポット名カタカナ読み ============
const READINGS = {
  // 朝食
  'Grand Central Market':       'グランド・セントラル・マーケット',
  'Sqirl':                      'スクワール',
  'Republique':                 'レピュブリック',
  'Bottega Louie':              'ボッテガ・ルイ',
  'Cofax Coffee':               'コーファックス・コーヒー',
  // ランチ
  "Howlin' Ray's":              'ハウリン・レイズ',
  'Philippe the Original':      'フィリペ・ジ・オリジナル',
  'Sushi Gen':                  'スシ・ゲン',
  'Mendocino Farms':            'メンドシーノ・ファームズ',
  'In-N-Out Burger':            'イン・アンド・アウト・バーガー',
  'Guisados':                   'ギサドス',
  // ディナー
  'Bestia':                     'ベスティア',
  'Bavel':                      'ベイヴェル',
  "Park's BBQ":                 'パークス・バーベキュー',
  'Republique（夜）':            'レピュブリック',
  'Daikokuya Ramen':            'ダイコクヤ・ラーメン',
  'Night + Market Song':        'ナイト・プラス・マーケット・ソング',
  // アート
  'The Broad':                  'ザ・ブロード',
  'MOCA Grand Avenue':          'モカ・グランド・アベニュー',
  'Hauser & Wirth':             'ハウザー・アンド・ワース',
  'LACMA':                      'ラクマ',
  'Urban Light @ LACMA':        'アーバン・ライト（ラクマ）',
  'Getty Center':               'ゲッティ・センター',
  'Academy Museum':             'アカデミー・ミュージアム',
  // 自然
  'Echo Park Lake':             'エコー・パーク・レイク',
  'Huntington Library':         'ハンティントン・ライブラリー',
  'Griffith Observatory':       'グリフィス・オブザーバトリー',
  'Griffith Observatory 夜景':  'グリフィス・オブザーバトリー',
  'Griffith Observatory（La La Land）': 'グリフィス・オブザーバトリー',
  'Runyon Canyon ハイキング':    'ランヨン・キャニオン',
  // ビーチ
  'Santa Monica Pier':          'サンタモニカ・ピア',
  'Santa Monica Pier の夕陽':   'サンタモニカ・ピア',
  'Manhattan Beach':            'マンハッタン・ビーチ',
  'Manhattan Beach サーフィン体験': 'マンハッタン・ビーチ',
  'El Matador State Beach':     'エル・マタドール・ステート・ビーチ',
  'Venice Beach 朝活':           'ベニス・ビーチ',
  'Venice Canals 散歩':          'ベニス・カナル',
  // 歴史・建築
  'Bradbury Building':          'ブラッドベリー・ビルディング',
  'Olvera Street':              'オルベラ・ストリート',
  'Walt Disney Concert Hall':   'ウォルト・ディズニー・コンサートホール',
  'Union Station':              'ユニオン・ステーション',
  // 映画
  'TCL Chinese Theatre':        'ティー・シー・エル・チャイニーズ・シアター',
  'Warner Bros. Studio Tour':   'ワーナー・ブラザース・スタジオツアー',
  'Walk of Fame 散策':           'ウォーク・オブ・フェイム',
  // ショッピング
  'The Grove':                  'ザ・グローブ',
  'Rodeo Drive':                'ロデオ・ドライブ',
  'Melrose Avenue':             'メルローズ・アベニュー',
  'Abbot Kinney Blvd':          'アボット・キニー・ブールバード',
  // テーマパーク
  'Universal Studios Hollywood':'ユニバーサル・スタジオ・ハリウッド',
  'Disneyland Park':            'ディズニーランド・パーク',
  'Six Flags Magic Mountain':   'シックス・フラッグス・マジック・マウンテン',
  // 映え/写真
  'Angels Flight':              'エンジェルズ・フライト',
  'The Last Bookstore':         'ザ・ラスト・ブックストア',
  'Vista Theater':              'ビスタ・シアター',
  'Pink Wall（Paul Smith）':     'ピンク・ウォール',
  'Salt & Straw Venice':        'ソルト・アンド・ストロー',
  'Venice Wall Murals':         'ベニス・ウォール・ミュラル',
  // スポーツ
  'Dodger Stadium ツアー':       'ドジャー・スタジアム',
  'Dodgers Game 観戦':           'ドジャース',
  'Crypto.com Arena 見学':       'クリプト・ドット・コム・アリーナ',
  'Rose Bowl Stadium':          'ローズ・ボウル・スタジアム',
  'SoFi Stadium ツアー':         'ソーファイ・スタジアム',
  // 体験
  'Wi Spa Korean Sauna':         'ワイ・スパ',
  'Helicopter LA Tour':          'ヘリコプター・エルエー・ツアー',
  'E-Bike Tour（DTLA）':         'イー・バイク・ツアー',
  'Old Town Music Hall':         'オールド・タウン・ミュージック・ホール',
  'Speakeasy バー巡り':          'スピークイージー',
  // 夜
  'OUE Skyspace（DTLA夜景）':    'オーユーイー・スカイスペース',
  'Hollywood Bowl コンサート':   'ハリウッド・ボウル',
  'Sunset Strip でドリンク':     'サンセット・ストリップ',
  // イベント名で出てくるもの
  'Hollywood Bowl':              'ハリウッド・ボウル',
  'Dodger Stadium':              'ドジャー・スタジアム',
};

function readingOf(name) {
  if (!name) return null;
  // 完全一致
  if (READINGS[name]) return READINGS[name];
  // 全角カッコを半角に変換してマッチ
  const normalized = name.replace(/（/g, '(').replace(/）/g, ')');
  if (READINGS[normalized]) return READINGS[normalized];
  return null;
}

// ============ フォント ============
const FONT_MINCHO = '"Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Noto Serif JP", "Times New Roman", serif';
const FONT_SERIF_EN = 'Georgia, "Times New Roman", "Yu Mincho", serif';
const FONT_SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Yu Gothic UI", sans-serif';

// ============ セクション見出し ============
function SectionLabel({ romaji, jp, sub, align = 'center' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`${alignClass} px-6 mb-8`}>
      <div className="inline-flex items-center gap-3" style={{ color: C.accent }}>
        <span className="block h-px w-6" style={{ background: C.accent }} />
        <span className="text-[10px] font-bold tracking-[0.35em]">{romaji}</span>
        <span className="block h-px w-6" style={{ background: C.accent }} />
      </div>
      <h2 className="mt-4 text-[26px] leading-tight" style={{ fontFamily: FONT_MINCHO, color: C.ink, fontWeight: 500, letterSpacing: '0.05em' }}>
        {jp}
      </h2>
      {sub && (
        <p className="mt-3 text-[11.5px] leading-[1.9]" style={{ color: C.ink2, letterSpacing: '0.08em' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ============ デイバッジ ============
function DayBadge({ badge }) {
  if (!badge) return null;
  const styles = {
    event:  { bg: C.accent, text: '#FBF5E5' },
    open:   { bg: C.moss,   text: '#FBF5E5' },
    hot:    { bg: C.ochre,  text: '#1A1410' },
    closed: { bg: C.ink3,   text: '#FBF5E5' },
  };
  const s = styles[badge.kind] || styles.open;
  return (
    <span className="inline-flex items-center text-[9.5px] font-bold px-2 py-0.5" style={{ background: s.bg, color: s.text, letterSpacing: '0.08em' }}>
      {badge.text}
    </span>
  );
}

// ============ シーン表示（SVGのみ） ============
function SceneArt({ scene, w = 160, h = 160, rounded = 0 }) {
  const svg = Scenes[scene] || Scenes.skyline;
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: w, height: h, borderRadius: rounded, background: C.paper }}>
      {svg}
    </div>
  );
}

// ============ 画像クエリ：場所名→Unsplashキーワード ============
const IMAGE_QUERIES = {
  // ピア・ビーチ
  'Santa Monica Pier':                  'santa+monica+pier',
  'Santa Monica Pier の夕陽':            'santa+monica+sunset',
  'Venice Beach 朝活':                   'venice+beach+boardwalk',
  'Venice Canals 散歩':                  'venice+canals+los+angeles',
  'Manhattan Beach':                     'manhattan+beach+california',
  'El Matador State Beach':              'malibu+beach',
  'Manhattan Beach サーフィン体験':      'california+surfing',
  // ハリウッド・映画
  'Walk of Fame 散策':                   'hollywood+walk+of+fame',
  'TCL Chinese Theatre':                 'tcl+chinese+theatre+hollywood',
  'Warner Bros. Studio Tour':            'hollywood+studio',
  'Hollywood Bowl コンサート':           'hollywood+bowl',
  'Vista Theater':                       'vintage+movie+theater',
  // 美術館・アート
  'The Broad':                           'the+broad+museum+los+angeles',
  'MOCA Grand Avenue':                   'contemporary+art+museum',
  'Hauser & Wirth':                      'modern+art+gallery',
  'LACMA':                               'lacma+urban+light',
  'Urban Light @ LACMA':                 'lacma+urban+light',
  'Getty Center':                        'getty+center+los+angeles',
  'Academy Museum':                      'academy+museum+motion+pictures',
  // 建築・歴史
  'Bradbury Building':                   'historic+building+los+angeles',
  'Walt Disney Concert Hall':            'walt+disney+concert+hall',
  'Union Station':                       'union+station+los+angeles',
  'Olvera Street':                       'olvera+street+los+angeles',
  'The Last Bookstore':                  'last+bookstore+los+angeles',
  'Little Tokyo 散策':                   'little+tokyo+los+angeles',
  'Arts District 散策':                  'arts+district+los+angeles',
  // 自然
  'Runyon Canyon ハイキング':            'runyon+canyon+hiking',
  'Echo Park Lake':                      'echo+park+lake+los+angeles',
  'Griffith Park 散策':                  'griffith+park+los+angeles',
  'Huntington Library':                  'huntington+library+japanese+garden',
  'Griffith Observatory':                'griffith+observatory',
  'Griffith Observatory（La La Land）':  'griffith+observatory+night',
  'Griffith Observatory 夜景':           'griffith+observatory+night',
  // ショッピング
  'The Grove':                           'the+grove+los+angeles',
  'Rodeo Drive':                         'rodeo+drive+beverly+hills',
  'Melrose Avenue':                      'melrose+avenue+los+angeles',
  'Abbot Kinney Blvd':                   'abbot+kinney+venice',
  // テーマパーク
  'Universal Studios Hollywood':         'universal+studios+hollywood',
  'Disneyland Park':                     'disneyland+anaheim',
  'Six Flags Magic Mountain':            'six+flags+roller+coaster',
  // 写真スポット
  'Angels Flight':                       'angels+flight+los+angeles',
  'Venice Wall Murals':                  'venice+beach+murals',
  'Pink Wall（Paul Smith）':              'pink+wall+melrose',
  'Salt & Straw Venice':                 'ice+cream+shop',
  // スポーツ
  'Dodger Stadium ツアー':               'dodger+stadium',
  'Dodgers Game 観戦':                   'dodger+stadium+baseball',
  'Crypto.com Arena 見学':                'staples+center+los+angeles',
  'Rose Bowl Stadium':                   'rose+bowl+stadium+pasadena',
  'SoFi Stadium ツアー':                 'sofi+stadium+inglewood',
  // 体験
  'Wi Spa Korean Sauna':                 'korean+spa+sauna',
  'Helicopter LA Tour':                  'helicopter+tour+los+angeles',
  'クッキングクラス（メキシカン）':       'mexican+cooking+class',
  'E-Bike Tour（DTLA）':                  'ebike+los+angeles',
  'Pottery Workshop':                    'pottery+workshop+clay',
  'Old Town Music Hall':                 'vintage+cinema+organ',
  'Speakeasy バー巡り':                  'speakeasy+cocktail+bar',
  'OUE Skyspace（DTLA夜景）':             'los+angeles+downtown+night',
  'Sunset Strip でドリンク':              'sunset+strip+los+angeles',
  // グルメ
  'Grand Central Market':                'grand+central+market+los+angeles',
  'Sqirl':                               'avocado+toast+breakfast',
  'Republique':                          'french+bistro+pastries',
  'Republique（夜）':                     'french+bistro+dinner',
  'Bottega Louie':                        'macaron+marble+cafe',
  'Cofax Coffee':                         'donut+coffee+los+angeles',
  "Howlin' Ray's":                       'nashville+hot+chicken',
  'Philippe the Original':                'french+dip+sandwich',
  'Sushi Gen':                           'sushi+nigiri',
  'Mendocino Farms':                     'california+sandwich',
  'In-N-Out Burger':                     'in+n+out+burger',
  'Guisados':                            'tacos+mexican',
  'Bestia':                              'italian+pasta+restaurant',
  'Bavel':                               'middle+eastern+restaurant',
  "Park's BBQ":                          'korean+bbq',
  'Daikokuya Ramen':                     'tonkotsu+ramen',
  'Night + Market Song':                 'thai+street+food',
  // イベント会場（EventArticleで使用）
  'Hollywood Bowl':                       'hollywood+bowl',
  'Dodger Stadium':                       'dodger+stadium',
};

// カテゴリーごとのフォールバック
const CATEGORY_QUERIES = {
  food:       'los+angeles+restaurant',
  beach:      'california+beach',
  art:        'los+angeles+art+museum',
  nature:     'los+angeles+nature',
  movie:      'hollywood+los+angeles',
  history:    'los+angeles+historic+building',
  shopping:   'los+angeles+shopping',
  themepark:  'theme+park+california',
  photo:      'los+angeles+photogenic',
  sports:     'los+angeles+stadium',
  experience: 'los+angeles+experience',
};

function getImageQuery(item) {
  if (!item) return 'los+angeles';
  const key = item.name || item.venue || '';
  if (IMAGE_QUERIES[key]) return IMAGE_QUERIES[key];
  return CATEGORY_QUERIES[item.cat] || 'los+angeles';
}

// ============ 実画像マッピング（Unsplash CDN直リンク） ============
// scene種別 → 実画像URL
const REAL_IMAGES_BY_SCENE = {
  pier:        'https://images.unsplash.com/photo-1459258350879-34886319a3c9?w=1200&q=70&auto=format&fit=crop',
  hollywood:   'https://images.unsplash.com/photo-1515553633540-e0dd6024463e?w=1200&q=70&auto=format&fit=crop',
  observatory: 'https://images.unsplash.com/photo-1566864717473-2f0daf8979e5?w=1200&q=70&auto=format&fit=crop',
  skyline:     'https://images.unsplash.com/photo-1518540329668-417feba873ef?w=1200&q=70&auto=format&fit=crop',
  historic:    'https://images.unsplash.com/photo-1620135791944-e05e9f8f2f2a?w=1200&q=70&auto=format&fit=crop',
  night_city:  'https://images.unsplash.com/photo-1631473121056-34bbec0dfb3b?w=1200&q=70&auto=format&fit=crop',
  shopping:    'https://images.unsplash.com/photo-1567898948655-acbf0ebe1606?w=1200&q=70&auto=format&fit=crop',
  beach:       'https://images.unsplash.com/photo-1459258350879-34886319a3c9?w=1200&q=70&auto=format&fit=crop',
  mountain:    'https://images.unsplash.com/photo-1649080832349-06b15253c27c?w=1200&q=70&auto=format&fit=crop',
  art:         'https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?w=1200&q=70&auto=format&fit=crop',
  little_tokyo:'https://images.unsplash.com/photo-1609320518571-cbde7ea56184?w=1200&q=70&auto=format&fit=crop',
  // 食事系は実画像を使わずイラスト統一（実際のメニューと写真のミスマッチを避けるため）
};

// 特定スポット名 → 実画像URL（sceneより優先）
const REAL_IMAGES_BY_NAME = {
  // エリア・観光
  'Santa Monica Pier':                  'https://images.unsplash.com/photo-1459258350879-34886319a3c9?w=1200&q=70&auto=format&fit=crop',
  'Santa Monica Pier の夕陽':           'https://images.unsplash.com/photo-1459258350879-34886319a3c9?w=1200&q=70&auto=format&fit=crop',
  'Walk of Fame 散策':                  'https://images.unsplash.com/photo-1515553633540-e0dd6024463e?w=1200&q=70&auto=format&fit=crop',
  'Griffith Observatory':               'https://images.unsplash.com/photo-1566864717473-2f0daf8979e5?w=1200&q=70&auto=format&fit=crop',
  'Griffith Observatory 夜景':           'https://images.unsplash.com/photo-1639164507206-91fe76f7cf7c?w=1200&q=70&auto=format&fit=crop',
  'Griffith Observatory（La La Land）': 'https://images.unsplash.com/photo-1572975165658-8fba2f1b0b37?w=1200&q=70&auto=format&fit=crop',
  'OUE Skyspace（DTLA夜景）':            'https://images.unsplash.com/photo-1631473121056-34bbec0dfb3b?w=1200&q=70&auto=format&fit=crop',
  'Bradbury Building':                  'https://images.unsplash.com/photo-1620135791944-e05e9f8f2f2a?w=1200&q=70&auto=format&fit=crop',
  'Walt Disney Concert Hall':           'https://images.unsplash.com/photo-1601783210890-d921f8d008b3?w=1200&q=70&auto=format&fit=crop',
  'Rodeo Drive':                        'https://images.unsplash.com/photo-1567898948655-acbf0ebe1606?w=1200&q=70&auto=format&fit=crop',
  // スポーツ
  'Dodger Stadium ツアー':               'https://images.unsplash.com/photo-1695378201940-b82eef9bfd15?w=1200&q=70&auto=format&fit=crop',
  'Dodgers Game 観戦':                   'https://images.unsplash.com/photo-1695378201940-b82eef9bfd15?w=1200&q=70&auto=format&fit=crop',
  'Dodger Stadium':                      'https://images.unsplash.com/photo-1695378201940-b82eef9bfd15?w=1200&q=70&auto=format&fit=crop',
  // 美術館（汎用ギャラリー外観・内観）
  'The Broad':                          'https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?w=1200&q=70&auto=format&fit=crop',
  'MOCA Grand Avenue':                  'https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?w=1200&q=70&auto=format&fit=crop',
  'LACMA':                              'https://images.unsplash.com/photo-1587157013165-d2944ffe7094?w=1200&q=70&auto=format&fit=crop',
  'Getty Center':                       'https://images.unsplash.com/photo-1587157013165-d2944ffe7094?w=1200&q=70&auto=format&fit=crop',
};

// エリアごとの大きい実画像（AreaCard展開用）
const REAL_IMAGES_BY_AREA = {
  'Downtown':      'https://images.unsplash.com/photo-1518540329668-417feba873ef?w=1200&q=70&auto=format&fit=crop',
  'Hollywood':     'https://images.unsplash.com/photo-1515553633540-e0dd6024463e?w=1200&q=70&auto=format&fit=crop',
  'Santa Monica':  'https://images.unsplash.com/photo-1459258350879-34886319a3c9?w=1200&q=70&auto=format&fit=crop',
  'Venice':        'https://images.unsplash.com/photo-1567898948655-acbf0ebe1606?w=1200&q=70&auto=format&fit=crop',
  'Beverly Hills': 'https://images.unsplash.com/photo-1620135791944-e05e9f8f2f2a?w=1200&q=70&auto=format&fit=crop',
  'Griffith':      'https://images.unsplash.com/photo-1566864717473-2f0daf8979e5?w=1200&q=70&auto=format&fit=crop',
  'Little Tokyo':  'https://images.unsplash.com/photo-1638059957884-2faffe7b6943?w=1200&q=70&auto=format&fit=crop',
  'Arts District': 'https://images.unsplash.com/photo-1631473121056-34bbec0dfb3b?w=1200&q=70&auto=format&fit=crop',
};

function getRealImage(item) {
  if (!item) return null;
  if (item.name && REAL_IMAGES_BY_NAME[item.name]) return REAL_IMAGES_BY_NAME[item.name];
  if (item.venue && REAL_IMAGES_BY_NAME[item.venue]) return REAL_IMAGES_BY_NAME[item.venue];
  if (item.scene && REAL_IMAGES_BY_SCENE[item.scene]) return REAL_IMAGES_BY_SCENE[item.scene];
  if (item.en && REAL_IMAGES_BY_AREA[item.en]) return REAL_IMAGES_BY_AREA[item.en];
  return null;
}

// ============ 画像 or SVG（フォールバック付き） ============
// realUrl が指定されていれば実画像を試し、失敗時はSVGに落ちる
function PhotoOrScene({ scene, realUrl, w = 160, h = 160, rounded = 0 }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImg = realUrl && !failed;

  return (
    <div
      className="shrink-0 overflow-hidden relative"
      style={{ width: w, height: h, borderRadius: rounded, background: C.paper }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: (showImg && loaded) ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        {Scenes[scene] || Scenes.skyline}
      </div>
      {showImg && (
        <img
          src={realUrl}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display: 'block',
          }}
        />
      )}
    </div>
  );
}

// ============ リンク行（日本語検索 / 公式URL / Instagram） ============
// ============ お気に入りアイテム生成ヘルパー ============
function favItemFromAct(act) {
  return {
    name: act.name,
    reading: readingOf(act.name) || '',
    kind: act.desc ? act.desc.slice(0, 40) : '',
    area: act.area || '',
    mapUrl: act.name ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.name + ' Los Angeles')}` : '',
    url: act.url || '',
    insta: act.insta || '',
    cat: act.cat || '',
  };
}
function favItemFromEvent(ev) {
  return {
    name: ev.title,
    reading: '',
    kind: ev.venue ? `会場：${ev.venue}` : '',
    area: ev.venue || '',
    mapUrl: ev.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.venue + ' Los Angeles')}` : '',
    url: ev.url || '',
    insta: ev.insta || '',
    cat: 'event',
  };
}

// ============ お気に入りスターボタン ============
function StarButton({ item, size = 22 }) {
  const { isFav, toggleFav } = useFavs();
  const active = isFav(item.name);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(item); }}
      aria-label={active ? 'お気に入りから外す' : 'お気に入りに追加'}
      className="shrink-0 flex items-center justify-center transition-transform active:scale-90"
      style={{
        width: size + 14,
        height: size + 14,
        borderRadius: '50%',
        background: active ? C.accent : 'transparent',
        border: `1.5px solid ${active ? C.accent : C.line}`,
      }}
    >
      <Star
        size={size}
        strokeWidth={1.8}
        style={{ color: active ? '#FBF5E5' : C.ink3, fill: active ? '#FBF5E5' : 'none' }}
      />
    </button>
  );
}

function LinkRow({ url, insta, name, isFood }) {
  if (!url && !insta && !name) return null;
  const instaUrl = insta ? `https://instagram.com/${insta.replace(/^@/, '')}` : null;
  const searchUrl = name ? `https://www.google.com/search?q=${encodeURIComponent(name + ' ロサンゼルス 観光')}&hl=ja` : null;

  return (
    <div className="mt-4 pt-3 flex flex-col gap-2" style={{ borderTop: `1px dashed ${C.line}` }}>
      {searchUrl && (
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 text-[10.5px]"
          style={{ color: C.accent }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Search size={11} strokeWidth={1.8} />
            <span style={{ fontFamily: FONT_SANS, letterSpacing: '0.05em', fontWeight: 700 }}>日本語で詳しく見る</span>
          </span>
          <span className="inline-flex items-center gap-1" style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', color: C.ink3 }}>
            ブログ・ガイド検索
            <ExternalLink size={10} strokeWidth={1.8} />
          </span>
        </a>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 text-[10.5px] group"
          style={{ color: C.sub }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Globe size={11} strokeWidth={1.8} />
            <span style={{ fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>公式サイト</span>
            <span className="text-[9px] px-1 py-px ml-1" style={{ color: C.ink3, border: `1px solid ${C.line}`, letterSpacing: '0.1em' }}>EN</span>
          </span>
          <span className="inline-flex items-center gap-1 truncate max-w-[180px]" style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', color: C.ink2 }}>
            {hostOf(url)}
            <ExternalLink size={10} strokeWidth={1.8} />
          </span>
        </a>
      )}
      {insta && (
        <a
          href={instaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 text-[10.5px]"
          style={{ color: isFood ? C.accent : C.sub }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Instagram size={11} strokeWidth={1.8} />
            <span style={{ fontFamily: FONT_SANS, letterSpacing: '0.05em', fontWeight: isFood ? 700 : 400 }}>
              {isFood ? '実際の料理を見る' : 'Instagram'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1" style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', color: C.ink2 }}>
            {isFood ? `公式インスタ ${insta}` : insta}
            <ExternalLink size={10} strokeWidth={1.8} />
          </span>
        </a>
      )}
    </div>
  );
}

// ============ プラン：タイムラインの記事カード ============
function ArticleCard({ idx, slot }) {
  const { time, label, en, act } = slot;
  if (!act || act.skip) return null;
  const num = String(idx + 1).padStart(2, '0');
  return (
    <div className="px-6 py-7" style={{ borderBottom: `1px solid ${C.line}` }}>
      <div className="flex items-baseline gap-3 mb-4">
        <span style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 32, color: C.accent, fontWeight: 400, letterSpacing: '0.02em' }}>
          {num}
        </span>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: C.ink3 }}>
          {en} · {time}
        </span>
      </div>

      <div className="mb-4">
        <PhotoOrScene scene={act.scene} realUrl={getRealImage(act)} w="100%" h={200} />
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <DayBadge badge={act.dayBadge} />
        {act.hours && (
          <span className="text-[10px] tracking-wider" style={{ color: C.ink3 }}>
            {act.hours}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-[20px] leading-tight" style={{ fontFamily: FONT_MINCHO, color: C.ink, fontWeight: 500, letterSpacing: '0.04em' }}>
            {act.name}
            {act.fullDay && (
              <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 align-middle" style={{ background: C.ochre, color: C.ink, fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.1em' }}>
                ALL DAY
              </span>
            )}
          </h3>
          {readingOf(act.name) && (
            <div className="mt-1 text-[11px]" style={{ color: C.ink3, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
              {readingOf(act.name)}
            </div>
          )}
        </div>
        <StarButton item={favItemFromAct(act)} />
      </div>

      <p className="text-[12.5px] leading-[1.85]" style={{ color: C.ink2 }}>
        {act.desc}
      </p>

      <div className="mt-4 flex items-center gap-4 text-[10.5px] flex-wrap" style={{ color: C.ink3, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
        <span className="inline-flex items-center gap-1">
          <Star size={10} style={{ color: C.gold, fill: C.gold }} />
          <span style={{ color: C.ink2, fontWeight: 700 }}>{act.rating.toFixed(1)}</span>
        </span>
        <span style={{ color: C.line }}>|</span>
        <span className="inline-flex items-center gap-1">
          {act.mode === 'walk' ? <Footprints size={11} /> : <Car size={11} />}
          {act.distance}
        </span>
        <span style={{ color: C.line }}>|</span>
        <span>{act.area}</span>
        {act.price && (
          <>
            <span style={{ color: C.line }}>|</span>
            <span className="inline-flex items-center gap-1" style={{ color: C.moss, fontWeight: 700 }}>
              <Banknote size={11} strokeWidth={1.8} />
              {act.price}
            </span>
          </>
        )}
      </div>

      <LinkRow url={act.url} insta={act.insta} name={act.name} isFood={act.cat === 'food'} />
    </div>
  );
}

// ============ 発見モード：イベントの記事カード ============
function EventArticle({ ev, idx }) {
  const num = String(idx + 1).padStart(2, '0');
  return (
    <div className="px-6 py-7" style={{ borderBottom: `1px solid ${C.line}` }}>
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 22, color: C.accent, letterSpacing: '0.02em' }}>
          {num}
        </span>
        <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: C.accent }}>
          TONIGHT
        </span>
      </div>
      <div className="mb-4">
        <PhotoOrScene scene={ev.scene} realUrl={getRealImage(ev)} w="100%" h={180} />
      </div>
      <div className="text-[10.5px] tracking-[0.2em] mb-1" style={{ color: C.ink3, fontFamily: FONT_SANS }}>
        {ev.time}
      </div>
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-[18px] leading-tight flex-1" style={{ fontFamily: FONT_MINCHO, color: C.ink, fontWeight: 500, letterSpacing: '0.04em' }}>
          {ev.title}
        </h3>
        <StarButton item={favItemFromEvent(ev)} size={18} />
      </div>
      <div className="text-[11.5px]" style={{ color: C.ink2, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
        会場：{ev.venue}
        {readingOf(ev.venue) && (
          <span className="ml-1.5 text-[10px]" style={{ color: C.ink3 }}>
            （{readingOf(ev.venue)}）
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="inline-block px-2 py-0.5 text-[10px] font-bold" style={{ background: C.paper, color: C.ink2, border: `1px solid ${C.line}`, letterSpacing: '0.08em' }}>
          {ev.ticketsLeft}
        </span>
        {ev.price && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold" style={{ background: C.paper, color: C.moss, border: `1px solid ${C.line}`, letterSpacing: '0.05em' }}>
            <Banknote size={10} strokeWidth={1.8} />目安 {ev.price}
          </span>
        )}
      </div>

      <LinkRow url={ev.url} insta={ev.insta} name={ev.title} />
    </div>
  );
}

// ============ 発見モード：スポット記事カード（横長） ============
function SpotArticle({ act, idx }) {
  const num = String(idx + 1).padStart(2, '0');
  return (
    <div className="px-6 py-7" style={{ borderBottom: `1px solid ${C.line}` }}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 24, color: C.accent, letterSpacing: '0.02em' }}>
            {num}
          </span>
          <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: C.ink3 }}>
            {act.area}
          </span>
        </div>
        <StarButton item={favItemFromAct(act)} size={18} />
      </div>
      <div className="flex gap-4">
        <PhotoOrScene scene={act.scene} realUrl={getRealImage(act)} w={130} h={130} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <DayBadge badge={act.dayBadge} />
          </div>
          <h3 className="text-[16px] leading-tight mb-1.5" style={{ fontFamily: FONT_MINCHO, color: C.ink, fontWeight: 500, letterSpacing: '0.03em' }}>
            {act.name}
          </h3>
          {readingOf(act.name) && (
            <div className="-mt-1 mb-1.5 text-[10.5px]" style={{ color: C.ink3, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
              {readingOf(act.name)}
            </div>
          )}
          <p className="text-[11px] leading-[1.7] line-clamp-3" style={{ color: C.ink2 }}>
            {act.desc}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] flex-wrap" style={{ color: C.ink3, letterSpacing: '0.05em' }}>
            <Star size={9} style={{ color: C.gold, fill: C.gold }} />
            <span style={{ color: C.ink2 }}>{act.rating.toFixed(1)}</span>
            <span style={{ color: C.line }}>·</span>
            <span>{act.distance}</span>
            {act.hours && (<><span style={{ color: C.line }}>·</span><span>{act.hours}</span></>)}
            {act.price && (
              <>
                <span style={{ color: C.line }}>·</span>
                <span className="inline-flex items-center gap-0.5" style={{ color: C.moss, fontWeight: 700 }}>
                  <Banknote size={10} strokeWidth={1.8} />{act.price}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <LinkRow url={act.url} insta={act.insta} name={act.name} isFood={act.cat === 'food'} />
    </div>
  );
}

// ============ モードトグル ============
function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex" style={{ borderBottom: `1px solid ${C.line}` }}>
      {[
        { id: 'plan',     label: 'プラン',  en: 'PLAN' },
        { id: 'discover', label: '発見',    en: 'DISCOVER' },
      ].map(m => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className="flex-1 py-4 text-center transition-colors relative"
            style={{ color: active ? C.accent : C.ink3 }}
          >
            <div className="text-[9.5px] font-bold tracking-[0.3em]">{m.en}</div>
            <div className="text-[14px] mt-0.5" style={{ fontFamily: FONT_MINCHO, fontWeight: 500, letterSpacing: '0.1em' }}>{m.label}</div>
            {active && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12" style={{ background: C.accent }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============ Photo Belt ============
function PhotoBelt() {
  const scenes = ['pier', 'hollywood', 'observatory', 'art', 'little_tokyo', 'food_taco', 'shopping', 'mountain', 'historic', 'night_city', 'beach', 'themepark'];
  return (
    <div className="overflow-hidden">
      <div className="flex gap-0">
        {scenes.map((s, i) => (
          <div key={i} className="shrink-0" style={{ width: 80, height: 80 }}>
            {Scenes[s] || Scenes.skyline}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ AreaCard（展開可能なエリア詳細） ============
function AreaCard({ area, idx, isOpen, onToggle }) {
  const num = String(idx + 1).padStart(2, '0');
  return (
    <div style={{ borderBottom: `1px solid ${C.line}` }}>
      {/* ヘッダー（常時表示） */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 transition-colors"
        style={{ background: isOpen ? C.paper : 'transparent' }}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <PhotoOrScene
              scene={area.scene}
              w={72}
              h={72}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9.5px] font-bold tracking-[0.3em]" style={{ color: C.accent, fontFamily: FONT_SANS }}>
              {num} · {area.en}
            </div>
            <div className="mt-1.5" style={{ fontFamily: FONT_MINCHO, fontSize: 16, color: C.ink, fontWeight: 500, letterSpacing: '0.05em' }}>
              {area.jp}
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed" style={{ color: C.ink2 }}>
              {area.leadDesc}
            </div>
          </div>
          <ChevronRight
            size={18}
            strokeWidth={1.5}
            style={{
              color: C.ink3,
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
              marginTop: 8,
            }}
          />
        </div>
      </button>

      {/* 展開コンテンツ */}
      {isOpen && (
        <div className="px-6 pb-8" style={{ background: C.paper }}>
          {/* 大きなビジュアル */}
          <div className="mb-5">
            <PhotoOrScene
              scene={area.scene}
              realUrl={getRealImage(area)}
              w="100%"
              h={200}
            />
          </div>

          {/* 長文説明 */}
          <p className="text-[12px] leading-[2]" style={{ color: C.ink2, letterSpacing: '0.04em' }}>
            {area.longDesc}
          </p>

          {/* メタ情報 */}
          <div className="mt-5 pt-4 grid grid-cols-2 gap-4" style={{ borderTop: `1px dotted ${C.line}` }}>
            <div>
              <div className="text-[9px] font-bold tracking-[0.25em]" style={{ color: C.ink3 }}>
                DURATION
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px]" style={{ color: C.ink, fontFamily: FONT_MINCHO, fontWeight: 500 }}>
                <Clock size={11} strokeWidth={1.5} />
                {area.duration}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-[0.25em]" style={{ color: C.ink3 }}>
                ACCESS
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px]" style={{ color: C.ink, fontFamily: FONT_MINCHO, fontWeight: 500 }}>
                <Footprints size={11} strokeWidth={1.5} />
                {area.walkability}
              </div>
            </div>
          </div>

          {/* Best for タグ */}
          <div className="mt-5">
            <div className="text-[9px] font-bold tracking-[0.25em] mb-2" style={{ color: C.ink3 }}>
              BEST FOR
            </div>
            <div className="flex flex-wrap gap-2">
              {area.bestFor.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10.5px] px-2.5 py-1"
                  style={{
                    background: C.bg,
                    color: C.ink2,
                    border: `1px solid ${C.line}`,
                    fontFamily: FONT_MINCHO,
                    letterSpacing: '0.05em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ハイライト */}
          <div className="mt-6">
            <div className="text-[9.5px] font-bold tracking-[0.3em] mb-3 pb-2 flex items-center gap-2" style={{ color: C.accent, borderBottom: `1px solid ${C.accent}` }}>
              <Sparkles size={11} strokeWidth={1.5} />
              <span>HIGHLIGHTS — 見どころ</span>
            </div>
            <div>
              {area.highlights.map((h, i) => {
                const q = encodeURIComponent(h.name + ' Los Angeles');
                const qJp = encodeURIComponent(h.name + ' ' + area.jp + ' 観光');
                const webUrl   = `https://www.google.com/search?q=${qJp}&hl=ja`;
                const igUrl    = `https://www.google.com/search?q=${q}+instagram`;
                const ytUrl    = `https://www.youtube.com/results?search_query=${q}`;
                return (
                  <div
                    key={i}
                    className="py-3"
                    style={{ borderBottom: `1px dotted ${C.line}` }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 14, color: C.accent, minWidth: 24 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: FONT_MINCHO, fontSize: 13.5, color: C.ink, fontWeight: 500, letterSpacing: '0.04em' }}>
                          {h.name}
                        </div>
                        <div className="text-[10.5px] mt-0.5" style={{ color: C.ink3, letterSpacing: '0.03em' }}>
                          {h.kind}
                        </div>
                        {/* リンク3種 */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <a
                            href={webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[9.5px] px-2 py-1"
                            style={{ color: C.sub, border: `1px solid ${C.line}`, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}
                          >
                            <Search size={9} strokeWidth={1.8} />
                            日本語で調べる
                          </a>
                          <a
                            href={igUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[9.5px] px-2 py-1"
                            style={{ color: '#C8336B', border: `1px solid ${C.line}`, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}
                          >
                            <Instagram size={9} strokeWidth={1.8} />
                            写真・SNS
                          </a>
                          <a
                            href={ytUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[9.5px] px-2 py-1"
                            style={{ color: C.accent, border: `1px solid ${C.line}`, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}
                          >
                            <Video size={9} strokeWidth={1.8} />
                            動画
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 関連記事・動画・ガイド（具体コンテンツ） */}
          <div className="mt-6 pt-5" style={{ borderTop: `1px dashed ${C.line}` }}>
            <div className="text-[9.5px] font-bold tracking-[0.3em] mb-3" style={{ color: C.accent }}>
              READ & WATCH — 関連記事・動画
            </div>
            <p className="text-[10.5px] mb-4 leading-[1.7]" style={{ color: C.ink3 }}>
              日本語で読める/見られるエリアの紹介コンテンツです。
            </p>
            <div className="space-y-3">
              {area.articles.map((a, i) => {
                const typeLabel = { article: '記事', review: 'クチコミ', blog: 'ブログ', wiki: '辞典', video: '動画', sns: 'SNS' }[a.type] || '記事';
                const typeColor = { article: C.sub, review: C.gold, blog: C.moss, wiki: C.ink2, video: C.accent, sns: '#C8336B' }[a.type] || C.ink2;
                return (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 transition-colors"
                    style={{ background: '#FFF', border: `1px solid ${C.line}` }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5"
                        style={{ background: typeColor, color: '#FBF5E5', letterSpacing: '0.1em' }}
                      >
                        {typeLabel}
                      </span>
                      <span className="text-[10px]" style={{ color: C.ink3, fontFamily: FONT_SERIF_EN, fontStyle: 'italic', letterSpacing: '0.05em' }}>
                        {a.src}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[12px] leading-[1.5] flex-1" style={{ color: C.ink, fontFamily: FONT_MINCHO, fontWeight: 500, letterSpacing: '0.03em' }}>
                        {a.title}
                      </div>
                      <ExternalLink size={11} strokeWidth={1.8} style={{ color: C.ink3, marginTop: 2 }} />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Mapリンクのみ別途残す */}
            <a
              href={area.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-[11px] py-3 mt-4"
              style={{ color: C.sub, borderTop: `1px dotted ${C.line}` }}
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={12} strokeWidth={1.8} />
                <span style={{ fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>Google Mapsで位置を見る</span>
              </span>
              <ExternalLink size={11} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ お気に入り一覧セクション ============
function FavoritesSection() {
  const { favList, toggleFav } = useFavs();
  if (favList.length === 0) return null;

  return (
    <section className="px-6 py-10" style={{ background: C.ink }}>
      <div className="flex items-center gap-2 mb-1">
        <Star size={14} strokeWidth={1.8} style={{ color: C.ochre, fill: C.ochre }} />
        <div className="text-[9.5px] font-bold tracking-[0.4em]" style={{ color: C.ochre }}>
          MY FAVORITES — 気になるリスト
        </div>
      </div>
      <p className="text-[11px] mb-5 leading-relaxed" style={{ color: '#C9BBA0' }}>
        星をつけた場所がここに集まります（この端末にのみ保存）。{favList.length}件。
      </p>

      <div className="space-y-3">
        {favList.map((f, i) => (
          <div
            key={i}
            className="p-4"
            style={{ background: '#241C14', border: `1px solid #3A2E22` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: FONT_MINCHO, fontSize: 15, color: '#FBF5E5', fontWeight: 500, letterSpacing: '0.04em' }}>
                  {f.name}
                </div>
                {f.reading && (
                  <div className="mt-0.5 text-[10.5px]" style={{ color: '#A99A82', fontFamily: FONT_SANS }}>
                    {f.reading}
                  </div>
                )}
                {f.kind && (
                  <div className="mt-1.5 text-[11px] leading-relaxed" style={{ color: '#C9BBA0' }}>
                    {f.kind}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleFav(f)}
                aria-label="お気に入りから外す"
                className="shrink-0 flex items-center justify-center transition-transform active:scale-90"
                style={{ width: 34, height: 34, borderRadius: '50%', background: C.ochre }}
              >
                <Star size={17} strokeWidth={1.8} style={{ color: C.ink, fill: C.ink }} />
              </button>
            </div>

            {/* リンク類 */}
            <div className="mt-3 pt-3 flex items-center gap-2 flex-wrap" style={{ borderTop: `1px dotted #3A2E22` }}>
              {f.mapUrl && (
                <a href={f.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1"
                  style={{ color: '#FBF5E5', border: `1px solid #3A2E22`, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
                  <MapPin size={10} strokeWidth={1.8} />地図
                </a>
              )}
              <a href={`https://www.google.com/search?q=${encodeURIComponent(f.name + ' ' + (f.area || '') + ' 観光')}&hl=ja`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1"
                style={{ color: '#FBF5E5', border: `1px solid #3A2E22`, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
                <Search size={10} strokeWidth={1.8} />調べる
              </a>
              {f.insta && (
                <a href={`https://instagram.com/${f.insta.replace(/^@/, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1"
                  style={{ color: '#FBF5E5', border: `1px solid #3A2E22`, fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>
                  <Instagram size={10} strokeWidth={1.8} />写真
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// ============ メインコンポーネント ============
export default function TripPlanner() {
  return (
    <FavProvider>
      <TripPlannerInner />
    </FavProvider>
  );
}

function TripPlannerInner() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [date, setDate]         = useState(todayStr);
  const [selected, setSelected] = useState(['food', 'art', 'beach', 'history']);
  const [mode, setMode]         = useState('plan');
  const [data, setData]         = useState(null);
  const [generating, setGenerating] = useState(false);
  const [openArea, setOpenArea] = useState(null);

  const dateObj = useMemo(() => new Date(date + 'T00:00'), [date]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const plan = generateOneDay(selected, dateObj);
      const discover = generateDiscover(selected, dateObj);
      setData({ plan, discover });
      setGenerating(false);
    }, 500);
  };

  // 初回マウント時に自動でプラン生成（旅程がすぐ見える状態にする）
  useEffect(() => {
    const plan = generateOneDay(selected, dateObj);
    const discover = generateDiscover(selected, dateObj);
    setData({ plan, discover });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: FONT_SANS, color: C.ink }}>

      {/* ============ ヘッダー（ロゴ + ナビ） ============ */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div>
          <div className="text-[11px] font-bold tracking-[0.3em]" style={{ color: C.accent, fontFamily: FONT_SERIF_EN, fontStyle: 'italic' }}>HELLO ! L.A.</div>
          <div className="text-[12px] mt-1" style={{ fontFamily: FONT_MINCHO, fontWeight: 500, color: C.ink, letterSpacing: '0.05em' }}>
            きょうはロサンゼルスで何をしよう？
          </div>
        </div>
        <button className="p-1.5" style={{ color: C.ink2 }}>
          <Menu size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative">
        {/* 大きな雰囲気のあるビジュアル */}
        <div className="relative" style={{ height: 460, background: 'linear-gradient(180deg, #1F2A4A 0%, #4A3A5C 18%, #B85540 38%, #E89055 56%, #F4C480 72%, #E8D4A8 100%)' }}>
          {/* 実写写真（背景） */}
          <img
            src="https://images.unsplash.com/photo-1459258350879-34886319a3c9?w=1600&q=70&auto=format&fit=crop"
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85,
            }}
          />
          {/* グラデオーバーレイ（テキスト読みやすく） */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(31,42,74,0.45) 0%, rgba(74,58,92,0.25) 30%, rgba(184,85,64,0.15) 55%, rgba(232,212,168,0.05) 100%)',
            }}
          />
          <svg viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" style={{ opacity: 0 }}>
            <defs>
              <linearGradient id="hSun" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FFE89E" stopOpacity="1"/>
                <stop offset="60%" stopColor="#FFCA28" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#FFCA28" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* 雲 */}
            <ellipse cx="60"  cy="50" rx="50" ry="3" fill="#FFF" opacity="0.35"/>
            <ellipse cx="320" cy="40" rx="40" ry="2.5" fill="#FFF" opacity="0.3"/>
            <ellipse cx="200" cy="70" rx="65" ry="2.5" fill="#FFF" opacity="0.25"/>
            <ellipse cx="120" cy="90" rx="40" ry="2" fill="#FFF" opacity="0.2"/>

            {/* 太陽 */}
            <circle cx="280" cy="200" r="80" fill="url(#hSun)"/>
            <circle cx="280" cy="200" r="38" fill="#FFE5A8" opacity="0.85"/>
            <circle cx="280" cy="200" r="26" fill="#FFD888"/>

            {/* 遠景の山（霞んだレイヤー） */}
            <path d="M0 290 L40 270 L80 285 L130 255 L180 280 L230 250 L280 275 L330 245 L380 270 L400 260 L400 295 L0 295 Z" fill="#5C5078" opacity="0.45"/>
            <path d="M0 305 L50 285 L100 300 L150 275 L210 295 L260 270 L320 290 L380 280 L400 285 L400 320 L0 320 Z" fill="#4A3A5C" opacity="0.55"/>
            <path d="M0 320 L60 300 L120 315 L180 290 L240 308 L300 285 L360 305 L400 295 L400 340 L0 340 Z" fill="#3A2A4C" opacity="0.7"/>

            {/* シティ・シルエット（遠景） */}
            <rect x="40" y="295" width="6" height="40" fill="#2A1F38"/>
            <rect x="48" y="290" width="8" height="45" fill="#2A1F38"/>
            <rect x="58" y="285" width="5" height="50" fill="#2A1F38"/>
            <rect x="65" y="278" width="9" height="57" fill="#2A1F38"/>
            <polygon points="65,278 69,272 74,278" fill="#2A1F38"/>
            <rect x="76" y="288" width="4" height="47" fill="#2A1F38"/>
            <rect x="82" y="295" width="7" height="40" fill="#2A1F38"/>
            <rect x="300" y="298" width="5" height="37" fill="#2A1F38"/>
            <rect x="307" y="292" width="8" height="43" fill="#2A1F38"/>
            <rect x="317" y="288" width="5" height="47" fill="#2A1F38"/>
            <rect x="324" y="295" width="7" height="40" fill="#2A1F38"/>

            {/* 椰子の木のシルエット（中景） */}
            <g>
              <rect x="55" y="335" width="2" height="80" fill="#1A1410"/>
              <ellipse cx="56" cy="335" rx="22" ry="3" fill="#1A1410" transform="rotate(-25 56 335)"/>
              <ellipse cx="56" cy="335" rx="22" ry="3" fill="#1A1410" transform="rotate(25 56 335)"/>
              <ellipse cx="56" cy="335" rx="22" ry="3" fill="#1A1410" transform="rotate(-70 56 335)"/>
              <ellipse cx="56" cy="335" rx="22" ry="3" fill="#1A1410" transform="rotate(70 56 335)"/>
              <ellipse cx="56" cy="335" rx="20" ry="2.5" fill="#1A1410" transform="rotate(-100 56 335)"/>
            </g>
            <g>
              <rect x="340" y="345" width="2" height="70" fill="#1A1410"/>
              <ellipse cx="341" cy="345" rx="20" ry="2.5" fill="#1A1410" transform="rotate(-25 341 345)"/>
              <ellipse cx="341" cy="345" rx="20" ry="2.5" fill="#1A1410" transform="rotate(25 341 345)"/>
              <ellipse cx="341" cy="345" rx="20" ry="2.5" fill="#1A1410" transform="rotate(-70 341 345)"/>
              <ellipse cx="341" cy="345" rx="20" ry="2.5" fill="#1A1410" transform="rotate(70 341 345)"/>
            </g>
            <g>
              <rect x="100" y="370" width="2" height="60" fill="#1A1410"/>
              <ellipse cx="101" cy="370" rx="16" ry="2" fill="#1A1410" transform="rotate(-25 101 370)"/>
              <ellipse cx="101" cy="370" rx="16" ry="2" fill="#1A1410" transform="rotate(25 101 370)"/>
              <ellipse cx="101" cy="370" rx="16" ry="2" fill="#1A1410" transform="rotate(-70 101 370)"/>
              <ellipse cx="101" cy="370" rx="16" ry="2" fill="#1A1410" transform="rotate(70 101 370)"/>
            </g>
            <g>
              <rect x="295" y="365" width="2" height="65" fill="#1A1410"/>
              <ellipse cx="296" cy="365" rx="18" ry="2" fill="#1A1410" transform="rotate(-25 296 365)"/>
              <ellipse cx="296" cy="365" rx="18" ry="2" fill="#1A1410" transform="rotate(25 296 365)"/>
              <ellipse cx="296" cy="365" rx="18" ry="2" fill="#1A1410" transform="rotate(-70 296 365)"/>
              <ellipse cx="296" cy="365" rx="18" ry="2" fill="#1A1410" transform="rotate(70 296 365)"/>
            </g>

            {/* ハイウェイのライン（道の遠近） */}
            <path d="M0 460 L150 380 L250 380 L400 460" fill="#2A1F1A" opacity="0.5"/>
            <line x1="200" y1="380" x2="200" y2="460" stroke="#FFD888" strokeWidth="0.6" strokeDasharray="3,4" opacity="0.6"/>
          </svg>

          {/* 上部の英語ラベル */}
          <div className="absolute top-6 left-0 right-0 text-center">
            <div className="text-[10px] font-bold tracking-[0.45em]" style={{ color: '#FBF5E5', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              ISSUE Nº 001 · {formatShortDate(dateObj)}
            </div>
          </div>

          {/* タイトル（縦書きっぽく中央配置） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <div style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 17, color: '#FBF5E5', letterSpacing: '0.3em', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                Today in
              </div>
              <div className="mt-1" style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 72, fontWeight: 400, color: '#FBF5E5', letterSpacing: '0.04em', lineHeight: 0.95, textShadow: '0 6px 24px rgba(0,0,0,0.35)' }}>
                L.A.
              </div>
              <div className="mt-6 text-[12px]" style={{ color: '#FBF5E5', fontFamily: FONT_MINCHO, fontWeight: 500, letterSpacing: '0.5em', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                光と影の街、今日。
              </div>
            </div>
          </div>
        </div>

        {/* 序文 */}
        <div className="px-8 py-10 text-center" style={{ background: C.bg }}>
          <p className="text-[12.5px] leading-[2.1]" style={{ color: C.ink2, letterSpacing: '0.08em' }}>
            太平洋に面した広大な街、ロサンゼルス。<br />
            アートと映画、海と山、移民の食文化が一つの一日に同居する。<br />
            その日その時にしか出会えない景色をご案内します。
          </p>
        </div>
      </section>

      {/* ============ 拠点情報 ============ */}
      <section className="px-6 py-8" style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, background: C.paper }}>
        <div className="text-[9px] font-bold tracking-[0.4em] mb-3" style={{ color: C.ink3 }}>YOUR BASE — 拠点</div>
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 flex items-center justify-center" style={{ background: C.ink, color: C.paper }}>
              <Home size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[18px] leading-tight" style={{ fontFamily: FONT_MINCHO, fontWeight: 500, color: C.ink, letterSpacing: '0.04em' }}>
              {HOME_BASE.name}
            </h3>
            <div className="text-[10px] mt-1" style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', color: C.ink3, letterSpacing: '0.1em' }}>
              {HOME_BASE.nameEn}
            </div>
            <div className="mt-3 text-[11px] leading-relaxed" style={{ color: C.ink2 }}>
              {HOME_BASE.address}<br />
              <span style={{ color: C.ink3 }}>{HOME_BASE.area}</span>
            </div>
          </div>
        </div>

        {/* リンク2種 */}
        <div className="mt-4 flex flex-col gap-2">
          <a
            href={HOME_BASE.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 py-2.5 px-3"
            style={{ border: `1px solid ${C.line}`, color: C.accent }}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
              <MapPin size={12} strokeWidth={1.8} />
              <span style={{ fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>Google Mapで場所を見る</span>
            </span>
            <ExternalLink size={11} strokeWidth={1.8} style={{ color: C.ink3 }} />
          </a>
          <a
            href={HOME_BASE.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 py-2.5 px-3"
            style={{ border: `1px solid ${C.line}`, color: C.sub }}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
              <Home size={12} strokeWidth={1.8} />
              <span style={{ fontFamily: FONT_SANS, letterSpacing: '0.05em' }}>拠点の画像を見る（Airbnb）</span>
            </span>
            <ExternalLink size={11} strokeWidth={1.8} style={{ color: C.ink3 }} />
          </a>
        </div>
      </section>

      {/* ============ お気に入り一覧（1件以上で表示） ============ */}
      <FavoritesSection />

      {/* ============ 使い方ガイド ============ */}
      <section className="px-6 py-10" style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }}>
        <div className="text-[9.5px] font-bold tracking-[0.4em] mb-2 flex items-center gap-2" style={{ color: C.accent }}>
          <Info size={12} strokeWidth={1.8} />
          <span>HOW TO USE — 使い方</span>
        </div>
        <p className="text-[11.5px] leading-[1.9] mb-5" style={{ color: C.ink2, letterSpacing: '0.03em' }}>
          日付と興味を選んで「Click Here！」を押すだけ。今日のロサンゼルスの楽しみ方を提案します。
        </p>
        <div className="space-y-3">
          {[
            { en: 'DATE',        jp: '日付をえらぶ',         desc: '「DATE」で訪れる日を選べます。' },
            { en: 'INTERESTS',   jp: '興味をえらぶ',         desc: '「INTERESTS」で見たいジャンル（グルメ・アート・ビーチなど）を選べます。複数選択OK。' },
            { en: 'Click Here！', jp: '検索をはじめる',       desc: '「Click Here！ワクワクをさがそう！」を押すと提案がはじまります。' },
            { en: 'PLAN',        jp: '1日の流れで見る',      desc: '「PLAN」は朝から夜までの1日の流れで組み立てて表示します。' },
            { en: 'DISCOVER',    jp: 'スポットを一覧で見る', desc: '「DISCOVER」は条件に合うスポットを一覧で並べて表示します。' },
            { en: 'LINKS',       jp: '詳しく調べる',         desc: '各スポットの「日本語で詳しく見る」はGoogle検索へ。公式サイトやSNSへのリンクも付いています。' },
            { en: 'AREAS',       jp: 'エリアを知る',         desc: '下部の「ロサンゼルスのかたち」を開くと、エリアごとの見どころスポットや関連記事・動画を掲載しています。' },
            { en: 'GUIDES',      jp: 'ガイドで深掘り',       desc: '最下部の「GUIDES — 日本語で読めるLAガイド」で、信頼できる日本語の情報サイトをまとめています。' },
            { en: 'PRICE',       jp: '料金はあくまで目安',   desc: '各スポットに表示される料金（$表記）は目安です。時期・メニュー・席種で変わるため、正確な料金は公式サイトでご確認ください。' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 pb-3" style={{ borderBottom: `1px dotted ${C.line}` }}>
              <span className="shrink-0 text-[9px] font-bold px-2 py-1 mt-0.5" style={{ background: C.ink, color: C.paper, fontFamily: FONT_SERIF_EN, fontStyle: 'italic', letterSpacing: '0.05em', minWidth: 64, textAlign: 'center' }}>
                {step.en}
              </span>
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: FONT_MINCHO, fontSize: 13, color: C.ink, fontWeight: 500, letterSpacing: '0.04em' }}>
                  {step.jp}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed" style={{ color: C.ink2 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TODAY / 入力 ============ */}
      <section className="pt-14 pb-10">
        <SectionLabel
          romaji="TODAY"
          jp="今日のロサンゼルスを楽しむ。"
          sub="訪問日と興味を選ぶと、その日に楽しめる場所と催しを提案します。"
        />

        <div className="px-6">
          {/* 日付 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px flex-1" style={{ background: C.line }} />
              <span className="text-[9.5px] font-bold tracking-[0.4em]" style={{ color: C.ink3 }}>DATE</span>
              <span className="h-px flex-1" style={{ background: C.line }} />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-center py-3 bg-transparent focus:outline-none"
              style={{
                fontFamily: FONT_MINCHO,
                fontSize: 18,
                color: C.ink,
                letterSpacing: '0.05em',
                borderTop: `1px solid ${C.line}`,
                borderBottom: `1px solid ${C.line}`,
                borderLeft: 'none',
                borderRight: 'none',
              }}
            />
            <div className="text-center text-[10px] mt-2" style={{ color: C.ink3, fontFamily: FONT_SERIF_EN, fontStyle: 'italic', letterSpacing: '0.1em' }}>
              {formatJPDate(dateObj)}
            </div>
          </div>

          {/* 興味 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px flex-1" style={{ background: C.line }} />
              <span className="text-[9.5px] font-bold tracking-[0.4em]" style={{ color: C.ink3 }}>INTERESTS</span>
              <span className="h-px flex-1" style={{ background: C.line }} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {INTERESTS.map(i => {
                const active = selected.includes(i.id);
                return (
                  <button
                    key={i.id}
                    onClick={() => toggle(i.id)}
                    className="px-4 py-2 transition-all"
                    style={{
                      background: active ? C.ink : 'transparent',
                      color: active ? C.paper : C.ink2,
                      border: `1px solid ${active ? C.ink : C.line}`,
                      fontFamily: FONT_MINCHO,
                      fontSize: 13,
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                    }}
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
            <div className="text-center text-[10px] mt-3" style={{ color: C.ink3, letterSpacing: '0.08em' }}>
              {selected.length}つ選択中
            </div>
          </div>

          {/* モード */}
          <div className="mb-8">
            <ModeToggle mode={mode} onChange={setMode} />
            <div className="text-center text-[10.5px] mt-3" style={{ color: C.ink3, letterSpacing: '0.06em' }}>
              {mode === 'plan' ? '朝から夜までの時系列で組み立てる' : 'その日に開いている場所と催しを発見する'}
            </div>
          </div>

          {/* 生成ボタン */}
          <button
            onClick={generate}
            disabled={generating}
            className="w-full py-4 transition-all flex items-center justify-center gap-3"
            style={{
              background: C.ink,
              color: C.paper,
              fontFamily: FONT_MINCHO,
              fontSize: 14,
              letterSpacing: '0.2em',
              fontWeight: 500,
              opacity: generating ? 0.6 : 1,
            }}
          >
            <span>{generating ? '読み込み中…' : (data ? 'もう一度さがす（別のプラン）' : 'Click Here！ワクワクをさがそう！')}</span>
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
          <div className="text-center text-[9.5px] mt-3 font-bold tracking-[0.3em]" style={{ color: C.ink3, fontFamily: FONT_SERIF_EN, fontStyle: 'italic' }}>
            SHOW MY PLAN
          </div>
        </div>
      </section>

      {/* ============ 結果セクション ============ */}
      {data && (
        <>
          {/* 帯：セクション区切り */}
          <div className="h-24 relative overflow-hidden" style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
            <PhotoBelt />
          </div>

          {mode === 'plan' && (
            <section className="pt-14 pb-6" style={{ background: C.bg }}>
              <SectionLabel
                romaji="YOUR PLAN — 自動で作ったプラン"
                jp="あなたの一日のプラン。"
                sub={`${formatJPDate(dateObj)}、${data.plan.slots.filter(s => !s.act.skip).length}の場所をめぐるプランです。下のボタンで別のプランに、上のトグルで「発見」モードに切り替えられます。`}
              />

              {data.plan.themePark && (
                <div className="mx-6 mb-6 p-4 text-center" style={{ background: C.paper, border: `1px solid ${C.gold}` }}>
                  <div className="text-[10px] font-bold tracking-[0.3em] mb-1" style={{ color: C.gold }}>SPECIAL DAY</div>
                  <div className="text-[12px]" style={{ color: C.ink2 }}>テーマパーク終日のため、午前と午後を統合しました。</div>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${C.line}` }}>
                {data.plan.slots.map((slot, i) => (
                  <ArticleCard key={i} idx={i} slot={slot} />
                ))}
              </div>

              {/* 再生成CTA */}
              <div className="px-6 mt-6">
                <button
                  onClick={generate}
                  disabled={generating}
                  className="w-full py-3.5 transition-all flex items-center justify-center gap-3"
                  style={{
                    background: 'transparent',
                    color: C.accent,
                    fontFamily: FONT_MINCHO,
                    fontSize: 13,
                    letterSpacing: '0.2em',
                    fontWeight: 500,
                    border: `1px solid ${C.accent}`,
                    opacity: generating ? 0.5 : 1,
                  }}
                >
                  <Sparkles size={13} strokeWidth={1.5} />
                  <span>{generating ? '読み込み中…' : '別のプランやスポットを見る'}</span>
                </button>
              </div>
            </section>
          )}

          {mode === 'discover' && (
            <>
              {/* イベント */}
              <section className="pt-14 pb-6">
                <SectionLabel
                  romaji="TONIGHT"
                  jp="今夜の催し。"
                  sub={`${formatJPDate(dateObj)}に開催されるイベントを集めました。`}
                />
                <div style={{ borderTop: `1px solid ${C.line}` }}>
                  {data.discover.events.map((ev, i) => (
                    <EventArticle key={i} ev={ev} idx={i} />
                  ))}
                </div>
              </section>

              {/* スポット */}
              <section className="pt-14 pb-6" style={{ background: C.paper }}>
                <SectionLabel
                  romaji="DISCOVER"
                  jp="今日のロサンゼルス、おすすめ。"
                  sub={`営業中・予約可能な、選りすぐりの${data.discover.spots.length}の場所。`}
                />
                <div style={{ borderTop: `1px solid ${C.line}` }}>
                  {data.discover.spots.slice(0, 12).map((act, i) => (
                    <SpotArticle key={i} act={act} idx={i} />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

      {/* ============ AREAS ============ */}
      <section className="pt-14 pb-6 mt-6" style={{ borderTop: `1px solid ${C.line}`, background: C.bg }}>
        <SectionLabel
          romaji="AREAS"
          jp="ロサンゼルスのかたち。"
          sub="広大な街は、いくつもの個性ある地域から成る。番号を選ぶと、そのエリアの見どころと深い情報が開きます。"
        />
        <div style={{ borderTop: `1px solid ${C.line}` }}>
          {AREAS.map((area, i) => (
            <AreaCard
              key={area.en}
              area={area}
              idx={i}
              isOpen={openArea === area.en}
              onToggle={() => setOpenArea(openArea === area.en ? null : area.en)}
            />
          ))}
        </div>
      </section>


      {/* ============ ABOUT ============ */}
      <section className="pt-14 pb-10 px-8" style={{ background: C.ink, color: C.paper }}>
        <div className="text-center">
          <div className="inline-flex items-center gap-3" style={{ color: C.ochre }}>
            <span className="block h-px w-6" style={{ background: C.ochre }} />
            <span className="text-[10px] font-bold tracking-[0.35em]">ABOUT</span>
            <span className="block h-px w-6" style={{ background: C.ochre }} />
          </div>
          <h2 className="mt-4 text-[22px] leading-relaxed" style={{ fontFamily: FONT_MINCHO, fontWeight: 500, color: C.paper, letterSpacing: '0.08em' }}>
            この街の、<br/>その日の表情を。
          </h2>
          <p className="mt-6 text-[12px] leading-[2]" style={{ color: '#D9CCB0', letterSpacing: '0.06em' }}>
            ロサンゼルスは広い。<br/>
            朝のビーチと夜のコンサートが同居する街で、<br/>
            あなたの「今日」に合う風景を集めました。
          </p>
        </div>
      </section>

      {/* ============ 写真の帯 ============ */}
      <div style={{ background: C.bg }}>
        <PhotoBelt />
      </div>

      {/* ============ LA INFO：基本データ ============ */}
      <section className="pt-14 pb-10" style={{ background: C.bg, borderTop: `1px solid ${C.line}` }}>
        <SectionLabel
          romaji="LA INFO"
          jp="ロサンゼルスの基本。"
          sub="旅をはじめる前に知っておきたい、街の輪郭。"
        />

        {/* 基本データ：表形式 */}
        <div className="px-6 mb-12">
          <div className="text-[9.5px] font-bold tracking-[0.4em] mb-4 pb-2" style={{ color: C.accent, borderBottom: `1px solid ${C.accent}` }}>
            BASICS — はじめに
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {LA_INFO.basics.map((b, i) => (
              <div key={i} className="pb-3" style={{ borderBottom: `1px dotted ${C.line}` }}>
                <div className="text-[10px] tracking-[0.2em]" style={{ color: C.ink3, fontFamily: FONT_SANS }}>
                  {b.label.toUpperCase()} — {b.label}
                </div>
                <div className="mt-1" style={{ fontFamily: FONT_MINCHO, fontSize: 18, color: C.ink, fontWeight: 500, letterSpacing: '0.05em' }}>
                  {b.value}
                </div>
                <div className="mt-0.5 text-[10px] leading-relaxed" style={{ color: C.ink2 }}>
                  {b.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 気候 */}
        <div className="px-6 mb-12">
          <div className="text-[9.5px] font-bold tracking-[0.4em] mb-4 pb-2 flex items-center gap-2" style={{ color: C.accent, borderBottom: `1px solid ${C.accent}` }}>
            <CloudSun size={12} strokeWidth={1.8} />
            <span>WEATHER — 季節と気温</span>
          </div>
          <div className="space-y-4">
            {LA_INFO.weather.map((w, i) => (
              <div key={i} className="flex gap-4 pb-3" style={{ borderBottom: `1px dotted ${C.line}` }}>
                <div className="shrink-0 w-20">
                  <div style={{ fontFamily: FONT_MINCHO, fontSize: 13, color: C.ink, fontWeight: 500, letterSpacing: '0.05em' }}>
                    {w.season}
                  </div>
                  <div className="text-[11px] mt-1" style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', color: C.accent, fontWeight: 700 }}>
                    {w.temp}
                  </div>
                </div>
                <div className="flex-1 text-[11px] leading-[1.85]" style={{ color: C.ink2 }}>
                  {w.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 移動手段 */}
        <div className="px-6 mb-12">
          <div className="text-[9.5px] font-bold tracking-[0.4em] mb-4 pb-2 flex items-center gap-2" style={{ color: C.accent, borderBottom: `1px solid ${C.accent}` }}>
            <Train size={12} strokeWidth={1.8} />
            <span>TRANSPORT — 街の歩き方</span>
          </div>
          <div className="space-y-5">
            {LA_INFO.transport.map((t, i) => (
              <div key={i} className="pb-4" style={{ borderBottom: `1px dotted ${C.line}` }}>
                <div className="flex items-baseline gap-3">
                  <span style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 16, color: C.accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: FONT_MINCHO, fontSize: 15, color: C.ink, fontWeight: 500, letterSpacing: '0.05em' }}>
                    {t.name}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-[1.85]" style={{ color: C.ink2 }}>
                  {t.desc}
                </p>
                <div className="mt-2 flex gap-3 text-[10px]" style={{ color: C.ink3, fontFamily: FONT_SANS }}>
                  <span className="inline-flex items-center gap-1">
                    <span style={{ color: C.moss, fontWeight: 700 }}>＋</span>{t.pros}
                  </span>
                  <span style={{ color: C.line }}>·</span>
                  <span className="inline-flex items-center gap-1">
                    <span style={{ color: C.accent, fontWeight: 700 }}>−</span>{t.cons}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 旅のヒント */}
        <div className="px-6 mb-12">
          <div className="text-[9.5px] font-bold tracking-[0.4em] mb-4 pb-2 flex items-center gap-2" style={{ color: C.accent, borderBottom: `1px solid ${C.accent}` }}>
            <Info size={12} strokeWidth={1.8} />
            <span>TIPS — 旅のヒント</span>
          </div>
          <div className="space-y-5">
            {LA_INFO.tips.map((t, i) => (
              <div key={i} className="pb-4" style={{ borderBottom: `1px dotted ${C.line}` }}>
                <h4 className="mb-2" style={{ fontFamily: FONT_MINCHO, fontSize: 14, color: C.ink, fontWeight: 500, letterSpacing: '0.05em' }}>
                  {t.title}
                </h4>
                <p className="text-[11px] leading-[1.9]" style={{ color: C.ink2 }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 日本語ガイドサイト集 */}
        <div className="px-6">
          <div className="text-[9.5px] font-bold tracking-[0.4em] mb-4 pb-2 flex items-center gap-2" style={{ color: C.accent, borderBottom: `1px solid ${C.accent}` }}>
            <BookOpen size={12} strokeWidth={1.8} />
            <span>GUIDES — 日本語で読めるLAガイド</span>
          </div>
          <p className="text-[11px] leading-[1.9] mb-5" style={{ color: C.ink2, letterSpacing: '0.05em' }}>
            旅の計画やもっと深く調べたいときに役立つ、日本語のロサンゼルス情報サイト集。
          </p>
          <div className="space-y-3.5">
            {LA_INFO.japaneseGuides.map((g, i) => (
              <a
                key={i}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-4 transition-colors"
                style={{ background: C.paper, border: `1px solid ${C.line}` }}
              >
                <div className="flex items-start gap-3">
                  <span style={{ fontFamily: FONT_SERIF_EN, fontStyle: 'italic', fontSize: 14, color: C.accent, minWidth: 22 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontFamily: FONT_MINCHO, fontSize: 13.5, color: C.ink, fontWeight: 500, letterSpacing: '0.04em' }}>
                        {g.name}
                      </span>
                      <ExternalLink size={10} strokeWidth={1.8} style={{ color: C.ink3 }} />
                    </div>
                    <div className="mt-1 text-[10.5px] leading-relaxed" style={{ color: C.ink2 }}>
                      {g.desc}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 出典 */}
        <div className="px-6 mt-10 text-center">
          <div className="inline-block px-3 py-1 text-[9px] tracking-[0.3em]" style={{ color: C.ink3, border: `1px solid ${C.line}` }}>
            INFORMATION CURATED FOR YOUR TRIP
          </div>
          <div className="mt-4 text-[10px]" style={{ color: C.ink3, letterSpacing: '0.05em' }}>
            最新の運行・営業情報は各公式サイトをご確認ください。
          </div>
        </div>
      </section>

    </div>
  );
}
