document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="pdf"]').forEach(button => {
    button.addEventListener("click", async () => {
      const testId = "123"; 
      try {
        // Stub: Use dummy test data instead of fetching from an API.
        const testData = { name: "Dummy Test Name" };

        // Stub: Use dummy questions data instead of fetching from an API.
        const questionsData = {
          questions: [
            "What is your name?",
            "What is your quest?",
            "What is your favorite color?"
          ]
        };

        // Generate the PDF using jsPDF
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
          // Add a label for the answer.
          doc.text("Vastus:", 10, y);
          y += 10;
          
          // Simple check for page overflow (A4 height is around 297mm)
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
