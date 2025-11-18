
import { gaussElimination } from './gaussElimination'; 

export interface Point {
    x: number;
    y: number;
}

// Retorna o polinômio (coeficientes) da regressão linear (Reta: a0 + a1*x)
export function linearRegression(points: Point[]): number[] | null {
    const n = points.length;
    if (n < 2) return null;

    // Somas necessárias para o sistema normal (2x2)
    let sumX = 0;
    let sumY = 0;
    let sumX2 = 0;
    let sumXY = 0;

    for (const p of points) {
        sumX += p.x;
        sumY += p.y;
        sumX2 += p.x * p.x;
        sumXY += p.x * p.y;
    }

    // O sistema linear normal é:
    // | n    sumX | | a0 | = | sumY  |
    // | sumX sumX2| | a1 | = | sumXY |
    const A = [
        [n, sumX],
        [sumX, sumX2]
    ];
    const b = [sumY, sumXY];

    // Resolve o sistema usando o Método de Eliminação de Gauss
    const coefficients = gaussElimination(A, b); // coefficients = [a0, a1]

    return coefficients;
}

/**
 * Calcula o Erro Quadrático (Sumatoria [F(xi) - G(xi)]^2) para a regressão linear.
 * @param points Pontos originais (F(xi)).
 * @param coefficients Coeficientes [a0, a1] da reta (G(x)).
 * @returns O valor do erro quadrático.
 */
export function calculateError(points: Point[], coefficients: number[]): number {
    const [a0, a1] = coefficients;
    let errorSum = 0;
    
    for (const p of points) {
        // G(xi) é o valor predito pela reta: a0 + a1*x
        const predictedY = a0 + a1 * p.x;
        
        // F(xi) é o valor real (p.y)
        errorSum += (p.y - predictedY) ** 2;
    }
    return errorSum;
}

