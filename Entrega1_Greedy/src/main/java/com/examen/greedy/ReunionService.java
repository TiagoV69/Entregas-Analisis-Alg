package com.examen.greedy;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ReunionService {

  public List<Reunion> optimizar(List<Reunion> reuniones) {
    if (reuniones == null || reuniones.isEmpty()) {
      return List.of();
    }

    reuniones.forEach(this::validarReunion);

    List<Reunion> ordenadas = new ArrayList<>(reuniones);
    ordenadas.sort(Comparator
        .comparingInt(Reunion::getFin)
        .thenComparingInt(Reunion::getInicio)
        .thenComparing(Reunion::getNombre));

    List<Reunion> seleccionadas = new ArrayList<>();
    int ultimaHoraFin = Integer.MIN_VALUE;

    for (Reunion reunion : ordenadas) {
      if (reunion.getInicio() >= ultimaHoraFin) {
        seleccionadas.add(reunion);
        ultimaHoraFin = reunion.getFin();
      }
    }

    return seleccionadas;
  }

  private void validarReunion(Reunion reunion) {
    if (reunion == null) {
      throw new IllegalArgumentException("La reunion no puede ser nula.");
    }
    if (reunion.getNombre() == null || reunion.getNombre().isBlank()) {
      throw new IllegalArgumentException("El nombre de la reunion es obligatorio.");
    }
    if (reunion.getInicio() < 0 || reunion.getInicio() > 23
        || reunion.getFin() < 1 || reunion.getFin() > 24
        || reunion.getInicio() >= reunion.getFin()) {
      throw new IllegalArgumentException("El horario debe estar entre 0 y 24, y el inicio debe ser menor que el fin.");
    }
  }

}
