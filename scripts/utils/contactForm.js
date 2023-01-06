function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "inherit";
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

function sendData(e) {
  e.preventDefault();

  for (const element of e.target.elements) {
    if (
      element.tagName.toLowerCase() === "input" ||
      element.tagName.toLowerCase() === "textarea"
    ) {
      console.log(element.value);
      element.value = "";
    }
  }
  closeModal();
}
