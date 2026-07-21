'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './HeroVideoBackground.module.css';

interface HeroVideoBackgroundProps {
  src: string;
}

export default function HeroVideoBackground({ src }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log('Autoplay blocked for background video:', err);
      });
    }
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div className={styles.videoBgContainer}>
      <video
        ref={videoRef}
        src={src}
        className={styles.videoElement}
        loop
        playsInline
        autoPlay
        muted={isMuted}
      />
      <div className={styles.videoOverlay} />

      {/* Floating sound toggle */}
      <button
        className={`${styles.soundToggle} ${isMuted ? styles.pulsing : ''}`}
        onClick={toggleMute}
        aria-label={isMuted ? 'Ativar som da apresentação' : 'Silenciar apresentação'}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span>{isMuted ? 'Ativar Som' : 'Silenciar'}</span>
      </button>
    </div>
  );
}
