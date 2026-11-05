// Single source of truth for the ERS "Recruit" logo: an office chair inside a
// magnifying lens, held by a hand, with the RECRUIT wordmark drawn as paths
// (no font dependency). Plain JS so both React and scripts/build-logo.mjs use it.
//
// Colours are parameters so the logo follows the theme:
//   orange -> chair, hand, lens highlight
//   ink    -> lens ring and wordmark
//
// Mark: 120 x 70 units. Full lockup (mark + wordmark): 120 x 100 units.

const SW = 4.6 // wordmark stroke weight

const chair = `
  <path d="M13 6C13 1.6 18 .2 22.5 .2S32 1.6 32 6L34 22C34.3 26 31 28.5 28 29H17C14 28.5 10.7 26 11 22Z"/>
  <rect x="20.6" y="28" width="3.8" height="7"/>
  <ellipse cx="22.5" cy="38.5" rx="17" ry="6.2"/>
  <rect x="20.8" y="43" width="3.4" height="24"/>
  <circle cx="22.5" cy="67.3" r="2"/>
  <g fill="none" stroke-width="2.6" stroke-linecap="round">
    <path d="M22.5 56.5C16 56.5 8.5 57.5 3.5 61.5"/>
    <path d="M22.5 56.5C29 56.5 36.5 57.5 41.5 61.5"/>
    <path d="M5.7 24.2C5.2 29 6 33 9 36"/>
    <path d="M39.3 24.2C39.8 29 39 33 36 36"/>
  </g>
  <circle cx="3" cy="62.7" r="2"/>
  <circle cx="42" cy="62.7" r="2"/>
  <rect x="1.5" y="21.5" width="8.5" height="3.2" rx="1.6"/>
  <rect x="35" y="21.5" width="8.5" height="3.2" rx="1.6"/>`

const hand = `<path d="M61 44.5C60.5 41 63 38.5 66.5 38.8C69 36.5 74 34.5 81 34.2C92 33.8 104 37.5 112 44C117 48 118.5 54 115.5 58.5C112.5 63 105 64.5 96 64C88 63.6 81 62.5 75 62C70 61.5 66.5 58 65.5 53.5C64.5 49.5 61.5 48 61 44.5Z"/>`

// Lens handle: visible between the ring and the fist.
const handle = (ink) => `<path d="M53.5 48.8L66 56.5" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`

const wordmark = (ink) => `
  <g fill="${ink}" stroke="${ink}" stroke-width="0">
    <g>
      <rect width="${SW}" height="20"/>
      <path d="M2.3 2.3H9.6a4.7 4.7 0 0 1 0 9.4H2.3" fill="none" stroke-width="${SW}"/>
      <path d="M6.4 11.5H11.6L16 20H10.6Z"/>
    </g>
    <g transform="translate(19 0)">
      <rect width="${SW}" height="20"/><rect width="13" height="${SW}"/>
      <rect y="7.7" width="11" height="${SW}"/><rect y="15.4" width="13" height="${SW}"/>
    </g>
    <g transform="translate(35 0)">
      <path d="M16.2 5.6A7.7 7.7 0 1 0 16.2 14.4" fill="none" stroke-width="${SW}"/>
    </g>
    <g transform="translate(55.5 0)">
      <rect width="${SW}" height="20"/>
      <path d="M2.3 2.3H9.6a4.7 4.7 0 0 1 0 9.4H2.3" fill="none" stroke-width="${SW}"/>
      <path d="M6.4 11.5H11.6L16 20H10.6Z"/>
    </g>
    <g transform="translate(74.5 0)">
      <path d="M2.3 0V11.5a6.2 6.2 0 0 0 12.4 0V0" fill="none" stroke-width="${SW}"/>
    </g>
    <g transform="translate(94.5 0)"><rect width="${SW}" height="20"/></g>
    <g transform="translate(102.1 0)">
      <rect width="15" height="${SW}"/><rect x="5.2" width="4.6" height="20"/>
    </g>
  </g>`

/**
 * @param {object}  o
 * @param {boolean} o.wordmark  include the RECRUIT wordmark under the mark
 * @param {string}  o.orange    fill for chair / hand / highlight
 * @param {string}  o.ink       colour for the lens ring and wordmark
 * @param {string}  o.id        unique prefix for the internal mask id
 * @param {string}  o.className class for the <svg> element
 */
export function logoMarkup({
  wordmark: withWordmark = true,
  orange = '#C23C14',
  ink = '#17151C',
  id = 'ers-logo',
  className = '',
  icon = false,
} = {}) {
  const h = withWordmark ? 100 : 70
  const viewBox = icon ? '0 -1 62 70' : `0 0 120 ${h}`
  const holder = icon ? '' : hand
  const mask = `${id}-knockout`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="ERS Recruit"${className ? ` class="${className}"` : ''}>
  <defs>
    <mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="70">
      <rect width="120" height="70" fill="#fff"/>
      <g fill="#000" stroke="#000" stroke-width="3.2" stroke-linejoin="round">${chair}${holder}</g>
    </mask>
  </defs>
  <circle cx="35" cy="32.5" r="25" fill="none" stroke="${ink}" stroke-width="3.2" mask="url(#${mask})"/>
  <path d="M46.5 17C52.5 28 52 40 45 49" fill="none" stroke="${orange}" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>
  <g fill="${orange}" stroke="${orange}" stroke-width="0">${chair}</g>
  <ellipse cx="22.5" cy="37.6" rx="12" ry="2.6" fill="#fff" fill-opacity=".22"/>
  <path d="M16.5 7C16.5 4.5 18 3.2 20.5 2.8" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/>
${icon ? '' : `  ${handle(ink)}
  <g fill="${orange}">${hand}</g>
  <path d="M62 44C61.5 41.5 63.5 39.6 66 40C69 40.4 73 43 74 46C73 49 68.5 50 65.5 49C63.5 48.4 62.3 46.5 62 44Z" fill="#fff" fill-opacity=".3"/>
  <path d="M80 50C89 46.5 100 48 108 53C111 55 111 58.5 108 59.5C101 60.8 92 60 85 59.4Z" fill="#fff" fill-opacity=".2"/>
  <g fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round">
    <path d="M70 53C72 56 73.5 59 74 62"/><path d="M76 51.5C78 55 79 58.5 79.5 62.3"/><path d="M82.5 50.5C84.5 54 85.5 58 85.8 62.6"/>
  </g>`}${
    withWordmark ? `\n  <g transform="translate(1.45 78)">${wordmark(ink)}</g>` : ''
  }
</svg>
`
}
