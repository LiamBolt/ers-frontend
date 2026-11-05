// Regenerates the static logo files in public/ from the single source in
// src/components/brand/logoSvg.js. Run after changing the logo:
//   node scripts/build-logo.mjs
import { writeFileSync } from 'node:fs'
import { logoMarkup } from '../src/components/brand/logoSvg.js'

const colours = { orange: '#C23C14', ink: '#17151C' } // brand primary + ink tokens

writeFileSync('public/logo.svg', logoMarkup({ ...colours, wordmark: true, id: 'ers-logo' }))
writeFileSync('public/logo-mark.svg', logoMarkup({ ...colours, wordmark: false, id: 'ers-mark' }))
writeFileSync('public/favicon.svg', logoMarkup({ ...colours, wordmark: false, icon: true, id: 'ers-fav' }))
console.log('wrote public/logo.svg, public/logo-mark.svg, public/favicon.svg')
