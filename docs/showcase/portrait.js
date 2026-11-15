const scene = document.querySelector(".scene");
const stage = scene.querySelector(".stage");
const cue = scene.querySelector(".scroll-cue");
const award = scene.querySelector(".award-frame");
const certificate = document.querySelector(".certificate");
const certificateButton = award.querySelector(".certificate-open");
const agent = scene.querySelector(".agent-frame");
const forum = scene.querySelector(".forum-frame");
const flowSteps = [...forum.querySelectorAll(".view-flow li")];
const demo = document.querySelector(".demo-dialog");
const demoButton = agent.querySelector(".demo-open");
const demoVideo = demo.querySelector("video");
const immersiveLayout = matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");

let frame = 0;

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function between(progress, start, end) {
  return clamp((progress - start) / (end - start));
}

function ease(progress) {
  return progress * progress * (3 - 2 * progress);
}

function render() {
  frame = 0;
  const scroll = -scene.getBoundingClientRect().top / stage.offsetHeight;
  const progress = clamp(scroll / 1.76);
  const reveal = between(progress, 0, 0.42);
  const pan = ease(between(progress, 0.49, 0.8));
  const name = ease(between(progress, 0.56, 0.77));
  const summary = ease(between(progress, 0.73, 0.88));
  const brightness = clamp(reveal / 0.25);
  const spread = reveal ** 1.72;
  const cueZoom = between(progress, 0, 0.14);
  const cueFade = between(progress, 0, 0.40);
  const cueScale = 1 + 0.55 * (1 - (1 - cueZoom) ** 2);

  scene.style.setProperty("--portrait-opacity", brightness);
  scene.style.setProperty("--light-width", `${16 + 162 * spread}%`);
  scene.style.setProperty("--light-height", `${8 + 174 * spread}%`);
  scene.style.setProperty("--portrait-scale", 1 + 0.035 * reveal);
  scene.style.setProperty("--portrait-rise", 1 - ease(reveal));
  scene.style.setProperty("--portrait-pan", pan);
  scene.style.setProperty("--name-opacity", name);
  scene.style.setProperty("--name-offset", `${12 * (1 - name)}px`);
  scene.style.setProperty("--summary-opacity", summary);
  scene.style.setProperty("--cue-opacity", 1 - cueFade);
  scene.style.setProperty("--cue-scale", cueScale);
  cue.classList.toggle("is-hidden", cueFade === 1);
  scene.style.setProperty("--intro-scene-opacity", 1 - ease(between(scroll, 1.77, 2.13)));
  renderAward(scroll);
  renderProjects(scroll);
}

function renderAward(scroll) {
  const walk = ease(between(scroll, 2.08, 3.02));
  const eye = ease(between(walk, 0.06, 0.24));
  const light = ease(between(walk, 0.44, 0.91));
  const copy = ease(between(scroll, 3.04, 3.32));
  const exit = ease(between(scroll, 3.68, 4.25));
  const step = Math.sin((walk + exit) * Math.PI * 4);
  const stride = step * 23;

  award.style.setProperty("--award-scene-opacity", ease(between(scroll, 2.02, 2.32)) * (1 - exit));
  award.style.setProperty("--robot-position", `${113 - 78 * walk - 47 * exit}%`);
  award.style.setProperty("--robot-light", light);
  award.style.setProperty("--eye-light", eye);
  award.style.setProperty("--stride", `${stride}deg`);
  award.style.setProperty("--bob", `${-Math.abs(step) * 4}px`);
  award.style.setProperty("--award-copy-opacity", copy);
  award.style.setProperty("--award-copy-offset", `${12 * (1 - copy)}px`);
  award.inert = copy < 0.95 || exit > 0.25;
}

function renderProjects(scroll) {
  const screen = ease(between(scroll, 4.08, 4.52));
  const agentExit = ease(between(scroll, 5.04, 5.38));
  const agentCopy = ease(between(scroll, 4.34, 4.69));
  const forumLight = ease(between(scroll, 5.32, 5.57));
  const forumCopy = ease(between(scroll, 5.71, 6.02));

  renderProject(agent, screen * (1 - agentExit), agentCopy, .955 + .045 * screen);
  renderProject(forum, forumLight, forumCopy, .98 + .02 * forumLight);

  flowSteps.forEach((step, index) => {
    const start = 5.45 + index * 0.17;
    const light = ease(between(scroll, start, start + 0.20));
    step.style.setProperty("--step-light", 0.16 + 0.84 * light);
  });
}

function renderProject(project, light, copy, scale) {
  project.style.setProperty("--project-light", light);
  project.style.setProperty("--copy-light", copy);
  project.style.setProperty("--copy-offset", `${12 * (1 - copy)}px`);
  project.style.setProperty("--visual-scale", scale);
  project.inert = light < 0.85 || copy < 0.95;
}

function scheduleRender() {
  if (immersiveLayout.matches && !frame) {
    frame = requestAnimationFrame(render);
  }
}

function applyLayoutPreference() {
  scene.classList.toggle("is-interactive", immersiveLayout.matches);
  if (!immersiveLayout.matches) {
    award.inert = false;
    agent.inert = false;
    forum.inert = false;
    flowSteps.forEach(step => step.style.removeProperty("--step-light"));
  }
  scheduleRender();
}

addEventListener("scroll", scheduleRender, { passive: true });
addEventListener("resize", scheduleRender);
immersiveLayout.addEventListener("change", applyLayoutPreference);
certificateButton.hidden = false;
certificateButton.addEventListener("click", () => certificate.showModal());
demoButton.hidden = false;
demoButton.addEventListener("click", () => {
  demo.showModal();
  demoVideo.play().catch(() => {
    // Native video controls remain available if autoplay is denied.
  });
});
demo.addEventListener("close", () => demoVideo.pause());
applyLayoutPreference();
