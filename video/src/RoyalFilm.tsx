// Montage du film : scènes enchaînées par des transitions, voix off, musique et bruitages.
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { Bug, FilmFinish, GoldDust } from "./kit";
import {
  SceneContact,
  SceneDouceurs,
  SceneEtapes,
  SceneFinal,
  SceneGateaux,
  SceneIntro,
  SceneMaison,
  SceneSale,
  SceneServices,
  SceneTiktok,
  SceneTrompe,
} from "./Scenes";

// Durée de chaque scène (images à 30 i/s) = attente + voix off + respiration.
export const TRANSITION = 18;
export const SCENES = [
  { id: "intro", C: SceneIntro, voice: "01-intro", dur: 191, voiceAt: 30 },
  { id: "maison", C: SceneMaison, voice: "02-maison", dur: 213, voiceAt: 10 },
  { id: "gateaux", C: SceneGateaux, voice: "03-gateaux", dur: 256, voiceAt: 10 },
  { id: "trompe", C: SceneTrompe, voice: "04-trompe", dur: 254, voiceAt: 10 },
  { id: "douceurs", C: SceneDouceurs, voice: "05-douceurs", dur: 189, voiceAt: 10 },
  { id: "sale", C: SceneSale, voice: "06-sale", dur: 162, voiceAt: 10 },
  { id: "services", C: SceneServices, voice: "07-services", dur: 255, voiceAt: 10 },
  { id: "tiktok", C: SceneTiktok, voice: "08-tiktok", dur: 122, voiceAt: 10 },
  { id: "etapes", C: SceneEtapes, voice: "09-etapes", dur: 210, voiceAt: 10 },
  { id: "contact", C: SceneContact, voice: "10-contact", dur: 242, voiceAt: 10 },
  { id: "final", C: SceneFinal, voice: "11-final", dur: 320, voiceAt: 10 },
] as const;
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0) - TRANSITION * (SCENES.length - 1);

const PRESENTATIONS = [
  () => wipe({ direction: "from-left" }),
  () => slide({ direction: "from-right" }),
  () => fade(),
  () => slide({ direction: "from-bottom" }),
  () => wipe({ direction: "from-top-left" }),
  () => slide({ direction: "from-left" }),
  "clock",
  () => slide({ direction: "from-right" }),
  () => wipe({ direction: "from-right" }),
  () => fade(),
] as const;

const Music: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <Audio
      src={staticFile("music.wav")}
      volume={interpolate(frame, [0, 20, 34, durationInFrames - 75, durationInFrames - 45, durationInFrames - 1], [0, 0.6, 0.2, 0.2, 0.5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    />
  );
};

export const RoyalFilm: React.FC = () => {
  const { width, height } = useVideoConfig();
  const timing = springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1133" }}>
      <TransitionSeries>
        {SCENES.flatMap((s, i) => {
          const Scene = s.C;
          const items = [
            <TransitionSeries.Sequence key={s.id} name={s.id} durationInFrames={s.dur}>
              <Scene />
              <Audio from={s.voiceAt} src={staticFile(`voice/${s.voice}.mp3`)} />
              {i > 0 ? <Audio src={staticFile("sfx/whoosh.wav")} volume={0.3} /> : null}
              {s.id === "final" ? <Audio from={140} src={staticFile("sfx/ding.wav")} volume={0.25} /> : null}
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            const p = PRESENTATIONS[i];
            items.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                presentation={(p === "clock" ? clockWipe({ width, height }) : p()) as any}
                timing={timing}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      <GoldDust />
      <FilmFinish />
      <Sequence from={SCENES[0].dur} durationInFrames={TOTAL - SCENES[0].dur - SCENES[SCENES.length - 1].dur + TRANSITION} name="Logo">
        <Bug />
      </Sequence>
      <Music />
    </AbsoluteFill>
  );
};
