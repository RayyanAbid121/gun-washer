// src/gun/HomeDetail2.tsx
import { motion } from "framer-motion";
import back3 from "../assets/back3.png";
import person from "../assets/person.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HomeDetail2() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-roboto">
      {/* back3: fades IN on entry (crossfading with HomeDetail's back2
          as it fades out), fades OUT on exit going back — so the two
          backgrounds dissolve into each other and the page never looks
          like it "reloaded", only its content changes. */}
      <motion.img
        src={back3}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 1, 1] } }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-left"
      />

      {/* Left text column */}
      <div
        className="absolute z-10 flex flex-col items-start"
        style={{
          top: "13.9%",
          left: "72px",
          width: "717px",
        }}
      >
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="font-bold text-[#FF7A00] leading-[1.08]"
          style={{ fontSize: "clamp(28px, 4.2vw, 60px)" }}
        >
          Unbox a Cleaner Drive Today.
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          style={{ marginTop: "clamp(24px, 4vh, 56px)", maxWidth: "94%" }}
        >
          <h2
            className="font-bold text-black leading-none"
            style={{ fontSize: "clamp(22px, 2.9vw, 42px)", marginBottom: "1.2em" }}
          >
            Pure Power. Absolute Freedom.
          </h2>
          <p
            className="font-normal text-black leading-snug"
            style={{ fontSize: "clamp(14px, 1.7vw, 24px)" }}
          >
            No more long commercial car wash queues. No more tangled extension
            cords. Upgrade your maintenance routine with the ultimate
            all-in-one wireless detailing ecosystem. Engineered with
            intelligent high-torque mechanics, quick-connect modular utility,
            and a high-capacity lithium power cell to put professional
            cleaning power directly into your hands.
          </p>
        </motion.div>

        {/* Buy Now removed from here — it's the single persistent
            BuyNowEntity rendered in App.tsx, positioned to land at
            roughly this same spot but shared with (and animated from)
            HomeDetail Stage 3. */}
      </div>

      {/* Person image */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-0 right-[6%] h-[96%]"
      >
        <img
          src={person}
          alt="Person holding a wireless pressure washer gun"
          className="h-full w-auto object-contain object-bottom select-none"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
