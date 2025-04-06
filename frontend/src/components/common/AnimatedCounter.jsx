import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";

/**
 * AnimatedCounter - Animated number counter for statistics
 * 
 * @param {number} end - Final number to count to
 * @param {number} start - Starting number (defaults to 0)
 * @param {number} duration - Animation duration in seconds
 * @param {string} prefix - Text to display before the number
 * @param {string} suffix - Text to display after the number
 * @param {boolean} formatNumber - Whether to format the number with commas
 * @param {number} delay - Delay before animation starts (in milliseconds)
 * @param {number} decimals - Number of decimal places to show
 */
const AnimatedCounter = ({
  end,
  start = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  formatNumber = true,
  delay = 0,
  decimals = 0,
  className = "",
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (inView && !animationStarted) {
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, delay, animationStarted]);

  const { number } = useSpring({
    from: { number: start },
    number: animationStarted ? end : start,
    delay,
    config: { duration: duration * 1000 },
  });

  const formatWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div ref={ref} className={className}>
      {animationStarted ? (
        <animated.span>
          {prefix}
          {number.to((num) => {
            const fixedNum = num.toFixed(decimals);
            return formatNumber ? formatWithCommas(fixedNum) : fixedNum;
          })}
          {suffix}
        </animated.span>
      ) : (
        <span>
          {prefix}
          {formatNumber ? formatWithCommas(start.toFixed(decimals)) : start.toFixed(decimals)}
          {suffix}
        </span>
      )}
    </div>
  );
};

export default AnimatedCounter; 