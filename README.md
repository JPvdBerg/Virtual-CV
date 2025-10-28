#  Virtual-CV: Jan-Paul van den Berg - Dynamic Portfolio

This is a single-page application (SPA) built with **React** and **Vite** designed to present a professional CV using a striking, custom **Cyberpunk/Hacker Aesthetic**. The goal of this project is to showcase front-end skill, performance optimization, and creative use of modern web technologies.

##  Live Demo

**View the live site here:** [https://JPvdBerg.github.io/Virtual-CV](https://JPvdBerg.github.io/Virtual-CV)

*(The live URL is configured via GitHub Pages on the `gh-pages` branch.)*

##  Features and Technical Highlights

This project utilizes advanced libraries to achieve its custom look, demonstrating proficiency in several key areas:

| Feature | Technical Skill Demonstrated |
| :--- | :--- |
| **Layered Visual Effects** | Mastery of **WebGL** (via the `ogl` library) and **CSS layering** to create the complex, animated terminal background. |
| **Decrypted Text Effect** | Advanced use of the **`framer-motion`** library for custom, per-character DOM manipulation. The effect is set to run only when elements scroll into view (`animateOn="view"`), improving overall UX. |
| **Custom Console Aesthetic** | Precise control over typography (standardizing on **Monofonto** for headings and **Consolas** for body text), custom list alignment, and a persistent **custom cursor** (`.cur` file). |
| **Performance** | Strategic use of **CSS media queries** to disable resource-intensive effects (`FaultyTerminal`, `LetterGlitch`) on mobile viewports, ensuring fast loading and preserving battery life. |
| **Deployment Pipeline** | Configuration of **Vite** and **`gh-pages`** for a professional, automated CI/CD flow directly to GitHub Pages. |

##  Local Setup and Development

To clone this project and run it locally, ensure you have Node.js and npm installed.

### Prerequisites

  * Node.js (v18+)
  * npm

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/JPvdBerg/Virtual-CV.git
    cd Virtual-CV
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Run Locally (Development Mode):**

    ```bash
    npm run dev
    ```

    The application will open in your browser at `http://localhost:5173/`.

##  Deployment

This project is configured to build and deploy to the `gh-pages` branch using the `gh-pages` package, leveraging the Vite `base: './'` relative path setting for correct asset loading in subdirectories.

To deploy a new version:

1.  **Commit All Changes** to the `main` branch.
2.  **Run the Deployment Script:**
    ```bash
    npm run deploy
    ```
    *(This command automatically runs `npm run build` and pushes the optimized `dist` folder to the `gh-pages` branch.)*

-----

© 2025 Jan-Paul van den Berg. All rights reserved.
