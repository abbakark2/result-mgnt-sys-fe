export const facultyCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --ink: #0f1923;
    --ink-muted: #64748b;
    --teal: #0d9488;
    --teal-light: #ccfbf1;
    --amber: #f59e0b;
    --amber-light: #fef3c7;
    --surface: #f8fafc;
    --card: #ffffff;
    --border: rgba(15,25,35,0.08);
    --shadow-sm: 0 1px 3px rgba(15,25,35,0.06), 0 1px 2px rgba(15,25,35,0.04);
    --shadow-md: 0 4px 16px rgba(15,25,35,0.08), 0 2px 6px rgba(15,25,35,0.05);
    --shadow-lg: 0 12px 40px rgba(15,25,35,0.12), 0 4px 12px rgba(15,25,35,0.07);
  }

  .faculty-root * { font-family: 'DM Sans', sans-serif; }
  .faculty-root h1 { font-family: 'DM Serif Display', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }

  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.10s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.20s; }
  .stagger-5 { animation-delay: 0.25s; }

  .stat-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
  .stat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .row-item {
    transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .row-item:hover {
    background: rgba(13,148,136,0.03) !important;
    box-shadow: inset 3px 0 0 var(--teal), var(--shadow-sm);
    transform: translateX(2px);
  }
  .row-item:hover .row-actions { opacity: 1; transform: translateX(0); }
  .row-actions {
    opacity: 0;
    transform: translateX(6px);
    transition: opacity 0.2s, transform 0.2s;
  }

  .btn-primary {
    transition: transform 0.2s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.2s, background 0.2s;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245,158,11,0.35);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    transition: background 0.15s, color 0.15s, transform 0.15s;
  }
  .btn-ghost:hover { transform: translateY(-1px); }

  .search-input:focus { box-shadow: 0 0 0 3px rgba(13,148,136,0.15); }

  .skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }

  .pulse-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
  .spinner {
    border: 2.5px solid rgba(13,148,136,0.2);
    border-top-color: var(--teal);
    border-radius: 50%;
    width: 36px; height: 36px;
    animation: spin 0.7s linear infinite;
  }

  .mobile-card {
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .mobile-card:active {
    transform: scale(0.99);
    box-shadow: var(--shadow-sm);
  }

  .tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;
