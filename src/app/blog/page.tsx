import React from 'react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import LeadCapture from '@/components/LeadCapture';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import styles from './blog.module.css';

interface IBlogPostSerialized {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  createdAt: string;
}

async function getBlogPosts(): Promise<IBlogPostSerialized[]> {
  try {
    await connectDB();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(posts));
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <div className="container">
          <span className="badge badge-health">Educação e Ciência</span>
          <h1 className={styles.title}>Blog ChocoMED</h1>
          <p className={styles.subtitle}>
            Informações confiáveis, estudos científicos e artigos práticos sobre alimentação, controle do diabetes e bem-estar.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.layoutGrid}>
            
            {/* Posts List Column */}
            <div className={styles.postsCol}>
              {posts.length > 0 ? (
                posts.map((post: IBlogPostSerialized) => (
                  <article key={post._id} className={styles.postCard}>
                    <div className={styles.postImagePlaceholder}>
                      <BookOpen size={48} />
                    </div>
                    <div className={styles.postContent}>
                      <div className={styles.meta}>
                        <Calendar size={14} />
                        <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <h2>{post.title}</h2>
                      <p>{post.summary}</p>
                      <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                        Ler Artigo Completo <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className={styles.empty}>
                  <p>Nenhum artigo publicado ainda.</p>
                  <p>Acesse a rota de <Link href="/api/seed" style={{ textDecoration: 'underline', color: 'var(--olive-primary)' }}>seed do banco</Link> para popular os dados.</p>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className={styles.sidebarCol}>
              <div className={styles.sidebarSticky}>
                <div className={styles.sidebarNotice}>
                  <h3>Newsletter ChocoMED</h3>
                  <p>Fique por dentro de receitas novas, artigos de saúde e lançamentos da nossa linha.</p>
                </div>
                <LeadCapture />
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
