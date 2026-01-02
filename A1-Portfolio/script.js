//get modal and container
const modal = document.querySelector(".modal");
const modalImg = modal.querySelector(".modal-content");

//get images
const images = document.querySelectorAll(".modal-img");

images.forEach(img => {
  img.addEventListener("click", () => {
    modalImg.src = img.src;
    modal.style.display = "flex";
  });
});

//click
modal.addEventListener("click", () => {
  modal.style.display = "none";
});
