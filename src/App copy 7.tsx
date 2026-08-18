// src/App.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Homepage } from "./gun/Homepage";
import { HomeDetail } from "./gun/HomeDetail";
import { HomeDetail2 } from "./gun/HomeDetail2";
import { Orange } from "./gun/Orange";

const SECTIONS = [Homepage, HomeDetail, HomeDetail2];

const PAGE_SLIDE_MS = 1900;
const PAGE_OPACITY_MS = 900;
const PAGE_LOCK_MS = PAGE_SLIDE_MS + 150;
const STAGE_LOCK_MS = 1500;
const CURTAIN_LOCK_MS = 900 + 150;
const WHEEL_COOLDOWN_MS = 250;

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
  const [detailStage, setDetailStage] = useState<1 | 2 | 3>(1);
  // true = curtain fully closed. Starts true so the very first paint is
  // the closed curtain; an effect below opens it shortly after mount.
  const [curtainClosed, setCurtainClosed] = useState(true);
  const locked = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Auto-open on first load.
  useEffect(() => {
    const t = setTimeout(() => {
      locked.current = true;
      setCurtainClosed(false);
      setTimeout(() => (locked.current = false), CURTAIN_LOCK_MS);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const goDirection = useCallback(
    (dir: 1 | -1) => {
      if (locked.current) return;

      if (dir === 1) {
        if (index === 0 && curtainClosed) {
          setCurtainClosed(false);
          locked.current = true;
          setTimeout(() => (locked.current = false), CURTAIN_LOCK_MS);
          return;
        }
        if (index === 0) {
          setDirection(1);
          setIndex(1);
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), PAGE_LOCK_MS);
        } else if (index === 1 && detailStage === 1) {
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), STAGE_LOCK_MS);
        } else if (index === 1 && detailStage === 2) {
          setDetailStage(3);
          locked.current = true;
          setTimeout(() => (locked.current = false), STAGE_LOCK_MS);
        } else if (index === 1 && detailStage === 3) {
          setDirection(1);
          setIndex(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), PAGE_LOCK_MS);
        }
      } else {
        if (index === 2) {
          setDirection(-1);
          setIndex(1);
          setDetailStage(3);
          locked.current = true;
          setTimeout(() => (locked.current = false), PAGE_LOCK_MS);
        } else if (index === 1 && detailStage === 3) {
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), STAGE_LOCK_MS);
        } else if (index === 1 && detailStage === 2) {
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), STAGE_LOCK_MS);
        } else if (index === 1 && detailStage === 1) {
          setDirection(-1);
          setIndex(0);
          locked.current = true;
          setTimeout(() => (locked.current = false), PAGE_LOCK_MS);
        } else if (index === 0 && !curtainClosed) {
          setCurtainClosed(true);
          locked.current = true;
          setTimeout(() => (locked.current = false), CURTAIN_LOCK_MS);
        }
      }
    },
    [index, detailStage, curtainClosed]
  );

  useEffect(() => {
    let accum = 0;
    let cooldownUntil = 0;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (locked.current || now < cooldownUntil) return;
      accum += e.deltaY;
      if (Math.abs(accum) < 40) return;
      goDirection(accum > 0 ? 1 : -1);
      accum = 0;
      cooldownUntil = now + WHEEL_COOLDOWN_MS;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goDirection]);

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
        setCurtainClosed(false);
      } else if (e.key === "End") {
        if (locked.current) return;
        setDirection(1);
        setIndex(SECTIONS.length - 1);
        setDetailStage(3);
        setCurtainClosed(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goDirection]);

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
          transition={{
            y: { duration: PAGE_SLIDE_MS / 1000, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: PAGE_SLIDE_MS / 1000, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: PAGE_OPACITY_MS / 1000, ease: [0.22, 1, 0.36, 1] },
          }}
          className="absolute inset-0"
        >
          {index === 0 ? (
            <Homepage curtainOpen={!curtainClosed} />
          ) : index === 1 ? (
            <HomeDetail stage={detailStage} />
          ) : (
            <HomeDetail2 />
          )}
        </motion.div>
      </AnimatePresence>

      <Orange closed={curtainClosed} />
    </div>
  );
}

export default App;
