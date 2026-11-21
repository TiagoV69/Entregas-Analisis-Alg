
import java.util.*;

class Solution {
    public int lengthOfLIS(int[] nums) {

        int n = nums.length;
        int[] cola = new int[n];
        int longitud = 0;

        for (int num : nums) {

            int izquierda = 0;
            int derecha = longitud;

            // Buscar la primera posición con valor mayor o igual
            while (izquierda < derecha) {

                int medio = izquierda + (derecha - izquierda) / 2;

                if (cola[medio] < num) {
                    izquierda = medio + 1;
                } else {
                    derecha = medio;
                }
            }

            // Actualizar el menor valor final posible
            cola[izquierda] = num;

            // Si se agrega una nueva longitud, incrementar
            if (izquierda == longitud) {
                longitud++;
            }
        }

        return longitud;
    }
}
