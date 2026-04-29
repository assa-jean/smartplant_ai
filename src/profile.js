import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 1. Récupérer les infos de Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            
            // 2. Mettre à jour l'UI
            document.getElementById('profName').innerText = data.fullName;
            document.getElementById('profEmail').innerText = data.email;
            document.getElementById('profPhone').innerText = data.phone || "Non renseigné";
            document.getElementById('userInitial').innerText = data.fullName.charAt(0).toUpperCase();
        }
    } else {
        window.location.href = "index.html";
    }
});

// Déconnexion
document.getElementById('btnLogout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});