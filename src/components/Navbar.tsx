'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      fetch('/api/auth/sync')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.isAdmin) {
            setIsAdmin(true);
          }
        })
        .catch((err) => console.error('Error syncing user', err));
    } else {
      setTimeout(() => setIsAdmin(false), 0);
    }
  }, [isSignedIn, user]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Chocolates', path: '/produtos' },
    { name: 'Calculadora Glicêmica', path: '/calculadora' },
    { name: 'Blog', path: '/blog' },
    { name: 'Clube ChocoMED', path: '/clube' },
  ];

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.navbar}>
          <Link href="/" className={styles.logoWrapper}>
            <Image
              src="/logo.jpeg"
              alt="ChocoMED Logo"
              width={40}
              height={40}
              className={styles.logoImg}
            />
            <span className={styles.logoText}>
              Choco<span>MED</span>
            </span>
          </Link>

          <nav className={`${styles.nav} ${isOpen ? styles.active : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.navLink} ${pathname === link.path ? styles.navLinkActive : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={`${styles.navLink} ${styles.adminLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Painel Admin
              </Link>
            )}
          </nav>

          <div className={styles.actions}>
            <Link href="/carrinho" className={styles.cartIcon} aria-label="Carrinho de compras">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>

            <div className={styles.authWrapper}>
              {!isLoaded ? (
                <div className={styles.loader}></div>
              ) : isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className={styles.loginBtn}>
                    <User size={16} />
                    <span>Entrar</span>
                  </button>
                </SignInButton>
              )}
            </div>

            <button className={styles.menuBtn} onClick={toggleMenu} aria-label="Abrir menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
