
window.addEventListener('load', function () {
  const btnCerrarSesion = this.document.getElementById("closeApp");

  btnCerrarSesion.addEventListener('click', function () {
    location.replace("http://localhost:8080/logout");
  });

  const formCrearTurno = this.document.getElementById("turno");
  const listaTurnos = this.document.getElementById("lista-turnos");
  const turnoPacienteID = this.document.getElementById("turno-paciente-id");
  const turnoOdontologoID = this.document.getElementById("turno-odontologo-id");
  const date = this.document.getElementById("turno-date");

  /* -------------------------------------------------------------------------- */
  /*                    Crear nuevo turno [POST]                             */
  /* -------------------------------------------------------------------------- */



  formCrearTurno.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnOff(".nueva-tarea > button")
    const url = "/turnos";

    const pacienteID = turnoPacienteID.value;
    const paciente_info = await listar("pacientes", pacienteID);
    console.log(paciente_info)

    const odontologoID = turnoOdontologoID.value
    const odontologo_info = await listar("odontologos", odontologoID)
    console.log(odontologo_info)

    const data = {
      paciente: paciente_info,
      odontologo: odontologo_info,
      date: date.value
    }
    const settings = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if(paciente_info != undefined && odontologo_info != undefined){
      await fetch(url, settings)
      listarTurnos()
      formCrearTurno.reset();
      btnOn(".nueva-tarea > button")
    } else {
        btnOn(".nueva-tarea > button")
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, paciente/odontólogo no están registrados.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
  })

  /* -------------------------------------------------------------------------- */
  /*                    Listar todos los turnos [GET]                    */
  /* -------------------------------------------------------------------------- */

  async function listarTurnos() {
    const url = "/turnos";
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(url, settings)
    const json = await response.json()
    renderizarTurnos(json);
  };

  /* -------------------------------------------------------------------------- */
  /*                        Listar turno [GET]                               */
  /* -------------------------------------------------------------------------- */

  const unTurnoForm = this.document.getElementById("un-turno");
  const turnoID = this.document.getElementById("turno-id");
  const turnoUl = this.document.getElementById("un-turno-list");

  unTurnoForm.addEventListener("submit",async e =>{
    e.preventDefault();

    btnOff(".un-turno > button")
    const id = turnoID.value;
    listarTurno(id)
  })

  async function listarTurno(id) {
    const url = "/turnos/"+id;
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
        renderizarTurno(json);
      } else {
        console.log("Error en la solicitud:", response.status)
        btnOn(".un-turno > button")
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el turno no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
      btnOn(".un-turno > button")
      return Swal.fire({
        title: 'Error!',
        text: 'Error en la solicitud, el turno no está registrado.',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  };


  /* -------------------------------------------------------------------------- */
  /*                       Modificar turno [PUT]                             */
  /* -------------------------------------------------------------------------- */

  const formActualizarTurno = this.document.getElementById("mod-turno");
  const tID = this.document.getElementById("t-id");
  const tPacienteID = this.document.getElementById("t-paciente-id");
  const tOdontologoID = this.document.getElementById("t-odontologo-id");
  const tFecha = this.document.getElementById("t-date");

  const verificarTurno = async turnoID =>{
    const url = "/turnos";
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let turnoOk = false
    try{
      const response = await fetch(url, settings);
      if(response.ok){
        const turnos = await response.json();
        turnos.forEach(turno => {
          let {id} = turno;
          id == turnoID ? turnoOk = true : ""
        });
      }
    } catch (err){
      console.log("Error en la solicitud:", err);
    }
    return turnoOk;
  }

  formActualizarTurno.addEventListener("submit", async e =>{
    e.preventDefault();
    btnOff(".nueva-tarea > button")

    const url = "/turnos";
    const id = tID.value;

    const pacienteID = tPacienteID.value;
    const paciente_info = await listar("pacientes", pacienteID)
    const odontologoID = tOdontologoID.value;
    const odontologo_info = await listar("odontologos", odontologoID)

    const data = {
      id: id,
      paciente: paciente_info,
      odontologo: odontologo_info,
      date: tFecha.value
    }
    const settings = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const turnoOK = await verificarTurno(id);
    if(turnoOK){
      try{
        const response = await fetch(url, settings)
        if (response.ok) {
          listarTurnos()
          formActualizarTurno.reset();
          turnoUl.innerHTML =""
          btnOn(".nueva-tarea > button")
        } else {
          btnOn(".nueva-tarea > button")
          formActualizarTurno.reset();
          return Swal.fire({
            title: 'Error!',
            text: 'Error en la solicitud, el turno no está registrado.',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
      } catch (err) {
        console.log("Error en la solicitud:", err);
        btnOn(".nueva-tarea > button")
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el turno no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    } else {
      btnOn(".nueva-tarea > button")
      return Swal.fire({
        title: 'Error!',
        text: 'Error en la solicitud, el turno no está registrado.',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  });


  //--------------formatear date----------------------------

  const obtnerFecha = (createdAt) =>{
    const data = new Date(createdAt);
    const date = data.toLocaleDateString();
    const hora = data.toLocaleTimeString();
    const dateFormateada = `${date} - ${hora}`;
    return dateFormateada
  }

  /* -------------------------------------------------------------------------- */
  /*                  Renderizar turnos en pantalla                          */
  /* -------------------------------------------------------------------------- */

  const renderizarTurnos = turnosList => {
    btnOn(".nueva-tarea > button");
    return (listaTurnos.innerHTML=
    turnosList.map((turno)=>{
      let { id, paciente, odontologo, date } = turno;
      const dateFormateada = obtnerFecha(date)
      return `
        <li class="tarea pacientes-list">
          <p>${id}</p>
          <div class="descripcionDatos">
            <p>${paciente.id}</p>
            <p>${paciente.nombre}</p>
            <p>${paciente.apellido}</p>
          </div>
          <div>
            <h4>FECHA</h4>
            <p>${dateFormateada}</p>
          </div>
          <div class="descripcionDatos">
            <p>${odontologo.id}</p>
            <p>${odontologo.nombre}</p>
            <p>${odontologo.apellido}</p>
          </div>
        </li>
      `
    }).join("")
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                  Renderizar turno en pantalla                          */
  /* -------------------------------------------------------------------------- */

  const renderizarTurno = json => {
    btnOn(".un-turno > button");
    let { id, paciente, odontologo, date} = json
    const dateFormateada = obtnerFecha(date)
    return turnoUl.innerHTML = `
      <li class="tarea pacientes-list">
        <p>${id}</p>
        <div class="descripcionDatos">
          <p>${paciente.id}</p>
          <p>${paciente.nombre}</p>
          <p>${paciente.apellido}</p>
        </div>
        <div>
          <h4>FECHA</h4>
          <p>${dateFormateada}</p>
        </div>
        <div class="descripcionDatos">
          <p>${odontologo.id}</p>
          <p>${odontologo.nombre}</p>
          <p>${odontologo.apellido}</p>
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
    btnOff("#eliminar-btn")
    const id = turnoID.value
    const url = "/turnos/"+id;
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
        listarTurnos()
        turnoUl.innerHTML =""
      } else {
        console.log("Error en la solicitud:", response.status)
        btnOn("#eliminar-btn")
        return Swal.fire({
          title: 'Error!',
          text: 'Error en la solicitud, el turno no está registrado.',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
      btnOn("#eliminar-btn")
      return Swal.fire({
        title: 'Error!',
        text: 'Error en la solicitud, el turno no está registrado.',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  })
});