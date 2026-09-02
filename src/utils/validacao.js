const { validaCPF } = require('./validaCPF')
const { validaCNPJ } = require('./validaCNPJ')

function validaEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function validaTelefone(telefone) {
  // Aceita (11)9XXXX-XXXX ou 119XXXXYYYY
  const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
  return regex.test(telefone)
}

function validaCEP(cep) {
  const regex = /^\d{5}-?\d{3}$/
  return regex.test(String(cep || ''))
}

module.exports = {
  validaEmail,
  validaTelefone,
  validaCEP,
  validaCPF,
  validaCNPJ
}