document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-popup="pdf"]').forEach(button => {
    button.addEventListener("click", () => {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "../php/popups.php";
      form.target = "_blank";

      const typeInput = document.createElement("input");
      typeInput.type = "hidden";
      typeInput.name = "type";
      typeInput.value = "pdf";

      const idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "test_id";
      idInput.value = "123"; 

      form.appendChild(typeInput);
      form.appendChild(idInput);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    });
  });
});
