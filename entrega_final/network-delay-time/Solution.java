import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> grafo = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            grafo.add(new ArrayList<>());
        }
        for (int[] t : times) {
            grafo.get(t[0]).add(new int[] { t[1], t[2] });
        }

        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;

        PriorityQueue<int[]> cola = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        cola.add(new int[] { k, 0 });

        while (!cola.isEmpty()) {
            int[] actual = cola.poll();
            int nodo = actual[0];
            int tiempo = actual[1];

            if (tiempo > dist[nodo])
                continue;

            for (int[] vecino : grafo.get(nodo)) {
                int destino = vecino[0];
                int nuevoTiempo = tiempo + vecino[1];
                if (nuevoTiempo < dist[destino]) {
                    dist[destino] = nuevoTiempo;
                    cola.add(new int[] { destino, nuevoTiempo });
                }
            }
        }
        int mayor = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE)
                return -1;
            mayor = Math.max(mayor, dist[i]);
        }
        return mayor;
    }
}