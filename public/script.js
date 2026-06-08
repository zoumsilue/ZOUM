const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const generateBtn = document.getElementById('generateBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');
const resetBtn = document.getElementById('resetBtn');
const fileName = document.getElementById('fileName');
const cardsContainer = document.getElementById('cardsContainer');
const successText = document.getElementById('successText');

let selectedFile = null;

// Event listeners pour upload
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
});

// Gestion du fichier sélectionné
function handleFileSelect() {
    const file = fileInput.files[0];
    if (file) {
        selectedFile = file;
        fileName.textContent = file.name;
        fileInfo.style.display = 'block';
        generateBtn.style.display = 'block';
        errorMessage.style.display = 'none';
    }
}

// Génération des cartes
generateBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        showError('Veuillez sélectionner un fichier');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    loadingSpinner.style.display = 'flex';
    resultSection.style.display = 'none';
    errorMessage.style.display = 'none';
    generateBtn.disabled = true;

    try {
        const response = await fetch('/api/generate-cards', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de la génération');
        }

        // Afficher les résultats
        loadingSpinner.style.display = 'none';
        successText.textContent = data.message;
        resultSection.style.display = 'block';
        cardsContainer.innerHTML = '';

        data.cartes.forEach((carte, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-item';
            cardDiv.innerHTML = `
                <div class="card-preview">
                    📄 Carte ${index + 1}
                </div>
                <div class="card-actions">
                    <a href="${carte}" download="carte_${index + 1}.pdf">📥 Télécharger</a>
                    <a href="${carte}" target="_blank">👁️ Aperçu</a>
                </div>
            `;
            cardsContainer.appendChild(cardDiv);
        });

    } catch (error) {
        loadingSpinner.style.display = 'none';
        showError(error.message);
    } finally {
        generateBtn.disabled = false;
    }
});

// Réinitialiser le formulaire
resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    selectedFile = null;
    fileInfo.style.display = 'none';
    generateBtn.style.display = 'none';
    resultSection.style.display = 'none';
    errorMessage.style.display = 'none';
    cardsContainer.innerHTML = '';
    uploadArea.classList.remove('dragover');
});

// Afficher les erreurs
function showError(message) {
    errorMessage.textContent = '❌ ' + message;
    errorMessage.style.display = 'block';
}

// Vérifier la connexion au serveur au chargement
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ Serveur prêt:', data.status);
    } catch (error) {
        console.error('❌ Erreur de connexion au serveur:', error);
        showError('Impossible de se connecter au serveur. Assurez-vous qu\'il est démarré.');
    }
});
