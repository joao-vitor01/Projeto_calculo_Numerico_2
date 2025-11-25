import React, { useState } from 'react';
import PointInput, { Point } from '../components/PointInput';
import { 
    linearRegression, 
    calculateError, 
    quadraticRegression, 
    calculateQuadraticError, 
    exponentialRegression, 
    calculateExponentialError
} from '../algorithms/minimosQuadrados'; // Importação COMPLETA dos algoritmos de Mínimos Quadrados
import { lagrangeInterpolation } from '../algorithms/lagrange'; 
import { newtonInterpolation } from '../algorithms/newtonInterpolation'; 
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// Atualizado para incluir os novos métodos de regressão
type T3Method = 'lagrange' | 'newton' | 'linear_regression' | 'quadratic_regression' | 'exponential_regression';

// Interface para um resultado ÚNICO (usada para Interpolação ou o método selecionado)
interface T3Result { 
    equation?: string; 
    error?: number; 
    estimate?: number; 
}

// Interface para armazenar os 3 resultados de Regressão SIMULTÂNEOS
interface RegressionResults {
    linear: { coeffs: number[] | null, error: number | null };
    quadratic: { coeffs: number[] | null, error: number | null };
    exponential: { coeffs: number[] | null, error: number | null };
}


// =========================================================================
// FUNÇÕES AUXILIARES DE MODELAGEM (Necessárias para exibir a equação formatada)
// =========================================================================

// Função que retorna o valor Y para um dado X usando os coeficientes da Reta
const linearModel = (x: number, [a0, a1]: number[]): number => a0 + a1 * x;

// Função que retorna o valor Y para um dado X usando os coeficientes da Parábola
const quadraticModel = (x: number, [a0, a1, a2]: number[]): number => a0 + a1 * x + a2 * x * x;

// Função que retorna o valor Y para um dado X usando os coeficientes da Exponencial
const exponentialModel = (x: number, [a, b]: number[]): number => a * Math.exp(b * x);


const InterpolationMethods: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<T3Method>('linear_regression');
    const [results, setResults] = useState<T3Result | null>(null);
    const [regressionResults, setRegressionResults] = useState<RegressionResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [estimateX, setEstimateX] = useState<number>(1.15); 

    const getMinPoints = (method: T3Method) => {
        if (method === 'quadratic_regression') return 3; // Parábola requer 3 pontos
        if (method === 'linear_regression' || method === 'exponential_regression') return 2; // Reta/Exponencial requer 2
        return 2; 
    };

    const handleSolve = (points: Point[]) => {
        setError(null);
        setResults(null);
        setRegressionResults(null); // Limpa os resultados de regressão
        let result: T3Result = {};
        let estimatedY: number | null = null;
        
        try {
            // ==============================================
            // 1. CÁLCULO DOS TRÊS AJUSTES DE REGRESSÃO (SIMULTÂNEO)
            // ==============================================
            
            // Reta
            const linearCoeffs = linearRegression(points);
            const linearError = linearCoeffs ? calculateError(points, linearCoeffs) : null;

            // Parábola
            const quadraticCoeffs = quadraticRegression(points);
            const quadraticError = quadraticCoeffs ? calculateQuadraticError(points, quadraticCoeffs) : null;

            // Exponencial
            const expCoeffs = exponentialRegression(points);
            const expError = expCoeffs ? calculateExponentialError(points, expCoeffs) : null;

            // Armazena todos os resultados para a seção de comparação
            setRegressionResults({
                linear: { coeffs: linearCoeffs, error: linearError },
                quadratic: { coeffs: quadraticCoeffs, error: quadraticError },
                exponential: { coeffs: expCoeffs, error: expError },
            });


            // ==============================================
            // 2. Lógica para o Método SELECIONADO (Exibe o resultado específico)
            // ==============================================

            switch (selectedMethod) {
                case 'linear_regression':
                    if (linearCoeffs) {
                        const [a0, a1] = linearCoeffs;
                        result.equation = `Reta: G(x) = ${a0.toFixed(4)} + ${a1.toFixed(4)}x`;
                        result.error = linearError ?? undefined;
                    } else { throw new Error("Ajuste linear falhou."); }
                    break;
                
                case 'quadratic_regression':
                    if (quadraticCoeffs) {
                        const [a0, a1, a2] = quadraticCoeffs;
                        result.equation = `Parábola: G(x) = ${a0.toFixed(4)} + ${a1.toFixed(4)}x + ${a2.toFixed(4)}x^2`;
                        result.error = quadraticError ?? undefined;
                    } else { throw new Error("Ajuste quadrático falhou."); }
                    break;

                case 'exponential_regression':
                    if (expCoeffs) {
                        const [a, b] = expCoeffs;
                        result.equation = `Exponencial: G(x) = ${a.toFixed(4)}e^{${b.toFixed(4)}x}`;
                        result.error = expError ?? undefined;
                    } else { throw new Error("Ajuste exponencial falhou (verifique se todos y > 0)."); }
                    break;

                case 'lagrange':
                    estimatedY = lagrangeInterpolation(points, estimateX);
                    result.equation = `Polinômio de Lagrange (Grau ${points.length - 1})`;
                    result.estimate = estimatedY;
                    break;

                case 'newton':
                    estimatedY = newtonInterpolation(points, estimateX);
                    result.equation = `Polinômio de Newton (Grau ${points.length - 1})`;
                    result.estimate = estimatedY;
                    break;
            }

            // ==============================================
            // 3. Tratamento Final de Resultados
            // ==============================================
            
            // Verifica se a estimativa de interpolação é válida
            if (result.estimate !== undefined && isNaN(result.estimate!)) {
                throw new Error("O cálculo de interpolação resultou em um valor inválido.");
            }

            // Exibe o resultado específico (seja regressão ou interpolação)
            if (result.estimate !== undefined || result.equation) {
                setResults(result);
            }

        } catch (e) {
            setError(`Erro no cálculo: ${e instanceof Error ? e.message : 'Verifique a entrada.'}`);
            setRegressionResults(null);
        }
    };

    return (
        <div>
            <h2>Tópico 03: Interpolação Polinomial / Mínimos Quadrados</h2>
            <p>Insira a tabela de dados. Use a caixa "Estimar X" para interpolação ou selecione o ajuste de regressão.</p>

            {/* Seleção do Método */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="t3-controls" style={{ flexWrap: 'wrap' }}>
                    <div className="t3-method">
                        <label className="t3-method-label">
                            🔧 Método de Solução:
                        </label>
                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value as T3Method)}
                            className="t3-method-select"
                        >
                            <option value="linear_regression">Regressão - Reta (M.Q.)</option>
                            <option value="quadratic_regression">Regressão - Parábola (M.Q.)</option>
                            <option value="exponential_regression">Regressão - Exponencial (M.Q.)</option>
                            <option value="lagrange">Polinômio de Lagrange (Interpolação)</option>
                            <option value="newton">Polinômio de Newton (Interpolação)</option>
                        </select>
                    </div>
                    
                    {/* Campo de Estimação */}
                    <div className="t3-estimate">
                        <label className="t3-estimate-label">Estimar X =</label>
                        <input
                            type="number"
                            value={estimateX}
                            onChange={(e) => setEstimateX(parseFloat(e.target.value))}
                            className="t3-estimate-input"
                        />
                    </div>
                </div>
            </div>
            
            <PointInput minPoints={getMinPoints(selectedMethod)} onSolve={handleSolve} />

            {/* --- NOVO BLOCO: Exibição de TODOS os Ajustes de Regressão --- */}
            {/* Este bloco aparece SEMPRE que a regressão for calculada, permitindo a comparação */}
            {regressionResults && (
                <div className="result-success" style={{ marginTop: '20px', padding: '15px' }}>
                    <h4 style={{ color: 'var(--success-color)', fontSize: '1.3em', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                        📈 Comparação dos Ajustes de Mínimos Quadrados
                    </h4>

                    {/* Reta */}
                    {regressionResults.linear.coeffs && (
                        <div style={{ padding: '10px 0', borderBottom: '1px dashed #ccc' }}>
                            <strong>Reta: </strong>
                            <InlineMath math={`G(x) = ${regressionResults.linear.coeffs[0].toFixed(4)} + ${regressionResults.linear.coeffs[1].toFixed(4)}x`} />
                            <br/>
                            **Erro Quadrático:** <span style={{ fontWeight: 700 }}>{regressionResults.linear.error?.toFixed(6) ?? 'N/A'}</span>
                        </div>
                    )}

                    {/* Parábola */}
                    {regressionResults.quadratic.coeffs && (
                        <div style={{ padding: '10px 0', borderBottom: '1px dashed #ccc' }}>
                            <strong>Parábola: </strong>
                            <InlineMath math={`G(x) = ${regressionResults.quadratic.coeffs[0].toFixed(4)} + ${regressionResults.quadratic.coeffs[1].toFixed(4)}x + ${regressionResults.quadratic.coeffs[2].toFixed(4)}x^2`} />
                            <br/>
                            **Erro Quadrático:** <span style={{ fontWeight: 700 }}>{regressionResults.quadratic.error?.toFixed(6) ?? 'N/A'}</span>
                        </div>
                    )}

                    {/* Exponencial */}
                    {regressionResults.exponential.coeffs && (
                        <div style={{ padding: '10px 0' }}>
                            <strong>Exponencial: </strong>
                            <InlineMath math={`G(x) = ${regressionResults.exponential.coeffs[0].toFixed(4)}e^{${regressionResults.exponential.coeffs[1].toFixed(4)}x}`} />
                            <br/>
                            **Erro Quadrático:** <span style={{ fontWeight: 700 }}>{regressionResults.exponential.error?.toFixed(6) ?? 'N/A'}</span>
                        </div>
                    )}
                    
                    {/* NOTE: O código de plotagem deve vir aqui, usando os coeficientes (coeffs) para gerar os pontos e desenhar as 3 curvas. */}
                </div>
            )}
            {/* --- FIM DO NOVO BLOCO --- */}


            {/* Exibição do Resultado ÚNICO (Para o método ESPECÍFICO selecionado) */}
            {results && (
                <div className="result-success">
                    <h4 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--success-color)', fontSize: '1.3em' }}>
                        ✅ Resultado Selecionado
                    </h4>
                    
                    {/* Exibe o tipo de função/polinômio encontrado */}
                    {results.equation && (
                        <div style={{ 
                            marginBottom: '16px',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid var(--success-color)'
                        }}>
                            <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                                Função/Polinômio:
                            </strong>
                            <span style={{ 
                                color: 'var(--primary-color)',
                                fontSize: '1.1em',
                                fontWeight: 600
                            }}>
                                {results.equation}
                            </span>
                        </div>
                    )}
                    
                    {/* Exibe o Erro Quadrático (apenas para Mínimos Quadrados) */}
                    {results.error !== undefined && (
                        <div style={{ 
                            marginBottom: '16px',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid var(--success-color)'
                        }}>
                            <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                                Erro Quadrático (<InlineMath math={'\\Sigma[F(x_i)-G(x_i)]^{2}'}/>):
                            </strong>
                            <span style={{ 
                                color: 'var(--primary-color)',
                                fontSize: '1.2em',
                                fontWeight: 700
                            }}>
                                {results.error.toFixed(4)}
                            </span>
                        </div>
                    )}
                    
                    {/* Exibe a Estimativa (apenas para Interpolação) */}
                    {results.estimate !== undefined && (
                        <div style={{ 
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid var(--success-color)'
                        }}>
                            <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                                Estimativa <InlineMath math={`F(${estimateX})`} />:
                            </strong>
                            <span style={{ 
                                color: 'var(--primary-color)',
                                fontSize: '1.3em',
                                fontWeight: 700
                            }}>
                                {results.estimate.toFixed(6)}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="result-error">
                    <p style={{ margin: 0, fontWeight: 600 }}>🛑 Erro: {error}</p>
                </div>
            )}
        </div>
    );
};

export default InterpolationMethods;