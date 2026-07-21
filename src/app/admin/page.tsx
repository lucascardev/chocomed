'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Package, ClipboardList, BookOpen, Users, LogOut } from 'lucide-react';
import styles from './admin.module.css';

interface IOrder {
  _id: string;
  totalAmount: number;
  shippingDetails: {
    name: string;
    phone: string;
    city: string;
    state: string;
  };
  whatsAppLink?: string;
}

interface IProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  nutritionalInfo: {
    glycemicLoad: number;
  };
}

interface ILead {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface IRecipe {
  _id: string;
  title: string;
  description: string;
}

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // Dashboard Data State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  
  // Loading states
  const [loadingData, setLoadingData] = useState(false);

  // Form states for creating a new product
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdCategory, setNewProdCategory] = useState('Barras');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdIngredients, setNewProdIngredients] = useState('');
  const [newProdGI, setNewProdGI] = useState(15);
  const [newProdGL, setNewProdGL] = useState(1);
  const [newProdCarbs, setNewProdCarbs] = useState(4);
  const [newProdCalories, setNewProdCalories] = useState(120);

  const fetchDashboardData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [ordersRes, productsRes, leadsRes, recipesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/leads'),
        fetch('/api/recipes'),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (recipesRes.ok) setRecipes(await recipesRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const checkAuthorization = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/sync');
      if (res.ok) {
        const data = await res.json();
        if (data && data.isAdmin) {
          setIsAdmin(true);
          fetchDashboardData();
        } else {
          setIsAdmin(false);
        }
      }
    } catch (err) {
      console.error('Error checking admin state:', err);
    } finally {
      setCheckingAuth(false);
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const timer = setTimeout(() => {
        checkAuthorization();
      }, 0);
      return () => clearTimeout(timer);
    } else if (isLoaded && !isSignedIn) {
      const timer = setTimeout(() => {
        setCheckingAuth(false);
        setIsAdmin(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, checkAuthorization]);

  // CREATE NEW PRODUCT ACTION
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || newProdPrice <= 0) return;

    const payload = {
      name: newProdName,
      price: newProdPrice,
      category: newProdCategory,
      description: newProdDescription,
      ingredients: newProdIngredients,
      nutritionalInfo: {
        calories: newProdCalories,
        carbs: newProdCarbs,
        glycemicIndex: newProdGI,
        glycemicLoad: newProdGL,
      },
      image: '/images/pure-70.jpg', // Default fallback image path
      stock: 100,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Reset form
        setNewProdName('');
        setNewProdPrice(0);
        setNewProdDescription('');
        setNewProdIngredients('');
        // Refresh products list
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.loadingContainer}>
        <div className="loader"></div>
        <p>Autenticando Administrador...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.forbiddenContainer}>
        <div className="container text-center">
          <h2 style={{ color: '#c81e1e', fontSize: '2.5rem', marginBottom: '16px' }}>Acesso Proibido</h2>
          <p>Esta área é restrita para contas de administrador do e-commerce ChocoMED.</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className="container">
        
        {/* Admin Header */}
        <div className={styles.adminHeader}>
          <div>
            <h1>Painel de Controle</h1>
            <p>Gerenciamento integrado do e-commerce, receitas do clube, blog e captação de leads.</p>
          </div>
          <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px' }}>
            <LogOut size={16} /> Voltar ao Site
          </Link>
        </div>

        {/* Dash Grid */}
        <div className={styles.dashGrid}>
          
          {/* Navigation Sidebar */}
          <aside className={styles.sidebar}>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            >
              <ClipboardList size={18} />
              <span>Pedidos WhatsApp ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabActive : ''}`}
            >
              <Package size={18} />
              <span>Gerenciar Catálogo ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`${styles.tabBtn} ${activeTab === 'leads' ? styles.tabActive : ''}`}
            >
              <Users size={18} />
              <span>Leads Capturados ({leads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`${styles.tabBtn} ${activeTab === 'recipes' ? styles.tabActive : ''}`}
            >
              <BookOpen size={18} />
              <span>Receitas do Clube ({recipes.length})</span>
            </button>
          </aside>

          {/* Main Dashboard Section */}
          <main className={styles.mainContent}>
            {loadingData && <div className={styles.overlayLoading}>Carregando dados...</div>}

            {/* TAB 1: ORDERS TABLE */}
            {activeTab === 'orders' && (
              <div className="glass-card">
                <h3>Pedidos Realizados (Finalização WhatsApp)</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Pedido ID</th>
                        <th>Cliente</th>
                        <th>Cidade</th>
                        <th>Total</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order._id}>
                            <td><span className={styles.orderId} title={order._id}>{order._id.substring(18)}...</span></td>
                            <td>
                              <strong>{order.shippingDetails.name}</strong><br />
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.shippingDetails.phone}</span>
                            </td>
                            <td>{order.shippingDetails.city} - {order.shippingDetails.state}</td>
                            <td>R$ {order.totalAmount.toFixed(2)}</td>
                            <td>
                              <div className={styles.actionCol}>
                                {order.whatsAppLink && (
                                  <a
                                    href={order.whatsAppLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '4px' }}
                                  >
                                    Contato
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>Nenhum pedido registrado no sistema.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS MANAGER (ADD / LIST PRODUCTS) */}
            {activeTab === 'products' && (
              <div className={styles.productTabGrid}>
                {/* Form to create product */}
                <div className="glass-card" style={{ alignSelf: 'flex-start' }}>
                  <h3>Adicionar Chocolate</h3>
                  <form onSubmit={handleCreateProduct} className={styles.adminForm}>
                    <div className="form-group">
                      <label htmlFor="new-name">Nome do Produto</label>
                      <input
                        id="new-name"
                        type="text"
                        required
                        className="form-control"
                        placeholder="Ex: Chocolate Trufado 80%"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                      />
                    </div>

                    <div className="grid-2" style={{ gap: '12px', marginBottom: '0' }}>
                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label htmlFor="new-price">Preço (R$)</label>
                        <input
                          id="new-price"
                          type="number"
                          step="0.1"
                          required
                          className="form-control"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label htmlFor="new-cat">Categoria</label>
                        <select
                          id="new-cat"
                          className="form-control"
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                        >
                          <option value="Barras">Barras</option>
                          <option value="Caixas">Caixas</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-desc">Descrição</label>
                      <textarea
                        id="new-desc"
                        rows={3}
                        className="form-control"
                        placeholder="Destaque as qualidades e o sabor do chocolate..."
                        value={newProdDescription}
                        onChange={(e) => setNewProdDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-ing">Ingredientes</label>
                      <input
                        id="new-ing"
                        type="text"
                        className="form-control"
                        placeholder="Massa de cacau, eritritol..."
                        value={newProdIngredients}
                        onChange={(e) => setNewProdIngredients(e.target.value)}
                      />
                    </div>

                    <h4 style={{ margin: '16px 0 8px 0', fontSize: '0.95rem' }}>Informação Glicêmica e Nutricional</h4>
                    <div className="grid-4" style={{ gap: '8px' }}>
                      <div className="form-group">
                        <label htmlFor="new-gi">IG</label>
                        <input id="new-gi" type="number" className="form-control" value={newProdGI} onChange={(e) => setNewProdGI(Number(e.target.value))} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="new-gl">CG</label>
                        <input id="new-gl" type="number" step="0.1" className="form-control" value={newProdGL} onChange={(e) => setNewProdGL(Number(e.target.value))} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="new-carbs">Carbo (g)</label>
                        <input id="new-carbs" type="number" step="0.1" className="form-control" value={newProdCarbs} onChange={(e) => setNewProdCarbs(Number(e.target.value))} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="new-cal">Kcal</label>
                        <input id="new-cal" type="number" className="form-control" value={newProdCalories} onChange={(e) => setNewProdCalories(Number(e.target.value))} />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }}>
                      Cadastrar Produto
                    </button>
                  </form>
                </div>

                {/* List existing products */}
                <div className="glass-card">
                  <h3>Lista de Chocolates</h3>
                  <div className={styles.productEditList}>
                    {products.map((prod) => (
                      <div key={prod._id} className={styles.prodItemRow}>
                        <div>
                          <strong>{prod.name}</strong><br />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            R$ {prod.price.toFixed(2)} | CG: {prod.nutritionalInfo.glycemicLoad} | Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEADS TABLE */}
            {activeTab === 'leads' && (
              <div className="glass-card">
                <h3>Leads Capturados (Download do E-book)</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  E-mails coletados de usuários interessados em nutrição e saúde glicêmica.
                </p>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Data de Cadastro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.length > 0 ? (
                        leads.map((lead) => (
                          <tr key={lead._id}>
                            <td><strong>{lead.name}</strong></td>
                            <td>{lead.email}</td>
                            <td>{new Date(lead.createdAt).toLocaleString('pt-BR')}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ textAlign: 'center', padding: '30px' }}>Nenhum lead coletado até o momento.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CLUB RECIPES */}
            {activeTab === 'recipes' && (
              <div className="glass-card">
                <h3>Receitas Exclusivas Ativas</h3>
                <div className={styles.recipesList}>
                  {recipes.map((rec) => (
                    <div key={rec._id} className={styles.prodItemRow}>
                      <div>
                        <strong>{rec.title}</strong><br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {rec.description.substring(0, 100)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
