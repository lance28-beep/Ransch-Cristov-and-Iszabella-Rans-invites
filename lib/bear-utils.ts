/**
 * Utility function to get a random bear image from the Bear directory
 */
export function getRandomBearImage(): string {
  const bearNumber = Math.floor(Math.random() * 12) + 1
  return `/Bear/bear (${bearNumber}).png`
}

/**
 * Get multiple random bear images (useful for multiple decorations)
 */
export function getRandomBearImages(count: number): string[] {
  const images: string[] = []
  for (let i = 0; i < count; i++) {
    images.push(getRandomBearImage())
  }
  return images
}

