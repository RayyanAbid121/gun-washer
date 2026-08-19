import { useRef } from "react";
import { motion } from "framer-motion";
import gunImage from "../assets/gun.png";

interface GunEntityProps {
  className: string;
  rotation: number;
  revealed: boolean;
  visible: boolean;
  onSettled?: () => void;
}

export const GunEntity = ({
  className,
  rotation,
  revealed,
  visible,
  onSettled,
}: GunEntityProps) => {
  const firstReveal = useRef(true);

  const hiddenPose = { opacity: 0, x: "60%", y: "230%", scale: 0.94, rotate: rotation };
  const settledPose = { opacity: visible ? 1 : 0, x: 0, y: 0, scale: 1, rotate: rotation };

  const handleAnimationComplete = () => {
    if (firstReveal.current) {
      firstReveal.current = false;
      onSettled?.();
    }
  };

  const handleLayoutAnimationComplete = () => {
    if (!firstReveal.current) {
      onSettled?.();
    }
  };

  return (
    <motion.div
      layout
      className={className}
      initial={revealed ? false : hiddenPose}
      animate={revealed ? settledPose : hiddenPose}
     transition={{
  layout: { type: "spring", stiffness: 28, damping: 18, mass: 2.5 },
  rotate: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  opacity: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  default: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
}}
      
      onLayoutAnimationComplete={handleLayoutAnimationComplete}
      onAnimationComplete={handleAnimationComplete}
      style={{ transformOrigin: "center center" }}
    >
      <img
        src={gunImage}
        alt="Portable Wireless Pressure Washer Gun"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
};
