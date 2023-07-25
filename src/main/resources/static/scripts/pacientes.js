
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = this.document.getElementById("closeApp");
  btnCerrarSesion.addEventListener('click', function () {
    location.replace("http://localhost:8080/logout");
  });
  
  const formCrearPaciente = this.document.getElementById("paciente");
  const listaPacientes = this.document.getElementById("lista-pacientes");  
  const pacienteNombre = this.document.getElementById("paciente-nombre");
  const pacienteApellido = this.document.getElementById("paciente-apellido");
  const pacienteDni = this.document.getElementById("paciente-dni");
  const pacienteCalle = this.document.getElementById("paciente-calle");
  const pacienteNumero = this.document.getElementById("paciente-numero");
  const pacienteLocalidad = this.document.getElementById("paciente-localidad");
  const pacienteProvincia = this.document.getElementById("paciente-provincia");

  /* -------------------------------------------------------------------------- */
  /*                    Crear nuevo paciente [POST]                             */
  /* -------------------------------------------------------------------------- */

  formCrearPaciente.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnOff(".nueva-tarea > button")
    const url = "/pacientes";
    const data = {
      nombre: pacienteNombre.value,
      apellido: pacienteApellido.value,
      dni: pacienteDni.value,
      fechaIngreso: new Date(),
      domicilio: {
        calle: pacienteCalle.value,
        numero: pacienteNumero.value,
        localidad: pacienteLocalidad.value,
        provincia: pacienteProvincia.value,
      }
    }
    const settings = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    await fetch(url, settings)
    listarPacientes()
    formCrearPaciente.reset();
  })

  /* -------------------------------------------------------------------------- */
  /*                    Listar todos los pacientes [GET]                    */
  /* -------------------------------------------------------------------------- */

  async function listarPacientes() {
    const url = "/pacientes";
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(url, settings)
    const json = await response.json()
    renderizarPacientes(json);
  };
  listarPacientes()

  /* -------------------------------------------------------------------------- */
  /*                        Listar paciente [GET]                               */
  /* -------------------------------------------------------------------------- */
  
  const unPacienteForm = this.document.getElementById("un-paciente");
  const pacienteID = this.document.getElementById("paciente-id");
  const pacienteUl = this.document.getElementById("un-paciente-list");

  unPacienteForm.addEventListener("submit",async e =>{
    e.preventDefault();

    btnOff(".un-paciente > button")
    const id = pacienteID.value;
    listarPaciente(id)
  })

  async function listarPaciente(id) {
    const url = "/pacientes/"+id;
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
          renderizarPaciente(data);
          return data;
        } else {
          console.log("Error en la solicitud:", response.status);
          btnOn(".un-paciente > button")
          return Swal.fire({
            title: 'Error!',
            text: 'Error en la solicitud, el paciente no está registrado.',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
      } catch (error) {
        console.log("Error en la solicitud:", error);
        btnOn(".un-paciente > button")
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el paciente no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
  };

  /* -------------------------------------------------------------------------- */
  /*                       Modificar paciente [PUT]                             */
  /* -------------------------------------------------------------------------- */

  const formActualizarPaciente = this.document.getElementById("mod-paciente");
  const pID = this.document.getElementById("p-id");  
  const pNombre = this.document.getElementById("p-nombre");
  const pApellido = this.document.getElementById("p-apellido");
  const pDni = this.document.getElementById("p-dni");
  const pFecha = this.document.getElementById("p-fecha");
  const pCalle = this.document.getElementById("p-calle");
  const pNumero = this.document.getElementById("p-numero");
  const pLocalidad = this.document.getElementById("p-localidad");
  const pProvincia = this.document.getElementById("p-provincia");

  const verificarPaciente = async pacienteID =>{
    const url = "/pacientes";
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let pacienteOK = false
    try{
      const response = await fetch(url, settings);
      if(response.ok){
        const pacientes = await response.json();
        pacientes.forEach(paciente => {
          let {id} = paciente;
          if(id == pacienteID){
            pacienteOK = true
          }
        });
      }
    } catch (err){
        console.log(err);
      }
    return pacienteOK;
  }
  
  formActualizarPaciente.addEventListener("submit", async e =>{
    e.preventDefault();
    btnOff(".nueva-tarea > button")
    const url = "/pacientes";
    const id = pID.value;
    const data = {
      id: id,
      nombre: pNombre.value,
      apellido: pApellido.value,
      dni: pDni.value,
      fechaIngreso: pFecha.value,
      domicilio: {
        calle: pCalle.value,
        numero: pNumero.value,
        localidad: pLocalidad.value,
        provincia: pProvincia.value,
      }
    }
    const settings = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const pacienteOK = await verificarPaciente(id);
    if(pacienteOK){
      try {
        const response = await fetch(url, settings)
        if (response.ok){
          pacienteUl.innerHTML=""
          listarPacientes()
          formActualizarPaciente.reset();
          btnOn(".nueva-tarea > button");
        } else {
          formActualizarPaciente.reset();
          btnOn(".nueva-tarea > button");
          return Swal.fire({
            title: 'Error!',
            text: 'Error en la solicitud, el paciente no está registrado.',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
      } catch (err) {
        console.log("Error en la solicitud:", err)
        formActualizarPaciente.reset();
        btnOn(".nueva-tarea > button");
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el paciente no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    } else {
      formActualizarPaciente.reset();
      btnOn(".nueva-tarea > button");
      return Swal.fire({
        title: 'Error!',
        text: 'Error en la solicitud, el paciente no está registrado.',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  });

  
  //--------------formatear fecha----------------------------

  const obtnerFecha = (createdAt) =>{
    const data = new Date(createdAt);
    const fecha = data.toLocaleDateString();
    const hora = data.toLocaleTimeString();
    const fechaFormateada = `${fecha} - ${hora}`;
    return fechaFormateada
  }

  /* -------------------------------------------------------------------------- */
  /*                  Renderizar pacientes en pantalla                          */
  /* -------------------------------------------------------------------------- */

  const renderizarPacientes = pacientesList => {
    btnOn(".nueva-tarea > button");
    listaPacientes.innerHTML="";
    return (listaPacientes.innerHTML=
      pacientesList.map((paciente)=>{
        let { id, nombre, apellido, dni, fechaIngreso} = paciente
        let { calle, numero, localidad, provincia } = paciente.domicilio
        const fecha = obtnerFecha(fechaIngreso)
        return `
          <li class="tarea pacientes-list" data-aos="zoom-out-right" data-aos-duration="1000">
            <div class="descripcionDatos">
              <h4>Paciente</h4>
              <p>${id}</p>
              <p>${apellido}, ${nombre}</p>
              <p>${dni}</p>
              <p>${fecha}</p>
            </div>
            <div class="descripcionDatos">
              <h4>Dirección</h4>
              <p>${calle}</p>
              <p>${numero}</p>
              <p>${localidad}</p>
              <p>${provincia}</p>
            </div>
          </li>
        `
      }).join("")
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                  Renderizar paciente en pantalla                          */
  /* -------------------------------------------------------------------------- */

  const renderizarPaciente = json => {
    btnOn(".un-paciente > button");
    let { id, nombre, apellido, dni, fechaIngreso} = json
    let { calle, numero, localidad, provincia } = json.domicilio
    const fecha = obtnerFecha(fechaIngreso)
    return pacienteUl.innerHTML = `
      <li class="tarea pacientes-list" data-aos="zoom-out-right" data-aos-duration="1000">
        <div class="descripcionDatos">
          <h4>Paciente</h4>
          <p>${id}</p>
          <p>${apellido}, ${nombre}</p>
          <p>${dni}</p>
          <p>${fecha}</p>
        </div>
        <div class="descripcionDatos">
          <h4>Dirección</h4>
          <p>${calle}</p>
          <p>${numero}</p>
          <p>${localidad}</p>
          <p>${provincia}</p>
        </div>
      </li>
    `
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  const eliminarBtn = this.document.getElementById("eliminar-btn");
  eliminarBtn.addEventListener("click", async e =>{
    e.preventDefault();
    const id = pacienteID.value;
    btnOff("#eliminar-btn")
    const url = "/pacientes/"+id;
    const config = {
      method: "DELETE",
      headers:{
        'Content-Type': 'application/json'
      }
    }
    try{
      const response = await fetch(url, config)
      if(response.ok){
        btnOn("#eliminar-btn")
        listarPacientes()
        pacienteUl.innerHTML=""
      } else {
        console.log("Error en la solicitud:", response.status)
        formActualizarPaciente.reset();
        btnOn("#eliminar-btn");
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el paciente no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    } catch (err) {
      console.log("Error en la solicitud:", err)
      formActualizarPaciente.reset();
      btnOn("#eliminar-btn");
      return Swal.fire({
        title: 'Error!',
        text: 'Error en la solicitud, el paciente no está registrado.',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  })
});