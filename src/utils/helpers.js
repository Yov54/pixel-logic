export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getMirroredIndex = (index, size) => {
  const row = Math.floor(index / size);
  const col = index % size;
  return (row * size) + ((size - 1) - col);
};