package com.dh.clinica.service;

import com.dh.clinica.model.Odontologo;
import com.dh.clinica.repository.OdontologoRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
@Service
public class OdontologoService {

    private final OdontologoRepository odontologoRepository;
    private static final Logger LOGGER = Logger.getLogger(OdontologoService.class);

    @Autowired
    public OdontologoService(OdontologoRepository odontologoRepository) {
        this.odontologoRepository = odontologoRepository;
    }

    public Odontologo registrarOdontologo(Odontologo odontologo) {
        LOGGER.info("Guardado Odontólogo - POST");
        return odontologoRepository.save(odontologo);

    }

    public void eliminar(Integer id) {
        LOGGER.info("Eliminando Odontólogo - DELETE");
        odontologoRepository.deleteById(id);
    }

    public Optional<Odontologo> buscar(Integer id) {
        LOGGER.info("Buscando Odontólogo - GET + ID");
        return odontologoRepository.findById(id);
    }

    public List<Odontologo> buscarTodos() {
        LOGGER.info("Listando Odontólogos - GET ALL");
        return odontologoRepository.findAll();
    }

    public Odontologo actualizar(Odontologo odontologo) {
        LOGGER.info("Actualizando Odontólogo - PUT");
        return odontologoRepository.save(odontologo);
    }
}
