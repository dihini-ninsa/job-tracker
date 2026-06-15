export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="w-9 h-9 bg-gray-800 rounded-lg mb-3"></div>
      <div className="h-8 bg-gray-800 rounded w-16 mb-2"></div>
      <div className="h-3 bg-gray-800 rounded w-24"></div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-gray-800"></div>
        <div>
          <div className="h-3 bg-gray-800 rounded w-32 mb-1.5"></div>
          <div className="h-2.5 bg-gray-800 rounded w-20"></div>
        </div>
      </div>
      <div className="h-5 bg-gray-800 rounded-full w-16"></div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-800 rounded w-32 mb-1.5"></div>
            <div className="h-2.5 bg-gray-800 rounded w-24"></div>
          </div>
          <div className="h-3 bg-gray-800 rounded w-20"></div>
          <div className="h-5 bg-gray-800 rounded-full w-16"></div>
          <div className="h-7 bg-gray-800 rounded w-24"></div>
        </div>
      ))}
    </div>
  )
}