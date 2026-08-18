// src/App.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Homepage } from "./gun/Homepage";
import { HomeDetail } from "./gun/HomeDetail";
import { HomeDetail2 } from "./gun/HomeDetail2";

const SECTIONS = [Homepage, HomeDetail, HomeDetail2];

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.04,
  }),
  center: { y: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.96,
  }),
};

function App() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const locked = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const goTo = useCallback(
    (next: number) => {
      if (locked.current) return;
      const clamped = Math.max(0, Math.min(SECTIONS.length - 1, next));
      if (clamped === index) return;
      setDirection(clamped > index ? 1 : -1);
      setIndex(clamped);
      locked.current = true;
      setTimeout(() => (locked.current = false), 750);
    },
    [index]
  );

  // Wheel
  useEffect(() => {
    let accum = 0;
    const onWheel = (e: WheelEvent) => {
      accum += e.deltaY;
      if (Math.abs(accum) < 30) return;
      goTo(index + (accum > 0 ? 1 : -1));
      accum = 0;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo, index]);

  // Touch swipe (mobile)
  useEffect(() => {
    const onStart = (e: TouchEvent) => (touchStartY.current = e.touches[0].clientY);
    const onEnd = (e: TouchEvent) => {
      if (touchStartY.current == null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) goTo(index + (delta > 0 ? 1 : -1));
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goTo, index]);

  // Mouse drag swipe (desktop)
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      mouseStartY.current = e.clientY;
    };
    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging.current || mouseStartY.current == null) return;
      const delta = mouseStartY.current - e.clientY;
      if (Math.abs(delta) > 60) goTo(index + (delta > 0 ? 1 : -1));
      isDragging.current = false;
      mouseStartY.current = null;
    };
    const onMouseLeave = () => {
      isDragging.current = false;
      mouseStartY.current = null;
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [goTo, index]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(index + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(SECTIONS.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  const Section = SECTIONS[index];

  return (
    <div className="fixed inset-0 overflow-hidden bg-white select-none">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Section />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
