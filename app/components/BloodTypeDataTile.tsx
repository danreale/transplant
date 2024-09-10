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
      <div className="flex flex-col justify-center items-center border rounded w-16 h-16 shadow-sm">
        {/* Icon */}
        <DataChange count={change} />
        <label htmlFor="">{count}</label>
      </div>
    </div>
  )
}