
import { Point } from '../components/PointInput';

/**
 * Interpola um valor X usando o Polinômio de Lagrange.
 * @param points O conjunto de pontos (xi, yi) para interpolação.
 * @param xEstimate O valor de X onde se deseja estimar o valor F(x).
 * @returns O valor F(x) estimado.
 */
export function lagrangeInterpolation(points: Point[], xEstimate: number): number {
    const n = points.length;
    let Px = 0; // O valor final do polinômio P(x)

    // 1. Loop principal para somar Px = Sum(yi * Li(x))
    for (let i = 0; i < n; i++) {
        let Li = 1; // Polinômio de Lagrange Li(x)

        // 2. Loop para calcular o produto do polinômio Li(x)
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                // Li(x) = Prod [ (x - xj) / (xi - xj) ]
                const numerator = xEstimate - points[j].x;
                const denominator = points[i].x - points[j].x;

                // Evita divisão por zero no caso de pontos x repetidos (que não deveria ocorrer em interpolação)
                if (Math.abs(denominator) < 1e-10) {
                    console.error("Erro Lagrange: Pontos X duplicados.");
                    return NaN; 
                }
                
                Li *= numerator / denominator;
            }
        }
        
        // 3. Soma ponderada: P(x) += yi * Li(x)
        Px += points[i].y * Li;
    }

    return Px;
}