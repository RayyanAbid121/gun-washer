import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface BuyNowEntityProps {
  className: string;
  revealed: boolean;
  visible: boolean;
}

const hiddenPose = { opacity: 0, scale: 0.9 };

export const BuyNowEntity = ({ className, revealed, visible }: BuyNowEntityProps) => {
  const settledPose = { opacity: visible ? 1 : 0, scale: 1 };

  return (
    <motion.div
      layout
      className={className}
      initial={revealed ? false : hiddenPose}
      animate={revealed ? settledPose : hiddenPose}
      transition={{
        layout: { type: "spring", stiffness: 30, damping: 22, mass: 3 },
        opacity: { duration: 1.25, ease: [0.4, 0, 0.2, 1] },
        default: { duration: 2.25, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{ transformOrigin: "center center", pointerEvents: visible ? "auto" : "none" }}
    >
      <motion.button
        whileHover={visible ? { scale: 1.05 } : undefined}
        whileTap={visible ? { scale: 0.97 } : undefined}
        type="button"
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FF7A00] font-bold text-white"
        style={{
          width: "clamp(182px, 10vw, 260px)",
          height: "clamp(72px, 4.2vw, 104px)",
          border: "2px solid #FF7A00",
          pointerEvents: visible ? "auto" : "none",
          borderRadius: "100px",
        }}
      >
        <span
          className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 ease-out group-hover:translate-x-0"
          style={{ margin: "-2px", border: "2px solid #FF7A00", borderRadius: "100px" }}
        />

        <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#FF7A00]">
          <span style={{ padding: "24px 0 24px 32px" }}>Buy Now</span>
          <ArrowUpRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ paddingRight: "32px" }}
          />
        </span>
      </motion.button>
    </motion.div>
  );
};
