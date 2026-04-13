// Initialize Lucide Icons
lucide.createIcons();

// State
let navigationStack = ['home-screen'];
let selectedCause = {
    name: 'árbol plantado',
    icon: 'tree-pine',
    colorClass: 'bg-green',
    textColor: 'green'
};
let destinationAmount = 1;

// Elements
const headerTitle = document.getElementById('header-title');
const backButton = document.getElementById('back-btn');
const slider = document.getElementById('amount-slider');
const sliderVal = document.getElementById('slider-val');
const impactResult = document.getElementById('impact-result');

// Navigation Function
function navigate(screenId, title, resetStack = false) {
    // Hide current screen
    const currentScreenId = navigationStack[navigationStack.length - 1];
    document.getElementById(currentScreenId).classList.remove('active');

    // Update Stack
    if (resetStack) {
        navigationStack = ['home-screen', screenId];
    } else {
        navigationStack.push(screenId);
    }

    // Show new screen
    document.getElementById(screenId).classList.add('active');

    // Update Header
    headerTitle.innerText = title;
    backButton.style.display = navigationStack.length > 1 ? 'flex' : 'none';

    // Special logic for confirmation screen
    if (screenId === 'confirm-screen') {
        setTimeout(() => {
            document.getElementById('success-icon-container').classList.add('animate');
        }, 100);
    } else {
        // Reset animation state
        document.getElementById('success-icon-container').classList.remove('animate');
    }
}

// Back Button Logic
backButton.addEventListener('click', () => {
    if (navigationStack.length > 1) {
        const currentScreenId = navigationStack.pop();
        const prevScreenId = navigationStack[navigationStack.length - 1];
        
        document.getElementById(currentScreenId).classList.remove('active');
        document.getElementById(prevScreenId).classList.add('active');

        // Restore Title
        if (prevScreenId === 'home-screen') headerTitle.innerText = 'Ibercaja';
        else if (prevScreenId === 'manage-screen') headerTitle.innerText = 'Gestionar cashback';
        else if (prevScreenId === 'choose-screen') headerTitle.innerText = 'Elige tu impacto';
        else headerTitle.innerText = 'Ibercaja';

        backButton.style.display = navigationStack.length > 1 ? 'flex' : 'none';
    }
});

const categoriesInfo = {
    'medioambiente': {
        icon: 'tree-pine', colorClass: 'bg-green', title: 'Medioambiente',
        actions: [
            { id: 'arboles', text: 'Plantar árboles', unit: 'árbol plantado', multi: 'árboles plantados', factor: 1 },
            { id: 'limpiar', text: 'Limpiar bosques', unit: 'm² limpio', multi: 'm² limpios', factor: 10 },
            { id: 'fauna', text: 'Rescate de fauna', unit: 'rescate', multi: 'rescates', factor: 0.5 }
        ],
        zones: [
            { id: 'local', text: 'Local (< 50km)' },
            { id: 'nacional', text: 'Nacional' },
            { id: 'amazonas', text: 'Amazonas' }
        ]
    },
    'educacion': {
        icon: 'book-open', colorClass: 'bg-blue', title: 'Educación',
        actions: [
            { id: 'material', text: 'Material escolar', unit: 'kit', multi: 'kits', factor: 1 },
            { id: 'comedor', text: 'Comedores escolares', unit: 'menú', multi: 'menús', factor: 0.5 }
        ],
        zones: [
            { id: 'colegio', text: 'Colegio de tu zona' },
            { id: 'nacional', text: 'Nacional' },
            { id: 'senegal', text: 'Senegal' }
        ]
    },
    'agua': {
        icon: 'droplet', colorClass: 'bg-cyan', title: 'Agua',
        actions: [
            { id: 'potabilizar', text: 'Potabilizar agua', unit: 'litro de agua', multi: 'litros de agua', factor: 5 },
            { id: 'pozos', text: 'Construir pozos', unit: 'cm de pozo', multi: 'cm de pozo', factor: 0.1 }
        ],
        zones: [
            { id: 'nacional', text: 'Zonas rurales' },
            { id: 'kenia', text: 'Kenia' },
            { id: 'india', text: 'India' }
        ]
    },
    'salud': {
        icon: 'heart', colorClass: 'bg-red text-white', title: 'Salud',
        actions: [
            { id: 'kits', text: 'Kits médicos', unit: 'kit médico', multi: 'kits médicos', factor: 1 },
            { id: 'investigacion', text: 'Investigación', unit: 'hora', multi: 'horas', factor: 0.2 }
        ],
        zones: [
            { id: 'hospital', text: 'Hospital local' },
            { id: 'nacional', text: 'Nacional' },
            { id: 'global', text: 'ONG Internacional' }
        ]
    },
    'inclusion': {
        icon: 'users', colorClass: 'bg-orange', title: 'Inclusión Social',
        actions: [
            { id: 'comida', text: 'Bancos de alimentos', unit: 'ración', multi: 'raciones', factor: 2 },
            { id: 'refugio', text: 'Noches de refugio', unit: 'noche', multi: 'noches', factor: 0.5 }
        ],
        zones: [
            { id: 'barrio', text: 'Tu barrio' },
            { id: 'ciudad', text: 'Tu ciudad' }
        ]
    },
    'cultura': {
        icon: 'palette', colorClass: 'bg-purple', title: 'Cultura',
        actions: [
            { id: 'museo', text: 'Entradas de museo', unit: 'entrada', multi: 'entradas', factor: 0.5 },
            { id: 'taller', text: 'Talleres artísticos', unit: 'taller', multi: 'talleres', factor: 0.2 }
        ],
        zones: [
            { id: 'local', text: 'Biblioteca local' },
            { id: 'museo', text: 'Museo provincial' }
        ]
    },
    'ciencia': {
        icon: 'microscope', colorClass: 'bg-pink', title: 'Investig. Científica',
        actions: [
            { id: 'horas', text: 'Horas de laboratorio', unit: 'hora', multi: 'horas', factor: 0.1 },
            { id: 'equipamiento', text: 'Equipamiento', unit: 'kit', multi: 'kits', factor: 0.5 }
        ],
        zones: [
            { id: 'universidad', text: 'Universidad local' },
            { id: 'nacional', text: 'Instituto Nacional' },
            { id: 'global', text: 'Global' }
        ]
    },
    'deporte': {
        icon: 'medal', colorClass: 'bg-yellow', title: 'Deporte local',
        actions: [
            { id: 'balon', text: 'Material deportivo', unit: 'balón', multi: 'balones', factor: 0.5 },
            { id: 'equipacion', text: 'Equipaciones', unit: 'kit', multi: 'kits', factor: 0.2 }
        ],
        zones: [
            { id: 'club', text: 'Club de tu barrio' },
            { id: 'escuela', text: 'Escuelas deportivas' }
        ]
    }
};

let currentState = {
    categoryId: null,
    actionIndex: null,
    zoneId: null,
    amount: 1
};

// Select Category Logic
function selectCategory(element, categoryId) {
    document.querySelectorAll('#causes-grid-container .cause-card').forEach(card => card.classList.remove('selected'));
    if(element) element.classList.add('selected');
    
    currentState.categoryId = categoryId;
    currentState.actionIndex = null;
    currentState.zoneId = null;
    
    // Render Actions
    const actionsContainer = document.getElementById('action-options-container');
    actionsContainer.innerHTML = '';
    categoriesInfo[categoryId].actions.forEach((act, idx) => {
        actionsContainer.innerHTML += `
            <button class="pill-btn" onclick="selectAction(this, ${idx})">
                <span>${act.text}</span>
                <i data-lucide="check"></i>
            </button>`;
    });
    
    document.getElementById('step-action').style.display = 'block';
    document.getElementById('step-zone').style.display = 'none';
    document.getElementById('step-slider').style.display = 'none';
    document.getElementById('confirm-btn-container').style.display = 'none';
    
    lucide.createIcons();
    
    setTimeout(() => {
        const scrollable = document.querySelector('.scrollable-content');
        scrollable.scrollBy({ top: 150, behavior: 'smooth' });
    }, 100);
}

function selectAction(element, actionIndex) {
    document.querySelectorAll('#action-options-container .pill-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    
    currentState.actionIndex = actionIndex;
    currentState.zoneId = null;
    
    // Render Zones
    const zonesContainer = document.getElementById('zone-options-container');
    zonesContainer.innerHTML = '';
    const category = categoriesInfo[currentState.categoryId];
    category.zones.forEach((z) => {
        zonesContainer.innerHTML += `
            <button class="pill-btn" onclick="selectZone(this, '${z.id}')">
                <span>${z.text}</span>
                <i data-lucide="check"></i>
            </button>`;
    });
    
    document.getElementById('step-zone').style.display = 'block';
    document.getElementById('step-slider').style.display = 'none';
    document.getElementById('confirm-btn-container').style.display = 'none';
    
    lucide.createIcons();
    
    setTimeout(() => {
        const scrollable = document.querySelector('.scrollable-content');
        scrollable.scrollBy({ top: 150, behavior: 'smooth' });
    }, 100);
}

function selectZone(element, zoneId) {
    document.querySelectorAll('#zone-options-container .pill-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    
    currentState.zoneId = zoneId;
    
    document.getElementById('step-slider').style.display = 'block';
    document.getElementById('confirm-btn-container').style.display = 'block';
    
    updateImpactResult();
    
    setTimeout(() => {
        const scrollable = document.querySelector('.scrollable-content');
        scrollable.scrollBy({ top: 250, behavior: 'smooth' });
    }, 100);
}

// Slider Logic
slider.addEventListener('input', (e) => {
    currentState.amount = parseFloat(e.target.value);
    sliderVal.innerText = currentState.amount.toFixed(2);
    updateImpactResult();
});

function updateImpactResult() {
    if (currentState.categoryId === null || currentState.actionIndex === null) return;
    
    const category = categoriesInfo[currentState.categoryId];
    const action = category.actions[currentState.actionIndex];
    
    let generated = currentState.amount * action.factor;
    if (generated < 1 && generated > 0) generated = generated.toFixed(1);
    else generated = Math.floor(generated);
    
    if (generated == 1 || generated == "1.0") {
         impactResult.innerText = `${generated} ${action.unit}`;
    } else {
         impactResult.innerText = `${generated} ${action.multi}`;
    }
}

// Confirm Impact Logic
function confirmImpact() {
    const category = categoriesInfo[currentState.categoryId];
    
    const successIcon = document.getElementById('success-icon');
    const iconContainer = document.getElementById('success-icon-container');
    const successSubtitle = document.getElementById('success-subtitle');
    
    successIcon.setAttribute('data-lucide', category.icon);
    iconContainer.className = `success-icon-wrapper ${category.colorClass}`;
    
    const zoneName = category.zones.find(z => z.id === currentState.zoneId).text;
    successSubtitle.innerText = `Has contribuido a generar ${impactResult.innerText} (${zoneName})`;
    
    lucide.createIcons();
    addTimelineEvent(category);
    navigate('confirm-screen', '¡Éxito!');
}

function addTimelineEvent(category) {
    const newItem = document.getElementById('new-timeline-item');
    newItem.style.display = 'block';
    
    const iconDiv = newItem.querySelector('.timeline-icon');
    iconDiv.className = `timeline-icon ${category.colorClass}`;
    
    newItem.querySelector('h4').innerText = category.title;
    newItem.querySelector('#new-timeline-desc').innerText = `+${impactResult.innerText}`;
    
    const iconEl = newItem.querySelector('i');
    iconEl.setAttribute('data-lucide', category.icon);
    
    lucide.createIcons();
    
    if (currentState.categoryId === 'medioambiente') {
        const trees = document.getElementById('total-trees');
        trees.innerText = parseInt(trees.innerText) + 1;
    }
}
