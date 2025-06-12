import { defineConfig } from 'vite';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: resolve(__dirname, '../.env'),
});

// https://vitejs.dev/config/

const port = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : undefined;

export default defineConfig({
  server: {
    host: true,
    port
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  build: {
    rollupOptions: {
      input: {
        // Main entry (root)
        main: resolve(__dirname, 'index.html'),

        // Pages in src/pages
        admin: resolve(__dirname, 'html/admin.html'),
        allTests: resolve(__dirname, 'html/allTests.html'),
        calculator: resolve(__dirname, 'html/calculator.html'),
        contacts: resolve(__dirname, 'html/contacts.html'),
        contactsHomepage: resolve(__dirname, 'html/contactsHomepage.html'),
        createAccount: resolve(__dirname, 'html/createAccount.html'),
        details: resolve(__dirname, 'html/details.html'),
        guide: resolve(__dirname, 'html/guide.html'),
        login: resolve(__dirname, 'html/login.html'),
        newPassword: resolve(__dirname, 'html/newPassword.html'),
        solvingTest: resolve(__dirname, 'html/solvingTest.html'),
        studentContactForm: resolve(__dirname, 'html/studentContactForm.html'),
        studentGuide: resolve(__dirname, 'html/studentGuide.html'),
        testAnswers: resolve(__dirname, 'html/testAnswers.html'),
        testCreation: resolve(__dirname, 'html/testCreation.html'),
        tutorialHome: resolve(__dirname, 'html/tutorialHome.html'),
      },
    },
  },
});