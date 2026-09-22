import { Link } from 'react-router-dom'

export default function SignSwitcher({ signs, active }) {
  return (
    <div className="inline-flex rounded-2xl bg-blue-100/70 p-1 shadow-inner">
      {signs.map((sign) => {
        const isActive = sign.id === active
        return (
          <Link
            key={sign.id}
            to={sign.path}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-700/60 hover:text-blue-700'
            }`}
          >
            {sign.label}
          </Link>
        )
      })}
    </div>
  )
}
