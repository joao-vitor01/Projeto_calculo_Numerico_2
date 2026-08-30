import { useState } from 'react';
import MatrixInput from '../components/MatrixInput';
import { gaussElimination } from '../algorithms/gaussElimination';
import { luFactorization } from '../algorithms/luFactorization'; 
import { gaussJordan } from '../algorithms/gaussJordan'; 

type Method = 'gauss' | 'lu' | 'jordan';

const DirectMethods = () => {
    const [selectedMethod, setSelectedMethod] = useState<Method>('gauss');
    const [solution, setSolution] = useState<number[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const initialDimension = 3; 

    const handleSolve = (A: number[][], b: number[]) => {
        setError(null);
        let result: number[] | null = null;
        
        switch (selectedMethod) {
            case 'gauss':
                result = gaussElimination(A, b);
                break;
            case 'lu': // NOVO CASE
                result = luFactorization(A, b);
                break;
            case 'jordan': // NOVO CASE
                result = gaussJordan(A, b);
                break;
            default:
                setError("Método de cálculo não selecionado.");
                return;
        }
        
        if (result === null) {
            setError("Não foi possível resolver o sistema. Verifique a matriz e tente novamente.");
            setSolution(null);
        } else {
            setSolution(result);
        }
    };

    return (
        <div>
            <h2>Tópico 01: Sistemas de Equações Lineares - Métodos Diretos</h2>
            <p>Escolha o método e insira os coeficientes (A) e os termos independentes (b) do seu sistema linear</p>

            {/* Seleção do Método */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1em' }}>
                        🔧 Método de Solução:
                    </label>
                    <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value as Method)}
                        style={{ 
                            padding: '12px 16px',
                            fontSize: '1em',
                            minWidth: '200px',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)',
                            background: 'var(--bg-white)',
                            color: 'var(--text-dark)',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="gauss">Eliminação de Gauss</option>
                        <option value="lu">Fatoração LU</option>
                        <option value="jordan">Gauss-Jordan</option> 
                    </select>
                </div>
            </div>
            
            <MatrixInput n={initialDimension} onSolve={handleSolve} />

            {/* Exibição do Resultado */}
            {solution && (
                <div className="result-success">
                    <h4 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--success-color)', fontSize: '1.3em' }}>
                        ✅ Solução Encontrada
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
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

export default DirectMethods;