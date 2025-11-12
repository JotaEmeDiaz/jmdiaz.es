// Elementos del DOM
const terminalBody = document.getElementById('terminalBody');
const countdownLine = document.getElementById('countdownLine');
const cancelBtn = document.getElementById('cancelBtn');

// Estado de la simulación
let isDeleting = false;
let countdownInterval = null;
let currentCountdown = 10;
let currentInputField = null;

// Archivos y carpetas simulados para eliminar (Linux paths)
const filesToDelete = [
    '/home/usuario/Documentos/',
    '/home/usuario/Descargas/',
    '/home/usuario/Imágenes/',
    '/home/usuario/Videos/',
    '/home/usuario/Música/',
    '/home/usuario/Desktop/',
    '/usr/bin/',
    '/usr/lib/',
    '/etc/',
    '/var/',
    '/home/usuario/Documentos/proyecto_importante.odt',
    '/home/usuario/Descargas/fotos_vacaciones_2024.tar.gz',
    '/home/usuario/Documentos/tesis_final.pdf',
    '/home/usuario/Documentos/contraseñas.txt',
    '/home/usuario/Documentos/datos_bancarios.xlsx',
    '/home/usuario/.ssh/id_rsa',
    '/home/usuario/.config/',
    '/opt/',
    '/boot/',
    '/root/',
];

// Función para añadir una línea al terminal
function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'line' + (className ? ' ' + className : '');
    line.textContent = text;
    
    terminalBody.appendChild(line);
    
    // Scroll al final
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Función para crear una línea de entrada interactiva
function createInputLine() {
    if (isDeleting) return;
    
    // Eliminar campo de entrada anterior si existe
    if (currentInputField) {
        currentInputField.disabled = true;
    }
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'line input-line';
    
    const prompt = document.createElement('span');
    prompt.textContent = 'root@system:~# ';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input-field';
    input.autocomplete = 'off';
    input.spellcheck = false;
    
    inputContainer.appendChild(prompt);
    inputContainer.appendChild(input);
    terminalBody.appendChild(inputContainer);
    
    currentInputField = input;
    input.focus();
    
    // Scroll al final
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    // Manejar el envío del comando
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            input.disabled = true;
            
            if (command) {
                // Mostrar el comando completo
                addLine(`bash: ${command}: command not found`, 'error');
            }
            
            // Crear nueva línea de entrada si no se está eliminando
            if (!isDeleting) {
                createInputLine();
            }
        }
    });
}

// Función para actualizar el countdown
function updateCountdown() {
    if (currentCountdown >= 0) {
        countdownLine.innerHTML = `root@system:~# Todos tus archivos seran borrados en: <span class="warning">${currentCountdown} s</span>`;
        currentCountdown--;
    } else {
        clearInterval(countdownInterval);
        countdownLine.remove();
        startAutoDeletion();
    }
}

// Función para iniciar el countdown automático
function startCountdown() {
    currentCountdown = 10;
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Función de espera
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función de eliminación automática (cuando llega a 0)
async function startAutoDeletion() {
    if (isDeleting) return;
    
    isDeleting = true;
    cancelBtn.disabled = true;
    
    // Deshabilitar input actual
    if (currentInputField) {
        currentInputField.disabled = true;
    }
    
    addLine('');
    addLine('root@system:~# rm -rf /*');
    await sleep(500);
    
    addLine('');
    addLine('eliminando...', 'error');
    addLine('');
    await sleep(800);
    
    // Simular eliminación de archivos
    for (let i = 0; i < filesToDelete.length; i++) {
        const file = filesToDelete[i];
        addLine(`  [✗] ${file}`, 'error');
        await sleep(150 + Math.random() * 200);
    }
    
    await sleep(1000);
    addLine('');
    addLine('Proceso completado.', 'error');
    addLine('');
    
    isDeleting = false;
}



// Función de cancelación
async function cancelDeletion() {
    if (isDeleting) {
        return;
    }
    
    // Detener el countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Mostrar popup y cerrar
    alert('Hasta pronto!');
    window.close();
    
    // Si window.close() no funciona (por restricciones del navegador)
    // redirigir a página en blanco
    setTimeout(() => {
        window.location.href = 'about:blank';
    }, 100);
}

// Event listeners
cancelBtn.addEventListener('click', cancelDeletion);

// Permitir que el usuario haga clic en el terminal para enfocar el input
terminalBody.addEventListener('click', function() {
    if (currentInputField && !isDeleting) {
        currentInputField.focus();
    }
});

// Iniciar countdown cuando se carga la página
window.addEventListener('load', () => {
    startCountdown();
    // Crear la primera línea de entrada interactiva después de un momento
    setTimeout(() => {
        createInputLine();
    }, 100);
});
