# Portfolio Website Collection

A comprehensive portfolio website with **three unique designs** to choose from, each showcasing different aspects of web development skills.

## 🎨 Three Portfolio Styles

### 1. 📱 iPhone Home Screen Portfolio (`/ios`)
**The most unique and memorable option!**

An interactive iOS-style interface where each portfolio section is an "app" you can tap to open.

**Features:**
- Authentic iPhone interface with notch, status bar, and dock
- 6 interactive apps: About, Work, Sandbox, Reviews, Skills, Contact
- Smooth iOS-style animations and transitions
- Touch-friendly interactions
- Live clock in status bar

**Perfect for:** Standing out, showing creativity, making a memorable impression

[📖 Full iOS Portfolio Documentation](./IOS_PORTFOLIO.md)

---

### 2. ✨ WebGL Shader Portfolio (`/shader` & `/shader-enhanced`)
**For showcasing technical and creative skills**

Immersive full-screen WebGL canvas with custom GLSL shaders and minimal overlay.

**Features:**
- Full-screen animated shader background
- Mouse-reactive effects
- Two versions: basic and enhanced
- Custom GLSL fragment shaders
- Minimal, modern UI overlay

**Perfect for:** Creative developers, technical portfolios, visual impact

[📖 Full Shader Portfolio Documentation](./SHADER_PORTFOLIO.md)

---

### 3. 📄 Traditional Portfolio (`/traditional`)
**Professional and comprehensive**

Classic multi-section scrolling website with all the essentials.

**Features:**
- Hero section with CTA
- About, Skills, Projects, Reviews, Contact sections
- Smooth scroll animations
- Responsive design
- SEO optimized

**Perfect for:** Professional presentation, comprehensive information, traditional clients

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

### View Each Version

- **Home/Selector**: `http://localhost:3000`
- **iPhone Portfolio**: `http://localhost:3000/ios` ⭐ **RECOMMENDED**
- **Shader (Basic)**: `http://localhost:3000/shader`
- **Shader (Enhanced)**: `http://localhost:3000/shader-enhanced`
- **Traditional**: `http://localhost:3000/traditional`

## 📦 What's Included

```
portfolio/
├── app/
│   ├── ios/              # iPhone home screen portfolio
│   ├── shader/           # Basic WebGL shader version
│   ├── shader-enhanced/  # Advanced shader with scrolling
│   ├── traditional/      # Classic portfolio
│   └── page.tsx          # Version selector
├── components/
│   ├── ios/              # iOS-style components
│   │   ├── HomeScreen.tsx
│   │   ├── AppIcon.tsx
│   │   ├── AppContainer.tsx
│   │   └── apps/         # Individual app pages
│   ├── ShaderBackground.tsx
│   ├── ShaderBackgroundEnhanced.tsx
│   └── [traditional components]
└── docs/
    ├── IOS_PORTFOLIO.md
    └── SHADER_PORTFOLIO.md
```

## 🎯 Which Version Should You Use?

### Use iPhone Portfolio (`/ios`) if you want to:
- ✅ Stand out from other portfolios
- ✅ Show creativity and innovation
- ✅ Make a memorable first impression
- ✅ Appeal to modern, tech-savvy clients
- ✅ Demonstrate UI/UX skills

### Use Shader Portfolio (`/shader-enhanced`) if you want to:
- ✅ Showcase technical skills
- ✅ Target creative agencies
- ✅ Make a visual impact
- ✅ Demonstrate WebGL/3D capabilities
- ✅ Appeal to cutting-edge companies

### Use Traditional Portfolio (`/traditional`) if you want to:
- ✅ Professional, conservative presentation
- ✅ Comprehensive information display
- ✅ SEO optimization priority
- ✅ Traditional business clients
- ✅ Clear, straightforward navigation

**💡 Pro Tip:** Use the iPhone portfolio as your main site, and link to the others as "alternative views" or "experiments"!

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Three.js** - WebGL rendering (shader versions)
- **Framer Motion** - Animations (traditional version)
- **Lucide React** - Icon library

## 🎨 Customization

Each version has its own customization guide:

- **iPhone Portfolio**: See [IOS_PORTFOLIO.md](./IOS_PORTFOLIO.md)
- **Shader Portfolio**: See [SHADER_PORTFOLIO.md](./SHADER_PORTFOLIO.md)
- **Traditional**: Edit components in `components/` directory

### Quick Customization Checklist

- [ ] Update personal information (name, title, bio)
- [ ] Replace placeholder projects with real work
- [ ] Add actual client testimonials
- [ ] Update skills and technologies
- [ ] Change contact information
- [ ] Update social media links
- [ ] Customize colors and branding
- [ ] Add your own images/screenshots

## 📱 Responsive Design

All three versions are fully responsive:
- **iPhone Portfolio**: Centered frame on desktop, full screen on mobile
- **Shader Portfolio**: Adapts to any screen size
- **Traditional**: Mobile-first responsive design

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Deploy with one click

### Build for Production

```bash
npm run build
npm start
```

## 🎓 Learning Resources

This portfolio collection demonstrates:
- Modern React patterns with Next.js App Router
- TypeScript best practices
- CSS animations and transitions
- WebGL and GLSL shaders
- Responsive design techniques
- Component architecture
- State management

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to:
- Fork and customize for your own use
- Submit improvements via pull requests
- Share your customized versions
- Report bugs or suggest features

## 💡 Tips for Success

1. **Choose the right version** for your target audience
2. **Customize thoroughly** - make it yours
3. **Add real content** - no placeholder text
4. **Test on multiple devices** - ensure responsiveness
5. **Get feedback** - show it to others before launching
6. **Keep it updated** - add new projects regularly

## 🌟 Showcase

Using this portfolio? Let me know! I'd love to see how you've customized it.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

For questions or support, open an issue on GitHub.
