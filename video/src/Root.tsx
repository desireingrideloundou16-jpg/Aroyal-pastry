import { Composition } from "remotion";
import { RoyalFilm, TOTAL } from "./RoyalFilm";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="RoyalFilm" component={RoyalFilm} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
      <Composition id="RoyalFilmPortrait" component={RoyalFilm} durationInFrames={TOTAL} fps={30} width={1080} height={1350} />
    </>
  );
};
