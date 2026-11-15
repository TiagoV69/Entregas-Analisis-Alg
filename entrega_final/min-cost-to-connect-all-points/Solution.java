import java.util.*;

class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        int[] costo = new int[n];
        Arrays.fill(costo, Integer.MAX_VALUE);
        boolean[] conectado = new boolean[n];

        costo[0] = 0;
        int total = 0;

        for (int paso = 0; paso < n; paso++) {
            int elegido = -1;
            for (int i = 0; i < n; i++) {
                if (!conectado[i] && (elegido == -1 || costo[i] < costo[elegido])) {
                    elegido = i;
                }
            }

            conectado[elegido] = true;
            total += costo[elegido];
            for (int j = 0; j < n; j++) {
                if (!conectado[j]) {
                    int distancia = Math.abs(points[elegido][0] - points[j][0])
                            + Math.abs(points[elegido][1] - points[j][1]);
                    if (distancia < costo[j]) {
                        costo[j] = distancia;
                    }
                }
            }
        }

        return total;
    }
}