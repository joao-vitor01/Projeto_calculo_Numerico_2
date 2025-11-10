
export function gaussJordan(A: number[][], b: number[]): number[] | null {
    const n = A.length;
    // 1. Matriz Aumentada: Ab
    const Ab = A.map((row, i) => [...row, b[i]]);

    if (n === 0 || n !== b.length) return null;

    // 2. Etapa de Eliminação (Para cima e para baixo do pivô)
    for (let k = 0; k < n; k++) {
        const pivot = Ab[k][k];

        if (Math.abs(pivot) < 1e-10) {
            console.error("Erro Gauss-Jordan: Pivot é zero. Matriz singular ou necessita de pivotamento.");
            return null;
        }

        // Normalização: Divide a linha 'k' pelo pivô (Ab[k][k] = 1)
        for (let j = k; j < n + 1; j++) {
            Ab[k][j] /= pivot;
        }

        // Eliminação nas outras linhas (i ≠ k)
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                const factor = Ab[i][k];
                // Subtrai o fator da linha de pivot normalizada
                for (let j = k; j < n + 1; j++) {
                    Ab[i][j] -= factor * Ab[k][j];
                }
            }
        }
    }

    // 3. O vetor solução é o novo vetor b (a última coluna da matriz Ab)
    // O sistema agora é Ix = b', onde I é a identidade e b' é a solução.
    const x = Ab.map(row => row[n]);

    return x;
}


