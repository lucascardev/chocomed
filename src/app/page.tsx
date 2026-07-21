import React from 'react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import LeadCapture from '../components/LeadCapture';
import VideoPlayer from '../components/VideoPlayer';
import HeroVideoBackground from '../components/HeroVideoBackground';
import { Heart, Activity, Award, Leaf, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

interface IProductSerialized {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  nutritionalInfo: {
    glycemicIndex: number;
    glycemicLoad: number;
    carbs: number;
    calories: number;
  };
}

// Server Action/Function to fetch products directly in Server Component
async function getFeaturedProducts(): Promise<IProductSerialized[]> {
  try {
    await connectDB();
    const products = await Product.find({}).limit(3);
    // Serialize MongoDB objects for Client rendering compatibility
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className={styles.home}>
      {/* 1. HERO SECTION WITH CINEMATIC VIDEO BACKGROUND */}
      <section className={`${styles.hero} ${styles.heroWithVideo} animate-fade-in`}>
        <HeroVideoBackground src="/Pippit_20260721_ChocoMEDIntro.mp4" />
        
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <span className="badge badge-health" style={{ backgroundColor: 'rgba(59, 103, 75, 0.25)', color: '#a3c2ac', border: '1px solid rgba(59, 103, 75, 0.3)' }}>
                Cuidado, Ciência e Afeto
              </span>
              <h1 className={styles.lightText}>O chocolate funcional que respeita sua saúde</h1>
              <p className={styles.lightSubtext}>
                Desenvolvido a partir de uma pesquisa científica por estudantes de escola pública na Bahia, ChocoMED une o sabor rico do cacau nativo a ingredientes de menor impacto glicêmico para diabéticos tipo 2 e pré-diabéticos.
              </p>
              <div className={styles.heroButtons}>
                <Link href="/produtos" className="btn btn-primary">
                  Ver Nossos Chocolates
                </Link>
                <Link href="/calculadora" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                  Calculadora Glicêmica
                </Link>
              </div>
            </div>

            <div className={styles.floatingCardContainer}>
              <div className={styles.cardInfo}>
                <div className={styles.cardInfoTitle}>Média de Carga Glicêmica</div>
                <div className={styles.cardInfoValue}>0.6<span>CG</span></div>
                <p>Equivale a menos de 1% do limite diário recomendado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPS SECTION */}
      <section className={`${styles.props} section-padding`}>
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Por que ChocoMED?</h2>
            <p className="section-subtitle">
              Nossa linha de chocolates foi inteiramente desenvolvida com base em pilares de saúde, bem-estar e validação científica.
            </p>
          </div>

          <div className="grid-4">
            <div className="glass-card text-center">
              <div className={styles.iconWrapper}><Activity size={32} /></div>
              <h3>Baixíssimo Impacto</h3>
              <p>Formulação estudada para evitar picos rápidos de glicose no sangue de diabéticos.</p>
            </div>
            <div className="glass-card text-center">
              <div className={styles.iconWrapper}><Leaf size={32} /></div>
              <h3>Ingredientes Naturais</h3>
              <p>Adoçado com Eritritol e Taumatina. Sem conservantes artificiais ou açúcar refinado.</p>
            </div>
            <div className="glass-card text-center">
              <div className={styles.iconWrapper}><Award size={32} /></div>
              <h3>Cacau Nativo 70%</h3>
              <p>Feito com cacau selecionado do interior da Bahia, rico em flavonoides e antioxidantes.</p>
            </div>
            <div className="glass-card text-center">
              <div className={styles.iconWrapper}><Heart size={32} /></div>
              <h3>Inclusão Alimentar</h3>
              <p>Resgatando o prazer de comer chocolate em momentos de confraternização e afeto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STORYTELLING SECTION */}
      <section className={styles.storytelling}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className={styles.storyVisual}>
              <div className={styles.bahiaPhoto}>
                <div className={styles.photoOverlay}>
                  <span>Vale do Jiquiriçá, BA</span>
                </div>
              </div>
            </div>
            <div className={styles.storyText}>
              <span className={styles.storyLabel}>A Nossa História</span>
              <h2>Do sertão da Bahia para a sua mesa</h2>
              <p>
                A história da **ChocoMED** começou de forma inspiradora: nas salas de aula de uma escola pública no interior da Bahia. Um grupo de estudantes percebeu a dor de familiares com diabetes tipo 2 que precisavam abrir mão de um dos maiores símbolos de celebração e afeto: o chocolate.
              </p>
              <p>
                Inquietos, eles iniciaram uma pesquisa científica com o cacau local. O desafio era grande: criar um chocolate funcional saboroso, cremoso, mas que apresentasse menor impacto glicêmico. 
              </p>
              <p>
                A união da ciência com a riqueza da terra baiana gerou uma fórmula inovadora. O resultado é um produto especializado que promove inclusão alimentar, carinho e saúde. A ChocoMED prova que comer bem é também compartilhar histórias e memórias.
              </p>
              <Link href="/blog/entendendo-indice-glicemico-e-carga-glicemica" className={styles.storyLink}>
                Conheça a ciência por trás da nossa fórmula <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="section-padding">
        <div className="container">
          <div className={styles.productsHeader}>
            <div>
              <h2 className="section-title">Destaques da Nossa Linha</h2>
              <p className={styles.sectionDesc}>Nossos chocolates mais amados para o seu bem-estar diário.</p>
            </div>
            <Link href="/produtos" className="btn btn-outline">
              Ver Todos os Chocolates
            </Link>
          </div>

          <div className="grid-3" style={{ marginTop: '40px' }}>
            {products.length > 0 ? (
              products.map((product: IProductSerialized) => (
                <div key={product._id} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <div className={styles.productImagePlaceholder}>
                      🍫
                    </div>
                    <span className={styles.productCategory}>{product.category}</span>
                  </div>
                  <div className={styles.productContent}>
                    <h3>{product.name}</h3>
                    <div className={styles.productSpecs}>
                      <span>IG: {product.nutritionalInfo.glycemicIndex}</span>
                      <span>CG: {product.nutritionalInfo.glycemicLoad}</span>
                      <span>{product.nutritionalInfo.carbs}g carboidratos</span>
                    </div>
                    <p className={styles.productDesc}>{product.description.substring(0, 95)}...</p>
                    <div className={styles.productFooter}>
                      <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
                      <Link href={`/produtos/${product.slug}`} className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                        Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center" style={{ gridColumn: '1 / -1', padding: '40px 0' }}>
                <p>Nenhum produto cadastrado no momento. Acesse a rota de <Link href="/api/seed" style={{ textDecoration: 'underline', color: 'var(--olive-primary)' }}>seed do banco</Link> para popular os dados.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. CALCULATOR CTA SECTION */}
      <section className={styles.calculatorCta}>
        <div className="container text-center">
          <h2>Quer consumir chocolate com total consciência?</h2>
          <p>
            Utilize nossa calculadora glicêmica desenvolvida sob critérios nutricionais. Saiba exatamente qual porção de ChocoMED é recomendada para o seu momento do dia.
          </p>
          <Link href="/calculadora" className="btn btn-secondary">
            Acessar Calculadora de Impacto
          </Link>
        </div>
      </section>

      {/* 6. LEAD CAPTURE SECTION */}
      <section className={`${styles.leads} section-padding`}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge-health">Conteúdo Gratuito</span>
              <h2 className="section-title" style={{ display: 'block' }}>Aprenda a fazer escolhas alimentares inteligentes</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                A educação nutricional é o pilar mais importante do Clube ChocoMED. Preparamos materiais informativos e receitas científicas para te ajudar a manter uma rotina saborosa, doce e saudável.
              </p>
              <div className={styles.leadProps}>
                <div className={styles.leadPropItem}>
                  <div className={styles.leadPropIcon}>✓</div>
                  <div>
                    <h4>Tabelas de equivalência glicêmica</h4>
                    <p>Substitutos práticos para o açúcar no dia a dia.</p>
                  </div>
                </div>
                <div className={styles.leadPropItem}>
                  <div className={styles.leadPropIcon}>✓</div>
                  <div>
                    <h4>Dicas para controle do Diabetes Tipo 2</h4>
                    <p>Orientação científica simplificada de nutricionistas.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <LeadCapture />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
