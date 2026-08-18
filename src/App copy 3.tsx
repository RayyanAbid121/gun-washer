// src/App.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Homepage } from "./gun/Homepage";
import { HomeDetail } from "./gun/HomeDetail";

const SECTIONS = [Homepage, HomeDetail];

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
  const [detailStage, setDetailStage] = useState<1 | 2>(1); // HomeDetail's internal step
  const locked = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Single gesture dispatcher. dir=1 is "advance" (scroll/swipe/arrow down),
  // dir=-1 is "go back" (scroll/swipe/arrow up). Walks the virtual step
  // sequence: Homepage -> HomeDetail(stage 1) -> HomeDetail(stage 2).
  // Only steps that actually change *page* (index) trigger the full slide
  // transition; a stage flip inside HomeDetail is handled internally by
  // that component and doesn't remount/slide the page.
  const goDirection = useCallback(
    (dir: 1 | -1) => {
      if (locked.current) return;

      if (dir === 1) {
        if (index === 0) {
          // Homepage -> HomeDetail
          setDirection(1);
          setIndex(1);
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1400);
        } else if (index === 1 && detailStage === 1) {
          // HomeDetail stage 1 -> stage 2 (no page slide)
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1100);
        }
        // index===1 && detailStage===2: already at the end, no-op
      } else {
        if (index === 1 && detailStage === 2) {
          // HomeDetail stage 2 -> stage 1 (no page slide)
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1100);
        } else if (index === 1 && detailStage === 1) {
          // HomeDetail stage 1 -> back to Homepage
          setDirection(-1);
          setIndex(0);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1400);
        }
        // index===0: already at the start, no-op
      }
    },
    [index, detailStage]
  );

  // Wheel
  useEffect(() => {
    let accum = 0;
    const onWheel = (e: WheelEvent) => {
      accum += e.deltaY;
      if (Math.abs(accum) < 30) return;
      goDirection(accum > 0 ? 1 : -1);
      accum = 0;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goDirection]);

  // Touch swipe (mobile)
  useEffect(() => {
    const onStart = (e: TouchEvent) => (touchStartY.current = e.touches[0].clientY);
    const onEnd = (e: TouchEvent) => {
      if (touchStartY.current == null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) goDirection(delta > 0 ? 1 : -1);
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goDirection]);

  // Mouse drag swipe (desktop)
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      mouseStartY.current = e.clientY;
    };
    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging.current || mouseStartY.current == null) return;
      const delta = mouseStartY.current - e.clientY;
      if (Math.abs(delta) > 60) goDirection(delta > 0 ? 1 : -1);
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
  }, [goDirection]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goDirection(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goDirection(-1);
      } else if (e.key === "Home") {
        if (locked.current) return;
        setDirection(-1);
        setIndex(0);
        setDetailStage(1);
      } else if (e.key === "End") {
        if (locked.current) return;
        setDirection(1);
        setIndex(SECTIONS.length - 1);
        setDetailStage(2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goDirection]);

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
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {index === 1 ? <HomeDetail stage={detailStage} /> : <Section />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
