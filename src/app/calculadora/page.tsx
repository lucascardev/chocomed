'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import styles from './calculadora.module.css';

// Predefined product nutritional data to support instant offline calculator loading
const PRODUCTS_DATA = [
  {
    name: 'ChocoMED Cacau Puro 70%',
    id: 'pure-70',
    glycemicIndex: 15,
    carbsPer25g: 4.0,
    caloriesPer25g: 120,
  },
  {
    name: 'ChocoMED Cacau & Castanhas',
    id: 'nuts',
    glycemicIndex: 18,
    carbsPer25g: 4.5,
    caloriesPer25g: 135,
  },
  {
    name: 'ChocoMED Ao Leite de Coco',
    id: 'coconut',
    glycemicIndex: 20,
    carbsPer25g: 5.5,
    caloriesPer25g: 125,
  },
  {
    name: 'Bombons Sortidos ChocoMED (1 Bombom = 15g)',
    id: 'box',
    glycemicIndex: 22,
    carbsPer25g: 5.0, // standardizing calculation to 25g scale for the model
    caloriesPer25g: 125,
  }
];

export default function CalculatorPage() {
  const [selectedProductId, setSelectedProductId] = useState('pure-70');
  const [portionGrams, setPortionGrams] = useState(25);
  const [targetCarbs, setTargetCarbs] = useState(40); // User daily target carbs
  
  const selectedProduct = PRODUCTS_DATA.find(p => p.id === selectedProductId) || PRODUCTS_DATA[0];

  // CALCULATIONS
  // Carbs in portion = (carbsPer25g * portion) / 25
  const calculatedCarbs = (selectedProduct.carbsPer25g * portionGrams) / 25;
  // Glycemic Load = (GI * calculatedCarbs) / 100
  const calculatedGL = (selectedProduct.glycemicIndex * calculatedCarbs) / 100;
  const calculatedCalories = (selectedProduct.caloriesPer25g * portionGrams) / 25;

  // CONVENTIONAL CHOCOLATE COMPARISON (Milk chocolate average: GI 70, Carbs 15g per 25g)
  const conventionalCarbs = (15 * portionGrams) / 25;
  const conventionalGL = (70 * conventionalCarbs) / 100;

  // Percentage of daily limit
  const carbPercentage = (calculatedCarbs / targetCarbs) * 100;

  // VERDICT
  let verdictTitle = '';
  let verdictDesc = '';
  let verdictClass = '';
  let VerdictIcon = CheckCircle;

  if (calculatedGL <= 1.0) {
    verdictTitle = 'Seguro para Consumo';
    verdictDesc = 'O impacto glicêmico desta porção é extremamente baixo. Praticamente nulo sobre a resposta de insulina.';
    verdictClass = styles.verdictGreen;
    VerdictIcon = CheckCircle;
  } else if (calculatedGL > 1.0 && calculatedGL <= 3.0) {
    verdictTitle = 'Consumo Moderado';
    verdictDesc = 'Impacto glicêmico baixo. Recomendado para consumo ao longo do dia, idealmente acompanhado de fibras.';
    verdictClass = styles.verdictYellow;
    VerdictIcon = HelpCircle;
  } else {
    verdictTitle = 'Consumo Sob Alerta';
    verdictDesc = 'Impacto glicêmico perceptível para diabéticos tipo 2. Sugerimos dividir esta porção ou consumi-la logo após as refeições principais.';
    verdictClass = styles.verdictOrange;
    VerdictIcon = AlertTriangle;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.backLink}>
          <Link href="/">
            <ArrowLeft size={16} /> Voltar para o início
          </Link>
        </div>

        <div className={styles.header}>
          <span className="badge badge-health">Consumo Consciente</span>
          <h1 className={styles.title}>Calculadora de Impacto Glicêmico</h1>
          <p className={styles.subtitle}>
            Ajuste a porção do seu chocolate ChocoMED e visualize em tempo real a Carga Glicêmica (CG) estimada e a comparação com chocolates tradicionais.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Controls Column */}
          <div className={styles.controlsCol}>
            <div className="glass-card">
              <h3 className={styles.cardTitle}>Configure seu Consumo</h3>

              {/* Product Select */}
              <div className="form-group">
                <label htmlFor="calc-product">Selecione o Chocolate</label>
                <select
                  id="calc-product"
                  className="form-control"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  {PRODUCTS_DATA.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Portion Slider */}
              <div className="form-group">
                <div className={styles.sliderHeader}>
                  <label htmlFor="calc-portion">Tamanho da Porção</label>
                  <span className={styles.sliderValue}>{portionGrams}g</span>
                </div>
                <input
                  id="calc-portion"
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  className={styles.rangeInput}
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Number(e.target.value))}
                />
                <div className={styles.sliderTicks}>
                  <span>5g (degustação)</span>
                  <span>25g (padrão)</span>
                  <span>100g (barra toda)</span>
                </div>
              </div>

              {/* Target Carbs Input */}
              <div className="form-group">
                <label htmlFor="calc-target">Meta de Carboidratos Diária (g)</label>
                <input
                  id="calc-target"
                  type="number"
                  min="20"
                  max="300"
                  className="form-control"
                  value={targetCarbs}
                  onChange={(e) => setTargetCarbs(Number(e.target.value))}
                />
                <span className={styles.inputHelp}>Usado para calcular a porcentagem consumida em relação à sua meta.</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className={styles.resultsCol}>
            {/* Verdict Alert */}
            <div className={`${styles.verdictCard} ${verdictClass}`}>
              <div className={styles.verdictIconWrapper}>
                <VerdictIcon size={28} />
              </div>
              <div>
                <h4>{verdictTitle}</h4>
                <p>{verdictDesc}</p>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className={styles.resultsGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{calculatedGL.toFixed(2)}</span>
                <span className={styles.resultLabel}>Carga Glicêmica (CG)</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{calculatedCarbs.toFixed(1)}g</span>
                <span className={styles.resultLabel}>Carboidratos Ativos</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{calculatedCalories.toFixed(0)} kcal</span>
                <span className={styles.resultLabel}>Calorias Estimadas</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultValue}>{carbPercentage.toFixed(1)}%</span>
                <span className={styles.resultLabel}>Da Meta de Carbos</span>
              </div>
            </div>

            {/* COMPARISON BAR CHART */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Comparativo de Carga Glicêmica (Menor é melhor)</h3>
              
              <div className={styles.chartRow}>
                <div className={styles.chartLabelRow}>
                  <span><strong>ChocoMED</strong> ({selectedProduct.name})</span>
                  <span className={styles.chocomedValue}>{calculatedGL.toFixed(2)} CG</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barChocomed}
                    style={{ width: `${Math.min(100, (calculatedGL / Math.max(conventionalGL, calculatedGL)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.chartRow}>
                <div className={styles.chartLabelRow}>
                  <span>Chocolate ao Leite Convencional</span>
                  <span className={styles.conventionalValue}>{conventionalGL.toFixed(2)} CG</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barConventional}
                    style={{ width: `${Math.min(100, (conventionalGL / Math.max(conventionalGL, calculatedGL)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.chartLegend}>
                <p>* Valores de comparação baseados em médias de chocolates comerciais tradicionais.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
