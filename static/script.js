/* costanti */
const textarea = document.getElementById("program");
const numbers = document.getElementById("line-numbers");

/* textarea + numeri riga */
function updateLineNumbers() {
    const lines = textarea.value.split("\n").length;
    let number = "";
    for (let i = 1; i <= lines; i++) {
        number += i + "\n";
    }
    /* rimuovi l'ultimo a capo */
    numbers.textContent = number.slice(0, -1);
}

/* sincronizza lo scroll */
textarea.addEventListener("scroll", function() {
    numbers.scrollTop = textarea.scrollTop;
});

textarea.addEventListener("input", updateLineNumbers);
updateLineNumbers();

/* cambia schermata mobile */
function showPanel(id) {
    document.querySelectorAll('.editor, .console').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    /* mostra/nascondi sui dispositivi mobile */
    if (window.innerWidth <= 768) {
        if (id === 'editor-panel') {
            document.getElementById('btn-left').style.display = "none";
            document.getElementById('btn-right').style.display = "block";
        } else {
            document.getElementById('btn-left').style.display = "block";
            document.getElementById('btn-right').style.display = "none";
        }
    } else {
        /* su desktop nasconde sempre */
        document.getElementById('btn-left').style.display = "none";
        document.getElementById('btn-right').style.display = "none";
    }
}

window.onload = () => {
    showPanel('editor-panel');
};

/* controlla il ridemnsionamenteo della finestra */
window.addEventListener('resize', () => {
    const activePanel = document.querySelector('.editor.active') ? 'editor-panel' : 'console-panel';
    showPanel(activePanel);
});