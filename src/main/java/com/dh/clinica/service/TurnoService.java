package com.dh.clinica.service;

import com.dh.clinica.model.Turno;
import com.dh.clinica.repository.TurnoRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private static final Logger LOGGER = Logger.getLogger(TurnoService.class);

    @Autowired
    public TurnoService(TurnoRepository turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    public Turno registrarTurno(Turno turno) {
        LOGGER.info("Guardado Turno - POST");
        return turnoRepository.save(turno);
    }

    public List<Turno> listar() {
        LOGGER.info("Listando Turnos - GET ALL");
        return turnoRepository.findAll();
    }

    public void eliminar(Integer id) {
        LOGGER.info("Eliminando Turno - DELETE");
        turnoRepository.deleteById(id);
    }

    public Turno actualizar(Turno turno) {
        LOGGER.info("Actualizando Turno - PUT");
        return turnoRepository.save(turno);
    }

    public Optional<Turno> buscar(Integer id) {
        LOGGER.info("Buscando Turno - GET + ID");
        return turnoRepository.findById(id);
    }

}
