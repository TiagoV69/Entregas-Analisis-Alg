package com.examen.greedy;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReunionService {

  public List<Reunion> optimizar(List<Reunion> reuniones) {
    if (reuniones == null || reuniones.isEmpty()) {
      return List.of();
    }

    return null;
  }

  private void validarReunion(Reunion reunion) {

  }

}
