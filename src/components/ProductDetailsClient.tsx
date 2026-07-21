'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Star, ShoppingCart, Plus, Minus, MessageSquare, AlertCircle } from 'lucide-react';
import styles from './ProductDetailsClient.module.css';

interface IProductDetailsProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    ingredients: string;
    nutritionalInfo: {
      calories: number;
      carbs: number;
      glycemicIndex: number;
      glycemicLoad: number;
    };
    image: string;
    stock: number;
    category: string;
    rating: number;
  };
}

export default function ProductDetailsClient({ product }: IProductDetailsProps) {
  const { addToCart } = useCart();
  const { isSignedIn } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  interface IReviewItem {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }

  // Reviews state
  const [reviews, setReviews] = useState<IReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${product._id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  }, [product._id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setReviewError('Por favor, escreva um comentário.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          rating: newRating,
          comment: newComment,
        }),
      });

      if (res.ok) {
        setNewComment('');
        setNewRating(5);
        // Reload reviews
        fetchReviews();
      } else {
        const data = await res.json();
        setReviewError(data.error || 'Erro ao enviar avaliação.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Erro de conexão. Tente novamente.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className={styles.detailContainer}>
      <div className="grid-2">
        {/* Left Side: Product Image Visual */}
        <div className={styles.imageCol}>
          <div className={styles.imagePlaceholderCard}>
            <div className={styles.largeIcon}>🍫</div>
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className={styles.infoCol}>
          <span className="badge badge-health">Impacto Glicêmico Controlado</span>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(product.rating) ? 'var(--cocoa-primary)' : 'none'}
                  stroke="var(--cocoa-primary)"
                />
              ))}
            </div>
            <span className={styles.ratingText}>
              {product.rating.toFixed(1)} / 5.0 ({reviews.length} avaliações)
            </span>
          </div>

          <div className={styles.price}>R$ {product.price.toFixed(2)}</div>
          <p className={styles.description}>{product.description}</p>

          {/* NUTRITIONAL STATS CARD */}
          <div className={styles.nutritionalCard}>
            <h3 className={styles.nutriTitle}>Tabela Glicêmica (Porção 25g)</h3>
            <div className={styles.nutriGrid}>
              <div className={styles.nutriItem}>
                <span className={styles.nutriValue}>{product.nutritionalInfo.glycemicIndex}</span>
                <span className={styles.nutriLabel}>Índice Glicêmico (IG)</span>
              </div>
              <div className={styles.nutriItem}>
                <span className={styles.nutriValue}>{product.nutritionalInfo.glycemicLoad}</span>
                <span className={styles.nutriLabel}>Carga Glicêmica (CG)</span>
              </div>
              <div className={styles.nutriItem}>
                <span className={styles.nutriValue}>{product.nutritionalInfo.carbs}g</span>
                <span className={styles.nutriLabel}>Carboidratos Líq.</span>
              </div>
              <div className={styles.nutriItem}>
                <span className={styles.nutriValue}>{product.nutritionalInfo.calories} kcal</span>
                <span className={styles.nutriLabel}>Calorias</span>
              </div>
            </div>
            <div className={styles.nutriNote}>
              <AlertCircle size={14} />
              <span>Carga glicêmica abaixo de 1.0 representa impacto insignificante na resposta insulínica.</span>
            </div>
          </div>

          {/* PURCHASE SECTIONS */}
          <div className={styles.purchaseSection}>
            <div className={styles.quantitySelector}>
              <button onClick={handleDecrement} aria-label="Diminuir quantidade"><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={handleIncrement} aria-label="Aumentar quantidade"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`btn btn-primary ${styles.addToCartBtn}`}
            >
              <ShoppingCart size={18} />
              {added ? 'Adicionado! ✓' : 'Adicionar ao Carrinho'}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <section className={styles.ingredientsSection}>
        <h3>Ingredientes</h3>
        <p>{product.ingredients}</p>
      </section>

      {/* REVIEWS SECTION */}
      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h3><MessageSquare size={20} /> Avaliações dos Clientes</h3>
        </div>

        <div className={styles.reviewsGrid}>
          {/* List Reviews */}
          <div className={styles.reviewsListCol}>
            {loadingReviews ? (
              <p>Carregando avaliações...</p>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className={styles.reviewCard}>
                  <div className={styles.reviewUserRow}>
                    <strong>{rev.userName}</strong>
                    <span className={styles.reviewDate}>
                      {new Date(rev.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= rev.rating ? 'var(--cocoa-primary)' : 'none'}
                        stroke="var(--cocoa-primary)"
                      />
                    ))}
                  </div>
                  <p>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>Nenhuma avaliação para este produto. Seja o primeiro a avaliar!</p>
            )}
          </div>

          {/* Write a Review */}
          <div className={styles.reviewFormCol}>
            {isSignedIn ? (
              <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                <h4>Deixe sua Avaliação</h4>
                {reviewError && <div className={styles.reviewError}>{reviewError}</div>}
                
                <div className="form-group">
                  <label htmlFor="review-stars">Nota</label>
                  <select
                    id="review-stars"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="form-control"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Muito Bom)</option>
                    <option value="3">⭐⭐⭐ (3 - Bom)</option>
                    <option value="2">⭐⭐ (2 - Regular)</option>
                    <option value="1">⭐ (1 - Ruim)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="review-comment">Comentário</label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="form-control"
                    placeholder="Conte sua experiência com este chocolate..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              </form>
            ) : (
              <div className={styles.reviewLoginPrompt}>
                <h4>Gostou deste chocolate?</h4>
                <p>Faça login na sua conta para deixar uma avaliação sobre o produto.</p>
                <SignInButton mode="modal">
                  <button className="btn btn-outline" style={{ width: '100%' }}>
                    Entrar / Criar Conta
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
