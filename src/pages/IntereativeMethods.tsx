// src/pages/IterativeMethods.tsx

import React, { useState } from 'react';
import MatrixInput from '../components/MatrixInput'; // Reutiliza o input de matriz
import { gaussSeidel } from '../algorithms/gaussSeidel'; // O novo algoritmo

const IterativeMethods: React.FC = () => {
    // Estado para os parâmetros específicos do método iterativo
    const [tolerance, setTolerance] = useState<number>(0.0001);
    const [initialGuessInput, setInitialGuessInput] = useState<string>('0, 0, 0'); // String para facilitar o input do usuário
    const [solution, setSolution] = useState<number[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const initialDimension = 3; // O circuito da Ponte de Wheatstone (Problema 1) é 3x3

    // Função que recebe A e b do MatrixInput e executa o Gauss-Seidel
    const handleSolve = (A: number[][], b: number[]) => {
        setError(null);
        setSolution(null);
        
        // 1. Processar a Estimativa Inicial (converter a string '0, 0, 0' para um array de números)
        const initialGuess = initialGuessInput
            .split(',')
            .map(s => parseFloat(s.trim()))
            .filter(n => !isNaN(n));

        if (initialGuess.length !== A.length) {
            setError(`O vetor de Estimativa Inicial deve ter ${A.length} elementos.`);
            return;
        }

        // 2. Chamar o Algoritmo
        const result = gaussSeidel(A, b, initialGuess, tolerance);

        if (result === null) {
            setError("O método de Gauss-Seidel não convergiu com as configurações atuais (verifique a matriz e a estimativa inicial).");
            setSolution(null);
        } else {
            setSolution(result);
        }
    };

    return (
        <div>
            <h2>Tópico 02: Sistemas de Equações Lineares - Métodos Iterativos</h2>
            <p>Use este resolvedor para sistemas que convergem, como a Ponte de Wheatstone (Problema 1). Os métodos iterativos exigem uma Estimativa Inicial e uma Tolerância.</p>

            {/* Parâmetros Iterativos */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                    marginTop: 0, 
                    marginBottom: '20px', 
                    color: 'var(--text-dark)',
                    fontSize: '1.2em',
                    fontWeight: 600,
                    borderBottom: '2px solid var(--border-color)',
                    paddingBottom: '12px'
                }}>
                    ⚙️ Parâmetros Iterativos
                </h4>
                <div style={{ 
                    display: 'flex', 
                    gap: '24px', 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end'
                }}>
                    {/* Input de Tolerância */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                            Tolerância (Precisão):
                        </label>
                        <input
                            type="number"
                            value={tolerance}
                            onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
                            step="0.0001"
                            min="0.000001"
                            style={{ 
                                padding: '12px 16px',
                                width: '140px',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--border-radius-sm)',
                                fontSize: '0.95em'
                            }}
                        />
                    </div>

                    {/* Input de Estimativa Inicial */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                            Estimativa Inicial (separada por vírgulas):
                        </label>
                        <input
                            type="text"
                            value={initialGuessInput}
                            onChange={(e) => setInitialGuessInput(e.target.value)}
                            placeholder="Ex: 0, 0, 0"
                            style={{ 
                                padding: '12px 16px',
                                width: '200px',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--border-radius-sm)',
                                fontSize: '0.95em'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* O componente genérico de entrada de Matriz */}
            <MatrixInput n={initialDimension} onSolve={handleSolve} />

            {/* Exibição do Resultado */}
            {solution && (
                <div className="result-success">
                    <h4 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--success-color)', fontSize: '1.3em' }}>
                        ✅ Solução Encontrada (Convergência)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        {solution.map((val, index) => (
                            <div key={index} style={{ 
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: 'var(--border-radius-sm)',
                                border: '1px solid var(--success-color)'
                            }}>
                                <strong style={{ color: 'var(--text-dark)' }}>x{index + 1}:</strong>
                                <span style={{ 
                                    display: 'block',
                                    fontSize: '1.2em',
                                    color: 'var(--primary-color)',
                                    fontWeight: 700,
                                    marginTop: '4px'
                                }}>
                                    {val.toFixed(4)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-medium)', fontStyle: 'italic' }}>
                        O resultado é a solução aproximada do sistema.
                    </p>
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

export default IterativeMethods;