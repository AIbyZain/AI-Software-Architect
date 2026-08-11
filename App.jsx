import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Terminal,
  Cpu,
  Database,
  Server,
  Layout,
  Globe,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Settings,
  RefreshCw,
  Search,
  Code,
  ShieldCheck,
  FileText,
  ChevronRight,
  Play,
  Share2,
  Bookmark,
  ExternalLink,
  Info,
  Check,
  X,
  Zap,
  Sliders,
  History,
  Trash2,
  Printer,
  ChevronDown,
  Activity,
  ArrowRight
} from 'lucide-react';

// Pre-configured architecture prompt templates for instant testing
const PROMPT_TEMPLATES = [
  {
    title: "Real-time Fintech Trading Platform",
    projectName: "TradePulse AI",
    prompt: "Design a high-frequency event-driven trading platform with sub-millisecond market data ingestion, WebSocket feeds, fraud detection microservices, PostgreSQL time-series database, Redis caching, and React/Tailwind frontend dashboard."
  },
  {
    title: "Healthcare LLM Assistant System",
    projectName: "MediGraph AI",
    prompt: "Create a HIPAA-compliant AI medical research assistant that uses RAG (Retrieval-Augmented Generation) with Vector databases (Qdrant), FHIR standard data pipelines, FastAPI backend microservices, and fine-tuned LLMs."
  },
  {
    title: "E-Commerce Multi-Tenant Engine",
    projectName: "ShopNexus OS",
    prompt: "Architect a cloud-native multi-tenant SaaS e-commerce platform with automated tenant isolation, GraphQL API gateway, Stripe payments integrations, global CDN deployment, and Next.js frontend."
  }
];

// Fallback high-fidelity sample architecture when API is unavailable in offline demo mode
const SAMPLE_MOCK_ARCHITECTURE = {
  project_name: "TradePulse AI Engine",
  user_prompt: "Design a high-frequency event-driven trading platform with sub-millisecond market data ingestion, WebSocket feeds, fraud detection microservices, and React frontend dashboard.",
  requirements: `### 1. System Requirements & Architecture Goals
  
#### Functional Requirements
- **FR-01 Data Ingestion:** Stream market feeds from WebSocket/UDP providers with sub-50ms latency.
- **FR-02 Execution Engine:** Process trade matching and route orders to liquidity providers.
- **FR-03 Risk & Fraud Detection:** Real-time anomaly detection evaluating order size and frequency using ML pipeline.
- **FR-04 Portfolio Dashboard:** Real-time visual representation of position sizing, profit/loss (PnL), and risk metrics.

#### Non-Functional Requirements
- **Latency:** < 10ms P99 latency for risk validation and routing.
- **Scalability:** Horizontal scaling up to 500,000 concurrent WebSocket connections.
- **Availability:** 99.99% uptime with multi-region failover.
- **Compliance:** Full audit trailing for SOC2 and PCI-DSS compliance.`,

  database: `### Database Architecture & Data Strategy

#### Primary Database: PostgreSQL (RDS / Aurora Multi-AZ)
- **Use Case:** User accounts, orders history, compliance audits, relational integrity.
- **Sharding Strategy:** Partitioned by \`user_id\` and date ranges for order archives.

#### Time-Series Database: TimescaleDB / ClickHouse
- **Use Case:** Tick data, price ticks, candle aggregates, execution telemetry.

#### In-Memory Cache: Redis Cluster
- **Use Case:** Order books state cache, dynamic risk limits, hot session tokens.

\`\`\`sql
-- High Performance Orders Ledger Table
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    symbol VARCHAR(16) NOT NULL,
    side VARCHAR(4) CHECK (side IN ('BUY', 'SELL')),
    price NUMERIC(18, 8) NOT NULL,
    quantity NUMERIC(18, 8) NOT NULL,
    status VARCHAR(16) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_account_status ON orders(account_id, status);
\`\`\``,

  backend: `### Backend Architecture (Microservices Paradigm)

#### Architecture Pattern
Event-Driven Microservices orchestrated via Apache Kafka / AWS Kinesis.

#### Core Services
1. **API Gateway:** Kong Gateway enforcing Rate-limiting, JWT Authentication, and TLS termination.
2. **Market Data Feed Handler (Go / Rust):** High-throughput parser consuming raw binary market streams.
3. **Order Management Service (Python FastAPI / Go):** Validates balances, manages lifecycle of buy/sell orders.
4. **Risk Verification Engine (C++ / Rust):** Sub-millisecond pre-trade check against margin rules.
5. **Notification Engine (Node.js):** Socket.io cluster managing WebSocket client sync.`,

  frontend: `### Frontend Architecture & Client Strategy

#### Framework & Tech Stack
- **Framework:** React 18 / Next.js App Router (TypeScript)
- **State Management:** Zustand + React Query (TanStack)
- **Styling:** Tailwind CSS + Shadcn UI primitives
- **Real-Time Data Layer:** HTML5 WebSockets with auto-reconnect backoff algorithm
- **Charting Engine:** Lightweight Charts / TradingView Widget integrations

#### UI Component Hierarchy
- \`<AppShell />\`
  - \`<TopNavigation />\` (Market status, account balance, notification drawer)
  - \`<TradingWorkspace />\`
    - \`<OrderBookWidget />\` (Realtime dynamic level 2 depth chart)
    - \`<ChartEngineWidget />\` (Candlestick engine with overlay indicators)
    - \`<OrderFormWidget />\` (Limit, Market, Stop-loss entry controls)
    - \`<PositionsTable />\` (Active trades, unrealized PnL, quick close)`,

  api: `### API Specifications & Endpoint Schema

#### Protocol Breakdown
- **REST Endpoints:** Account provisioning, historical reporting, billing.
- **WebSocket Feeds:** Real-time price tickers, active order book updates, balance stream.
- **gRPC:** Internal low-latency inter-service communication.

#### Key REST Endpoints

\`\`\`http
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "symbol": "BTC-USD",
  "side": "BUY",
  "type": "LIMIT",
  "price": 64250.00,
  "quantity": 0.5
}
\`\`\`

#### Response Structure

\`\`\`json
{
  "success": true,
  "order_id": "ord_88f921a4-9b12-4c8d",
  "status": "ACCEPTED",
  "timestamp": "2026-08-11T12:00:00.000Z"
}
\`\`\``,

  ai_design: `### AI System & ML Pipeline Architecture

#### Architecture Focus
Fraud Prevention, Smart Order Routing (SOR), and Predictive Slippage Modeling.

#### Model Pipeline
1. **Inference Engine:** ONNX Runtime hosted on Triton Inference Server (GPU optimized).
2. **Feature Store:** Feast feature store synced with Redis (Online features) and Snowflake (Offline features).
3. **Workflow:** 
   - Feature extraction from order payload -> Triton Inference -> Risk score in < 3ms -> Pass/Block decision.`,

  deployment: `### DevOps & Deployment Infrastructure

#### Infrastructure as Code (IaC)
- Terraform managing AWS ECS Fargate clusters, VPC Peering, and Elasticache Redis.

#### Containerization
- Docker multi-stage builds optimized for alpine/distroless minimal footprint.

#### CI/CD Pipeline
- GitHub Actions pipeline performing automated unit tests, SAST security scans, Docker image signing via Cosign, and Kubernetes Helm updates.`,

  timeline: `### Roadmap & Implementation Timeline

| Phase | Milestone | Duration | Key Deliverables |
|---|---|---|---|
| Phase 1 | Foundation & Core Ingestion | Weeks 1 - 3 | Kafka setup, Go feed handler, Database schema initialization |
| Phase 2 | Microservices & Risk Engine | Weeks 4 - 7 | Order Management API, Risk evaluation engine, Auth services |
| Phase 3 | Frontend & WebSocket UI | Weeks 8 - 10 | React dashboard, dynamic dynamic order book UI, WebSocket integrations |
| Phase 4 | Hardening & Load Testing | Weeks 11 - 12 | Chaos testing, latency profiling, security penetration test |`,

  cost: `### Infrastructure Cost Estimation (Monthly Projection)

| Component | Service Provider / Specs | Estimated Cost |
|---|---|---|
| Compute Cluster | AWS EKS / 4x c6i.2xlarge Nodes | $720 / mo |
| Database Tier | AWS Aurora PostgreSQL (Multi-AZ) | $450 / mo |
| In-Memory Cache | AWS ElastiCache Redis Cluster | $180 / mo |
| Kafka Cluster | Confluent Cloud Managed Kafka | $320 / mo |
| Network / Bandwidth | AWS Data Egress & NAT Gateways | $250 / mo |
| **Total Estimated Cost** | **Production Grade Setup** | **~$1,920 / month** |`,

  review_score: 9.4,
  messages: [
    "Requirement Analyst Agent completed specifications validation.",
    "Database Architect Agent generated schema and index topology.",
    "Backend Microservices Agent defined event-driven pipeline.",
    "Frontend UX Designer mapped component layout and state flow.",
    "DevOps Security Agent verified CI/CD and compliance matrix.",
    "Cost & Timeline Analyst computed cost estimation matrix."
  ]
};

// Centralized API handler interacting with FastAPI endpoint strictly matching schema
const apiService = {
  // Test connection to FastAPI GET /
  checkHealth: async (baseUrl) => {
    const cleanUrl = baseUrl.replace(/\/$/, "");
    const response = await fetch(`${cleanUrl}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP Error status ${response.status}`);
    }
    return await response.json();
  },

  // Call POST /generate with InputProject payload
  generateArchitecture: async (baseUrl, payload) => {
    const cleanUrl = baseUrl.replace(/\/$/, "");
    const response = await fetch(`${cleanUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        project_name: payload.project_name,
        user_prompt: payload.user_prompt
      })
    });

    if (!response.ok) {
      let errorDetail = {};
      try {
        errorDetail = await response.json();
      } catch (e) {
        errorDetail = { detail: { message: `Server error status code ${response.status}` } };
      }

      const err = new Error(
        errorDetail.detail?.message ||
        errorDetail.detail?.error ||
        `Backend returned error status ${response.status}`
      );
      err.status = response.status;
      err.payload = errorDetail;
      throw err;
    }

    return await response.json();
  }
};

// Custom lightweight markdown renderer with syntax styling & formatting
const MarkdownViewer = ({ content }) => {
  if (!content) return <div className="text-slate-500 italic">No documentation provided for this section.</div>;

  // Split into lines for structured rendering
  const lines = content.split('\n');
  
  return (
    <div className="space-y-3 text-slate-300 font-sans leading-relaxed text-sm">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-bold text-slate-100 mt-5 mb-2 border-b border-slate-800 pb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" />{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={idx} className="text-md font-semibold text-cyan-300 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl font-black text-white mt-6 mb-3">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold text-slate-100 mt-5 mb-2">{line.replace('## ', '')}</h2>;
        }

        // Code Blocks
        if (line.startsWith('```')) {
          const lang = line.replace('```', '');
          return <div key={idx} className="text-xs font-mono text-cyan-400 bg-slate-900/90 px-3 py-1 rounded-t border-t border-x border-slate-800 uppercase tracking-wider">{lang || 'code block'}</div>;
        }

        // Bullet Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const cleanText = line.trim().substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
              <span className="text-slate-300">{formatInlineFormatting(cleanText)}</span>
            </div>
          );
        }

        // Table Rows
        if (line.trim().startsWith('|')) {
          const cells = line.split('|').filter((_, i, arr) => i !== 0 && i !== arr.length - 1);
          if (line.includes('---')) return null; // Skip table header separator lines
          return (
            <div key={idx} className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2 border border-slate-800 rounded font-mono text-xs">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="truncate text-slate-300">{cell.trim()}</div>
              ))}
            </div>
          );
        }

        // Normal paragraph
        if (line.trim() === '') return <div key={idx} className="h-1"></div>;

        return <p key={idx} className="text-slate-300">{formatInlineFormatting(line)}</p>;
      })}
    </div>
  );
};

// Formatting helper for bold inline code text
function formatInlineFormatting(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function App() {
  // Config & API State
  const [apiUrl, setApiUrl] = useState(import.meta?.env?.VITE_API_URL || 'http://localhost:8000');
  const [apiConnected, setApiConnected] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Form Inputs
  const [projectName, setProjectName] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  
  // App Execution State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [errorBanner, setErrorBanner] = useState(null);

  // Current Architecture Results
  const [architecture, setArchitecture] = useState(null);
  const [history, setHistory] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  // Refs
  const generationInterval = useRef(null);

  // Initial API Check and LocalStorage History Hydration
  useEffect(() => {
    testApiConnection(apiUrl);

    // Load saved history
    try {
      const saved = localStorage.getItem('ai_arch_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Unable to load stored history', e);
    }
  }, []);

  // Health Check Test
  const testApiConnection = async (targetUrl) => {
    setIsTestingApi(true);
    setApiError(null);
    try {
      await apiService.checkHealth(targetUrl);
      setApiConnected(true);
    } catch (err) {
      setApiConnected(false);
      setApiError(err.message || 'Could not connect to FastAPI server');
    } finally {
      setIsTestingApi(false);
    }
  };

  // Helper to save current result to local state
  const saveToHistory = (archResult) => {
    const item = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      project_name: archResult.project_name || 'Untitled Architecture',
      review_score: archResult.review_score || 8.0,
      data: archResult
    };
    const updated = [item, ...history.filter(h => h.project_name !== archResult.project_name)].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem('ai_arch_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Preset Template Selection
  const applyTemplate = (tpl) => {
    setProjectName(tpl.projectName);
    setUserPrompt(tpl.prompt);
  };

  // Main Action: Submit Form and Call Endpoint
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    
    // Client Validation based on API spec (min_length validation)
    if (!projectName || projectName.trim().length < 4) {
      setErrorBanner('Project Name must be at least 4 characters long.');
      return;
    }
    if (!userPrompt || userPrompt.trim().length < 15) {
      setErrorBanner('Project description must be at least 15 characters long.');
      return;
    }

    setErrorBanner(null);
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulated progress steps for better UX during network request
    let stepCount = 1;
    generationInterval.current = setInterval(() => {
      stepCount = (stepCount % 5) + 1;
      setGenerationStep(stepCount);
    }, 1800);

    const payload = {
      project_name: projectName.trim(),
      user_prompt: userPrompt.trim()
    };

    try {
      let resultData;

      if (demoMode || !apiConnected) {
        // Fallback demo generation simulation when offline
        await new Promise(res => setTimeout(res, 3500));
        resultData = {
          success: true,
          project_name: payload.project_name,
          architecture: {
            ...SAMPLE_MOCK_ARCHITECTURE,
            project_name: payload.project_name,
            user_prompt: payload.user_prompt
          }
        };
      } else {
        // Actual FastAPI call POST /generate
        resultData = await apiService.generateArchitecture(apiUrl, payload);
      }

      if (resultData && resultData.architecture) {
        setArchitecture(resultData.architecture);
        saveToHistory(resultData.architecture);
        setActiveTab('overview');
      } else {
        throw new Error('Unexpected response format from server.');
      }
    } catch (err) {
      console.error('Generation Error:', err);
      let msg = err.message || 'An unexpected error occurred during generation.';
      if (err.status === 422) {
        msg = 'Validation Error: Please verify inputs meet backend length rules (Min 4 chars name, 15 chars description).';
      } else if (err.status === 504) {
        msg = 'Timeout Error: Architecture generation took too long. Please retry.';
      } else if (err.status === 503) {
        msg = 'Service Connection Error: Unable to reach external AI models.';
      }
      setErrorBanner(msg);
    } finally {
      clearInterval(generationInterval.current);
      setIsGenerating(false);
    }
  };

  // Copy full architecture JSON or markdown section
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Client-Side Print Report Trigger
  const handlePrintReport = () => {
    window.print();
  };

  const NAV_SECTIONS = [
    { id: 'overview', label: 'Overview & Metrics', icon: Layers },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'database', label: 'Database Model', icon: Database },
    { id: 'backend', label: 'Backend Architecture', icon: Server },
    { id: 'frontend', label: 'Frontend & UI Strategy', icon: Layout },
    { id: 'api', label: 'API Specs & Interfaces', icon: Code },
    { id: 'ai_design', label: 'AI & ML System Design', icon: Cpu },
    { id: 'deployment', label: 'DevOps & Deployment', icon: Globe },
    { id: 'timeline', label: 'Roadmap & Timeline', icon: Clock },
    { id: 'cost', label: 'Cost Analysis', icon: DollarSign },
    { id: 'review', label: 'Score & Quality Review', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Architect.AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                v1.0 SaaS Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* API Status Badge */}
            <button
              onClick={() => setIsConfigOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                apiConnected
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:border-emerald-500'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/60 hover:border-amber-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{apiConnected ? 'API Connected' : 'Demo Mode (Offline)'}</span>
              <Settings className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </button>

            {/* Quick Actions */}
            {architecture && (
              <button
                onClick={handlePrintReport}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ERROR BANNER IF PRESENT */}
      {errorBanner && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 px-4 py-3 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: ARCHITECTURE GENERATOR & PROMPT CONTROL (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PROJECT CREATION CARD */}
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4" />
                <span>AI Agent Workflow</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Generate Software Architecture</h2>
              <p className="text-xs text-slate-400 mb-6">
                Specify your software idea. LangGraph AI agents will synthesize database models, microservices, frontends, APIs, and cost estimation.
              </p>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Project Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={4}
                    placeholder="e.g. TradePulse AI"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Min 4 characters (FastAPI constraint)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Software Prompt / Idea <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    required
                    minLength={15}
                    rows={5}
                    placeholder="Describe your software requirements, latency needs, database preferences, tech stack, and scale targets..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition resize-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Min 15 characters detailed specification</span>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isGenerating
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-cyan-500/20 active:scale-[0.99]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Synthesizing Architecture...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Architecture</span>
                    </>
                  )}
                </button>
              </form>

              {/* QUICK STARTER TEMPLATES */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
                  Or load a starter blueprint:
                </span>
                <div className="space-y-2">
                  {PROMPT_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyTemplate(tpl)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
                    >
                      <span className="truncate pr-2 font-medium">{tpl.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* GENERATION PROGRESS TERMINAL (VISIBLE WHEN GENERATING) */}
            {isGenerating && (
              <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 font-mono text-xs text-slate-300 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>LangGraph Agent Stream</span>
                  </div>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Step {generationStep}/5
                  </span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className={`flex items-center gap-2 ${generationStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Analyzing project prompt & validating parameters...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${generationStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Synthesizing Relational & Vector schemas...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${generationStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mapping REST/WebSocket contracts & Microservices...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${generationStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Evaluating DevOps topology & Infrastructure Costs...</span>
                  </div>
                  <div className={`flex items-center gap-2 ${generationStep >= 5 ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`}>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Computing final score & compile blueprint...</span>
                  </div>
                </div>
              </div>
            )}

            {/* SAVED BLUEPRINT HISTORY */}
            {history.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
                    <History className="w-4 h-4 text-cyan-400" />
                    <span>History ({history.length})</span>
                  </div>
                  <button
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem('ai_arch_history');
                    }}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => setArchitecture(h.data)}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                          {h.project_name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                        {h.review_score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: BLUEPRINT DISPLAY & INTERACTIVE TABS (8 COLS) */}
          <div className="lg:col-span-8">
            {architecture ? (
              <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                
                {/* BLUEPRINT TOP BANNER */}
                <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Architecture Complete</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{architecture.project_name}</h1>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-1">{architecture.user_prompt}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Review Score</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">
                        {architecture.review_score ? architecture.review_score.toFixed(1) : '9.0'} / 10
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(JSON.stringify(architecture, null, 2))}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
                      title="Copy Full Architecture JSON"
                    >
                      {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* HORIZONTAL TAB NAVIGATION BAR */}
                <div className="border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none">
                  <div className="flex px-4 min-w-max">
                    {NAV_SECTIONS.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all ${
                            isActive
                              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAB CONTENT AREA */}
                <div className="p-6">
                  {/* OVERVIEW DASHBOARD TAB */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">System Topology</span>
                          <div className="text-sm font-bold text-white mt-1">Microservices / Cloud-Native</div>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">Database Stack</span>
                          <div className="text-sm font-bold text-cyan-400 mt-1">Relational + In-Memory</div>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">Quality Score</span>
                          <div className="text-sm font-bold text-emerald-400 mt-1">{architecture.review_score} / 10 Optimal</div>
                        </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          Architecture Blueprint Summary
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          This AI architecture blueprint was computed using multi-agent workflow synthesis. Explore individual tabs to view data schemas, microservices topologies, API specifications, and infrastructure cost models.
                        </p>
                      </div>

                      {/* Workflow Messages log */}
                      {architecture.messages && architecture.messages.length > 0 && (
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                          <div className="text-[10px] text-slate-500 uppercase mb-2">Agent Execution Logs (`messages`)</div>
                          <div className="space-y-1">
                            {architecture.messages.map((msg, i) => (
                              <div key={i} className="text-slate-400 flex items-start gap-2">
                                <span className="text-cyan-500 shrink-0">&gt;</span>
                                <span>{msg}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* REQUIREMENTS */}
                  {activeTab === 'requirements' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.requirements} />
                    </div>
                  )}

                  {/* DATABASE */}
                  {activeTab === 'database' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.database} />
                    </div>
                  )}

                  {/* BACKEND */}
                  {activeTab === 'backend' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.backend} />
                    </div>
                  )}

                  {/* FRONTEND */}
                  {activeTab === 'frontend' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.frontend} />
                    </div>
                  )}

                  {/* API */}
                  {activeTab === 'api' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.api} />
                    </div>
                  )}

                  {/* AI DESIGN */}
                  {activeTab === 'ai_design' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.ai_design} />
                    </div>
                  )}

                  {/* DEPLOYMENT */}
                  {activeTab === 'deployment' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.deployment} />
                    </div>
                  )}

                  {/* TIMELINE */}
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.timeline} />
                    </div>
                  )}

                  {/* COST */}
                  {activeTab === 'cost' && (
                    <div className="space-y-4">
                      <MarkdownViewer content={architecture.cost} />
                    </div>
                  )}

                  {/* REVIEW SCORE */}
                  {activeTab === 'review' && (
                    <div className="space-y-6">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 font-bold text-2xl">
                          {architecture.review_score}
                        </div>
                        <h3 className="text-lg font-bold text-white">Architectural Compliance Score</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Evaluated against scalability, security, microservices decouplings, and cloud redundancy standards.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-cyan-400">
                  <Terminal className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Architecture Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                  Enter your software project name and detailed functional requirements on the left, then click <strong>"Generate Architecture"</strong> to run the LangGraph workflow.
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Supports FastAPI Backend & Offline Fallback Mode</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CONFIG MODAL FOR FASTAPI SETTINGS */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Backend API Connection Settings</span>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                  FastAPI Endpoint URL (<code className="text-cyan-400">VITE_API_URL</code>)
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Force Demo Mode</div>
                  <div className="text-[10px] text-slate-500">Simulate response when backend API is offline</div>
                </div>
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {apiError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Connection Failed</span>
                    <span className="text-[11px] opacity-90">{apiError}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => testApiConnection(apiUrl)}
                disabled={isTestingApi}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
              >
                {isTestingApi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                <span>Test Connection</span>
              </button>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}