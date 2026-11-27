// Les 11 scènes du film ARoyal Pastry. Chaque scène s'adapte au 16:9 et au 4:5.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { C, DISPLAY, SANS, EASE_OUT, clamp, useLayout, useSpr, RoyalBg, WordsUp, Kicker, PhotoCard, Shine } from "./kit";

// Ressort calculé sans hook (utilisable dans une boucle).
const sprAt = (frame: number, at: number) => spring({ frame: frame - at, fps: 30, config: { damping: 11, mass: 0.7, stiffness: 140 } });

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", ...style }}>{children}</AbsoluteFill>
);

const H: React.CSSProperties = { fontFamily: DISPLAY, color: "#fff", fontWeight: 500, lineHeight: 1.02, justifyContent: "center" };

/* ---------- 1. Ouverture : logo ---------- */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const logo = useSpr(8, 11);
  const ring = interpolate(frame, [0, 45], [0, 1], { ...clamp, easing: EASE_OUT });
  const R = 205;
  const circ = 2 * Math.PI * R;
  const zoom = interpolate(frame, [0, 190], [1.06, 1], clamp);
  const name = "ARoyal".split("");
  return (
    <AbsoluteFill>
      <RoyalBg tint="#2b2f86" />
      <Center style={{ scale: `${zoom}`, gap: 0, flexDirection: "column" }}>
        <div style={{ position: "relative", width: 470, height: 470, display: "grid", placeItems: "center" }}>
          <svg width={470} height={470} style={{ position: "absolute", rotate: `${frame * 0.4 - 90}deg` }}>
            <circle cx={235} cy={235} r={R} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} strokeLinecap="round" />
            <circle cx={235} cy={235} r={R + 18} fill="none" stroke={C.lav} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="2 14" />
          </svg>
          <div style={{ width: 360, height: 360, borderRadius: "50%", overflow: "hidden", scale: `${0.3 + 0.7 * logo}`, opacity: Math.min(1, logo * 1.5), boxShadow: `0 0 120px ${C.violet}`, position: "relative" }}>
            <Img src={staticFile("img/emblem.png")} style={{ width: "100%", height: "100%" }} />
            <Shine start={62} dur={34} />
          </div>
        </div>
        <div style={{ ...H, display: "flex", alignItems: "baseline", gap: 26, fontSize: portrait ? 118 : 138, marginTop: 30, letterSpacing: "0.04em" }}>
          <span style={{ display: "flex" }}>
            {name.map((l, i) => {
              const p = interpolate(frame, [30 + i * 3, 50 + i * 3], [0, 1], { ...clamp, easing: EASE_OUT });
              return (
                <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
                  <span style={{ display: "inline-block", translate: `0 ${(1 - p) * 110}%` }}>{l}</span>
                </span>
              );
            })}
          </span>
          <span style={{ fontStyle: "italic", color: C.lav, opacity: interpolate(frame, [52, 70], [0, 1], clamp), translate: `${interpolate(frame, [52, 72], [40, 0], { ...clamp, easing: EASE_OUT })}px 0` }}>
            Pastry
          </span>
        </div>
        <WordsUp
          text="L'art de la gourmandise, servi royalement."
          italicWords={["gourmandise", "royalement"]}
          accent={C.goldHi}
          delay={78}
          stagger={5}
          style={{ ...H, fontSize: portrait ? 50 : 56, marginTop: 26, maxWidth: portrait ? 900 : 1400, color: "rgba(255,255,255,.92)" }}
        />
      </Center>
    </AbsoluteFill>
  );
};

/* ---------- 2. La maison : Ngaoundéré ---------- */
const Chip: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const s = useSpr(delay, 12);
  return (
    <div style={{ padding: "16px 30px", borderRadius: 999, border: `1.5px solid ${C.gold}`, background: "rgba(200,163,91,.12)", color: C.goldHi, fontFamily: SANS, fontWeight: 600, fontSize: 32, scale: `${0.5 + 0.5 * s}`, opacity: Math.min(1, s * 1.5), whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
};

export const SceneMaison: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const city = "Ngaoundéré".split("");
  const bar = interpolate(frame, [40, 75], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <RoyalBg tint="#3a2f8f" />
      <div style={{ position: "absolute", left: portrait ? 0 : 130, right: portrait ? 0 : undefined, top: portrait ? 150 : 250, display: "flex", flexDirection: "column", alignItems: portrait ? "center" : "flex-start", gap: 26 }}>
        <Kicker delay={4}>Née à</Kicker>
        <div style={{ ...H, fontSize: portrait ? 132 : 150, display: "flex", fontStyle: "italic" }}>
          {city.map((l, i) => {
            const p = interpolate(frame, [10 + i * 2.5, 34 + i * 2.5], [0, 1], { ...clamp, easing: EASE_OUT });
            return (
              <span key={i} style={{ display: "inline-block", opacity: p, translate: `0 ${(1 - p) * 60}px`, filter: `blur(${(1 - p) * 10}px)` }}>
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ width: 380 * bar, height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.goldHi})`, borderRadius: 4 }} />
        <div style={{ fontFamily: SANS, color: "rgba(255,255,255,.75)", fontSize: 34, letterSpacing: "0.2em", textTransform: "uppercase", opacity: interpolate(frame, [55, 75], [0, 1], clamp) }}>
          Adamaoua · Cameroun
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 20, justifyContent: portrait ? "center" : "flex-start", maxWidth: portrait ? 960 : 820 }}>
          <Chip delay={70}>Pâtisserie artisanale</Chip>
          <Chip delay={112}>Faite à la main</Chip>
          <Chip delay={135}>À la commande</Chip>
          <Chip delay={160}>Avec passion ♥</Chip>
        </div>
      </div>
      {portrait ? (
        <>
          <PhotoCard src="img/produits/gateau-roses.jpg" w={430} h={520} delay={30} rotate={-5} style={{ left: 90, top: 760 }} />
          <PhotoCard src="img/gateau-coeur.jpg" w={430} h={520} delay={48} rotate={5} style={{ left: 560, top: 740 }} />
        </>
      ) : (
        <>
          <PhotoCard src="img/produits/gateau-roses.jpg" w={460} h={600} delay={25} rotate={-6} from="right" style={{ left: 1040, top: 220 }} />
          <PhotoCard src="img/gateau-coeur.jpg" w={460} h={600} delay={45} rotate={5} from="right" style={{ left: 1380, top: 280 }} />
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 3. Gâteaux sur mesure ---------- */
const CAKES = [
  { src: "img/produits/layer-cake.jpg", label: "Layer cake", at: 10 },
  { src: "img/produits/drip-cake.jpg", label: "Drip cake chocolat", at: 52 },
  { src: "img/produits/number-cake.jpg", label: "Number cake", at: 98 },
  { src: "img/produits/gateau-roses.jpg", label: "Gâteau à message", at: 128 },
  { src: "img/produits/gateau-rond.jpg", label: "Anniversaire", at: 155 },
];
export const SceneGateaux: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const lift = interpolate(frame, [175, 200], [0, 1], { ...clamp, easing: EASE_OUT });
  const pos = portrait
    ? [
        [40, 150], [380, 130], [720, 150],
        [210, 560], [550, 540],
      ]
    : CAKES.map((_, i) => [80 + i * 358, 215 + (i % 2) * 40]);
  const W = portrait ? 320 : 330, Hh = portrait ? 420 : 470;
  return (
    <AbsoluteFill>
      <RoyalBg tint="#2d3aa8" />
      <AbsoluteFill style={{ translate: `0 ${-lift * 30}px`, scale: `${1 - lift * 0.04}` }}>
        {CAKES.map((c, i) => (
          <PhotoCard key={c.src} src={c.src} label={c.label} w={W} h={Hh} delay={c.at} rotate={[-4, 3, -2, 4, -3][i]} style={{ left: pos[i][0], top: pos[i][1] }} />
        ))}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: portrait ? 90 : 95, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Kicker delay={4} size={28}>Nos gâteaux</Kicker>
        <WordsUp text="Des gâteaux sur mesure" italicWords={["sur", "mesure"]} delay={178} stagger={5} style={{ ...H, fontSize: portrait ? 92 : 104 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. Trompe-l'œil ---------- */
const FRUITS = [
  { src: "img/tl-citron.jpg", label: "Citron", at: 52 },
  { src: "img/tl-orange.jpg", label: "Orange", at: 68 },
  { src: "img/tl-pomme.jpg", label: "Pomme", at: 84 },
  { src: "img/tl-coco1.jpg", label: "Coco", at: 100 },
  { src: "img/tl-cacahuete.jpg", label: "Cacahuète", at: 118 },
];
const Fruit: React.FC<{ src: string; label: string; at: number; d: number; x: number; y: number }> = ({ src, label, at, d, x, y }) => {
  const frame = useCurrentFrame();
  const s = useSpr(at, 9);
  const bounce = 1 + 0.08 * Math.max(0, Math.sin(((frame - 192) / 14) * Math.PI)) * (frame > 192 && frame < 206 ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: d, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, scale: `${s * bounce}`, opacity: Math.min(1, s * 2) }}>
      <div style={{ width: d, height: d, borderRadius: "50%", overflow: "hidden", border: `5px solid ${C.goldHi}`, boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 40, color: "#fff" }}>{label}</div>
    </div>
  );
};
export const SceneTrompe: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait, width } = useLayout();
  const zoom = interpolate(frame, [0, 254], [1.25, 1.05], clamp);
  const veil = interpolate(frame, [0, 40], [0.35, 0.72], clamp);
  const d = portrait ? 240 : 250;
  const pts = portrait
    ? [[100, 380], [420, 380], [740, 380], [260, 700], [580, 700]]
    : FRUITS.map((_, i) => [(width - 5 * d - 4 * 90) / 2 + i * (d + 90), 330]);
  const hl = interpolate(frame, [196, 222], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Img src={staticFile("img/tl-panorama.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: `${zoom}`, filter: "blur(2px)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(15,17,51,${veil}), rgba(15,17,51,${veil + 0.15}))` }} />
      <div style={{ position: "absolute", top: portrait ? 150 : 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Kicker delay={2} size={28}>La spécialité</Kicker>
        <WordsUp text="Les trompe-l'œil" italicWords={["trompe-l'œil"]} delay={8} style={{ ...H, fontSize: portrait ? 100 : 110 }} />
      </div>
      {FRUITS.map((f, i) => (
        <Fruit key={f.src} {...f} d={d} x={pts[i][0]} y={pts[i][1]} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: portrait ? 120 : 110, display: "flex", flexDirection: portrait ? "column" : "row", justifyContent: "center", alignItems: "center", gap: portrait ? 6 : 34 }}>
        <WordsUp text="Ça a l'air vrai ?" delay={160} stagger={4} style={{ ...H, fontSize: portrait ? 76 : 84, color: "rgba(255,255,255,.85)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: -10, right: -10, bottom: 8, height: 30, background: C.gold, opacity: 0.55, scale: `${hl} 1`, transformOrigin: "left", borderRadius: 6 }} />
          <WordsUp text="C'est un dessert !" italicWords={["dessert"]} accent={C.goldHi} delay={192} stagger={5} style={{ ...H, fontSize: portrait ? 90 : 96, position: "relative" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. Douceurs ---------- */
const SWEETS = [
  { src: "img/produits/cupcakes.jpg", label: "Cupcakes", at: 40 },
  { src: "img/produits/muffins.jpg", label: "Muffins", at: 60 },
  { src: "img/produits/cakes-marbres.jpg", label: "Cakes marbrés", at: 78 },
  { src: "img/produits/crepes-pliees.jpg", label: "Crêpes", at: 104 },
  { src: "img/produits/crepes-roulees.jpg", label: "Crêpes roulées", at: 116 },
  { src: "img/produits/pancakes-box.jpg", label: "Pancakes", at: 134 },
];
export const SceneDouceurs: React.FC = () => {
  const { portrait } = useLayout();
  const tw = portrait ? 455 : 372, th = portrait ? 300 : 400, gap = portrait ? 22 : 24;
  const cols = portrait ? 2 : 3;
  const ox = portrait ? 74 : 700, oy = portrait ? 340 : 120;
  return (
    <AbsoluteFill>
      <RoyalBg tint="#4b3a9e" />
      <div style={{ position: "absolute", left: portrait ? 0 : 110, right: portrait ? 0 : undefined, top: portrait ? 130 : 380, display: "flex", flexDirection: "column", alignItems: portrait ? "center" : "flex-start", gap: 16 }}>
        <Kicker delay={4} size={28}>Côté</Kicker>
        <WordsUp text="douceurs" italicWords={["douceurs"]} delay={8} style={{ ...H, fontSize: portrait ? 110 : 140 }} />
        {!portrait ? (
          <div style={{ fontFamily: SANS, fontSize: 32, color: "rgba(255,255,255,.7)", maxWidth: 520, lineHeight: 1.4, marginTop: 10 }}>
            Pour les goûters, buffets et petits-déjeuners.
          </div>
        ) : null}
      </div>
      {SWEETS.map((s, i) => (
        <PhotoCard
          key={s.src}
          src={s.src}
          label={s.label}
          w={tw}
          h={th}
          delay={s.at}
          from={i % 2 ? "right" : "bottom"}
          rotate={i % 2 ? 1.5 : -1.5}
          style={{ left: ox + (i % cols) * (tw + gap), top: oy + Math.floor(i / cols) * (th + gap) }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 6. Salé ---------- */
const Item: React.FC<{ children: React.ReactNode; at: number; size: number }> = ({ children, at, size }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: p, translate: `${(1 - p) * -60}px 0` }}>
      <span style={{ width: 16, height: 16, rotate: "45deg", background: C.gold, scale: `${p}` }} />
      <span style={{ fontFamily: DISPLAY, fontSize: size, color: "#fff", fontStyle: "italic" }}>{children}</span>
    </div>
  );
};
export const SceneSale: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const s = useSpr(6, 13);
  const D = portrait ? 680 : 780;
  const badge = useSpr(108, 9);
  return (
    <AbsoluteFill>
      <RoyalBg tint="#5a2f6e" />
      <div
        style={{
          position: "absolute",
          width: D,
          height: D,
          left: portrait ? (1080 - D) / 2 : 1000,
          top: portrait ? 590 : 150,
          borderRadius: "50%",
          overflow: "hidden",
          border: `8px solid ${C.goldHi}`,
          boxShadow: `0 0 0 22px rgba(200,163,91,.15), 0 60px 120px -40px #000`,
          scale: `${0.4 + 0.6 * s}`,
          rotate: `${(1 - s) * -60 + frame * 0.08}deg`,
        }}
      >
        <Img src={staticFile("img/pizza.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: "1.15" }} />
      </div>
      <div style={{ position: "absolute", left: portrait ? 110 : 140, top: portrait ? 120 : 250, display: "flex", flexDirection: "column", gap: 18 }}>
        <Kicker delay={2} size={28}>Sans oublier</Kicker>
        <WordsUp text="le salé" italicWords={["salé"]} delay={8} style={{ ...H, fontSize: portrait ? 110 : 140, justifyContent: "flex-start" }} />
        <div style={{ display: "flex", flexDirection: portrait ? "row" : "column", flexWrap: "wrap", gap: portrait ? "10px 40px" : 14, marginTop: 10 }}>
          <Item at={62} size={portrait ? 54 : 64}>Pizzas</Item>
          <Item at={92} size={portrait ? 54 : 64}>Nems</Item>
          <Item at={110} size={portrait ? 54 : 64}>Samoussas</Item>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: portrait ? 700 : 1560,
          top: portrait ? 560 : 170,
          width: 230,
          height: 230,
          borderRadius: "50%",
          background: C.gold,
          color: C.ink,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          fontFamily: DISPLAY,
          fontStyle: "italic",
          fontSize: 38,
          lineHeight: 1.05,
          scale: `${badge}`,
          rotate: `${-12 + (1 - badge) * 90}deg`,
          boxShadow: "0 20px 40px -10px rgba(0,0,0,.5)",
        }}
      >
        Livrées
        <br />
        chaudes !
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7. Services ---------- */
const ICONS: Record<string, string> = {
  traiteur: "M12 3c1.2 0 2 .9 2 2 0 .7-.4 1.3-1 1.7V8h5a2 2 0 0 1 2 2v2H4v-2a2 2 0 0 1 2-2h5V6.7A2 2 0 0 1 12 3ZM4 14h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z",
  livraison: "M5 17a2 2 0 1 0 0 .1V17Zm14 0a2 2 0 1 0 0 .1V17ZM3 6h10v8H3V6Zm10 3h4l3 3v2h-7V9ZM5 15a3 3 0 0 1 5.8 0h2.4a3 3 0 0 1 5.8 0H21v1h-2.2a3 3 0 0 0-5.6 0h-2.4a3 3 0 0 0-5.6 0H3v-1h2Z",
  resa: "M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v10H5V10Zm2 2v2h2v-2H7Zm4 0v2h2v-2h-2Z",
  formation: "M12 3 1 9l11 6 9-4.9V17h2V9L12 3Zm-6 9.8V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.2l-6 3.2-6-3.2Z",
};
const SERVICES = [
  { ico: "traiteur", t: "Traiteur", d: "Mariages, baptêmes, anniversaires, séminaires", at: 14 },
  { ico: "livraison", t: "Livraison", d: "Dans toute la ville de Ngaoundéré", at: 104 },
  { ico: "resa", t: "Réservation", d: "À l'avance, avec un acompte", at: 152 },
  { ico: "formation", t: "Formations", d: "Apprenez la pâtisserie avec nous", at: 196 },
];
const ServiceCard: React.FC<{ s: (typeof SERVICES)[number]; w: number; h: number; x: number; y: number }> = ({ s, w, h, x, y }) => {
  const frame = useCurrentFrame();
  const p = useSpr(s.at, 12);
  const glow = interpolate(frame, [s.at, s.at + 10, s.at + 40], [0, 1, 0.25], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 30,
        padding: 40,
        background: "linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04))",
        border: "1px solid rgba(201,184,243,.35)",
        boxShadow: `0 30px 60px -30px #000, 0 0 ${60 * glow}px rgba(200,163,91,${0.6 * glow})`,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        opacity: Math.min(1, p * 1.5),
        translate: `0 ${(1 - p) * 120}px`,
        rotate: `${(1 - p) * 8}deg`,
      }}
    >
      <div style={{ width: 96, height: 96, borderRadius: 26, background: `linear-gradient(135deg, ${C.gold}, ${C.goldHi})`, display: "grid", placeItems: "center", rotate: `${(1 - p) * -120}deg` }}>
        <svg viewBox="0 0 24 24" width={54} height={54}>
          <path d={ICONS[s.ico]} fill={C.ink} />
        </svg>
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 58, color: "#fff", fontStyle: "italic" }}>{s.t}</div>
      <div style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.35, color: "rgba(255,255,255,.78)" }}>{s.d}</div>
    </div>
  );
};
export const SceneServices: React.FC = () => {
  const { portrait } = useLayout();
  const w = portrait ? 455 : 405, h = portrait ? 400 : 410;
  return (
    <AbsoluteFill>
      <RoyalBg tint="#24307a" />
      <div style={{ position: "absolute", top: portrait ? 120 : 130, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Kicker delay={0} size={28}>Nos services</Kicker>
        <WordsUp text="Bien plus qu'une pâtisserie" italicWords={["pâtisserie"]} delay={4} stagger={4} style={{ ...H, fontSize: portrait ? 76 : 92, maxWidth: portrait ? 940 : 1700 }} />
      </div>
      {SERVICES.map((s, i) => (
        <ServiceCard
          key={s.ico}
          s={s}
          w={w}
          h={h}
          x={portrait ? 64 + (i % 2) * (w + 42) : 103 + i * (w + 30)}
          y={portrait ? 400 + Math.floor(i / 2) * (h + 36) : 430}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 8. TikTok ---------- */
const Counter: React.FC<{ to: number; dec?: number; suf: string; label: string; at: number }> = ({ to, dec = 0, suf, label, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 50], [0, 1], { ...clamp, easing: EASE_OUT });
  const s = useSpr(at, 12);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, scale: `${0.6 + 0.4 * s}`, opacity: Math.min(1, s * 1.5) }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 150, color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {(to * p).toFixed(dec).replace(".", ",")}
        <span style={{ color: C.goldHi, fontStyle: "italic" }}>{suf}</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 32, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>{label}</div>
    </div>
  );
};
export const SceneTiktok: React.FC = () => {
  const { portrait } = useLayout();
  const tag = useSpr(40, 12);
  return (
    <AbsoluteFill>
      <RoyalBg tint="#3a1f6e" />
      <Center style={{ flexDirection: "column", gap: portrait ? 40 : 60 }}>
        <Kicker delay={0} size={28}>Ils nous font confiance</Kicker>
        <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 34 : 110 }}>
          <Counter to={17.1} dec={1} suf="K" label="abonnés TikTok" at={8} />
          <Counter to={151} suf="K" label="j'aime" at={20} />
          <Counter to={127} suf="K" label="vues sur une vidéo" at={32} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 36px", borderRadius: 999, background: "#fff", color: C.ink, fontFamily: SANS, fontWeight: 700, fontSize: 40, scale: `${tag}` }}>
          <svg viewBox="0 0 24 24" width={44} height={44}>
            <path fill={C.ink} d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5Z" />
          </svg>
          @aroyal_pastry
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ---------- 9. Commander en 4 étapes ---------- */
const STEPS = [
  { n: "01", t: "Choisissez", d: "Une pâtisserie ou votre inspiration", at: 52 },
  { n: "02", t: "Écrivez-nous", d: "Sur WhatsApp : date, occasion, parts", at: 78 },
  { n: "03", t: "Réservez", d: "Devis validé, acompte versé", at: 126 },
  { n: "04", t: "Savourez !", d: "Livraison ou retrait sur place", at: 160 },
];
export const SceneEtapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const line = interpolate(frame, [52, 175], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <AbsoluteFill>
      <RoyalBg tint="#2d3aa8" />
      <div style={{ position: "absolute", top: portrait ? 120 : 140, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Kicker delay={0} size={28}>Commander</Kicker>
        <WordsUp text="Simple comme un message" italicWords={["un", "message"]} delay={4} style={{ ...H, fontSize: portrait ? 80 : 96 }} />
      </div>
      {portrait ? (
        <div style={{ position: "absolute", left: 140, top: 400, width: 4, height: 800 * line, background: C.gold, borderRadius: 4 }} />
      ) : (
        <div style={{ position: "absolute", left: 194, top: 482, height: 4, width: 1350 * line, background: C.gold, borderRadius: 4 }} />
      )}
      {STEPS.map((s, i) => {
        const p = interpolate(frame, [s.at, s.at + 16], [0, 1], { ...clamp, easing: EASE_OUT });
        const pop = 1 + 0.25 * Math.max(0, Math.sin(Math.min(1, (frame - s.at) / 14) * Math.PI)) * (frame > s.at ? 1 : 0);
        const x = portrait ? 80 : 130 + i * 450;
        const y = portrait ? 380 + i * 215 : 420;
        return (
          <div key={s.n} style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: portrait ? "row" : "column", alignItems: portrait ? "center" : "flex-start", gap: portrait ? 40 : 26, opacity: p }}>
            <div style={{ width: 128, height: 128, flex: "none", borderRadius: "50%", background: i === 3 ? C.gold : C.ink, border: `4px solid ${C.gold}`, display: "grid", placeItems: "center", color: i === 3 ? C.ink : C.goldHi, fontFamily: DISPLAY, fontSize: 52, scale: `${p * pop}` }}>
              {s.n}
            </div>
            <div style={{ translate: `0 ${(1 - p) * 30}px` }}>
              <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 60, color: "#fff" }}>{s.t}</div>
              <div style={{ fontFamily: SANS, fontSize: 30, color: "rgba(255,255,255,.75)", maxWidth: 380, lineHeight: 1.35, marginTop: 6 }}>{s.d}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 10. Prix + localisation ---------- */
const MapPanel: React.FC<{ w: number; h: number; x: number; y: number }> = ({ w, h, x, y }) => {
  const frame = useCurrentFrame();
  const appear = useSpr(96, 14);
  const draw = interpolate(frame, [100, 150], [0, 1], { ...clamp, easing: EASE_OUT });
  const pin = useSpr(122, 8);
  const ripple = ((frame - 135) % 40) / 40;
  const cx = w * 0.56, cy = h * 0.5;
  const roads = [
    `M0 ${h * 0.62} C ${w * 0.3} ${h * 0.55}, ${w * 0.6} ${h * 0.7}, ${w} ${h * 0.58}`,
    `M${w * 0.3} 0 C ${w * 0.38} ${h * 0.4}, ${w * 0.5} ${h * 0.6}, ${w * 0.46} ${h}`,
    `M${w * 0.7} 0 L ${w * 0.62} ${h}`,
    `M0 ${h * 0.25} L ${w} ${h * 0.32}`,
    `M0 ${h * 0.85} L ${w} ${h * 0.9}`,
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 36, overflow: "hidden", background: "#e9e4f6", boxShadow: "0 40px 80px -30px #000", scale: `${0.85 + 0.15 * appear}`, opacity: appear }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {new Array(12).fill(0).map((_, i) => (
          <rect key={i} x={(i % 4) * (w / 4) + 18} y={Math.floor(i / 4) * (h / 3) + 18} width={w / 4 - 36} height={h / 3 - 36} rx={14} fill="#d9d1ef" opacity={0.7} />
        ))}
        {roads.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={i < 2 ? 26 : 16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        ))}
        <path d={roads[0]} fill="none" stroke={C.gold} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      </svg>
      {frame > 135 ? (
        <div style={{ position: "absolute", left: cx - 90, top: cy - 90, width: 180, height: 180, borderRadius: "50%", border: `4px solid ${C.violet}`, scale: `${0.2 + ripple}`, opacity: 1 - ripple }} />
      ) : null}
      <div style={{ position: "absolute", left: cx - 50, top: cy - 120, width: 100, height: 120, translate: `0 ${(1 - pin) * -300}px` }}>
        <svg viewBox="0 0 24 30" width={100} height={120}>
          <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 30 12 30s12-9.2 12-18.1C24 5.3 18.6 0 12 0Z" fill={C.violet} />
          <circle cx={12} cy={11.5} r={5} fill="#fff" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: cx - 150, top: cy + 22, width: 300, textAlign: "center", padding: "10px 18px", borderRadius: 14, background: C.ink, color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 24, opacity: pin, whiteSpace: "nowrap" }}>
        Pharmacie du Campus
      </div>
    </div>
  );
};
export const SceneContact: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const price = useSpr(14, 10);
  const addr = interpolate(frame, [128, 150], [0, 1], { ...clamp, easing: EASE_OUT });
  const chip = useSpr(175, 12);
  const amount = Math.round(interpolate(frame, [20, 70], [0, 8000], { ...clamp, easing: EASE_OUT }) / 100) * 100;
  return (
    <AbsoluteFill>
      <RoyalBg tint="#2b2f86" />
      <div style={{ position: "absolute", left: portrait ? 0 : 120, right: portrait ? 0 : undefined, top: portrait ? 110 : 170, display: "flex", flexDirection: "column", alignItems: portrait ? "center" : "flex-start", gap: 14, textAlign: portrait ? "center" : "left" }}>
        <Kicker delay={4} size={28}>À partir de</Kicker>
        <div style={{ fontFamily: DISPLAY, color: "#fff", fontSize: portrait ? 130 : 150, lineHeight: 1, scale: `${0.7 + 0.3 * price}`, opacity: price, transformOrigin: portrait ? "center" : "left" }}>
          {amount.toLocaleString("fr-FR").replace(/ | /g, " ")} <em style={{ color: C.goldHi, fontSize: "0.5em" }}>FCFA</em>
        </div>
        <div style={{ marginTop: portrait ? 0 : 60, opacity: addr, translate: `0 ${(1 - addr) * 40}px`, display: portrait ? "none" : "block" }}>
          <div style={{ fontFamily: SANS, fontSize: 28, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold }}>Retrouvez-nous</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 62, color: "#fff", lineHeight: 1.15, marginTop: 10 }}>
            Bini, <em style={{ color: C.lav }}>près de la</em>
            <br />
            Pharmacie du Campus
          </div>
          <div style={{ fontFamily: SANS, fontSize: 34, color: "rgba(255,255,255,.75)", marginTop: 10 }}>Ngaoundéré · Cameroun</div>
        </div>
      </div>
      {portrait ? (
        <>
          <MapPanel w={940} h={560} x={70} y={420} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", opacity: addr, translate: `0 ${(1 - addr) * 40}px` }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 54, color: "#fff", lineHeight: 1.15 }}>
              Bini, <em style={{ color: C.lav }}>près de la</em> Pharmacie du Campus
            </div>
            <div style={{ fontFamily: SANS, fontSize: 32, color: "rgba(255,255,255,.75)", marginTop: 8 }}>Ngaoundéré · Cameroun</div>
          </div>
        </>
      ) : (
        <MapPanel w={760} h={760} x={1040} y={160} />
      )}
      <div style={{ position: "absolute", left: portrait ? 230 : 120, top: portrait ? 1210 : 840, padding: "16px 30px", borderRadius: 999, background: C.gold, color: C.ink, fontFamily: SANS, fontWeight: 700, fontSize: 32, scale: `${chip}`, transformOrigin: "left" }}>
        🛵 Livraison dans toute la ville
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 11. Final : appel à l'action ---------- */
const GROUPS = [
  { g: "6", at: 32 },
  { g: "98", at: 52 },
  { g: "65", at: 76 },
  { g: "88", at: 98 },
  { g: "85", at: 120 },
];
export const SceneFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const logo = useSpr(0, 12);
  const slogan = interpolate(frame, [150, 175], [0, 1], { ...clamp, easing: EASE_OUT });
  const pills = useSpr(135, 12);
  return (
    <AbsoluteFill>
      <RoyalBg tint="#3b2f9a" />
      <Center style={{ flexDirection: "column", gap: portrait ? 30 : 22 }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", overflow: "hidden", border: `5px solid ${C.gold}`, scale: `${logo}`, rotate: `${(1 - logo) * -180}deg`, position: "relative" }}>
          <Img src={staticFile("img/emblem.png")} style={{ width: "100%", height: "100%" }} />
          <Shine start={150} dur={30} />
        </div>
        <Kicker delay={6} size={30}>Commandez maintenant</Kicker>
        <div style={{ display: "flex", gap: 30, fontFamily: DISPLAY, fontSize: portrait ? 136 : 170, color: "#fff", lineHeight: 1 }}>
          {GROUPS.map(({ g, at }) => {
            const s = sprAt(frame, at);
            return (
              <span key={g + at} style={{ display: "inline-block", translate: `0 ${(1 - s) * 80}px`, opacity: Math.min(1, s * 1.6), color: at === 32 ? C.goldHi : "#fff" }}>
                {g}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, scale: `${pills}`, marginTop: 6 }}>
          <div style={{ padding: "16px 32px", borderRadius: 999, background: "#25d366", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 34 }}>WhatsApp & appel</div>
          <div style={{ padding: "16px 32px", borderRadius: 999, background: "#fff", color: C.ink, fontFamily: SANS, fontWeight: 700, fontSize: 34 }}>TikTok @aroyal_pastry</div>
        </div>
        <div style={{ marginTop: portrait ? 40 : 26, opacity: slogan, translate: `0 ${(1 - slogan) * 30}px`, textAlign: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: portrait ? 64 : 70, color: C.lav }}>La gourmandise au rendez-vous !</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.2em", color: C.gold, marginTop: 12 }}>#ROYALEMENTVÔTRE</div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};
