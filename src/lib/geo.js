import { geoMercator, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import world from "world-atlas/countries-50m.json";

export const MAP_W = 1800;
export const MAP_H = 700;

export const projection = geoMercator().center([32, 38]).scale(1290).translate([MAP_W / 2, MAP_H / 2]);
const path = geoPath(projection);

const all = feature(world, world.objects.countries).features;
const keep = all.filter((f) => {
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  return Number.isFinite(x0) && !(x1 < -500 || x0 > MAP_W + 900 || y1 < -500 || y0 > MAP_H + 700);
});
const regionCollection = { type: "FeatureCollection", features: keep };

export const LAND_D = path(regionCollection);
export const BORDERS_D = path(mesh(world, { type: "GeometryCollection", geometries: world.objects.countries.geometries.filter((g) => keep.some((f) => f.id === g.id)) }, (a, b) => a !== b));
export const COAST_D = path(mesh(world, { type: "GeometryCollection", geometries: world.objects.countries.geometries.filter((g) => keep.some((f) => f.id === g.id)) }, (a, b) => a === b));
export const TURKEY_D = (() => {
  const f = all.find((x) => x.properties && x.properties.name === "Turkey");
  return f ? path(f) : "";
})();

export const project = (lonlat) => projection(lonlat);

// Closed Catmull-Rom → cubic Bézier path through projected ring vertices (smooth hand-drawn look).
export const smoothRing = (ring, tension = 0.5) => {
  const P = ring.map((p) => projection(p));
  const n = P.length;
  let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + "Z";
};
