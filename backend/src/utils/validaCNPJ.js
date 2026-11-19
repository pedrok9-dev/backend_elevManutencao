function validaCNPJ(cnpj) {
  cnpj = String(cnpj).replace(/[^\d]/g, '')

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  function calcularDigito(base) {
    const pesos = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    const soma = base
      .split('')
      .reduce((acc, digito, i) => acc + Number(digito) * pesos[i], 0)

    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const base12 = cnpj.substring(0, 12)
  const digito1 = calcularDigito(base12)
  const digito2 = calcularDigito(base12 + digito1)

  return cnpj === base12 + String(digito1) + String(digito2)
}

module.exports = { validaCNPJ }