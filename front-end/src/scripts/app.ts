const profileModal = document.getElementById("profileModal") as HTMLDialogElement;
const profileIconLink = document.getElementById("profile-icon") as HTMLAnchorElement;

profileIconLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the <a> tag
    profileModal.showModal();
    profileModal.style.display = "flex";
});

profileModal.addEventListener("click", (event) => {
    if (event.target === profileModal) {
        profileModal.close();
        profileModal.style.display = "none";
    }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileModal.open) {
    profileModal.close();
    profileModal.style.display = "none";
  }
});


