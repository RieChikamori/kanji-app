import { sampleSVGPath, resamplePoints } from './pathSampler';

function euclidean(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalizePoints(points, fromWidth, fromHeight, toSize = 109) {
  return points.map((p) => ({
    x: (p.x / fromWidth) * toSize,
    y: (p.y / fromHeight) * toSize,
  }));
}

export function computeStrokeSimilarity(userPoints, refPoints) {
  if (userPoints.length !== refPoints.length) return Infinity;
  let totalDist = 0;
  for (let i = 0; i < userPoints.length; i++) {
    totalDist += euclidean(userPoints[i], refPoints[i]);
  }
  return totalDist / userPoints.length;
}

export function isCorrectDirection(userPoints, refPoints) {
  const userStart = userPoints[0];
  const userEnd = userPoints[userPoints.length - 1];
  const refStart = refPoints[0];
  const refEnd = refPoints[refPoints.length - 1];

  const distForward = euclidean(userStart, refStart) + euclidean(userEnd, refEnd);
  const distBackward = euclidean(userStart, refEnd) + euclidean(userEnd, refStart);

  return distForward <= distBackward;
}

export function validateStroke(userRawPoints, refPathD, canvasWidth, canvasHeight) {
  const NUM_POINTS = 20;
  const refPoints = sampleSVGPath(refPathD, NUM_POINTS);
  const normalizedUser = normalizePoints(userRawPoints, canvasWidth, canvasHeight, 109);
  const resampledUser = resamplePoints(normalizedUser, NUM_POINTS);

  const similarity = computeStrokeSimilarity(resampledUser, refPoints);
  const directionOk = isCorrectDirection(resampledUser, refPoints);

  if (similarity < 15 && directionOk) {
    return { correct: true, score: similarity, feedback: 'すごい！' };
  } else if (similarity < 25) {
    return { correct: true, score: similarity, feedback: 'いいね！' };
  } else {
    return { correct: false, score: similarity, feedback: 'もういちど！' };
  }
}
