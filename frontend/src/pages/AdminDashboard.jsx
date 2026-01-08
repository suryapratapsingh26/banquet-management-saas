import React, { useEffect, useState, useMemo } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState('this_month');

  const { token } = useAuth();
  useEffect(() => { fetchAll(); }, [user, token]);

  const fetchAll = async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const [dashRes, eventsRes, quotesRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/events`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/quotations`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (dashRes.ok) {
        const d = await dashRes.json();
        setStats(d.stats || {});
      }
      if (eventsRes.ok) {
        const ev = await eventsRes.json();
        setEvents(ev || []);
      }
      if (quotesRes.ok) {
        const q = await quotesRes.json();
        setQuotes(q || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const revenueSeries = useMemo(() => {
    // Build daily revenue map from quotations joined to events
    const map = {};
    quotes.forEach(q => {
      const date = q.event?.startDate ? new Date(q.event.startDate).toISOString().slice(0,10) : null;
      if (!date) return;
      map[date] = (map[date] || 0) + (q.totalAmount || 0);
    });
    // Convert to sorted array for current month
    const entries = Object.keys(map).sort().map(d => ({ date: d, amount: map[d] }));
    return entries;
  }, [quotes]);

  const todaysEvents = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(),23,59,59,999);
    return events.filter(ev => new Date(ev.startDate) >= start && new Date(ev.startDate) <= end);
  }, [events]);

  if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;
  if (!stats) return <div className="p-8 text-center">Dashboard data unavailable.</div>;

  return (
    <div className="p-6 bg-white min-h-screen space-y-6">
      {/* Top */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-sm text-gray-500">Overview for {stats.adminName || user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* SECTION A - PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <PerfCard label="Total Events (MTD)" value={stats?.bookingOverview?.confirmed || stats?.totalEvents || 0} onClick={() => navigate('/events')} />
        <PerfCard label="Total Revenue (MTD)" value={`₹${(stats.monthlyRevenue || 0).toLocaleString()}`} onClick={() => navigate('/billing')} />
        <PerfCard label="Events Today" value={stats.todayEvents || todaysEvents.length} onClick={() => navigate('/events?filter=today')} />
        <PerfCard label="Readiness %" value={`${stats.eventReadiness || 0}%`} onClick={() => navigate('/audits')} />
        <PerfCard label="Outstanding Payments" value={`₹${(stats.pendingPayments || 0).toLocaleString()}`} onClick={() => navigate('/billing?tab=receivables')} />
      </div>

      {/* SECTION B + C */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Total Revenue</h3>
            <div className="space-x-2 text-sm">
              <button className={`px-3 py-1 rounded ${revenueRange==='this_month'?'bg-pink-600 text-white':'bg-gray-50'}`} onClick={()=>setRevenueRange('this_month')}>This Month</button>
              <button className={`px-3 py-1 rounded ${revenueRange==='last_month'?'bg-pink-600 text-white':'bg-gray-50'}`} onClick={()=>setRevenueRange('last_month')}>Last Month</button>
            </div>
          </div>
          <RevenueChart series={revenueSeries} onPointClick={(date)=>{ const d = date; const filtered = events.filter(e=>e.startDate && e.startDate.startsWith(d)); if(filtered.length) navigate(`/events`); }} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-3">Operational Health</h3>
          <div className="space-y-3">
            <SmallStat label="SLA Breaches" value={Math.max(0, (100 - (stats.slaCompliance||100)))} tone={stats.slaCompliance>90?'green':(stats.slaCompliance>75?'amber':'red')} />
            <SmallStat label="Audit Failures" value={stats.auditFailureRate || 0} tone={(stats.auditFailureRate||0)>10?'red':'green'} />
            <SmallStat label="Pending Approvals" value={stats.pendingApprovals || 0} tone={(stats.pendingApprovals||0)>0?'amber':'green'} />

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Alerts</h4>
              <div className="space-y-2">
                {(stats.alerts || []).map((alert, i) => {
                  const msg = typeof alert === 'string' ? alert : alert.message || 'Alert';
                  const eventId = alert && typeof alert === 'object' ? alert.eventId : null;
                  const focus = alert && typeof alert === 'object' ? alert.focus : null;
                  const href = eventId ? `/events/${eventId}${focus?`?focus=${focus}`:''}` : null;
                  return (
                    <div key={i} className="flex items-start justify-between p-3 bg-yellow-50 border border-yellow-100 rounded">
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-600 mt-0.5">⚠️</span>
                        {href ? (
                          <a href={href} className="text-sm text-yellow-800 font-medium hover:underline">{msg}</a>
                        ) : (
                          <p className="text-sm text-yellow-800 font-medium">{msg}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION D + E */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-3">Today's Events</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="px-2 py-1">Event Name</th>
                <th className="px-2 py-1">Hall</th>
                <th className="px-2 py-1">Time Slot</th>
                <th className="px-2 py-1">Pax</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Readiness</th>
              </tr>
            </thead>
            <tbody>
              {todaysEvents.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>navigate(`/events/${ev.id}`)}>
                  <td className="px-2 py-2">{ev.title}</td>
                  <td className="px-2 py-2">{ev.hall?.name || '—'}</td>
                  <td className="px-2 py-2">{ev.timeSlotId || '—'}</td>
                  <td className="px-2 py-2">{ev.guests || '—'}</td>
                  <td className="px-2 py-2">{ev.status}</td>
                  <td className="px-2 py-2">{Math.round(Math.random()*100)}%</td>
                </tr>
              ))}
              {todaysEvents.length===0 && (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">No events today</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-3">Financial Snapshot</h3>
          <div className="space-y-3">
            <div className="p-3 bg-pink-50 rounded border" style={{borderColor:'#E0E0E0'}}>
              <p className="text-xs text-gray-600">Outstanding Payments</p>
              <p className="text-xl font-bold">₹{(stats.pendingPayments || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border" style={{borderColor:'#E0E0E0'}}>
              <p className="text-xs text-gray-600">Vendor Payables</p>
              <p className="text-xl font-bold">₹{(120000).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION F - RECENT ACTIVITY */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3">Recent Activity</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {(stats.alerts || []).map((a,i)=> (
            <li key={i} className="p-2 border rounded bg-gray-50">{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PerfCard({ label, value, onClick }) {
  return (
    <div onClick={onClick} className="p-4 rounded-xl" style={{ backgroundColor: '#FCE4EC', border: '1px solid #E0E0E0', cursor: 'pointer' }}>
      <p className="text-xs font-bold uppercase text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function SmallStat({ label, value, tone }) {
  const toneClasses = tone === 'green' ? 'text-green-700 bg-green-50' : tone === 'amber' ? 'text-orange-700 bg-orange-50' : 'text-red-700 bg-red-50';
  return (
    <div className={`p-3 rounded border ${toneClasses}`} style={{borderColor:'#E0E0E0'}}>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function RevenueChart({ series, onPointClick }) {
  // Simple sparkline/area using SVG
  const width = 700; const height = 200; const pad = 20;
  if (!series || series.length === 0) return <div className="p-8 text-center text-gray-400">No revenue data</div>;

  const amounts = series.map(s=>s.amount);
  const max = Math.max(...amounts);
  const stepX = (width - pad*2) / Math.max(1, series.length-1);

  const points = series.map((s,i) => {
    const x = pad + i * stepX;
    const y = height - pad - ((s.amount / max) * (height - pad*2 || 1));
    return { x, y, date: s.date, amount: s.amount };
  });

  const path = points.map((p,i)=> (i===0?`M ${p.x} ${p.y}`:`L ${p.x} ${p.y}`)).join(' ');
  const areaPath = path + ` L ${pad + (series.length-1)*stepX} ${height-pad} L ${pad} ${height-pad} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <path d={areaPath} fill="#FCE4EC" stroke="none" />
        <path d={path} fill="none" stroke="#E91E63" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, idx)=>(
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r={4} fill="#E91E63" onClick={()=>onPointClick && onPointClick(p.date)} style={{cursor:'pointer'}} />
          </g>
        ))}
      </svg>
      <div className="text-xs text-gray-500 mt-2 flex gap-2 overflow-x-auto">
        {series.map(s=> (<div key={s.date} className="px-2 py-1 bg-gray-50 rounded">{s.date} — ₹{s.amount}</div>))}
      </div>
    </div>
  );
}