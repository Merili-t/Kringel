import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Main entry (root)
        main: resolve(__dirname, 'index.html'),

        // Pages in src/pages
        tutorialHome: resolve(__dirname, 'src/html/tutorialHome.html'),
        calculator: resolve(__dirname, 'src/pages/calculator.html'),
        chemTasks: resolve(__dirname, 'src/pages/chemTasks.html'),
        contactPage: resolve(__dirname, 'src/pages/contactPage.html'),
        contacts: resolve(__dirname, 'src/pages/contacts.html'),
        createAccount: resolve(__dirname, 'src/pages/createAccount.html'),
        details: resolve(__dirname, 'src/pages/details.html'),
        drawing: resolve(__dirname, 'src/pages/drawing.html'),
        guide: resolve(__dirname, 'src/pages/guide.html'),
        homepage: resolve(__dirname, 'src/pages/homepage.html'),
        juhend: resolve(__dirname, 'src/pages/juhend.html'),
        kontakt: resolve(__dirname, 'src/pages/kontakt.html'),
        koostamine: resolve(__dirname, 'src/pages/koostamine.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        pic: resolve(__dirname, 'src/pages/pic.html'),
        sooritaja: resolve(__dirname, 'src/pages/sooritaja.html'),
      },
    },
  },
});