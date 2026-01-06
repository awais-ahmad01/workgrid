'use client'

/**
 * OverviewHeader
 * - Aligns Overview page header with Tasks header layout and spacing
 */
export default function OverviewHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || 'Overview'}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side reserved for future filters/actions to stay consistent */}
        <div className="flex items-center gap-3" />
      </div>
    </div>
  )
}
