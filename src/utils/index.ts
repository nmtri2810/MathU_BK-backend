export async function randomIntegerFromRange(
  min: number,
  max: number,
): Promise<number> {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
