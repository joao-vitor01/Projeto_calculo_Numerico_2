import { gaussElimination } from './gaussElimination'; 

// Importante: a interface Point deve ser a mesma usada em todo o seu projeto.
export interface Point {
    x: number;
    y: number;
}

// =========================================================================
// 1. REGRESSÃO LINEAR (RETA)
// =========================================================================

/**
 * Retorna os coeficientes [a0, a1] da regressão linear (Reta: a0 + a1*x).
 */
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
    // | n    sumX | | a0 | = | sumY  |
    // | sumX sumX2| | a1 | = | sumXY |
    const A = [
        [n, sumX],
        [sumX, sumX2]
    ];
    const b = [sumY, sumXY];

    // Resolve o sistema
    const coefficients = gaussElimination(A, b); // coefficients = [a0, a1]

    return coefficients;
}

/**
 * Calcula o Erro Quadrático para a regressão linear.
 * @param coefficients Coeficientes [a0, a1] da reta (G(x)).
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

// =========================================================================
// 2. REGRESSÃO POLINOMIAL (PARÁBOLA - GRAU 2)
// =========================================================================

/**
 * Retorna os coeficientes [a0, a1, a2] da regressão quadrática (Parábola: a0 + a1*x + a2*x^2).
 */
export function quadraticRegression(points: Point[]): number[] | null {
    const n = points.length;
    if (n < 3) return null; // Mínimo de 3 pontos

    // Somas necessárias para o sistema 3x3 (até x^4)
    let sumX = 0;
    let sumY = 0;
    let sumX2 = 0;
    let sumX3 = 0;
    let sumX4 = 0;
    let sumXY = 0;
    let sumX2Y = 0;

    for (const p of points) {
        const x2 = p.x * p.x;
        const x3 = x2 * p.x;
        const x4 = x3 * p.x;
        const xy = p.x * p.y;
        const x2y = x2 * p.y;

        sumX += p.x;
        sumY += p.y;
        sumX2 += x2;
        sumX3 += x3;
        sumX4 += x4;
        sumXY += xy;
        sumX2Y += x2y;
    }

    // Sistema linear normal (3x3)
    const A = [
        [n, sumX, sumX2],
        [sumX, sumX2, sumX3],
        [sumX2, sumX3, sumX4]
    ];
    const b = [sumY, sumXY, sumX2Y];

    // Resolve o sistema: coefficients = [a0, a1, a2]
    const coefficients = gaussElimination(A, b); 

    return coefficients;
}

/**
 * Calcula o Erro Quadrático para a regressão quadrática (Parábola).
 * @param coefficients Coeficientes [a0, a1, a2] da parábola (G(x)).
 */
export function calculateQuadraticError(points: Point[], coefficients: number[]): number {
    const [a0, a1, a2] = coefficients;
    let errorSum = 0;
    
    for (const p of points) {
        // G(xi) = a0 + a1*x + a2*x^2
        const predictedY = a0 + a1 * p.x + a2 * p.x * p.x; 
        errorSum += (p.y - predictedY) ** 2;
    }
    return errorSum;
}

// =========================================================================
// 3. REGRESSÃO EXPONENCIAL (y = a * exp(b*x))
// =========================================================================

/**
 * Retorna os coeficientes [a, b] para o ajuste exponencial: y = a * exp(b*x).
 * IMPORTANTE: Requer que todos os valores Y sejam positivos (y > 0).
 */
export function exponentialRegression(points: Point[]): number[] | null {
    const n = points.length;
    if (n < 2) return null;

    // 1. Checa se todos os Y são positivos para aplicar ln(y)
    for (const p of points) {
        if (p.y <= 0) {
            console.error("Erro Regressão Exponencial: Valores Y devem ser positivos para ln(y).");
            return null; 
        }
    }

    // 2. Aplica a transformação Y = ln(y) e usa Regressão Linear.
    // O sistema 2x2 resolve para A = ln(a) e B = b.
    let sumX = 0;
    let sumY_ln = 0; // sum of ln(y)
    let sumX2 = 0;
    let sumXY_ln = 0; // sum of x * ln(y)

    for (const p of points) {
        const lnY = Math.log(p.y);
        
        sumX += p.x;
        sumY_ln += lnY; 
        sumX2 += p.x * p.x;
        sumXY_ln += p.x * lnY; 
    }

    // Monta e resolve o sistema 2x2
    const A_matrix = [
        [n, sumX],
        [sumX, sumX2]
    ];
    const b_vector = [sumY_ln, sumXY_ln];

    const AB_coefficients = gaussElimination(A_matrix, b_vector); // [A, B]

    if (!AB_coefficients) return null;
    
    // 3. Recupera os coeficientes originais (a = e^A e b = B)
    const A = AB_coefficients[0];
    const B = AB_coefficients[1];

    const a = Math.exp(A);
    const b = B;
    
    return [a, b]; // Retorna [a, b]
}

/**
 * Calcula o Erro Quadrático para a regressão exponencial.
 * @param coefficients Coeficientes [a, b] da função exponencial (G(x) = a * exp(b*x)).
 */
export function calculateExponentialError(points: Point[], coefficients: number[]): number {
    const [a, b] = coefficients;
    let errorSum = 0;
    
    for (const p of points) {
        // G(xi) = a * exp(b*x)
        const predictedY = a * Math.exp(b * p.x); 
        errorSum += (p.y - predictedY) ** 2;
    }
    return errorSum;
}
