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

// Métodos suportados na UI: regressão (todos os ajustes) ou interpolação (Lagrange/Newton)
type T3Method = 'regression' | 'lagrange' | 'newton';

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


const InterpolationMethods = () => {
    const [selectedMethod, setSelectedMethod] = useState<T3Method>('regression');
    const [results, setResults] = useState<T3Result | null>(null);
    const [regressionResults, setRegressionResults] = useState<RegressionResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [estimateX, setEstimateX] = useState<number>(1.15); 

    const getMinPoints = (method: T3Method) => {
        // Para calcular os 3 ajustes (reta, parábola, exponencial) precisamos
        // de pelo menos 3 pontos para que a parábola possa ser estimada.
        if (method === 'regression') return 3;
        // Interpolação (Lagrange/Newton) precisa de pelo menos 2 pontos.
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
            // 2. Lógica para o Método SELECIONADO
            // - Se 'regression', apenas exibe os 3 ajustes (já calculados acima)
            // - Se 'lagrange' ou 'newton', calcula a estimativa para X
            // ==============================================
            if (selectedMethod === 'regression') {
                // regressão: os 3 ajustes já foram armazenados em regressionResults
                // opcionalmente podemos preencher uma descrição geral
                result.equation = 'Regressão: Reta, Parábola e Exponencial (Mínimos Quadrados)';
            } else if (selectedMethod === 'lagrange') {
                estimatedY = lagrangeInterpolation(points, estimateX);
                result.equation = `Polinômio de Lagrange (Grau ${points.length - 1})`;
                result.estimate = estimatedY;
            } else if (selectedMethod === 'newton') {
                estimatedY = newtonInterpolation(points, estimateX);
                result.equation = `Polinômio de Newton (Grau ${points.length - 1})`;
                result.estimate = estimatedY;
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
            <p>Insira a tabela de dados. Selecione o método e use "Estimar X".</p>

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
                            <option value="regression">Regressão (Reta, Parábola e Exponencial)</option>
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
            {regressionResults && selectedMethod === 'regression' && (
                <div className="result-success" style={{ marginTop: '20px', padding: '15px' }}>
                    <h4 style={{ color: 'var(--success-color)', fontSize: '1.3em', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                        📈 Comparação dos Ajustes de Mínimos Quadrados
                    </h4>

                    {/* Reta - caixa */}
                    {regressionResults.linear.coeffs && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ 
                                marginBottom: '8px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 'var(--border-radius-sm)',
                                border: '1px solid var(--success-color)'
                            }}>
                                <strong style={{ display: 'block', marginBottom: '6px' }}>Reta (Ajuste Linear)</strong>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                    <InlineMath math={`G(x) = ${regressionResults.linear.coeffs[0].toFixed(4)} + ${regressionResults.linear.coeffs[1].toFixed(4)} x`} />
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <strong>Erro:</strong>{' '}
                                    {regressionResults.linear.error !== null
                                        ? <InlineMath math={`E = ${regressionResults.linear.error.toFixed(6)}`} />
                                        : <span style={{ fontWeight: 700 }}>N/A</span>
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Parábola - caixa */}
                    {regressionResults.quadratic.coeffs && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ 
                                marginBottom: '8px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 'var(--border-radius-sm)',
                                border: '1px solid var(--success-color)'
                            }}>
                                <strong style={{ display: 'block', marginBottom: '6px' }}>Parábola (Ajuste Quadrático)</strong>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                    <InlineMath math={`G(x) = ${regressionResults.quadratic.coeffs[0].toFixed(4)} + ${regressionResults.quadratic.coeffs[1].toFixed(4)} x + ${regressionResults.quadratic.coeffs[2].toFixed(4)} x^{2}`} />
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <strong>Erro:</strong>{' '}
                                    {regressionResults.quadratic.error !== null
                                        ? <InlineMath math={`E = ${regressionResults.quadratic.error.toFixed(6)}`} />
                                        : <span style={{ fontWeight: 700 }}>N/A</span>
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exponencial - caixa */}
                    {regressionResults.exponential.coeffs && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ 
                                marginBottom: '8px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 'var(--border-radius-sm)',
                                border: '1px solid var(--success-color)'
                            }}>
                                <strong style={{ display: 'block', marginBottom: '6px' }}>Exponencial (Ajuste Exponencial)</strong>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                    <InlineMath math={`G(x) = ${regressionResults.exponential.coeffs[0].toFixed(4)} e^{${regressionResults.exponential.coeffs[1].toFixed(4)} x}`} />
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <strong>Erro:</strong>{' '}
                                    {regressionResults.exponential.error !== null
                                        ? <InlineMath math={`E = ${regressionResults.exponential.error.toFixed(6)}`} />
                                        : <span style={{ fontWeight: 700 }}>N/A</span>
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTE: O código de plotagem deve vir aqui, usando os coeficientes (coeffs) para gerar os pontos e desenhar as 3 curvas. */}
                </div>
            )}
            {/* --- FIM DO NOVO BLOCO --- */}


            {/* Exibição do Resultado ÚNICO (Para o método ESPECÍFICO selecionado) */}
            {results && selectedMethod !== 'regression' && (
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
                            <div style={{ color: 'var(--primary-color)', fontSize: '1.1em', fontWeight: 600 }}>
                                {/* Se for interpolação, results.equation normalmente é um rótulo.
                                    Para manter saída consistente com KaTeX, renderizamos rótulo em texto
                                    e valores numéricos (estimativa/coef) com InlineMath abaixo. */}
                                <span>{results.equation}</span>
                            </div>
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
                            <div style={{ color: 'var(--primary-color)', fontSize: '1.2em', fontWeight: 700 }}>
                                <InlineMath math={`E = ${results.error.toFixed(4)}`} />
                            </div>
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
                                Estimativa:
                            </strong>
                            <div style={{ color: 'var(--primary-color)', fontSize: '1.3em', fontWeight: 700 }}>
                                <InlineMath math={`F(${estimateX}) = ${results.estimate.toFixed(6)}`} />
                            </div>
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