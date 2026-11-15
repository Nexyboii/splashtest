// Pure scroll-timeline math for the 3D wash scene (no three.js, no DOM).
// Progress p runs 0..1 across the pinned hero. Stages:
// 0 drive in, 1 pressure wash, 2 foam & hand wash, 3 interior, detailed,
// 4 pure-water rinse, 5 blow-dry tunnel, 6 gleaming exit.

export const STAGE_COUNT = 7;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
// Progress of p inside window [a, b], eased.
const seg = (p, a, b) => smooth((p - a) / (b - a));
// A bump: rises a->b, falls c->d.
const bump = (p, a, b, c, d) => seg(p, a, b) * (1 - seg(p, c, d));

// Car path keyframes: [progress, x along the workshop].
// The car dwells at x = 0.2 through the interior stage (0.40 -> 0.56).
const CAR_KEYS = [
  [0, -10],
  [0.13, -3.4],
  [0.26, -2.2],
  [0.4, 0.2],
  [0.56, 0.2],
  [0.68, 2.0],
  [0.82, 3.4],
  [1, 7.5],
];

function keyed(keys, p) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i][0]) {
      const [p0, v0] = keys[i - 1];
      const [p1, v1] = keys[i];
      return v0 + (v1 - v0) * smooth((p - p0) / (p1 - p0));
    }
  }
  return keys[keys.length - 1][1];
}

export function stageAt(p) {
  return Math.min(STAGE_COUNT - 1, Math.floor(clamp01(p) * STAGE_COUNT));
}

export function timelineParams(p) {
  const q = clamp01(p);
  const carX = keyed(CAR_KEYS, q);
  return {
    stage: stageAt(q),
    carX,
    // 1 = dirty, 0 = clean. Cleaning happens across wash + rinse.
    dirt: 1 - seg(q, 0.13, 0.68),
    // Water jets: pressure wash (arch at x=-2), then the rinse (arch at x=1.4).
    water: Math.max(bump(q, 0.13, 0.17, 0.24, 0.28), bump(q, 0.56, 0.6, 0.66, 0.7)),
    archX: q < 0.42 ? -2 : 1.4,
    // Foam: hand-wash window.
    foam: bump(q, 0.28, 0.33, 0.4, 0.45),
    // Driver's door opens for the interior stage, closes before the rinse.
    door: seg(q, 0.44, 0.48) * (1 - seg(q, 0.53, 0.57)),
    // Dryer tunnel window.
    dryer: bump(q, 0.7, 0.74, 0.83, 0.88),
    // Paint gloss rises through rinse + dryer.
    gloss: seg(q, 0.68, 0.95),
    // Sparkle only on the gleaming exit.
    sparkle: seg(q, 0.86, 1),
    // Camera closes in for the interior stage.
    close: bump(q, 0.42, 0.46, 0.53, 0.57),
    // Camera follows the car so it stays framed (clamped at the ends).
    camX: Math.max(-3.5, Math.min(3, carX * 0.5)),
    // Worker figures: wiper (wash), vacuum (interior), towel wave (exit).
    wipe: bump(q, 0.14, 0.2, 0.38, 0.44),
    vacuum: bump(q, 0.43, 0.47, 0.53, 0.57),
    towel: seg(q, 0.8, 0.88),
  };
}
