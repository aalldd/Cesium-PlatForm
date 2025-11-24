import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Cesium from 'cesium';
import { MOCK_EXAMPLES } from '../constants';
import { explainCode } from '../services/geminiService';
import { Navbar } from '../components/Navbar';
import { useApp } from '../contexts/AppContext';

export const ExampleViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'code'>('info');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const { t, language, theme } = useApp();

  const example = MOCK_EXAMPLES.find(ex => ex.id === id);

  // Initialize Cesium
  useEffect(() => {
    if (!containerRef.current || !example) return;

    // Cleanup previous instance
    if (viewerRef.current) {
        viewerRef.current.destroy();
    }

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: true,
      timeline: true,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: true,
      homeButton: true,
      infoBox: true,
      sceneModePicker: true,
      selectionIndicator: true,
      navigationHelpButton: false,
      creditContainer: document.createElement('div'),
    });

    // Darker atmosphere for dark mode feeling if needed, but usually standard map is fine.
    // We can switch base map provider based on theme if we had a dark map provider key.
    
    viewer.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({
        url : 'https://a.tile.openstreetmap.org/'
      })
    );
    
    // Execute the mock "code" logic visually
    try {
        if (example.id === 'heatmap-cities') {
            const cities = [
                { lat: 34.0522, lon: -118.2437, color: Cesium.Color.RED },
                { lat: 40.7128, lon: -74.0060, color: Cesium.Color.ORANGE },
                { lat: 51.5074, lon: -0.1278, color: Cesium.Color.YELLOW },
                { lat: 35.6762, lon: 139.6503, color: Cesium.Color.RED },
            ];
            cities.forEach(city => {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
                    ellipse: {
                        semiMinorAxis: 300000.0,
                        semiMajorAxis: 300000.0,
                        material: new Cesium.ColorMaterialProperty(city.color.withAlpha(0.5))
                    }
                });
            });
            viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(-95, 38, 8000000) });
        } 
        else if (example.id === 'satellite-orbit') {
            const start = Cesium.JulianDate.now();
            const stop = Cesium.JulianDate.addSeconds(start, 3600, new Cesium.JulianDate());
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
            viewer.clock.multiplier = 60;

            const position = new Cesium.SampledPositionProperty();
            for (let i = 0; i < 3600; i += 60) {
                const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                const radians = Cesium.Math.toRadians(i / 10);
                const lat = Math.sin(radians) * 45;
                const lon = (i / 10) % 360; 
                position.addSample(time, Cesium.Cartesian3.fromDegrees(lon, lat, 500000));
            }

            viewer.entities.add({
                availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop })]),
                position: position,
                point: { pixelSize: 10, color: Cesium.Color.CYAN },
                path: { width: 2, material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.1, color: Cesium.Color.CYAN }) }
            });
        }
        else if (example.id === 'flood-analysis') {
             viewer.scene.globe.depthTestAgainstTerrain = true;
             viewer.entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray([-120, 20, -80, 20, -80, 50, -120, 50]),
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    height: 0,
                    extrudedHeight: 200000 
                }
             });
             viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(-100, 35, 5000000) });
        }
    } catch (e) {
        console.error("Error executing example code simulation", e);
    }

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [example]);

  const handleAiExplain = async () => {
    if (!example) return;
    setIsLoadingAi(true);
    // Add language instruction to prompt
    const promptWithLang = `${example.code} \n\n Explain this in ${language === 'zh' ? 'Chinese' : 'English'}.`;
    const text = await explainCode(promptWithLang);
    setAiExplanation(text);
    setIsLoadingAi(false);
  };

  if (!example) return <div className="text-white p-10">Example not found</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <Navbar />
      
      <div className="flex-1 flex pt-16 relative">
        {/* Map Area */}
        <div className="flex-1 relative bg-black">
            <div ref={containerRef} className="absolute inset-0 z-0" />
            
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className={`absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-slate-900/80 text-slate-900 dark:text-white rounded border border-slate-300 dark:border-slate-700 hover:bg-blue-500 hover:text-white transition-colors ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="15" x2="15" y1="3" y2="21"/></svg>
            </button>
        </div>

        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-96 translate-x-0' : 'w-0 translate-x-full'} transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl z-20`}>
           {isSidebarOpen && (
             <>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <h2 className="font-bold text-slate-900 dark:text-white truncate pr-2">
                        {language === 'zh' ? example.title_zh : example.title}
                    </h2>
                    <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'info' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-100 dark:bg-slate-800/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {t.viewer.tabs.info}
                    </button>
                    <button 
                        onClick={() => setActiveTab('code')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'code' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-100 dark:bg-slate-800/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {t.viewer.tabs.code}
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'info' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.viewer.about}</label>
                                <p className="text-slate-700 dark:text-slate-300 mt-2 text-sm leading-relaxed">
                                    {language === 'zh' ? example.description_zh : example.description}
                                </p>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.viewer.specs}</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700">CesiumJS 1.114</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700">WebGL 2.0</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700">{example.category}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-lg border border-purple-100 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="text-purple-500">✨</span> {t.viewer.aiAnalysis}
                                    </h4>
                                    {!aiExplanation && !isLoadingAi && (
                                        <button 
                                            onClick={handleAiExplain}
                                            className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded transition-colors"
                                        >
                                            {t.viewer.analyzeBtn}
                                        </button>
                                    )}
                                </div>
                                
                                {isLoadingAi ? (
                                    <div className="text-slate-500 dark:text-slate-400 text-xs animate-pulse">{t.viewer.analyzing}</div>
                                ) : aiExplanation ? (
                                    <div className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{aiExplanation}</div>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-500 text-xs">{t.viewer.analyzePrompt}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                             <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-800">
                                <code>{example.code}</code>
                             </pre>
                             <button 
                                onClick={() => navigator.clipboard.writeText(example.code)}
                                className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent shadow-sm"
                                title="Copy to clipboard"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                             </button>
                        </div>
                    )}
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};