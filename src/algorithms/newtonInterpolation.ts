
import { Point } from '../components/PointInput';

/**
 * Interpola um valor X usando o Polinômio de Newton (Diferenças Divididas).
 * @param points O conjunto de pontos (xi, yi) para interpolação.
 * @param xEstimate O valor de X onde se deseja estimar o valor F(x).
 * @returns O valor F(x) estimado.
 */
export function newtonInterpolation(points: Point[], xEstimate: number): number {
    const n = points.length;
    // Tabela F (diferenças divididas), inicializada com os valores de Y
    const F: number[][] = Array(n).fill(0).map((_, i) => [points[i].y]);

    // 1. Calcular a Tabela de Diferenças Divididas
    for (let j = 1; j < n; j++) { // Coluna (grau)
        for (let i = 0; i < n - j; i++) { // Linha
            const yk = F[i + 1][j - 1]; // f[xk+1, ..., xi]
            const yi = F[i][j - 1];     // f[xk, ..., xi-1]
            const xk = points[i + j].x;
            const xi = points[i].x;

            const denominator = xk - xi;
            
            if (Math.abs(denominator) < 1e-10) {
                console.error("Erro Newton: Pontos X duplicados.");
                return NaN;
            }
            
            const difference = (yk - yi) / denominator;
            F[i].push(difference);
        }
    }

    // 2. Calcular o valor P(x) usando a fórmula de Newton
    // Px = f[x0] + f[x0,x1](x-x0) + f[x0,x1,x2](x-x0)(x-x1) + ...
    let Px = F[0][0]; // Começa com f[x0]
    let productTerm = 1;

    // Itera sobre os coeficientes (diagonal superior da tabela F)
    for (let i = 1; i < n; i++) {
        productTerm *= (xEstimate - points[i - 1].x);
        Px += F[0][i] * productTerm;
    }

    return Px;
}