let menu = document.getElementById("Menu");
let sub = document.getElementById("sub");

function animateMenu() {
    menu.removeEventListener("mouseover", animateMenu); // Eliminamos el evento para evitar múltiples animaciones.
  
    // Animación para el submenú.
    sub.animate([{ bottom: "0px" }, { bottom: "50px" }], {
      duration: 2000,
      easing: "ease",
      fill: "forwards",
    });
  
    // Animación para el menú principal.
    menu.animate([{ bottom: "20px" }, { bottom: "100px" }], {
      duration: 2000,
      easing: "ease",
      fill: "forwards",
    });
  
    //Restauramos el evento de 'mouseover' después de la animación.
    setTimeout(() => {
      menu.addEventListener("mouseover", animateMenu);
    }, 2000);
  }
  
  // Añadimos el evento 'mouseover' al menú para iniciar la animación.
  menu.addEventListener("mouseover", animateMenu);

