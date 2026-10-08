import { prompts } from "./acervo.js";
const el = (id) => document.getElementById(id);
const category = el("category");
let pile = [];
let used = [];
let starred = [];
let active = "";
for (const [name, list] of Object.entries(prompts)) {
 const option = document.createElement("option");
 option.value = name;
 option.textContent = name + " (" + list.length + ")";
 category.append(option);
}
function mix(list) {
 const shuffled = [...list];
 for (let index = shuffled.length - 1; index > 0; index--) {
  const pick = Math.floor(Math.random() * (index + 1));
  [shuffled[index], shuffled[pick]] = [shuffled[pick], shuffled[index]];
 }
 return shuffled;
}
function drawList(id, values) {
 const target = el(id);
 target.replaceChildren();
 for (const phrase of [...values].reverse()) {
  const item = document.createElement("li");
  item.textContent = phrase;
  target.append(item);
 }
}
function paint() {
 el("progress").textContent = used.length + " de " + prompts[category.value].length + " reflexões exploradas neste tema.";
 el("history-count").textContent = "(" + used.length + ")";
 el("favorite-count").textContent = "(" + starred.length + ")";
 el("draw-card-btn").textContent = pile.length ? "Continuar refletindo" : "Recomeçar percurso";
 drawList("history-list", used);
 drawList("favorites-list", starred);
}
function reset() {
 pile = mix(prompts[category.value]);
 used = [];
 active = "";
 el("card-text").textContent = "Seu próximo momento de reflexão começa aqui.";
 el("card-category").textContent = category.value;
 el("favorite-btn").disabled = true;
 el("favorite-btn").textContent = "☆ Quero revisitar";
 paint();
}
el("draw-card-btn").addEventListener("click", () => {
 if (!pile.length) pile = mix(prompts[category.value]);
 active = pile.pop();
 used.push(active);
 el("card-text").textContent = active;
 el("card-category").textContent = category.value;
 el("favorite-btn").disabled = false;
 el("favorite-btn").textContent = starred.includes(active) ? "★ Para revisitar" : "☆ Quero revisitar";
 paint();
 el("card").focus();
});
el("favorite-btn").addEventListener("click", () => {
 if (!active) return;
 starred = starred.includes(active) ? starred.filter(value => value !== active) : [...starred, active];
 el("favorite-btn").textContent = starred.includes(active) ? "★ Para revisitar" : "☆ Quero revisitar";
 paint();
});
category.addEventListener("change", reset);
el("restart-btn").addEventListener("click", reset);
reset();
