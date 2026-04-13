import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS & HELPERS ───
const STORES = [
  { id: "novo_atacarejo", name: "Novo Atacarejo", short: "Atacarejo", color: "#E63946", emoji: "🏪" },
  { id: "assai", name: "Assaí Atacadista", short: "Assaí", color: "#F4A100", emoji: "🛒" },
  { id: "atacadao", name: "Atacadão", short: "Atacadão", color: "#1D3557", emoji: "🏬" },
];

const DEFAULT_AISLES = {
  novo_atacarejo: [
    { id: 1, name: "Corredor 1", keywords: ["refrigerante", "suco", "água", "cerveja", "destilado", "vinho", "bebida", "energético"] },
    { id: 2, name: "Corredor 2", keywords: ["arroz", "feijão", "macarrão", "farinha", "açúcar", "sal", "óleo", "azeite", "grão"] },
    { id: 3, name: "Corredor 3", keywords: ["biscoito", "bolacha", "chocolate", "doce", "bala", "bombom", "snack", "salgadinho"] },
    { id: 4, name: "Corredor 4", keywords: ["leite", "iogurte", "queijo", "manteiga", "creme", "requeijão", "nata", "lácteo"] },
    { id: 5, name: "Corredor 5", keywords: ["carne", "frango", "peixe", "linguiça", "salsicha", "presunto", "mortadela", "bacon"] },
    { id: 6, name: "Corredor 6", keywords: ["sabão", "detergente", "desinfetante", "água sanitária", "amaciante", "esponja", "limpeza"] },
    { id: 7, name: "Corredor 7", keywords: ["shampoo", "condicionador", "sabonete", "pasta de dente", "escova", "desodorante", "papel higiênico", "higiene"] },
    { id: 8, name: "Corredor 8", keywords: ["descartável", "copo", "prato", "guardanapo", "festa", "vela", "balão", "toalha"] },
  ],
  assai: [
    { id: 1, name: "Corredor 1", keywords: ["arroz", "feijão", "macarrão", "farinha", "açúcar", "sal", "óleo", "grão"] },
    { id: 2, name: "Corredor 2", keywords: ["biscoito", "bolacha", "chocolate", "doce", "bala", "snack", "salgadinho"] },
    { id: 3, name: "Corredor 3", keywords: ["refrigerante", "suco", "água", "cerveja", "destilado", "vinho", "bebida"] },
    { id: 4, name: "Corredor 4", keywords: ["leite", "iogurte", "queijo", "manteiga", "creme", "requeijão", "lácteo"] },
    { id: 5, name: "Corredor 5", keywords: ["carne", "frango", "peixe", "linguiça", "salsicha", "presunto", "bacon"] },
    { id: 6, name: "Corredor 6", keywords: ["sabão", "detergente", "desinfetante", "amaciante", "esponja", "limpeza"] },
    { id: 7, name: "Corredor 7", keywords: ["shampoo", "sabonete", "pasta de dente", "desodorante", "papel higiênico", "higiene"] },
    { id: 8, name: "Corredor 8", keywords: ["descartável", "copo", "prato", "guardanapo", "festa", "toalha"] },
  ],
  atacadao: [
    { id: 1, name: "Corredor 1", keywords: ["sabão", "detergente", "desinfetante", "amaciante", "limpeza", "esponja"] },
    { id: 2, name: "Corredor 2", keywords: ["shampoo", "sabonete", "pasta de dente", "desodorante", "papel higiênico", "higiene"] },
    { id: 3, name: "Corredor 3", keywords: ["arroz", "feijão", "macarrão", "farinha", "açúcar", "sal", "óleo", "grão"] },
    { id: 4, name: "Corredor 4", keywords: ["biscoito", "bolacha", "chocolate", "doce", "salgadinho", "snack"] },
    { id: 5, name: "Corredor 5", keywords: ["refrigerante", "suco", "água", "cerveja", "destilado", "bebida"] },
    { id: 6, name: "Corredor 6", keywords: ["leite", "iogurte", "queijo", "manteiga", "creme", "requeijão", "lácteo"] },
    { id: 7, name: "Corredor 7", keywords: ["carne", "frango", "peixe", "linguiça", "salsicha", "presunto", "bacon"] },
    { id: 8, name: "Corredor 8", keywords: ["descartável", "copo", "prato", "guardanapo", "festa", "toalha"] },
  ],
};

const UNIT_MAP = {
  kg: "kg", kilo: "kg", kilos: "kg", quilos: "kg", quilo: "kg",
  g: "g", gramas: "g", grama: "g",
  l: "L", litro: "L", litros: "L",
  ml: "ml",
  un: "Un", unidade: "Un", unidades: "Un",
  pacote: "Pct", pacotes: "Pct", pct: "Pct",
  cx: "Cx", caixa: "Cx", caixas: "Cx",
  lata: "Lata", latas: "Lata",
  garrafa: "Grf", garrafas: "Grf", grf: "Grf",
  dz: "Dz", duzia: "Dz", duzias: "Dz", dúzia: "Dz", dúzias: "Dz",
  fardo: "Fardo", fardos: "Fardo",
  saco: "Saco", sacos: "Saco",
  bandeja: "Bandeja", bandejas: "Bandeja",
};

function parseItem(raw) {
  let text = raw.trim();
  if (!text) return null;

  let qty = "";
  let unit = "";
  let name = text;
  let match;

  // Pattern: "2kg Feijão" or "2 kg Feijão"
  match = text.match(/^(\d+[\.,]?\d*)\s*(kg|g|l|ml|un|unidade|unidades|pacote|pacotes|pct|cx|caixa|caixas|lata|latas|garrafa|garrafas|grf|dz|duzia|duzias|dúzia|dúzias|fardo|fardos|saco|sacos|bandeja|bandejas|litro|litros|kilo|kilos|quilos?|gramas?)\s+(.+)/i);
  if (match) {
    qty = match[1].replace(",", ".");
    unit = UNIT_MAP[match[2].toLowerCase()] || match[2];
    name = match[3];
  } else {
    // Pattern: "2 Feijão" (just number)
    match = text.match(/^(\d+)\s+(.+)/);
    if (match) {
      qty = match[1];
      name = match[2];
      // Check if item name ends with unit: "Feijão 2kg"
    } else {
      // Pattern: "Feijão carioca 2kg" or "Feijão 500g"
      match = text.match(/^(.+?)\s+(\d+[\.,]?\d*)\s*(kg|g|l|ml|un|unidade|unidades|pacote|pacotes|pct|cx|caixa|caixas|lata|latas|garrafa|garrafas|grf|dz|duzia|duzias|dúzia|dúzias|fardo|fardos|saco|sacos|bandeja|bandejas|litro|litros|kilo|kilos|quilos?|gramas?)$/i);
      if (match) {
        name = match[1];
        qty = match[2].replace(",", ".");
        unit = UNIT_MAP[match[3].toLowerCase()] || match[3];
      }
    }
  }

  if (!unit && !qty) qty = "1";
  if (!unit && qty) unit = "Un";

  // Capitalize each word
  name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

  return { qty, unit, name };
}

function findAisle(itemName, aisles) {
  const lower = itemName.toLowerCase();
  for (const aisle of aisles) {
    for (const kw of aisle.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return aisle;
      }
    }
  }
  return { id: 999, name: "Outros", keywords: [] };
}

// ─── MATRIX RAIN COMPONENT ───
function MatrixRain({ active, onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789FEIRAPLUS+";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    let frameCount = 0;
    const maxFrames = 45;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00FF41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.9 ? "#FFFFFF" : `rgba(0, 255, 65, ${0.5 + Math.random() * 0.5})`;
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      frameCount++;
      if (frameCount < maxFrames) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        if (onComplete) onComplete();
      }
    }
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active, onComplete]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      zIndex: 9999, pointerEvents: "none",
    }} />
  );
}

// ─── GREEN DEAL ICON ───
function DealIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#22C55E" />
      <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">$</text>
    </svg>
  );
}

// ─── MAIN APP ───
export default function FeiraPlus() {
  const [screen, setScreen] = useState("splash");
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [maisEmConta, setMaisEmConta] = useState(false);
  const [aisleConfig, setAisleConfig] = useState(DEFAULT_AISLES);
  const [history, setHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [pendingScreen, setPendingScreen] = useState(null);
  const [settingsStore, setSettingsStore] = useState("novo_atacarejo");
  const [editAisle, setEditAisle] = useState(null);
  const [editAisleName, setEditAisleName] = useState("");
  const [editAisleKeywords, setEditAisleKeywords] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);
  const inputRef = useRef(null);

  // Load data from storage
  useEffect(() => {
    (async () => {
      try {
        const h = await window.storage.get("feira-history");
        if (h) setHistory(JSON.parse(h.value));
      } catch {}
      try {
        const c = await window.storage.get("feira-aisles");
        if (c) setAisleConfig(JSON.parse(c.value));
      } catch {}
    })();
    // Splash timer
    const t = setTimeout(() => navigateTo("storeSelect"), 2200);
    return () => clearTimeout(t);
  }, []);

  // Save history
  const saveHistory = useCallback(async (newHistory) => {
    try { await window.storage.set("feira-history", JSON.stringify(newHistory)); } catch {}
  }, []);

  // Save aisle config
  const saveAisles = useCallback(async (newConfig) => {
    try { await window.storage.set("feira-aisles", JSON.stringify(newConfig)); } catch {}
  }, []);

  // Navigate with matrix transition
  const navigateTo = useCallback((target) => {
    setPendingScreen(target);
    setMatrixActive(true);
  }, []);

  const onMatrixComplete = useCallback(() => {
    setMatrixActive(false);
    if (pendingScreen) {
      setScreen(pendingScreen);
      setPendingScreen(null);
    }
  }, [pendingScreen]);

  // Add item
  const addItem = () => {
    const parsed = parseItem(input);
    if (!parsed) return;
    const aisles = aisleConfig[store?.id] || [];
    const aisle = findAisle(parsed.name, aisles);
    const newItem = {
      id: Date.now(),
      ...parsed,
      aisle: aisle.name,
      aisleId: aisle.id,
      maisEmConta,
    };
    setItems(prev => [...prev, newItem].sort((a, b) => a.aisleId - b.aisleId));
    // Save to history
    const lower = parsed.name.toLowerCase();
    if (!history.find(h => h.toLowerCase() === lower)) {
      const nh = [...history, parsed.name];
      setHistory(nh);
      saveHistory(nh);
    }
    setInput("");
    setMaisEmConta(false);
    setShowSuggestions(false);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setCheckedItems(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Suggestions
  const suggestions = history.filter(h =>
    input.length > 0 && h.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 5);

  // Group items by aisle
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.aisle]) acc[item.aisle] = [];
    acc[item.aisle].push(item);
    return acc;
  }, {});
  const sortedAisles = Object.keys(groupedItems).sort((a, b) => {
    const aId = groupedItems[a][0]?.aisleId || 999;
    const bId = groupedItems[b][0]?.aisleId || 999;
    return aId - bId;
  });

  // Export text
  const generateExportText = () => {
    const storeName = store?.name || "Mercado";
    let text = `═══════════════════════════\n`;
    text += `   FEIRA PLUS+ - LISTA DE COMPRAS\n`;
    text += `   ${storeName}\n`;
    text += `   ${new Date().toLocaleDateString("pt-BR")}\n`;
    text += `═══════════════════════════\n\n`;
    for (const aisleName of sortedAisles) {
      text += `📍 ${aisleName}\n`;
      text += `───────────────────────\n`;
      for (const item of groupedItems[aisleName]) {
        const deal = item.maisEmConta ? " 💲" : "";
        text += `  ☐ ${item.qty}${item.unit} - ${item.name}${deal}\n`;
      }
      text += `\n`;
    }
    text += `───────────────────────\n`;
    text += `Total de itens: ${items.length}\n`;
    text += `Criado por @Bordercansado\n`;
    return text;
  };

  const exportTxt = () => {
    const text = generateExportText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `feira-plus-${store?.id || "lista"}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportImg = () => {
    const el = exportRef.current;
    if (!el) return;
    // Use html2canvas-like approach via SVG foreignObject
    const content = el.innerHTML;
    const width = 420;
    const height = el.scrollHeight + 40;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif;padding:20px;background:#0a0a0a;color:#e0e0e0;font-size:15px;line-height:1.6;">
          ${content}
        </div>
      </foreignObject>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `feira-plus-${store?.id || "lista"}.svg`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Settings: add new aisle
  const addNewAisle = () => {
    const aisles = aisleConfig[settingsStore] || [];
    const newId = aisles.length > 0 ? Math.max(...aisles.map(a => a.id)) + 1 : 1;
    const updated = {
      ...aisleConfig,
      [settingsStore]: [...aisles, { id: newId, name: `Corredor ${newId}`, keywords: [] }],
    };
    setAisleConfig(updated);
    saveAisles(updated);
  };

  const saveEditAisle = () => {
    if (!editAisle) return;
    const aisles = aisleConfig[settingsStore] || [];
    const updated = {
      ...aisleConfig,
      [settingsStore]: aisles.map(a =>
        a.id === editAisle.id
          ? { ...a, name: editAisleName, keywords: editAisleKeywords.split(",").map(k => k.trim()).filter(Boolean) }
          : a
      ),
    };
    setAisleConfig(updated);
    saveAisles(updated);
    setEditAisle(null);
  };

  const deleteAisle = (aisleId) => {
    const aisles = aisleConfig[settingsStore] || [];
    const updated = {
      ...aisleConfig,
      [settingsStore]: aisles.filter(a => a.id !== aisleId),
    };
    setAisleConfig(updated);
    saveAisles(updated);
  };

  // ─── STYLES ───
  const styles = {
    app: {
      minHeight: "100vh",
      background: "#0A0A0F",
      color: "#E8E8E8",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #0D1117 0%, #161B22 100%)",
      borderBottom: "2px solid #00FF41",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: {
      fontSize: 22,
      fontWeight: 800,
      background: "linear-gradient(90deg, #00FF41, #00CC33)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: 1,
    },
    btn: (bg, size = "md") => ({
      background: bg || "#00FF41",
      color: bg === "transparent" ? "#00FF41" : "#0A0A0F",
      border: bg === "transparent" ? "2px solid #00FF41" : "none",
      borderRadius: 14,
      padding: size === "lg" ? "18px 32px" : size === "sm" ? "10px 16px" : "14px 24px",
      fontSize: size === "lg" ? 20 : size === "sm" ? 14 : 17,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: "100%",
    }),
    card: {
      background: "#161B22",
      borderRadius: 16,
      padding: 20,
      border: "1px solid #21262D",
      marginBottom: 12,
      transition: "all 0.3s",
    },
    input: {
      width: "100%",
      padding: "16px 18px",
      fontSize: 18,
      background: "#161B22",
      border: "2px solid #30363D",
      borderRadius: 14,
      color: "#E8E8E8",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
  };

  // ─── SCREENS ───

  // SPLASH
  if (screen === "splash") {
    return (
      <div style={{ ...styles.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <MatrixRain active={matrixActive} onComplete={onMatrixComplete} />
        <div style={{ animation: "pulse 1.5s ease-in-out infinite", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <div style={{ fontSize: 36, fontWeight: 900, background: "linear-gradient(90deg, #00FF41, #00CC33, #00FF41)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 2 }}>
            FEIRA PLUS+
          </div>
          <div style={{ color: "#666", marginTop: 12, fontSize: 14, letterSpacing: 3 }}>
            SUA LISTA INTELIGENTE
          </div>
          <div style={{ color: "#30363D", marginTop: 24, fontSize: 12 }}>
            por @Bordercansado
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100% { opacity: 0.7; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }

  // STORE SELECTION
  if (screen === "storeSelect") {
    return (
      <div style={styles.app}>
        <MatrixRain active={matrixActive} onComplete={onMatrixComplete} />
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
          <h1 style={{ ...styles.logo, fontSize: 28, marginBottom: 8 }}>FEIRA PLUS+</h1>
          <p style={{ color: "#8B949E", fontSize: 18, marginBottom: 36, lineHeight: 1.5 }}>
            Pra qual mercado você vai hoje?
          </p>

          {STORES.map((s, i) => (
            <button key={s.id} onClick={() => { setStore(s); navigateTo("list"); }}
              style={{
                ...styles.card,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 24,
                marginBottom: 16,
                border: `2px solid ${s.color}33`,
                background: `linear-gradient(135deg, #161B22 0%, ${s.color}11 100%)`,
                width: "100%",
                textAlign: "left",
                animation: `slideIn 0.4s ease-out ${i * 0.15}s both`,
              }}>
              <div style={{
                fontSize: 48,
                width: 72, height: 72,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${s.color}22`,
                borderRadius: 16,
                flexShrink: 0,
              }}>
                {s.emoji}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#E8E8E8" }}>{s.name}</div>
                <div style={{ fontSize: 14, color: "#8B949E", marginTop: 4 }}>Toque para selecionar</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 24, color: s.color }}>→</div>
            </button>
          ))}

          <button onClick={() => navigateTo("settings")}
            style={{ ...styles.btn("transparent", "sm"), marginTop: 24, width: "auto", margin: "24px auto 0", padding: "12px 24px" }}>
            ⚙️ Configurar Corredores
          </button>
        </div>
        <style>{`
          @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
      </div>
    );
  }

  // SETTINGS
  if (screen === "settings") {
    const currentAisles = aisleConfig[settingsStore] || [];
    return (
      <div style={styles.app}>
        <MatrixRain active={matrixActive} onComplete={onMatrixComplete} />
        <div style={styles.header}>
          <button onClick={() => navigateTo("storeSelect")} style={{ background: "none", border: "none", color: "#00FF41", fontSize: 28, cursor: "pointer", padding: 4 }}>←</button>
          <span style={styles.logo}>⚙️ Configurações</span>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ padding: 20 }}>
          <p style={{ color: "#8B949E", fontSize: 16, marginBottom: 20, lineHeight: 1.5 }}>
            Configure os corredores de cada mercado. Adicione palavras-chave para que os itens sejam organizados automaticamente.
          </p>

          {/* Store tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {STORES.map(s => (
              <button key={s.id} onClick={() => setSettingsStore(s.id)}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  background: settingsStore === s.id ? s.color : "#161B22",
                  color: settingsStore === s.id ? "#fff" : "#8B949E",
                  border: `1px solid ${settingsStore === s.id ? s.color : "#30363D"}`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  minWidth: 0,
                }}>
                {s.emoji} {s.short}
              </button>
            ))}
          </div>

          {/* Aisles */}
          {currentAisles.map(aisle => (
            <div key={aisle.id} style={{ ...styles.card, padding: 16 }}>
              {editAisle?.id === aisle.id ? (
                <div>
                  <input value={editAisleName} onChange={e => setEditAisleName(e.target.value)}
                    style={{ ...styles.input, marginBottom: 10, fontSize: 16, padding: 12 }}
                    placeholder="Nome do corredor" />
                  <textarea value={editAisleKeywords} onChange={e => setEditAisleKeywords(e.target.value)}
                    style={{ ...styles.input, marginBottom: 10, fontSize: 14, padding: 12, minHeight: 80, resize: "vertical" }}
                    placeholder="Palavras-chave separadas por vírgula" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={saveEditAisle} style={{ ...styles.btn("#00FF41", "sm"), flex: 1 }}>✓ Salvar</button>
                    <button onClick={() => setEditAisle(null)} style={{ ...styles.btn("#30363D", "sm"), flex: 1, color: "#8B949E" }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, color: "#00FF41" }}>{aisle.name}</div>
                    <div style={{ fontSize: 13, color: "#8B949E", marginTop: 4, lineHeight: 1.4 }}>
                      {aisle.keywords.length > 0 ? aisle.keywords.join(", ") : "Sem palavras-chave"}
                    </div>
                  </div>
                  <button onClick={() => { setEditAisle(aisle); setEditAisleName(aisle.name); setEditAisleKeywords(aisle.keywords.join(", ")); }}
                    style={{ background: "none", border: "none", color: "#00FF41", fontSize: 20, cursor: "pointer", padding: 8 }}>✏️</button>
                  <button onClick={() => deleteAisle(aisle.id)}
                    style={{ background: "none", border: "none", color: "#E63946", fontSize: 20, cursor: "pointer", padding: 8 }}>🗑️</button>
                </div>
              )}
            </div>
          ))}

          <button onClick={addNewAisle} style={{ ...styles.btn("#00FF41"), marginTop: 8 }}>
            + Adicionar Corredor
          </button>
        </div>
      </div>
    );
  }

  // SHOPPING LIST
  if (screen === "list") {
    const storeColor = store?.color || "#00FF41";
    return (
      <div style={styles.app}>
        <MatrixRain active={matrixActive} onComplete={onMatrixComplete} />

        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => { setItems([]); setCheckedItems({}); navigateTo("storeSelect"); }}
            style={{ background: "none", border: "none", color: "#00FF41", fontSize: 28, cursor: "pointer", padding: 4 }}>←</button>
          <div style={{ textAlign: "center" }}>
            <span style={{ ...styles.logo, fontSize: 16 }}>FEIRA PLUS+</span>
            <div style={{ fontSize: 13, color: storeColor, fontWeight: 600 }}>{store?.emoji} {store?.name}</div>
          </div>
          <button onClick={() => navigateTo("settings")}
            style={{ background: "none", border: "none", color: "#8B949E", fontSize: 22, cursor: "pointer", padding: 4 }}>⚙️</button>
        </div>

        {/* Input area */}
        <div style={{ padding: "16px 20px", background: "#0D1117", borderBottom: "1px solid #21262D", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
              onKeyDown={e => { if (e.key === "Enter") addItem(); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder='Ex: "2kg Feijão Carioca"'
              style={{ ...styles.input, paddingRight: 60, fontSize: 18 }}
            />
            {input && (
              <button onClick={addItem}
                style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  background: "#00FF41", border: "none", borderRadius: 10,
                  width: 44, height: 44, fontSize: 24, color: "#0A0A0F",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>+</button>
            )}
          </div>

          {/* Mais em conta toggle */}
          <button onClick={() => setMaisEmConta(!maisEmConta)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 12, padding: "8px 14px",
              background: maisEmConta ? "#22C55E22" : "#161B22",
              border: `2px solid ${maisEmConta ? "#22C55E" : "#30363D"}`,
              borderRadius: 10, cursor: "pointer", color: maisEmConta ? "#22C55E" : "#8B949E",
              fontSize: 16, fontWeight: 600, transition: "all 0.2s",
            }}>
            <DealIcon size={22} />
            Mais em conta
            {maisEmConta && <span style={{ marginLeft: 4 }}>✓</span>}
          </button>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && history.length > 0 && (
            <div style={{
              position: "absolute", left: 20, right: 20, top: "100%",
              background: "#1C2128", border: "1px solid #30363D",
              borderRadius: 12, zIndex: 50, maxHeight: 200, overflowY: "auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setInput(s); setShowSuggestions(false); inputRef.current?.focus(); }}
                  style={{
                    display: "block", width: "100%", padding: "14px 18px",
                    background: "none", border: "none", borderBottom: i < suggestions.length - 1 ? "1px solid #21262D" : "none",
                    color: "#E8E8E8", fontSize: 17, textAlign: "left", cursor: "pointer",
                  }}>
                  🕑 {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Items list */}
        <div style={{ padding: "12px 20px 120px", minHeight: 300 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#30363D" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
              <p style={{ fontSize: 18, lineHeight: 1.6 }}>
                Sua lista está vazia.<br />
                Adicione itens acima!
              </p>
              <p style={{ fontSize: 14, marginTop: 12, color: "#21262D" }}>
                Dica: escreva a quantidade junto,<br />
                ex: "2kg Arroz" ou "3 Leite"
              </p>
            </div>
          ) : (
            sortedAisles.map(aisleName => (
              <div key={aisleName} style={{ marginBottom: 20, animation: "fadeIn 0.3s ease-out" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 0", borderBottom: "2px solid #00FF4133",
                  marginBottom: 8,
                }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#00FF41" }}>{aisleName}</span>
                  <span style={{
                    marginLeft: "auto", background: "#00FF4122",
                    color: "#00FF41", fontSize: 12, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 20,
                  }}>{groupedItems[aisleName].length} {groupedItems[aisleName].length === 1 ? "item" : "itens"}</span>
                </div>

                {groupedItems[aisleName].map(item => (
                  <div key={item.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 12px", marginBottom: 6,
                      background: checkedItems[item.id] ? "#00FF4108" : "#161B22",
                      borderRadius: 12, border: `1px solid ${checkedItems[item.id] ? "#00FF4133" : "#21262D"}`,
                      opacity: checkedItems[item.id] ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}>
                    <button onClick={() => toggleCheck(item.id)}
                      style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        border: `2px solid ${checkedItems[item.id] ? "#00FF41" : "#30363D"}`,
                        background: checkedItems[item.id] ? "#00FF41" : "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#0A0A0F", fontSize: 16, fontWeight: 900,
                      }}>
                      {checkedItems[item.id] ? "✓" : ""}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 17, fontWeight: 600,
                        textDecoration: checkedItems[item.id] ? "line-through" : "none",
                        color: checkedItems[item.id] ? "#8B949E" : "#E8E8E8",
                      }}>
                        {item.qty}{item.unit} - {item.name}
                      </div>
                    </div>
                    {item.maisEmConta && <DealIcon size={24} />}
                    <button onClick={() => removeItem(item.id)}
                      style={{
                        background: "none", border: "none",
                        color: "#E6394666", fontSize: 18, cursor: "pointer",
                        padding: 4, flexShrink: 0,
                      }}>✕</button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Bottom bar */}
        {items.length > 0 && (
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 480,
            background: "linear-gradient(to top, #0D1117 80%, transparent)",
            padding: "20px 20px 24px",
            display: "flex", gap: 10,
          }}>
            <button onClick={() => setShowExport(true)}
              style={{ ...styles.btn("#00FF41"), flex: 1 }}>
              📋 Exportar Lista ({items.length})
            </button>
          </div>
        )}

        {/* Export modal */}
        {showExport && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center",
          }} onClick={() => setShowExport(false)}>
            <div style={{
              width: "100%", maxWidth: 480,
              background: "#161B22", borderRadius: "24px 24px 0 0",
              padding: "32px 24px 40px",
              animation: "slideUp 0.3s ease-out",
            }} onClick={e => e.stopPropagation()}>
              <div style={{ width: 40, height: 4, background: "#30363D", borderRadius: 2, margin: "0 auto 24px" }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#00FF41" }}>📋 Exportar Lista</h2>
              <p style={{ color: "#8B949E", marginBottom: 24, fontSize: 16 }}>Escolha o formato:</p>

              {/* Preview */}
              <div ref={exportRef} style={{
                background: "#0A0A0F", borderRadius: 12, padding: 16,
                marginBottom: 20, maxHeight: 250, overflowY: "auto",
                border: "1px solid #21262D", fontSize: 14, lineHeight: 1.6,
              }}>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <strong style={{ color: "#00FF41", fontSize: 16 }}>FEIRA PLUS+</strong><br />
                  <span style={{ color: "#8B949E" }}>{store?.name} — {new Date().toLocaleDateString("pt-BR")}</span>
                </div>
                {sortedAisles.map(aisleName => (
                  <div key={aisleName} style={{ marginBottom: 12 }}>
                    <div style={{ color: "#00FF41", fontWeight: 700, marginBottom: 4 }}>📍 {aisleName}</div>
                    {groupedItems[aisleName].map(item => (
                      <div key={item.id} style={{ color: "#CCC", paddingLeft: 12 }}>
                        ☐ {item.qty}{item.unit} - {item.name}
                        {item.maisEmConta && <span style={{ color: "#22C55E" }}> 💲</span>}
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #21262D", paddingTop: 8, marginTop: 8, color: "#8B949E", fontSize: 12 }}>
                  Total: {items.length} itens • @Bordercansado
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={exportTxt} style={{ ...styles.btn("#00FF41"), flex: 1 }}>
                  📄 TXT
                </button>
                <button onClick={exportImg} style={{ ...styles.btn("#1D3557"), flex: 1, color: "#E8E8E8" }}>
                  🖼️ Imagem
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  return null;
}
