
import React, { useState } from 'react';
import MatrixInput from '../components/MatrixInput'; // Reutiliza o input de matriz
import { gaussSeidel } from '../algorithms/gaussSeidel'; // O novo algoritmo

const IterativeMethods = () => {
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
            <p>Use este resolvedor para sistemas que convergem. Os métodos iterativos exigem uma Estimativa Inicial e uma Tolerância.</p>

            {/* Parâmetros Iterativos */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    
                    {/* Input de Tolerância */}
                    <div>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Tolerância (Precisão):</label>
                        <input
                            type="number"
                            value={tolerance}
                            onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
                            step="0.0001"
                            min="0.000001"
                            style={{ padding: '8px', width: '100px' }}
                        />
                    </div>

                    {/* Input de Estimativa Inicial */}
                    <div>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Estimativa Inicial (Separada por vírgulas):</label>
                        <input
                            type="text"
                            value={initialGuessInput}
                            onChange={(e) => setInitialGuessInput(e.target.value)}
                            placeholder="Ex: 0, 0, 0"
                            style={{ padding: '8px', width: '150px' }}
                        />
                    </div>
                </div>
            </div>

            {/* O componente genérico de entrada de Matriz */}
            <MatrixInput n={initialDimension} onSolve={handleSolve} />

            {/* Exibição do Resultado Genérico */}
            {solution && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9f7ef', borderRadius: '5px' }}>
                    <h4>✅ Solução Encontrada (Convergência):</h4>
                    {solution.map((val, index) => (
                        <p key={index}>x{index + 1}: <strong>{val.toFixed(4)}</strong></p>
                    ))}
                    <p>O resultado é a solução aproximada do sistema.</p>
                </div>
            )}

            {error && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fbe9e9', color: 'red', borderRadius: '5px' }}>
                    <p>🛑 Erro: {error}</p>
                </div>
            )}
        </div>
    );
};

export default IterativeMethods;