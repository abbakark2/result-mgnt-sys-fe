export const StatCard2 = ({ label, value, icon: Icon, classes, delay }) => {
  return (
    <div
      className={`flex items-center p-4 rounded-2xl gap-5 text-white animate-fade-up ${(delay, classes)}`}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          borderRadius: 14,
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </div>
      <div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.1,
            fontFamily: "'DM Serif Display',serif",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            opacity: 0.82,
            marginTop: 2,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
