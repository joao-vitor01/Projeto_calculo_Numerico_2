// src/algorithms/integracaoNumerica.ts

export interface Point {
    x: number;
    y: number;
}

/**
 * Aplica a Regra do Trapézio Repetida para calcular a integral (área).
 * @param points O conjunto de pontos (xi, f(xi)).
 * @returns O valor da integral aproximada.
 */
export function trapezoidalRule(points: Point[]): number {
    const n = points.length - 1; // Número de subintervalos
    if (n < 1) return 0;

    // Assumimos que os pontos são igualmente espaçados (como solicitado no problema)
    const h = points[1].x - points[0].x; // Largura do subintervalo

    let sum = 0;
    
    // Soma os termos intermediários (f(x1) até f(x n-1))
    for (let i = 1; i < n; i++) {
        sum += points[i].y;
    }

    // Fórmula: I ≈ (h/2) * [ f(x0) + 2*Sum(f(xi)) + f(xn) ]
    const integral = (h / 2) * (points[0].y + 2 * sum + points[n].y);

    return integral;
}

/**
 * Aplica a Regra de Simpson Repetida (1/3) para calcular a integral (área).
 * Requer um número PAR de subintervalos (n) ou um número ÍMPAR de pontos (n+1).
 * @param points O conjunto de pontos (xi, f(xi)).
 * @returns O valor da integral aproximada.
 */
export function simpsonRule(points: Point[]): number | null {
    const n = points.length - 1; // Número de subintervalos
    
    // Simpson 1/3 exige n (subintervalos) par
    if (n < 2 || n % 2 !== 0) {
        return null; // Retorna null se não houver número suficiente ou o número for ímpar
    }

    const h = points[1].x - points[0].x; // Largura do subintervalo
    let sumOdd = 0; // Soma dos termos ímpares (i = 1, 3, 5, ...)
    let sumEven = 0; // Soma dos termos pares (i = 2, 4, 6, ...)
    
    // O loop começa em i=1 e vai até n-1
    for (let i = 1; i < n; i++) {
        if (i % 2 === 0) {
            sumEven += points[i].y; // Índice par (f(x2), f(x4), ...)
        } else {
            sumOdd += points[i].y; // Índice ímpar (f(x1), f(x3), ...)
        }
    }

    // Fórmula: I ≈ (h/3) * [ f(x0) + 4*Sum(f_impar) + 2*Sum(f_par) + f(xn) ]
    const integral = (h / 3) * (points[0].y + 4 * sumOdd + 2 * sumEven + points[n].y);

    return integral;
}