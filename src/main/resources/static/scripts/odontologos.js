
window.addEventListener('load', function () {
    
  
    
  
    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */
    const btnCerrarSesion = this.document.getElementById("closeApp");
    btnCerrarSesion.addEventListener('click', function () {
      location.replace("http://localhost:8080/logout");
    });
    
    const formCrearOdontologo = this.document.getElementById("odontologo");
    const listaOdontologos = this.document.getElementById("lista-odontologos");  
    const odontologoNombre = this.document.getElementById("odontologo-nombre");
    const odontologoApellido = this.document.getElementById("odontologo-apellido");
    const odontologoMatricula = this.document.getElementById("odontologo-matricula");
  
    /* -------------------------------------------------------------------------- */
    /*                    Crear nuevo odontologo [POST]                             */
    /* -------------------------------------------------------------------------- */
  
    formCrearOdontologo.addEventListener('submit', async (e) => {
      e.preventDefault();
      btnOff(".nueva-tarea > button")
      const url = "/odontologos";
      const data = {
        nombre: odontologoNombre.value,
        apellido: odontologoApellido.value,
        matricula: odontologoMatricula.value
      }
      const settings = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      await fetch(url, settings)
      listarOdontologos()
      formCrearOdontologo.reset();
    })
  
    /* -------------------------------------------------------------------------- */
    /*                    Listar todos los odontologos [GET]                    */
    /* -------------------------------------------------------------------------- */
  
    async function listarOdontologos() {
      const url = "/odontologos";
      const settings = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(url, settings)
      const json = await response.json()
      renderizarOdontologos(json);
    };
    listarOdontologos()
  
    /* -------------------------------------------------------------------------- */
    /*                        Listar odontologo [GET]                               */
    /* -------------------------------------------------------------------------- */
    
    const unOdontologoForm = this.document.getElementById("un-odontologo");
    const odontologoID = this.document.getElementById("odontologo-id");
    const odontologoUl = this.document.getElementById("un-odontologo-list");
  
    unOdontologoForm.addEventListener("submit",async e =>{
      e.preventDefault();
  
      btnOff(".un-odontologo > button")
      const id = odontologoID.value;
      listarOdontologo(id)
    })
  
    async function listarOdontologo(id) {
        const url = "/odontologos/"+id;
        const settings = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                }
            }
        try{
            const response = await fetch(url, settings)
            if(response.ok){
                const json = await response.json()
                renderizarOdontologo(json);
                return json;
            } else {
                console.log("Error en la solicitud:", response.status);
                btnOn(".un-odontologo > button")
                return Swal.fire({
                  title: 'Error!',
                  text: 'Error en la solicitud, el odontologo no está registrado.',
                  icon: 'error',
                  confirmButtonText: 'Cool'
                })
            }
        } catch (error) {
            console.log("Error en la solicitud:", error);
            btnOn(".un-odontologo > button")
            return Swal.fire({
              title: 'Error!',
              text: 'Error en la solicitud, el odontologo no está registrado.',
              icon: 'error',
              confirmButtonText: 'Cool'
            })
        }
    };
  
  
    /* -------------------------------------------------------------------------- */
    /*                       Modificar odontologo [PUT]                             */
    /* -------------------------------------------------------------------------- */
  
    const formActualizarOdontologo = this.document.getElementById("mod-odontologo");
    const oID = this.document.getElementById("o-id");  
    const oNombre = this.document.getElementById("o-nombre");
    const oApellido = this.document.getElementById("o-apellido");
    const oMatricula = this.document.getElementById("o-matricula");

    const verificarOdontologo = async odontologoID =>{
      const url = "/odontologos";
      const settings = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      let odontologoOK = false
      try{
        const response = await fetch(url, settings);
        if(response.ok){
          const odontologos = await response.json();
          odontologos.forEach(odontologo => {
            let {id} = odontologo;
            if (id == odontologoID){
              odontologoOK = true
            }
          });
        }
      } catch (err){
          console.log(err);
        }
      return odontologoOK;
    }
    
    formActualizarOdontologo.addEventListener("submit", async e =>{
      e.preventDefault();
      btnOff(".nueva-tarea > button")
      const id = oID.value
      const url = "/odontologos";
      const data = {
        id: id,
        nombre: oNombre.value,
        apellido: oApellido.value,
        matricula: oMatricula.value
      }
      const settings = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const odontologoOK = await verificarOdontologo(id);
      if(odontologoOK){
        try {
          const response = await fetch(url, settings)
          if(response.ok){
            listarOdontologos()
            formActualizarOdontologo.reset();
            btnOn(".nueva-tarea > button")
            odontologoUl.innerHTML=""
          } else {
            formActualizarOdontologo.reset();
            btnOn(".nueva-tarea > button");
            return Swal.fire({
              title: 'Error!',
              text: 'Error en la solicitud, el odontologo no está registrado.',
              icon: 'error',
              confirmButtonText: 'Cool'
            })
          }
        } catch (err) {
          console.log("Error en la solicitud:", err)
          unOdontologoForm.reset();
          btnOn(".nueva-tarea > button");
          return Swal.fire({
            title: 'Error!',
            text: 'Error en la solicitud, el odontologo no está registrado.',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
      } else {
        unOdontologoForm.reset();
        btnOn(".nueva-tarea > button");
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el odontologo no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    });
  
    /* -------------------------------------------------------------------------- */
    /*                  Renderizar odontologos en pantalla                          */
    /* -------------------------------------------------------------------------- */
  
    const renderizarOdontologos = odontologosList => {
      btnOn(".nueva-tarea > button");
      return (listaOdontologos.innerHTML=
        odontologosList.map((odontologo)=>{
          let { id, nombre, apellido, matricula } = odontologo
          return `
            <li class="tarea pacientes-list" data-aos="zoom-out-right" data-aos-duration="1000">
              <div class="descripcion descripcionDatosO">  
                <h4>Odontologo</h4>
                <p>${id}</p>
                <p>${apellido}, ${nombre}</p>
                <p>${matricula}</p>
              </div>
            </li>
          `
        }).join("")
      )
    }
  
    /* -------------------------------------------------------------------------- */
    /*                  Renderizar odontologo en pantalla                          */
    /* -------------------------------------------------------------------------- */
  
    const renderizarOdontologo = json => {
      btnOn(".un-odontologo > button");
      let { id, nombre, apellido, matricula} = json
      return odontologoUl.innerHTML = `
        <li class="tarea pacientes-list">
          <div class="descripcion decripcionDatos">  
            <p>${id}</p>
            <p>${apellido}, ${nombre}</p>
            <p>${matricula}</p>
          </div>
        </li>
      `
    }
  
    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */
    const eliminarBtn = this.document.getElementById("eliminar-btn");
    eliminarBtn.addEventListener("click", async e =>{
      btnOff("#eliminar-btn")
      e.preventDefault();
      const id = odontologoID.value
      const url = "/odontologos/"+id;
      const config = {
        method: "DELETE",
        headers:{
          'Content-Type': 'application/json'
        }
      }
      const odontologoOk = await verificarOdontologo(id);
      try{
        const response = await fetch(url, config)
        if(response.ok){
          btnOn("#eliminar-btn")
          listarOdontologos();
          odontologoUl.innerHTML=""
        } else {
          console.log("Error en la solicitud:", response.status)
          formActualizarPaciente.reset();
          btnOn("#eliminar-btn");
          return Swal.fire({
            title: 'Error!',
            text: 'Error en la solicitud, el odontologo no está registrado.',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
      } catch (err) {
        console.log("Error en la solicitud:", err)
        unOdontologoForm.reset();
        btnOn("#eliminar-btn")
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el odontologo no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    })
  });