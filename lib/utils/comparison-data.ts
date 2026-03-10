import { mulberry32, dayHash } from "./data-variation";

/**
 * Generate a "previous period" value that's 5-15% different from current.
 * Uses a seed-based approach to be deterministic.
 */
export function generatePreviousPeriod(
  currentValue: number,
  key: string,
  improvementLikely: boolean = true
): number {
  const rng = mulberry32(dayHash(`comparison|${key}`));
  const pctDiff = 0.05 + rng() * 0.10; // 5-15% difference

  // If improvement is likely, previous should be worse (lower for "higher is better" metrics)
  const direction = improvementLikely ? -1 : 1;
  // Add some randomness: 70% chance of expected direction, 30% chance opposite
  const actualDirection = rng() < 0.7 ? direction : -direction;

  const previousValue = currentValue * (1 + actualDirection * pctDiff);
  return Math.round(previousValue * 100) / 100;
}
