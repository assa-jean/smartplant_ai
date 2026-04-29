import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const userNameSpan = document.getElementById('userName');

// Vérifier si l'utilisateur est connecté
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 1. Récupérer le nom de l'utilisateur
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userNameSpan.innerText = userDoc.data().fullName;
        }

        // 2. Écouter les demandes de micro-loans en temps réel
        listenToLoans(user.uid);
    } else {
        window.location.href = "index.html"; // Rediriger si non connecté
    }
});

function listenToLoans(userId) {
    const q = query(collection(db, "loans"), where("userId", "==", userId));
    
    onSnapshot(q, (snapshot) => {
        const noRequest = document.getElementById('noRequest');
        const activeRequest = document.getElementById('activeRequest');
        
        if (!snapshot.empty) {
            const loanData = snapshot.docs[0].data();
            noRequest.classList.add('hidden');
            activeRequest.classList.remove('hidden');
            
            document.getElementById('loanTitle').innerText = `Demande : ${loanData.itemType}`;
            document.getElementById('progressBar').style.width = `${loanData.progress}%`;
            document.getElementById('loanStatus').innerText = `Statut : ${loanData.status}`;
        } else {
            noRequest.classList.remove('hidden');
            activeRequest.classList.add('hidden');
        }
    });
}

// Fonction de sélection de plante (globale pour le bouton onclick)
window.selectPlant = (name) => {
    alert("Culte sélectionnée : " + name);
    // Ici on pourra stocker le choix pour Gemini
};