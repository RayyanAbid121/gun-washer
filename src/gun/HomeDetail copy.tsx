// src/gun/HomeDetail.tsx
import { motion } from "framer-motion";
import { GunEntity } from "./GunEntity";
import back2Image from "../assets/back2.png";
import ellipseImage from "../assets/Ellipse.png";
import ellipse2Image from "../assets/Ellipse2.png";
import ellipse3Image from "../assets/Ellipse3.png";
import ellipse4Image from "../assets/Ellipse4.png";

interface Callout {
  title: string;
  desc: string;
  top: string;       // dot marker position — unchanged, do not edit
  left: string;       // dot marker position — unchanged, do not edit
  textTop: string;    // independent text-block position
  textLeft: string;   // independent text-block position
  delay: number;
}

const callouts: Callout[] = [
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

export const HomeDetail = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-roboto">
      {/* Background line */}
      <img
        src={back2Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[-22.2%] h-[126.3%] w-[99.8%] max-w-none object-cover opacity-90"
      />

      <img
        src={ellipseImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute aspect-square w-[40%]"
        style={{ top: "70%", left: "-12%", transform: "rotate(25deg)" }}
      />
      <img
        src={ellipse2Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute aspect-square w-[34.7%]"
        style={{ top: "-15%", right: "-5%", left: "auto", transform: "rotate(0deg)" }}
      />
      {/* Product — unchanged */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full">
        <GunEntity
          className="absolute top-[14%] left-[24%] w-[96%] aspect-square"
          rotation={8}
        />
      </div>

      {/* Dot markers — stay exactly at their given top/left, untouched */}
      {callouts.map((c) => (
        <motion.span
          key={`dot-${c.title}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: c.delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-20 inline-flex h-[28px] w-[28px] items-center justify-center"
          style={{ top: c.top, left: c.left }}
        >
          <img src={ellipse4Image} alt="" className="absolute inset-0 h-full w-full" />
          <img src={ellipse3Image} alt="" className="absolute h-[20px] w-[20px]" />
        </motion.span>
      ))}

      {/* Text blocks — independent top/left via textTop/textLeft */}
      {callouts.map((c) => (
        <motion.div
          key={`text-${c.title}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: c.delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-20 max-w-[220px]"
          style={{ top: c.textTop, left: c.textLeft }}
        >
          <span className="text-lg font-bold text-black">{c.title}</span>
          <p className="mt-1 text-sm font-normal text-black">{c.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};
