import styles from "./DrawXO.module.css"
import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = i * 0.25;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 0.2, bounce: 0 },
        opacity: { delay, duration: 0.01 }
      }
    };
  }
};

const DrawX = ({ ind, updateSquares, clsName, turn }) => {
  const handleClick = () => {
    updateSquares(ind);
  };
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="square"
      onClick={handleClick}
    >
      {clsName[ind] && (
        <motion.svg
          width="100"
          height="100"
          viewBox="-25 0 200 200"
          initial="hidden"
          animate="visible"
        >
          {clsName[ind] === "x" ? (
            <>
              <motion.line
                x1="0"
                y1="30"
                x2="140"
                y2="170"
                stroke="#00cc88"
                variants={draw}
                custom={1}
                className={styles.draw}
              />
              <motion.line
                x1="0"
                y1="170"
                x2="140"
                y2="30"
                stroke="#00cc88"
                className={styles.draw}
                variants={draw}
                custom={1.5}
              />
            </>
          ) : (
            <motion.circle
              cx="72.5"
              cy="95"
              r="80"
              stroke="#ff0055"
              variants={draw}
              custom={1}
              className={styles.draw}
            />
          )}
        </motion.svg>
      )}
    </motion.div>
  );
};

export default DrawX;
