const db = require('../db/conn')
const Pedido = require('../models/Pedido')
const ItemPedido = require('../models/ItemPedido')
const Produto = require('../models/Produto')
const Kit = require('../models/Kit')
const ItemKit = require('../models/ItemKit')
const Estoque = require('../models/Estoque')
const MovimentacaoEstoque = require('../models/MovimentacaoEstoque')
const Endereco = require('../models/Endereco')
const Entrega = require('../models/Entrega')

async function criarPedido(idUsuario, { idEndereco, itens }) {
  if (!idEndereco) throw new Error('Endereço de entrega é obrigatório')
  if (!Array.isArray(itens) || itens.length === 0) throw new Error('O pedido precisa ter ao menos um item')

  return await db.transaction(async (t) => {
    const endereco = await Endereco.findOne({ where: { codEndereco: idEndereco, idUsuario }, transaction: t })
    if (!endereco) throw new Error('Endereço não encontrado para este usuário')

    const deducoesPorProduto = new Map() 
    const linhasItemPedido = [] 

    for (const item of itens) {
      if (!item.quantidade || item.quantidade <= 0) {
        throw new Error('Quantidade inválida em um dos itens do pedido')
      }

      if (item.tipo === 'produto') {
        const produto = await Produto.findByPk(item.id, {
          include: [{ model: Estoque, as: 'estoqueProduto' }],
          transaction: t
        })
        if (!produto || !produto.ativo) throw new Error(`Produto ${item.id} indisponível`)

        const saldoAtual = produto.estoqueProduto?.quantidade_atual ?? 0
        const jaReservado = deducoesPorProduto.get(produto.codProduto) || 0

        if (jaReservado + item.quantidade > saldoAtual) {
          throw new Error(`Estoque insuficiente para o produto "${produto.nome}"`)
        }

        deducoesPorProduto.set(produto.codProduto, jaReservado + item.quantidade)

        linhasItemPedido.push({
          idProduto: produto.codProduto,
          idKit: null,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal: Number(produto.preco) * item.quantidade
        })
      } else if (item.tipo === 'kit') {
        const kit = await Kit.findByPk(item.id, {
          include: [{ model: ItemKit, as: 'itensKit', include: [{ model: Produto, as: 'produtoItemKit', include: [{ model: Estoque, as: 'estoqueProduto' }] }] }],
          transaction: t
        })
        if (!kit || !kit.ativo) throw new Error(`Kit ${item.id} indisponível`)
        if (!kit.itensKit || kit.itensKit.length === 0) throw new Error(`Kit "${kit.nome}" não possui composição cadastrada`)

        for (const compKit of kit.itensKit) {
          const necessario = compKit.quantidade * item.quantidade
          const saldoAtual = compKit.produtoItemKit?.estoqueProduto?.quantidade_atual ?? 0
          const jaReservado = deducoesPorProduto.get(compKit.idProduto) || 0

          if (jaReservado + necessario > saldoAtual) {
            throw new Error(`Kit "${kit.nome}" indisponível: estoque insuficiente de "${compKit.produtoItemKit?.nome}"`)
          }

          deducoesPorProduto.set(compKit.idProduto, jaReservado + necessario)
        }

        linhasItemPedido.push({
          idProduto: null,
          idKit: kit.codKit,
          quantidade: item.quantidade,
          precoUnitario: kit.preco,
          subtotal: Number(kit.preco) * item.quantidade
        })
      } else {
        throw new Error('Tipo de item inválido (use "produto" ou "kit")')
      }
    }

    const valorTotal = linhasItemPedido.reduce((soma, l) => soma + Number(l.subtotal), 0)

    const pedido = await Pedido.create({
      idUsuario,
      idEndereco,
      valorTotal,
      status: 'CONFIRMADO'
    }, { transaction: t })

    for (const linha of linhasItemPedido) {
      await ItemPedido.create({ idPedido: pedido.codPedido, ...linha }, { transaction: t })
    }

    for (const [idProduto, quantidade] of deducoesPorProduto.entries()) {
      const estoque = await Estoque.findOne({ where: { idProduto }, transaction: t, lock: t.LOCK.UPDATE })
      const novaQuantidade = estoque.quantidade_atual - quantidade

      if (novaQuantidade < 0) throw new Error('Estoque não pode ficar negativo')

      await estoque.update({ quantidade_atual: novaQuantidade, ultima_atualizacao: new Date() }, { transaction: t })

      await MovimentacaoEstoque.create({
        idProduto,
        tipo: 'SAIDA',
        quantidade,
        motivo: 'venda',
        idPedido: pedido.codPedido
      }, { transaction: t })
    }

    await Entrega.create({
      idPedido: pedido.codPedido,
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      cidade: endereco.cidade,
      estado: endereco.estado,
      status: 'AGUARDANDO_SEPARACAO'
    }, { transaction: t })

    return pedido
  })
}

async function listarMeusPedidos(idUsuario) {
  return await Pedido.findAll({
    where: { idUsuario },
    include: [
      { model: ItemPedido, as: 'itensPedido' },
      { model: Entrega, as: 'entregaPedido' }
    ],
    order: [['dataPedido', 'DESC']]
  })
}

async function listarTodosPedidos({ status } = {}) {
  const where = status ? { status } : {}
  return await Pedido.findAll({
    where,
    include: [
      { model: ItemPedido, as: 'itensPedido' },
      { model: Entrega, as: 'entregaPedido' }
    ],
    order: [['dataPedido', 'DESC']]
  })
}

async function buscarPedidoPorId(id, idUsuario = null) {
  const where = idUsuario ? { codPedido: id, idUsuario } : { codPedido: id }
  const pedido = await Pedido.findOne({
    where,
    include: [
      { model: ItemPedido, as: 'itensPedido' },
      { model: Entrega, as: 'entregaPedido' },
      { model: Endereco, as: 'enderecoPedido' }
    ]
  })
  if (!pedido) throw new Error('Pedido não encontrado')
  return pedido
}

async function atualizarStatus(id, status) {
  const statusValidos = ['PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']
  if (!statusValidos.includes(status)) throw new Error('Status inválido')

  const pedido = await Pedido.findByPk(id)
  if (!pedido) throw new Error('Pedido não encontrado')

  await pedido.update({ status })
  return pedido
}

module.exports = {
  criarPedido,
  listarMeusPedidos,
  listarTodosPedidos,
  buscarPedidoPorId,
  atualizarStatus
}