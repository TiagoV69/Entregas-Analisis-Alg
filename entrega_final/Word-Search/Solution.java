
class Solution {

    public boolean exist(char[][] board, String word) {

        int filas = board.length;
        int columnas = board[0].length;

        boolean[][] visitado = new boolean[filas][columnas];

        for (int i = 0; i < filas; i++) {
            for (int j = 0; j < columnas; j++) {

                if (buscar(board, word, i, j, 0, visitado)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean buscar(char[][] board, String word,
                           int fila, int columna, int indice,
                           boolean[][] visitado) {

        // Se encontró toda la palabra
        if (indice == word.length()) {
            return true;
        }

        // Validar límites, caracteres y celdas visitadas
        if (fila < 0 || fila >= board.length ||
            columna < 0 || columna >= board[0].length ||
            visitado[fila][columna] ||
            board[fila][columna] != word.charAt(indice)) {
            return false;
        }

        // Marcar la celda como visitada
        visitado[fila][columna] = true;

        // Explorar las cuatro direcciones
        boolean encontrado =
                buscar(board, word, fila - 1, columna, indice + 1, visitado) ||
                buscar(board, word, fila + 1, columna, indice + 1, visitado) ||
                buscar(board, word, fila, columna - 1, indice + 1, visitado) ||
                buscar(board, word, fila, columna + 1, indice + 1, visitado);

        // Restaurar la celda para otros caminos
        visitado[fila][columna] = false;

        return encontrado;
    }
}
