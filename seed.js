require('./src/config/ambiente')
const criarBancoSeNaoExistir = require('./src/db/criarBanco')
const conn = require('./src/db/conn')

const {
  Usuario, Categoria, Fornecedor, Produto, Estoque, Kit, ItemKit
} = require('./src/models/rel')

const { hashSenha } = require('./src/utils/criptografia')
const { slug, aplicarImagemSeed } = require('./src/utils/imagensSeed')

async function seed() {
  try {
    await criarBancoSeNaoExistir()
    await conn.authenticate()

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

    // 5 produtos por categoria (30 no total)
    const produtosSeed = [
      // Mecânica
      ['EM-R6204', 'Rolamento R6204', 'Mecânica', 39.90, 60, 'Rolamento de esferas R6204 para polias, roldanas e motores de tração.'],
      ['EM-FIX1', 'Kit de Fixadores Diversos', 'Mecânica', 18.90, 50, 'Parafusos, porcas, arruelas e buchas para fixação de componentes mecânicos.'],
      ['EM-POLIA1', 'Polia de Desvio 200mm', 'Mecânica', 189.90, 8, 'Polia de desvio de 200 mm para cabos de aço, com rolamento incluso.'],
      ['EM-CABO8', 'Cabo de Aço 8mm - Rolo 10m', 'Mecânica', 219.90, 12, 'Cabo de aço de 8 mm, alma de aço, rolo com 10 metros para tração e limitador.'],
      ['EM-GUIA1', 'Guia de Cabine em Nylon', 'Mecânica', 34.90, 40, 'Sapata guia de nylon para deslizamento da cabine nas guias, par.'],

      // Elétrica
      ['EM-C25', 'Contator C25', 'Elétrica', 129.90, 25, 'Contator tripolar de 25 A para acionamento de motores e comandos.'],
      ['EM-F10', 'Kit Fusíveis F10', 'Elétrica', 49.90, 50, 'Kit com fusíveis de 10 A para proteção dos circuitos de comando.'],
      ['EM-RELE1', 'Relé Auxiliar', 'Elétrica', 29.90, 40, 'Relé auxiliar de 24 V com base, para lógica de comando.'],
      ['EM-TERM1', 'Kit de Terminais Elétricos', 'Elétrica', 19.90, 60, 'Terminais tipo olhal e pino para conexões de painéis e quadros de comando.'],
      ['EM-DISJ1', 'Disjuntor Tripolar 32A', 'Elétrica', 38.90, 35, 'Disjuntor tripolar de 32 A para proteção de motores e quadros.'],

      // Eletrônica
      ['EM-SM200', 'Sensor Magnético SM-200', 'Eletrônica', 89.90, 40, 'Sensor magnético de posição para indicação de pavimento e nivelamento.'],
      ['EM-DISP1', 'Display de Posição LED', 'Eletrônica', 159.90, 14, 'Display de LED que indica o andar e o sentido de movimento do elevador.'],
      ['EM-PLACA1', 'Placa de Comando de Porta', 'Eletrônica', 489.90, 6, 'Placa eletrônica de comando do operador de porta, com conectores padrão.'],
      ['EM-FONTE1', 'Fonte Chaveada 24V', 'Eletrônica', 94.90, 20, 'Fonte chaveada de 24 V para alimentação de comandos e sensores.'],
      ['EM-INV2', 'Inversor de Frequência 2CV', 'Eletrônica', 1290.00, 4, 'Inversor de frequência de 2 CV para controle de velocidade de motores.'],

      // Portas e cabine
      ['EM-LED09', 'Kit LED Cabine 9W', 'Portas e cabine', 74.90, 30, 'Kit de iluminação LED de 9 W para o teto da cabine.'],
      ['EM-ROL04', 'Roldana de Porta', 'Portas e cabine', 54.90, 20, 'Roldana de porta com rolamento para o deslizamento das folhas.'],
      ['EM-FECH1', 'Fechadura de Porta', 'Portas e cabine', 149.90, 12, 'Fechadura eletromecânica de porta de pavimento.'],
      ['EM-SENS-PORTA', 'Sensor de Porta', 'Portas e cabine', 64.90, 24, 'Sensor de presença para reabertura da porta e detecção de obstáculos.'],
      ['EM-BOTAO1', 'Botoeira de Pavimento', 'Portas e cabine', 79.90, 26, 'Botoeira de chamada de pavimento com indicação luminosa.'],

      // Segurança e emergência
      ['EM-BEM', 'Botão de Emergência', 'Segurança e emergência', 69.90, 15, 'Botão de emergência para a botoeira da cabine, com acionamento de alarme.'],
      ['EM-LUZ-EMG', 'Luz de Emergência', 'Segurança e emergência', 44.90, 18, 'Luminária de emergência com bateria para iluminar a cabine em caso de falta de energia.'],
      ['EM-BAT-EMG', 'Bateria para Emergência', 'Segurança e emergência', 59.90, 3, 'Bateria selada de 12 V para sistemas de emergência e resgate.'],
      ['EM-SINAL', 'Sinalizador Sonoro', 'Segurança e emergência', 39.90, 22, 'Sinalizador sonoro (buzzer) de alarme para a cabine.'],
      ['EM-INTERF1', 'Interfone de Cabine', 'Segurança e emergência', 139.90, 12, 'Interfone de cabine para comunicação com a portaria ou central.'],

      // Ferramentas e manutenção
      ['EM-LUB1', 'Lubrificante Técnico 1L', 'Ferramentas e manutenção', 35.00, 45, 'Lubrificante técnico de 1 litro para guias, correntes e articulações.'],
      ['EM-MULT1', 'Multímetro Digital', 'Ferramentas e manutenção', 119.90, 10, 'Multímetro digital para medição de tensão, corrente e continuidade.'],
      ['EM-GRAXA1', 'Graxa Industrial 500g', 'Ferramentas e manutenção', 22.90, 35, 'Graxa industrial de 500 g para rolamentos e mancais.'],
      ['EM-LIMP1', 'Kit de Limpeza Técnica', 'Ferramentas e manutenção', 27.90, 30, 'Kit com desengraxante, pano e pincel para limpeza de componentes.'],
      ['EM-CHAVE1', 'Jogo de Chaves de Fenda e Phillips', 'Ferramentas e manutenção', 64.90, 28, 'Jogo com chaves de fenda e Phillips de vários tamanhos, cabo isolado.']
    ]

    const produtos = {}
    for (const [codigoInterno, nome, categoriaNome, preco, quantidade, descricao] of produtosSeed) {
      const [produto] = await Produto.findOrCreate({
        where: { codigoInterno },
        defaults: {
          idCategoria: categorias[categoriaNome].codCategoria,
          idFornecedor: fornecedor.codFornecedor,
          nome,
          descricao,
          preco,
          unidade: 'unidade'
        }
      })

      // troca só a descrição genérica criada pelo seed antigo; descrições editadas por você ficam como estão
      if (produto.descricao && produto.descricao.includes('item de demonstração')) {
        await produto.update({ descricao })
      }

      await Estoque.findOrCreate({
        where: { idProduto: produto.codProduto },
        defaults: { quantidade_atual: quantidade, quantidade_minima: Math.ceil(quantidade * 0.2) }
      })

      await aplicarImagemSeed(produto, codigoInterno)
      produtos[codigoInterno] = produto
    }

    // 3 kits
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

      await aplicarImagemSeed(kit, slug(kitInfo.nome))
      for (const [codigoInterno, quantidade] of kitInfo.itens) {
        await ItemKit.findOrCreate({
          where: { idKit: kit.codKit, idProduto: produtos[codigoInterno].codProduto },
          defaults: { quantidade }
        })
      }
    }

    // o seed antigo tinha um 4º kit; desativa para ficarem só 3 kits na loja
    await Kit.update({ ativo: false }, { where: { nome: 'Kit Manutenção Preventiva' } })

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