export function readCommands() {
  const textarea = document.querySelector("#editor textarea");
  return parseCommands(textarea.value);
}

function parseCommands(text) {
  return text.split("\n").map(parseLine).filter((cmd) => cmd !== null);
}

function parseLine(line) {
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

function parseTranslate(str) {
  const match = str.match(/t\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function parseRotate(str) {
  const match = str.match(/r\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2])];
}
