
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {

        int totalGas = 0;
        int totalCost = 0;
        int tanque = 0;
        int inicio = 0;

        for (int i = 0; i < gas.length; i++) {

            totalGas += gas[i];
            totalCost += cost[i];

            tanque += gas[i] - cost[i];

            // Si el tanque queda negativo, no se puede
            // comenzar desde ninguna estación anterior
            if (tanque < 0) {
                inicio = i + 1;
                tanque = 0;
            }
        }

        // Si el gas total es menor que el costo total,
        // no es posible completar el recorrido
        if (totalGas < totalCost) {
            return -1;
        }

        return inicio;
    }
}
