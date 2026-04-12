// Curated Unsplash photo URLs for Lumen
// Direct image URLs (no API key needed)
// Quality params: w=1600&q=80 for hero, w=1200 for sections, w=800 for cards

const base = 'https://images.unsplash.com/photo-'
const hero = '?w=1920&q=80&auto=format&fit=crop'
const lg = '?w=1400&q=80&auto=format&fit=crop'
const md = '?w=900&q=80&auto=format&fit=crop'
const sm = '?w=600&q=80&auto=format&fit=crop'

export const photos = {
  // Dark restaurant / wine bar interior — hero
  hero: `${base}1514933651103-005eec06c04b${hero}`, // dark wine bar / glasses
  heroAlt: `${base}1559339352-11d035aa65de${hero}`, // wine pour

  // Intro section — wine being poured / sommelier
  intro: `${base}1547595628-c61a29f496f0${lg}`, // wine cellar bottles
  introAlt: `${base}1568213816046-0ee1c42bd559${lg}`, // wine pour close-up

  // Menu items
  burrata: `${base}1567620905732-2d1ec7ab7445${md}`, // burrata / cheese
  tartare: `${base}1544025162-d76694265947${md}`, // beef tartare
  branzino: `${base}1519708227418-c8fd9a32b7a2${md}`, // fish dish
  cacioPepe: `${base}1551892374-ecf8754cf8b0${md}`, // pasta

  // Gallery
  gallery1: `${base}1414235077428-338989a2e8c0${md}`, // steak / food
  gallery2: `${base}1510812431401-41d2bd2722f3${md}`, // wine glass dark
  gallery3: `${base}1543007630-9710e4a00a20${md}`, // wine bottles
  gallery4: `${base}1474898856510-884a2c0be546${md}`, // cheese board
  gallery5: `${base}1551024709-8f23befc6f87${md}`, // food shot

  // Sommelier pick — wine bottle
  bottle: `${base}1553361371-9b22f78e8b1d${lg}`, // wine bottle dark

  // Visit / location
  visit: `${base}1559339352-11d035aa65de${lg}`, // restaurant interior

  // Sommelier portrait
  sommelier: `${base}1544005313-94ddf0286df2${md}`, // person portrait
}
