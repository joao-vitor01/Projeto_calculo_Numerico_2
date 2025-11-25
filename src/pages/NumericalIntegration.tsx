import React, { useState } from 'react';
import PointInput, { Point } from '../components/PointInput';
import { trapezoidalRule, simpsonRule } from '../algorithms/integracaoNumerica';

type T4Method = 'trapezoidal' | 'simpson';

const NumericalIntegration = () => {
    const [selectedMethod, setSelectedMethod] = useState<T4Method>('trapezoidal');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const initialPoints: Point[] = [
        { x: 0, y: 0 }, { x: 2, y: 1.8 }, { x: 4, y: 2 }, { x: 6, y: 4 }, 
        { x: 8, y: 4 }, { x: 10, y: 6 }, { x: 12, y: 4 }, { x: 14, y: 3.6 }, 
        { x: 16, y: 3.4 }, { x: 18, y: 2.8 }, { x: 20, y: 0 }
    ];

    const handleSolve = (points: Point[]) => {
        setError(null);
        setResult(null);

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
        }

        let integralResult: number | null = null;

        switch (selectedMethod) {
            case 'trapezoidal':
                integralResult = trapezoidalRule(points);
                break;

            case 'simpson': {
                const n = points.length - 1;

                if (n % 2 === 0) {
                    // Subintervalos pares → Simpson puro
                    integralResult = simpsonRule(points);
                } else {
                    // Subintervalos ímpares → Simpson + Trapézio
                    const pointsSimpson = points.slice(0, points.length - 1);
                    const pointsTrapezio = points.slice(points.length - 2);

                    // Previne erro de null
                    const simpsonPart = simpsonRule(pointsSimpson) ?? 0;
                    const trapezioPart = trapezoidalRule(pointsTrapezio) ?? 0;

                    integralResult = simpsonPart + trapezioPart;

                    setError(
                        "Aviso: Número ímpar de subintervalos. Aplicado Simpson até o penúltimo intervalo e Trapézio no último."
                    );
                }
                break;
            }
        }

        if (integralResult === null) {
            setError("O cálculo falhou.");
        } else {
            setResult(integralResult);
        }
    };

    return (
        <div>
            <h2>Tópico 04: Integração Numérica (Cálculo de Área)</h2>
            <p>Insira os pontos. Os pontos devem ter espaçamento uniforme.</p>

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

            <PointInput minPoints={2} onSolve={handleSolve} initialData={initialPoints} />

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
                        <p style={{ margin: '0 0 12px 0', color: 'var(--text-medium)', fontSize: '1.1em' }}>
                            Integral (Área):
                        </p>
                        <p style={{ margin: 0, fontSize: '2em', color: 'var(--primary-color)', fontWeight: 700 }}>
                            {result.toFixed(4)} m²
                        </p>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-medium)', fontStyle: 'italic', textAlign: 'center' }}>
                        Método utilizado: <strong>{selectedMethod === 'trapezoidal' ? 'Trapézio' : 'Simpson (1/3)'}</strong>
                    </p>
                </div>
            )}

            {error && (
                <div className="result-error">
                    <p style={{ margin: 0, fontWeight: 600 }}>🛑 {error}</p>
                </div>
            )}
        </div>
    );
};

export default NumericalIntegration;
