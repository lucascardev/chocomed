import React from 'react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import styles from './produtos.module.css';

interface IProductCatalogItem {
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
  };
}

async function getProducts(categoryFilter?: string): Promise<IProductCatalogItem[]> {
  try {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (categoryFilter && categoryFilter !== 'todas') {
      query.category = { $regex: new RegExp(`^${categoryFilter}$`, 'i') };
    }
    const products = await Product.find(query).sort({ price: 1 });
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category?.toLowerCase() || 'todas';
  const products = await getProducts(activeCategory);

  const categories = [
    { name: 'Todos os Chocolates', value: 'todas' },
    { name: 'Barras Funcionais', value: 'barras' },
    { name: 'Caixas de Bombons', value: 'caixas' },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <div className="container">
          <span className="badge badge-health">Nossos Produtos</span>
          <h1 className={styles.title}>Sabores que Respeitam seu Corpo</h1>
          <p className={styles.subtitle}>
            Chocolates artesanais de alto padrão com baixo índice glicêmico e ingredientes 100% naturais. Sem adição de açúcar.
          </p>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className="container">
          {/* Categories Filter Tabs */}
          <div className={styles.filterTabs}>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/produtos?category=${cat.value}`}
                className={`${styles.tab} ${activeCategory === cat.value ? styles.tabActive : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Product Feed Grid */}
          <div className="grid-3" style={{ marginTop: '40px' }}>
            {products.length > 0 ? (
              products.map((product: IProductCatalogItem) => (
                <div key={product._id} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <div className={styles.productImagePlaceholder}>🍫</div>
                    <span className={styles.categoryBadge}>{product.category}</span>
                  </div>
                  <div className={styles.productBody}>
                    <h3>{product.name}</h3>
                    <div className={styles.specs}>
                      <span title="Índice Glicêmico">IG: {product.nutritionalInfo.glycemicIndex}</span>
                      <span title="Carga Glicêmica">CG: {product.nutritionalInfo.glycemicLoad}</span>
                      <span>{product.nutritionalInfo.carbs}g Carb</span>
                    </div>
                    <p className={styles.description}>{product.description}</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.priceCol}>
                        <span className={styles.priceLabel}>Preço</span>
                        <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
                      </div>
                      <Link href={`/produtos/${product.slug}`} className="btn btn-primary">
                        Comprar / Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>Nenhum chocolate encontrado nesta categoria.</p>
                <Link href="/produtos" className="btn btn-outline">
                  Ver Todos
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
