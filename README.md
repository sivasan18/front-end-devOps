# Front-End Developer Roadmap 2025 🚀

A modern, interactive roadmap website to track your journey to becoming a Front-End Developer. Features a clean 2025-style design with progress tracking, persistent storage, and a beautiful timeline layout.

![Front-End Roadmap](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

- **11 Comprehensive Phases** covering HTML, CSS, JavaScript, React, and more
- **Interactive Checkboxes** to track your learning progress
- **Progress Indicators** for each phase and overall completion
- **LocalStorage Persistence** - your progress is automatically saved
- **Responsive Design** - works perfectly on mobile, tablet, and desktop
- **Modern Timeline Layout** with smooth animations
- **Clean 2025 Aesthetic** with dark theme and blue gradients
- **Keyboard Shortcuts** - Press `Ctrl/Cmd + K` for statistics

## 📋 Learning Path

### Phase 1 - HTML Basics
Master the fundamentals of HTML including tags, forms, semantic HTML, and SEO basics.

### Phase 2 - CSS Basics
Learn styling, layouts (Flexbox & Grid), animations, and responsive design principles.

### Phase 3 - Responsive Design
Build mobile-first, fully responsive websites.

### Phase 4 - Tailwind CSS
Modern utility-first CSS framework for rapid development.

### Phase 5 - JavaScript Core
Complete JavaScript fundamentals including DOM, async/await, and LocalStorage.

### Phase 6 - Git & GitHub
Version control and deployment to GitHub Pages.

### Phase 7 - React.js
Modern component-based UI library with hooks and routing.

### Phase 8 - Modern Tools
Vite, Redux/Zustand, TanStack Query, and component libraries.

### Phase 9 - Deployment
Deploy your projects to Vercel, Netlify, and GitHub Pages.

### Phase 10 - Portfolio
Build your professional portfolio website.

### Phase 11 - Job Readiness
Prepare for interviews and land your first job.

### ⚡ Bonus
UI/UX, Figma, APIs, and LeetCode practice.

## 🚀 Getting Started

### Local Development

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd "Front End Road Map"
   ```

2. **Open with a local server**
   
   **Option A: Python (if installed)**
   ```bash
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000`

   **Option B: VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

   **Option C: Just open the file**
   - Double-click `index.html` to open in your browser

3. **Start tracking your progress!**
   - Check off items as you learn them
   - Your progress is automatically saved to your browser

## 📦 Project Structure

```
Front End Road Map/
├── index.html          # Main HTML file with all phases
├── css/
│   └── styles.css     # Complete styling and design system
├── js/
│   └── app.js         # Progress tracking and interactive features
├── assets/
│   └── images/        # Profile and branding images
└── README.md          # This file
```

## 🌐 Deploy to GitHub Pages

Follow these steps to deploy your roadmap to GitHub Pages:

### Step 1: Initialize Git Repository

```bash
# Navigate to your project folder
cd "Front End Road Map"

# Initialize git repository
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit: Front-End Developer Roadmap 2025"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Name it: `frontend-roadmap-2025` (or any name you prefer)
4. **Do NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### Step 3: Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/frontend-roadmap-2025.git

# Push your code
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes
7. Your site will be live at: `https://YOUR-USERNAME.github.io/frontend-roadmap-2025/`

## 🎨 Customization

### Add Your Profile Image

Replace the CSS placeholder with your own image:

1. Add your image to `assets/images/profile.jpg`
2. Update `.profile-placeholder` in `css/styles.css`:
   ```css
   .profile-placeholder {
       background-image: url('../assets/images/profile.jpg');
       background-size: cover;
       background-position: center;
   }
   ```

### Change Colors

Edit the CSS custom properties in `css/styles.css`:

```css
:root {
    --primary-blue: #3b82f6;      /* Change primary color */
    --accent-cyan: #06b6d4;       /* Change accent color */
    --bg-primary: #0f172a;        /* Change background */
    /* ... more variables */
}
```

## 🛠️ Advanced Features

### Export Progress

Open browser console and run:
```javascript
window.roadmapUtils.exportProgress()
```
This will download a JSON file with your progress.

### Reset Progress

Open browser console and run:
```javascript
window.roadmapUtils.resetProgress()
```

### View Statistics

Press `Ctrl + K` (or `Cmd + K` on Mac) to see your progress statistics.

## 🔧 Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **LocalStorage API** - Progress persistence
- **Intersection Observer API** - Scroll animations
- **SVG** - Icons and progress rings

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

## 🤝 Contributing

Feel free to fork this project and customize it for your own learning journey!

## 📄 License

This project is open source and available for anyone to use and modify.

## 🎯 Quick Tips

1. **Be Consistent** - Check off items daily
2. **Build Projects** - Don't just learn theory
3. **Deploy Everything** - Get comfortable with deployment early
4. **Ask for Help** - Join communities like freeCodeCamp, Dev.to
5. **Stay Updated** - Front-end changes fast, keep learning

## 💡 Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Best reference for HTML, CSS, JS
- [freeCodeCamp](https://www.freecodecamp.org/) - Free coding courses
- [Frontend Mentor](https://www.frontendmentor.io/) - Real-world projects
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [React Docs](https://react.dev/) - Official React documentation

---

**Made with ❤️ for aspiring Front-End Developers**

*Start your journey today and build amazing things!* 🚀
