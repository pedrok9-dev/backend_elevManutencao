const db = require('../db/conn')
const { QueryTypes } = require('sequelize')

async function vendasPorCategoria() {
  const resultado = await db.query(`
    SELECT
      c.nome AS categoria,
      COALESCE(SUM(ip.subtotal), 0) AS faturamento,
      COALESCE(SUM(ip.quantidade), 0) AS quantidadeVendida
    FROM categorias c
    LEFT JOIN produtos p ON p.idCategoria = c.codCategoria
    LEFT JOIN itens_pedido ip ON ip.idProduto = p.codProduto
    LEFT JOIN pedidos pe ON pe.codPedido = ip.idPedido AND pe.status != 'CANCELADO'
    GROUP BY c.codCategoria, c.nome
    ORDER BY faturamento DESC
  `, { type: QueryTypes.SELECT })

  return resultado
}

async function situacaoEstoque() {
  const resultado = await db.query(`
    SELECT
      p.codProduto, p.nome, p.codigoInterno,
      e.quantidade_atual, e.quantidade_minima,
      CASE
        WHEN e.quantidade_atual = 0 THEN 'ESGOTADO'
        WHEN e.quantidade_atual <= e.quantidade_minima THEN 'ABAIXO_DO_MINIMO'
        ELSE 'NORMAL'
      END AS situacao
    FROM produtos p
    JOIN estoques e ON e.idProduto = p.codProduto
    WHERE p.ativo = true
    ORDER BY e.quantidade_atual ASC
  `, { type: QueryTypes.SELECT })

  const resumo = {
    NORMAL: resultado.filter(r => r.situacao === 'NORMAL').length,
    ABAIXO_DO_MINIMO: resultado.filter(r => r.situacao === 'ABAIXO_DO_MINIMO').length,
    ESGOTADO: resultado.filter(r => r.situacao === 'ESGOTADO').length
  }

  const cincoMenoresSaldos = resultado.slice(0, 5)

  return { resumo, cincoMenoresSaldos, produtos: resultado }
}

async function indicadoresGerais() {
  const [linha] = await db.query(`
    SELECT
      COUNT(*) AS quantidadePedidos,
      COALESCE(SUM(valorTotal), 0) AS faturamentoTotal,
      COALESCE(AVG(valorTotal), 0) AS ticketMedio
    FROM pedidos
    WHERE status != 'CANCELADO'
  `, { type: QueryTypes.SELECT })

  const porStatus = await db.query(`
    SELECT status, COUNT(*) AS total
    FROM pedidos
    GROUP BY status
  `, { type: QueryTypes.SELECT })

  const kitsMaisVendidos = await db.query(`
    SELECT k.nome, SUM(ip.quantidade) AS quantidadeVendida
    FROM itens_pedido ip
    JOIN kits k ON k.codKit = ip.idKit
    JOIN pedidos pe ON pe.codPedido = ip.idPedido AND pe.status != 'CANCELADO'
    GROUP BY k.codKit, k.nome
    ORDER BY quantidadeVendida DESC
    LIMIT 5
  `, { type: QueryTypes.SELECT })

  return { ...linha, porStatus, kitsMaisVendidos }
}

module.exports = { vendasPorCategoria, situacaoEstoque, indicadoresGerais }