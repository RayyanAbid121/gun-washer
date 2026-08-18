// src/gun/GunEntity.tsx
import { motion } from "framer-motion";
import gunImage from "../assets/gun.png";

interface GunEntityProps {
  className?: string;
  animate?: boolean;
  rotation?: number;
}

export const GunEntity = ({
  className = "",
  animate = true,
  rotation = 0,
}: GunEntityProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={animate ? { opacity: 0, y: 140, scale: 0.94 } : false}
      animate={
        animate
          ? { opacity: 1, y: 0, scale: 1, rotate: rotation }
          : { rotate: rotation }
      }
      transition={{
        duration: 1,
        delay: 1.05,
        ease: [0.16, 1, 0.3, 1],
      }}
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
