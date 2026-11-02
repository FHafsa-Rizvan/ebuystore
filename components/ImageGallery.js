"use client";

import { useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { thumbUrl } from "@/lib/images";

// Big photo with thumbnails underneath, arrows, and swipe on touch screens.
export default function ImageGallery({ images = [], name, emoji, color }) {
  const [i, setI] = useState(0);
  const startX = useRef(null);
  const n = images.length;

  if (n === 0) {
    return (
      <div className="thumb gallery-empty" style={{ background: color }}>
        <span>{emoji}</span>
      </div>
    );
  }

  const go = (d) => setI((cur) => (cur + d + n) % n);

  return (
    <div className="gallery">
      <div
        className="gallery-main"
        style={{ background: color }}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (startX.current === null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <img src={images[i]} alt={n > 1 ? `${name}, photo ${i + 1} of ${n}` : name} />
        {n > 1 && (
          <>
            <button type="button" className="g-arrow g-prev" onClick={() => go(-1)} aria-label="Previous photo"><LuChevronLeft size={22} /></button>
            <button type="button" className="g-arrow g-next" onClick={() => go(1)} aria-label="Next photo"><LuChevronRight size={22} /></button>
            <span className="g-count">{i + 1} / {n}</span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              className={idx === i ? "on" : ""}
              onClick={() => setI(idx)}
              aria-label={`Show photo ${idx + 1}`}
              aria-current={idx === i}
            >
              <img
                src={thumbUrl(src)}
                alt=""
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.dataset.full !== "1") {
                    e.currentTarget.dataset.full = "1";
                    e.currentTarget.src = src;
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}