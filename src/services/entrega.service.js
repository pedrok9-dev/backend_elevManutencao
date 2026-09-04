const Entrega = require('../models/Entrega')

async function listarEntregas({ status } = {}) {
  const where = status ? { status } : {}
  return await Entrega.findAll({ where, order: [['createdAt', 'DESC']] })
}

async function atualizarStatus(idPedido, dados) {
  const { status, codigoRastreio } = dados
  const statusValidos = ['AGUARDANDO_SEPARACAO', 'EM_TRANSITO', 'ENTREGUE', 'OCORRENCIA']

  if (status && !statusValidos.includes(status)) {
    throw new Error('Status de entrega inválido')
  }

  const entrega = await Entrega.findOne({ where: { idPedido } })
  if (!entrega) throw new Error('Entrega não encontrada')

  const atualizacao = {}
  if (status) atualizacao.status = status
  if (codigoRastreio) atualizacao.codigoRastreio = codigoRastreio
  if (status === 'EM_TRANSITO' && !entrega.dataEnvio) atualizacao.dataEnvio = new Date()
  if (status === 'ENTREGUE') atualizacao.dataEntrega = new Date()

  await entrega.update(atualizacao)
  return entrega
}

module.exports = { listarEntregas, atualizarStatus }