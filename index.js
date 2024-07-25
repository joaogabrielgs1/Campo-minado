var i, j, contBomba, campo, tabela, x;

// Função para gerar o campo de jogo com base na dificuldade
function geraCampo  (aux)  {
    if (aux == 1) {
        i = 9;
        j = 9;
        contBomba = 10;
    } else if (aux == 2) {
        i = 16;
        j = 16;
        contBomba = 30;
    } else {
        i = 22;
        j = 22;
        contBomba = 60;
    }

    campo = Array.from({ length: i }, () => Array(j).fill(0));

    for (var a = 0; a < contBomba; a++) {
        var x, y;
        do {
            x = Math.floor(Math.random() * i);
            y = Math.floor(Math.random() * j);
        } while (campo[x][y] === -1); 
        campo[x][y] = -1;
    }

    function adicionarAoRedor  (x, y)  {
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; 
                var nx = x + dx;
                var ny = y + dy;
                if (nx >= 0 && nx < i && ny >= 0 && ny < j && campo[nx][ny] !== -1) {
                    campo[nx][ny] += 1;
                }
            }
        }
    };

    for (var x = 0; x < i; x++) {
        for (var y = 0; y < j; y++) {
            if (campo[x][y] === -1) {
                adicionarAoRedor(x, y);
            }
        }
    }

    function gerarTabela  () {
        var str = "";
        for (var a = 0; a < i; a++) {
            str += "<tr>";
            for (var b = 0; b < j; b++) {
                str += "<td class='blocked'></td>";
            }
            str += "</tr>";
        }
        tabela.innerHTML = str;
    }
    gerarTabela();
};

function mostrarMatriz() {
    for (var a = 0; a < i; a++) {
        for (var b = 0; b < j; b++) {
            if (campo[a][b] === -1) {
                tabela.rows[a].cells[b].innerHTML = "&#128163;";
            } else {
                tabela.rows[a].cells[b].innerHTML = campo[a][b];
            }
        }
    }
}

function bandeira(event) {
    var cell = event.target;
    var i = cell.parentNode.rowIndex;
    var j = cell.cellIndex;
    if (cell.className === "blocked") {
        cell.className = "flag";
        cell.innerHTML = "&#128681;";
    } else if (cell.className === "flag") {
        cell.className = "blocked";
        cell.innerHTML = "";
    }
    return false;
}

function init() {
    tabela = document.getElementById("tabela");
    tabela.onclick = verificar;
    tabela.oncontextmenu = bandeira;
    tabela.innerHTML = '';
    var diff = document.getElementById("dificuldade");
    switch (parseInt(diff.value)) {
        case 0:
            x = 1;
            break;
        case 1:
            x = 2;
            break;
        case 2:
            x = 3;
            break;
    }
    geraCampo(x);
    //mostrarMatriz();
}

function limparCelulas(l, c) {
    for (var a = l - 1; a <= l + 1; a++) {
        for (var b = c - 1; b <= c + 1; b++) {
            if (a >= 0 && a < i && b >= 0 && b < j) {
                var cell = tabela.rows[a].cells[b];
                if (cell.className !== "blank") {
                    switch (campo[a][b]) {
                        case -1:
                            break;
                        case 0:
                            cell.innerHTML = "";
                            cell.className = "blank";
                            limparCelulas(a, b);
                            break;
                        default:
                            cell.innerHTML = campo[a][b];
                            cell.className = "n" + campo[a][b];
                    }
                }
            }
        }
    }
}

function mostrarBombas() {
    for (var a = 0; a < i; a++) {
        for (var b = 0; b < j; b++) {
            if (campo[a][b] === -1) {
                var cell = tabela.rows[a].cells[b];
                cell.innerHTML = "&#128163;";
                cell.className = "blank";
            }
        }
    }
}

function verificar(event) {
    var cell = event.target;
    if (cell.className !== "flag") {
        var linha = cell.parentNode.rowIndex;
        var coluna = cell.cellIndex;
        switch (campo[linha][coluna]) {
            case -1:
                mostrarBombas();
                cell.style.backgroundColor = "red";
                tabela.onclick = undefined;
                tabela.oncontextmenu = undefined;
                alert("Você perdeu!");
                break;
            case 0:
                limparCelulas(linha, coluna);
                break;
            default:
                cell.innerHTML = campo[linha][coluna];
                cell.className = "n" + campo[linha][coluna];
        }
        fimDeJogo();
    }
}

function fimDeJogo() {
    var cells = document.querySelectorAll(".blocked, .flag");
    if (cells.length === contBomba) {
        mostrarBombas();
        tabela.onclick = undefined;
        tabela.oncontextmenu = undefined;
        alert("Você venceu!");
    }
}

function registerEvents() {
    init();
    var diff = document.getElementById("dificuldade");
    diff.onchange = init;
}

onload = registerEvents;
