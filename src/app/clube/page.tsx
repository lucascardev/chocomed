'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Award, Clock, Leaf, AlertCircle, X, ChevronRight, Activity } from 'lucide-react';
import styles from './clube.module.css';

interface IRecipe {
  _id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    carbs: number;
    glycemicIndex: number;
  };
  image: string;
}

export default function ClubePage() {
  const { user } = useUser();
  const [points, setPoints] = useState(0);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);

  useEffect(() => {
    // 1. Fetch user points balance
    fetch('/api/auth/sync')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setPoints(data.points);
        }
      })
      .catch((err) => console.error('Error loading points:', err))
      .finally(() => setLoadingPoints(false));

    // 2. Fetch exclusive recipes
    fetch('/api/recipes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecipes(data);
        }
      })
      .catch((err) => console.error('Error loading recipes:', err))
      .finally(() => setLoadingRecipes(false));
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Member Card Header */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroCard}>
            <div className={styles.heroInfo}>
              <span className={styles.memberBadge}>Membro do Clube</span>
              <h1>Olá, {user?.firstName || 'Membro ChocoMED'}!</h1>
              <p>Bem-vindo ao espaço de receitas exclusivas, pontos e benefícios da ChocoMED.</p>
            </div>
            
            <div className={styles.pointsCard}>
              <div className={styles.pointsIcon}>
                <Award size={32} />
              </div>
              <div className={styles.pointsValueCol}>
                <span className={styles.pointsLabel}>Seu Saldo</span>
                <span className={styles.pointsVal}>
                  {loadingPoints ? '...' : `${points} pts`}
                </span>
                <span className={styles.pointsExp}>1 ponto ganho para cada R$ 1 gasto</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className={styles.mainContent}>
        <div className="container">
          <div className={styles.layoutGrid}>
            
            {/* Recipes Feed */}
            <div className={styles.recipesCol}>
              <h2 className={styles.sectionTitle}>Receitas Exclusivas da Comunidade</h2>
              <p className={styles.sectionSub}>Pratos doces e saudáveis de baixíssimo impacto glicêmico, testados por nutricionistas.</p>

              {loadingRecipes ? (
                <p>Carregando receitas...</p>
              ) : recipes.length > 0 ? (
                <div className={styles.recipesGrid}>
                  {recipes.map((recipe) => (
                    <div key={recipe._id} className={styles.recipeCard} onClick={() => setSelectedRecipe(recipe)}>
                      <div className={styles.recipeImagePlaceholder}>🧑‍🍳</div>
                      <div className={styles.recipeBody}>
                        <h3>{recipe.title}</h3>
                        <p>{recipe.description}</p>
                        <div className={styles.recipeMeta}>
                          <span title="Carboidratos Líquidos"><Leaf size={14} /> {recipe.nutritionalInfo.carbs}g Carbo</span>
                          <span title="Índice Glicêmico"><Activity size={14} /> IG: {recipe.nutritionalInfo.glycemicIndex}</span>
                          <span title="Calorias"><Clock size={14} /> {recipe.nutritionalInfo.calories} kcal</span>
                        </div>
                        <button className={styles.recipeBtn}>Ver Preparo <ChevronRight size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhuma receita cadastrada ainda.</p>
                </div>
              )}
            </div>

            {/* Loyalty/Challenges Sidebar */}
            <aside className={styles.sidebarCol}>
              <div className={styles.loyaltyCard}>
                <h3>Desafios ChocoMED 🌟</h3>
                <p>Participe das nossas metas de estilo de vida e ganhe cupons personalizados para suas próximas compras.</p>
                
                <div className={styles.challengeItem}>
                  <div className={styles.challengeIcon}>🔥</div>
                  <div>
                    <h4>15 Dias Sem Açúcar</h4>
                    <p>Substitua doces comerciais por ChocoMED e alimentos naturais por 15 dias. (Recompensa: Cupom 15% OFF)</p>
                  </div>
                </div>

                <div className={styles.challengeItem}>
                  <div className={styles.challengeIcon}>🏃</div>
                  <div>
                    <h4>Movimento e Saúde</h4>
                    <p>Registre 30 minutos de atividade diária por uma semana no grupo. (Recompensa: 100 pontos Clube)</p>
                  </div>
                </div>
              </div>

              <div className={styles.infoBox}>
                <AlertCircle size={20} />
                <div>
                  <h4>Dica Nutricional</h4>
                  <p>Consumir receitas de baixo índice glicêmico ajuda a manter os níveis de energia constantes e evita a sonolência após as refeições.</p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* RECIPE MODAL DISPLAY */}
      {selectedRecipe && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRecipe(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedRecipe(null)} aria-label="Fechar">
              <X size={24} />
            </button>
            
            <div className={styles.modalHeader}>
              <span className="badge badge-health">Receita do Clube</span>
              <h2>{selectedRecipe.title}</h2>
              <p>{selectedRecipe.description}</p>
            </div>

            <div className={styles.modalSpecs}>
              <div className={styles.specBox}>
                <strong>{selectedRecipe.nutritionalInfo.carbs}g</strong>
                <span>Carboidratos</span>
              </div>
              <div className={styles.specBox}>
                <strong>{selectedRecipe.nutritionalInfo.glycemicIndex}</strong>
                <span>Índice Glicêmico</span>
              </div>
              <div className={styles.specBox}>
                <strong>{selectedRecipe.nutritionalInfo.calories}</strong>
                <span>Calorias</span>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.ingredientsList}>
                <h3>Ingredientes</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ing: string, i: number) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.instructionsList}>
                <h3>Modo de Preparo</h3>
                <ol>
                  {selectedRecipe.instructions.map((inst: string, i: number) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
