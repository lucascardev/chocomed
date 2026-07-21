'use client';

import React, { useState } from 'react';
import styles from './LeadCapture.module.css';

export default function LeadCapture() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Ocorreu um erro. Tente novamente.');
      }
    } catch (err) {
      console.error('Lead capture error:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!submitted ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.title}>Baixe Grátis Nosso E-book</h3>
          <p className={styles.subtitle}>
            Inscreva-se e receba o *Guia Completo de Alimentação Equilibrada e Controle Glicêmico*, elaborado em parceria com nutricionistas parceiros da ChocoMED.
          </p>
          
          {error && <div className={styles.error}>{error}</div>}

          <div className="form-group">
            <label htmlFor="lead-name">Seu Nome</label>
            <input
              id="lead-name"
              type="text"
              className="form-control"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lead-email">Seu Melhor E-mail</label>
            <input
              id="lead-email"
              type="email"
              className="form-control"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Quero Receber o E-book'}
          </button>
        </form>
      ) : (
        <div className={styles.success}>
          <h3 className={styles.title}>Inscrição Concluída! 🎉</h3>
          <p className={styles.subtitle}>
            Obrigado pelo seu interesse! O seu acesso foi registrado com sucesso. Clique abaixo para baixar seu e-book imediatamente:
          </p>
          <a
            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            Baixar E-book (PDF)
          </a>
          <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>
            Voltar / Cadastrar outro e-mail
          </button>
        </div>
      )}
    </div>
  );
}
