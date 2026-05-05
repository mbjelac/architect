export type BodyType = "pyr3";

export interface CreateBody {
  type: BodyType;
  translate: [number, number, number] | null;
  rotate: [number, number] | null;
  scale: [number, number, number] | null;
}

export function readCommands(): CreateBody[] {
  const textarea = document.querySelector("#editor textarea") as HTMLTextAreaElement;
  return parseCommands(textarea.value);
}

function parseCommands(text: string): CreateBody[] {
  return text.split("\n").map(parseLine).filter((cmd): cmd is CreateBody => cmd !== null);
}

function parseLine(line: string): CreateBody | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("pyr3")) {
    const rest = trimmed.slice(4).trim();
    const translate = parseTranslate(rest);
    const rotate = parseRotate(rest);
    const scale = parseScale(rest);
    return {type: "pyr3", translate, rotate, scale};
  }

  return null;
}

function parseTranslate(str: string): [number, number, number] | null {
  const match = str.match(/t\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function parseRotate(str: string): [number, number] | null {
  const match = str.match(/r\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2])];
}

function parseScale(str: string): [number, number, number] | null {
  const match3 = str.match(/s\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (match3) {
    return [parseInt(match3[1]), parseInt(match3[2]), parseInt(match3[3])];
  }
  const match1 = str.match(/s\(\s*(-?\d+)\s*\)/);
  if (match1) {
    const v = parseInt(match1[1]);
    return [v, v, v];
  }
  return null;
}
