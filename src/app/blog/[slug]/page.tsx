import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import LeadCapture from '@/components/LeadCapture';
import { Calendar, ArrowLeft, BookOpen } from 'lucide-react';
import styles from './post.module.css';

interface IBlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug });
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (err) {
    console.error('Error fetching blog post in details page:', err);
    return null;
  }
}

// Simple dependency-free markdown parser to support clean HTML rendering
function parseMarkdownToHTML(markdown: string) {
  if (!markdown) return '';
  
  return markdown
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      
      // H2 Headers
      if (trimmed.startsWith('## ')) {
        return `<h2>${trimmed.substring(3)}</h2>`;
      }
      // H3 Headers
      if (trimmed.startsWith('### ')) {
        return `<h3>${trimmed.substring(4)}</h3>`;
      }
      // Bullet lists
      if (trimmed.startsWith('- ')) {
        const items = trimmed
          .split('\n')
          .map(item => `<li>${item.substring(2)}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      
      // Paragraph format (with inline bold/code replacements)
      const parsedText = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br />');
        
      return `<p>${parsedText}</p>`;
    })
    .join('\n');
}

export default async function BlogPostDetailPage({ params }: IBlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const contentHtml = parseMarkdownToHTML(post.content);

  return (
    <div className={styles.container}>
      <div className="container">
        
        <div className={styles.backLink}>
          <Link href="/blog">
            <ArrowLeft size={16} /> Voltar para o blog
          </Link>
        </div>

        <div className={styles.layoutGrid}>
          
          {/* Article details column */}
          <article className={styles.articleCol}>
            <div className={styles.metaRow}>
              <span className="badge badge-health">Artigo Educativo</span>
              <div className={styles.meta}>
                <Calendar size={14} />
                <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.summary}>{post.summary}</p>
            
            <div className={styles.coverPlaceholder}>
              <BookOpen size={64} />
            </div>

            <div 
              className={styles.articleBody}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>

          {/* Sidebar lead capture column */}
          <aside className={styles.sidebarCol}>
            <div className={styles.sidebarSticky}>
              <div className={styles.sidebarBox}>
                <h3>Clube ChocoMED</h3>
                <p>Junte-se ao nosso clube gratuito! Faça login e acesse receitas exclusivas com foco em nutrição saudável.</p>
                <Link href="/clube" className="btn btn-outline" style={{ width: '100%' }}>
                  Acessar o Clube
                </Link>
              </div>
              <LeadCapture />
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
