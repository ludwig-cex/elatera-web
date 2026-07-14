"use client";

import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/content/ratgeber/_types";

/*
 * Interaktive Mitmach-Übungen auf Ratgeber-Artikeln.
 * Drei Typen:
 *  - memory: Begriffe X Sekunden zeigen, verdecken, per Klick selbst prüfen
 *  - quiz:   Multiple Choice mit sofortigem Feedback
 *  - reveal: Aufgabe mit aufklappbarer Lösung
 * Bewusst ohne externe Libraries, große Touch-Ziele für die 60+-Zielgruppe.
 */

const NAVY = "var(--color-navy)";
const CREAM = "var(--color-cream)";

export function ExerciseWidget({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="space-y-6">
      {exercises.map((ex, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(12,43,99,0.16)" }}
        >
          <div
            className="px-5 py-3 flex items-center gap-3 text-sm font-semibold"
            style={{ background: NAVY, color: "#fff" }}
          >
            <span
              aria-hidden
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              {i + 1}
            </span>
            Zum Mitmachen: {ex.title}
          </div>
          <div className="p-5" style={{ background: "#fff" }}>
            {ex.type === "memory" && <MemoryExercise ex={ex} />}
            {ex.type === "quiz" && <QuizExercise ex={ex} />}
            {ex.type === "reveal" && <RevealExercise ex={ex} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function MemoryExercise({ ex }: { ex: Extract<Exercise, { type: "memory" }> }) {
  const [phase, setPhase] = useState<"idle" | "showing" | "recall" | "done">("idle");
  const [left, setLeft] = useState(ex.seconds);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function start() {
    setPhase("showing");
    setLeft(ex.seconds);
    setRevealed(ex.words.map(() => false));
    timer.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          if (timer.current) clearInterval(timer.current);
          setPhase("recall");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  const allRevealed = revealed.length > 0 && revealed.every(Boolean);

  return (
    <div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-ink-soft)" }}>
        {ex.instruction}
      </p>

      {phase === "idle" && (
        <button
          onClick={start}
          className="py-3 px-6 rounded-full font-semibold text-sm"
          style={{ background: NAVY, color: "#fff" }}
        >
          Übung starten ({ex.seconds} Sekunden)
        </button>
      )}

      {phase === "showing" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {ex.words.map((w) => (
              <span
                key={w}
                className="py-2 px-4 rounded-full text-base font-medium"
                style={{ background: CREAM, color: "var(--color-ink)" }}
              >
                {w}
              </span>
            ))}
          </div>
          <div className="text-sm font-semibold" style={{ color: NAVY }}>
            Einprägen … noch {left} Sekunden
          </div>
        </div>
      )}

      {(phase === "recall" || phase === "done") && (
        <div>
          <p className="text-sm mb-3" style={{ color: "var(--color-ink-soft)" }}>
            Sagen Sie die Begriffe laut auf. Tippen Sie dann jeden an, den Sie wussten:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {ex.words.map((w, i) => (
              <button
                key={w}
                onClick={() =>
                  setRevealed((r) => r.map((v, j) => (j === i ? true : v)))
                }
                className="py-2 px-4 rounded-full text-base font-medium transition-colors"
                style={
                  revealed[i]
                    ? { background: "#eaf7f0", color: "#14532d", border: "1px solid #bfe5d0" }
                    : { background: NAVY, color: NAVY, border: `1px solid ${"var(--color-navy)"}` }
                }
                aria-label={revealed[i] ? w : `Begriff ${i + 1} aufdecken`}
              >
                {revealed[i] ? w : "?????"}
              </button>
            ))}
          </div>
          {allRevealed ? (
            <p className="text-sm font-medium" style={{ color: "#14532d" }}>
              {ex.words.length} von {ex.words.length} aufgedeckt. Morgen mit neuen Begriffen wiederholen,
              dann wächst der Effekt.
            </p>
          ) : (
            <button onClick={start} className="text-sm underline underline-offset-4" style={{ color: NAVY }}>
              Nochmal von vorn
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QuizExercise({ ex }: { ex: Extract<Exercise, { type: "quiz" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked !== null && picked === ex.correctIndex;

  return (
    <div>
      <p className="text-base font-medium mb-4" style={{ color: "var(--color-ink)" }}>
        {ex.question}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 mb-4">
        {ex.options.map((o, i) => {
          const isPicked = picked === i;
          const showState = picked !== null && (i === ex.correctIndex || isPicked);
          const good = i === ex.correctIndex;
          return (
            <button
              key={o}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              className="py-3 px-4 rounded-xl text-left text-base transition-colors"
              style={
                showState
                  ? good
                    ? { background: "#eaf7f0", color: "#14532d", border: "1px solid #1d9e57" }
                    : { background: "#fdecec", color: "#8a1f24", border: "1px solid #c62026" }
                  : { background: CREAM, color: "var(--color-ink)", border: "1px solid transparent" }
              }
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="text-sm leading-relaxed" style={{ color: correct ? "#14532d" : "var(--color-ink-soft)" }}>
          {correct ? "Richtig! " : "Nicht ganz. "}
          {ex.explanation}
        </p>
      )}
    </div>
  );
}

function RevealExercise({ ex }: { ex: Extract<Exercise, { type: "reveal" }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p className="text-base font-medium mb-4" style={{ color: "var(--color-ink)" }}>
        {ex.question}
      </p>
      {open ? (
        <div
          className="p-4 rounded-xl text-sm leading-relaxed"
          style={{ background: "#eaf7f0", color: "#14532d", border: "1px solid #bfe5d0" }}
        >
          {ex.solution}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="py-3 px-6 rounded-full font-semibold text-sm"
          style={{ background: NAVY, color: "#fff" }}
        >
          Lösung anzeigen
        </button>
      )}
    </div>
  );
}
