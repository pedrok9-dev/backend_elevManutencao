// Script opcional para popular o banco com dados de exemplo (categorias, fornecedor,
// produtos, estoque e kits), com base no catálogo de demonstração do projeto.
// Rode DEPOIS do "npm run sync" (as 12 tabelas precisam já existir).
require('dotenv').config()
// Mesma lógica do sync.js: usa a conexão "inteligente" (./src/db/conn), que funciona
// tanto localmente (.env) quanto no Railway (DATABASE_URL / MYSQLHOST / etc.).
const conn = require('./src/db/conn')

const {
  Usuario, Categoria, Fornecedor, Produto, Estoque, Kit, ItemKit
} = require('./src/models/rel')

const { hashSenha } = require('./src/utils/criptografia')

async function seed() {
  try {
    await conn.authenticate()

    // -------- Usuário administrador --------
    const senhaAdmin = await hashSenha('admin123')
    await Usuario.findOrCreate({
      where: { email: 'admin@elevmanutencao.com.br' },
      defaults: {
        nome: 'Administrador ElevManutenção',
        email: 'admin@elevmanutencao.com.br',
        senha: senhaAdmin,
        telefone: '(47) 99999-0000',
        cpf: '52998224725',
        tipo_usuario: 'ADMIN'
      }
    })

    // -------- Categorias --------
    const nomesCategorias = [
      ['Mecânica', 'Rolamentos, polias, roldanas, correias, guias, buchas, cabos e fixadores.'],
      ['Elétrica', 'Contatores, relés, fusíveis, disjuntores, bornes e cabos.'],
      ['Eletrônica', 'Sensores, displays, placas, fontes e módulos.'],
      ['Portas e cabine', 'Botoeiras, botões, fechaduras, sensores, iluminação e ventiladores.'],
      ['Segurança e emergência', 'Alarmes, botões de emergência, luzes e componentes de comunicação.'],
      ['Ferramentas e manutenção', 'Multímetros, chaves, alicates, lubrificantes, graxas e kits.']
    ]

    const categorias = {}
    for (const [nome, descricao] of nomesCategorias) {
      const [categoria] = await Categoria.findOrCreate({ where: { nome }, defaults: { descricao } })
      categorias[nome] = categoria
    }

    // -------- Fornecedor de exemplo --------
    const [fornecedor] = await Fornecedor.findOrCreate({
      where: { cnpj: '11222333000181' },
      defaults: {
        razaoSocial: 'Peças Técnicas para Elevadores Ltda',
        nomeFantasia: 'PT Elevadores',
        cnpj: '11222333000181',
        email: 'contato@ptelevadores.com.br',
        telefone: '(47) 3333-4444'
      }
    })

    // -------- Produtos de exemplo --------
    const produtosSeed = [
      ['EM-SM200', 'Sensor Magnético SM-200', 'Eletrônica', 89.90, 40],
      ['EM-C25', 'Contator C25', 'Elétrica', 129.90, 25],
      ['EM-R6204', 'Rolamento R6204', 'Mecânica', 39.90, 60],
      ['EM-LED09', 'Kit LED Cabine 9W', 'Portas e cabine', 74.90, 30],
      ['EM-F10', 'Kit Fusíveis F10', 'Elétrica', 49.90, 50],
      ['EM-ROL04', 'Roldana de Porta', 'Portas e cabine', 54.90, 20],
      ['EM-LUB1', 'Lubrificante Técnico 1L', 'Ferramentas e manutenção', 35.00, 45],
      ['EM-BEM', 'Botão de Emergência', 'Segurança e emergência', 69.90, 15],
      ['EM-MULT1', 'Multímetro Digital', 'Ferramentas e manutenção', 119.90, 10],
      ['EM-FECH1', 'Fechadura de Porta', 'Portas e cabine', 149.90, 12],
      ['EM-LUZ-EMG', 'Luz de Emergência', 'Segurança e emergência', 44.90, 18],
      ['EM-BAT-EMG', 'Bateria para Emergência', 'Segurança e emergência', 59.90, 3],
      ['EM-SINAL', 'Sinalizador Sonoro', 'Segurança e emergência', 39.90, 22],
      ['EM-RELE1', 'Relé Auxiliar', 'Elétrica', 29.90, 40],
      ['EM-TERM1', 'Kit de Terminais Elétricos', 'Elétrica', 19.90, 60],
      ['EM-SENS-PORTA', 'Sensor de Porta', 'Portas e cabine', 64.90, 24],
      ['EM-GRAXA1', 'Graxa Industrial 500g', 'Ferramentas e manutenção', 22.90, 35],
      ['EM-LIMP1', 'Kit de Limpeza Técnica', 'Ferramentas e manutenção', 27.90, 30],
      ['EM-FIX1', 'Kit de Fixadores Diversos', 'Mecânica', 18.90, 50]
    ]

    const produtos = {}
    for (const [codigoInterno, nome, categoriaNome, preco, quantidade] of produtosSeed) {
      const [produto] = await Produto.findOrCreate({
        where: { codigoInterno },
        defaults: {
          idCategoria: categorias[categoriaNome].codCategoria,
          idFornecedor: fornecedor.codFornecedor,
          nome,
          descricao: `${nome} - item de demonstração para o catálogo ElevManutenção.`,
          preco,
          unidade: 'unidade'
        }
      })

      await Estoque.findOrCreate({
        where: { idProduto: produto.codProduto },
        defaults: { quantidade_atual: quantidade, quantidade_minima: Math.ceil(quantidade * 0.2) }
      })

      produtos[codigoInterno] = produto
    }

    // -------- Kits de exemplo --------
    const kitsSeed = [
      {
        nome: 'Kit Manutenção de Porta',
        descricao: 'Sensores, roldanas, fechadura e lubrificante para atendimento de portas.',
        preco: 279.90,
        categoriaNome: 'Portas e cabine',
        itens: [
          ['EM-SENS-PORTA', 2],
          ['EM-ROL04', 4],
          ['EM-FECH1', 1],
          ['EM-LUB1', 1]
        ]
      },
      {
        nome: 'Kit Elétrica Básica',
        descricao: 'Contatores, fusíveis, relé e terminais para reposição elétrica recorrente.',
        preco: 219.90,
        categoriaNome: 'Elétrica',
        itens: [
          ['EM-C25', 2],
          ['EM-F10', 5],
          ['EM-RELE1', 1],
          ['EM-TERM1', 1]
        ]
      },
      {
        nome: 'Kit Emergência',
        descricao: 'Botão de emergência, luz, bateria e sinalizador para itens de emergência.',
        preco: 189.90,
        categoriaNome: 'Segurança e emergência',
        itens: [
          ['EM-BEM', 1],
          ['EM-LUZ-EMG', 1],
          ['EM-BAT-EMG', 1],
          ['EM-SINAL', 1]
        ]
      },
      {
        nome: 'Kit Manutenção Preventiva',
        descricao: 'Lubrificante, graxa, itens de limpeza e fixadores para rotinas preventivas.',
        preco: 99.90,
        categoriaNome: 'Ferramentas e manutenção',
        itens: [
          ['EM-LUB1', 1],
          ['EM-GRAXA1', 1],
          ['EM-LIMP1', 1],
          ['EM-FIX1', 1]
        ]
      }
    ]

    for (const kitInfo of kitsSeed) {
      const [kit] = await Kit.findOrCreate({
        where: { nome: kitInfo.nome },
        defaults: {
          descricao: kitInfo.descricao,
          preco: kitInfo.preco,
          idCategoria: categorias[kitInfo.categoriaNome].codCategoria
        }
      })

      for (const [codigoInterno, quantidade] of kitInfo.itens) {
        await ItemKit.findOrCreate({
          where: { idKit: kit.codKit, idProduto: produtos[codigoInterno].codProduto },
          defaults: { quantidade }
        })
      }
    }

    console.log('-----------------------------------------------------')
    console.log('Seed concluído! Login admin: admin@elevmanutencao.com.br / admin123')
    console.log('-----------------------------------------------------')
  } catch (err) {
    console.error('Erro ao popular o banco de dados:', err)
  } finally {
    await conn.close()
  }
}

seed()
