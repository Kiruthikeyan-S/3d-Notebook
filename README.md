<img width="1906" height="986" alt="image" src="https://github.com/user-attachments/assets/dd5466b9-31f9-4177-a900-556f3b72c49b" />
# 📓 3D Notebook

An interactive **3D Notebook / Digital Scrapbook** built with **React, TypeScript, Vite, Tailwind CSS, and Motion**.

The project transforms a traditional notebook into an interactive digital experience where users can explore pages, illustrations, books, AI-powered elements, and animated 3D-style interactions.

## ✨ Features

* 📖 Interactive digital notebook experience
* 🎨 Scrapbook-style canvas
* 🧊 3D-inspired UI and visual interactions
* 🤖 AI-inspired interactive orb/character
* 📚 Interactive book component
* 🖼️ Illustrations and visual elements
* ➕ Add-item modal for notebook content
* 🎬 Smooth UI animations
* 📱 Responsive interface
* ⚡ Fast development and production builds with Vite
* 🎯 Component-based React architecture

## 🛠️ Tech Stack

| Technology     | Purpose                                    |
| -------------- | ------------------------------------------ |
| React          | Frontend UI development                    |
| TypeScript     | Type-safe JavaScript development           |
| Vite           | Development server and production bundling |
| Tailwind CSS   | Styling and responsive UI                  |
| Motion         | Animations and transitions                 |
| Lucide React   | Icons                                      |
| clsx           | Conditional CSS classes                    |
| tailwind-merge | Tailwind class merging                     |
| Oxlint         | Code linting                               |

## 📂 Project Structure

```text
3d-Notebook/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AIOrbFace.tsx
│   │   ├── AddItemModal.tsx
│   │   ├── Book.tsx
│   │   ├── Illustrations.tsx
│   │   ├── ScrapbookCanvas.tsx
│   │   └── ai-core.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── netlify.toml
└── README.md
```

The repository currently follows this React component structure, with the main application logic in `App.tsx` and reusable notebook-related components separated under `src/components`.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Kiruthikeyan-S/3d-Notebook.git
```

### 2. Navigate into the project

```bash
cd 3d-Notebook
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

## 🏗️ Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🔍 Code Quality

Run the project's linting command:

```bash
npm run lint
```

## 🎨 Main Components

### `ScrapbookCanvas.tsx`

Handles the notebook/scrapbook-style interactive canvas and provides the main visual environment for notebook content.

### `Book.tsx`

Provides an interactive book/notebook visual component for displaying content in a book-like format.

### `AIOrbFace.tsx`

Provides the AI-inspired orb/face visual element used as an interactive interface component.

### `Illustrations.tsx`

Contains reusable illustration-based visual elements.

### `AddItemModal.tsx`

Provides the interface for adding new items/content to the notebook.

### `ai-core.ts`

Contains AI-related application logic used by the interface.

### `App.tsx`

Acts as the main application component and connects the major parts of the notebook experience. The current file is approximately 1,550 lines, so further component separation could improve maintainability.

## 🎯 Project Goal

The goal of **3D Notebook** is to create a more engaging alternative to a traditional digital note-taking application.

Instead of presenting information as a simple list of text and cards, the project uses:

* Interactive notebook layouts
* Visual storytelling
* Animation
* 3D-inspired elements
* AI-inspired interactions
* Digital scrapbook concepts

This makes the notebook experience feel more like interacting with a physical creative workspace.

## 🌐 Live Demo

A live deployment is available at:

**3d-notebook.netlify.app**

The GitHub repository currently references this Netlify deployment.

## 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── home.png
├── notebook.png
├── scrapbook.png
└── ai-orb.png
```

Example:

```markdown
![3D Notebook](screenshots/home.png)
```

## 📈 Future Improvements

Possible future improvements include:

* [ ] Drag-and-drop notebook elements
* [ ] Real 3D page-turning effects
* [ ] Page creation and deletion
* [ ] Save notebook data to local storage
* [ ] Cloud synchronization
* [ ] User authentication
* [ ] AI-powered note summarization
* [ ] AI-powered handwriting recognition
* [ ] Voice-to-note functionality
* [ ] Export notebook as PDF
* [ ] Dark/light themes
* [ ] More interactive 3D objects
* [ ] Mobile gesture support
* [ ] Offline support

## 🔮 Future Vision

The project can be expanded into a complete **AI-powered 3D productivity workspace**.

Possible architecture:

```text
                    ┌─────────────────────┐
                    │    3D Notebook      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐     ┌──────────┐     ┌──────────┐
        │ Notebook │     │ AI Tools │     │ 3D UI    │
        └──────────┘     └──────────┘     └──────────┘
              │                │                │
              ▼                ▼                ▼
        Notes / Pages     Summarize       Animations
        Books             Generate        Interactive
        Images             Explain         Objects
        Drawings           Organize        Canvas
```

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Test the application.

```bash
npm run build
npm run lint
```

5. Commit your changes.

```bash
git add .
git commit -m "Add new feature"
```

6. Push your branch.

```bash
git push origin feature/new-feature
```

7. Open a Pull Request.

## 📄 License

This project is available for learning, experimentation, and development purposes.

## 👨‍💻 Author

**Kiruthikeyan S**

GitHub:
https://github.com/Kiruthikeyan-S

Repository:
https://github.com/Kiruthikeyan-S/3d-Notebook

---

⭐ If you find this project interesting, consider giving the repository a star!

