export function sampleSVGPath(pathD, numPoints = 20) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  document.body.appendChild(svg);

  const totalLength = path.getTotalLength();
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const point = path.getPointAtLength((i / (numPoints - 1)) * totalLength);
    points.push({ x: point.x, y: point.y });
  }

  document.body.removeChild(svg);
  return points;
}

export function resamplePoints(points, numPoints = 20) {
  if (points.length < 2) return points;

  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }

  const totalLength = lengths[lengths.length - 1];
  if (totalLength === 0) return Array(numPoints).fill(points[0]);

  const resampled = [];
  for (let i = 0; i < numPoints; i++) {
    const targetLength = (i / (numPoints - 1)) * totalLength;
    let j = 1;
    while (j < lengths.length - 1 && lengths[j] < targetLength) j++;
    const segLength = lengths[j] - lengths[j - 1];
    const t = segLength === 0 ? 0 : (targetLength - lengths[j - 1]) / segLength;
    resampled.push({
      x: points[j - 1].x + t * (points[j].x - points[j - 1].x),
      y: points[j - 1].y + t * (points[j].y - points[j - 1].y),
    });
  }
  return resampled;
}
