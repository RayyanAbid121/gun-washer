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
      initial={animate ? { opacity: 0, scale: 0.9 } : false}
      animate={
        animate
          ? { opacity: 1, scale: 1, rotate: rotation }
          : { rotate: rotation }
      }
      transition={{ duration: 0.7, delay: 0.2 }}
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
