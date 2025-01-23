import React from "react";
import { useInView } from "react-intersection-observer";

interface StatsCounterProps {
  value: number;
  label: string;
  prefix?: string;
}

export default function StatsCounter({
  value,
  label,
  prefix = "",
}: StatsCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-purple-600 mb-2">
        {prefix}
        {count.toLocaleString()}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
