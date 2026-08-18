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
  const [detailStage, setDetailStage] = useState<1 | 2 | 3>(1);
  // Lives here, at the App level, which never unmounts — so this is
  // true "has the curtain ever played this session", not "has this
  // particular mount of Homepage played it" (that was the bug).
  const [heroIntroPlayed, setHeroIntroPlayed] = useState(false);
  const locked = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const goDirection = useCallback(
    (dir: 1 | -1) => {
      if (locked.current) return;

      if (dir === 1) {
        if (index === 0) {
          setDirection(1);
          setIndex(1);
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1400);
        } else if (index === 1 && detailStage === 1) {
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1100);
        } else if (index === 1 && detailStage === 2) {
          setDetailStage(3);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1100);
        } else if (index === 1 && detailStage === 3) {
          setDirection(1);
          setIndex(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1400);
        }
      } else {
        if (index === 2) {
          setDirection(-1);
          setIndex(1);
          setDetailStage(3);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1400);
        } else if (index === 1 && detailStage === 3) {
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1100);
        } else if (index === 1 && detailStage === 2) {
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1100);
        } else if (index === 1 && detailStage === 1) {
          setDirection(-1);
          setIndex(0);
          locked.current = true;
          setTimeout(() => (locked.current = false), 1400);
        }
      }
    },
    [index, detailStage]
  );

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
      } else if (e.key === "End") {
        if (locked.current) return;
        setDirection(1);
        setIndex(SECTIONS.length - 1);
        setDetailStage(3);
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
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {index === 0 ? (
            <Homepage
              playIntro={!heroIntroPlayed}
              onIntroDone={() => setHeroIntroPlayed(true)}
            />
          ) : index === 1 ? (
            <HomeDetail stage={detailStage} />
          ) : (
            <HomeDetail2 />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
