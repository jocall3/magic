```typescript
import React, { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- SECTION 1: EXPANDED DATA STRUCTURES & TYPES ---
// Self-contained app-like data models defining the future of finance.

type Region = 'NA' | 'EU' | 'APAC' | 'LATAM' | 'META' | 'ORBITAL';
type Sector = 'Tech' | 'Finance' | 'BioSynth' | 'Energy' | 'Logistics' | 'Media';
type Trend = 'up' | 'down' | 'stable' | 'volatile';
type ViewMode = 'BALCONY' | 'HFT_TERMINAL' | 'SENTIMENT_NEXUS' | 'QUANTUM_RISK_MATRIX' | 'GEOPOLITICAL_DASHBOARD' | 'SECTOR_ANALYSIS';

interface CompanyData {
  id: string;
  name: string;
  index: number;
  region: Region;
  sector: Sector;
  trend: Trend;
  marketCap: number; // In Billions
  volatility: number; // 0 to 1
  sentiment: number; // -1 (negative) to 1 (positive)
  aiConfidence: number; // 0 to 1, AI's confidence in its sentiment analysis
  quantumRisk: number; // 0 to 1, exposure to quantum computing threats
  daoInfluence: number; // 0 to 1, influence from decentralized autonomous orgs
  esgScore: number; // 0-100
  debtRatio: number; // 0-1
  memeFactor: number; // 0-1, social media influence
  geopoliticalExposure: { [key in Region]?: number }; // 0-1 exposure to other regions
  lastTrade: { price: number; size: number; time: number };
  tradeHistory: { price: number; time: number }[];
}

interface HFTLog {
  id: number;
  companyId: string;
  companyName: string;
  type: 'BUY' | 'SELL';
  price: number;
  volume: number;
  timestamp: number;
  algo: 'Momentum' | 'Arbitrage' | 'MeanReversion';
}

interface RegionData {
  risk: number; // 0-1
  economicGrowth: number; // -0.1 to 0.1
}

interface NewsEvent {
  id: number;
  title: string;
  target: 'sector' | 'region' | 'company';
  targetId: string;
  impact: number; // -1 to 1
  timestamp: number;
}

interface AppState {
  companies: CompanyData[];
  hftLogs: HFTLog[];
  regions: { [key in Region]: RegionData };
  newsEvents: NewsEvent[];
  time: number;
  viewMode: ViewMode;
  selectedCompanyId: string | null;
  simulationSpeed: number; // ms per tick
}

type AppAction =
  | { type: 'INIT'; payload: { companies: CompanyData[]; regions: { [key in Region]: RegionData } } }
  | { type: 'TICK_UPDATE' }
  | { type: 'HFT_BURST' }
  | { type: 'CHANGE_VIEW'; payload: ViewMode }
  | { type: 'SELECT_COMPANY'; payload: string | null }
  | { type: 'SET_SIMULATION_SPEED'; payload: number };

// --- SECTION 2: MOCK DATA & SIMULATION CORE ---
// Inventing the companies that define the future. World-record level of detail.

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank', 'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin', 'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys', 'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys', 'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys', 'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys', 'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys', 'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys', 'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys', 'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys', 'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade', 'HeliosPrime', 'Cyborgic', 'NeuroNet', 'BioSynth', 'GeoCore', 'AquaGen', 'AeroDynamics', 'Starlight Ventures', 'VoidTech'
];

const REGIONS: Region[] = ['NA', 'EU', 'APAC', 'LATAM', 'META', 'ORBITAL'];
const SECTORS: Sector[] = ['Tech', 'Finance', 'BioSynth', 'Energy', 'Logistics', 'Media'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.map((name, i) => {
    const baseIndex = 1000 + Math.random() * 500;
    const initialPrice = parseFloat(baseIndex.toFixed(2));
    const region = REGIONS[i % REGIONS.length];
    return {
      id: `${name}-${i}`,
      name,
      index: initialPrice,
      region,
      sector: SECTORS[i % SECTORS.length],
      trend: ['up', 'down', 'stable', 'volatile'][i % 4] as Trend,
      marketCap: 100 + Math.pow(Math.random(), 3) * 5000,
      volatility: Math.random() * 0.5 + 0.1,
      sentiment: (Math.random() - 0.5) * 2,
      aiConfidence: Math.random() * 0.4 + 0.6,
      quantumRisk: name.includes('Ledger') || name.includes('Secure') ? Math.random() * 0.6 + 0.2 : Math.random() * 0.2,
      daoInfluence: Math.random() * 0.3,
      esgScore: 40 + Math.random() * 50, // 40-90
      debtRatio: Math.random() * 0.8, // 0-0.8
      memeFactor: Math.random() > 0.9 ? Math.random() : 0, // 10% chance of being a meme stock
      geopoliticalExposure: Object.fromEntries(
        REGIONS.filter(r => r !== region).map(r => [r, Math.random() * 0.5])
      ) as { [key in Region]?: number },
      lastTrade: { price: initialPrice, size: 0, time: Date.now() },
      tradeHistory: Array.from({ length: 50 }, (_, k) => ({ price: initialPrice * (1 + (Math.random() - 0.5) * 0.02), time: Date.now() - (50 - k) * 1000 })),
    };
  });
};

const generateInitialRegions = (): { [key in Region]: RegionData } => {
  return Object.fromEntries(
    REGIONS.map(r => [r, { risk: Math.random() * 0.3, economicGrowth: (Math.random() - 0.4) * 0.01 }])
  ) as { [key in Region]: RegionData };
};

// --- SECTION 3: STATE MANAGEMENT (REDUCER LOGIC) ---
// Fully coded logical conclusions for market state transitions.

let hftLogCounter = 0;
let newsEventCounter = 0;
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        companies: action.payload.companies,
        regions: action.payload.regions,
        selectedCompanyId: action.payload.companies[0]?.id || null,
      };
    case 'TICK_UPDATE':
      // Update regional data
      const updatedRegions = { ...state.regions };
      for (const regionKey in updatedRegions) {
        const region = updatedRegions[regionKey as Region];
        region.risk += (Math.random() - 0.5) * 0.01;
        region.risk = Math.max(0, Math.min(1, region.risk));
        region.economicGrowth += (Math.random() - 0.5) * 0.0005;
        region.economicGrowth = Math.max(-0.1, Math.min(0.1, region.economicGrowth));
      }

      // Check for new news events
      let newEvent: NewsEvent | null = null;
      if (Math.random() < 0.05) { // 5% chance of a news event per tick
        const targetType = ['sector', 'region'][Math.floor(Math.random() * 2)];
        const targetId = targetType === 'sector'
          ? SECTORS[Math.floor(Math.random() * SECTORS.length)]
          : REGIONS[Math.floor(Math.random() * REGIONS.length)];
        const impact = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25
        newEvent = {
          id: newsEventCounter++,
          title: `Major ${impact > 0 ? 'Breakthrough' : 'Setback'} in ${targetId} ${targetType}`,
          target: targetType as 'sector' | 'region',
          targetId,
          impact,
          timestamp: Date.now(),
        };
      }
      const updatedNewsEvents = newEvent ? [newEvent, ...state.newsEvents].slice(0, 10) : state.newsEvents;

      return {
        ...state,
        time: state.time + 1,
        regions: updatedRegions,
        newsEvents: updatedNewsEvents,
        companies: state.companies.map(c => {
          // Base factors
          const sentimentDrift = (c.sentiment * 0.005) + ((Math.random() - 0.5) * 0.001);
          const volatilityFactor = (Math.random() - 0.5) * c.volatility * 0.1;

          // GEIN - Global Economic Interaction Network factors
          const homeRegion = updatedRegions[c.region];
          const regionalRiskFactor = -homeRegion.risk * 0.002;
          const regionalGrowthFactor = homeRegion.economicGrowth * 0.1;
          
          const geopoliticalExposureFactor = Object.entries(c.geopoliticalExposure)
            .reduce((acc, [region, exposure]) => {
              return acc - (updatedRegions[region as Region].risk * (exposure ?? 0) * 0.001);
            }, 0);

          // News event impact
          const eventImpactFactor = updatedNewsEvents.reduce((acc, event) => {
            if ((event.target === 'region' && event.targetId === c.region) ||
                (event.target === 'sector' && event.targetId === c.sector)) {
              return acc + event.impact * 0.01;
            }
            return acc;
          }, 0);

          // Internal company factors
          const esgFactor = (c.esgScore - 60) / 1000 * 0.005; // bonus for >60, penalty for <60
          const debtFactor = -c.debtRatio * 0.001;
          const memeFactor = c.memeFactor > 0 ? (Math.random() - 0.5) * c.memeFactor * 0.2 : 0;

          // Combine all factors for the new index
          const totalDrift = sentimentDrift + volatilityFactor + regionalRiskFactor + regionalGrowthFactor + geopoliticalExposureFactor + eventImpactFactor + esgFactor + debtFactor + memeFactor;
          let newIndex = c.index * (1 + totalDrift);

          if (newIndex < 800) newIndex = 800 + Math.random() * 50;
          if (newIndex > 1800) newIndex = 1800 - Math.random() * 50;
          
          const newHistory = [...c.tradeHistory.slice(1), { price: newIndex, time: Date.now() }];

          return { ...c, index: newIndex, tradeHistory: newHistory };
        }),
      };
    case 'HFT_BURST':
      const newLogs: HFTLog[] = [];
      const updatedCompanies = state.companies.map(c => {
        if (Math.random() < 0.2) { // 20% chance of a burst for each company
          let newPrice = c.index;
          for (let i = 0; i < 5; i++) { // 5 trades per burst
            const tradeVolume = Math.floor(Math.random() * 1000) + 100;
            const priceImpact = (Math.random() - 0.5) * 0.005 * (tradeVolume / 500);
            newPrice *= (1 + priceImpact);
            newLogs.push({
              id: hftLogCounter++,
              companyId: c.id,
              companyName: c.name,
              type: priceImpact > 0 ? 'BUY' : 'SELL',
              price: newPrice,
              volume: tradeVolume,
              timestamp: Date.now(),
              algo: ['Momentum', 'Arbitrage', 'MeanReversion'][hftLogCounter % 3] as any,
            });
          }
          const newHistory = [...c.tradeHistory.slice(5), ...newLogs.filter(l => l.companyId === c.id).map(l => ({ price: l.price, time: l.timestamp }))];
          return { ...c, index: newPrice, lastTrade: { price: newPrice, size: newLogs[newLogs.length-1].volume, time: Date.now() }, tradeHistory: newHistory };
        }
        return c;
      });
      return {
        ...state,
        companies: updatedCompanies,
        hftLogs: [...newLogs, ...state.hftLogs].slice(0, 100),
      };
    case 'CHANGE_VIEW':
      return { ...state, viewMode: action.payload, selectedCompanyId: null };
    case 'SELECT_COMPANY':
      return { ...state, selectedCompanyId: action.payload };
    case 'SET_SIMULATION_SPEED':
      return { ...state, simulationSpeed: action.payload };
    default:
      return state;
  }
};

// --- SECTION 4: SUB-COMPONENTS (APPS WITHIN THE APP) ---
// A design expert's approach to modular, self-contained views.

// --- 4.1: The Control Panel Form ---
const MarketViewControls: React.FC<{ dispatch: React.Dispatch<AppAction>; currentState: AppState }> = ({ dispatch, currentState }) => {
  const { viewMode, simulationSpeed } = currentState;
  return (
    <div className="p-4 bg-gray-900 border-r border-yellow-700 flex flex-col space-y-4">
      <h3 className="text-lg font-bold text-yellow-400">Control Nexus</h3>
      <div className="flex flex-col space-y-2">
        {(['BALCONY', 'HFT_TERMINAL', 'SENTIMENT_NEXUS', 'QUANTUM_RISK_MATRIX', 'GEOPOLITICAL_DASHBOARD', 'SECTOR_ANALYSIS'] as ViewMode[]).map(v => (
          <button
            key={v}
            onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: v })}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === v ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            {v.replace('_', ' ')}
          </button>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">Simulation Speed (ms/tick)</label>
        <input
          type="range"
          min="50"
          max="2000"
          step="50"
          value={simulationSpeed}
          onChange={(e) => dispatch({ type: 'SET_SIMULATION_SPEED', payload: parseInt(e.target.value, 10) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center text-xs text-yellow-400 mt-1">{simulationSpeed}ms</div>
      </div>
    </div>
  );
};

// --- 4.2: The Prosperity Balcony (Original View, Enhanced) ---
const MarketPoint3D: React.FC<{ cx?: number; cy?: number; payload: any; color: string }> = ({ cx, cy, payload }) => {
  const effectiveSize = Math.sqrt(payload.size) * 1.5;
  return <circle cx={cx} cy={cy} r={effectiveSize / 4 + 2} fill={payload.color} opacity={0.8} stroke="#fff" strokeWidth={1} />;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload.payload as CompanyData;
    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono w-64">
        <p className="font-bold text-yellow-400 mb-1 text-base">{data.name}</p>
        <p>Region: <span className="font-semibold">{data.region}</span></p>
        <p>Index: <span className={`font-bold ${data.trend === 'up' ? 'text-green-400' : data.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{data.index.toFixed(2)}</span></p>
        <p>Market Cap: <span className="font-semibold">${data.marketCap.toFixed(0)}B</span></p>
        <div className="mt-2 pt-2 border-t border-gray-700 space-y-1">
          <p>Sector: <span className="font-semibold">{data.sector}</span></p>
          <p>Sentiment: <span className="text-blue-300">{(data.sentiment * 100).toFixed(1)}%</span> (AI Conf: {(data.aiConfidence * 100).toFixed(0)}%)</p>
          <p>Quantum Risk: <span className="text-purple-400">{(data.quantumRisk * 100).toFixed(1)}%</span></p>
          <p>DAO Influence: <span className="text-pink-400">{(data.daoInfluence * 100).toFixed(1)}%</span></p>
          <p>ESG Score: <span className="text-teal-400">{data.esgScore.toFixed(1)}</span></p>
          <p>Debt Ratio: <span className="text-orange-400">{(data.debtRatio * 100).toFixed(1)}%</span></p>
          {data.memeFactor > 0 && <p className="text-yellow-300 animate-pulse">Meme Factor: {(data.memeFactor * 100).toFixed(0)}%</p>}
        </div>
      </div>
    );
  }
  return null;
};

const ProsperityBalconyView: React.FC<{ companies: CompanyData[]; time: number }> = ({ companies, time }) => {
  const regionOrder: Region[] = ['NA', 'EU', 'APAC', 'LATAM', 'META', 'ORBITAL'];
  const scatterPoints = useMemo(() => companies.map(d => {
    const regionXPosition = regionOrder.indexOf(d.region);
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981';
    if (d.trend === 'down') color = '#EF4444';
    if (d.trend === 'volatile') color = '#F59E0B';
    return { x: regionXPosition + (Math.random() - 0.5) * 0.4, y: d.index, size: d.marketCap, color, payload: d };
  }), [companies]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold text-yellow-400 mb-1">The Balcony of Prosperity: Global Market Index ({time})</h2>
      <p className="text-sm text-gray-400 mb-4">Simulated 3D market perspective. Size represents Market Cap. Height represents Index Value.</p>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={[{}]} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="x" type="number" domain={[-0.5, regionOrder.length - 0.5]} ticks={regionOrder.map((_, i) => i)} tickFormatter={(tick) => regionOrder[tick]} stroke="#9CA3AF" label={{ value: 'Geographic & Virtual Regions', position: 'bottom', fill: '#D1D5DB', dy: 10 }} />
          <YAxis domain={[800, 1800]} stroke="#9CA3AF" label={{ value: 'Index Level', angle: -90, position: 'left', fill: '#D1D5DB' }} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={scatterPoints} shape={(props: any) => <MarketPoint3D {...props} />} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 4.3: High-Frequency Trading Terminal ---
const HFTTerminalView: React.FC<{ state: AppState; dispatch: React.Dispatch<AppAction> }> = ({ state, dispatch }) => {
  const { companies, selectedCompanyId, hftLogs } = state;
  const selectedCompany = useMemo(() => companies.find(c => c.id === selectedCompanyId), [companies, selectedCompanyId]);

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4">
      <div className="col-span-1 flex flex-col bg-gray-900 p-2 rounded-lg">
        <h3 className="text-yellow-400 font-bold mb-2">Market Movers</h3>
        <div className="overflow-y-auto flex-grow">
          {companies.map(c => (
            <div
              key={c.id}
              onClick={() => dispatch({ type: 'SELECT_COMPANY', payload: c.id })}
              className={`p-2 rounded cursor-pointer text-xs mb-1 ${selectedCompanyId === c.id ? 'bg-yellow-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <div className="flex justify-between font-bold">
                <span>{c.name}</span>
                <span className={c.index > c.tradeHistory[c.tradeHistory.length-2]?.price ? 'text-green-400' : 'text-red-400'}>
                  {c.index.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 flex flex-col">
        {selectedCompany ? (
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg text-yellow-400 font-bold">{selectedCompany.name} - Price Chart</h3>
              <ResponsiveContainer width="100%" height="90%">
                <ComposedChart data={selectedCompany.tradeHistory}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString()} stroke="#9CA3AF" hide />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }} />
                  <Area type="monotone" dataKey="price" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.2} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 bg-gray-900 p-2 rounded-lg flex flex-col">
              <h3 className="text-yellow-400 font-bold mb-2">HFT Trade Blotter (Live)</h3>
              <div className="overflow-y-auto font-mono text-xs flex-grow">
                {hftLogs.map(log => (
                  <div key={log.id} className={`grid grid-cols-5 gap-2 p-1 ${log.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{new Date(log.timestamp).toLocaleTimeString('en-GB',{hour12:false})}</span>
                    <span className="font-bold">{log.companyName.substring(0,10)}</span>
                    <span>{log.type}</span>
                    <span>Vol: {log.volume}</span>
                    <span>@{log.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
            <p className="text-gray-400">Select a company to view HFT data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 4.4 & 4.5: Future-Forward Dashboards ---
const GlobalSentimentNexusView: React.FC<{ companies: CompanyData[] }> = ({ companies }) => {
    const regionalSentiment = useMemo(() => {
        const sentimentMap = new Map<Region, { sum: number; count: number; confidence: number }>();
        for (const company of companies) {
            if (!sentimentMap.has(company.region)) {
                sentimentMap.set(company.region, { sum: 0, count: 0, confidence: 0 });
            }
            const regionData = sentimentMap.get(company.region)!;
            regionData.sum += company.sentiment;
            regionData.confidence += company.aiConfidence;
            regionData.count++;
        }
        return Array.from(sentimentMap.entries()).map(([region, data]) => ({
            name: region,
            sentiment: (data.sum / data.count) * 100,
            aiConfidence: (data.confidence / data.count) * 100,
        }));
    }, [companies]);

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-yellow-400 mb-1">Global Sentiment Nexus</h2>
            <p className="text-sm text-gray-400 mb-4">AI-driven sentiment analysis across all market regions.</p>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart layout="vertical" data={regionalSentiment} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[-100, 100]} stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }} />
                    <Legend />
                    <Bar dataKey="sentiment" name="Avg. Sentiment (%)" barSize={20} fill="#3B82F6" />
                    <Bar dataKey="aiConfidence" name="AI Confidence (%)" barSize={20} fill="#8B5CF6" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const QuantumRiskMatrixView: React.FC<{ companies: CompanyData[] }> = ({ companies }) => {
    const riskData = useMemo(() => {
        return companies.slice(0, 20).map(c => ({
            name: c.name,
            risk: c.quantumRisk * 100,
            marketCap: c.marketCap,
        })).sort((a, b) => b.risk - a.risk);
    }, [companies]);

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-yellow-400 mb-1">Quantum Risk Matrix</h2>
            <p className="text-sm text-gray-400 mb-4">Top 20 companies by simulated exposure to quantum decryption threats.</p>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 8 }} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis yAxisId="left" orientation="left" stroke="#EC4899" label={{ value: 'Risk %', angle: -90, position: 'left', fill: '#EC4899' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6366F1" label={{ value: 'Market Cap ($B)', angle: 90, position: 'right', fill: '#6366F1' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="risk" name="Quantum Risk" fill="#EC4899" />
                    <Line yAxisId="right" type="monotone" dataKey="marketCap" name="Market Cap" stroke="#6366F1" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- 4.6 & 4.7: GEIN (Global Economic Interaction Network) Dashboards ---
const GeopoliticalDashboardView: React.FC<{ regions: { [key in Region]: RegionData }, news: NewsEvent[] }> = ({ regions, news }) => {
    const regionData = useMemo(() => {
        return Object.entries(regions).map(([name, data]) => ({
            name,
            risk: data.risk * 100,
            growth: data.economicGrowth * 1000, // Basis points
        }));
    }, [regions]);

    return (
        <div className="w-full h-full grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
                <h2 className="text-xl font-bold text-yellow-400 mb-1">Geopolitical Dashboard</h2>
                <p className="text-sm text-gray-400 mb-4">Real-time risk and growth analysis by region.</p>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={regionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis yAxisId="left" orientation="left" stroke="#EC4899" label={{ value: 'Risk %', angle: -90, position: 'left', fill: '#EC4899' }} />
                        <YAxis yAxisId="right" orientation="right" stroke