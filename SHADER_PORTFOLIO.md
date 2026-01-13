# WebGL Shader Portfolio - Technical Documentation

This portfolio recreates the immersive shader-based experience inspired by sites like [Sector 32](https://www.sector32.net/), featuring a full-screen WebGL canvas with custom GLSL shaders and minimal HTML overlay.

## 🎨 What's Included

### Two Versions

1. **Basic Version** (`/shader`) - Clean, performant shader with:
   - Animated grid patterns
   - Fractal noise layers
   - Mouse interaction
   - Smooth animations
   - Minimal UI overlay

2. **Enhanced Version** (`/shader-enhanced`) - Advanced effects with:
   - Multiple rotating layers
   - Voronoi cells for organic movement
   - Mouse velocity tracking
   - Chromatic aberration
   - Film grain and scanlines
   - Advanced color grading
   - Scrollable content sections

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### View the Pages

- Basic shader portfolio: `http://localhost:3000/shader`
- Enhanced version: `http://localhost:3000/shader-enhanced`
- Traditional portfolio: `http://localhost:3000`

## 🛠️ Technical Stack

- **Next.js 14** - React framework
- **Three.js** - WebGL library
- **TypeScript** - Type safety
- **GLSL** - Custom fragment shaders
- **Tailwind CSS** - UI styling

## 📐 Architecture

### How It Works

1. **Full-Screen Canvas**
   - A single `<canvas>` element fills the viewport
   - Rendered via WebGL using Three.js
   - No traditional 3D scene - just a full-screen quad (2 triangles)

2. **Custom GLSL Shaders**
   - **Vertex Shader**: Passes UV coordinates
   - **Fragment Shader**: Computes color for each pixel
   - Uniforms: `u_time`, `u_resolution`, `u_mouse`

3. **Animation Loop**
   - `requestAnimationFrame` updates time uniform
   - Shader recalculates every frame
   - 60 FPS smooth animation

4. **HTML Overlay**
   - Positioned absolutely over canvas
   - Minimal UI elements
   - Pointer events controlled via CSS

## 🎯 Shader Techniques Used

### Basic Shader Features

- **Grid Patterns**: Using `fract()` and rotation matrices
- **Noise Functions**: Hash-based pseudo-random noise
- **Fractal Brownian Motion (FBM)**: Layered noise for complexity
- **Glow Effects**: Inverse distance fields
- **Vignette**: Radial gradient from center
- **Color Mixing**: Multiple color palettes blended

### Enhanced Shader Features

- **Voronoi Cells**: Organic, cell-like patterns
- **Multiple Rotation Layers**: Depth through parallax
- **Mouse Velocity**: Energy bursts on fast movement
- **Chromatic Aberration**: Color separation at edges
- **Scanlines**: Retro CRT effect
- **Film Grain**: Dynamic noise overlay
- **Bloom**: Self-illumination effect
- **Color Grading**: Gamma correction and saturation

## 🎨 Customization Guide

### Change Colors

In `ShaderBackground.tsx` or `ShaderBackgroundEnhanced.tsx`, find the color palette:

```glsl
vec3 color1 = vec3(0.05, 0.6, 0.95);  // Cyan
vec3 color2 = vec3(0.4, 0.15, 0.9);   // Purple
vec3 color3 = vec3(0.0, 0.85, 0.75);  // Aqua
```

Change RGB values (0.0 to 1.0) to your preferred colors.

### Adjust Animation Speed

Modify the time multiplier:

```glsl
float t = u_time * 0.12;  // Change 0.12 to speed up/slow down
```

### Change Grid Density

Adjust the multiplication factors:

```glsl
float grid1 = abs(fract(p1.x * 4.0 + t) - 0.5) + abs(fract(p1.y * 4.0 - t) - 0.5);
// Change 4.0 to make grid denser (higher) or sparser (lower)
```

### Modify Glow Intensity

Change the numerator in glow calculations:

```glsl
float glow1 = 0.02 / (grid1 * grid1 + 0.008);
// Increase 0.02 for brighter glow
```

## 🎭 UI Customization

### Update Branding

In `app/shader/page.tsx` or `app/shader-enhanced/page.tsx`:

```tsx
<h1 className="text-2xl font-bold tracking-wider">YOUR NAME</h1>
<p className="text-xs text-cyan-400 tracking-widest">YOUR TAGLINE</p>
```

### Modify Content

Edit the sections in the enhanced version:
- Hero text
- About section
- Work/projects grid
- Contact information

### Change Social Links

Update the social media links:

```tsx
<a href="https://github.com/yourusername" ...>
<a href="https://linkedin.com/in/yourprofile" ...>
<a href="mailto:your.email@example.com" ...>
```

## ⚡ Performance Optimization

### Current Optimizations

1. **Pixel Ratio Capping**: Limited to 2x for performance
2. **Power Preference**: Set to "high-performance"
3. **Efficient Loops**: Limited iterations in FBM
4. **Smooth Velocity Decay**: Prevents unnecessary recalculations

### Additional Tips

- **Reduce FBM iterations** if targeting low-end devices
- **Lower pixel ratio** for mobile: `Math.min(window.devicePixelRatio, 1.5)`
- **Simplify shader** by removing voronoi or extra layers
- **Add performance detection** to switch between basic/enhanced

## 🎓 Learning Resources

To understand the shader code better:

- **The Book of Shaders**: [thebookofshaders.com](https://thebookofshaders.com/)
- **Shadertoy**: [shadertoy.com](https://www.shadertoy.com/) - Explore examples
- **Three.js Docs**: [threejs.org/docs](https://threejs.org/docs/)
- **WebGL Fundamentals**: [webglfundamentals.org](https://webglfundamentals.org/)

## 🐛 Troubleshooting

### Black Screen
- Check browser console for WebGL errors
- Ensure Three.js is installed: `npm install three`
- Verify your GPU supports WebGL

### Poor Performance
- Reduce shader complexity (fewer FBM iterations)
- Lower pixel ratio
- Disable mouse velocity tracking
- Use basic version instead of enhanced

### TypeScript Errors
- Install type definitions: `npm install -D @types/three`
- Ensure `"moduleResolution": "bundler"` in tsconfig.json

## 📱 Mobile Considerations

The shader works on mobile but consider:

- Using the basic version for better performance
- Reducing pixel ratio to 1
- Simplifying shader effects
- Testing on actual devices, not just emulators

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Add shader portfolio"
git push

# Deploy on Vercel
# Import repository and deploy
```

### Build for Production

```bash
npm run build
npm start
```

## 📄 License

This code is provided as-is for educational and portfolio purposes. Feel free to use and modify for your own projects.

## 🤝 Contributing

This is a portfolio template. Feel free to:
- Fork and customize
- Share improvements
- Create your own shader variations

---

**Note**: The shader effects are inspired by modern WebGL portfolios but are original implementations. Experiment with the code to create your own unique visual style!

