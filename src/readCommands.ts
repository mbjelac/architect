export type BodyType = "pyr3";

export interface CreateBody {
  type: BodyType;
  translate: [number, number, number] | null;
  rotate: [number, number] | null;
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
    return {type: "pyr3", translate, rotate};
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
