package com.dh.clinica.controller;

import com.dh.clinica.exceptions.ResourceNotFoundException;
import com.dh.clinica.model.Odontologo;

import com.dh.clinica.service.OdontologoService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/odontologos")
public class OdontologoController {
    @Autowired
    private OdontologoService odontologoService;
    private static final Logger LOGGER = Logger.getLogger(OdontologoController.class);

    @PostMapping()
    public ResponseEntity<Odontologo> registrarOdontologo(@RequestBody Odontologo odontologo) {
        LOGGER.info("Odontólogo guardado con éxito");
        return ResponseEntity.ok(odontologoService.registrarOdontologo(odontologo));

    }

    @GetMapping("/{id}")
    public ResponseEntity<Odontologo> buscar(@PathVariable Integer id) throws ResourceNotFoundException {
        Odontologo odontologo = odontologoService.buscar(id).orElse(null);
        if (odontologo != null){
            LOGGER.info("Odontólogo encontrado");
            return ResponseEntity.ok(odontologo);
        } else {
            LOGGER.error("El odontólogo " +id+ " no está registrado");
            throw new ResourceNotFoundException("El odontólogo " +id+ " no está registrado");
        }

    }

    @PutMapping()
    public ResponseEntity<Odontologo> actualizar(@RequestBody Odontologo odontologo) {
        ResponseEntity<Odontologo> response = null;

        if (odontologo.getId() != null && odontologoService.buscar(odontologo.getId()).isPresent()) {
            LOGGER.info("Odontólogo modificado con éxito");
            response = ResponseEntity.ok(odontologoService.actualizar(odontologo));
        }
        else {
            LOGGER.error("El odontólogo " + odontologo.getId() + " no está registrado.");
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        ResponseEntity<String> response = null;

        if (odontologoService.buscar(id).isPresent()) {
            odontologoService.eliminar(id);
            LOGGER.info("Odontólogo eliminado con éxito");
            response = ResponseEntity.status(HttpStatus.NO_CONTENT).body("Eliminado");
        } else {
            LOGGER.error("El odontólogo " +id+ " no está registrado");
            response = ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return response;
    }
    @GetMapping
    public ResponseEntity<List<Odontologo>> buscarTodos(){
        return ResponseEntity.ok(odontologoService.buscarTodos());
    }



}
