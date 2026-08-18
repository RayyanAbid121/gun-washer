import { motion } from "framer-motion";
import back1Image from "../assets/back1.png";
import starImage from "../assets/star.png";

interface HomepageProps {
  curtainOpen: boolean;
  direction: 1 | -1;
}

const textExit = {
  opacity: 0,
  y: -70,
  transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const },
};

export const Homepage = ({ curtainOpen, direction }: HomepageProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-roboto">
      <motion.img
        src={back1Image}
        alt=""
        aria-hidden="true"
        initial={direction === -1 ? { opacity: 0 } : { opacity: 0.45 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -left-[0.6%] -top-[9.4%] h-[123.4%] w-[100.4%] max-w-none object-cover"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-center px-6 py-5 lg:px-16">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={textExit}
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

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ ...textExit, transition: { ...textExit.transition, delay: 0.02 } }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-5 max-w-5xl shrink-0 text-center text-3xl font-bold leading-tight text-balance text-gray-900 lg:text-5xl"
        >
          Tackle Dirt Anywhere.{" "}
          <span className="text-[#FF7A00]">No Cords. No Limits.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ ...textExit, transition: { ...textExit.transition, delay: 0.04 } }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-3 max-w-xl shrink-0 text-center text-base font-normal text-[#05070A] lg:text-2xl"
        >
          The Ultimate Portable Wireless Pressure Washer Gun
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ ...textExit, transition: { ...textExit.transition, delay: 0.06 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="group relative mt-5 flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-[#FF7A00] bg-[#FF7A00] font-bold text-white shadow-lg"
          style={{
            width: "clamp(182px, 10vw, 260px)",
            height: "clamp(72px, 4.2vw, 104px)",
            fontSize: "clamp(18px, 1vw, 22px)",
          }}
        >
          <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 ease-out group-hover:translate-x-0" />

          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#FF7A00]">
            <span style={{ padding: "24px 0 24px 32px" }}>Buy Now</span>
            <span style={{ paddingRight: "32px" }} className="text-lg">↗</span>
          </span>
        </motion.button>

        <motion.div
          exit={{ ...textExit, transition: { ...textExit.transition, delay: 0.08 } }}
          className="mt-auto w-full max-w-xs shrink-0 self-start pb-4"
        >
          <motion.p
            initial={{ opacity: 0, x: -600 }}
            animate={curtainOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -600 }}
            transition={{ duration: 0.6, delay: curtainOpen ? 0.12 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-light leading-snug text-black"
          >
            Experience the freedom of professional-grade cleaning right in
            the palm of your hand. No tangled hoses, no searching for power
            outlets — just pure, high-pressure cleaning power whenever and
            wherever you need it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -600 }}
            animate={curtainOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -600 }}
            transition={{ duration: 0.6, delay: curtainOpen ? 0.24 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 flex w-[170px] items-center justify-center gap-1 rounded-[5px] border border-black py-2"
          >
            {[...Array(5)].map((_, i) => (
              <img key={i} src={starImage} alt="star" className="h-4 w-4" />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
