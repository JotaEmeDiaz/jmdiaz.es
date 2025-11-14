// Elementos del DOM
const terminalBody = document.getElementById('terminalBody');
const sobreMiBtn = document.getElementById('sobreMiBtn');
const privacidadBtn = document.getElementById('privacidadBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const categoryButtons = document.getElementById('categoryButtons');
const actionButtons = document.getElementById('actionButtons');

// Estado
let isBooting = false;
let bootInterval = null;
let currentInputField = null;
let booted = false;

// Categorías y servicios
const generalBootMessages = [
    'Comprobando hardware del sistema...',
    'Verificando integridad del kernel...',
    'Iniciando servicios de red...'
];

const categoriesData = [
    {
        command: 'seguridad',
        name: 'Seguridad',
        bootMessage: 'Comprobando seguridad...',
        subElements: [],
        services: [],
        menu: 0,
        description: ''
    },
    {
        command: 'claves',
        name: 'Claves',
        bootMessage: 'Generando claves privadas-públicas...',
        subElements: [],
        services: [],
        menu: 0,
        description: ''
    },
    {
        command: 'encriptacion',
        name: 'Encriptación',
        bootMessage: 'Encriptando datos sensibles...',
        subElements: ['SSL', 'SSH', 'SHA256', 'Criptografia'],
        services: [],
        menu: 0,
        description: ''
    },
    {
        command: 'automatizaciones',
        name: 'Automatizaciones',
        bootMessage: 'Arrancando sistemas de automatización...',
        subElements: ['N8N', 'Make', 'Flowise', 'PostgreSQL', 'Airtable'],
        services: ['N8N'],
        menu: 1,
        description: 'Automatiza tu vida cotidiana con flujos de trabajo inteligentes. Desde correos automáticos hasta integraciones complejas, aquí encontrarás herramientas para que el trabajo se haga solo. ¿Cansado de tareas repetitivas? Deja que N8N, Make y Flowise conviertan tu rutina en un sueño.'
    },
    {
        command: 'redes sociales',
        name: 'Redes sociales',
        bootMessage: 'Conectando redes sociales...',
        subElements: ['Telegram', 'Whatsapp'],
        services: [],
        menu: 0,
        description: ''
    },
    {
        command: 'ia',
        name: 'IA',
        bootMessage: 'Activando IA...',
        subElements: ['ComfyUI', 'ChatGPT', 'Llama3', 'LM Studio', 'Ollama'],
        services: ['ComfyUI', 'ChatGPT', 'Llama3', 'LM Studio', 'Ollama'],
        menu: 1,
        description: 'Lo notas? Lo sientes? El mundo está cambiando, la IA se está apoderando de ti, no es una película, es la realidad. Desde esta sección podrás descubrir cosas que ni imaginas: su uso más espectacular, herramientas ocultas, modelos avanzados como Llama3 o sistemas como ComfyUI ejecutados en local y en servidores especializados! Prepárate para el futuro.'
    },
    {
        command: 'vr',
        name: 'Realidad Virtual',
        bootMessage: 'Activando IA...',
        subElements: ['ComfyUI', 'ChatGPT', 'Llama3', 'LM Studio', 'Ollama'],
        services: ['ComfyUI', 'ChatGPT', 'Llama3', 'LM Studio', 'Ollama'],
        menu: 0
    },
    {
        command: 'domotica',
        name: 'Domótica',
        bootMessage: 'Chequeando servicios, sensores y cámaras:...',
        subElements: ['Home Assistant', 'ESPHome', 'ESP32', 'Sensores', 'Camaras', 'Amazon Alexa', 'Google Home'],
        services: ['ESPHome'],
        menu: 1,
        description: 'Convierte tu hogar en un castillo inteligente. Controla luces, cámaras, sensores y dispositivos con ESPHome y Home Assistant. Desde alarmas automáticas hasta integración con Alexa, aquí domotizas tu vida para que sea más segura y cómoda.'
    },
    {
        command: 'impresion3d',
        name: 'Impresión 3D',
        bootMessage: 'Activando impresoras 3D...',
        subElements: ['Ender 3 v3 SE', 'Klipper', 'Marlin', 'OrcaSlicer', 'Ultimaker Cura', 'ADXL345 Vibration Sensor', 'Input Shaper'],
        services: [],
        menu: 1,
        description: 'Crea objetos del futuro con impresoras 3D. Desde Ender 3 hasta Klipper, explora slicers como OrcaSlicer y sensores avanzados. ¿Quieres imprimir piezas precisas? Esta sección te guía por el mundo de la fabricación aditiva.'
    },
    {
        command: 'hacking',
        name: 'Hacking',
        bootMessage: 'Iniciando hacking tools...',
        subElements: ['Kali Linux', 'Parrot', 'LilyGo', 'NRF24L01', 'Marauder', 'BruceFirmware', 'BLE Jammer', 'sniffer'],
        services: [],
        menu: 1,
        description: 'Explora el lado oscuro de la tecnología. Herramientas como Kali Linux, Parrot y dispositivos NRF24L01 te permiten experimentar con seguridad, jamming y análisis. Recuerda: con gran poder viene gran responsabilidad.'
    },
    {
        command: 'blockchain',
        name: 'Blockchain',
        bootMessage: 'Conectando y analizando blockchain...',
        subElements: ['Web3', 'Bitcoin', 'Ethereum', 'Binance', 'XRP', 'Polkadot'],
        services: [],
        menu: 1,
        description: 'Sumérgete en el mundo de las criptomonedas y contratos inteligentes. Web3, Bitcoin, Ethereum... Analiza transacciones, explora DeFi y descubre el potencial revolucionario de la blockchain.'
    },
    {
        command: 'servidores',
        name: 'Servidores',
        bootMessage: 'Arrancando servidores...',
        subElements: ['Cloudflare', 'VPN', 'Proxmox', 'Adguard', 'Tailscale', 'WireGuard', 'Docker'],
        services: [],
        menu: 1,
        description: 'Gestiona tu infraestructura digital con servidores potentes. Cloudflare para seguridad, Proxmox para virtualización, Docker para contenedores. Construye redes VPN seguras y mantén todo bajo control con Tailscale.'
    }
];

// Generar arrays combinados
const bootMessages = generalBootMessages.concat(categoriesData.map(c => c.bootMessage));
const subElements = generalBootMessages.map(() => []).concat(categoriesData.map(c => c.subElements));
const categories = categoriesData.filter(c => c.menu === 1);
const services = categoriesData.flatMap(c => c.services);

// Mapa de comandos a nombres
const commandToName = Object.fromEntries(categoriesData.map(c => [c.command, c.name]));

// Función para añadir una línea al terminal
function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'line' + (className ? ' ' + className : '');
    line.textContent = text;
    terminalBody.appendChild(line);
    
    // Scroll al final
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    return line; // Devolver la línea para poder modificarla
}

// Función sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para crear una línea de entrada interactiva
function createInputLine() {
    if (isBooting) return;
    
    // Eliminar campo de entrada anterior si existe
    if (currentInputField) {
        currentInputField.disabled = true;
    }
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'line input-line';
    
    const prompt = document.createElement('span');
    prompt.textContent = 'root@jmdiaz:~# ';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input-field';
    input.autocomplete = 'off';
    input.spellcheck = false;
    
    inputContainer.appendChild(prompt);
    inputContainer.appendChild(input);
    terminalBody.appendChild(inputContainer);
    
    currentInputField = input;
    window.currentInputField = input; // Hacer global para el modal
    input.focus();
    
    // Scroll al final
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    // Manejar el envío del comando
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            input.disabled = true;
            inputContainer.remove(); // Remover el contenedor para evitar duplicación
            
            if (command) {
                // Comandos válidos
                const validCommands = categoriesData.map(c => c.command);
                if (validCommands.includes(command) || command === 'sobre-mi' || command === 'reboot') {
                    if (command === 'sobre-mi') {
                        addLine(`root@jmdiaz:~# ${command}`);
                        addLine('');
                        addLine('Hola, soy JMD, desarrollador y entusiasta de la tecnología.', 'success-light');
                        addLine('Apasionado por la IA, domótica, impresión 3D, blockchain y automatizaciones.', 'success-light');
                        addLine('Explorando el futuro de la tecnología con creatividad y responsabilidad.', 'success-light');
                        addLine('');
                        showCustomAlert(`[ Sobre mi ] Estamos construyendo esto! Ten paciencia...`, '');
                        createInputLine();
                    } else if (command === 'reboot') {
                        addLine(`root@jmdiaz:~# ${command}`);
                        addLine('Reiniciando sistema...');
                        setTimeout(() => {
                            localStorage.removeItem('firstBootDate');
                            location.reload();
                        }, 1000);
                    } else {
                        addLine(`root@jmdiaz:~# ${command}`);
                        const category = categoriesData.find(c => c.command === command);
                        const displayName = category.name;
                        const description = category.description;
                        if (description) {
                            addLine('');
                            addLine(description, 'success-light');
                            addLine('');
                        }
                        showCustomAlert(`[ ${displayName} ] Estamos construyendo esto! Ten paciencia...`, '');
                        createInputLine();
                    }
                } else {
                    addLine(`root@jmdiaz:~# ${command}`);
                    addLine(`bash: ${command}: command not found`, 'error');
                    createInputLine();
                }
            } else {
                addLine('root@jmdiaz:~# ');
                createInputLine();
            }
        }
    });
}

// Función para crear botón de categoría
function createCategoryButton(categoryData) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `[ ${categoryData.name} ]`;
    btn.addEventListener('click', () => {
        // Simular escribir el comando en la shell
        if (window.currentInputField && !window.currentInputField.disabled) {
            window.currentInputField.value = categoryData.command;
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            window.currentInputField.dispatchEvent(enterEvent);
        }
    });
    return btn;
}

// Función para mostrar boot
async function startBoot() {
    isBooting = true;

    addLine('');
    await sleep(300);

    for (let i = 0; i < bootMessages.length; i++) {
        // Tiempo aleatorio entre 200-1000ms
        const randomDelay = Math.random() * 300 + 50;
        const subList = subElements[i];
        const subCount = subList.length;
        
        // Calcular subDelays que sumen a randomDelay
        const subDelays = [];
        let remainingTime = randomDelay;
        for (let j = 0; j < subCount; j++) {
            const delay = Math.random() * (remainingTime / (subCount - j));
            subDelays.push(delay);
            remainingTime -= delay;
        }
        
        const maxDots = Math.ceil(randomDelay / 20);
        
        // Línea principal
        const line = addLine(`  ${bootMessages[i]}`, 'warning');
        const dotsSpan = document.createElement('span');
        dotsSpan.className = 'dots';
        line.appendChild(dotsSpan);
        
        // Línea de subelementos
        let subLine = null;
        if (subCount > 0) {
            subLine = addLine('       ', 'sub-line');
        }
        
        // Variables para sincronización
        let dots = 0;
        let timeAccum = 0;
        let subIndex = 0;
        let subTimeAccum = 0;
        let subHtml = subCount > 0 ? '    ' : '';
        
        await new Promise(resolve => {
            const interval = setInterval(() => {
                timeAccum += 20;
                dots++;
                dotsSpan.textContent = '.'.repeat(dots);
                
                // Agregar subelementos si es tiempo
                while (subIndex < subCount && subTimeAccum + subDelays[subIndex] <= timeAccum) {
                    subTimeAccum += subDelays[subIndex];
                    subHtml += ` [ ${subList[subIndex]} ] <span class="sub-ok">[OK]</span>,`;
                    subIndex++;
                }
                if (subLine) {
                    subLine.innerHTML = subHtml.slice(0, -1);
                }
                
                if (dots === maxDots - 1) {
                    dotsSpan.classList.add('warning');
                }
                
                if (dots >= maxDots) {
                    clearInterval(interval);
                    line.className = 'line success';
                    line.innerHTML = `  ${bootMessages[i]}${'.'.repeat(maxDots)} <span class="success-light">[ OK ]</span>`;
                    if (subLine) {
                        subLine.className = 'line sub-line-done';
                    }
                    resolve();
                }
            }, 20);
        });
        
        // Aparecer botones gradualmente
        if (i >= generalBootMessages.length && i < bootMessages.length) {
            const categoryIndex = i - generalBootMessages.length;
            if (categoriesData[categoryIndex].menu === 1) {
                const btn = createCategoryButton(categoriesData[categoryIndex]);
                categoryButtons.appendChild(btn);
                categoryButtons.style.display = 'flex';
            }
        }
    }

    await sleep(300);
    addLine('');
    addLine('####################################', 'success-light');
    addLine('# ¡Bienvenido al sistema [JMDiaz]! #', 'success-light');
    addLine('####################################', 'success-light');
    addLine('');

    // Guardar fecha del primer boot
    const now = new Date();
    localStorage.setItem('firstBootDate', now.toISOString());

    isBooting = false;
    booted = true;
    
    // Crear línea de entrada después del boot
    setTimeout(() => {
        createInputLine();
    }, 500);
}

// Función para mostrar mensaje de boot anterior
function showPreviousBoot() {
    booted = true;
    const firstBootDate = new Date(localStorage.getItem('firstBootDate'));
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = firstBootDate.toLocaleDateString('es-ES', options);

    addLine('');
    addLine(`  Sistemas arrancados el ${formattedDate}`, 'success');
    addLine('####################################', 'success-light');
    addLine('# ¡Bienvenido al sistema [JMDiaz]! #', 'success-light');
    addLine('####################################', 'success-light');
    addLine('');

    // Mostrar botones inmediatamente
    categories.forEach(catData => {
        const btn = createCategoryButton(catData);
        categoryButtons.appendChild(btn);
    });
    categoryButtons.style.display = 'flex';

    setTimeout(() => {
        // Crear línea de entrada después de cargar
        createInputLine();
    }, 1000);
}

// Función para chequear si necesita boot
function checkBootStatus() {
    const firstBootDate = localStorage.getItem('firstBootDate');
    if (!firstBootDate) {
        return true; // Necesita boot
    }

    const bootDate = new Date(firstBootDate);
    const now = new Date();
    const diffTime = now - bootDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 30; // Boot cada 30 días
}

// Función cancelar (Sobre mi)
function cancelBoot() {
    if (!booted) return;
    
    // Simular escribir el comando en la shell
    if (window.currentInputField && !window.currentInputField.disabled) {
        window.currentInputField.value = 'sobre-mi';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        window.currentInputField.dispatchEvent(enterEvent);
    }
}

// Función continuar (Privacidad)
function continuePage() {
    window.location.href = 'privacidad.html';
}

// Función reiniciar sistema
function restartSystem() {
    if (!booted) return;
    
    // Simular escribir el comando en la shell
    if (window.currentInputField && !window.currentInputField.disabled) {
        window.currentInputField.value = 'reboot';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        window.currentInputField.dispatchEvent(enterEvent);
    }
}

// Event listeners
sobreMiBtn.addEventListener('click', cancelBoot);
reiniciarBtn.addEventListener('click', restartSystem);

// Si el botón de privacidad existe, asignar listener
if (privacidadBtn) {
    privacidadBtn.addEventListener('click', continuePage);
}

// Iniciar al cargar
window.addEventListener('load', () => {
    if (checkBootStatus()) {
        startBoot();
    } else {
        showPreviousBoot();
    }
});

// Recuperar foco en la shell cuando la ventana recupera el foco
window.addEventListener('focus', () => {
    setTimeout(() => {
        if (window.currentInputField && !window.currentInputField.disabled) {
            window.currentInputField.focus();
        }
    }, 100);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            if (window.currentInputField && !window.currentInputField.disabled) {
                window.currentInputField.focus();
            }
        }, 100);
    }
});

window.addEventListener('pageshow', (event) => {
    if (!event.persisted) {
        setTimeout(() => {
            if (window.currentInputField && !window.currentInputField.disabled) {
                window.currentInputField.focus();
            }
        }, 100);
    }
});

document.addEventListener('click', () => {
    // No enfocar el input si el modal está abierto
    if (document.querySelector('.custom-modal-overlay')) return;
    
    if (window.currentInputField && !window.currentInputField.disabled) {
        window.currentInputField.focus();
    }
});