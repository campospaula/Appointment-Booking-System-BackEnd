window.addEventListener('load', function () {
    const btnCerrarSesion = this.document.getElementById("closeApp");
    btnCerrarSesion.addEventListener('click', function () {
      location.replace("http://localhost:8080/logout");
    });
  });