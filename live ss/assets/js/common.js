/* LiveSight — مكونات مشتركة: صدفة، مودال، قفل، أيقونات */
const IC = {
  dashboard:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  tasks:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  available:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 4"/></svg>',
  requests:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h10M4 17h7"/></svg>',
  map:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3 3.5 5.5v15L9 18l6 2.5 5.5-2.5v-15L15 5.5 9 3z"/><path d="M9 3v15M15 5.5v15"/></svg>',
  chats:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  wallet:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/></svg>',
  profile:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c.5-4 3.5-6 8-6s7.5 2 8 6"/></svg>',
  notifications:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  help:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.3 9a3 3 0 0 1 5.9 1c0 2-3 2.5-3 4"/><circle cx="12" cy="17.2" r=".8" fill="currentColor"/></svg>',
  watch:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m12 3 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/></svg>',
  bell:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/></svg>',
  plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  logout:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  pin:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  walletIc:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/></svg>',
  users:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  flag:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4m0 0h11l-2 3 2 3H4"/></svg>',
  grid:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
  locationIc:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  coins:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c-.5-1-1.5-1.5-3-1.5-1.5 0-2.5.7-2.5 1.9 0 2.8 5.5 1.4 5.5 4.2 0 1.2-1 1.9-2.5 1.9-1.5 0-2.6-.6-3-1.6"/></svg>',
  star:'<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg>',
  shield:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  logBook:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 3h13a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4z"/><path d="M8 7h6M8 12h6"/></svg>',
  gear:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="m5 13 4 4L19 7"/></svg>',
  copy:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  qr:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M20 14v.01M14 20h.01M17 20h3v-3"/></svg>',
  img:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  pen:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trend:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  send:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
  mail:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  chev:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  lock:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  timeline:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.9 5 8 8M16 16l3.1 3M2 12h4M18 12h4"/><circle cx="12" cy="12" r="3"/></svg>',
  back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  categories:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
  wilayas:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  transactions:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 7H7M7 7l3-3M7 7l3 3M7 17h10M17 17l-3-3M17 17l-3 3"/></svg>',
  ratings:'<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg>',
  settings:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  eye:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  box:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v7"/></svg>',
  van:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 7h12v9H1z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="5.5" cy="18" r="1.7"/><circle cx="17.5" cy="18" r="1.7"/></svg>',
  truck:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h13v10H1z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="18" cy="18.5" r="1.8"/><path d="M9 6v4H1"/></svg>',
  broom:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 2 11 11M20 2l-4.5 1 3.5 3.5L21 6.5zM17 16l-9-9M15 18l1.5-1.5M10 21l2-2M13 18l1-1"/></svg>',
  wrench:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  bolt:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>',
  droplet:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  megaphone:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10v4a1 1 0 0 0 1 1h2l4 4V5L6 9H4a1 1 0 0 0-1 1z"/><path d="M14 8v8a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3z"/><path d="M17 8a3 3 0 0 1 0 8"/></svg>',
  clipboard:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/></svg>',
  camera:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  flask:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7L4 19a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 19L14 9V2"/><path d="M8 2h8M7.5 14h9"/></svg>',
  roller:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="11" height="6" rx="1.5"/><path d="M18 6.5h2a2 2 0 0 1 2 2v1"/><rect x="17" y="11" width="4" height="4" rx="1"/><path d="M19 15v5"/></svg>',
  leaf:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8A10 7 0 0 1 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  sparkle:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 14l.9 2.3 2.3.9-2.3.9L19 20.4l-.9-2.3-2.3-.9 2.3-.9z"/></svg>',
  award:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H3v2a3 3 0 0 0 3 3h1M17 5h4v2a3 3 0 0 1-3 3h-1"/></svg>',
  diamond:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9.5 9 12 21M14.5 9 12 21"/></svg>',
  trash:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>',
  folder:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  tag:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 11 3H4v7l10.4 10.6a2 2 0 0 0 2.8 0l3.4-3.4a2 2 0 0 0 0-2.8z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
  moon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
};
const ICONS=IC;

const Layout = {
  crumb(el){ const c=document.getElementById('crumb'); if(c && el) c.textContent=el; },
  markNav(route, role){
    document.querySelectorAll('[data-route]').forEach(a=>{
      const base=a.getAttribute('data-route').split('/')[0];
      const active = route===a.getAttribute('data-route') || route===base || a.getAttribute('data-route').startsWith(route+'/');
      a.classList.toggle('active', active);
    });
    document.querySelectorAll('[data-route-param]').forEach(a=>{
      const cp=a.getAttribute('data-route-param').toString();
      a.classList.toggle('active', cp===route);
    });
  },
  refreshBadges(){
    const s=Auth.current(); if(!s) return;
    const db=Store.db();
    const n=(db.notifs||[]).filter(x=>x.user===s.userId && !x.read).length;
    document.querySelectorAll('[data-notif-badge]').forEach(el=>{ el.textContent=n>99?'99+':n; el.style.display=n? 'flex':'none'; });
    document.querySelectorAll('[data-notif-target]').forEach(el=>{ el.setAttribute('href', el.getAttribute('data-notif-target')); });
    const unreadChats=(db.chats||[]).filter(c=>c.participants.includes(s.userId) && c.messages && c.messages.some(m=>m.from!==s.userId && !m.read)).length;
    document.querySelectorAll('[data-chat-badge]').forEach(el=>{ el.textContent=unreadChats; el.style.display=unreadChats?'flex':'none'; });
  },
  mountSidebar(role){
    document.querySelectorAll('[data-ic]').forEach(i=>{ const k=i.getAttribute('data-ic'); if(IC[k]) i.innerHTML=IC[k]; });
    document.querySelectorAll('[data-route]').forEach(a=>{
      a.addEventListener('click',()=>{
        document.querySelectorAll('.sidebar,.admin-side').forEach(s=>s.classList.remove('open'));
      });
    });
    document.querySelectorAll('[data-burger]').forEach(b=>{
      b.addEventListener('click',()=>{
        if(role==='admin'){ document.querySelector('.admin-side').classList.toggle('open'); }
        else { document.querySelector('.sidebar').classList.toggle('open'); }
      });
    });
    document.querySelectorAll('[data-logout]').forEach(b=>{
      b.addEventListener('click',()=>{
        Modal.confirm(I18n.t('logout'), I18n.t('logoutSure'), I18n.t('logout'), 'danger').then(ok=>{ if(ok) Auth.logout(); });
      });
    });
  },
  onLang(){
    const el=document.getElementById('view'); if(!el) return;
    const raw=Router.current(); el.innerHTML=''; Router.run();
  }
};

const Modal = {
  _overlay:null, _resolve:null,
  ensure(){
    if(this._overlay) return this._overlay;
    const o=document.createElement('div'); o.className='overlay';
    o.addEventListener('click', e=>{
      if(e.target===o){
        if(this._resolve){ const r=this._resolve; this._resolve=null; this.close(); r(null); }
        else this.close();
      }
    });
    document.body.appendChild(o); this._overlay=o; return o;
  },
  open(html, wide){
    const o=this.ensure();
    o.innerHTML=`<div class="modal ${wide?'wide':''}"><button class="mclose" data-mclose>✕</button>${html}</div>`;
    o.classList.add('show');
    o.querySelectorAll('[data-mclose]').forEach(b=>b.addEventListener('click',()=>this.close(null)));
    return o;
  },
  close(){ const o=this.ensure(); o.classList.remove('show'); o.innerHTML=''; },
  _cancel(){ if(this._resolve){ this._resolve(null); this._resolve=null; } },
  confirm(title, text, label, kind){
    this._resolve=null;
    const o=this.open(`
      <h3>${Helpers.esc(title)}</h3>
      <p class="msub">${Helpers.esc(text)}</p>
      <div class="flex between" style="justify-content:flex-end">
        <button class="btn line" data-cn>${I18n.t('cancel')}</button>
        <button class="btn ${kind==='danger'?'danger':''}" data-ok>${Helpers.esc(label||I18n.t('confirm'))}</button>
      </div>`);
    return new Promise(res=>{ this._resolve=res;
      o.querySelector('[data-ok]').addEventListener('click',()=>{ const r=res; this.close(); r(true); });
      o.querySelector('[data-cn]').addEventListener('click',()=>{ const r=res; this.close(); r(false); });
      o.addEventListener('click', e=>{ if(e.target.classList.contains('mclose')){ const r=res; r(false);} });
    });
  },
  prompt(title, sub, fieldsHtml, submitLabel){
    this._resolve=null;
    const o=this.open(`<h3>${Helpers.esc(title)}</h3><p class="msub">${Helpers.esc(sub||'')}</p>${fieldsHtml}
      <div class="flex between mt" style="justify-content:flex-end">
        <button class="btn line" data-cn>${I18n.t('cancel')}</button>
        <button class="btn" data-ok>${Helpers.esc(submitLabel||I18n.t('save'))}</button>
      </div>`);
    return new Promise(res=>{ this._resolve=res;
      const out=()=>{ const vals={}; o.querySelectorAll('[data-val]').forEach(el=>vals[el.getAttribute('data-val')]=el.value); const r=res; this.close(); r(vals); };
      o.querySelector('[data-ok]').addEventListener('click',out);
      o.querySelector('[data-cn]').addEventListener('click',()=>{ const r=res; this.close(); r(null); });
      o.addEventListener('click', e=>{ if(e.target.classList.contains('mclose')){ const r=res; r(null);} });
    });
  }
};

const LockScreen = {
  _el:null, _pin:'',
  ensure(){
    if(this._el) return this._el;
    const el=document.createElement('div'); el.className='lock-screen'; el.id='lockScr';
    el.innerHTML=`
      <div class="logo"><img src="assets/img/logo.png" alt=""><span class="name"><b>Live</b>Sight</span></div>
      <div class="muted small" data-i18n="lockedMsg">${I18n.t('lockedMsg')}</div>
      <div class="lock-pins" id="pins"><span></span><span></span><span></span><span></span></div>
      <div class="lock-pad" id="pad" dir="ltr">
        <button data-n="1">1</button><button data-n="2">2</button><button data-n="3">3</button>
        <button data-n="4">4</button><button data-n="5">5</button><button data-n="6">6</button>
        <button data-n="7">7</button><button data-n="8">8</button><button data-n="9">9</button>
        <button data-n="">⌫</button><button data-n="0">0</button><button data-n="go">↵</button>
      </div>`;
    document.body.appendChild(el); this._el=el;
    el.querySelectorAll('[data-n]').forEach(b=>b.addEventListener('click',()=>this.press(b.getAttribute('data-n'))));
    return el;
  },
  press(n){
    if(n===''){ this._pin=this._pin.slice(0,-1); }
    else if(n==='go'){ this.submit(); return; }
    else { if(this._pin.length>=4) return; this._pin+=n; }
    this.render();
    if(this._pin.length===4) setTimeout(()=>this.submit(), 120);
  },
  render(){
    const el=document.getElementById('pins');
    if(!el) return;
    el.innerHTML=[0,1,2,3].map(i=>`<span class="${i<this._pin.length?'fill':''}"></span>`).join('');
  },
  submit(){
    const s=Auth.current(); const cfg=Store.read('ls_prefs',{});
    if(!cfg.pin){ Auth.setLock(false); this._pin=''; this.render(); Toast.show(I18n.t('setPinFirst'),'warn'); return; }
    if(this._pin===String(cfg.pin)){ Auth.setLock(false); Auth.touch(); this._pin=''; this.render(); this._el.classList.remove('show'); }
    else { this._pin=''; this.render(); Toast.show(I18n.t('wrongPin'),'err'); }
  },
  check(){
    if(Auth.isLocked()){
      const el=this.ensure(); el.classList.add('show');
    }
  }
};

window.ICONS=ICONS; window.Layout=Layout; window.Modal=Modal; window.LockScreen=LockScreen;

document.addEventListener('click', e=>{
  const a=e.target.closest('[data-route]');
  if(a){ e.preventDefault(); Router.go(a.getAttribute('data-route')); }
});
document.addEventListener('click',()=>{ if(Auth.current()) Auth.touch(); });
document.addEventListener('keydown',()=>{ if(Auth.current()) Auth.touch(); });