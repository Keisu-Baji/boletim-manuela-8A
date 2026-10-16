// ============================================
// CONFIGURAÇÃO FIXA DO ALUNO
// ============================================
// Turma e número de chamada ficam fixos neste projeto.
// Não devem ser alterados pela página.
const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 21,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// ============================================
// DADOS BRUTOS (fictícios) — 8º Ano
// ============================================
// Array = lista. Cada item é um objeto com informações da disciplina.
const dados = [
  { disciplina: "Língua Portuguesa", tri1: 90, tri2: 90, tri3: null, faltas: [2, 3, 0] },
  { disciplina: "Matemática", tri1: 80, tri2: 80, tri3: null, faltas: [0, 4, 0] },
  { disciplina: "Ciências", tri1: 77, tri2: 91, tri3: null, faltas: [5, 5, 0] },
  { disciplina: "História", tri1: 100, tri2: 94, tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Geografia", tri1: 100, tri2: 85, tri3: null, faltas: [7, 0, 0] },
  { disciplina: "Língua Inglesa", tri1: 90, tri2: 84, tri3: null, faltas: [2, 2, 0] },
  { disciplina: "Arte", tri1: 74, tri2: 72, tri3: null, faltas: [1, 3, 0] },
  { disciplina: "Educação Física", tri1: 91, tri2: 90, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Digital", tri1: 70, tri2: 100, tri3: null, faltas: [0, 4, 0] },
  { disciplina: "Educação Financeira", tri1: 80, tri2: 72, tri3: null, faltas: [3, 2, 0] },
  { disciplina: "Estudo Orientado", tri1: 75, tri2: 100, tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Redação e Leitura", tri1: 88, tri2: 90, tri3: null, faltas: [2, 3, 0] },
  { disciplina: "Pensamento Lógico", tri1: 90, tri2: 100, tri3: null, faltas: [2, 2, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: 78, tri2: 63, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 75, tri2: 79, tri3: null, faltas: [0, 0, 0] }
];

const MEDIA_MINIMA = 6.0;

// Frequência APENAS DEMONSTRATIVA (fictícia).
// No futuro, isso será calculado de outra forma com dados reais.
const FREQUENCIA_DEMONSTRATIVA = 92;

// ============================================
// ESTADO EM MEMÓRIA (não usa localStorage/sessionStorage)
// ============================================
let dadosAtuais = [];       // disciplinas atualmente exibidas
let pinDaSessao = null;     // PIN somente em memória durante a sessão
let modoEdicao = false;     // indica se está no modo de edição

// ============================================
// FUNÇÃO: normalizarNota
// ============================================
// Converte o valor recebido para a escala 0 a 10 (dados antigos).
// Retorna null quando a nota ainda não foi lançada ou é inválida.
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero;
  if (typeof valor === "string") {
    numero = Number(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// ============================================
// FUNÇÃO: validarNotaDigitada
// ============================================
// Regra DIFERENTE dos dados antigos.
// Aceita: vazio -> null, número entre 0 e 10 (ponto ou vírgula).
// Retorna { ok: true, valor } ou { ok: false }.
function validarNotaDigitada(texto) {
  if (texto === null || texto === undefined) {
    return { ok: true, valor: null };
  }

  const limpo = String(texto).trim();
  if (limpo === "") {
    return { ok: true, valor: null };
  }

  const numero = Number(limpo.replace(",", "."));
  if (isNaN(numero)) {
    return { ok: false };
  }
  if (numero < 0 || numero > 10) {
    return { ok: false };
  }
  return { ok: true, valor: numero };
}

// ============================================
// FUNÇÃO: validarFaltasDigitadas
// ============================================
// Aceita apenas inteiro >= 0. Vazio é inválido.
function validarFaltasDigitadas(texto) {
  if (texto === null || texto === undefined) {
    return { ok: false };
  }
  const limpo = String(texto).trim();
  if (limpo === "") {
    return { ok: false };
  }
  const numero = Number(limpo);
  if (isNaN(numero) || !Number.isInteger(numero) || numero < 0) {
    return { ok: false };
  }
  return { ok: true, valor: numero };
}

// ============================================
// FUNÇÃO: calcularMedia
// ============================================
// Usa SOMENTE as notas disponíveis (não transforma ausente em 0).
function calcularMedia(notas) {
  const notasValidas = notas.filter(function (n) {
    return n !== null;
  });

  if (notasValidas.length === 0) {
    return null;
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

const telaAcesso = document.getElementById("telaAcesso");
const conteudoBoletim = document.getElementById("conteudoBoletim");
const campoPin = document.getElementById("campoPin");
const btnEntrar = document.getElementById("btnEntrar");
const mensagemAcesso = document.getElementById("mensagemAcesso");

const btnAlterar = document.getElementById("btnAlterar");
const btnSalvar = document.getElementById("btnSalvar");
const mensagemEdicao = document.getElementById("mensagemEdicao");

// ============================================
// RENDERIZAÇÃO
// ============================================
// Limpa a tabela e os cards antes de reconstruir (evita duplicação).
function limparTela() {
  corpoTabela.innerHTML = "";
  elMediaGeral.textContent = "—";
  elTotalFaltas.textContent = "—";
  elQtdBom.textContent = "—";
  elQtdAtencao.textContent = "—";
  elFrequencia.textContent = "—";
}

function renderizar() {
  limparTela();

  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltasGeral = 0;
  let qtdBom = 0;
  let qtdAtencao = 0;

  dadosAtuais.forEach(function (item, indice) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const situacao = definirSituacao(media);

    const faltasDisciplina = somarFaltas(item.faltas);
    totalFaltasGeral = totalFaltasGeral + faltasDisciplina;

    if (media !== null) {
      somaMedias = somaMedias + media;
      qtdMedias = qtdMedias + 1;
    }
    if (situacao === "Bom desempenho") {
      qtdBom = qtdBom + 1;
    } else if (situacao === "Atenção") {
      qtdAtencao = qtdAtencao + 1;
    }

    let classeSituacao = "situacao-indisponivel";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    const linha = document.createElement("tr");

    // Disciplina (sempre textContent por segurança)
    const tdDisciplina = document.createElement("td");
    tdDisciplina.textContent = item.disciplina;
    linha.appendChild(tdDisciplina);

    // Notas dos trimestres
    const notasExibidas = [
      formatarNota(n1),
      formatarNota(n2),
      formatarNota(n3)
    ];

    if (modoEdicao) {
      // Modo edição: campos de input
      const valoresBrutos = [item.tri1, item.tri2, item.tri3];
      for (let i = 0; i < 3; i++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "campo-edicao";
        input.dataset.tipo = "nota";
        input.dataset.indice = indice;
        input.dataset.trimestre = i;
        input.value = valoresBrutos[i] === null || valoresBrutos[i] === undefined
          ? ""
          : String(valoresBrutos[i]);
        td.appendChild(input);
        linha.appendChild(td);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const td = document.createElement("td");
        td.textContent = notasExibidas[i];
        linha.appendChild(td);
      }
    }

    // Média
    const tdMedia = document.createElement("td");
    tdMedia.textContent = media === null ? "—" : formatarNota(media);
    linha.appendChild(tdMedia);

    // Faltas
    const tdFaltas = document.createElement("td");
    if (modoEdicao) {
      const inputF = document.createElement("input");
      inputF.type = "text";
      inputF.className = "campo-edicao";
      inputF.dataset.tipo = "falta";
      inputF.dataset.indice = indice;
      inputF.value = String(item.faltas[0]) + "," + String(item.faltas[1]) + "," + String(item.faltas[2]);
      tdFaltas.appendChild(inputF);
    } else {
      tdFaltas.textContent = String(faltasDisciplina);
    }
    linha.appendChild(tdFaltas);

    // Situação
    const tdSituacao = document.createElement("td");
    tdSituacao.className = classeSituacao;
    tdSituacao.textContent = situacao;
    linha.appendChild(tdSituacao);

    corpoTabela.appendChild(linha);
  });

  // Preencher cards
  if (qtdMedias > 0) {
    const mediaGeral = somaMedias / qtdMedias;
    elMediaGeral.textContent = formatarNota(mediaGeral);
  } else {
    elMediaGeral.textContent = "—";
  }

  elTotalFaltas.textContent = String(totalFaltasGeral);
  elQtdBom.textContent = String(qtdBom);
  elQtdAtencao.textContent = String(qtdAtencao);
  elFrequencia.textContent = FREQUENCIA_DEMONSTRATIVA + "%";
}

// ============================================
// ACESSO POR PIN
// ============================================
async function entrar() {
  const pin = campoPin.value.trim();
  mensagemAcesso.textContent = "";

  if (pin === "") {
    mensagemAcesso.textContent = "Digite o PIN.";
    return;
  }

  mensagemAcesso.textContent = "Conectando...";
  btnEntrar.disabled = true;

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pin
      })
    });

    if (resposta.status === 401) {
      mensagemAcesso.textContent = "Turma, chamada ou PIN inválidos.";
      btnEntrar.disabled = false;
      return;
    }
    if (resposta.status === 429) {
      mensagemAcesso.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      btnEntrar.disabled = false;
      return;
    }
    if (!resposta.ok) {
      mensagemAcesso.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      btnEntrar.disabled = false;
      return;
    }

    const json = await resposta.json();
    pinDaSessao = pin;

    // Guardar cópia local como base (não substitui por lista genérica)
    const baseLocal = dados.map(function (d) {
      return {
        disciplina: d.disciplina,
        tri1: d.tri1,
        tri2: d.tri2,
        tri3: d.tri3,
        faltas: [d.faltas[0], d.faltas[1], d.faltas[2]]
      };
    });

    if (json && json.dados && Array.isArray(json.dados.disciplinas)) {
      // DADOS DA API têm prioridade
      dadosAtuais = json.dados.disciplinas.map(function (d) {
        return {
          disciplina: d.disciplina,
          tri1: d.tri1 !== undefined ? d.tri1 : null,
          tri2: d.tri2 !== undefined ? d.tri2 : null,
          tri3: d.tri3 !== undefined ? d.tri3 : null,
          faltas: Array.isArray(d.faltas) && d.faltas.length === 3
            ? [d.faltas[0], d.faltas[1], d.faltas[2]]
            : [0, 0, 0]
        };
      });
    } else {
      // Sem dados salvos: usar dados fictícios locais
      dadosAtuais = baseLocal;
    }

    // Limpar campo do PIN após sucesso
    campoPin.value = "";

    // Trocar de tela
    telaAcesso.classList.add("escondido");
    conteudoBoletim.classList.remove("escondido");

    renderizar();
  } catch (erro) {
    mensagemAcesso.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    btnEntrar.disabled = false;
  }
}

// ============================================
// EDIÇÃO
// ============================================
function alternarEdicao() {
  modoEdicao = !modoEdicao;
  mensagemEdicao.textContent = "";

  if (modoEdicao) {
    btnAlterar.textContent = "Cancelar edição";
    btnSalvar.classList.remove("escondido");
  } else {
    btnAlterar.textContent = "Alterar dados";
    btnSalvar.classList.add("escondido");
  }

  renderizar();
}

// Recolher valores do modo edição, validando cada campo
function recolherEdicoes() {
  const inputsNotas = corpoTabela.querySelectorAll('input[data-tipo="nota"]');
  const inputsFaltas = corpoTabela.querySelectorAll('input[data-tipo="falta"]');

  // Limpar estados visuais anteriores
  corpoTabela.querySelectorAll("input.campo-edicao").forEach(function (el) {
    el.classList.remove("invalido");
  });

  const novosDados = dadosAtuais.map(function (d) {
    return {
      disciplina: d.disciplina,
      tri1: d.tri1,
      tri2: d.tri2,
      tri3: d.tri3,
      faltas: [d.faltas[0], d.faltas[1], d.faltas[2]]
    };
  });

  let temErro = false;

  inputsNotas.forEach(function (input) {
    const indice = Number(input.dataset.indice);
    const trimestre = Number(input.dataset.trimestre);
    const resultado = validarNotaDigitada(input.value);

    if (!resultado.ok) {
      input.classList.add("invalido");
      temErro = true;
      return;
    }

    if (trimestre === 0) novosDados[indice].tri1 = resultado.valor;
    if (trimestre === 1) novosDados[indice].tri2 = resultado.valor;
    if (trimestre === 2) novosDados[indice].tri3 = resultado.valor;
  });

  inputsFaltas.forEach(function (input) {
    const indice = Number(input.dataset.indice);
    const partes = input.value.split(",");

    if (partes.length !== 3) {
      input.classList.add("invalido");
      temErro = true;
      return;
    }

    const faltasValidadas = [];
    for (let i = 0; i < 3; i++) {
      const r = validarFaltasDigitadas(partes[i]);
      if (!r.ok) {
        input.classList.add("invalido");
        temErro = true;
        return;
      }
      faltasValidadas.push(r.valor);
    }
    novosDados[indice].faltas = faltasValidadas;
  });

  if (temErro) {
    return { ok: false, dados: null };
  }
  return { ok: true, dados: novosDados };
}

async function salvar() {
  mensagemEdicao.textContent = "";

  const coleta = recolherEdicoes();
  if (!coleta.ok) {
    mensagemEdicao.textContent = "Há campos inválidos. Corrija antes de salvar.";
    return;
  }

  mensagemEdicao.textContent = "Salvando...";
  btnSalvar.disabled = true;

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDaSessao,
        dados: {
          disciplinas: coleta.dados
        }
      })
    });

    if (!resposta.ok) {
      mensagemEdicao.textContent = "Não foi possível salvar. Tente novamente.";
      btnSalvar.disabled = false;
      return;
    }

    // Sucesso: atualizar estado e re-renderizar
    dadosAtuais = coleta.dados;
    modoEdicao = false;
    btnAlterar.textContent = "Alterar dados";
    btnSalvar.classList.add("escondido");
    btnSalvar.disabled = false;
    mensagemEdicao.textContent = "Dados salvos com sucesso.";

    renderizar();
  } catch (erro) {
    mensagemEdicao.textContent = "Não foi possível salvar. Tente novamente.";
    btnSalvar.disabled = false;
  }
}

// ============================================
// EVENTOS
// ============================================
btnEntrar.addEventListener("click", entrar);

campoPin.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    entrar();
  }
});

btnAlterar.addEventListener("click", alternarEdicao);
btnSalvar.addEventListener("click", salvar);
