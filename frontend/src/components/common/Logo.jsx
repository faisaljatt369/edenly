/**
 * Logo – renders the Edenly brand logo from the actual SVG asset.
 *
 * Props:
 *   size      – height in px (default 36)
 *   light     – true = white version for dark backgrounds (inverts the mark)
 *   showText  – legacy prop kept for back-compat; SVG already includes wordmark
 */
const Logo = ({ size = 36, light = false, showText = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none', flexShrink: 0 }}>
    <img
      src="/logo.svg"
      alt="Edenly"
      style={{
        height: size,
        width: 'auto',
        display: 'block',
        filter: light ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  </div>
);

export default Logo;
