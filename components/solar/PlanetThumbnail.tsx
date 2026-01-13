"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface PlanetThumbnailProps {
  planetType: string;
  planetColor: string;
  size?: number;
}

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

export default function PlanetThumbnail({ planetType, planetColor, size = 48 }: PlanetThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = size;
    const height = size;

    // Scene setup - transparent background
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera - perspective for better planet view, positioned for front-facing
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    // Fallback sphere
    const fallbackGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const fallbackMaterial = new THREE.MeshStandardMaterial({
      color: planetColor,
      emissive: planetColor,
      emissiveIntensity: 0.2,
      roughness: 0.6,
    });
    const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
    scene.add(fallbackMesh);

    // Try loading GLTF model
    const gltfLoader = new GLTFLoader();
    const modelPath = planetModelPaths[planetType];
    
    if (modelPath) {
      gltfLoader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene.clone();
          
          // Scale model to fit
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.6 / maxDim;
          
          model.scale.set(scale, scale, scale);
          model.position.sub(center.multiplyScalar(scale));
          
          // Brighten materials
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((mat: any) => {
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                    if (!mat.emissive) {
                      mat.emissive = new THREE.Color(planetColor);
                    } else {
                      mat.emissive.set(planetColor);
                    }
                    mat.emissiveIntensity = planetType === "sun" ? 0.5 : 0.2;
                    if (mat.roughness !== undefined) {
                      mat.roughness = Math.max(0.3, (mat.roughness || 0.7) * 0.8);
                    }
                  }
                });
              }
            }
          });
          
          // Handle Uranus tilt
          if (planetType === "devlogs") {
            model.rotation.z = Math.PI / 2;
          }
          
          scene.remove(fallbackMesh);
          scene.add(model);
          setLoaded(true);
          
          // Render
          renderer.render(scene, camera);
        },
        undefined,
        () => {
          // Fallback to sphere if GLTF fails
          setLoaded(true);
          renderer.render(scene, camera);
        }
      );
    } else {
      setLoaded(true);
      renderer.render(scene, camera);
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (canvasRef.current) {
        renderer.render(scene, camera);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [planetType, planetColor, size]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-full flex-shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: `0 0 20px ${planetColor}80`,
      }}
    />
  );
}

