import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, type Easing } from "framer-motion";
import { Homepage } from "./gun/Homepage";
import { HomeDetail } from "./gun/HomeDetail";
import { HomeDetail2 } from "./gun/HomeDetail2";
import { Orange } from "./gun/Orange";
import { GunEntity } from "./gun/GunEntity";
import { BuyNowEntity } from "./gun/BuyNowEntity";

const SECTIONS = [Homepage, HomeDetail, HomeDetail2];

const reverseBezier = (c: readonly [number, number, number, number]): [number, number, number, number] => [
  1 - c[2],
  1 - c[3],
  1 - c[0],
  1 - c[1],
];

const EASE_HOME = [0.95, 0.02, 0.18, 1.01] as const;
const EASE_S1_S2 = [0.8, 0.01, 0.16, 1] as const;
const EASE_S2_S3 = [0.96, -0.02, 0.14, 1] as const;
const EASE_DETAIL2_BACK = [0.84, 0.04, 0.15, 1.02] as const;
const EASE_DETAIL2_FORWARD = [0.65, 0, 0.2, 1] as const;

interface TransitionSpec {
  duration: number;
  ease: Easing;
}

const PAGE_TRANSITIONS: Record<string, TransitionSpec> = {
  toStage1: { duration: 1.2, ease: EASE_HOME as unknown as Easing },
  toHomepage: { duration: 1.5, ease: reverseBezier(EASE_HOME) as unknown as Easing },
  toDetail2: { duration: 1.05, ease: EASE_DETAIL2_FORWARD as unknown as Easing },
  toStage3Back: { duration: 1.1, ease: EASE_DETAIL2_BACK as unknown as Easing },
};

const STAGE_TRANSITIONS: Record<string, TransitionSpec> = {
  s1_to_s2: { duration: 1.2, ease: EASE_S1_S2 as unknown as Easing },
  s2_to_s1: { duration: 1.2, ease: reverseBezier(EASE_S1_S2) as unknown as Easing },
  s2_to_s3: { duration: 1.2, ease: EASE_S2_S3 as unknown as Easing },
  s3_to_s2: { duration: 1.2, ease: reverseBezier(EASE_S2_S3) as unknown as Easing },
};

const GUN_POSE_HOME = {
  className: "absolute left-[11%] top-[0%] w-[82.6%] aspect-square",
  rotation: -16.44,
};
const GUN_POSE_STAGE = {
  1: { className: "absolute top-[14%] left-[24%] w-[96%] aspect-square", rotation: 8 },
  2: { className: "absolute top-[-56%] left-[-30%] w-[112%] aspect-square", rotation: 8 },
  3: { className: "absolute top-[-115%] left-[-40.6%] w-[112%] aspect-square", rotation: 0 },
} as const;

const GUN_POSE_OFFSCREEN = {
  className: "absolute top-[-195%] left-[112%] w-[112%] aspect-square",
  rotation: 28,
};

function getGunPose(index: number, stage: 1 | 2 | 3) {
  if (index === 0) return GUN_POSE_HOME;
  if (index === 1) return GUN_POSE_STAGE[stage];
  return GUN_POSE_OFFSCREEN;
}

function getGunContainerClass(index: number) {
  if (index === 0) {
    return "pointer-events-none absolute left-0 top-0 z-20 mx-auto h-full w-full max-w-[1440px] right-0";
  }
  return "pointer-events-none absolute left-0 top-0 z-10 h-full w-full";
}

const BUYNOW_POSE_STAGE3 = "absolute w-[170px] top-[84%] right-[9%]";
const BUYNOW_POSE_DETAIL2 = "absolute w-[178px] top-[80%] left-[72px]";

function getBuyNowPose(index: number, stage: 1 | 2 | 3) {
  if (index === 1 && stage === 3) return BUYNOW_POSE_STAGE3;
  if (index === 2) return BUYNOW_POSE_DETAIL2;
  return BUYNOW_POSE_STAGE3;
}

function getBuyNowVisible(index: number, stage: 1 | 2 | 3) {
  return (index === 1 && stage === 3) || index === 2;
}

const CURTAIN_LOCK_MS = 900 + 150;
const CURTAIN_CLOSE_MS = 900;
const CURTAIN_REOPEN_PAUSE_MS = 400;
const CURTAIN_INITIAL_DELAY_MS = 400;
const WHEEL_COOLDOWN_MS = 250;

const fadeVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};

function App() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [detailStage, setDetailStage] = useState<1 | 2 | 3>(1);
  const [curtainClosed, setCurtainClosed] = useState(true);

  const [hasEnteredOnce, setHasEnteredOnce] = useState(false);
  const [gunSettled, setGunSettled] = useState(false);

  const [pageTransition, setPageTransition] = useState<TransitionSpec>(PAGE_TRANSITIONS.toStage1);
  const [stageTransition, setStageTransition] = useState<TransitionSpec>(STAGE_TRANSITIONS.s1_to_s2);

  const locked = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (index !== 0 || !curtainClosed) return;
    locked.current = true;
    const delay = hasEnteredOnce
      ? CURTAIN_CLOSE_MS + CURTAIN_REOPEN_PAUSE_MS
      : CURTAIN_INITIAL_DELAY_MS;
    const t = setTimeout(() => {
      setCurtainClosed(false);
      setTimeout(() => (locked.current = false), CURTAIN_LOCK_MS);
    }, delay);
    return () => clearTimeout(t);
  }, [index, curtainClosed, hasEnteredOnce]);

  useEffect(() => {
    if (!curtainClosed) setHasEnteredOnce(true);
  }, [curtainClosed]);

  const lockFor = (spec: TransitionSpec) => spec.duration * 1000 + 150;

  const goDirection = useCallback(
    (dir: 1 | -1) => {
      if (locked.current) return;
      setDirection(dir);

      if (dir === 1) {
        if (index === 0 && curtainClosed) {
          setCurtainClosed(false);
          locked.current = true;
          setTimeout(() => (locked.current = false), CURTAIN_LOCK_MS);
          return;
        }
        if (index === 0) {
          const spec = PAGE_TRANSITIONS.toStage1;
          setPageTransition(spec);
          setGunSettled(false);
          setIndex(1);
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 1 && detailStage === 1) {
          const spec = STAGE_TRANSITIONS.s1_to_s2;
          setStageTransition(spec);
          setGunSettled(false);
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 1 && detailStage === 2) {
          const spec = STAGE_TRANSITIONS.s2_to_s3;
          setStageTransition(spec);
          setGunSettled(false);
          setDetailStage(3);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 1 && detailStage === 3) {
          const spec = PAGE_TRANSITIONS.toDetail2;
          setPageTransition(spec);
          setGunSettled(false);
          setIndex(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        }
      } else {
        if (index === 2) {
          const spec = PAGE_TRANSITIONS.toStage3Back;
          setPageTransition(spec);
          setGunSettled(false);
          setIndex(1);
          setDetailStage(3);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 1 && detailStage === 3) {
          const spec = STAGE_TRANSITIONS.s3_to_s2;
          setStageTransition(spec);
          setGunSettled(false);
          setDetailStage(2);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 1 && detailStage === 2) {
          const spec = STAGE_TRANSITIONS.s2_to_s1;
          setStageTransition(spec);
          setGunSettled(false);
          setDetailStage(1);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 1 && detailStage === 1) {
          const spec = PAGE_TRANSITIONS.toHomepage;
          setPageTransition(spec);
          setGunSettled(false);
          setIndex(0);
          locked.current = true;
          setTimeout(() => (locked.current = false), lockFor(spec));
        } else if (index === 0 && !curtainClosed) {
          setCurtainClosed(true);
          locked.current = true;
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
        setPageTransition(PAGE_TRANSITIONS.toHomepage);
        setGunSettled(false);
        setIndex(0);
        setDetailStage(1);
        setCurtainClosed(false);
      } else if (e.key === "End") {
        if (locked.current) return;
        setDirection(1);
        setPageTransition(PAGE_TRANSITIONS.toDetail2);
        setGunSettled(false);
        setIndex(SECTIONS.length - 1);
        setDetailStage(3);
        setCurtainClosed(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goDirection]);

  const gunPose = getGunPose(index, detailStage);
  const gunVisible = index !== 2;

  return (
    <div className="fixed inset-0 overflow-hidden bg-white select-none">
      <div className="relative mx-auto h-full w-full max-w-[2560px]">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: pageTransition.duration, ease: pageTransition.ease }}
            className="absolute inset-0"
          >
            {index === 0 ? (
              <Homepage curtainOpen={!curtainClosed} direction={direction} />
            ) : index === 1 ? (
              <HomeDetail
                stage={detailStage}
                direction={direction}
                transition={stageTransition}
                gunSettled={gunSettled}
              />
            ) : (
              <HomeDetail2 />
            )}
          </motion.div>
        </AnimatePresence>

        <div className={getGunContainerClass(index)}>
          <GunEntity
            className={gunPose.className}
            rotation={gunPose.rotation}
            revealed={hasEnteredOnce}
            visible={gunVisible}
            onSettled={() => setGunSettled(true)}
          />
        </div>

        <div className="pointer-events-none absolute left-0 top-0 z-30 h-full w-full">
          <BuyNowEntity
            className={getBuyNowPose(index, detailStage)}
            revealed={hasEnteredOnce}
            visible={getBuyNowVisible(index, detailStage)}
          />
        </div>
      </div>

      <Orange closed={curtainClosed} />
    </div>
  );
}

export default App;
