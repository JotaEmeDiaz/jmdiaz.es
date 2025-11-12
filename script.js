// Elementos del DOM
const terminalBody = document.getElementById('terminalBody');
const deleteBtn = document.getElementById('deleteBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Estado de la simulación
let isDeleting = false;

// Archivos y carpetas simulados para eliminar
const filesToDelete = [
    'C:\\Users\\Usuario\\Documentos\\',
    'C:\\Users\\Usuario\\Descargas\\',
    'C:\\Users\\Usuario\\Imágenes\\',
    'C:\\Users\\Usuario\\Videos\\',
    'C:\\Users\\Usuario\\Música\\',
    'C:\\Program Files\\',
    'C:\\Program Files (x86)\\',
    'C:\\Windows\\System32\\',
    'C:\\Windows\\SysWOW64\\',
    'C:\\Users\\Usuario\\Desktop\\proyecto_importante.docx',
    'C:\\Users\\Usuario\\Desktop\\fotos_vacaciones_2024.zip',
    'C:\\Users\\Usuario\\Desktop\\tesis_final.pdf',
    'C:\\Users\\Usuario\\Documentos\\contraseñas.txt',
    'C:\\Users\\Usuario\\Documentos\\datos_bancarios.xlsx',
    'D:\\Backup\\',
    'D:\\Juegos\\',
];

// Función para añadir una línea al terminal
function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'line' + (className ? ' ' + className : '');
    line.textContent = text;
    
    // Eliminar el cursor anterior
    const oldCursor = terminalBody.querySelector('.cursor');
    if (oldCursor) {
        oldCursor.remove();
    }
    
    terminalBody.appendChild(line);
    
    // Scroll al final
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Función para simular la escritura de comando
async function typeCommand(command) {
    const line = document.createElement('div');
    line.className = 'line';
    
    // Eliminar el cursor anterior
    const oldCursor = terminalBody.querySelector('.cursor');
    if (oldCursor) {
        oldCursor.remove();
    }
    
    terminalBody.appendChild(line);
    
    for (let i = 0; i < command.length; i++) {
        line.textContent = command.substring(0, i + 1);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        await sleep(50 + Math.random() * 50);
    }
}

// Función de espera
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función principal de simulación de eliminación
async function startDeletion() {
    if (isDeleting) return;
    
    isDeleting = true;
    deleteBtn.disabled = true;
    cancelBtn.disabled = true;
    
    // Comando inicial
    await typeCommand('C:\\Users\\Usuario> del /F /S /Q C:\\*.*');
    await sleep(500);
    
    addLine('');
    addLine('Iniciando eliminación de archivos del sistema...', 'error');
    addLine('');
    await sleep(1000);
    
    // Simular eliminación de archivos
    for (let i = 0; i < filesToDelete.length; i++) {
        const file = filesToDelete[i];
        addLine(`Eliminando: ${file}`);
        await sleep(200 + Math.random() * 300);
        
        if (Math.random() > 0.3) {
            addLine(`   ✓ ${file} eliminado correctamente`, 'success');
        } else {
            addLine(`   ⚠ Acceso denegado: ${file}`, 'error');
        }
        await sleep(100);
    }
    
    await sleep(1000);
    addLine('');
    addLine('═══════════════════════════════════════════', 'error');
    addLine('PROCESO COMPLETADO', 'error');
    addLine('═══════════════════════════════════════════', 'error');
    addLine('');
    addLine(`Archivos afectados: ${filesToDelete.length}`, 'error');
    addLine('Estado: FINALIZADO', 'error');
    addLine('');
    await sleep(2000);
    
    addLine('');
    addLine('😄 ¡Era broma! Ningún archivo fue eliminado.', 'success');
    addLine('Tu computadora está perfectamente a salvo.', 'success');
    addLine('');
    
    // Añadir cursor al final
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';
    const lastLine = document.createElement('div');
    lastLine.className = 'line';
    lastLine.textContent = 'C:\\Users\\Usuario> ';
    lastLine.appendChild(cursor);
    terminalBody.appendChild(lastLine);
    
    isDeleting = false;
    deleteBtn.disabled = false;
    cancelBtn.disabled = false;
}

// Función de cancelación
async function cancelDeletion() {
    if (isDeleting) {
        addLine('');
        addLine('No se puede cancelar un proceso en ejecución...', 'error');
        addLine('(Tranquilo, esto es solo una broma)', 'success');
        return;
    }
    
    // Eliminar el cursor anterior
    const oldCursor = terminalBody.querySelector('.cursor');
    if (oldCursor) {
        oldCursor.remove();
    }
    
    await typeCommand('C:\\Users\\Usuario> exit');
    await sleep(300);
    addLine('');
    addLine('✓ Operación cancelada con éxito.', 'success');
    addLine('Ningún archivo fue eliminado.', 'success');
    addLine('Tu sistema está seguro. 😊', 'success');
    addLine('');
    
    // Añadir cursor al final
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';
    const lastLine = document.createElement('div');
    lastLine.className = 'line';
    lastLine.textContent = 'C:\\Users\\Usuario> ';
    lastLine.appendChild(cursor);
    terminalBody.appendChild(lastLine);
}

// Event listeners
deleteBtn.addEventListener('click', startDeletion);
cancelBtn.addEventListener('click', cancelDeletion);

// Easter egg: Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isDeleting) {
        const cursor = terminalBody.querySelector('.cursor');
        if (cursor) {
            const parentLine = cursor.parentElement;
            if (parentLine && parentLine.textContent.trim().endsWith('_')) {
                addLine('');
                addLine('Usa los botones de abajo para interactuar. 😉', 'success');
                addLine('');
                
                // Añadir nuevo cursor
                const newCursor = document.createElement('span');
                newCursor.className = 'cursor';
                newCursor.textContent = '_';
                const newLine = document.createElement('div');
                newLine.className = 'line';
                newLine.textContent = 'C:\\Users\\Usuario> ';
                newLine.appendChild(newCursor);
                terminalBody.appendChild(newLine);
            }
        }
    }
});
