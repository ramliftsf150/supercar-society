const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function scrollThemeProgress(scrollY: number, documentHeight: number, viewportHeight: number, reducedMotion = false, start = 0.35, end = 0.65) {
  const range = Math.max(0, documentHeight - viewportHeight);
  const progress = range ? clamp(scrollY / range) : 0;
  if (reducedMotion) return progress >= 0.5 ? 1 : 0;
  const transition = clamp((progress - start) / (end - start));
  return transition * transition * (3 - 2 * transition);
}
const mix = (from: number, to: number, progress: number) => Math.round(from + (to - from) * progress);
const luminance = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
export function scrollThemeColors(progress: number) {
  const p = clamp(progress);
  const background = mix(8, 255, p);
  const foreground = mix(245, 20, p);
  const secondary = mix(194, 63, p);
  const bgLuminance = luminance(background);
  const contrast = (channel: number) => {
    const textLuminance = luminance(channel);
    return (Math.max(bgLuminance, textLuminance) + 0.05) / (Math.min(bgLuminance, textLuminance) + 0.05);
  };
  // Inverting continuous foreground/background colors necessarily crosses equal luminance.
  // Add a contrasting glyph outline only through that crossover, not a page overlay.
  const outline = bgLuminance > 0.179 ? '#000' : '#fff';
  const outlineWidth = Math.max(0, Math.min(0.65, (4.5 - Math.min(contrast(foreground), contrast(secondary))) / 3.5 * 0.65));
  return {
    '--theme-progress': String(p),
    '--theme-bg': `rgb(${background} ${background} ${background})`,
    '--theme-text': `rgb(${foreground} ${foreground} ${foreground})`,
    '--theme-secondary': `rgb(${secondary} ${secondary} ${secondary})`,
    '--theme-border': `rgb(${mix(54, 208, p)} ${mix(54, 205, p)} ${mix(54, 197, p)})`,
    '--theme-surface': `rgb(${mix(17, 245, p)} ${mix(17, 243, p)} ${mix(16, 238, p)})`,
    '--theme-gold': `rgb(${mix(199, 112, p)} ${mix(163, 81, p)} ${mix(90, 29, p)})`,
    '--theme-button': `rgb(${mix(199, 235, p)} ${mix(163, 221, p)} ${mix(90, 187, p)})`,
    '--theme-outline': outline,
    '--theme-outline-width': `${outlineWidth.toFixed(3)}px`,
  };
}
