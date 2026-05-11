// fluxo. — frontend com API
// Substitua src/App.jsx pelo conteúdo deste arquivo
// Crie src/api.js com o arquivo api.js fornecido
// Defina VITE_API_URL no .env do projeto Vite

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import { api } from "/api";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Literata:ital,wght@0,400;0,500;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { background:#0d0d0e; color:#ddd8d0; font-family:'Syne',sans-serif; font-size:14px; line-height:1.5; }
    :root {
      --bg0:#0d0d0e; --bg1:#131315; --bg2:#1a1a1d; --bg3:#222226; --bg4:#2a2a2f;
      --b1:rgba(255,255,255,0.06); --b2:rgba(255,255,255,0.10); --b3:rgba(255,255,255,0.16);
      --t0:#ddd8d0; --t1:#9d9890; --t2:#5a5752; --t3:#333230;
      --green:#7ee8a2; --green2:rgba(126,232,162,0.12); --green3:rgba(126,232,162,0.22);
      --red:#f07070; --red2:rgba(240,112,112,0.12); --red3:rgba(240,112,112,0.22);
      --amber:#f0c070; --amber2:rgba(240,192,112,0.12);
      --blue:#70b8f0; --purple:#b070f0; --purple2:rgba(176,112,240,0.12);
      --teal:#70e0d0; --pink:#f070b0; --coral:#f09070;
      --serif:'Literata',serif; --mono:'JetBrains Mono',monospace; --sans:'Syne',sans-serif;
      --r-sm:8px; --r-md:12px; --r-lg:16px;
    }
    input,select,textarea { font-family:var(--sans); font-size:13px; background:var(--bg3); border:0.5px solid var(--b2); color:var(--t0); border-radius:var(--r-sm); padding:8px 11px; outline:none; width:100%; transition:border-color 0.15s,background 0.15s; }
    input:focus,select:focus { border-color:var(--b3); background:var(--bg4); }
    input[type=number] { -moz-appearance:textfield; }
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
    select option { background:var(--bg3); }
    button { font-family:var(--sans); font-size:12px; font-weight:500; cursor:pointer; border-radius:var(--r-sm); border:0.5px solid var(--b2); background:var(--bg3); color:var(--t1); padding:7px 14px; transition:all 0.15s; white-space:nowrap; }
    button:hover { background:var(--bg4); color:var(--t0); border-color:var(--b3); }
    button:active { transform:scale(0.97); }
    button:disabled { opacity:0.4; cursor:not-allowed; }
    .btn-green { background:var(--green2); border-color:rgba(126,232,162,0.25); color:var(--green); }
    .btn-green:hover { background:var(--green3); }
    .btn-red { background:var(--red2); border-color:rgba(240,112,112,0.25); color:var(--red); }
    .btn-amber { background:var(--amber2); border-color:rgba(240,192,112,0.25); color:var(--amber); }
    .btn-purple { background:var(--purple2); border-color:rgba(176,112,240,0.25); color:var(--purple); }
    .btn-ghost { background:transparent; border-color:transparent; color:var(--t2); padding:4px 8px; font-size:11px; }
    .btn-ghost:hover { background:var(--bg3); color:var(--t1); border-color:var(--b1); }
    ::-webkit-scrollbar { width:3px; height:3px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--b2); border-radius:2px; }
    .fade { animation:fadeUp 0.18s ease; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
    .spin { animation:spin 1s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }
  `}</style>
);

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = {
  Alimentação: {
    color: "--amber",
    subs: [
      "Mercado / Supermercado",
      "Delivery (iFood, Rappi…)",
      "Restaurante / Almoço",
      "Padaria / Café",
      "Lanchonete",
      "Feira / Hortifruti",
      "Outro - Alimentação",
    ],
  },
  Transporte: {
    color: "--blue",
    subs: [
      "Gasolina / Combustível",
      "Uber / 99 / Táxi",
      "Manutenção / Mecânico",
      "Lava-jato / Estética",
      "Estacionamento",
      "Pedágio",
      "Transporte Público",
      "Outro - Transporte",
    ],
  },
  Moradia: {
    color: "--teal",
    subs: [
      "Aluguel",
      "Condomínio",
      "IPTU",
      "Água / Esgoto",
      "Luz / Energia",
      "Gás",
      "Internet / TV",
      "Limpeza / Produtos Casa",
      "Manutenção / Reforma",
      "Outro - Moradia",
    ],
  },
  Saúde: {
    color: "--green",
    subs: [
      "Plano de Saúde",
      "Médico / Consulta",
      "Dentista",
      "Farmácia / Remédio",
      "Academia / Personal",
      "Exame / Laboratório",
      "Psicólogo / Terapeuta",
      "Outro - Saúde",
    ],
  },
  Lazer: {
    color: "--pink",
    subs: [
      "Cinema / Teatro / Show",
      "Viagem / Hospedagem",
      "Esporte / Hobby",
      "Livro / Curso Livre",
      "Bar / Balada",
      "Games",
      "Outro - Lazer",
    ],
  },
  Educação: {
    color: "--purple",
    subs: [
      "Mensalidade Escola / Faculdade",
      "Curso Online",
      "Material Escolar",
      "Idiomas",
      "Certificações",
      "Outro - Educação",
    ],
  },
  Vestuário: {
    color: "--coral",
    subs: ["Roupas", "Calçados", "Acessórios", "Outro - Vestuário"],
  },
  Assinaturas: {
    color: "--amber",
    subs: [
      "Streaming Vídeo (Netflix, Disney…)",
      "Streaming Música (Spotify…)",
      "Software / SaaS",
      "Jornal / Revista",
      "Clube / Associação",
      "Outro - Assinaturas",
    ],
  },
  Pets: {
    color: "--teal",
    subs: [
      "Ração / Petisco",
      "Veterinário",
      "Banho e Tosa",
      "Vacinas",
      "Medicamentos Pet",
      "Outro - Pets",
    ],
  },
  Finanças: {
    color: "--blue",
    subs: [
      "Tarifa Bancária",
      "Imposto (DAS, IR…)",
      "Seguro",
      "IOF / Juros",
      "Outro - Finanças",
    ],
  },
  Renda: {
    color: "--green",
    subs: [
      "Salário / Pró-labore",
      "Freelance / Consultoria",
      "Aluguel Recebido",
      "Dividendos",
      "Venda",
      "Bônus / Participação",
      "Outro - Renda",
    ],
  },
  Outros: {
    color: "--t1",
    subs: ["Presente / Doação", "Multa", "Reembolso", "Outros"],
  },
};
const CAT_NAMES = Object.keys(CATEGORIES);
const CAT_COLOR = (sub) => {
  const k = CAT_NAMES.find((k) => CATEGORIES[k].subs.includes(sub)) || "Outros";
  return `var(${CATEGORIES[k]?.color || "--t1"})`;
};
const CAT_PARENT = (sub) =>
  CAT_NAMES.find((k) => CATEGORIES[k].subs.includes(sub)) || "Outros";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v || 0,
  );
const fmtShort = (v) => {
  const a = Math.abs(v);
  if (a >= 1000) return `R$${(v / 1000).toFixed(1)}k`;
  return fmt(v);
};
const fmtPct = (v) => `${(v || 0).toFixed(1)}%`;
const mkKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;
const mkLabel = (y, m) => {
  const N = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${N[m]}/${String(y).slice(2)}`;
};
const now = new Date();
const uid = () => Math.random().toString(36).slice(2);
const fmtDT = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
};

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Badge = ({ color, children, style }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 10,
      fontFamily: "var(--mono)",
      fontWeight: 500,
      padding: "2px 7px",
      borderRadius: 4,
      color: color || "var(--t1)",
      background: `${color || "#888"}18`,
      border: `0.5px solid ${color || "#888"}33`,
      ...style,
    }}
  >
    {children}
  </span>
);
const Lbl = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      color: "var(--t2)",
      textTransform: "uppercase",
      letterSpacing: "1.8px",
      marginBottom: 5,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);
const Row = ({ label, children, style }) => (
  <div style={style}>
    <Lbl>{label}</Lbl>
    {children}
  </div>
);
const Divider = () => (
  <div style={{ height: "0.5px", background: "var(--b1)", margin: "14px 0" }} />
);
const Card = ({ children, style, accent }) => (
  <div
    style={{
      background: "var(--bg2)",
      border: `0.5px solid ${accent || "var(--b1)"}`,
      borderRadius: "var(--r-lg)",
      padding: "16px 18px",
      ...style,
    }}
  >
    {children}
  </div>
);
const StatCard = ({ label, value, color, sub }) => (
  <div
    style={{
      background: "var(--bg2)",
      border: "0.5px solid var(--b1)",
      borderRadius: "var(--r-md)",
      padding: "13px 15px",
    }}
  >
    <Lbl>{label}</Lbl>
    <div
      style={{
        fontFamily: "var(--serif)",
        fontSize: 22,
        color: color || "var(--t0)",
        lineHeight: 1.1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div
        style={{
          fontSize: 10,
          color: "var(--t2)",
          marginTop: 3,
          fontFamily: "var(--mono)",
        }}
      >
        {sub}
      </div>
    )}
  </div>
);
const Bar = ({ pct, color, height = 4 }) => (
  <div
    style={{
      height,
      background: "var(--bg4)",
      borderRadius: height / 2,
      overflow: "hidden",
      marginTop: 6,
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${Math.min(100, Math.max(0, pct || 0))}%`,
        background: color || "var(--green)",
        borderRadius: height / 2,
        transition: "width 0.5s",
      }}
    />
  </div>
);
const Spinner = () => (
  <div
    className="spin"
    style={{
      width: 16,
      height: 16,
      border: "2px solid var(--b2)",
      borderTopColor: "var(--green)",
      borderRadius: "50%",
      display: "inline-block",
    }}
  />
);

const Toast = ({ msg, type }) =>
  msg ? (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: type === "error" ? "var(--red2)" : "var(--green2)",
        border: `0.5px solid ${type === "error" ? "rgba(240,112,112,0.3)" : "rgba(126,232,162,0.3)"}`,
        color: type === "error" ? "var(--red)" : "var(--green)",
        padding: "10px 16px",
        borderRadius: "var(--r-md)",
        fontSize: 13,
        zIndex: 2000,
        fontFamily: "var(--mono)",
      }}
    >
      {msg}
    </div>
  ) : null;

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="fade"
      style={{
        background: "var(--bg1)",
        border: "0.5px solid var(--b2)",
        borderRadius: 18,
        padding: 24,
        width: "100%",
        maxWidth: wide ? 640 : 480,
        maxHeight: "88vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span
          style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 500 }}
        >
          {title}
        </span>
        <button
          className="btn-ghost"
          onClick={onClose}
          style={{ fontSize: 18, padding: "2px 8px" }}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── DONUT ────────────────────────────────────────────────────────────────────
const DC = [
  "#7ee8a2",
  "#70b8f0",
  "#f0c070",
  "#f07070",
  "#b070f0",
  "#70e0d0",
  "#f070b0",
  "#f09070",
  "#a0d870",
  "#f0a040",
];
const Donut = ({ data, size = 180 }) => {
  if (!data || !data.length)
    return (
      <div
        style={{
          color: "var(--t2)",
          fontSize: 12,
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        sem dados
      </div>
    );
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const r = 60,
    cx = size / 2,
    cy = size / 2,
    sw = 26;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const pct = d.value / total,
      a0 = angle,
      a1 = angle + pct * 2 * Math.PI - 0.01;
    angle = a1 + 0.01;
    const x0 = cx + r * Math.cos(a0),
      y0 = cy + r * Math.sin(a0),
      x1 = cx + r * Math.cos(a1),
      y1 = cy + r * Math.sin(a1);
    return {
      ...d,
      path: `M${x0} ${y0} A${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${x1} ${y1}`,
      color: DC[i % DC.length],
      pct,
    };
  });
  return (
    <div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth={sw}
            strokeLinecap="butt"
            opacity={0.85}
          />
        ))}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="var(--t0)"
          fontFamily="var(--serif)"
          fontSize="13"
        >
          {fmtShort(total)}
        </text>
        <text
          x={cx}
          y={cy + 11}
          textAnchor="middle"
          fill="var(--t2)"
          fontFamily="var(--mono)"
          fontSize="9"
        >
          gastos
        </text>
      </svg>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 10px",
          justifyContent: "center",
          marginTop: 6,
        }}
      >
        {slices.map((s, i) => (
          <span
            key={i}
            style={{ fontSize: 9, color: s.color, fontFamily: "var(--mono)" }}
          >
            {s.name.split("/")[0].trim()} {fmtPct(s.pct * 100)}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── LOGIN / REGISTER ─────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.email || !f.password) {
      setErr("Preencha email e senha");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const data =
        mode === "login"
          ? await api.login(f.email, f.password)
          : await api.register(f.email, f.password, f.name);
      onAuth(data.token, data.name);
    } catch (e) {
      setErr(e.message || "Erro ao conectar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: 40,
            fontStyle: "italic",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          fluxo
          <span style={{ color: "var(--green)", fontStyle: "normal" }}>.</span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--t2)",
            textAlign: "center",
            marginBottom: 32,
            fontFamily: "var(--mono)",
          }}
        >
          controle financeiro pessoal
        </div>

        <Card>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: 12,
                  background: mode === m ? "var(--green2)" : "transparent",
                  color: mode === m ? "var(--green)" : "var(--t2)",
                  borderColor:
                    mode === m ? "rgba(126,232,162,0.2)" : "transparent",
                }}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <Row label="seu nome" style={{ marginBottom: 12 }}>
              <input
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="ex: João"
              />
            </Row>
          )}
          <Row label="email" style={{ marginBottom: 12 }}>
            <input
              type="email"
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="seuemail@exemplo.com"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </Row>
          <Row label="senha" style={{ marginBottom: 20 }}>
            <input
              type="password"
              value={f.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </Row>

          {err && (
            <div
              style={{
                color: "var(--red)",
                fontSize: 12,
                marginBottom: 12,
                fontFamily: "var(--mono)",
              }}
            >
              {err}
            </div>
          )}

          <button
            className="btn-green"
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", padding: "10px", fontSize: 13 }}
          >
            {loading ? (
              <Spinner />
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Criar conta"
            )}
          </button>
        </Card>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("fluxo_token") || "",
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("fluxo_name") || "",
  );
  const [data, setData] = useState({
    accounts: [],
    entries: [],
    investments: [],
    budgets: [],
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [accFilter, setAccFilter] = useState("");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [lastUpdated, setLastUpdated] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onAuth = (t, name) => {
    localStorage.setItem("fluxo_token", t);
    localStorage.setItem("fluxo_name", name);
    setToken(t);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("fluxo_token");
    localStorage.removeItem("fluxo_name");
    setToken("");
    setData({ accounts: [], entries: [], investments: [], budgets: [] });
  };

  // Load all data
  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [accounts, entries, investments, budgets] = await Promise.all([
        api.get("/accounts", token),
        api.get("/entries", token),
        api.get("/investments", token),
        api.get("/budgets", token),
      ]);
      setData({ accounts, entries, investments, budgets });
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      if (e.status === 401) logout();
      else showToast("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!token)
    return (
      <>
        <G />
        <AuthScreen onAuth={onAuth} />
      </>
    );

  const mk = mkKey(year, month);

  const allEntries = useMemo(() => {
    const manual = data.entries.filter(
      (e) =>
        e.month === mk &&
        e.kind === "manual" &&
        (!accFilter || e.accountId === accFilter),
    );
    const recurring = data.entries
      .filter(
        (e) =>
          e.kind === "subscription" &&
          e.active !== false &&
          e.startMonth <= mk &&
          (!accFilter || e.accountId === accFilter),
      )
      .map((e) => ({
        ...e,
        id: `rec_${e.id}_${mk}`,
        _virtual: true,
        _origId: e.id,
        month: mk,
      }));
    const installments = data.entries
      .filter((e) => {
        if (e.kind !== "installment") return false;
        if (accFilter && e.accountId !== accFilter) return false;
        return mk >= e.startMonth && mk <= e.endMonth;
      })
      .map((e) => {
        const [sy, sm] = e.startMonth.split("-").map(Number);
        const [cy, cm] = mk.split("-").map(Number);
        const num = (cy - sy) * 12 + (cm - sm) + 1;
        return {
          ...e,
          id: `inst_${e.id}_${mk}`,
          _virtual: true,
          _origId: e.id,
          month: mk,
          amount: -(Math.abs(e.totalAmount) / e.installments),
          name: `${e.name} (${num}/${e.installments})`,
        };
      });
    const seen = new Set(manual.map((e) => e.id));
    return [
      ...manual,
      ...recurring.filter((e) => !seen.has(e._origId)),
      ...installments,
    ];
  }, [data.entries, mk, accFilter]);

  const income = allEntries
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);
  const expense = Math.abs(
    allEntries.filter((e) => e.amount < 0).reduce((s, e) => s + e.amount, 0),
  );
  const balance = income - expense;

  const carryForward = useMemo(() => {
    const allMks = [...new Set(data.entries.map((e) => e.month))]
      .filter((k) => k < mk)
      .sort();
    return allMks.reduce((total, k) => {
      const txs = data.entries.filter(
        (e) => e.month === k && e.kind === "manual",
      );
      const rec = data.entries
        .filter(
          (e) =>
            e.kind === "subscription" &&
            e.active !== false &&
            e.startMonth <= k,
        )
        .map((e) => ({ amount: -Math.abs(e.amount) }));
      const inst = data.entries
        .filter(
          (e) =>
            e.kind === "installment" && k >= e.startMonth && k <= e.endMonth,
        )
        .map((e) => ({ amount: -(Math.abs(e.totalAmount) / e.installments) }));
      return (
        total + [...txs, ...rec, ...inst].reduce((s, e) => s + e.amount, 0)
      );
    }, 0);
  }, [data.entries, mk]);

  // CRUD helpers (call API then refresh)
  const apiCall = async (fn, successMsg) => {
    try {
      await fn();
      setLastUpdated(new Date().toISOString());
      await loadAll();
      if (successMsg) showToast(successMsg);
    } catch (e) {
      showToast(e.message || "Erro", "error");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "entries", label: "Lançamentos" },
    { id: "investments", label: "Investimentos" },
    { id: "budgets", label: "Orçamento" },
    { id: "compare", label: "Comparativo" },
    { id: "accounts", label: "Contas" },
  ];
  const prevM = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextM = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  return (
    <>
      <G />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 24px 40px",
          minHeight: "100vh",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 0 14px",
            borderBottom: "0.5px solid var(--b1)",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 24,
              fontStyle: "italic",
              letterSpacing: "-0.5px",
            }}
          >
            fluxo
            <span style={{ color: "var(--green)", fontStyle: "normal" }}>
              .
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {loading && <Spinner />}
            {lastUpdated && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--t2)",
                  fontFamily: "var(--mono)",
                }}
              >
                sync {fmtDT(lastUpdated)}
              </span>
            )}
            <select
              value={accFilter}
              onChange={(e) => setAccFilter(e.target.value)}
              style={{ width: "auto", fontSize: 11, padding: "5px 9px" }}
            >
              <option value="">Todas as contas</option>
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "var(--bg2)",
                border: "0.5px solid var(--b1)",
                borderRadius: "var(--r-sm)",
                padding: "3px 6px",
              }}
            >
              <button
                onClick={prevM}
                className="btn-ghost"
                style={{ padding: "2px 6px", fontSize: 14 }}
              >
                ‹
              </button>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--t1)",
                  minWidth: 52,
                  textAlign: "center",
                }}
              >
                {mkLabel(year, month)}
              </span>
              <button
                onClick={nextM}
                className="btn-ghost"
                style={{ padding: "2px 6px", fontSize: 14 }}
              >
                ›
              </button>
            </div>
            <span style={{ fontSize: 11, color: "var(--t2)" }}>{userName}</span>
            <button
              onClick={logout}
              className="btn-ghost"
              style={{ color: "var(--red)" }}
            >
              sair
            </button>
          </div>
        </div>

        {/* NAV */}
        <div
          style={{
            display: "flex",
            gap: 3,
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 16px",
                fontSize: 12,
                background: tab === t.id ? "var(--green2)" : "transparent",
                color: tab === t.id ? "var(--green)" : "var(--t2)",
                borderColor:
                  tab === t.id ? "rgba(126,232,162,0.2)" : "transparent",
                fontWeight: tab === t.id ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <Dashboard
            allEntries={allEntries}
            income={income}
            expense={expense}
            balance={balance}
            carryForward={carryForward}
            year={year}
            month={month}
            data={data}
            mk={mk}
          />
        )}
        {tab === "entries" && (
          <Entries
            data={data}
            token={token}
            mk={mk}
            allEntries={allEntries}
            apiCall={apiCall}
          />
        )}
        {tab === "investments" && (
          <Investments data={data} token={token} apiCall={apiCall} />
        )}
        {tab === "budgets" && (
          <Budgets
            data={data}
            token={token}
            income={income}
            allEntries={allEntries}
            apiCall={apiCall}
          />
        )}
        {tab === "compare" && <Compare data={data} year={year} month={month} />}
        {tab === "accounts" && (
          <AccountsPage data={data} token={token} apiCall={apiCall} />
        )}
      </div>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({
  allEntries,
  income,
  expense,
  balance,
  carryForward,
  year,
  month,
  data,
  mk,
}) {
  const byCat = useMemo(() => {
    const m = {};
    allEntries
      .filter((e) => e.amount < 0)
      .forEach((e) => {
        const p = CAT_PARENT(e.category);
        m[p] = (m[p] || 0) + Math.abs(e.amount);
      });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [allEntries]);
  const bySub = useMemo(() => {
    const m = {};
    allEntries
      .filter((e) => e.amount < 0)
      .forEach((e) => {
        m[e.category] = (m[e.category] || 0) + Math.abs(e.amount);
      });
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [allEntries]);
  const bars = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        let m = month - 5 + i,
          y = year;
        while (m < 0) {
          m += 12;
          y--;
        }
        const k = mkKey(y, m);
        const txs = data.entries.filter(
          (e) => e.month === k && e.kind === "manual",
        );
        const rec = data.entries
          .filter(
            (e) =>
              e.kind === "subscription" &&
              e.active !== false &&
              e.startMonth <= k,
          )
          .map((e) => ({ amount: -Math.abs(e.amount) }));
        const inst = data.entries
          .filter(
            (e) =>
              e.kind === "installment" && k >= e.startMonth && k <= e.endMonth,
          )
          .map((e) => ({
            amount: -(Math.abs(e.totalAmount) / e.installments),
          }));
        const all = [...txs, ...rec, ...inst];
        return {
          label: mkLabel(y, m),
          inc: all
            .filter((e) => e.amount > 0)
            .reduce((s, e) => s + e.amount, 0),
          exp: Math.abs(
            all.filter((e) => e.amount < 0).reduce((s, e) => s + e.amount, 0),
          ),
          current: i === 5,
        };
      }),
    [data.entries, year, month],
  );
  const maxBar = Math.max(...bars.map((b) => Math.max(b.inc, b.exp)), 1);
  const donutData = byCat
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
  return (
    <div className="fade">
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--t2)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          saldo acumulado
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: 52,
            letterSpacing: "-2px",
            lineHeight: 1,
            color: carryForward + balance >= 0 ? "var(--t0)" : "var(--red)",
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: "var(--t2)",
              verticalAlign: "super",
              marginRight: 4,
            }}
          >
            R$
          </span>
          {Math.abs(carryForward + balance).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--t2)",
            marginTop: 5,
          }}
        >
          arrastado {fmt(carryForward)} + mês atual {fmt(balance)}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <StatCard label="receitas" value={fmt(income)} color="var(--green)" />
        <StatCard label="despesas" value={fmt(expense)} color="var(--red)" />
        <StatCard
          label="saldo mês"
          value={fmt(balance)}
          color={balance >= 0 ? "var(--green)" : "var(--red)"}
        />
        <StatCard label="lançamentos" value={allEntries.length} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Card>
          <Lbl>últimos 6 meses</Lbl>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: 110,
              marginTop: 14,
            }}
          >
            {bars.map((b, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-end",
                    height: 90,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      borderRadius: "3px 3px 0 0",
                      height: `${(b.inc / maxBar) * 90}px`,
                      background: b.current ? "var(--green)" : "var(--bg4)",
                      transition: "height 0.4s",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      borderRadius: "3px 3px 0 0",
                      height: `${(b.exp / maxBar) * 90}px`,
                      background: b.current ? "var(--red)" : "var(--bg4)",
                      transition: "height 0.4s",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 9,
                    color: b.current ? "var(--t1)" : "var(--t3)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <span
              style={{
                fontSize: 10,
                color: "var(--green)",
                fontFamily: "var(--mono)",
              }}
            >
              ▪ receita
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--red)",
                fontFamily: "var(--mono)",
              }}
            >
              ▪ despesa
            </span>
          </div>
        </Card>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Lbl>gastos por categoria</Lbl>
          <Donut data={donutData} size={160} />
        </Card>
      </div>
      {bySub.length > 0 && (
        <Card>
          <Lbl>detalhamento de gastos</Lbl>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 24px",
              marginTop: 12,
            }}
          >
            {bySub.map(([cat, val], i) => (
              <div key={cat}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--t1)" }}>
                    {cat}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: CAT_COLOR(cat),
                    }}
                  >
                    {fmt(val)}
                  </span>
                </div>
                <Bar pct={(val / expense) * 100} color={DC[i % DC.length]} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── ENTRIES ──────────────────────────────────────────────────────────────────
function Entries({ data, token, mk, allEntries, apiCall }) {
  const [modal, setModal] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [filter, setFilter] = useState("all");
  const openNew = (kind) => {
    setEditEntry(null);
    setModal(kind);
  };
  const openEdit = (e) => {
    setEditEntry(
      data.entries.find((x) => x.id === e._origId || x.id === e.id) || e,
    );
    setModal(e.kind);
  };
  const closeModal = () => {
    setModal(null);
    setEditEntry(null);
  };
  const del = (id) =>
    apiCall(() => api.del(`/entries/${id}`, token), "Lançamento removido");
  const shown =
    filter === "all" ? allEntries : allEntries.filter((e) => e.kind === filter);
  return (
    <div className="fade">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span style={{ fontFamily: "var(--serif)", fontSize: 20 }}>
          Lançamentos
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => openNew("manual")} className="btn-green">
            + Manual
          </button>
          <button onClick={() => openNew("subscription")} className="btn-amber">
            + Assinatura
          </button>
          <button onClick={() => openNew("installment")} className="btn-purple">
            + Parcelado
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[
          ["all", "Todos"],
          ["manual", "Manuais"],
          ["subscription", "Assinaturas"],
          ["installment", "Parcelados"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding: "5px 12px",
              fontSize: 11,
              background: filter === k ? "var(--bg3)" : "transparent",
              color: filter === k ? "var(--t0)" : "var(--t2)",
              borderColor: filter === k ? "var(--b2)" : "transparent",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "56px 0", color: "var(--t3)" }}
        >
          nenhum lançamento neste mês
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {shown.map((e) => (
          <EntryRow
            key={e.id}
            entry={e}
            data={data}
            onEdit={() => openEdit(e)}
            onDelete={e._virtual ? undefined : () => del(e._origId || e.id)}
          />
        ))}
      </div>
      {modal === "manual" && (
        <ManualModal
          data={data}
          token={token}
          mk={mk}
          entry={editEntry}
          onClose={closeModal}
          apiCall={apiCall}
        />
      )}
      {modal === "subscription" && (
        <SubscriptionModal
          data={data}
          token={token}
          mk={mk}
          entry={editEntry}
          onClose={closeModal}
          apiCall={apiCall}
        />
      )}
      {modal === "installment" && (
        <InstallmentModal
          data={data}
          token={token}
          mk={mk}
          entry={editEntry}
          onClose={closeModal}
          apiCall={apiCall}
        />
      )}
    </div>
  );
}

function EntryRow({ entry, data, onEdit, onDelete }) {
  const acc = data.accounts.find((a) => a.id === entry.accountId);
  const kindColor =
    entry.kind === "subscription"
      ? "var(--amber)"
      : entry.kind === "installment"
        ? "var(--purple)"
        : "var(--b2)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "11px 14px",
        background: "var(--bg2)",
        border: "0.5px solid var(--b1)",
        borderRadius: "var(--r-md)",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 3,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--t0)" }}>
            {entry.name}
          </span>
          {entry._virtual && (
            <Badge color={kindColor}>
              {entry.kind === "subscription" ? "recorrente" : "parcelado"}
            </Badge>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Badge color={CAT_COLOR(entry.category)}>{entry.category}</Badge>
          {acc && <Badge color={acc.color}>{acc.name}</Badge>}
          {entry.note && (
            <span style={{ fontSize: 10, color: "var(--t2)" }}>
              {entry.note}
            </span>
          )}
          {entry.createdAt && (
            <span
              style={{
                fontSize: 10,
                color: "var(--t3)",
                fontFamily: "var(--mono)",
              }}
            >
              {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 15,
          color: entry.amount >= 0 ? "var(--green)" : "var(--red)",
          flexShrink: 0,
        }}
      >
        {entry.amount >= 0 ? "+" : ""}
        {fmt(entry.amount)}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button onClick={onEdit} className="btn-ghost">
          editar
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="btn-ghost"
            style={{ color: "var(--red)" }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function ManualModal({ data, token, mk, entry, onClose, apiCall }) {
  const iP = () => (entry ? CAT_PARENT(entry.category) : "Alimentação");
  const [f, setF] = useState(() =>
    entry
      ? {
          name: entry.name,
          amount: String(Math.abs(entry.amount)),
          direction: entry.amount >= 0 ? "in" : "out",
          category: entry.category,
          accountId: entry.accountId,
          note: entry.note || "",
        }
      : {
          name: "",
          amount: "",
          direction: "out",
          category: "Mercado / Supermercado",
          accountId: data.accounts[0]?.id || "",
          note: "",
        },
  );
  const [par, setPar] = useState(iP);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const save = async () => {
    if (!f.name || !f.amount) return;
    setSaving(true);
    const amt = parseFloat(f.amount) * (f.direction === "out" ? -1 : 1);
    const body = {
      kind: "manual",
      month: mk,
      name: f.name,
      amount: amt,
      category: f.category,
      accountId: f.accountId,
      note: f.note,
    };
    await apiCall(
      () =>
        entry
          ? api.put(`/entries/${entry.id}`, body, token)
          : api.post("/entries", body, token),
      "Salvo",
    );
    setSaving(false);
    onClose();
  };
  return (
    <Modal title={entry ? "Editar" : "Novo Lançamento"} onClose={onClose}>
      <Row label="descrição" style={{ marginBottom: 12 }}>
        <input
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />
      </Row>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="valor (R$)">
          <input
            type="number"
            value={f.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
        </Row>
        <Row label="tipo">
          <select
            value={f.direction}
            onChange={(e) => set("direction", e.target.value)}
          >
            <option value="out">Despesa</option>
            <option value="in">Receita</option>
          </select>
        </Row>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="categoria">
          <select
            value={par}
            onChange={(e) => {
              setPar(e.target.value);
              set("category", CATEGORIES[e.target.value].subs[0]);
            }}
          >
            {CAT_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Row>
        <Row label="subcategoria">
          <select
            value={f.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES[par]?.subs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Row>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <Row label="conta">
          <select
            value={f.accountId}
            onChange={(e) => set("accountId", e.target.value)}
          >
            {data.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Row>
        <Row label="observação">
          <input
            value={f.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="opcional"
          />
        </Row>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-green" onClick={save} disabled={saving}>
          {saving ? <Spinner /> : "Salvar"}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

function SubscriptionModal({ data, token, mk, entry, onClose, apiCall }) {
  const iP = () => (entry ? CAT_PARENT(entry.category) : "Assinaturas");
  const [f, setF] = useState(() =>
    entry
      ? {
          name: entry.name,
          amount: String(entry.amount),
          category: entry.category,
          accountId: entry.accountId,
          note: entry.note || "",
          active: entry.active !== false,
        }
      : {
          name: "",
          amount: "",
          category: "Streaming Vídeo (Netflix, Disney…)",
          accountId: data.accounts[0]?.id || "",
          note: "",
          active: true,
        },
  );
  const [par, setPar] = useState(iP);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const save = async () => {
    if (!f.name || !f.amount) return;
    setSaving(true);
    const body = {
      kind: "subscription",
      startMonth: entry ? entry.startMonth : mk,
      name: f.name,
      amount: parseFloat(f.amount),
      category: f.category,
      accountId: f.accountId,
      note: f.note,
      active: f.active,
    };
    await apiCall(
      () =>
        entry
          ? api.put(`/entries/${entry.id}`, body, token)
          : api.post("/entries", body, token),
      "Assinatura salva",
    );
    setSaving(false);
    onClose();
  };
  return (
    <Modal
      title={entry ? "Editar Assinatura" : "Nova Assinatura"}
      onClose={onClose}
    >
      <div
        style={{
          background: "var(--amber2)",
          border: "0.5px solid rgba(240,192,112,0.2)",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 14,
          fontSize: 11,
          color: "var(--amber)",
        }}
      >
        Aparece automaticamente em todos os meses a partir da criação.
      </div>
      <Row label="serviço" style={{ marginBottom: 12 }}>
        <input
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />
      </Row>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="valor/mês (R$)">
          <input
            type="number"
            value={f.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
        </Row>
        <Row label="conta">
          <select
            value={f.accountId}
            onChange={(e) => set("accountId", e.target.value)}
          >
            {data.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Row>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="categoria">
          <select
            value={par}
            onChange={(e) => {
              setPar(e.target.value);
              set("category", CATEGORIES[e.target.value].subs[0]);
            }}
          >
            {CAT_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Row>
        <Row label="subcategoria">
          <select
            value={f.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES[par]?.subs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Row>
      </div>
      <Row label="observação" style={{ marginBottom: 12 }}>
        <input
          value={f.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="opcional"
        />
      </Row>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          cursor: "pointer",
          fontSize: 13,
          color: "var(--t1)",
        }}
      >
        <input
          type="checkbox"
          checked={f.active}
          onChange={(e) => set("active", e.target.checked)}
          style={{ width: 14, height: 14 }}
        />
        Assinatura ativa
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-green" onClick={save} disabled={saving}>
          {saving ? <Spinner /> : "Salvar"}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

function InstallmentModal({ data, token, mk, entry, onClose, apiCall }) {
  const iP = () => (entry ? CAT_PARENT(entry.category) : "Outros");
  const [f, setF] = useState(() =>
    entry
      ? {
          name: entry.name,
          totalAmount: String(entry.totalAmount),
          installments: String(entry.installments),
          category: entry.category,
          accountId: entry.accountId,
          note: entry.note || "",
        }
      : {
          name: "",
          totalAmount: "",
          installments: "",
          category: "Outros",
          accountId: data.accounts[0]?.id || "",
          note: "",
        },
  );
  const [par, setPar] = useState(iP);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const parcel =
    f.totalAmount && f.installments
      ? parseFloat(f.totalAmount) / parseInt(f.installments)
      : 0;
  const calcEnd = () => {
    const [y, m] = mk.split("-").map(Number);
    let mm = m - 1 + parseInt(f.installments || 1) - 1,
      yy = y;
    while (mm > 11) {
      mm -= 12;
      yy++;
    }
    return mkKey(yy, mm);
  };
  const save = async () => {
    if (!f.name || !f.totalAmount || !f.installments) return;
    setSaving(true);
    const body = {
      kind: "installment",
      startMonth: entry ? entry.startMonth : mk,
      endMonth: entry ? entry.endMonth : calcEnd(),
      name: f.name,
      totalAmount: parseFloat(f.totalAmount),
      installments: parseInt(f.installments),
      category: f.category,
      accountId: f.accountId,
      note: f.note,
    };
    await apiCall(
      () =>
        entry
          ? api.put(`/entries/${entry.id}`, body, token)
          : api.post("/entries", body, token),
      "Parcelado salvo",
    );
    setSaving(false);
    onClose();
  };
  return (
    <Modal
      title={entry ? "Editar Parcelado" : "Novo Parcelado"}
      onClose={onClose}
    >
      <Row label="descrição" style={{ marginBottom: 12 }}>
        <input
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />
      </Row>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="valor total (R$)">
          <input
            type="number"
            value={f.totalAmount}
            onChange={(e) => set("totalAmount", e.target.value)}
          />
        </Row>
        <Row label="nº parcelas">
          <input
            type="number"
            value={f.installments}
            onChange={(e) => set("installments", e.target.value)}
          />
        </Row>
      </div>
      {parcel > 0 && (
        <div
          style={{
            background: "var(--purple2)",
            border: "0.5px solid rgba(176,112,240,0.2)",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 12,
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--purple)",
          }}
        >
          {fmt(parcel)}/mês × {f.installments}x · termina em {calcEnd()}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="categoria">
          <select
            value={par}
            onChange={(e) => {
              setPar(e.target.value);
              set("category", CATEGORIES[e.target.value].subs[0]);
            }}
          >
            {CAT_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Row>
        <Row label="subcategoria">
          <select
            value={f.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES[par]?.subs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Row>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <Row label="conta">
          <select
            value={f.accountId}
            onChange={(e) => set("accountId", e.target.value)}
          >
            {data.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Row>
        <Row label="observação">
          <input
            value={f.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="opcional"
          />
        </Row>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-green" onClick={save} disabled={saving}>
          {saving ? <Spinner /> : "Salvar"}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ─── INVESTMENTS ──────────────────────────────────────────────────────────────
function Investments({ data, token, apiCall }) {
  const [modal, setModal] = useState(null);
  const [editInv, setEditInv] = useState(null);
  const [movModal, setMovModal] = useState(null);
  const del = (id) =>
    apiCall(() => api.del(`/investments/${id}`, token), "Removido");
  const total = data.investments.reduce(
    (s, i) =>
      (i.movements || []).reduce(
        (a, m) => a + (m.type === "deposit" ? m.amount : -m.amount),
        s,
      ),
    0,
  );
  const ICAT_C = {
    CDB: "var(--green)",
    "Tesouro Direto": "var(--blue)",
    Ações: "var(--red)",
    FII: "var(--amber)",
    Poupança: "var(--teal)",
    Criptomoeda: "var(--purple)",
    Previdência: "var(--coral)",
    Outro: "var(--t1)",
  };
  return (
    <div className="fade">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 20 }}>
            Investimentos
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--t2)",
              fontFamily: "var(--mono)",
              marginTop: 2,
            }}
          >
            total: {fmt(total)}
          </div>
        </div>
        <button
          className="btn-green"
          onClick={() => {
            setEditInv(null);
            setModal("inv");
          }}
        >
          + Novo
        </button>
      </div>
      {data.investments.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "56px 0", color: "var(--t3)" }}
        >
          nenhum investimento cadastrado
        </div>
      )}
      {data.investments.map((inv) => {
        const bal = (inv.movements || []).reduce(
          (s, m) => s + (m.type === "deposit" ? m.amount : -m.amount),
          0,
        );
        const pct = inv.target > 0 ? (bal / inv.target) * 100 : null;
        return (
          <Card key={inv.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>
                    {inv.name}
                  </span>
                  <Badge color={ICAT_C[inv.category] || "var(--t1)"}>
                    {inv.category}
                  </Badge>
                </div>
                {inv.note && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--t2)",
                      marginBottom: 6,
                    }}
                  >
                    {inv.note}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 26,
                    color: "var(--green)",
                    lineHeight: 1,
                  }}
                >
                  {fmt(bal)}
                </div>
                {inv.target > 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--t2)",
                      fontFamily: "var(--mono)",
                      marginTop: 3,
                    }}
                  >
                    meta: {fmt(inv.target)} · {fmtPct(pct)}
                  </div>
                )}
                {inv.target > 0 && (
                  <Bar pct={pct} color="var(--green)" height={5} />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <button
                  className="btn-green"
                  style={{ fontSize: 11 }}
                  onClick={() =>
                    setMovModal({ invId: inv.id, type: "deposit" })
                  }
                >
                  + Depósito
                </button>
                <button
                  className="btn-red"
                  style={{ fontSize: 11 }}
                  onClick={() =>
                    setMovModal({ invId: inv.id, type: "withdraw" })
                  }
                >
                  − Retirada
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEditInv(inv);
                    setModal("inv");
                  }}
                >
                  editar
                </button>
                <button
                  className="btn-ghost"
                  style={{ color: "var(--red)" }}
                  onClick={() => del(inv.id)}
                >
                  excluir
                </button>
              </div>
            </div>
            {(inv.movements || []).length > 0 && (
              <div style={{ marginTop: 14 }}>
                <Divider />
                <Lbl>movimentações recentes</Lbl>
                {[...(inv.movements || [])]
                  .reverse()
                  .slice(0, 5)
                  .map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: "0.5px solid var(--b1)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--t2)",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {new Date(m.date).toLocaleDateString("pt-BR")}
                      </span>
                      {m.note && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--t2)",
                            flex: 1,
                            marginLeft: 12,
                          }}
                        >
                          {m.note}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 12,
                          color:
                            m.type === "deposit"
                              ? "var(--green)"
                              : "var(--red)",
                        }}
                      >
                        {m.type === "deposit" ? "+" : "−"}
                        {fmt(m.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        );
      })}
      {modal === "inv" && (
        <InvestmentModal
          token={token}
          entry={editInv}
          onClose={() => setModal(null)}
          apiCall={apiCall}
        />
      )}
      {movModal && (
        <MovementModal
          invId={movModal.invId}
          type={movModal.type}
          token={token}
          onClose={() => setMovModal(null)}
          apiCall={apiCall}
        />
      )}
    </div>
  );
}
function InvestmentModal({ token, entry, onClose, apiCall }) {
  const ICATS = [
    "CDB",
    "Tesouro Direto",
    "Ações",
    "FII",
    "Poupança",
    "Criptomoeda",
    "Previdência",
    "Outro",
  ];
  const [f, setF] = useState(() =>
    entry
      ? {
          name: entry.name,
          target: String(entry.target || ""),
          category: entry.category,
          note: entry.note || "",
        }
      : { name: "", target: "", category: "CDB", note: "" },
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const save = async () => {
    if (!f.name) return;
    setSaving(true);
    const body = { ...f, target: parseFloat(f.target) || 0 };
    await apiCall(
      () =>
        entry
          ? api.put(`/investments/${entry.id}`, body, token)
          : api.post("/investments", body, token),
      "Salvo",
    );
    setSaving(false);
    onClose();
  };
  return (
    <Modal title={entry ? "Editar" : "Novo Investimento"} onClose={onClose}>
      <Row label="nome" style={{ marginBottom: 12 }}>
        <input
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />
      </Row>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Row label="meta (R$)">
          <input
            type="number"
            value={f.target}
            onChange={(e) => set("target", e.target.value)}
            placeholder="opcional"
          />
        </Row>
        <Row label="tipo">
          <select
            value={f.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {ICATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Row>
      </div>
      <Row label="observação" style={{ marginBottom: 16 }}>
        <input value={f.note} onChange={(e) => set("note", e.target.value)} />
      </Row>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-green" onClick={save} disabled={saving}>
          {saving ? <Spinner /> : "Salvar"}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}
function MovementModal({ invId, type, token, onClose, apiCall }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!amount) return;
    setSaving(true);
    await apiCall(
      () =>
        api.post(
          `/investments/${invId}/movements`,
          { type, amount: parseFloat(amount), note },
          token,
        ),
      "Registrado",
    );
    setSaving(false);
    onClose();
  };
  return (
    <Modal
      title={type === "deposit" ? "Depositar" : "Retirar"}
      onClose={onClose}
    >
      <Row label="valor (R$)" style={{ marginBottom: 12 }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </Row>
      <Row label="observação" style={{ marginBottom: 16 }}>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="opcional"
        />
      </Row>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className={type === "deposit" ? "btn-green" : "btn-red"}
          onClick={save}
          disabled={saving}
        >
          {saving ? <Spinner /> : type === "deposit" ? "Depositar" : "Retirar"}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ─── BUDGETS ──────────────────────────────────────────────────────────────────
function Budgets({ data, token, income, allEntries, apiCall }) {
  const [f, setF] = useState({
    parentCat: "Alimentação",
    category: "Mercado / Supermercado",
    pct: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const catSpend = useMemo(() => {
    const m = {};
    allEntries
      .filter((e) => e.amount < 0)
      .forEach((e) => {
        m[e.category] = (m[e.category] || 0) + Math.abs(e.amount);
      });
    return m;
  }, [allEntries]);
  const totalExp = allEntries
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);
  const totalPct = (data.budgets || []).reduce((s, b) => s + b.pct, 0);
  const save = async () => {
    if (!f.pct) return;
    await apiCall(
      () =>
        api.put(
          `/budgets/${encodeURIComponent(f.category)}`,
          { pct: parseFloat(f.pct) },
          token,
        ),
      "Salvo",
    );
    setF((p) => ({ ...p, pct: "" }));
  };
  const del = (cat) =>
    apiCall(
      () => api.del(`/budgets/${encodeURIComponent(cat)}`, token),
      "Removido",
    );
  return (
    <div className="fade">
      <div
        style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 6 }}
      >
        Orçamento
      </div>
      <div style={{ fontSize: 12, color: "var(--t2)", marginBottom: 18 }}>
        Defina % da receita por subcategoria.
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <StatCard label="receita" value={fmt(income)} color="var(--green)" />
        <StatCard
          label="orçado"
          value={fmtPct(totalPct)}
          color="var(--amber)"
          sub={income > 0 ? fmt(income * (totalPct / 100)) : ""}
        />
        <StatCard label="gasto real" value={fmt(totalExp)} color="var(--red)" />
      </div>
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 100px",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <Row label="categoria">
            <select
              value={f.parentCat}
              onChange={(e) => {
                set("parentCat", e.target.value);
                set("category", CATEGORIES[e.target.value].subs[0]);
              }}
            >
              {CAT_NAMES.filter((c) => c !== "Renda").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Row>
          <Row label="subcategoria">
            <select
              value={f.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES[f.parentCat]?.subs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Row>
          <Row label="% receita">
            <input
              type="number"
              value={f.pct}
              onChange={(e) => set("pct", e.target.value)}
              placeholder="ex: 15"
            />
          </Row>
        </div>
        {f.pct && income > 0 && (
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 8,
              padding: "7px 12px",
              marginBottom: 10,
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--t1)",
            }}
          >
            {fmtPct(parseFloat(f.pct))} de {fmt(income)} ={" "}
            <span style={{ color: "var(--green)" }}>
              {fmt(income * (parseFloat(f.pct) / 100))}
            </span>
          </div>
        )}
        <button className="btn-green" onClick={save}>
          Salvar
        </button>
      </Card>
      {(data.budgets || []).length === 0 && (
        <div
          style={{ textAlign: "center", padding: "40px 0", color: "var(--t3)" }}
        >
          nenhum orçamento definido
        </div>
      )}
      {(data.budgets || []).map((b) => {
        const limit = income * (b.pct / 100),
          spent = catSpend[b.category] || 0,
          over = spent > limit && limit > 0,
          pct = limit > 0 ? (spent / limit) * 100 : 0;
        return (
          <div
            key={b.category}
            style={{
              padding: "13px 15px",
              background: "var(--bg2)",
              border: `0.5px solid ${over ? "rgba(240,112,112,0.3)" : "var(--b1)"}`,
              borderRadius: "var(--r-md)",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {b.category}
                </span>
                <span style={{ marginLeft: 8 }}>
                  <Badge color={CAT_COLOR(b.category)}>{fmtPct(b.pct)}</Badge>
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  textAlign: "right",
                  marginRight: 8,
                }}
              >
                <span style={{ color: over ? "var(--red)" : "var(--green)" }}>
                  {fmt(spent)}
                </span>
                <span style={{ color: "var(--t3)" }}> / {fmt(limit)}</span>
              </div>
              <button
                onClick={() => del(b.category)}
                className="btn-ghost"
                style={{ color: "var(--red)" }}
              >
                ×
              </button>
            </div>
            <Bar
              pct={pct}
              color={over ? "var(--red)" : "var(--green)"}
              height={5}
            />
            <div
              style={{
                fontSize: 10,
                color: over ? "var(--red)" : "var(--t3)",
                fontFamily: "var(--mono)",
                marginTop: 4,
              }}
            >
              {over
                ? `⚠ estourou ${fmt(spent - limit)}`
                : `disponível: ${fmt(Math.max(0, limit - spent))}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPARE ──────────────────────────────────────────────────────────────────
function Compare({ data, year, month }) {
  const months = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        let m = month - 5 + i,
          y = year;
        while (m < 0) {
          m += 12;
          y--;
        }
        return { y, m, key: mkKey(y, m), label: mkLabel(y, m) };
      }),
    [year, month],
  );
  const mData = useMemo(
    () =>
      months.map(({ key, label }) => {
        const txs = data.entries.filter(
          (e) => e.month === key && e.kind === "manual",
        );
        const rec = data.entries
          .filter(
            (e) =>
              e.kind === "subscription" &&
              e.active !== false &&
              e.startMonth <= key,
          )
          .map((e) => ({ amount: -Math.abs(e.amount), category: e.category }));
        const inst = data.entries
          .filter(
            (e) =>
              e.kind === "installment" &&
              key >= e.startMonth &&
              key <= e.endMonth,
          )
          .map((e) => ({
            amount: -(Math.abs(e.totalAmount) / e.installments),
            category: e.category,
          }));
        const all = [...txs, ...rec, ...inst];
        const inc = all
          .filter((e) => e.amount > 0)
          .reduce((s, e) => s + e.amount, 0);
        const exp = Math.abs(
          all.filter((e) => e.amount < 0).reduce((s, e) => s + e.amount, 0),
        );
        const byCat = {};
        all
          .filter((e) => e.amount < 0)
          .forEach((e) => {
            const p = CAT_PARENT(e.category);
            byCat[p] = (byCat[p] || 0) + Math.abs(e.amount);
          });
        return { key, label, inc, exp, byCat };
      }),
    [data.entries, months],
  );
  const maxVal = Math.max(...mData.map((m) => Math.max(m.inc, m.exp)), 1);
  const allCats = [...new Set(mData.flatMap((m) => Object.keys(m.byCat)))];
  return (
    <div className="fade">
      <div
        style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 20 }}
      >
        Comparativo
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Lbl>receita × despesa — 6 meses</Lbl>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${months.length},1fr)`,
            gap: 8,
            marginTop: 16,
          }}
        >
          {mData.map((m) => (
            <div
              key={m.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-end",
                  height: 90,
                }}
              >
                <div
                  style={{
                    width: 16,
                    borderRadius: "3px 3px 0 0",
                    background: "var(--green)",
                    height: `${(m.inc / maxVal) * 90}px`,
                    opacity: 0.8,
                  }}
                />
                <div
                  style={{
                    width: 16,
                    borderRadius: "3px 3px 0 0",
                    background: "var(--red)",
                    height: `${(m.exp / maxVal) * 90}px`,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: "var(--t2)",
                  fontFamily: "var(--mono)",
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "var(--green)",
                  fontFamily: "var(--mono)",
                }}
              >
                {fmtShort(m.inc)}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "var(--red)",
                  fontFamily: "var(--mono)",
                }}
              >
                {fmtShort(m.exp)}
              </span>
            </div>
          ))}
        </div>
      </Card>
      {allCats.length > 0 && (
        <Card style={{ overflowX: "auto" }}>
          <Lbl>gastos por categoria</Lbl>
          <div style={{ minWidth: 480, marginTop: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `140px repeat(${months.length},1fr)`,
                gap: 6,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 10, color: "var(--t3)" }}>
                categoria
              </span>
              {mData.map((m) => (
                <span
                  key={m.key}
                  style={{
                    fontSize: 10,
                    color: "var(--t3)",
                    fontFamily: "var(--mono)",
                    textAlign: "right",
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            {allCats.map((cat) => (
              <div
                key={cat}
                style={{
                  display: "grid",
                  gridTemplateColumns: `140px repeat(${months.length},1fr)`,
                  gap: 6,
                  padding: "6px 0",
                  borderTop: "0.5px solid var(--b1)",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: CAT_COLOR(CATEGORIES[cat]?.subs[0] || "Outros"),
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                </span>
                {mData.map((m) => (
                  <span
                    key={m.key}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: m.byCat[cat] ? "var(--t1)" : "var(--t3)",
                      textAlign: "right",
                    }}
                  >
                    {m.byCat[cat] ? fmtShort(m.byCat[cat]) : "—"}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── ACCOUNTS ─────────────────────────────────────────────────────────────────
function AccountsPage({ data, token, apiCall }) {
  const [f, setF] = useState({ name: "", type: "PF", color: "#7ee8a2" });
  const [editId, setEditId] = useState(null);
  const COLORS = [
    "#7ee8a2",
    "#70b8f0",
    "#f0c070",
    "#f07070",
    "#b070f0",
    "#70e0d0",
    "#f070b0",
    "#f09070",
  ];
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const save = async () => {
    if (!f.name) return;
    await apiCall(
      () =>
        editId
          ? api.put(`/accounts/${editId}`, f, token)
          : api.post("/accounts", f, token),
      editId ? "Conta atualizada" : "Conta criada",
    );
    setF({ name: "", type: "PF", color: "#7ee8a2" });
    setEditId(null);
  };
  const del = (id) =>
    apiCall(() => api.del(`/accounts/${id}`, token), "Conta removida");
  const startEdit = (a) => {
    setF({ name: a.name, type: a.type, color: a.color });
    setEditId(a.id);
  };
  return (
    <div className="fade">
      <div
        style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 20 }}
      >
        Contas
      </div>
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Row label="nome">
            <input
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="ex: Nubank PF"
            />
          </Row>
          <Row label="tipo">
            <select
              value={f.type}
              onChange={(e) => set("type", e.target.value)}
            >
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
          </Row>
        </div>
        <Row label="cor" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => set("color", c)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: c,
                  cursor: "pointer",
                  border:
                    f.color === c ? "2px solid white" : "2px solid transparent",
                  transition: "border 0.1s",
                }}
              />
            ))}
          </div>
        </Row>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-green" onClick={save}>
            {editId ? "Salvar edição" : "+ Adicionar"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setF({ name: "", type: "PF", color: "#7ee8a2" });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </Card>
      {data.accounts.map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "13px 15px",
            background: "var(--bg2)",
            border: "0.5px solid var(--b1)",
            borderRadius: "var(--r-md)",
            marginBottom: 8,
            gap: 12,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: a.color,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
            <div
              style={{
                fontSize: 11,
                color: "var(--t2)",
                fontFamily: "var(--mono)",
              }}
            >
              {a.type === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
            </div>
          </div>
          <Badge color={a.color}>{a.type}</Badge>
          <button onClick={() => startEdit(a)} className="btn-ghost">
            editar
          </button>
          <button
            onClick={() => del(a.id)}
            className="btn-ghost"
            style={{ color: "var(--red)" }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
