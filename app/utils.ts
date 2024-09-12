export function SortByRegionNumber(data) {
  return data.sort((a, b) => {
    let aNumber = Number(a.region.split('  ')[1])
    let bNumber = Number(b.region.split('  ')[1])
    return aNumber - bNumber
  })
}
