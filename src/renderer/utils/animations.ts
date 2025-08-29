import { Variants } from 'framer-motion';

// Animation variants for common UI patterns
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Common animation presets
export const animationPresets = {
  fadeIn: {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: fadeInVariants
  },
  
  slideIn: {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: slideInVariants
  },
  
  slideUp: {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: slideUpVariants
  },
  
  scaleIn: {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: scaleVariants
  }
};

// Hover and tap animations
export const hoverAnimation = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const tapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Service page detection utility
export const isServicePage = (pathname: string): boolean => {
  return ['/proxy-management', '/chat', '/dev-environment'].some(path => 
    pathname.includes(path)
  );
};

// Animation configuration based on page type
export const getAnimationConfig = (pathname: string) => {
  const servicePage = isServicePage(pathname);
  
  return {
    disabled: servicePage,
    duration: servicePage ? 0 : 0.3,
    staggerDelay: servicePage ? 0 : 0.05,
    hoverDuration: servicePage ? 0 : 0.2,
    tapDuration: servicePage ? 0 : 0.1
  };
};

// Card animation variants
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { 
    scale: 1.02, 
    y: -2,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// List item animation variants
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  hover: { 
    scale: 1.01, 
    x: 2,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Modal animation variants
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

// Tooltip animation variants
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

// Loading animation variants
export const loadingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};