package com.dh.clinica.controller;

import com.dh.clinica.exceptions.ResourceNotFoundException;
import com.dh.clinica.model.Odontologo;
import com.dh.clinica.model.Paciente;
import com.dh.clinica.model.Turno;
import com.dh.clinica.service.OdontologoService;
import com.dh.clinica.service.PacienteService;
import com.dh.clinica.service.TurnoService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turnos")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;
    @Autowired
    private PacienteService pacienteService;
    @Autowired
    private OdontologoService odontologoService;

    private static final Logger LOGGER = Logger.getLogger(TurnoController.class);

    @PostMapping
    public ResponseEntity<Turno> registrarTurno(@RequestBody Turno turno) {
        ResponseEntity<Turno> response;
        Paciente paciente = turno.getPaciente();
        Odontologo odontologo = turno.getOdontologo();
        if (pacienteService.buscar(paciente.getId()).isPresent() &&
                odontologoService.buscar(odontologo.getId()).isPresent()){
            LOGGER.info("Turno agregado con éxito");
            response = ResponseEntity.ok(turnoService.registrarTurno(turno));
        } else if (pacienteService.buscar(paciente.getId()).isPresent()){
            LOGGER.error("El odontólogo no está registrado");
            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else if (odontologoService.buscar(odontologo.getId()).isPresent()) {
            LOGGER.error("El paciente no está registrado");
            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            LOGGER.error("Paciente y Odontólogo no registrados");
            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return response;
    }

    @GetMapping("/{id}")
    public Turno buscarTurno(@PathVariable Integer id) throws ResourceNotFoundException{
        Turno turno = turnoService.buscar(id).orElse(null);
        if (turno != null){
            LOGGER.info("Turno encontrado");
            return turno;
        } else{
            LOGGER.error("El turno " +id+ " no está registrado");
            throw new ResourceNotFoundException("El turno " +id+ " no está registrado");
        }
    }

    @GetMapping
    public ResponseEntity<List<Turno>> listar() {
        return ResponseEntity.ok(turnoService.listar());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        ResponseEntity<String> response;
        if (turnoService.buscar(id).isPresent()) {
            turnoService.eliminar(id);
            LOGGER.info("Turno eliminado con éxito");
            response = ResponseEntity.status(HttpStatus.NO_CONTENT).body("Eliminado");
        } else {
            LOGGER.error("El turno " +id+ " no está registrado");
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return response;
    }

    @PutMapping
    public ResponseEntity<Turno> actualizarTurno(@RequestBody Turno turno) {
        return ResponseEntity.ok(turnoService.actualizar(turno));
    }
}
