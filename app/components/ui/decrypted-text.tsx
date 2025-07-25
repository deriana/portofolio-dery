import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
  loop?: boolean;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=[]{}";

export function DecryptedText({ text, speed = 50, className = "", loop = true }: Props) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let frame = 0;
    let interval: NodeJS.Timeout;

    const decrypt = () => {
      interval = setInterval(() => {
        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (i < frame) {
            result += text[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplayed(result);
        frame++;
        if (frame > text.length) {
          clearInterval(interval);
          if (loop) setTimeout(() => decrypt(), 1000); // loop ulang
        }
      }, speed);
    };

    decrypt();
    return () => clearInterval(interval);
  }, [text, speed, loop]);

  return <span className={`font-mono tracking-widest ${className}`}>{displayed}</span>;
}
