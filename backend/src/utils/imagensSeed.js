const fs = require('fs')
const path = require('path')
const { PASTA_UPLOADS } = require('./imagem')

// Pasta dentro do código onde ficam as imagens que o seed usa.
// Produtos: nome do arquivo = código interno (ex: EM-C25.png)
// Kits: nome do arquivo = nome do kit sem acento e com hífens (ex: kit-eletrica-basica.png)
const PASTA_SEED = path.join(__dirname, '..', '..', 'imagens-seed')
const EXTENSOES = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

function slug(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function nomeSeguro(base) {
  return String(base).replace(/[\\/:*?"<>|]/g, '_')
}

function encontrarImagem(base) {
  if (!fs.existsSync(PASTA_SEED)) return null
  const alvo = nomeSeguro(base).toLowerCase()
  const arquivo = fs.readdirSync(PASTA_SEED).find(nome => {
    const ext = path.extname(nome).toLowerCase()
    return EXTENSOES.includes(ext) && path.basename(nome, path.extname(nome)).toLowerCase() === alvo
  })
  return arquivo ? path.join(PASTA_SEED, arquivo) : null
}

function uploadExiste(url) {
  return !!url && url.startsWith('/uploads/') && fs.existsSync(path.join(PASTA_UPLOADS, path.basename(url)))
}

function copiarParaUploads(arquivoOrigem, base) {
  fs.mkdirSync(PASTA_UPLOADS, { recursive: true })
  const nome = `seed-${slug(base)}${path.extname(arquivoOrigem).toLowerCase()}`
  fs.copyFileSync(arquivoOrigem, path.join(PASTA_UPLOADS, nome))
  return `/uploads/${nome}`
}

// Usada pelo seed: se o item não tem imagem (ou o arquivo dela sumiu), pega a da pasta imagens-seed.
async function aplicarImagemSeed(registro, base) {
  if (uploadExiste(registro.imagem_url)) return false
  const arquivo = encontrarImagem(base)
  if (!arquivo) return false
  await registro.update({ imagem_url: copiarParaUploads(arquivo, base) })
  return true
}

// Usada pelo exportar-imagens: copia a imagem cadastrada pelo painel para a pasta imagens-seed.
function copiarParaSeed(url, base) {
  if (!uploadExiste(url)) return false
  fs.mkdirSync(PASTA_SEED, { recursive: true })

  const antiga = encontrarImagem(base)
  if (antiga) fs.unlinkSync(antiga)

  const origem = path.join(PASTA_UPLOADS, path.basename(url))
  fs.copyFileSync(origem, path.join(PASTA_SEED, `${nomeSeguro(base)}${path.extname(origem).toLowerCase()}`))
  return true
}

module.exports = { PASTA_SEED, slug, encontrarImagem, aplicarImagemSeed, copiarParaSeed }