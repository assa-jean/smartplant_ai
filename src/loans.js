import { auth, db } from './firebase-config.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnSubmit = document.getElementById('btnSubmitLoan');
const modal = document.getElementById('loanStatusModal');
const regionSelect = document.getElementById('regionSelect');
const citySelect = document.getElementById('citySelect');

const citiesByRegion = {
    "ADAMAOUA": ["Ngaoundéré", "Meiganga", "Tibati"],
    "CENTRE": ["Yaoundé", "Mbalmayo", "Obala", "Akono"],
    "EST": ["Bertoua", "Batouri", "Abong-Mbang"],
    "EXTREME-NORD": ["Maroua", "Yagoua", "Kousseri", "Mokolo"],
    "LITTORAL": ["Douala", "Edéa", "Moungo", "Nkongsamba", "Loum"],
    "NORD": ["Garoua", "Guider", "Figuil"],
    "NORD-OUEST": ["Bamenda", "Kumbo", "Wum"],
    "OUEST": ["Bafoussam", "Dschang", "Foumban", "Mbouda"],
    "SUD": ["Ebolowa", "Kribi", "Sangmélima"],
    "SUD-OUEST": ["Buea", "Limbe", "Kumba", "Mamfe"]
};

// --- CETTE LOGIQUE DOIT ÊTRE À L'EXTÉRIEUR DU CLIC ---
regionSelect.addEventListener('change', (e) => {
    const selectedRegion = e.target.value;
    citySelect.innerHTML = '<option value="">Sélectionnez une ville</option>';
    
    if (selectedRegion && citiesByRegion[selectedRegion]) {
        citiesByRegion[selectedRegion].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.text = city;
            citySelect.appendChild(option);
        });
    }
});

btnSubmit.addEventListener('click', async () => {
    const user = auth.currentUser;
    const item = document.getElementById('loanItem').value;
    const qty = document.getElementById('loanQty').value;
    const reason = document.getElementById('loanReason').value;
    const region = regionSelect.value;
    const city = citySelect.value;
    const neighborhood = document.getElementById('neighborhood').value;

    if (!user) {
        alert("Session expirée. Veuillez vous reconnecter.");
        window.location.href = "index.html";
        return;
    }

    if (!qty || !reason || !region || !city) {
        alert("Veuillez remplir tous les champs, y compris la région et la ville.");
        return;
    }

    try {
        await addDoc(collection(db, "loans"), {
            userId: user.uid,
            userName: user.displayName || "Agriculteur",
            itemType: item,
            quantity: qty,
            reason: reason,
            region: region,       // AJOUTÉ
            city: city,           // AJOUTÉ
            neighborhood: neighborhood, // AJOUTÉ
            status: "En cours d'examen",
            progress: 30,
            createdAt: new Date()
        });

        modal.classList.remove('hidden');
        setTimeout(() => { window.location.href = "home.html"; }, 2500);

    } catch (error) {
        console.error("Erreur Loan:", error);
        alert("Une erreur est survenue lors de l'envoi.");
    }
});