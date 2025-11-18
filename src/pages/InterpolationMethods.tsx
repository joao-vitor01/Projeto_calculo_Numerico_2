
import React, { useState } from 'react';
import PointInput, { Point } from '../components/PointInput';
import { linearRegression, calculateError } from '../algorithms/minimosQuadrados';
import { lagrangeInterpolation } from '../algorithms/lagrange'; 
import { newtonInterpolation } from '../algorithms/newtonInterpolation'; 
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type T3Method = 'lagrange' | 'newton' | 'linear_regression';

// Interface para o objeto de resultado, que agora inclui a estimativa
interface T3Result { 
    equation?: string; 
    error?: number; 
    estimate?: number; 
}

const InterpolationMethods: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<T3Method>('linear_regression');
    const [results, setResults] = useState<T3Result | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [estimateX, setEstimateX] = useState<number>(1.15); // Valor padrão do Problema de Voltagem

    const getMinPoints = (method: T3Method) => {
        // Interpolação requer no mínimo 2 pontos (reta). Para o problema de 4º grau, precisa de 5.
        if (method === 'linear_regression') return 2;
        return 2; 
    };

    const handleSolve = (points: Point[]) => {
        setError(null);
        setResults(null);
        let result: T3Result = {};
        let estimatedY: number | null = null;
        
        try {
            switch (selectedMethod) {
                case 'linear_regression':
                    const coeffs = linearRegression(points);
                    if (coeffs) {
                        const [a0, a1] = coeffs;
                        result.equation = `Reta: G(x) = ${a0.toFixed(4)} + ${a1.toFixed(4)}x`;
                        result.error = calculateError(points, coeffs);
                    } else { throw new Error("Ajuste linear falhou."); }
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

            if (result.estimate === null || isNaN(result.estimate!)) {
                if (result.equation && !result.estimate) {
                    // É regressão, então a estimativa não é o foco principal
                    setResults(result); 
                } else {
                    throw new Error("O cálculo resultou em um valor inválido. Verifique os pontos.");
                }
            } else {
                setResults(result);
            }

        } catch (e) {
            setError(`Erro no cálculo: ${e instanceof Error ? e.message : 'Verifique a entrada.'}`);
        }
    };

    return (
        <div>
            <h2>Tópico 03: Interpolação Polinomial / Mínimos Quadrados</h2>
            <p>Insira a tabela de dados. Use a caixa "Estimar X" para interpolação ou o ajuste de regressão.</p>

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
                            <option value="linear_regression">Regressão - Reta (Mínimos Quadrados)</option>
                            <option value="lagrange">Polinômio de Lagrange</option>
                            <option value="newton">Polinômio de Newton</option>
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

            {/* Exibição do Resultado */}
            {results && (
                <div className="result-success">
                    <h4 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--success-color)', fontSize: '1.3em' }}>
                        ✅ Resultados
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
                                Função Encontrada:
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