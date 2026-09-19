export default function SignSwitcher({ signs, active, onChange }) {
  return (
    <div className="inline-flex rounded-2xl bg-blue-100/70 p-1 shadow-inner">
      {signs.map((sign) => {
        const isActive = sign.id === active
        return (
          <button
            key={sign.id}
            type="button"
            onClick={() => onChange(sign.id)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-700/60 hover:text-blue-700'
            }`}
          >
            {sign.label}
          </button>
        )
      })}
    </div>
  )
}
