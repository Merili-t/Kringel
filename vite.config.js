import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Main entry (root)
        main: resolve(__dirname, 'index.html'),

        // Pages in src/pages
        admin: resolve(__dirname, 'src/html/admin.html'),
        allTests: resolve(__dirname, 'src/html/allTests.html'),
        calculator: resolve(__dirname, 'src/html/calculator.html'),
        contacts: resolve(__dirname, 'src/html/contacts.html'),
        contactsHomepage: resolve(__dirname, 'src/html/contactsHomepage.html'),
        createAccount: resolve(__dirname, 'src/html/createAccount.html'),
        details: resolve(__dirname, 'src/html/details.html'),
        guide: resolve(__dirname, 'src/html/guide.html'),
        login: resolve(__dirname, 'src/html/login.html'),
        newPassword: resolve(__dirname, 'src/html/newPassword.html'),
        solvingTest: resolve(__dirname, 'src/html/solvingTest.html'),
        studentContactForm: resolve(__dirname, 'src/html/studentContactForm.html'),
        studentGuide: resolve(__dirname, 'src/html/studentGuide.html'),
        testAnswers: resolve(__dirname, 'src/html/testAnswers.html'),
        testCreation: resolve(__dirname, 'src/html/testCreation.html'),
        tutorialHome: resolve(__dirname, 'src/html/tutorialHome.html'),
      },
    },
  },
});
