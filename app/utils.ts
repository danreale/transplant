export function SortByRegionNumber(data) {
  return data.sort((a, b) => {
    let aNumber = Number(a.region.split("  ")[1]);
    let bNumber = Number(b.region.split("  ")[1]);
    return aNumber - bNumber;
  });
}

export const range = (start: number, end: number, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};
