// FUNCIONES PARA ACTIVAR Y DESACTIVAR BOTONES

const btnOn = id => {
  const btn = document.querySelector(`${id}`)
  btn.removeAttribute("disabled");
  btn.classList.remove("active")
}
const btnOff = id => {
  const btn = document.querySelector(`${id}`)
  btn.setAttribute("disabled", true);
  btn.classList.add("active")
}

/* ----------------------------------------------------------------- */
/*                    FUNCIÓN cambiarClase                           */
/* ----------------------------------------------------------------- */

const cambiarClase = e => {
  let element = e.target;
  if (element.classList.contains("error")) {
    element.classList.remove("error");
  }
}
async function listar(tipo, id) {
    const url = "/"+tipo+"/"+id;
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try{
      const response = await fetch(url, settings);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error en la solicitud:", response.status);
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
    }
  };