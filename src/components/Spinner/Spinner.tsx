import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";
import type { JSX } from "react";

type SpinnerProps = {
  size?: number;
  color?: string;
};

const Spinner = ({
  size = 100,
  color = "#88CDD3",
}: SpinnerProps): JSX.Element => {
  return (
    <div
      role="status"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Empêche tout débordement visuel
      }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          display: "inline-block",
          width: size,
          height: size,
        }}
      >
        <Hourglass size={size} color={color} />
      </motion.div>
    </div>
  );
};

export default Spinner;
