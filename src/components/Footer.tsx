import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.colBrand}>
            <Link href="/" className={styles.logoWrapper}>
              <Image
                src="/logo.jpeg"
                alt="ChocoMED Logo"
                width={48}
                height={48}
                className={styles.logoImg}
              />
              <span className={styles.logoText}>
                Choco<span>MED</span>
              </span>
            </Link>
            <p className={styles.tagline}>
              O sabor que une cuidado, ciência e afeto. Nascido da pesquisa científica de estudantes de escola pública na Bahia para promover a inclusão alimentar e o bem-estar de diabéticos tipo 2.
            </p>
          </div>

          <div className={styles.colLinks}>
            <h3>Navegação</h3>
            <ul className={styles.links}>
              <li><Link href="/">Início</Link></li>
              <li><Link href="/produtos">Chocolates</Link></li>
              <li><Link href="/calculadora">Calculadora Glicêmica</Link></li>
              <li><Link href="/blog">Blog Educativo</Link></li>
              <li><Link href="/clube">Clube ChocoMED</Link></li>
            </ul>
          </div>

          <div className={styles.colContact}>
            <h3>Contato e Origem</h3>
            <p className={styles.origin}>
              <strong>Origem:</strong> Vale do Jiquiriçá, Interior da Bahia - Brasil
            </p>
            <p className={styles.email}>
              <strong>E-mail:</strong> contato@chocomed.com.br
            </p>
            <p className={styles.whatsapp}>
              <strong>WhatsApp Suporte:</strong> +55 (71) 99206-5352
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} ChocoMED. Todos os direitos reservados. Projeto de Inbound Marketing e Impacto Social.</p>
        </div>
      </div>
    </footer>
  );
}
