"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderBackgroundEnhanced() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    uniforms: any;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Enhanced shader uniforms
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouseVelocity: { value: 0.0 },
    };

    const vertexShader = /* glsl */ `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Enhanced fragment shader with more complex effects
    const fragmentShader = /* glsl */ `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_mouseVelocity;
      varying vec2 v_uv;

      // Improved hash function
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.13);
        p3 += dot(p3, p3.yzx + 3.333);
        return fract((p3.x + p3.y) * p3.z);
      }

      // Smooth noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // Fractal noise
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // Rotation matrix
      mat2 rotate2d(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      // Voronoi-like cells
      float voronoi(vec2 p) {
        vec2 n = floor(p);
        vec2 f = fract(p);
        
        float minDist = 1.0;
        for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
            vec2 neighbor = vec2(float(i), float(j));
            vec2 point = hash(n + neighbor) * vec2(
              sin(u_time * 0.5 + hash(n + neighbor) * 6.28),
              cos(u_time * 0.5 + hash(n + neighbor) * 6.28)
            ) * 0.5 + 0.5;
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            minDist = min(minDist, dist);
          }
        }
        return minDist;
      }

      void main() {
        vec2 uv = v_uv;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.12;
        
        // Mouse interaction with smooth following
        vec2 mouseOffset = (u_mouse - 0.5) * 0.4;
        p += mouseOffset * (1.0 + u_mouseVelocity * 0.5);

        // Multiple rotating layers
        vec2 p1 = rotate2d(t * 0.15) * p;
        vec2 p2 = rotate2d(-t * 0.2) * p;
        vec2 p3 = rotate2d(t * 0.1) * (p * 1.5);

        // Complex grid patterns
        float grid1 = abs(fract(p1.x * 4.0 + t) - 0.5) + abs(fract(p1.y * 4.0 - t) - 0.5);
        float grid2 = abs(fract(p2.x * 6.0 - t * 0.8) - 0.5) + abs(fract(p2.y * 6.0 + t * 0.8) - 0.5);
        float grid3 = abs(fract(p3.x * 3.0 + t * 0.5) - 0.5) + abs(fract(p3.y * 3.0 - t * 0.5) - 0.5);
        
        // Voronoi cells for organic movement
        float cells = voronoi(p * 2.0 + t * 0.3);
        
        // Layered noise
        float n1 = fbm(p * 2.5 + t * 0.4);
        float n2 = fbm(p * 3.5 - t * 0.3);
        float n3 = fbm(p * 1.5 + vec2(t * 0.2, -t * 0.15));
        
        // Glow effects
        float glow1 = 0.02 / (grid1 * grid1 + 0.008);
        float glow2 = 0.015 / (grid2 * grid2 + 0.01);
        float glow3 = 0.01 / (grid3 * grid3 + 0.012);
        float cellGlow = 0.03 / (cells * cells + 0.02);
        
        // Enhanced color palette
        vec3 color1 = vec3(0.05, 0.6, 0.95);  // Bright cyan
        vec3 color2 = vec3(0.4, 0.15, 0.9);   // Deep purple
        vec3 color3 = vec3(0.0, 0.85, 0.75);  // Aqua
        vec3 color4 = vec3(0.1, 0.3, 0.8);    // Deep blue
        
        // Build up the color
        vec3 col = vec3(0.0);
        col += color1 * glow1 * 0.8;
        col += color2 * glow2 * 0.6;
        col += color3 * glow3 * 0.4;
        col += color4 * cellGlow * 0.5;
        
        // Add noise layers for depth
        col += color3 * n1 * 0.25;
        col += color1 * n2 * 0.15;
        col *= 1.0 + n3 * 0.3;
        
        // Animated pulsing
        float pulse1 = sin(t * 2.5) * 0.5 + 0.5;
        float pulse2 = sin(t * 3.0 + 1.57) * 0.5 + 0.5;
        col *= 0.6 + pulse1 * 0.2 + pulse2 * 0.2;
        
        // Mouse velocity creates energy bursts
        col += vec3(0.1, 0.5, 1.0) * u_mouseVelocity * 0.3;
        
        // Radial gradient / vignette
        float r = length(p);
        float vignette = smoothstep(2.0, 0.4, r);
        col *= vignette * 0.8 + 0.2;
        
        // Chromatic aberration effect near edges
        float aberration = r * 0.1;
        col.r *= 1.0 - aberration * 0.1;
        col.b *= 1.0 + aberration * 0.1;
        
        // Scanlines for retro feel
        float scanline = sin(uv.y * u_resolution.y * 0.7) * 0.03 + 0.97;
        col *= scanline;
        
        // Film grain
        float grain = hash(uv * u_time) * 0.05;
        col += grain * 0.5;
        
        // Color grading
        col = pow(col, vec3(0.85));  // Gamma correction
        col = mix(col, vec3(dot(col, vec3(0.299, 0.587, 0.114))), -0.15);  // Slight saturation boost
        
        // Subtle bloom
        col += col * col * 0.3;
        
        // Final contrast adjustment
        col = (col - 0.5) * 1.15 + 0.5;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking with velocity
    let lastMousePos = { x: 0.5, y: 0.5 };
    let mouseVelocity = 0;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.u_resolution.value.set(width, height);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const newX = event.clientX / window.innerWidth;
      const newY = 1.0 - event.clientY / window.innerHeight;
      
      // Calculate velocity
      const dx = newX - lastMousePos.x;
      const dy = newY - lastMousePos.y;
      mouseVelocity = Math.sqrt(dx * dx + dy * dy) * 10;
      
      lastMousePos = { x: newX, y: newY };
      uniforms.u_mouse.value.set(newX, newY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    // Animation loop with velocity decay
    const startTime = performance.now();
    const animate = () => {
      const now = performance.now();
      uniforms.u_time.value = (now - startTime) / 1000.0;
      
      // Smooth velocity decay
      mouseVelocity *= 0.95;
      uniforms.u_mouseVelocity.value = mouseVelocity;
      
      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    sceneRef.current = {
      renderer,
      scene,
      camera,
      uniforms,
      animationId: requestAnimationFrame(animate),
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: "#000" }}
    />
  );
}

