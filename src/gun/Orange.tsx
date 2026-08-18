import { motion } from "framer-motion";

interface OrangeProps {
  closed: boolean;
}

export const Orange = ({ closed }: OrangeProps) => {
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-y-0 left-0 z-[100] bg-[#FF7A00]"
        style={{ width: "50.1%" }}
        initial={{ x: "0%" }}
        animate={{ x: closed ? "0%" : "-100%" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="pointer-events-none fixed inset-y-0 right-0 z-[100] bg-[#FF7A00]"
        style={{ width: "50.1%" }}
        initial={{ x: "0%" }}
        animate={{ x: closed ? "0%" : "100%" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
};
