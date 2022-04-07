export const uniq = (arr: Array<string | number | unknown>) => {
  return arr.filter((x, i, a) => a.indexOf(x) === i);
};
