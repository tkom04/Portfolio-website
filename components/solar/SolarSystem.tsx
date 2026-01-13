"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Star, Briefcase, Rocket, Sparkles, Pencil, Lightbulb, Moon, AlertTriangle, Clipboard, MousePointer2, Search, Hand, Zap, Palette, Wrench, TrendingUp, Settings, Cpu } from "lucide-react";
import PlanetThumbnail from "./PlanetThumbnail";

type PlanetType = "sun" | "about" | "skills" | "projects" | "sandbox" | "reviews" | "contact" | "devlogs" | "lights";

interface Planet {
  name: string;
  type: PlanetType;
  size: number;
  distance: number;
  color: string;
  orbitPeriod: number; // Days to complete one orbit
  label: string;
}

const planets: Planet[] = [
  // Sun: size 3 (reference point)
  { name: "Sun", type: "sun", size: 3, distance: 0, color: "#FDB813", orbitPeriod: 0, label: "Home" },
  // Mercury: 0.38x Earth size, 0.39 AU distance, 88 days orbit
  { name: "Mercury", type: "about", size: 0.38, distance: 6, color: "#8C7853", orbitPeriod: 88, label: "About Me" },
  // Venus: 0.95x Earth size, 0.72 AU distance, 225 days orbit
  { name: "Venus", type: "skills", size: 0.95, distance: 11, color: "#FFC649", orbitPeriod: 225, label: "Skills" },
  // Earth: 1.0x (reference), 1.0 AU distance, 365 days orbit
  { name: "Earth", type: "projects", size: 1, distance: 16, color: "#4A90E2", orbitPeriod: 365, label: "Projects" },
  // Mars: 0.53x Earth size, 1.52 AU distance, 687 days orbit
  { name: "Mars", type: "sandbox", size: 0.53, distance: 24, color: "#E27B58", orbitPeriod: 687, label: "Sandbox" },
  // Jupiter: 11.2x Earth size (scaled to 3.5 for visibility), 5.2 AU distance, 4333 days orbit
  { name: "Jupiter", type: "reviews", size: 3.5, distance: 45, color: "#C88B3A", orbitPeriod: 4333, label: "Reviews" },
  // Saturn: 9.4x Earth size (scaled to 3.0 for visibility), 9.5 AU distance, 10759 days orbit
  { name: "Saturn", type: "contact", size: 3.0, distance: 60, color: "#FAD5A5", orbitPeriod: 10759, label: "Contact" },
  // Uranus: 4.0x Earth size, 19.2 AU distance, 30688 days orbit
  { name: "Uranus", type: "devlogs", size: 1.6, distance: 80, color: "#4FD0E7", orbitPeriod: 30688, label: "Dev Logs" },
  // Neptune: 3.9x Earth size, 30.1 AU distance, 60182 days orbit
  { name: "Neptune", type: "lights", size: 1.55, distance: 100, color: "#4166F5", orbitPeriod: 60182, label: "My Lights" },
];

// Calculate planet position based on date
const calculatePlanetPosition = (planet: Planet, date: Date) => {
  if (planet.orbitPeriod === 0) return 0; // Sun doesn't move
  
  // Reference date: January 1, 2000 (J2000.0 epoch)
  const referenceDate = new Date(2000, 0, 1);
  const daysSinceReference = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate angle based on orbital period
  const orbitalFraction = (daysSinceReference % planet.orbitPeriod) / planet.orbitPeriod;
  const angle = orbitalFraction * Math.PI * 2;
  
  return angle;
};

export default function SolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const planetMeshesRef = useRef<{ 
    mesh: THREE.Mesh; 
    planet: Planet; 
    angle: number;
    targetAngle: number;
    animating: boolean;
  }[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [lightsLoading, setLightsLoading] = useState(false);
  const [lightsError, setLightsError] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [lightsLog, setLightsLog] = useState<Array<{ action: string; timestamp: Date; visitor: string }>>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // CSS2D Renderer for labels
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.zIndex = '1';
    containerRef.current.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 200; // Increased to allow viewing outer planets (Neptune at ~100)

    // Starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Ambient light - increased for brighter planets
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Point light from sun - increased intensity
    const sunLight = new THREE.PointLight(0xffffff, 3, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Additional directional light for better planet visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create planets
    planetMeshesRef.current = [];
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();

    // Map planet types to GLTF model paths - using NASA models (higher quality)
    const planetModelPaths: Record<string, string> = {
      sun: '/textures/solar-system/sun_nasa.glb',
      about: '/textures/solar-system/mercury_nasa.glb',
      skills: '/textures/solar-system/venus_nasa.glb',
      projects: '/textures/solar-system/earth_nasa.glb',
      sandbox: '/textures/solar-system/mars_nasa.glb',
      reviews: '/textures/solar-system/jupiter_nasa.glb',
      contact: '/textures/solar-system/saturn_nasa.glb',
      devlogs: '/textures/solar-system/uranus_nasa.glb',
      lights: '/textures/solar-system/neptune_nasa.glb',
    };

    planets.forEach((planet) => {
      const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
      let material: THREE.Material;

      // Use photorealistic textures for specific planets
      if (planet.type === "projects") {
        // Earth with detailed textures
        const diffuseMap = textureLoader.load('/textures/earth/Textures/Diffuse_2K.png');
        const bumpMap = textureLoader.load('/textures/earth/Textures/Bump_2K.png');
        material = new THREE.MeshStandardMaterial({
          map: diffuseMap,
          bumpMap: bumpMap,
          bumpScale: 0.05,
          metalness: 0.1,
          roughness: 0.8,
          emissive: planet.color,
          emissiveIntensity: 0.15,
        });
      } else if (planet.type === "sandbox") {
        // Mars with detailed textures
        const diffuseMap = textureLoader.load('/textures/mars/Textures/Diffuse_2K.png');
        const bumpMap = textureLoader.load('/textures/mars/Textures/Bump_2K.png');
        material = new THREE.MeshStandardMaterial({
          map: diffuseMap,
          bumpMap: bumpMap,
          bumpScale: 0.02,
          metalness: 0.1,
          roughness: 0.85,
          emissive: planet.color,
          emissiveIntensity: 0.15,
        });
      } else if (planet.type === "skills") {
        // Venus with detailed textures
        const diffuseMap = textureLoader.load('/textures/venus/Textures/Diffuse_1K.png');
        const bumpMap = textureLoader.load('/textures/venus/Textures/Bump_1K.png');
        material = new THREE.MeshStandardMaterial({
          map: diffuseMap,
          bumpMap: bumpMap,
          bumpScale: 0.01,
          metalness: 0.2,
          roughness: 0.7,
          emissive: planet.color,
          emissiveIntensity: 0.2,
        });
      } else {
        // Default colored material for other planets
        material = new THREE.MeshStandardMaterial({
          color: planet.color,
          emissive: planet.type === "sun" ? planet.color : planet.color,
          emissiveIntensity: planet.type === "sun" ? 0.5 : 0.2,
          metalness: 0.4,
          roughness: 0.6,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      
      // Uranus rotates on its side (98 degree axial tilt)
      if (planet.type === "devlogs") {
        mesh.rotation.z = Math.PI / 2; // Rotate 90 degrees on Z axis
      }
      
      mesh.userData = { planet };
      scene.add(mesh);
      planetMeshesRef.current.push({ mesh, planet, angle: 0, targetAngle: 0, animating: false });

      // Try loading GLTF model from asset pack/NASA (if available)
      const gltfModelPath = planetModelPaths[planet.type];
      if (gltfModelPath) {
        gltfLoader.load(
          gltfModelPath,
          (gltf) => {
            // GLTF loaded successfully - replace sphere with model
            const model = gltf.scene;
            
            // Scale model to match planet size
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = planet.size / maxDim;
            model.scale.set(scale, scale, scale);
            
            // Handle Uranus tilt
            if (planet.type === "devlogs") {
              model.rotation.z = Math.PI / 2;
            }
            
            // Copy position from existing mesh
            model.position.copy(mesh.position);
            model.userData = { planet };
            
            // Store label reference before removing mesh
            const label = mesh.children.find((child: any) => child instanceof CSS2DObject) as CSS2DObject | undefined;
            
            // Transfer atmosphere layers and other children to new model
            mesh.children.forEach((child: any) => {
              if (child instanceof CSS2DObject) {
                // Label will be reattached below
                return;
              }
              // Transfer atmosphere/cloud layers
              if (child instanceof THREE.Mesh) {
                child.raycast = () => {}; // Ensure raycasting is disabled
                model.add(child);
              }
            });
            
            // Disable raycasting on decorative layers in GLTF model (rings, atmospheres, etc.)
            // but keep the main planet mesh clickable
            const meshes: THREE.Mesh[] = [];
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                meshes.push(child);
                
                // Brighten GLTF model materials
                if (child.material) {
                  const materials = Array.isArray(child.material) ? child.material : [child.material];
                  materials.forEach((mat: any) => {
                    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                      // Add subtle emissive glow
                      if (!mat.emissive) {
                        mat.emissive = new THREE.Color(planet.color);
                      } else {
                        mat.emissive.set(planet.color);
                      }
                      mat.emissiveIntensity = planet.type === "sun" ? 0.5 : 0.2;
                      // Reduce roughness for more reflectivity/brightness
                      if (mat.roughness !== undefined) {
                        mat.roughness = Math.max(0.3, (mat.roughness || 0.7) * 0.8);
                      }
                    }
                  });
                }
              }
            });
            
            // The first mesh is typically the main planet body (make it clickable)
            // All others (rings, atmospheres, etc.) should not block clicks
            if (meshes.length > 0) {
              const mainMesh = meshes[0];
              mainMesh.userData = { ...mainMesh.userData, planet };
              
              // Disable raycasting on all other meshes (rings, decorative elements)
              for (let i = 1; i < meshes.length; i++) {
                meshes[i].raycast = () => {};
              }
            }
            
            // Reattach label to new model
            if (label) {
              model.add(label);
              model.userData.label = label.element; // Store reference for hover effects
            }
            
            // Remove old mesh and add new model
            scene.remove(mesh);
            scene.add(model);
            
            // Update reference in planetMeshesRef - use the model group itself for positioning
            // but store the main mesh for raycasting
            const index = planetMeshesRef.current.findIndex(p => p.planet.name === planet.name);
            if (index !== -1) {
              // Use the model group for the reference (it contains everything)
              // The main mesh is stored in userData for raycasting
              planetMeshesRef.current[index].mesh = model as any;
              if (meshes.length > 0) {
                model.userData.mainMesh = meshes[0]; // Store main mesh reference
              }
            }
          },
          undefined,
          (error) => {
            // GLTF not found or failed - keep using sphere geometry
            console.log(`GLTF model not available for ${planet.name}, using sphere geometry`);
          }
        );
      }

      // Add Earth's cloud layer
      if (planet.type === "projects") {
        const cloudGeometry = new THREE.SphereGeometry(planet.size * 1.01, 64, 64);
        const cloudTexture = textureLoader.load('/textures/earth/Textures/Clouds_2K.png');
        const cloudMaterial = new THREE.MeshStandardMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        clouds.raycast = () => {}; // Disable raycasting on clouds
        mesh.add(clouds);
      }

      // Add Mars atmosphere/dust
      if (planet.type === "sandbox") {
        const atmosphereGeometry = new THREE.SphereGeometry(planet.size * 1.02, 64, 64);
        const atmosphereTexture = textureLoader.load('/textures/mars/Textures/Clouds_2K.png');
        const atmosphereMaterial = new THREE.MeshStandardMaterial({
          map: atmosphereTexture,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.raycast = () => {}; // Disable raycasting on atmosphere
        mesh.add(atmosphere);
      }

      // Add Venus atmosphere
      if (planet.type === "skills") {
        const atmosphereGeometry = new THREE.SphereGeometry(planet.size * 1.02, 64, 64);
        const atmosphereTexture = textureLoader.load('/textures/venus/Textures/Atmosphere_2K.png');
        const atmosphereMaterial = new THREE.MeshStandardMaterial({
          map: atmosphereTexture,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.raycast = () => {}; // Disable raycasting on atmosphere
        mesh.add(atmosphere);
      }

      // Add label (NASA-style)
      if (planet.type !== "sun") {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'planet-label';
        labelDiv.textContent = planet.label;
        labelDiv.style.color = 'rgba(255, 255, 255, 0.9)';
        labelDiv.style.fontSize = '11px';
        labelDiv.style.fontWeight = '500';
        labelDiv.style.padding = '2px 6px';
        labelDiv.style.background = 'rgba(0, 0, 0, 0.3)';
        labelDiv.style.borderRadius = '3px';
        labelDiv.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        labelDiv.style.pointerEvents = 'none';
        labelDiv.style.userSelect = 'none';
        labelDiv.style.transition = 'opacity 0.2s ease';
        labelDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        labelDiv.style.opacity = '0.5'; // Start subtle
        
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, planet.size + 0.8, 0);
        mesh.add(label);
        
        // Store reference to label for hover effects
        mesh.userData.label = labelDiv;
      }

      // Add orbit line
      if (planet.distance > 0) {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2;
          orbitPoints.push(
            Math.cos(angle) * planet.distance,
            0,
            Math.sin(angle) * planet.distance
          );
        }
        orbitGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(orbitPoints, 3)
        );
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0x444444,
          transparent: true,
          opacity: 0.3,
        });
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        scene.add(orbit);
      }

      // Add ring to Saturn
      if (planet.type === "contact") {
        const ringGeometry = new THREE.RingGeometry(planet.size * 1.5, planet.size * 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xC8A060,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.raycast = () => {}; // Disable raycasting on rings
        mesh.add(ring);
      }
    });

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Collect all planet meshes (including GLTF models)
      const planetObjects: THREE.Object3D[] = [];
      planetMeshesRef.current.forEach((item) => {
        // If it's a GLTF model group, use the main mesh for raycasting
        if (item.mesh.userData?.mainMesh) {
          planetObjects.push(item.mesh.userData.mainMesh);
        } else {
          planetObjects.push(item.mesh);
        }
      });
      
      const intersects = raycaster.intersectObjects(
        planetMeshesRef.current.map((p) => p.mesh)
      );

      // Reset all labels to subtle
      planetMeshesRef.current.forEach((item) => {
        if (item.mesh.userData.label) {
          item.mesh.userData.label.style.opacity = '0.5';
        }
      });

      if (intersects.length > 0 && intersects[0].object.userData.planet) {
        const planet = intersects[0].object.userData.planet;
        setHoveredPlanet(planet.name);
        document.body.style.cursor = "pointer";
        
        // Make hovered planet label more visible
        if (intersects[0].object.userData.label) {
          intersects[0].object.userData.label.style.opacity = '1';
        }
      } else {
        setHoveredPlanet(null);
        document.body.style.cursor = "default";
      }
    };

    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Collect all planet meshes (including GLTF models)
      const planetObjects: THREE.Object3D[] = [];
      planetMeshesRef.current.forEach((item) => {
        // If it's a GLTF model group, use the main mesh for raycasting
        if (item.mesh.userData?.mainMesh) {
          planetObjects.push(item.mesh.userData.mainMesh);
        } else {
          planetObjects.push(item.mesh);
        }
      });
      
      const intersects = raycaster.intersectObjects(planetObjects);

      if (intersects.length > 0 && intersects[0].object.userData.planet) {
        const planet = intersects[0].object.userData.planet;
        setSelectedPlanet(planet);
      }
    };

    // Touch event handlers for mobile
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        // Collect all planet meshes (including GLTF models)
      const planetObjects: THREE.Object3D[] = [];
      planetMeshesRef.current.forEach((item) => {
        // If it's a GLTF model group, use the main mesh for raycasting
        if (item.mesh.userData?.mainMesh) {
          planetObjects.push(item.mesh.userData.mainMesh);
        } else {
          planetObjects.push(item.mesh);
        }
      });
      
      const intersects = raycaster.intersectObjects(planetObjects);

        if (intersects.length > 0 && intersects[0].object.userData.planet) {
          const planet = intersects[0].object.userData.planet;
          setSelectedPlanet(planet);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart);

    // Function to update planet positions based on selected date
    const updatePlanetPositions = (date: Date) => {
      planetMeshesRef.current.forEach((item) => {
        if (item.planet.distance > 0) {
          const angle = calculatePlanetPosition(item.planet, date);
          item.angle = angle;
          item.targetAngle = angle;
          item.mesh.position.x = Math.cos(angle) * item.planet.distance;
          item.mesh.position.z = Math.sin(angle) * item.planet.distance;
        }
      });
    };

    // Initial positions (no animation on load)
    updatePlanetPositions(selectedDate);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Very slow self rotation for realism
      planetMeshesRef.current.forEach((item) => {
        item.mesh.rotation.y += 0.0005; // Much slower

        // Smooth orbital animation when date changes
        if (item.animating && item.planet.distance > 0) {
          const angleDiff = item.targetAngle - item.angle;
          
          // Choose shortest path (handle wrap-around at 2π)
          let shortestDiff = angleDiff;
          if (Math.abs(angleDiff) > Math.PI) {
            shortestDiff = angleDiff > 0 
              ? angleDiff - Math.PI * 2 
              : angleDiff + Math.PI * 2;
          }
          
          // Smooth interpolation (ease-out)
          const step = shortestDiff * 0.05;
          
          if (Math.abs(shortestDiff) < 0.001) {
            // Close enough, snap to target
            item.angle = item.targetAngle;
            item.animating = false;
          } else {
            item.angle += step;
          }
          
          // Update position based on current angle
          item.mesh.position.x = Math.cos(item.angle) * item.planet.distance;
          item.mesh.position.z = Math.sin(item.angle) * item.planet.distance;
        }
      });

      // Slowly rotate starfield
      stars.rotation.y += 0.0001;

      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
      if (containerRef.current) {
        if (renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        if (labelRenderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(labelRenderer.domElement);
        }
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update planet positions when date changes (with smooth animation)
  useEffect(() => {
    if (planetMeshesRef.current.length > 0) {
      planetMeshesRef.current.forEach((item) => {
        if (item.planet.distance > 0) {
          const newAngle = calculatePlanetPosition(item.planet, selectedDate);
          item.targetAngle = newAngle;
          item.animating = true;
        }
      });
    }
  }, [selectedDate]);

  // Fetch initial light state and logs when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch light state
        const lightResponse = await fetch('/api/lights');
        if (lightResponse.ok) {
          const lightData = await lightResponse.json();
          setLightsOn(lightData.lightsOn || false);
        }

        // Fetch logs
        const logResponse = await fetch('/api/lights/log');
        if (logResponse.ok) {
          const logData = await logResponse.json();
          if (logData.success && logData.logs) {
            setLightsLog(logData.logs.map((log: { action: string; timestamp: string; visitor: string }) => ({
              action: log.action,
              timestamp: new Date(log.timestamp),
              visitor: log.visitor,
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        // Silently fail - user can still toggle lights
      }
    };
    fetchInitialData();
  }, []);

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />

      {/* UI Overlay */}
      <div className="fixed top-8 left-8 text-white z-10">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Rhys Bone
        </h1>
        <p className="text-gray-400">
          Portfolio<br />
          Click on a planet to explore
        </p>
      </div>

      {/* Planet Labels */}
      {hoveredPlanet && (
        <div className="fixed bottom-32 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 z-10">
          <p className="text-white font-semibold">
            {planets.find(p => p.name === hoveredPlanet)?.label || hoveredPlanet}
          </p>
        </div>
      )}

      {/* Planet Detail Modal */}
      {selectedPlanet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-4xl font-bold text-white">{selectedPlanet.label}</h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-white hover:text-red-400 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-gray-300 space-y-4 flex-1 overflow-y-auto pr-2">
              {selectedPlanet.type === "about" ? (
                <>
                  <p className="text-lg leading-relaxed">
                    Hi! I'm Rhys, I'm 22 and I'm an automation expert and full stack web dev. 
                    I love building systems that work seamlessly and creating web experiences 
                    that push boundaries.
                  </p>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Some of my interests:</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="text-3xl mb-2">🧠</div>
                        <p className="text-sm font-medium">Neural Networks</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="text-3xl mb-2">🏠</div>
                        <p className="text-sm font-medium">Home Assistant</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="text-3xl mb-2">🔌</div>
                        <p className="text-sm font-medium">Circuit Boards</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : selectedPlanet.type === "skills" ? (
                <div className="space-y-6">
                  {/* Technical Skills */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <span>💻</span> Technical Skills
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">Full Stack Web Development</h4>
                        <p className="text-sm text-gray-400">JavaScript/TypeScript, HTML/CSS, PHP, Python</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">Automation & Scripting</h4>
                        <p className="text-sm text-gray-400">PowerShell, Python scripting</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">Network Infrastructure</h4>
                        <p className="text-sm text-gray-400">Wi-Fi 6E, PoE+, switches, routing, VPN solutions</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">System Administration</h4>
                        <p className="text-sm text-gray-400">Windows domains, Active Directory, IT support</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">3D Modeling & Animation</h4>
                        <p className="text-sm text-gray-400">Blender (beginner-intermediate level)</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="text-white font-medium mb-2">Development Tools</h4>
                        <p className="text-sm text-gray-400">VS Code, Cursor IDE, Git/GitHub</p>
                      </div>
                    </div>
                  </div>

                  {/* IT & Infrastructure */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-400" /> IT & Infrastructure
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["PC building and optimization", "VR streaming technologies", "Remote access solutions", "Network deployment", "Windows/Linux administration"].map((skill) => (
                        <span key={skill} className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Other Competencies */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" /> Other Technical Competencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Web design", "Shopify themes", "Game emulation", "Video editing", "Projection mapping", "AI tool integration", "Database management", "API development"].map((skill) => (
                        <span key={skill} className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" /> Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Problem-solving", "Technical research", "Self-learning", "Budget planning"].map((skill) => (
                        <span key={skill} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/30 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedPlanet.type === "projects" ? (
                <div className="space-y-6">
                  {/* Client Project */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-400" /> Client Work
                    </h3>
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">Etched Reflection</h4>
                          <p className="text-gray-400 text-sm">E-commerce Shopify Store</p>
                        </div>
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs font-semibold">
                          CLIENT
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        Developed and customized a complete Shopify e-commerce store for Etched Reflection, 
                        featuring custom order functionality, product galleries, and a fully integrated 
                        shopping experience. Built custom pages including About, Shop, Gallery, FAQ, and 
                        Contact sections with responsive design and seamless user experience.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">
                          Shopify
                        </span>
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">
                          Theme Customization
                        </span>
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">
                          E-commerce
                        </span>
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">
                          Web Design
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p><strong className="text-white">Website:</strong> <a href="http://etchedreflection.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">etchedreflection.com</a></p>
                        <p><strong className="text-white">Role:</strong> Full Stack Developer & Shopify Specialist</p>
                        <p><strong className="text-white">Features:</strong> Custom order system, product galleries, multi-page navigation, responsive design</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Projects */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-purple-400" /> Personal Projects
                    </h3>
                    <div className="space-y-4">
                      {/* This Portfolio */}
                      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-white">Solar System Portfolio</h4>
                          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-semibold">
                            PERSONAL
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                          An interactive 3D solar system portfolio built with Next.js, Three.js, and TypeScript. 
                          Features realistic planetary textures, orbital mechanics, and an immersive space experience.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">Next.js</span>
                          <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">Three.js</span>
                          <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">TypeScript</span>
                          <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">Tailwind CSS</span>
                        </div>
                      </div>

                      {/* Add more personal projects here */}
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10 border-dashed">
                        <p className="text-gray-400 text-sm text-center italic">
                          More personal projects coming soon...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Project Highlights */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" /> What I Bring to Projects
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="flex justify-center mb-2"><Zap className="w-6 h-6 text-yellow-400" /></div>
                        <p className="text-sm font-medium text-white">Automation</p>
                        <p className="text-xs text-gray-400 mt-1">Streamlined workflows</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="flex justify-center mb-2"><Palette className="w-6 h-6 text-purple-400" /></div>
                        <p className="text-sm font-medium text-white">Full Stack</p>
                        <p className="text-xs text-gray-400 mt-1">End-to-end solutions</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="flex justify-center mb-2"><Wrench className="w-6 h-6 text-blue-400" /></div>
                        <p className="text-sm font-medium text-white">Problem Solving</p>
                        <p className="text-xs text-gray-400 mt-1">Creative solutions</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                        <div className="flex justify-center mb-2"><TrendingUp className="w-6 h-6 text-green-400" /></div>
                        <p className="text-sm font-medium text-white">Results Focused</p>
                        <p className="text-xs text-gray-400 mt-1">Measurable impact</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedPlanet.type === "reviews" ? (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Client Testimonials</h3>
                    <p className="text-gray-400 text-sm">What clients say about working with me</p>
                  </div>

                  {/* Review Card */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                          E
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-semibold">Etched Reflection</h4>
                          <span className="text-yellow-400">★★★★★</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-3 italic">
                          "Thank you again for doing this by the way. It's inspired me to do more 
                          with that of my business as I felt so hopeless with the other website and 
                          it was incredibly de motivating."
                        </p>
                        <p className="text-gray-400 text-sm">
                          Client • Shopify E-commerce Project
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* More reviews placeholder */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 border-dashed text-center">
                    <p className="text-gray-400 text-sm italic">
                      More reviews coming soon...
                    </p>
                  </div>
                </div>
              ) : selectedPlanet.type === "contact" ? (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Let's Work Together</h3>
                    <p className="text-gray-400 text-sm">
                      Have a project in mind? I'd love to hear from you. Send me a message and let's create something amazing together.
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">Email</h4>
                        <a
                          href="mailto:Hello@orbit.tech"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Hello@orbit.tech
                        </a>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">Phone</h4>
                        <a
                          href="tel:+447506902372"
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          07506 902372
                        </a>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">Location</h4>
                        <p className="text-gray-300">Available for remote work worldwide</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="font-semibold text-white mb-4">Follow Me</h4>
                    <div className="flex gap-3">
                      <a
                        href="https://www.linkedin.com/in/rhys-bone-6b957b168/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors border border-blue-500/20"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a
                        href="https://github.com/tkom04"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-500/30 transition-colors border border-gray-500/20"
                        aria-label="GitHub"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Contact Form Note */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 mt-6">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
                      Feel free to reach out through any of the channels above.
                    </p>
                  </div>
                </div>
              ) : selectedPlanet.type === "devlogs" ? (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Dev Logs</h3>
                    <p className="text-gray-400 text-sm">
                      Updates, experiments, and behind-the-scenes development
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Solar System Portfolio</h4>
                          <p className="text-gray-400 text-sm">January 2025</p>
                        </div>
                        <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-lg text-xs font-semibold">
                          NEW
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Built an interactive 3D solar system portfolio using Next.js and Three.js. 
                        Features realistic planetary textures, orbital mechanics, and an immersive 
                        space experience. Added Uranus and Neptune with fun interactive features!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300">Three.js</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300">Next.js</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300">TypeScript</span>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 border-dashed text-center">
                      <p className="text-gray-400 text-sm italic">
                        More dev logs coming soon...
                      </p>
                    </div>
                  </div>
                </div>
              ) : selectedPlanet.type === "lights" ? (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">My Lights</h3>
                    <p className="text-gray-400 text-sm">
                      Control my Home Assistant lights from anywhere in the world!
                    </p>
                  </div>

                  {/* Name Input Section */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Pencil className="w-5 h-5 text-cyan-400" /> Would you like to name yourself?
                    </h4>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Enter your name (optional)"
                      className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      maxLength={50}
                    />
                    <p className="text-gray-400 text-xs mt-2">
                      Your name will appear in the activity log when you toggle the lights
                    </p>
                  </div>

                  {/* Lights Status */}
                  <div className={`bg-gradient-to-br ${lightsOn ? 'from-yellow-500/20 to-orange-500/20' : 'from-gray-500/20 to-gray-600/20'} rounded-xl p-8 border ${lightsOn ? 'border-yellow-500/30' : 'border-gray-500/30'} text-center`}>
                    <div className="mb-4 flex justify-center">
                      {lightsOn ? (
                        <Lightbulb className="w-16 h-16 text-yellow-400" />
                      ) : (
                        <Moon className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      Lights {lightsOn ? 'ON' : 'OFF'}
                    </h4>
                    <p className="text-gray-300 text-sm mb-6">
                      {lightsOn ? 'The lights are currently on!' : 'The lights are currently off.'}
                    </p>
                    <button
                      onClick={async () => {
                        setLightsLoading(true);
                        setLightsError(null);
                        
                        try {
                          const action = lightsOn ? 'turn_off' : 'turn_on';
                          const response = await fetch('/api/lights', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ action }),
                          });

                          // Handle rate limiting before parsing JSON
                          if (response.status === 429) {
                            const errorData = await response.json().catch(() => ({}));
                            const retryAfter = response.headers.get('Retry-After');
                            const resetTime = errorData.resetTime ? new Date(errorData.resetTime).toLocaleTimeString() : 'soon';
                            throw new Error(`Too many requests! Please wait ${retryAfter ? `${retryAfter} seconds` : `until ${resetTime}`} before toggling again.`);
                          }

                          const data = await response.json();

                          if (response.ok && data.success) {
                            const logAction = lightsOn ? 'turned OFF' : 'turned ON';
                            const visitor = visitorName.trim() 
                              ? visitorName.trim() 
                              : `Visitor from ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`;
                            const timestamp = new Date();
                            
                            setLightsOn(!lightsOn);
                            
                            // Save log entry to server
                            try {
                              await fetch('/api/lights/log', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  action: logAction,
                                  visitor,
                                  timestamp: timestamp.toISOString(),
                                }),
                              });
                            } catch (logError) {
                              console.error('Failed to save log:', logError);
                              // Continue even if log save fails
                            }
                            
                            // Update local state
                            setLightsLog(prev => [
                              { action: logAction, timestamp, visitor },
                              ...prev.slice(0, 49) // Keep last 50 entries
                            ]);
                          } else {
                            throw new Error(data.error || data.message || 'Failed to control lights');
                          }
                        } catch (error) {
                          console.error('Error controlling lights:', error);
                          setLightsError(error instanceof Error ? error.message : 'Failed to control lights');
                        } finally {
                          setLightsLoading(false);
                        }
                      }}
                      disabled={lightsLoading}
                      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        lightsOn
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400'
                      } shadow-lg`}
                    >
                      {lightsLoading 
                        ? 'Loading...' 
                        : lightsOn 
                          ? 'Turn OFF My Lights' 
                          : 'Turn ON My Lights'
                      }
                    </button>
                    {lightsError && (
                      <p className="text-red-400 text-sm mt-2 text-center flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> {lightsError}
                      </p>
                    )}
                  </div>

                  {/* Activity Log */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Clipboard className="w-5 h-5 text-blue-400" /> Activity Log
                      <span className="text-sm text-gray-400 font-normal">
                        ({lightsLog.length} {lightsLog.length === 1 ? 'action' : 'actions'})
                      </span>
                    </h4>
                    <div className="bg-white/5 rounded-xl border border-white/10 max-h-64 overflow-y-auto">
                      {lightsLog.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          No activity yet. Be the first to toggle the lights!
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {lightsLog.map((entry, index) => (
                            <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">
                                    Someone {entry.action} the lights
                                  </p>
                                  <p className="text-gray-400 text-xs mt-1">
                                    {entry.visitor}
                                  </p>
                                </div>
                                <p className="text-gray-500 text-xs">
                                  {entry.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-gray-300 text-xs leading-relaxed flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /> 
                      <span>This is connected to my Home Assistant setup. Every toggle is logged and I get a notification when someone interacts with it. Pretty cool, right?</span>
                    </p>
                  </div>
                </div>
              ) : (
                <>
              <p>Content for {selectedPlanet.label} coming soon...</p>
              <p className="text-sm text-gray-500">
                Planet: {selectedPlanet.name} • {selectedPlanet.label}
              </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-8 right-8 z-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Quick Access Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-gray-900 to-gray-800 rounded-t-3xl border-t border-white/20 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-b from-gray-800 to-transparent p-6 pb-4 flex justify-between items-center border-b border-white/10">
              <h3 className="text-white text-2xl font-bold">Quick Access</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-red-400 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {planets.slice(1).map((planet) => (
                <div
                  key={planet.name}
                  className="bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl p-4 border border-white/10 active:border-white/30 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedPlanet(planet);
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <PlanetThumbnail 
                      planetType={planet.type} 
                      planetColor={planet.color} 
                      size={48}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{planet.label}</h4>
                      <p className="text-gray-400 text-xs">{planet.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {planet.type === "about" && "22-year-old automation expert & full stack developer. Passionate about neural networks, Home Assistant, and circuit boards."}
                    {planet.type === "skills" && "Full stack development, automation scripting, network infrastructure, system administration, and 3D modeling with Blender."}
                    {planet.type === "projects" && "Etched Reflection Shopify store (client work) and this interactive 3D solar system portfolio built with Next.js & Three.js."}
                    {planet.type === "sandbox" && "Experimental projects and creative demos. A space for testing new ideas and pushing boundaries."}
                    {planet.type === "reviews" && "5-star client testimonial from Etched Reflection. See what clients say about working with me."}
                    {planet.type === "contact" && "Email: Hello@orbit.tech • Phone: 07506 902372 • Available for remote work worldwide. Let's create something amazing!"}
                    {planet.type === "devlogs" && "Development updates and behind-the-scenes. Currently featuring the Solar System Portfolio build process."}
                    {planet.type === "lights" && "Control my Home Assistant lights from anywhere! Every toggle is logged and I get notified. Try it out!"}
                  </p>
                  <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Planet Quick Access Sidebar - Desktop Only */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-black/90 via-black/80 to-transparent backdrop-blur-lg border-l border-white/10 overflow-y-auto z-10 p-6 pt-24">
        <h3 className="text-white text-xl font-bold mb-6">Quick Access</h3>
        <div className="space-y-4">
          {planets.slice(1).map((planet) => (
            <div
              key={planet.name}
              className="bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
              onClick={() => setSelectedPlanet(planet)}
            >
              <div className="flex items-center gap-4 mb-3">
                <PlanetThumbnail 
                  planetType={planet.type} 
                  planetColor={planet.color} 
                  size={48}
                />
                <div className="flex-1">
                  <h4 className="text-white font-bold">{planet.label}</h4>
                  <p className="text-gray-400 text-xs">{planet.name}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Explore my {planet.label.toLowerCase()} and see what I can do.
              </p>
              <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-semibold group-hover:gap-3">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Date/Time Selector at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 lg:right-80 bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-lg border-t border-white/10 z-10 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
            <div className="flex-shrink-0">
              <label className="text-white text-sm font-semibold mb-1 block">
                Time Travel
              </label>
              <p className="text-gray-400 text-xs hidden lg:block">Select date to view planetary positions</p>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 w-full lg:w-auto">
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  type="time"
                  value={selectedDate.toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(selectedDate);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    setSelectedDate(newDate);
                  }}
                  className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(newDate.getFullYear() - 1);
                    setSelectedDate(newDate);
                  }}
                  className="flex-1 sm:flex-none px-3 py-2 bg-black/60 border border-white/20 text-white text-sm rounded-lg font-semibold hover:border-cyan-400 transition-all"
                >
                  -1 Year
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  Now
                </button>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    setSelectedDate(newDate);
                  }}
                  className="flex-1 sm:flex-none px-3 py-2 bg-black/60 border border-white/20 text-white text-sm rounded-lg font-semibold hover:border-cyan-400 transition-all"
                >
                  +1 Year
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 text-left lg:text-right">
              <p className="text-white font-mono text-sm lg:text-lg">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-gray-400 text-xs lg:text-sm">
                {selectedDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Help - Repositioned */}
      <div className="hidden lg:block fixed bottom-28 left-8 bg-black/60 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 text-white text-sm z-10">
        <p className="font-semibold mb-2">Controls:</p>
        <p className="flex items-center gap-2"><MousePointer2 className="w-4 h-4" /> Drag to rotate</p>
        <p className="flex items-center gap-2"><Search className="w-4 h-4" /> Scroll to zoom</p>
        <p className="flex items-center gap-2"><Hand className="w-4 h-4" /> Click planet to view</p>
      </div>
    </>
  );
}

