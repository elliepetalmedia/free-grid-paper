// Shared generator constants, used by both the canvas preview in
// pages/home.tsx and the vector PDF renderers in pdf-renderers.ts,
// so the two renderers cannot drift apart on the same value.

// Coordinate plane printable margin, in millimetres. Axes,
// arrowheads, grid lines, and labels stop this far inside the page
// edge, so an ordinary printer at Actual Size does not clip them.
// 6 mm sits inside the 5 to 8 mm range ordinary printers need.
export const COORDINATE_PLANE_MARGIN_MM = 6;
