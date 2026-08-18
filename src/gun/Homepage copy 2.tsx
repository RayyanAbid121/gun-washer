// src/gun/Homepage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { GunEntity } from "./GunEntity";
import back1Image from "../assets/back1.png";
import starImage from "../assets/star.png";

export const Homepage = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-roboto">
      <img
        src={back1Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-[0.6%] -top-[9.4%] h-[123.4%] w-[100.4%] max-w-none object-cover opacity-45"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-center px-6 py-5 lg:px-16">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-md shrink-0 items-center rounded-full bg-[#FF7A00] p-1.5"
        >
          {["Home", "Feature", "About Us", "Contact"].map((item, i) => (
            <span
              key={item}
              className={`flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-full py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors sm:text-xs ${
                i === 0
                  ? "bg-white text-[#FF7A00]"
                  : "text-white hover:opacity-80"
              }`}
            >
              {item}
            </span>
          ))}
        </motion.nav>

        {/* Headline block */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 max-w-5xl shrink-0 text-center text-3xl font-bold leading-tight text-balance text-gray-900 lg:text-5xl"
        >
          Tackle Dirt Anywhere.{" "}
          <span className="text-[#FF7A00]">No Cords. No Limits.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 max-w-xl shrink-0 text-center text-base font-normal text-[#05070A] lg:text-2xl"
        >
          The Ultimate Portable Wireless Pressure Washer Gun
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 flex shrink-0 items-center gap-2 rounded-full bg-[#FF7A00] px-7 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#e66e00]"
        >
          <span>Buy Now</span>
          <span>↗</span>
        </motion.button>

        {/* Description + rating — pinned bottom-left, slides in from the left */}
        <div className="mt-auto w-full max-w-xs shrink-0 self-start pb-4">
          <motion.p
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-light leading-snug text-black"
          >
            Experience the freedom of professional-grade cleaning right in
            the palm of your hand. No tangled hoses, no searching for power
            outlets — just pure, high-pressure cleaning power whenever and
            wherever you need it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 flex w-[170px] items-center justify-center gap-1 rounded-[5px] border border-black py-2"
          >
            {[...Array(5)].map((_, i) => (
              <img key={i} src={starImage} alt="star" className="h-4 w-4" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Product — absolute overlay matching Figma ratios */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 mx-auto h-full w-full max-w-[1440px] right-0">
        <GunEntity
          className="absolute left-[11%] top-[0%] w-[82.6%] aspect-square"
          rotation={-16.44}
        />
      </div>

      {/* Curtain intro — plays once */}
      {!introDone && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 z-50 bg-[#FF7A00]"
            style={{ width: "50.1%" }}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => setIntroDone(true)}
          />
          <motion.div
            className="pointer-events-none absolute inset-y-0 right-0 z-50 bg-[#FF7A00]"
            style={{ width: "50.1%" }}
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      )}
    </div>
  );
};
