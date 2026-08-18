// src/gun/HomeDetail.tsx
import { motion, AnimatePresence } from "framer-motion";
import { GunEntity } from "./GunEntity";
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

interface HomeDetailProps {
  /** Which callout set + gun pose to show. Controlled by App's nav gestures. */
  stage: 1 | 2;
}

// Stage 1 — nozzle/lance close-up. Unchanged from the original file.
const calloutsStage1: Callout[] = [
  {
    title: "Nozzle Tip",
    desc: "Controls the water spray pattern",
    top: "16.7%",
    left: "46%",
    textTop: "7.3%",
    textLeft: "46.9%",
    delay: 0.3,
  },
  {
    title: "Brass Connector",
    desc: "Provides a secure, leak-proof connection to the nozzle.",
    top: "36%",
    left: "45%",
    textTop: "40%",
    textLeft: "37%",
    delay: 0.5,
  },
  {
    title: "Stainless Steel Lance",
    desc: "Extends the reach and directs the high-pressure water.",
    top: "49%",
    left: "64%",
    textTop: "39%",
    textLeft: "65%",
    delay: 0.7,
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
    delay: 0.2,
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
  delay: 0.5,
  descWidth: "170px",
},
  {
    title: "Ventilation Slots",
    desc: "Helps cool the motor during use.",
    top: "60%",
    left: "70.4%",
    textTop: "52.5%",
    textLeft: "72%",
    delay: 0.65,
  },
];

const GUN_POSE = {
  1: { className: "absolute top-[14%] left-[24%] w-[96%] aspect-square", rotation: 8 },
  2: { className: "absolute top-[-56%] left-[-30%] w-[112%] aspect-square", rotation: 8 },
} as const;
export const HomeDetail = ({ stage }: HomeDetailProps) => {
  const pose = GUN_POSE[stage];
  const activeCallouts = stage === 1 ? calloutsStage1 : calloutsStage2;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-roboto">
      {/* Background line */}
      <img
        src={back2Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[-22.2%] h-[126.3%] w-[99.8%] max-w-none object-cover opacity-90"
      />

      {/* Corner ellipses */}
      <motion.img
        src={ellipseImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute aspect-square w-[40%]"
        style={{ top: "70%", left: "-12%", rotate: "25deg" }}
        initial={{ opacity: 0, x: -70, y: 70 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.img
        src={ellipse2Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute aspect-square w-[34.7%]"
        style={{ top: "-15%", right: "-5%", left: "auto", rotate: "0deg" }}
        initial={{ opacity: 0, x: 70, y: -70 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Product — shared entity, same instance throughout. On first mount
          it morphs in from Homepage's position via layoutId (animate=false
          so it doesn't replay its own rise-up on top of that). When `stage`
          changes (driven by App's gesture dispatcher), only its className/
          rotation change — Framer Motion's `layout` prop on GunEntity's
          internal motion.div animates that repose automatically. */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full">
        <GunEntity className={pose.className} rotation={pose.rotation} animate={false} />
      </div>

      {/* Callouts — cross-fade between stage 1 and stage 2 sets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Dot markers */}
          {activeCallouts.map((c) => (
            <motion.span
              key={`dot-${c.title}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.4 } }}
              transition={{ duration: 0.6, delay: c.delay, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-20 inline-flex h-[28px] w-[28px] items-center justify-center"
              style={{ top: c.top, left: c.left }}
            >
              <img src={ellipse4Image} alt="" className="absolute inset-0 h-full w-full" />
              <img src={ellipse3Image} alt="" className="absolute h-[20px] w-[20px]" />
            </motion.span>
          ))}

         {/* Text blocks */}
{activeCallouts.map((c) => (
  <motion.div
    key={`text-${c.title}`}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8, transition: { duration: 0.4 } }}
    transition={{ duration: 0.7, delay: c.delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
    className="absolute z-20"
    style={{ top: c.textTop, left: c.textLeft, maxWidth: c.descWidth ?? "220px" }}
  >
    <span className="text-lg font-bold text-black">{c.title}</span>
    <p className="mt-1 text-sm font-normal text-black">{c.desc}</p>
  </motion.div>
))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
