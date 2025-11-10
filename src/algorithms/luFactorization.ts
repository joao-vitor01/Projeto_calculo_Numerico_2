
export function luFactorization(A: number[][], b: number[]): number[] | null {
    const n = A.length;
    const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const U: number[][] = A.map(row => [...row]); // Inicializa U como uma cópia de A

    // Verifica a dimensão
    if (n === 0 || n !== b.length) return null;

    // 1. Decomposição LU (A = L * U)
    for (let k = 0; k < n; k++) {
        // Inicializa L[k][k] com 1 (Elementos da diagonal de L)
        L[k][k] = 1;

        // Eliminação para criar a matriz U
        for (let i = k + 1; i < n; i++) {
            // Fator L[i][k] (equivalente ao fator mik)
            const factor = U[i][k] / U[k][k];
            L[i][k] = factor;

            // Zera o elemento abaixo do pivô em U (U[i][k] = 0)
            for (let j = k; j < n; j++) {
                U[i][j] -= factor * U[k][j];
            }
        }
    }

    // 2. Resolução de Ly = b (Substituição Progressiva)
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
            sum += L[i][j] * y[j];
        }
        // L[i][i] é 1, então não precisamos dividir por ele
        y[i] = b[i] - sum;
    }

    // 3. Resolução de Ux = y (Substituição Retroativa)
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += U[i][j] * x[j];
        }
        
        // Verifica singularidade do pivô em U
        if (Math.abs(U[i][i]) < 1e-10) {
            console.error("Erro LU: Matriz singular ou necessita de pivotamento.");
            return null; 
        }

        x[i] = (y[i] - sum) / U[i][i];
    }

    return x;
}