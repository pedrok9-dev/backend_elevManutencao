const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const PASTA_UPLOADS = path.join(__dirname, '..', '..', 'uploads')
const TAMANHO_MAXIMO = 5 * 1024 * 1024
const TIPOS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }

function assinaturaValida(buffer, tipo) {
  if (tipo === 'image/png') return buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
  if (tipo === 'image/jpeg') return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  if (tipo === 'image/gif') return buffer.subarray(0, 4).toString('ascii') === 'GIF8'
  if (tipo === 'image/webp') return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  return false
}

// Recebe a imagem em base64 (data URL), salva em backend/uploads e devolve o caminho público.
function salvarImagem(dataUrl, prefixo = 'img') {
  if (typeof dataUrl !== 'string') throw new Error('Imagem inválida. Use PNG, JPG, WEBP ou GIF.')

  const separador = dataUrl.indexOf(';base64,')
  const cabecalho = separador > 0 ? dataUrl.slice(0, separador) : ''
  const tipo = cabecalho.replace('data:', '')

  if (!cabecalho.startsWith('data:') || !TIPOS[tipo]) {
    throw new Error('Imagem inválida. Use PNG, JPG, WEBP ou GIF.')
  }

  const buffer = Buffer.from(dataUrl.slice(separador + 8), 'base64')

  if (buffer.length === 0 || !assinaturaValida(buffer, tipo)) {
    throw new Error('O arquivo enviado não é uma imagem válida.')
  }
  if (buffer.length > TAMANHO_MAXIMO) {
    throw new Error('Imagem muito grande. Use uma imagem de até 5 MB.')
  }

  fs.mkdirSync(PASTA_UPLOADS, { recursive: true })
  const nome = `${prefixo}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${TIPOS[tipo]}`
  fs.writeFileSync(path.join(PASTA_UPLOADS, nome), buffer)

  return `/uploads/${nome}`
}

function apagarImagem(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) return
  try {
    fs.unlinkSync(path.join(PASTA_UPLOADS, path.basename(url)))
  } catch (err) {
    // arquivo já não existe, segue o jogo
  }
}

module.exports = { salvarImagem, apagarImagem, PASTA_UPLOADS }