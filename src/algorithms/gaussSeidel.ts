/**
 * Resolve um sistema de equações lineares Ax=b usando o Método de Gauss-Seidel.
 * @param A A matriz de coeficientes.
 * @param b O vetor de termos independentes.
 * @param initialGuess A estimativa inicial para o vetor solução x (ex: [0, 0, 0]).
 * @param tolerance A precisão desejada para o critério de parada.
 * @param maxIterations O número máximo de iterações permitidas.
 * @returns O vetor solução x, ou null se não convergir.
 */
export function gaussSeidel(
    A: number[][],
    b: number[],
    initialGuess: number[],
    tolerance: number = 0.0001,
    maxIterations: number = 100
): number[] | null {
    const n = A.length;
    let x_current = [...initialGuess]; // Solução na iteração atual
    let x_prev: number[]; // Solução na iteração anterior

    // 1. Verificar Condições Iniciais
    if (n !== b.length || n !== initialGuess.length) {
        console.error("Erro: Dimensões da matriz e vetores não coincidem.");
        return null;
    }

    // 2. Loop de Iteração
    for (let iter = 0; iter < maxIterations; iter++) {
        x_prev = [...x_current]; // Salva a solução anterior
        let maxError = 0;

        // Itera sobre cada equação (linha)
        for (let i = 0; i < n; i++) {
            let sum = 0;

            // Calcula a soma dos termos que já têm valores conhecidos (anteriores ou atualizados na mesma iteração)
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    sum += A[i][j] * x_current[j];
                }
            }

            // Verifica o pivô (elemento da diagonal) para evitar divisão por zero
            if (Math.abs(A[i][i]) < 1e-10) {
                 // Neste ponto, seria ideal tentar o critério de Sassenfeld [cite: 70] ou das linhas [cite: 71]
                 // Para este algoritmo, se o pivô for zero, retorna erro de singularidade.
                console.error("Erro: Elemento diagonal (pivô) é zero. O sistema pode não ser estritamente diagonal dominante.");
                return null; 
            }

            // Nova aproximação para x[i] (equação de iteração)
            x_current[i] = (b[i] - sum) / A[i][i];

            // 3. Critério de Parada: Calcula o erro máximo
            const error = Math.abs(x_current[i] - x_prev[i]);
            if (error > maxError) {
                maxError = error;
            }
        }

        // Se o erro máximo for menor que a tolerância, a solução convergiu
        if (maxError < tolerance) {
            return x_current;
        }
    }

    // Se atingir o número máximo de iterações sem convergir
    console.warn("Atingiu o máximo de iterações. O sistema pode não convergir ou a tolerância é muito rigorosa.");
    return null; 
}