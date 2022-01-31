import Handsontable from "handsontable";

export const starsRenderer = Handsontable.renderers.registerRenderer('negativeValueRenderer', negativeValueRenderer);

function negativeValueRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  
  td.className = 'htCenter';
  if (value === 'Active') {
    td.style.background = '#1cbb8c';
    td.style.color = '#fff'
  }
  if (value === 'Suspended') {
    td.style.background = '#fcb92c';
    td.style.color = '#fff'
  }
  if (value === 'Canceled') {
    td.style.background = '#ff3d60';
    td.style.color = '#fff'
  }
}