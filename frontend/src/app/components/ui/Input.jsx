'use client'

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  icon,
  placeholder,
  disabled = false
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder || label}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full h-11 rounded-xl border border-gray-300
            bg-white text-gray-900 text-sm
            px-3 ${icon ? 'pl-10' : ''}
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition
          `}
        />
      </div>
    </div>
  )
}
