// Curated Unsplash photos for Forma One headphones
const base = 'https://images.unsplash.com/photo-'
const lg = '?w=1600&q=85&auto=format&fit=crop'
const md = '?w=1000&q=85&auto=format&fit=crop'
const sm = '?w=600&q=85&auto=format&fit=crop'

export const photos = {
  // Hero — clean product shot, light bg
  hero: `${base}1505740420928-5e560c06d30e${lg}`, // white headphones clean

  // Story scenes — different angles / lifestyle
  story1: `${base}1583394838336-acd977736f90${md}`, // black headphones close
  story2: `${base}1572569511254-d8f925fe2cbb${md}`, // detail
  story3: `${base}1546435770-a3e426bf472b${md}`, // colorful headphones
  story4: `${base}1588423771073-b8903fbb85b5${md}`, // premium

  // Color variants
  variant1: `${base}1505740420928-5e560c06d30e${md}`, // white
  variant2: `${base}1583394838336-acd977736f90${md}`, // black
  variant3: `${base}1546435770-a3e426bf472b${md}`, // colored
  variant4: `${base}1588423771073-b8903fbb85b5${md}`, // premium

  // In the box — flat lay or detail
  box: `${base}1545127398-14699f92334b${md}`,

  // Buy section — fallback to known working photo
  buy: `${base}1505740420928-5e560c06d30e${lg}`,
}
