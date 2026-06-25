// src/features/registration/components/UnitMeter.jsx

const MAX_UNITS = 24;

export default function UnitMeter({ registeredUnits, pendingUnits }) {
  const total = registeredUnits + pendingUnits;
  const registeredPct = Math.min((registeredUnits / MAX_UNITS) * 100, 100);
  const pendingPct = Math.min(
    (pendingUnits / MAX_UNITS) * 100,
    100 - registeredPct,
  );
  const isOver = total > MAX_UNITS;

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Credit Unit Load
        </span>
        <span
          className={`text-sm font-bold ${isOver ? "text-red-600" : "text-gray-800"}`}
        >
          {total} / {MAX_UNITS} units
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${registeredPct}%` }}
        />
        <div
          className={`h-full transition-all duration-300 
                                ${isOver ? "bg-red-400" : "bg-blue-200"}`}
          style={{ width: `${pendingPct}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">
          {registeredUnits} confirmed
        </span>
        {pendingUnits > 0 && (
          <span
            className={`text-xs ${isOver ? "text-red-500" : "text-blue-500"}`}
          >
            +{pendingUnits} pending
          </span>
        )}
      </div>

      {isOver && (
        <p className="text-xs text-red-500 mt-1">
          ⚠ You have exceeded the {MAX_UNITS}-unit limit.
        </p>
      )}
    </div>
  );
}
