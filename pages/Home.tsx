import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useApp } from '../contexts/AppContext';
import { Navbar } from '../components/Navbar';

export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, theme } = useApp();

  useEffect(() => {
    if (!containerRef.current) return;

    // THREE.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Earth Sphere (Base)
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    // Dynamic material based on theme (simplified for now, mostly handled by color choice)
    const material = new THREE.MeshPhongMaterial({
        color: theme === 'dark' ? 0x1e3a8a : 0x3b82f6, // Dark blue vs Light blue
        emissive: theme === 'dark' ? 0x112244 : 0x1d4ed8,
        specular: 0xffffff,
        shininess: 10,
        transparent: true,
        opacity: 0.9,
    });
    const earth = new THREE.Mesh(geometry, material);
    globeGroup.add(earth);

    // 2. Wireframe Overlay
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({ 
        color: theme === 'dark' ? 0x60a5fa : 0xffffff,
        transparent: true,
        opacity: 0.3 
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframe.scale.set(1.01, 1.01, 1.01);
    globeGroup.add(wireframe);

    // 3. Rings
    const ringGeo = new THREE.TorusGeometry(7, 0.1, 2, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = Math.PI / 6;
    globeGroup.add(ring);

    // 4. Floating Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.05,
        color: theme === 'dark' ? 0xffffff : 0x2563eb,
        transparent: true,
        opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);


    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 12;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      earth.rotation.y += 0.002;
      wireframe.rotation.y += 0.002;
      ring.rotation.z -= 0.001;
      particlesMesh.rotation.y += 0.0005;

      // Gentle floating
      globeGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [theme]); // Re-render when theme changes

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto px-6 pt-24 pb-12 w-full z-10">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center lg:pr-12 mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-6 whitespace-pre-line">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {t.home.heroTitle}
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl leading-relaxed font-medium">
               {t.home.heroSubtitle}
            </p>

            {/* Badges */}
            <div className="flex gap-3 mb-10">
                <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                    CESIUM
                </span>
                <span className="px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-300 dark:border-slate-700">
                    WebGPU
                </span>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '📚', color: 'bg-green-500', data: t.home.cards.basic },
                  { icon: '📈', color: 'bg-orange-500', data: t.home.cards.advanced },
                  { icon: '🚀', color: 'bg-purple-500', data: t.home.cards.pro },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group">
                        <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center text-white mb-3 shadow-lg`}>
                            {card.icon}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{card.data.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {card.data.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Content - 3D Globe */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-auto">
             <div ref={containerRef} className="absolute inset-0 w-full h-full flex items-center justify-center">
                 {/* Three.js renders here */}
             </div>
             {/* Decorative Ring behind */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full border border-slate-200 dark:border-slate-800 opacity-20 pointer-events-none"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-dashed border-slate-300 dark:border-slate-700 opacity-10 pointer-events-none animate-spin-slow"></div>
        </div>

      </div>
    </div>
  );
};