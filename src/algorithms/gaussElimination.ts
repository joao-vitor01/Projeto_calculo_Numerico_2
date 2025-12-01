
export function gaussElimination(A: number[][], b: number[]): number[] | null {
    const n = A.length;
    
    // 1. Matriz Aumentada: Combinar A e b
    // Criamos uma cópia para evitar modificar as matrizes originais
    const Ab = A.map((row, i) => [...row, b[i]]);

    // Verifica se a matriz é quadrada e se o vetor b tem o tamanho correto
    if (n === 0 || n !== b.length || A.some(row => row.length !== n)) {
        console.error("Erro: A matriz deve ser quadrada e o vetor 'b' deve ter o mesmo número de linhas.");
        return null;
    }

    // 2. Etapa de Eliminação (Transformação para Matriz Triangular Superior)
    for (let k = 0; k < n; k++) {
        // Encontrar o Pivô (k, k)
        const pivot = Ab[k][k];

        // Verificação de Singularidade
        if (Math.abs(pivot) < 1e-10) { 
            console.error("Erro: Pivot é zero ou muito próximo de zero. Matriz singular ou necessita de pivotamento.");
            return null; 
        }

        // Normalização (Transformar o pivô em 1)
        for (let j = k; j < n + 1; j++) {
            Ab[k][j] /= pivot;
        }

        // Eliminação das linhas abaixo
        for (let i = k + 1; i < n; i++) {
            const factor = Ab[i][k];
            for (let j = k; j < n + 1; j++) {
                Ab[i][j] -= factor * Ab[k][j];
            }
        }
    }

    // 3. Etapa de Substituição Retroativa
    const x = new Array(n).fill(0); // Vetor solução [x1, x2, x3]

    // Começa da última linha (n-1) até a primeira (0)
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        // Subtrai os termos que já têm o valor de X conhecido
        for (let j = i + 1; j < n; j++) {
            sum += Ab[i][j] * x[j];
        }
        // Calcula o X[i]
        // Ab[i][n] é o termo independente (o lado direito da matriz aumentada)
        x[i] = Ab[i][n] - sum; 
        // Como a linha i foi normalizada, o coeficiente Ab[i][i] é 1, então não precisamos dividir por ele.
    }

    return x;
}