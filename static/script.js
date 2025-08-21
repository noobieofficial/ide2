/* costanti */
const form = document.getElementById("code-form");
const textarea = document.getElementById("program");
const numbers = document.getElementById("line-numbers");
const output = document.getElementById("console-output")

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





/* aggiungiamo un evento sul submit del form */
form.addEventListener("submit", async function(event) {
    event.preventDefault(); /* evita che la pagina si ricarichi */

    /* prendiamo il contenuto della textarea */
    const code = document.getElementById("program").value;

    /* inviamo il codice al server con una chiamata fetch */
    const response = await fetch("/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ program: code })
    });

    /* aspettiamo la risposta e la convertiamo in JSON */
    const result = await response.json();

    /* mettiamo l'output nella console (nella pagina) */
    output.textContent = result.output;

    output.classList.add("updated");
    setTimeout(() => output.classList.remove("updated"), 300);
});





/* gestione salva/apri/pulisci */
document.getElementById('run-btn').addEventListener('click', () => {
    document.getElementById('code-form').requestSubmit();
});

document.getElementById('save-btn').addEventListener('click', () => {
    const code = document.getElementById('program').value;
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'code.noob';
    link.click();
});

document.getElementById("clear-btn").addEventListener('click', () => {
    output.textContent = "";
})

document.getElementById('open-file').addEventListener('change', event => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.noob')) {
        const reader = new FileReader();
        reader.onload = e => {
            textarea.value = e.target.result;
            updateLineNumbers();
        };
        reader.readAsText(file);
    } else {
        alert("Choose a .noob file");
    }
});
