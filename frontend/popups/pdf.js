import createFetch from "./utils/createFetch";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="pdf"]').forEach(button => {
    button.addEventListener("click", async () => {
      const testId = "123"; // Replace with dynamic test id if needed

      try {
        const testData = await createFetch(`/test/${testId}`, "GET");

        // Fetch blocks associated with the test using new route: GET /block/test/:testId
        const blocksData = await createFetch(`/block/test/${testId}`, "GET");
        const allBlocks = blocksData.blocks || [];

        // For each block, fetch its questions using new route: GET /question/block/:blockId
        let allQuestions = [];
        for (const block of allBlocks) {
          const questionsData = await createFetch(`/question/block/${block.id}`, "GET");
          // Assuming each questionsData has an array property 'questions'
          allQuestions.push({
            blockName: block.name,
            questions: questionsData.questions || []
          });
        }

        // Generate the PDF using jsPDF (make sure jsPDF is included in your HTML)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;

        // Write test name as header
        doc.setFontSize(16);
        doc.text(testData.name, 10, y);
        y += 10;
        doc.setFontSize(12);

        // Iterate through each block and its questions
        allQuestions.forEach((blockObj, bIndex) => {
          doc.text(`Block ${bIndex + 1}: ${blockObj.blockName}`, 10, y);
          y += 10;
          blockObj.questions.forEach((question, qIndex) => {
            const questionText = `${qIndex + 1}. ${question}`;
            doc.text(questionText, 10, y);
            y += 10;
            doc.text("Vastus:", 10, y);
            y += 10;
            // Check for near page overflow (A4 height is around 297mm)
            if (y > 280) {
              doc.addPage();
              y = 10;
            }
          });
        });

        // Automatically download the PDF with a filename based on the test name 
        const fileName = `${testData.name.replace(/ /g, "_")}.pdf`;
        doc.save(fileName);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("PDF-i loomine ebaõnnestus.");
      }
    });
  });
});