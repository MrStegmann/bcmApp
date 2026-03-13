export default function getSvgOffset(layout, VB_WIDTH, VB_HEIGHT, halfCourt) {
  const scale = Math.min(
    layout.width / VB_WIDTH,
    layout.height / (halfCourt ? VB_HEIGHT / 2 : VB_HEIGHT),
  );

  const scaledWidth = VB_WIDTH * scale;
  const scaledHeight = (halfCourt ? VB_HEIGHT / 2 : VB_HEIGHT) * scale;

  const offsetX = (layout.width - scaledWidth) / 2;
  const offsetY = (layout.height - scaledHeight) / 2;

  return { offsetX, offsetY, scale };
}
