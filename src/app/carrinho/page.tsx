'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, MessageSquare } from 'lucide-react';
import styles from './carrinho.module.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Delivery form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('BA');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!name || !phone || !address || !city || !state) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    const orderPayload = {
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: cartTotal,
      shippingDetails: {
        name,
        phone,
        address,
        complement,
        city,
        state,
      }
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        // Clear cart first
        clearCart();
        // Redirect to WhatsApp link
        if (data.whatsAppLink) {
          window.location.href = data.whatsAppLink;
        } else {
          router.push('/');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao processar o pedido. Tente novamente.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className="container text-center">
          <div className={styles.emptyIcon}><ShoppingBag size={64} /></div>
          <h2>Seu carrinho está vazio</h2>
          <p>Explore a nossa linha de chocolates funcionais da Bahia e encha seu dia de sabor e saúde.</p>
          <Link href="/produtos" className="btn btn-primary">
            Conhecer Chocolates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.backLink}>
          <Link href="/produtos">
            <ArrowLeft size={16} /> Voltar para a vitrine
          </Link>
        </div>

        <h1 className={styles.pageTitle}>Seu Carrinho</h1>

        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.cartGrid}>
          {/* Items Column */}
          <div className={styles.itemsCol}>
            {cart.map((item) => (
              <div key={item.productId} className={styles.itemCard}>
                <div className={styles.itemImagePlaceholder}>🍫</div>
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <div className={styles.itemPriceUnit}>
                    R$ {item.price.toFixed(2)} cada
                  </div>
                </div>

                <div className={styles.quantityControls}>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>

                <div className={styles.totalPrice}>
                  R$ {(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className={styles.removeBtn}
                  aria-label="Remover item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Info / Form Column */}
          <div className={styles.formCol}>
            <div className="glass-card">
              <h3 className={styles.summaryTitle}>Detalhes do Pedido</h3>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>R$ {cartTotal.toFixed(2)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Taxa de Entrega</span>
                <strong>A combinar no WhatsApp</strong>
              </div>
              <div className={styles.totalRow}>
                <span>Total Estimado</span>
                <strong>R$ {cartTotal.toFixed(2)}</strong>
              </div>

              <div className={styles.loyaltyNotice}>
                <span>Você ganhará <strong>{Math.floor(cartTotal)} pontos</strong> Clube ChocoMED com este pedido!</span>
              </div>

              <form onSubmit={handleSubmitOrder} className={styles.checkoutForm}>
                <h4>Dados para Entrega</h4>
                
                <div className="form-group">
                  <label htmlFor="delivery-name">Nome Completo *</label>
                  <input
                    id="delivery-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Quem vai receber o pedido"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="delivery-phone">WhatsApp para Contato *</label>
                  <input
                    id="delivery-phone"
                    type="tel"
                    required
                    className="form-control"
                    placeholder="(XX) XXXXX-XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="delivery-address">Endereço de Entrega *</label>
                  <input
                    id="delivery-address"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Rua, Número, Bairro"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="delivery-complement">Complemento</label>
                  <input
                    id="delivery-complement"
                    type="text"
                    className="form-control"
                    placeholder="Apartamento, Bloco, Referência"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>

                <div className="grid-2" style={{ gap: '12px', marginBottom: '0' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label htmlFor="delivery-city">Cidade *</label>
                    <input
                      id="delivery-city"
                      type="text"
                      required
                      className="form-control"
                      placeholder="Ex: Salvador"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label htmlFor="delivery-state">Estado *</label>
                    <select
                      id="delivery-state"
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <option value="BA">Bahia (BA)</option>
                      <option value="SE">Sergipe (SE)</option>
                      <option value="AL">Alagoas (AL)</option>
                      <option value="PE">Pernambuco (PE)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="SP">São Paulo (SP)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ width: '100%', height: '52px', marginTop: '24px' }}
                  disabled={loading}
                >
                  <MessageSquare size={18} />
                  {loading ? 'Processando...' : 'Finalizar via WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
