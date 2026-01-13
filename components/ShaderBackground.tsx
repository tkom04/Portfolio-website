"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderBackground() {
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
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Shader uniforms
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    // Vertex shader
    const vertexShader = /* glsl */ `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment shader with animated grid and glow effects
    const fragmentShader = /* glsl */ `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_uv;

      // Hash function for pseudo-random values
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // 2D noise function
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

      // Fractal Brownian Motion
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // Rotating grid pattern
      vec2 rotate(vec2 p, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
      }

      void main() {
        // Normalized coordinates
        vec2 uv = v_uv;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.15;
        
        // Mouse influence
        vec2 mouseInfluence = (u_mouse - 0.5) * 0.3;
        p += mouseInfluence;

        // Create multiple layers of animated grids
        vec2 p1 = rotate(p, t * 0.2);
        vec2 p2 = rotate(p, -t * 0.3);
        
        // Grid patterns
        float grid1 = abs(fract(p1.x * 3.0 + t) - 0.5) + abs(fract(p1.y * 3.0 - t) - 0.5);
        float grid2 = abs(fract(p2.x * 5.0 - t * 0.7) - 0.5) + abs(fract(p2.y * 5.0 + t * 0.7) - 0.5);
        
        // Combine grids with glow
        float glow1 = 0.015 / (grid1 * grid1 + 0.01);
        float glow2 = 0.01 / (grid2 * grid2 + 0.01);
        
        // Add noise layers
        float n1 = fbm(p * 2.0 + t * 0.5);
        float n2 = fbm(p * 3.0 - t * 0.3);
        
        // Combine noise with grids
        float combined = glow1 + glow2 * 0.5 + n1 * 0.2;
        
        // Color palette - cyan/blue with hints of purple
        vec3 color1 = vec3(0.1, 0.7, 1.0); // Cyan
        vec3 color2 = vec3(0.5, 0.2, 1.0); // Purple
        vec3 color3 = vec3(0.0, 0.9, 0.8); // Bright cyan
        
        // Mix colors based on patterns
        vec3 col = color1 * glow1;
        col += color2 * glow2 * 0.5;
        col += color3 * n2 * 0.3;
        
        // Add pulsing effect
        float pulse = sin(t * 2.0) * 0.5 + 0.5;
        col *= 0.7 + pulse * 0.3;
        
        // Vignette effect
        float r = length(p);
        float vignette = smoothstep(1.8, 0.5, r);
        col *= vignette;
        
        // Add subtle scanlines
        float scanline = sin(uv.y * u_resolution.y * 0.5) * 0.02 + 0.98;
        col *= scanline;
        
        // Slight color grading
        col = pow(col, vec3(0.9));
        col = mix(col, vec3(dot(col, vec3(0.299, 0.587, 0.114))), -0.1);
        
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

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.u_resolution.value.set(width, height);
    };

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      uniforms.u_mouse.value.set(
        event.clientX / window.innerWidth,
        1.0 - event.clientY / window.innerHeight
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    // Animation loop
    const startTime = performance.now();
    const animate = () => {
      const now = performance.now();
      uniforms.u_time.value = (now - startTime) / 1000.0;
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

    // Cleanup
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

