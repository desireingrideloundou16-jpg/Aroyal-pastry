// Génère la voix off scène par scène.
// Usage : node gen.mjs <dossier_sortie> [voix] [--list]
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "node:fs";
import path from "node:path";

const [outDir, voice = "fr-FR-VivienneMultilingualNeural"] = process.argv.slice(2);

if (process.argv.includes("--list")) {
  const tts = new MsEdgeTTS();
  const v = await tts.getVoices();
  console.log(v.filter(x => x.Locale.startsWith("fr")).map(x => `${x.ShortName} ${x.Gender}`).join("\n"));
  process.exit(0);
}

// Texte écrit pour l'oreille : « A Royal » pour la prononciation, numéros en toutes lettres.
const LINES = {
  "01-intro": "Bienvenue chez A Royal Pastry. L'art de la gourmandise… servi royalement.",
  "02-maison": "Née à Ngaoundéré, notre pâtisserie artisanale prépare chaque création à la main, à la commande, avec passion.",
  "03-gateaux": "Layer cakes élégants, drip cakes au chocolat, number cakes, gâteaux à message ou d'anniversaire : des gâteaux sur mesure, pour toutes vos fêtes.",
  "04-trompe": "Et nos trompe-l'œil ! Citron, orange, pomme, coco, cacahuète… Ça a l'air vrai ? C'est un dessert !",
  "05-douceurs": "Côté douceurs : cupcakes, muffins, cakes marbrés, crêpes fines et pancakes bien moelleux.",
  "06-sale": "Sans oublier le salé : des pizzas généreuses, des nems et des samoussas croustillants.",
  "07-services": "Traiteur pour vos mariages, baptêmes et anniversaires, livraison dans toute la ville, réservation avec acompte… et même des formations en pâtisserie.",
  "08-tiktok": "Plus de dix-sept mille abonnés nous suivent déjà sur TikTok !",
  "09-etapes": "Commander, c'est simple : choisissez, écrivez-nous sur WhatsApp, réservez… et savourez !",
  "10-contact": "Nos créations commencent à partir de huit mille francs CFA. Retrouvez-nous à Bini, près de la Pharmacie du Campus, à Ngaoundéré.",
  "11-final": "Commandez au six, quatre-vingt-dix-huit, soixante-cinq, quatre-vingt-huit, quatre-vingt-cinq. A Royal Pastry : la gourmandise au rendez-vous !",
};

fs.mkdirSync(outDir, { recursive: true });
for (const [name, text] of Object.entries(LINES)) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const tmp = fs.mkdtempSync(path.join(outDir, ".tmp-"));
  const { audioFilePath } = await tts.toFile(tmp, text, { rate: "+4%", pitch: "+0Hz" });
  fs.renameSync(audioFilePath, path.join(outDir, `${name}.mp3`));
  fs.rmSync(tmp, { recursive: true, force: true });
  tts.close();
  console.log("ok", name);
}
