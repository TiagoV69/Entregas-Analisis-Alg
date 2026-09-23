package com.examen.greedy;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ReunionServiceTest {

    private final ReunionService reunionService = new ReunionService();

    @Test
    void seleccionaLaMayorCantidadDeReunionesSinCruces() {
        List<Reunion> reuniones = List.of(
                new Reunion("A", 1, 4),
                new Reunion("B", 3, 5),
                new Reunion("C", 0, 6),
                new Reunion("D", 5, 7),
                new Reunion("E", 3, 9),
                new Reunion("F", 5, 9),
                new Reunion("G", 6, 10),
                new Reunion("H", 8, 11),
                new Reunion("I", 8, 12),
                new Reunion("J", 2, 14),
                new Reunion("K", 12, 16)
        );

        List<Reunion> resultado = reunionService.optimizar(reuniones);

        assertEquals(List.of("A", "D", "H", "K"),
                resultado.stream().map(Reunion::getNombre).toList());
    }

    @Test
    void permiteUnaReunionCuandoLaAnteriorTermina() {
        List<Reunion> resultado = reunionService.optimizar(List.of(
                new Reunion("Primera", 9, 11),
                new Reunion("Segunda", 11, 12)
        ));

        assertEquals(2, resultado.size());
    }
}
