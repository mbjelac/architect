import type { SubpanelState } from "./editorPanel";
import { createSlider, updateFunctionOnLine } from "./editorWidgets";

const SCALE_REGEX = /s\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+\s*\)/;

export function addScaleSliders(
  el: HTMLElement,
  state: SubpanelState,
  subpanels: SubpanelState[],
) {
  const group = document.createElement("div");
  group.className = "slider-group";

  const label = document.createElement("span");
  label.className = "slider-letter";
  label.textContent = "S";
  group.appendChild(label);

  const slidersCol = document.createElement("div");
  slidersCol.className = "sliders-col";

  const sliders = [
    createSliderWithReset(1, 200, 100),
    createSliderWithReset(1, 200, 100),
    createSliderWithReset(1, 200, 100),
  ];

  for (const { row } of sliders) {
    slidersCol.appendChild(row);
  }

  group.appendChild(slidersCol);
  el.appendChild(group);

  const update = () => {
    state.scaleX = parseInt(sliders[0].slider.value);
    state.scaleY = parseInt(sliders[1].slider.value);
    state.scaleZ = parseInt(sliders[2].slider.value);
    updateFunctionOnLine(
      subpanels,
      state,
      SCALE_REGEX,
      `s(${state.scaleX},${state.scaleY},${state.scaleZ})`,
    );
  };

  for (const { slider } of sliders) {
    slider.addEventListener("input", update);
  }
}

function createSliderWithReset(
  min: number,
  max: number,
  value: number,
): { row: HTMLElement; slider: HTMLInputElement } {
  const row = document.createElement("div");
  row.className = "slider-row";

  const slider = createSlider(min, max, value);
  row.appendChild(slider);

  const resetBtn = document.createElement("button");
  resetBtn.className = "reset-btn";
  resetBtn.textContent = "⛌";
  resetBtn.addEventListener("click", () => {
    slider.value = String(100);
    slider.dispatchEvent(new Event("input", { bubbles: true }));
  });
  row.appendChild(resetBtn);

  return { row, slider };
}
