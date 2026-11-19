require('./src/config/ambiente')
const conn = require('./src/db/conn')
const { Produto, Kit } = require('./src/models/rel')
const { PASTA_SEED, slug, copiarParaSeed } = require('./src/utils/imagensSeed')

async function exportar() {
  try {
    await conn.authenticate()
    let total = 0

    const produtos = await Produto.findAll()
    for (const p of produtos) {
      if (copiarParaSeed(p.imagem_url, p.codigoInterno)) {
        total++
        console.log(`Produto ${p.codigoInterno} -> imagens-seed`)
      }
    }

    const kits = await Kit.findAll()
    for (const k of kits) {
      if (copiarParaSeed(k.imagem_url, slug(k.nome))) {
        total++
        console.log(`Kit ${k.nome} -> imagens-seed`)
      }
    }

    console.log('-----------------------------------------------------')
    console.log(`${total} imagem(ns) copiada(s) para ${PASTA_SEED}`)
    console.log('-----------------------------------------------------')
  } catch (err) {
    console.error('Erro ao exportar imagens:', err)
  } finally {
    await conn.close()
  }
}

exportar()