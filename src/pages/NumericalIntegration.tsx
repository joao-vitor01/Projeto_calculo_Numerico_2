
import React, { useState } from 'react';
import PointInput, { Point } from '../components/PointInput';
import { trapezoidalRule, simpsonRule } from '../algorithms/integracaoNumerica'; // Importa os algoritmos de integração

type T4Method = 'trapezoidal' | 'simpson';

const NumericalIntegration: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<T4Method>('trapezoidal');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Dados iniciais para o Problema 1 (Seção de Rio)
    const initialPoints: Point[] = [
        { x: 0, y: 0 }, { x: 2, y: 1.8 }, { x: 4, y: 4 }, { x: 6, y: 4 }, 
        { x: 10, y: 6 }, { x: 12, y: 4 }, { x: 14, y: 3.6 }, { x: 16, y: 3.4 }, 
        { x: 18, y: 2.8 }, { x: 20, y: 0 }
    ];

    // Função que recebe os pontos e executa o algoritmo escolhido
    const handleSolve = (points: Point[]) => {
        setError(null);
        setResult(null);

        // Verifica se os pontos estão igualmente espaçados (uma boa prática)
        const h = points.length > 1 ? points[1].x - points[0].x : 0;
        const isEquallySpaced = points.every((p, i, arr) => 
            i === 0 || Math.abs(arr[i].x - arr[i - 1].x - h) < 1e-6
        );

        if (points.length < 2) {
            setError("São necessários pelo menos 2 pontos.");
            return;
        }
        if (!isEquallySpaced) {
             setError("ATENÇÃO: Os pontos devem estar igualmente espaçados para as Regras Repetidas.");
             // Continua o cálculo mesmo com o aviso, mas o resultado será impreciso.
        }

        let integralResult: number | null = null;
        
        switch (selectedMethod) {
            case 'trapezoidal':
                integralResult = trapezoidalRule(points);
                break;
            case 'simpson':
                // Verifica o requisito de Simpson (número de subintervalos par)
                if ((points.length - 1) % 2 !== 0) {
                    setError("Regra de Simpson (1/3) requer um número PAR de subintervalos (ou número ÍMPAR de pontos).");
                    return;
                }
                integralResult = simpsonRule(points);
                break;
        }

        if (integralResult === null) {
            setError("O cálculo falhou. Verifique se o método de Simpson tem um número ímpar de pontos.");
        } else {
            setResult(integralResult);
        }
    };

    return (
        <div>
            <h2>Tópico 04: Integração Numérica (Cálculo de Área)</h2>
            <p>Insira os pontos. Os pontos devem ter espaçamento uniforme.</p>

            {/* Seleção do Método */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1em' }}>
                        🔧 Método de Integração:
                    </label>
                    <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value as T4Method)}
                        style={{ 
                            padding: '12px 16px',
                            fontSize: '1em',
                            minWidth: '280px',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)',
                            background: 'var(--bg-white)',
                            color: 'var(--text-dark)',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="trapezoidal">Regra do Trapézio Repetida</option>
                        <option value="simpson">Regra de Simpson (1/3) Repetida</option>
                    </select>
                </div>
            </div>
            
            {/* O componente genérico de entrada de Pontos */}
            <PointInput minPoints={2} onSolve={handleSolve} initialData={initialPoints} />

            {/* Exibição do Resultado */}
            {result !== null && (
                <div className="result-success">
                    <h4 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--success-color)', fontSize: '1.3em' }}>
                        ✅ Resultado da Área Aproximada
                    </h4>
                    <div style={{ 
                        marginBottom: '16px',
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--success-color)',
                        textAlign: 'center'
                    }}>
                        <p style={{ 
                            margin: '0 0 12px 0',
                            color: 'var(--text-medium)',
                            fontSize: '1.1em'
                        }}>
                            Integral (Área):
                        </p>
                        <p style={{ 
                            margin: 0,
                            fontSize: '2em',
                            color: 'var(--primary-color)',
                            fontWeight: 700
                        }}>
                            {result.toFixed(4)} $m^2$
                        </p>
                    </div>
                    <p style={{ 
                        margin: 0,
                        color: 'var(--text-medium)',
                        fontStyle: 'italic',
                        textAlign: 'center'
                    }}>
                        Método utilizado: <strong>{selectedMethod === 'trapezoidal' ? 'Trapézio' : 'Simpson (1/3)'}</strong>
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

export default NumericalIntegration;