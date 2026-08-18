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
  const hiddenPose = { opacity: 0, x: 340, y: 420, scale: 0.94, rotate: rotation };
  const settledPose = { opacity: visible ? 1 : 0, x: 0, y: 0, scale: 1, rotate: rotation };

  return (
    <motion.div
      layout
      className={className}
      initial={revealed ? false : hiddenPose}
      animate={revealed ? settledPose : hiddenPose}
      transition={{
        layout: { type: "spring", stiffness: 150, damping: 27, mass: 1.85 },
        rotate: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        default: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
      }}
      onLayoutAnimationComplete={onSettled}
      onAnimationComplete={onSettled}
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
