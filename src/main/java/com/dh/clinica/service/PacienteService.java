package com.dh.clinica.service;


import com.dh.clinica.model.Paciente;
import com.dh.clinica.repository.PacienteRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private static final Logger LOGGER = Logger.getLogger(PacienteService.class);

    @Autowired
    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    public Paciente guardar(Paciente p) {
       LOGGER.info("Guardado Paciente - POST");
       return pacienteRepository.save(p);
    }

    public Optional<Paciente> buscar(Integer id) {
        LOGGER.info("Buscando Paciente - GET + ID");
        return pacienteRepository.findById(id);
    }

    public List<Paciente> buscarTodos() {
        LOGGER.info("Listando Pacientes - GET ALL");
        return pacienteRepository.findAll();
    }

    public void eliminar(Integer id) {
        LOGGER.info("Eliminando Paciente - DELETE");
        pacienteRepository.deleteById(id);
    }

    public Paciente actualizar(Paciente p) {
        LOGGER.info("Actualizando Paciente - PUT");
        return pacienteRepository.save(p);
    }
}
