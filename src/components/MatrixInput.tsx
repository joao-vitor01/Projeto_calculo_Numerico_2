
import React, { useState, useEffect } from 'react';

// Define a interface das propriedades (props) que o componente irá receber
interface MatrixInputProps {
    n: number; // Dimensão (número de linhas/colunas) da matriz
    onSolve: (A: number[][], b: number[]) => void; // Função de callback para iniciar o cálculo
}

const MatrixInput: React.FC<MatrixInputProps> = ({ n, onSolve }) => {
    // Inicializa uma matriz vazia de tamanho n x n e um vetor b de tamanho n
    const initialMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    const initialVector = Array(n).fill(0);

    const [A, setA] = useState(initialMatrix);
    const [b, setB] = useState(initialVector);
    const [dimension, setDimension] = useState(n);

    // Efeito para resetar A e b sempre que a dimensão (n) mudar
    useEffect(() => {
        setA(Array(dimension).fill(0).map(() => Array(dimension).fill(0)));
        setB(Array(dimension).fill(0));
    }, [dimension]);

    // Manipula a mudança de valor em uma célula da Matriz A
    const handleMatrixChange = (row: number, col: number, value: string) => {
        const newValue = parseFloat(value) || 0;
        setA(prevA => {
            const newA = prevA.map(r => [...r]);
            newA[row][col] = newValue;
            return newA;
        });
    };

    // Manipula a mudança de valor em uma célula do Vetor b
    const handleVectorChange = (row: number, value: string) => {
        const newValue = parseFloat(value) || 0;
        setB(prevB => {
            const newB = [...prevB];
            newB[row] = newValue;
            return newB;
        });
    };

    return (
        <div className="card" style={{ marginBottom: '24px' }}>
            <h4 style={{ 
                marginTop: 0, 
                marginBottom: '24px', 
                color: 'var(--text-dark)',
                fontSize: '1.3em',
                fontWeight: 600,
                borderBottom: '2px solid var(--border-color)',
                paddingBottom: '12px'
            }}>
                📊 Entrada de Dados (Matriz A e Vetor b)
            </h4>

            {/* Input para alterar a dimensão do sistema (ex: 3x3, 4x4) */}
            <div style={{ 
                marginBottom: '24px', 
                padding: '16px',
                background: 'var(--bg-light)',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <label style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                    Dimensão do Sistema (n × n):
                </label>
                <input
                    type="number"
                    value={dimension}
                    onChange={(e) => setDimension(Math.max(2, parseInt(e.target.value) || 2))}
                    min="2"
                    style={{ 
                        width: '80px', 
                        padding: '10px 14px',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '1em',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                />
            </div>
            
            {/* Layout da Matriz A e Vetor b */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '40px', 
                flexWrap: 'wrap',
                marginBottom: '24px',
                padding: '24px',
                background: 'var(--bg-light)',
                borderRadius: 'var(--border-radius)'
            }}>
                
                {/* Matriz A */}
                <div style={{ 
                    paddingRight: '30px',
                    borderRight: '2px solid var(--border-color)'
                }}>
                    <p style={{ 
                        fontWeight: 600, 
                        marginBottom: '16px',
                        color: 'var(--primary-color)',
                        fontSize: '1.1em'
                    }}>
                        Matriz A:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {A.map((row, i) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {row.map((val, j) => (
                                    <input
                                        key={j}
                                        type="number"
                                        value={val.toString()}
                                        onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                                        style={{ 
                                            width: '70px', 
                                            textAlign: 'center', 
                                            padding: '10px',
                                            border: '2px solid var(--border-color)',
                                            borderRadius: 'var(--border-radius-sm)',
                                            fontSize: '0.95em',
                                            transition: 'var(--transition)'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--primary-color)';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'var(--border-color)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vetor b */}
                <div>
                    <p style={{ 
                        fontWeight: 600, 
                        marginBottom: '16px',
                        color: 'var(--secondary-color)',
                        fontSize: '1.1em'
                    }}>
                        Vetor b:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {b.map((val, i) => (
                            <div key={i} style={{ 
                                display: 'flex', 
                                gap: '12px', 
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ 
                                    fontSize: '1.5em',
                                    color: 'var(--text-medium)',
                                    fontWeight: 600
                                }}>=</span>
                                <input
                                    type="number"
                                    value={val.toString()}
                                    onChange={(e) => handleVectorChange(i, e.target.value)}
                                    style={{ 
                                        width: '80px', 
                                        textAlign: 'center', 
                                        padding: '10px',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-sm)',
                                        fontSize: '0.95em',
                                        transition: 'var(--transition)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--secondary-color)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-color)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Botão de Cálculo */}
            <div style={{ textAlign: 'center' }}>
                <button 
                    onClick={() => onSolve(A, b)}
                    className="btn btn-primary"
                    style={{ 
                        fontSize: '1.1em',
                        padding: '14px 32px',
                        minWidth: '200px'
                    }}
                >
                    🚀 Calcular Solução
                </button>
            </div>
        </div>
    );
};

export default MatrixInput;