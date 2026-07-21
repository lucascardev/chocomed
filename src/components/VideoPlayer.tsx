'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPulsingBadge, setShowPulsingBadge] = useState(true);

  useEffect(() => {
    // Modern browsers allow autoplay ONLY if muted
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log('Autoplay blocked even when muted:', err);
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.error(err));
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid toggling play/pause on background click
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) {
      setShowPulsingBadge(false);
    }
  };

  return (
    <div className={styles.playerContainer} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        className={styles.videoElement}
        loop
        playsInline
        autoPlay
        muted={isMuted}
      />

      {/* Pulsing overlay nudge badge when muted */}
      {isMuted && showPulsingBadge && (
        <button
          className={styles.pulsingBadge}
          onClick={toggleMute}
          aria-label="Ativar som do vídeo"
        >
          <VolumeX size={16} />
          <span>Ativar Som</span>
        </button>
      )}

      {/* Hover Control Overlay */}
      <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
}
