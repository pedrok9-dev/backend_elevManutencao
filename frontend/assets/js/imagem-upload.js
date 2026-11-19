const TIPOS_IMAGEM = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024

function lerArquivoComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
    leitor.readAsDataURL(arquivo)
  })
}

// Reduz imagens grandes (lado maior de até 1200px) para a loja carregar rápido.
async function prepararImagem(arquivo) {
  if (!TIPOS_IMAGEM.includes(arquivo.type)) {
    throw new Error('Use uma imagem PNG, JPG, WEBP ou GIF.')
  }
  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
    throw new Error('Imagem muito grande. Use uma imagem de até 5 MB.')
  }

  const original = await lerArquivoComoDataUrl(arquivo)
  if (arquivo.type === 'image/gif') return original

  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error('Não foi possível abrir a imagem.'))
    el.src = original
  })

  const maximo = 1200
  const escala = Math.min(1, maximo / Math.max(img.width, img.height))
  if (escala === 1) return original

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

  const tipoSaida = arquivo.type === 'image/png' ? 'image/png' : 'image/jpeg'
  return canvas.toDataURL(tipoSaida, 0.85)
}

// Liga um <input type="file"> a uma área de prévia.
function campoImagem(idInput, idPrevia) {
  const input = document.getElementById(idInput)
  const previa = document.getElementById(idPrevia)
  let dataUrl = null
  let remover = false
  let atual = ''

  function desenhar() {
    const src = dataUrl || (remover ? '' : urlImagem(atual))
    previa.innerHTML = src
      ? `<img src="${src}" alt="Prévia">` + (!dataUrl && atual ? `<label><input type="checkbox" id="${idInput}-remover"> Remover imagem</label>` : '')
      : ''
    const caixa = document.getElementById(`${idInput}-remover`)
    if (caixa) caixa.addEventListener('change', () => { remover = caixa.checked })
  }

  input.addEventListener('change', async () => {
    dataUrl = null
    const arquivo = input.files[0]
    if (!arquivo) { desenhar(); return }
    try {
      dataUrl = await prepararImagem(arquivo)
      remover = false
    } catch (err) {
      alert(err.message)
      input.value = ''
    }
    desenhar()
  })

  return {
    limpar(urlAtual = '') {
      input.value = ''
      dataUrl = null
      remover = false
      atual = urlAtual || ''
      desenhar()
    },
    dados() {
      if (dataUrl) return { imagem: dataUrl }
      if (remover) return { remover_imagem: true }
      return {}
    }
  }
}