import { ShowcaseExample } from './types';

export const CESIUM_ION_DEFAULT_TOKEN = process.env.CESIUM_ION_TOKEN || ''; 

export const MOCK_EXAMPLES: ShowcaseExample[] = [
  {
    id: 'heatmap-cities',
    title: 'Dynamic Urban Heatmap',
    title_zh: '城市动态热力图',
    description: 'Visualizes population density across major metropolitan areas using a dynamic heatmap entity overlay.',
    description_zh: '使用动态热力图实体覆盖层可视化主要大都市地区的人口密度分布情况。',
    category: 'visualization',
    difficulty: 'Intermediate',
    thumbnail: 'https://picsum.photos/400/300?grayscale',
    code: `
// Initialize Viewer
const viewer = new Cesium.Viewer('cesiumContainer');

// Mock Data Points
const cities = [
  { lat: 34.0522, lon: -118.2437, val: 0.9 }, // LA
  { lat: 40.7128, lon: -74.0060, val: 1.0 },  // NYC
  { lat: 51.5074, lon: -0.1278, val: 0.8 },   // London
];

cities.forEach(city => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
    ellipse: {
      semiMinorAxis: 50000.0,
      semiMajorAxis: 50000.0,
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.RED.withAlpha(city.val * 0.5)
      )
    }
  });
});
    `
  },
  {
    id: 'satellite-orbit',
    title: 'Satellite Orbit Prediction',
    title_zh: '卫星轨道预测',
    description: 'Real-time propagation of satellite orbits using TLE data and SampledPositionProperty.',
    description_zh: '利用TLE数据和SampledPositionProperty实现卫星轨道的实时推演与可视化。',
    category: 'animation',
    difficulty: 'Advanced',
    thumbnail: 'https://picsum.photos/401/300?blur=2',
    code: `
const viewer = new Cesium.Viewer('cesiumContainer');
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.multiplier = 10;

const position = new Cesium.SampledPositionProperty();
// ... calculation logic for TLE would go here ...

viewer.entities.add({
  availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop })]),
  position: position,
  point: { pixelSize: 10, color: Cesium.Color.CYAN },
  path: { width: 2, material: Cesium.Color.CYAN.withAlpha(0.5) }
});
    `
  },
  {
    id: 'flood-analysis',
    title: 'Terrain Flood Analysis',
    title_zh: '地形淹没分析',
    description: 'Analyzing terrain elevation data to simulate rising sea levels and flood risk zones.',
    description_zh: '分析地形高程数据，模拟海平面上升和洪水风险区域，支持动态水位调整。',
    category: 'analysis',
    difficulty: 'Advanced',
    thumbnail: 'https://picsum.photos/402/300',
    code: `
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: await Cesium.createWorldTerrainAsync()
});

const floodHeight = 50.0; // meters

const material = new Cesium.ColorMaterialProperty(
  Cesium.Color.BLUE.withAlpha(0.6)
);

// Create a global polygon that clamps to ground
viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      -180, -90, 180, -90, 180, 90, -180, 90
    ]),
    material: material,
    height: floodHeight,
    extrudedHeight: 0
  }
});
    `
  }
];