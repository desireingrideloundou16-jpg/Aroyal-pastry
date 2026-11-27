// Boîte à outils du film : thème, polices, animations réutilisables.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";

const bodoni = loadBodoni("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
loadBodoni("italic", { weights: ["400", "500"], subsets: ["latin"] });
const manrope = loadManrope("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const C = {
  ink: "#0f1133",
  navy: "#1a1f5c",
  royal: "#2d3aa8",
  violet: "#6b46c8",
  lav: "#c9b8f3",
  pearl: "#f4f0fb",
  ivory: "#fbfaf7",
  gold: "#c8a35b",
  goldHi: "#ecd29a",
};
export const DISPLAY = bodoni.fontFamily;
export const SANS = manrope.fontFamily;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Mise en page : portrait (4:5) ou paysage (16:9). */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  return { width, height, portrait: height > width };
};

/** Ressort 0 → 1 démarrant à `delay` images. */
export const useSpr = (delay = 0, damping = 14, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 120 } });
};

/** Fond de scène : dégradé royal + halo qui respire. */
export const RoyalBg: React.FC<{ tint?: string }> = ({ tint = "#262c78" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at ${50 + Math.sin(frame / 50) * 8}% ${-5 + Math.cos(frame / 70) * 6}%, ${tint}, ${C.ink} 68%)`,
      }}
    />
  );
};

/** Particules dorées flottantes (bokeh), présentes sur tout le film. */
export const GoldDust: React.FC<{ count?: number; opacity?: number }> = ({ count = 34, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const size = 4 + random(`s${i}`) * 14;
        const speed = 0.25 + random(`v${i}`) * 0.7;
        const x = random(`x${i}`) * width + Math.sin(frame / 40 + i) * 18;
        const y = ((random(`y${i}`) * (height + 100) - frame * speed) % (height + 100) + height + 100) % (height + 100) - 50;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / 22 + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 ? C.goldHi : C.lav,
              opacity: tw * (size > 12 ? 0.35 : 0.7),
              filter: size > 12 ? "blur(3px)" : "none",
              boxShadow: `0 0 ${size * 2}px ${C.gold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Texte révélé mot par mot (glissement vertical masqué). */
export const WordsUp: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  italicWords?: string[];
  accent?: string;
}> = ({ text, delay = 0, stagger = 4, style, italicWords = [], accent = C.lav }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "inherit", columnGap: "0.26em", ...style }}>
      {words.map((w, i) => {
        const p = interpolate(frame, [delay + i * stagger, delay + i * stagger + 18], [0, 1], { ...clamp, easing: EASE_OUT });
        const it = italicWords.includes(w.replace(/[.,!…:]/g, ""));
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
            <span
              style={{
                display: "inline-block",
                translate: `0 ${(1 - p) * 110}%`,
                rotate: `${(1 - p) * 6}deg`,
                fontStyle: it ? "italic" : undefined,
                color: it ? accent : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Petit sur-titre doré avec filets. */
export const Kicker: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({ children, delay = 0, size = 30 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 22], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: `${0.12 + (1 - p) * 0.3}em`,
        textTransform: "uppercase",
        color: C.gold,
        opacity: p,
      }}
    >
      <span style={{ width: 60 * p, height: 2, background: C.gold }} />
      {children}
      <span style={{ width: 60 * p, height: 2, background: C.gold }} />
    </div>
  );
};

/** Carte photo : cadre ivoire, ombre, entrée en ressort + zoom lent (Ken Burns). */
export const PhotoCard: React.FC<{
  src: string;
  w: number;
  h: number;
  delay?: number;
  rotate?: number;
  label?: string;
  style?: React.CSSProperties;
  from?: "bottom" | "left" | "right" | "scale";
  focus?: string;
}> = ({ src, w, h, delay = 0, rotate = 0, label, style, from = "bottom", focus = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const s = useSpr(delay, 13);
  const zoom = interpolate(frame, [delay, delay + 200], [1.18, 1.02], clamp);
  const off = (1 - s) * 260;
  const tr = from === "left" ? `${-off}px 0` : from === "right" ? `${off}px 0` : from === "bottom" ? `0 ${off}px` : "0 0";
  const lp = interpolate(frame, [delay + 12, delay + 30], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        padding: 10,
        borderRadius: 26,
        background: C.ivory,
        boxShadow: "0 40px 80px -30px rgba(0,0,0,.65), 0 0 0 1px rgba(200,163,91,.35)",
        translate: tr,
        scale: from === "scale" ? `${0.6 + 0.4 * s}` : undefined,
        rotate: `${rotate * s + (1 - s) * rotate * 2.5}deg`,
        opacity: Math.min(1, s * 1.6),
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 18, overflow: "hidden", position: "relative" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, scale: `${zoom}` }} />
        {label ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "50px 20px 18px",
              background: "linear-gradient(180deg, transparent, rgba(15,17,51,.88))",
              color: "#fff",
              fontFamily: DISPLAY,
              fontStyle: "italic",
              fontSize: Math.max(28, w * 0.085),
              lineHeight: 1.1,
              opacity: lp,
              translate: `0 ${(1 - lp) * 20}px`,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Reflet lumineux qui balaie un élément (à placer dans un conteneur overflow:hidden). */
export const Shine: React.FC<{ start: number; dur?: number }> = ({ start, dur = 30 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [start, start + dur], [-60, 160], clamp);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(105deg, transparent ${x - 20}%, rgba(255,255,255,.55) ${x}%, transparent ${x + 20}%)`,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

/** Vignettage + grain léger pour un rendu « cinéma ». */
export const FilmFinish: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(5,6,25,.55))" }} />
);

/** Petit logo permanent en haut à gauche. */
export const Bug: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const p = interpolate(frame, [0, 20], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: portrait ? 44 : 48,
        left: portrait ? 44 : 60,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: 0.9 * p,
        color: "#fff",
        fontFamily: DISPLAY,
        fontSize: 30,
        letterSpacing: "0.08em",
      }}
    >
      <Img src={staticFile("img/emblem.png")} style={{ width: 54, height: 54, borderRadius: "50%" }} />
      <span>
        ARoyal <em style={{ color: C.lav }}>Pastry</em>
      </span>
    </div>
  );
};
