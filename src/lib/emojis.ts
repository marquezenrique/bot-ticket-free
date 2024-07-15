import { formatEmoji } from "discord.js";
import { settings } from "#settings";

type EmojiList = typeof settings.emojis;
type EmojiKey = keyof EmojiList;
type IconInfo = { id: string; animated: boolean; toString(): string };
type Icon = Record<EmojiKey, IconInfo>;

const icon: Icon = Object.create({});

for (const [name, id] of Object.entries(settings.emojis)) {
  const data = { id, animated: false, toString: () => formatEmoji(id, false) };
  Object.assign(icon, { [name]: data });
}

export { icon };
