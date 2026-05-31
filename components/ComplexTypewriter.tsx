import React, { useState, useEffect, useRef } from 'react';

interface ComplexTypewriterProps {
  items: (string | React.ReactNode)[];
  speed?: number;
}

export function ComplexTypewriter({ items, speed = 30 }: ComplexTypewriterProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalLength = items.reduce((sum, item) => {
    return (sum as number) + (typeof item === 'string' ? item.length : 1);
  }, 0) as number;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleChars >= totalLength) {
      setIsFinished(true);
      return;
    }
    const timer = setTimeout(() => {
      setVisibleChars((v) => v + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [visibleChars, totalLength, hasStarted, speed]);

  let charsRendered = 0;

  return (
    <div ref={containerRef} className="inline">
      {items.map((item, idx) => {
        if (typeof item === 'string') {
          const start = charsRendered;
          const end = charsRendered + item.length;
          charsRendered = end;
          if (visibleChars <= start) return null;
          if (visibleChars >= end) return <span key={idx}>{item}</span>;
          return <span key={idx}>{item.substring(0, visibleChars - start)}</span>;
        } else {
          const myPos = charsRendered;
          charsRendered += 1;
          if (visibleChars <= myPos) return null;
          return <React.Fragment key={idx}>{item}</React.Fragment>;
        }
      })}
      {isFinished && <br />}
      <span
        className={`inline-block w-3 h-1 bg-green-500 animate-cursor align-middle ${
          isFinished ? 'mt-8' : 'ml-2 -translate-y-1'
        }`}
      ></span>
    </div>
  );
}
