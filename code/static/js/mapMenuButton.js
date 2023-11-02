const toggleButton = document.getElementById("toggleMenu");
const checkboxMenu = document.getElementById("checkboxMenu");

toggleButton.addEventListener("click", () => {
  if (checkboxMenu.classList.contains("hidden")) {
    checkboxMenu.classList.remove("hidden");
    toggleButton.innerHTML = '<i class=\'bx bx-menu icon\'></i>'; // Setze das Bild im Button
  } else {
    checkboxMenu.classList.add("hidden");
    toggleButton.innerHTML = '<i class=\'bx bx-menu icon\'></i>'; // Setze das Bild im Button
  }
});
