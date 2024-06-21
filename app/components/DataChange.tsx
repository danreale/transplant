export default function DataChange({ bloodType }: { bloodType: number }) {
  return (
    <>
      <div className="text-center">
        {bloodType === 0 && <p className="text-yellow-500">({bloodType})</p>}
        {bloodType > 0 && (
          <p className="text-red-500 font-bold">(+{bloodType})</p>
        )}
        {bloodType < 0 && (
          <p className="text-green-500 font-bold">({bloodType})</p>
        )}
      </div>
    </>
  );
}
