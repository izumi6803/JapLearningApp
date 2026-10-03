"use client";

import { useEffect, useRef, useState } from "react";
import type { Kanji } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

const SIZE = 280;

export function KanjiPractice({ items }: { items: Kanji[] }) {
  const [index, setIndex] = useState(0);
  const [guide, setGuide] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const kanji = items[index];

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, SIZE, SIZE);
  };

  useEffect(() => {
    clear();
  }, [index]);

  if (!kanji) {
    return (
      <p className="py-16 text-center text-sm text-sumi-soft">
        This unit has no kanji to practise.
      </p>
    );
  }

  const toLocal = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = toLocal(e);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = toLocal(e);
    ctx.strokeStyle = "#1a1b1e";
    ctx.lineWidth = 11;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onUp = () => {
    drawing.current = false;
    last.current = null;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="justify-self-center">
        <div
          className="relative border border-line bg-paper"
          style={{ width: SIZE, height: SIZE, maxWidth: "80vw" }}
        >
          <span
            aria-hidden="true"
            className="genko-cell pointer-events-none absolute inset-0 grid place-items-center border-0"
            style={{ aspectRatio: "auto" }}
          >
            <span
              className="font-display text-[12rem] leading-none"
              style={{
                color: "rgba(26,27,30,0.10)",
                WebkitTextStroke: "1px rgba(26,27,30,0.16)",
                opacity: guide ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              {kanji.char}
            </span>
          </span>
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            className="absolute inset-0 h-full w-full touch-none"
            style={{ cursor: "crosshair" }}
            aria-label={`Tracing canvas for ${kanji.char}`}
          />
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="border border-line px-3 py-1.5 text-sm transition-colors hover:border-sumi disabled:opacity-30"
            aria-label="Previous kanji"
          >
            前
          </button>
          <button
            type="button"
            onClick={clear}
            className="border border-line px-3 py-1.5 text-sm transition-colors hover:border-shu hover:text-shu"
          >
            消す
          </button>
          <button
            type="button"
            onClick={() => setGuide((g) => !g)}
            className="border border-line px-3 py-1.5 text-sm transition-colors hover:border-ai hover:text-ai"
            aria-pressed={guide}
          >
            {guide ? "お手本" : "本番"}
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            disabled={index === items.length - 1}
            className="border border-line px-3 py-1.5 text-sm transition-colors hover:border-sumi disabled:opacity-30"
            aria-label="Next kanji"
          >
            次
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
          {index + 1} / {items.length} · trace on the grid
        </p>
      </div>

      <div>
        <div className="flex items-start gap-5 border-b border-line pb-4">
          <span className="font-display text-6xl leading-none text-sumi">
            {kanji.char}
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
              画数 · {kanji.strokes} strokes
            </p>
            <p className="mt-1 text-lg text-sumi">{kanji.meaning}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-[4rem_1fr] gap-y-3 text-sm">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ai">
            On
          </dt>
          <dd className="font-display text-lg text-sumi">
            {kanji.on.length ? kanji.on.join("・") : "—"}
          </dd>
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ai">
            Kun
          </dt>
          <dd className="font-display text-lg text-sumi">
            {kanji.kun.length ? kanji.kun.join("・") : "—"}
          </dd>
        </dl>

        <h3 className="mt-6 border-b border-line pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
          この漢字の言葉
        </h3>
        <ul className="mt-3 space-y-2.5">
          {kanji.words.map((w) => (
            <li key={w.term} className="flex items-center gap-3">
              <SpeakButton text={w.term} />
              <span className="font-display text-lg text-sumi">{w.term}</span>
              <span className="font-mono text-[11px] text-ai">{w.reading}</span>
              <span className="ml-auto text-sm text-sumi-soft">{w.meaning}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
