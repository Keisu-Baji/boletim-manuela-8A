// ============================================
// DADOS BRUTOS (fictícios) — 8º Ano
// ============================================
// Array = lista. Cada item é um objeto com informações da disciplina.
const dados = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

const MEDIA_MINIMA = 6.0;

// Frequência APENAS DEMONSTRATIVA (fictícia).
// No futuro, isso será calculado de outra forma com dados reais.
const FREQUENCIA_DEMONSTRATIVA = 92;

// ============================================
// FUNÇÃO: normalizarNota
// ============================================
// Converte o valor recebido para a escala 0 a 10.
// Retorna null quando a nota ainda não foi lançada ou é inválida.
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto e converte para número
  let numero;
  if (typeof valor === "string") {
    numero = Number(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não virou um número válido, é inválido
  if (isNaN(numero)) {
    return null;
  }

  // Valores entre 0 e 10 permanecem iguais
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Valores maiores que 10 e até 100 são divididos por 10
  // Ex.: 100 -> 10.0 | 89 -> 8.9 | 75 -> 7.5
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras = inválido
  return null;
}

// ============================================
// FUNÇÃO: calcularMedia
// ============================================
// Recebe uma lista de notas (já normalizadas) e calcula a média
// usando SOMENTE as notas disponíveis (não transforma ausente em 0).
function calcularMedia(notas) {
  const notasValidas = notas.filter(function (n) {
    return n !== null;
  });

  if (notasValidas.length === 0) {
    return null; // nenhuma nota válida
  }

  let soma = 0;
  notasValidas.forEach(function (n) {
    soma = soma + n;
  });

  return soma / notasValidas.length;
}

// ============================================
// FUNÇÃO: definirSituacao
// ============================================
// Usa if para decidir a situação conforme a média.
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

// ============================================
// FUNÇÃO: somarFaltas
// ============================================
// Soma os valores de um array de faltas (números inteiros).
function somarFaltas(lista) {
  let total = 0;
  lista.forEach(function (f) {
    total = total + f;
  });
  return total;
}

// ============================================
// FUNÇÃO: formatarNota
// ============================================
// Mostra a nota com 1 casa decimal ou "—" se não houver nota.
function formatarNota(n) {
  if (n === null) {
    return "—";
  }
  return n.toFixed(1).replace(".", ",");
}

// ============================================
// DOM: pegar elementos do HTML
// ============================================
const corpoTabela = document.getElementById("corpoTabela");
const elMediaGeral = document.getElementById("mediaGeral");
const elTotalFaltas = document.getElementById("totalFaltas");
const elQtdBom = document.getElementById("qtdBom");
const elQtdAtencao = document.getElementById("qtdAtencao");
const elFrequencia = document.getElementById("frequencia");

// ============================================
// PROCESSAMENTO DOS DADOS
// ============================================
let somaMedias = 0;      // soma das médias válidas (para média geral)
let qtdMedias = 0;       // quantas médias válidas existem
let totalFaltasGeral = 0;
let qtdBom = 0;
let qtdAtencao = 0;

// forEach percorre cada disciplina do array "dados"
dados.forEach(function (item) {
  // Normaliza as notas dos 3 trimestres
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula média (ignora ausentes)
  const media = calcularMedia([n1, n2, n3]);
  const situacao = definirSituacao(media);

  // Soma as faltas da disciplina
  const faltasDisciplina = somarFaltas(item.faltas);
  totalFaltasGeral = totalFaltasGeral + faltasDisciplina;

  // Contadores dos cards
  if (media !== null) {
    somaMedias = somaMedias + media;
    qtdMedias = qtdMedias + 1;
  }
  if (situacao === "Bom desempenho") {
    qtdBom = qtdBom + 1;
  } else if (situacao === "Atenção") {
    qtdAtencao = qtdAtencao + 1;
  }

  // Define a classe CSS da situação
  let classeSituacao = "situacao-indisponivel";
  if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (situacao === "Atenção") classeSituacao = "situacao-atencao";

  // Cria a linha da tabela dinamicamente
  const linha = document.createElement("tr");
  linha.innerHTML =
    "<td>" + item.disciplina + "</td>" +
    "<td>" + formatarNota(n1) + "</td>" +
    "<td>" + formatarNota(n2) + "</td>" +
    "<td>" + formatarNota(n3) + "</td>" +
    "<td>" + (media === null ? "—" : media.toFixed(1).replace(".", ",")) + "</td>" +
    "<td>" + faltasDisciplina + "</td>" +
    "<td class='" + classeSituacao + "'>" + situacao + "</td>";

  corpoTabela.appendChild(linha);
});

// ============================================
// PREENCHER OS CARDS
// ============================================
// Média geral = média das médias disponíveis
if (qtdMedias > 0) {
  const mediaGeral = somaMedias / qtdMedias;
  elMediaGeral.textContent = mediaGeral.toFixed(1).replace(".", ",");
} else {
  elMediaGeral.textContent = "—";
}

elTotalFaltas.textContent = totalFaltasGeral;
elQtdBom.textContent = qtdBom;
elQtdAtencao.textContent = qtdAtencao;

// Frequência demonstrativa (não calculada a partir das faltas)
elFrequencia.textContent = FREQUENCIA_DEMONSTRATIVA + "%";