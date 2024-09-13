import clsx from 'clsx'

import DataChange from "./DataChange"

type Props = {
  label: string
  count: number
  change: number
}

export default function BloodTypeDataTile({ label, count, change }: Props) {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="font-semibold">{label}</span>
      {/* Tile */}
      <div className={
        clsx(
          change > 0 && 'border-red-500 bg-red-50',
          change < 0 && 'border-green-500 bg-green-50',
          'flex flex-col justify-center items-center border rounded w-16 h-16 shadow-sm relative'
        )}>
        <label htmlFor="">{count}</label>
        <div className="absolute bottom-1">
          <DataChange count={change} />
        </div>
      </div>
    </div>
  )
}
