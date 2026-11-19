const API_BASE_URL = window.location.port === '3000'
  ? window.location.origin
  : 'http://localhost:3000'

function urlImagem(caminho) {
  if (!caminho) return ''
  if (/^(https?:|data:)/.test(caminho)) return caminho
  return API_BASE_URL + caminho
}

function imagemHtml(caminho) {
  if (!caminho) return ''
  return `<img class="imagem-item" src="${urlImagem(caminho)}" alt="" loading="lazy" onerror="this.remove()">`
}