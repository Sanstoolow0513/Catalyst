import { motion } from 'framer-motion';
import React from 'react';

// Performance optimization utilities for animations

// Global type declarations for browser APIs
declare global {
  interface Window {
    performance: {
      now(): number;
      mark(name: string): void;
      measure(name: string, startMark: string, endMark: string): void;
      clearMarks(name?: string): void;
      clearMeasures(name?: string): void;
      getEntriesByType(type: string): PerformanceEntry[];
    };
  }
  
  interface PerformanceEntry {
    name: string;
    entryType: string;
    startTime: number;
    duration: number;
  }
  
  interface Navigator {
    hardwareConcurrency: number;
    deviceMemory: number;
  }
  
  const performance: typeof window.performance;
  const navigator: Navigator;
  const requestAnimationFrame: (callback: (timestamp: number) => void) => number;
}

// Hardware acceleration hints
export const hardwareAcceleration = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
};

// Optimized animation variants with hardware acceleration
export const optimizedVariants = {
  fadeIn: {
    initial: { 
      opacity: 0,
      ...hardwareAcceleration
    },
    animate: { 
      opacity: 1,
      ...hardwareAcceleration
    },
    exit: { 
      opacity: 0,
      ...hardwareAcceleration
    }
  },
  
  slideIn: {
    initial: { 
      opacity: 0, 
      x: -20,
      ...hardwareAcceleration
    },
    animate: { 
      opacity: 1, 
      x: 0,
      ...hardwareAcceleration
    },
    exit: { 
      opacity: 0, 
      x: -20,
      ...hardwareAcceleration
    }
  },
  
  slideUp: {
    initial: { 
      opacity: 0, 
      y: 20,
      ...hardwareAcceleration
    },
    animate: { 
      opacity: 1, 
      y: 0,
      ...hardwareAcceleration
    },
    exit: { 
      opacity: 0, 
      y: -20,
      ...hardwareAcceleration
    }
  },
  
  scale: {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      ...hardwareAcceleration
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      ...hardwareAcceleration
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      ...hardwareAcceleration
    }
  }
};

// Animation cleanup utilities
export class AnimationManager {
  private static activeAnimations = new Set<string>();
  
  static registerAnimation(id: string): void {
    this.activeAnimations.add(id);
  }
  
  static unregisterAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }
  
  static cleanupAllAnimations(): void {
    this.activeAnimations.clear();
  }
  
  static getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }
}

// Performance monitoring for animations
export class AnimationPerformanceMonitor {
  private static measurements = new Map<string, number>();
  
  static startMeasurement(id: string): void {
    this.measurements.set(id, window.performance.now());
  }
  
  static endMeasurement(id: string): number | null {
    const startTime = this.measurements.get(id);
    if (startTime === undefined) return null;
    
    const duration = window.performance.now() - startTime;
    this.measurements.delete(id);
    
    // Log slow animations (> 16ms)
    if (duration > 16) {
      console.warn(`Slow animation detected: ${id} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  static getAverageAnimationTime(): number {
    const times = Array.from(this.measurements.values());
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
}

// Optimized motion component with built-in performance monitoring
export const OptimizedMotion = {
  div: motion.div,
  button: motion.button,
  card: motion.div,
  link: motion.a,
  
  // Wrapper with performance monitoring
  withMonitoring: <T extends Record<string, unknown>>(Component: React.ComponentType<T>, id: string) => {
    return React.forwardRef((props: T, ref) => {
      React.useEffect(() => {
        AnimationManager.registerAnimation(id);
        AnimationPerformanceMonitor.startMeasurement(id);
        
        return () => {
          AnimationManager.unregisterAnimation(id);
          AnimationPerformanceMonitor.endMeasurement(id);
        };
      }, [id]);
      
      return React.createElement(Component, { ref, ...props });
    });
  }
};

// Animation optimization utilities
export const animationOptimization = {
  // Reduce animation quality on low-end devices
  shouldReduceMotion: (): boolean => {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.navigator.hardwareConcurrency < 4 ||
      window.navigator.deviceMemory < 4
    );
  },
  
  // Get optimized animation duration based on device capabilities
  getOptimizedDuration: (baseDuration: number): number => {
    if (animationOptimization.shouldReduceMotion()) {
      return 0; // Disable animations
    }
    
    const isLowEndDevice = window.navigator.hardwareConcurrency < 4;
    return isLowEndDevice ? baseDuration * 0.5 : baseDuration;
  },
  
  // Batch animation updates for better performance
  batchAnimations: (animations: Array<() => void>) => {
    window.requestAnimationFrame(() => {
      animations.forEach(animation => animation());
    });
  },
  
  // Throttle rapid animations
  throttleAnimation: (callback: () => void, delay: number) => {
    let lastCall = 0;
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback();
      }
    };
  }
};

// CSS classes for performance optimization
export const performanceClasses = {
  hardwareAccelerated: 'will-change-transform',
  optimized: 'optimize-speed',
  smooth: 'smooth-scroll'
};