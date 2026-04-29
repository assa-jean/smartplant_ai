import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Charge les statistiques de crédit de l'utilisateur
 */
async function loadUserStats(uid) {
    try {
        // 1. Requête pour récupérer tous les prêts de cet utilisateur
        const q = query(collection(db, "loans"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let valide = 0;
        let enCours = 0;

        // 2. Parcours des documents pour compter selon le statut
        querySnapshot.forEach((doc) => {
            const loan = doc.data();
            total++;

            // Assure-toi que les statuts correspondent exactement à ceux en base (ex: "Validé" et "En cours")
            if (loan.status === "Validé") {
                valide++;
            } else if (loan.status === "En cours" || loan.status === "Analyse du dossier...") {
                enCours++;
            }
        });

        // 3. Mise à jour de l'UI avec les IDs de ton HTML
        document.getElementById('statTotal').innerText = total;
        document.getElementById('statValid').innerText = valide;
        document.getElementById('statPending').innerText = enCours;

        // Optionnel : Si tu as un graphique, appelle sa mise à jour ici
        // updateChart(valide, enCours);

    } catch (error) {
        console.error("Erreur lors du calcul des stats :", error);
    }
}

/**
 * Initialisation au chargement de la page
 */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Charger les infos de base du profil
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('profName').innerText = data.fullName;
            document.getElementById('profEmail').innerText = data.email;
            document.getElementById('profPhone').innerText = data.phone || "Non renseigné";
            document.getElementById('userInitial').innerText = data.fullName.charAt(0).toUpperCase();
        }

        // Charger les compteurs de crédits
        loadUserStats(user.uid);
    } else {
        window.location.href = "index.html";
    }
});