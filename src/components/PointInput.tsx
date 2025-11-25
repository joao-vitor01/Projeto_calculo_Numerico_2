
import React, { useState } from 'react';

// Define a interface para um ponto (x, y)
export interface Point {
    x: number;
    y: number;
}

interface PointInputProps {
    minPoints: number; // Mínimo de pontos necessários (ex: 2 para reta, 3 para parábola)
    onSolve: (points: Point[]) => void; // Função de callback para iniciar o cálculo
    initialData?: Point[]; // Dados iniciais opcionais para pré-preencher os pontos
}

const PointInput = ({ minPoints, onSolve, initialData }: PointInputProps) => {
    // Inicializa com um conjunto básico de pontos (ajustável) ou com os dados iniciais fornecidos
    const [points, setPoints] = useState<Point[]>(
        initialData || [
            { x: 0, y: 18 },
            { x: 1.5, y: 13 },
            { x: 2.6, y: 11 },
            { x: 4.2, y: 9 },
            { x: 6, y: 6 },
            { x: 4.2, y: 9 },
            { x: 8.2, y: 4 },
            { x: 10, y: 2 },
            { x: 11.4, y: 1 },
        ]
    );
    const [error, setError] = useState<string | null>(null);

    // Manipula a mudança de valor X ou Y em um ponto específico
    const handlePointChange = (index: number, axis: 'x' | 'y', value: string) => {
        const newValue = parseFloat(value);
        if (isNaN(newValue) && value !== '-') return; // Permite o sinal de menos

        setPoints(prevPoints => {
            const newPoints = [...prevPoints];
            // Se o valor for apenas '-', mantém-o como string para visualização, mas será 0 se não for número.
            newPoints[index][axis] = isNaN(newValue) ? 0 : newValue;
            return newPoints;
        });
    };

    // Adiciona uma nova linha para o usuário inserir um ponto
    const addPoint = () => {
        setPoints(prevPoints => [...prevPoints, { x: 0, y: 0 }]);
    };

    // Remove a última linha de ponto
    const removePoint = () => {
        if (points.length > minPoints) {
            setPoints(prevPoints => prevPoints.slice(0, -1));
        }
    };

    // Prepara os dados para o cálculo
    const handleSubmit = () => {
        if (points.length < minPoints) {
            setError(`É necessário um mínimo de ${minPoints} pontos para este cálculo.`);
            return;
        }
        // Garante que não há NaN ou valores inválidos
        const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y));
        if (validPoints.length < points.length) {
            setError("Verifique se todos os campos de X e F(x) contêm números válidos.");
            return;
        }
        setError(null);
        onSolve(validPoints);
    };

    return (
        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h4 style={{ 
                marginTop: 0, 
                marginBottom: '24px', 
                color: 'var(--text-dark)',
                fontSize: '1.3em',
                fontWeight: 600,
                borderBottom: '2px solid var(--border-color)',
                paddingBottom: '12px'
            }}>
                📍 Entrada de Dados
            </h4>
            
            <div style={{ 
                display: 'inline-block', 
                textAlign: 'left',
                background: 'var(--bg-light)',
                padding: '20px',
                borderRadius: 'var(--border-radius)',
                marginBottom: '20px'
            }}>
                <div style={{ 
                    fontWeight: 700, 
                    display: 'flex', 
                    gap: '20px', 
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid var(--border-color)',
                    color: 'var(--primary-color)'
                }}>
                    <span style={{ width: '100px', textAlign: 'center' }}>X</span>
                    <span style={{ width: '100px', textAlign: 'center' }}>F(x)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {points.map((p, i) => (
                        <div key={i} style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            alignItems: 'center',
                            padding: '8px',
                            borderRadius: 'var(--border-radius-sm)',
                            transition: 'var(--transition)',
                            background: i % 2 === 0 ? 'transparent' : 'rgba(99, 102, 241, 0.05)'
                        }}>
                            <span style={{ 
                                width: '30px',
                                textAlign: 'center',
                                color: 'var(--text-light)',
                                fontWeight: 600
                            }}>
                                {i + 1}.
                            </span>
                            <input
                                type="number"
                                value={p.x.toString()}
                                onChange={(e) => handlePointChange(i, 'x', e.target.value)}
                                style={{ 
                                    width: '100px', 
                                    padding: '10px 14px',
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
                            <input
                                type="number"
                                value={p.y.toString()}
                                onChange={(e) => handlePointChange(i, 'y', e.target.value)}
                                style={{ 
                                    width: '100px', 
                                    padding: '10px 14px',
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

            <div style={{ 
                marginTop: '20px',
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button 
                    onClick={addPoint} 
                    className="btn btn-success"
                    style={{ padding: '10px 20px' }}
                >
                    ➕ Adicionar Ponto
                </button>
                <button 
                    onClick={removePoint} 
                    disabled={points.length <= minPoints} 
                    className="btn btn-danger"
                    style={{ 
                        padding: '10px 20px',
                        opacity: points.length <= minPoints ? 0.5 : 1,
                        cursor: points.length <= minPoints ? 'not-allowed' : 'pointer'
                    }}
                >
                    ➖ Remover Ponto
                </button>
            </div>
            
            <button 
                onClick={handleSubmit}
                className="btn btn-primary"
                style={{ 
                    marginTop: '24px',
                    padding: '14px 32px',
                    fontSize: '1.1em',
                    minWidth: '250px'
                }}
            >
                🚀 Calcular Regressão/Interpolação
            </button>
            
            {error && (
                <div className="result-error" style={{ marginTop: '20px', textAlign: 'left' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>🛑 {error}</p>
                </div>
            )}
        </div>
    );
};

export default PointInput;