import { motion } from "framer-motion";
import type { JSX } from "react";

type SpinnerProps = {
  size?: number;
  borderSize?: number;
  color?: string;
};

const SpinnerLoader = ({
  size = 100,
  borderSize = 4,
  color = "#88CDD3",
}: SpinnerProps): JSX.Element => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `${borderSize}px solid ${color}`,
        borderTop: `${borderSize}px solid transparent`,
      }}
      className="rounded-full"
      role="status"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  );
};

export default SpinnerLoader;
