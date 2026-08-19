import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import back2Image from "../assets/back2.png";
import ellipseImage from "../assets/Ellipse.png";
import ellipse2Image from "../assets/Ellipse2.png";
import ellipse3Image from "../assets/Ellipse3.png";
import ellipse4Image from "../assets/Ellipse4.png";

interface Callout {
  title: string;
  desc: string;
  top: string;
  left: string;
  textTop: string;
  textLeft: string;
  delay: number;
  descWidth?: string;
}

interface TransitionSpec {
  duration: number;
  ease: Easing;
}

interface HomeDetailProps {
  stage: 1 | 2 | 3;
  direction: 1 | -1;
  transition: TransitionSpec;
  gunSettled: boolean;
}

const calloutsStage1: Callout[] = [
  {
    title: "Nozzle Tip",
    desc: "Controls the water spray pattern",
    top: "16.7%",
    left: "46%",
    textTop: "7.3%",
    textLeft: "46.9%",
    delay: 0.15,
  },
  {
    title: "Brass Connector",
    desc: "Provides a secure, leak-proof connection to the nozzle.",
    top: "36%",
    left: "45%",
    textTop: "40%",
    textLeft: "37%",
    delay: 0.4,
  },
  {
    title: "Stainless Steel Lance",
    desc: "Extends the reach and directs the high-pressure water.",
    top: "49%",
    left: "64%",
    textTop: "39%",
    textLeft: "65%",
    delay: 0.65,
  },
];

const calloutsStage2: Callout[] = [
  {
    title: "Water Outlet",
    desc: "High-pressure water exits from here and travels through the lance to the nozzle.",
    top: "37.6%",
    left: "33.7%",
    textTop: "28%",
    textLeft: "20%",
    delay: 0.15,
    descWidth: "174px",
  },
  {
    title: "Water Inlet Connector",
    desc: "Connects to a water source via a hose or bucket with a filter.",
    top: "71%",
    left: "38.5%",
    textTop: "74.8%",
    textLeft: "31.3%",
    delay: 0.35,
  },
  {
    title: "Trigger",
    desc: "Connects to a water source via a hose or bucket with a filter.",
    top: "81.2%",
    left: "48.5%",
    textTop: "85%",
    textLeft: "45%",
    delay: 0.55,
    descWidth: "170px",
  },
  {
    title: "Ventilation Slots",
    desc: "Helps cool the motor during use.",
    top: "60%",
    left: "70.4%",
    textTop: "52.5%",
    textLeft: "72%",
    delay: 0.75,
  },
];

const calloutsStage3: Callout[] = [
  {
    title: "Battery Pack",
    desc: "Rechargeable lithium battery that powers the motor.",
    top: "59%",
    left: "36.7%",
    textTop: "43.8%",
    textLeft: "31%",
    delay: 0.25,
    descWidth: "158px",
  },
];

const CALLOUT_ENTER_DURATION = 0.28;
const CALLOUT_ENTER_EASE: Easing = [0.16, 1, 0.3, 1];
const CALLOUT_EXIT_DURATION = 0.35;
const CALLOUT_EXIT_EASE: Easing = [0.4, 0, 1, 1];
const GROUP_EXIT_FACTOR = 0.2;
const GROUP_EXIT_EASE: Easing = [0.4, 0, 1, 1];
const TEXT_REVEAL_DELAY_MS = 75;

export const HomeDetail = ({ stage, direction, transition, gunSettled }: HomeDetailProps) => {
  const activeCallouts =
    stage === 1 ? calloutsStage1 : stage === 2 ? calloutsStage2 : calloutsStage3;

 const staggerDelay = (idx: number) => {
  const seq = direction === 1 ? idx : activeCallouts.length - 1 - idx;
  return seq * 0.055;
};
  const [ellipsesShown, setEllipsesShown] = useState(false);
  const [calloutsReady, setCalloutsReady] = useState(false);

  useEffect(() => {
    if (gunSettled && !ellipsesShown) {
      setEllipsesShown(true);
    }
  }, [gunSettled, ellipsesShown]);

  useEffect(() => {
    if (!gunSettled) {
      setCalloutsReady(false);
      return;
    }
    const t = setTimeout(() => setCalloutsReady(true), TEXT_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [gunSettled]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-roboto">
      <motion.img
        src={back2Image}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0, transition: { duration: 2.0, ease: [0.4, 0, 1, 1] } }}
        transition={{ duration: 2.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-0 top-[-22.2%] h-[126.3%] w-[99.8%] max-w-none object-cover"
      />

      {ellipsesShown && (
        <>
          <motion.img
            src={ellipseImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute aspect-square w-[40%]"
            style={{ top: "70%", left: "-12%", rotate: "25deg" }}
            initial={{ opacity: 0, x: -70, y: 70 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 2.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.img
            src={ellipse2Image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute aspect-square w-[28%]"
            style={{ top: "-15%", right: "-5%", left: "auto", rotate: "0deg" }}
            initial={{ opacity: 0, x: 70, y: -70 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 2.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </>
      )}

      {calloutsReady && (
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: transition.duration * GROUP_EXIT_FACTOR, ease: GROUP_EXIT_EASE },
            }}
          >
            {activeCallouts.map((c, idx) => (
              <motion.span
                key={`dot-${c.title}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.6,
                  transition: { duration: CALLOUT_EXIT_DURATION, ease: CALLOUT_EXIT_EASE },
                }}
                transition={{
                  duration: CALLOUT_ENTER_DURATION,
                  delay: staggerDelay(idx),
                  ease: CALLOUT_ENTER_EASE,
                }}
                className="absolute z-20 inline-flex h-[28px] w-[28px] items-center justify-center"
                style={{ top: c.top, left: c.left }}
              >
                <img src={ellipse4Image} alt="" className="absolute inset-0 h-full w-full" />
                <img src={ellipse3Image} alt="" className="absolute h-[20px] w-[20px]" />
              </motion.span>
            ))}

            {activeCallouts.map((c, idx) => (
              <motion.div
                key={`text-${c.title}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -12,
                  transition: { duration: CALLOUT_EXIT_DURATION, ease: CALLOUT_EXIT_EASE },
                }}
                transition={{
                  duration: CALLOUT_ENTER_DURATION,
                  delay: staggerDelay(idx) + 0.2,
                  ease: CALLOUT_ENTER_EASE,
                }}
                className="absolute z-20"
                style={{ top: c.textTop, left: c.textLeft, maxWidth: c.descWidth ?? "220px" }}
              >
                <span className="text-lg font-bold text-black">{c.title}</span>
                <p className="mt-1 text-sm font-normal text-black">{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
