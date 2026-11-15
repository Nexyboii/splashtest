// Pure scroll-timeline math for the 3D wash scene (no three.js, no DOM).
// Progress p runs 0..1 across the pinned hero. Stages:
// 0 drive in, 1 pressure wash, 2 foam & hand wash, 3 pure-water rinse,
// 4 blow-dry tunnel, 5 gleaming exit.

export const STAGE_COUNT = 6;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
// Progress of p inside window [a, b], eased.
const seg = (p, a, b) => smooth((p - a) / (b - a));
// A bump: rises a->b, falls c->d.
const bump = (p, a, b, c, d) => seg(p, a, b) * (1 - seg(p, c, d));

// Car path keyframes: [progress, x along the workshop]
const CAR_KEYS = [
  [0, -10],
  [0.16, -3.4],
  [0.34, -2.2],
  [0.52, 0.2],
  [0.68, 2.2],
  [0.86, 3.2],
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
  return {
    stage: stageAt(q),
    carX: keyed(CAR_KEYS, q),
    // 1 = dirty, 0 = clean. Cleaning happens across wash + rinse.
    dirt: 1 - seg(q, 0.16, 0.7),
    // Water jets: pressure wash, then the rinse.
    water: Math.max(bump(q, 0.16, 0.22, 0.32, 0.38), bump(q, 0.54, 0.58, 0.68, 0.74)),
    // Foam: hand-wash window.
    foam: bump(q, 0.36, 0.42, 0.5, 0.56),
    // Dryer tunnel window.
    dryer: bump(q, 0.7, 0.74, 0.84, 0.9),
    // Paint gloss rises through rinse + dryer.
    gloss: seg(q, 0.7, 0.95),
    // Sparkle only on the gleaming exit.
    sparkle: seg(q, 0.88, 1),
    // Gentle camera dolly following the car.
    camX: keyed([[0, -2.2], [0.5, 0], [1, 2.2]], q),
  };
}
