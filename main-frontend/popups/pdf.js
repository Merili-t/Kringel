document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="pdf"]').forEach(button => {
    button.addEventListener("click", async () => {
      const testId = "123"; 
      try {
        // Fetch test name from the tests folder
        const testResponse = await fetch(`http://localhost:3006/tests/getTest?test_id=${testId}`);
        const testData = await testResponse.json(); 

        // Fetch test questions from the questions folder
        const questionsResponse = await fetch(`http://localhost:3006/questions/getQuestions?test_id=${testId}`);
        const questionsData = await questionsResponse.json(); 

        // Generate the PDF using jsPDF
        // Make sure you have included jsPDF from a CDN or locally:
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 10; 
        doc.setFontSize(16);
        doc.text(testData.name, 10, y);
        y += 10; 

        doc.setFontSize(12);

        questionsData.questions.forEach((question, index) => {
          const questionText = `${index + 1}. ${question}`;
          doc.text(questionText, 10, y);
          y += 10;
          // Add label for answer (room for responses)
          doc.text("Vastus:", 10, y);
          y += 10;

          // Simple check for page overflow (A4 height is around 297mm; jsPDF default unit is "mm")
          if (y > 280) {
            doc.addPage();
            y = 10;
          }
        });

        // Save and automatically download the PDF
        const fileName = `${testData.name.replace(/ /g, "_")}.pdf`;
        doc.save(fileName);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("PDF-i loomine ebaõnnestus.");
      }
    });
  });
});
