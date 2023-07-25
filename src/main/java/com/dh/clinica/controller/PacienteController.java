package com.dh.clinica.controller;

import com.dh.clinica.exceptions.ResourceNotFoundException;
import com.dh.clinica.model.Paciente;
import com.dh.clinica.service.PacienteService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {
    @Autowired
    private PacienteService pacienteService;
    private static final Logger LOGGER = Logger.getLogger(PacienteController.class);


    @PostMapping()
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente) {
        LOGGER.info("Paciente guardado con éxito");
        return ResponseEntity.ok(pacienteService.guardar(paciente));

    }

    @GetMapping
    public List<Paciente> buscarTodos(){
        return pacienteService.buscarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscar(@PathVariable Integer id) throws ResourceNotFoundException {
        Paciente paciente = pacienteService.buscar(id).orElse(null);
        if (paciente != null){
            LOGGER.info("Paciente encontrado");
            return ResponseEntity.ok(paciente);
        } else {
            LOGGER.error("El paciente " + id + " no está registrado");
            throw new ResourceNotFoundException("El paciente " + id + " no está registrado");
        }
    }

    @PutMapping()
    public ResponseEntity<Paciente> actualizar(@RequestBody Paciente paciente) {
        ResponseEntity<Paciente> response = null;

        if (paciente.getId() != null && pacienteService.buscar(paciente.getId()).isPresent()) {
            LOGGER.info("Paciente modificado con éxito");
            response = ResponseEntity.ok(pacienteService.actualizar(paciente));
        }
        else {
            LOGGER.error("El paciente " + paciente.getId() + " no está registrado.");
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        ResponseEntity<String> response = null;

        if (pacienteService.buscar(id).isPresent()) {
            pacienteService.eliminar(id);
            LOGGER.info("Paciente eliminado con éxito");
            response = ResponseEntity.status(HttpStatus.NO_CONTENT).body("Eliminado");
        } else {
            LOGGER.error("El paciente " +id+ " no está registrado");
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return response;
    }
}
