import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Affiche le nom de l'utilisateur dans le header
 */
async function displayWelcomeMessage(user) {
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const fullName = userData.fullName || "Agriculteur";
            // On prend le premier mot (ex: "Narcisse")
            const firstName = fullName.split(' ')[0]; 
            document.getElementById('userName').innerText = firstName.toLowerCase();
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
    }
}

/**
 * Charge et affiche les demandes de crédits dans le slider horizontal
 */
async function displayUserLoans(uid) {
    const slider = document.getElementById('loanSlider');
    const q = query(collection(db, "loans"), where("userId", "==", uid));
    
    try {
        const querySnapshot = await getDocs(q);
        
        // On vide le slider (évite les doublons au rafraîchissement)
        slider.innerHTML = "";

        if (querySnapshot.empty) {
            slider.innerHTML = `
                <div class="px-6 py-4 bg-emerald-50/50 rounded-3xl border border-dashed border-emerald-200">
                    <p class="text-emerald-600 text-xs font-medium text-center">Aucune demande de crédit active.</p>
                </div>
            `;
            return;
        }

        querySnapshot.forEach((doc) => {
            const loan = doc.data();
            
            // Création de la carte HTML pour chaque demande
            // Utilisation de flex-shrink-0 et min-w pour un slider parfait sur mobile
            const card = `
                <div class="min-w-[85vw] sm:min-w-[320px] snap-start relative overflow-hidden bg-white rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50/50 flex-shrink-0">
                    <div class="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50/50 rounded-full -z-0"></div>
                    
                    <div class="relative flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <i class="fa-solid fa-hand-holding-dollar text-xl"></i>
                        </div>
                        <div>
                            <p class="font-black text-gray-800 text-base leading-tight">${loan.itemType}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Demande #${doc.id.slice(0, 5)}</p>
                        </div>
                    </div>

                    <div class="relative space-y-2">
                        <div class="flex justify-between items-end">
                            <span class="text-[11px] font-bold text-emerald-600 italic">${loan.status}</span>
                            <span class="text-sm font-black text-emerald-900">${loan.progress}%</span>
                        </div>
                        <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
                            <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                                 style="width: ${loan.progress}%">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-gray-300">
                        <span class="text-[9px] font-bold uppercase tracking-tighter">Détails de l'examen</span>
                        <i class="fa-solid fa-chevron-right text-[10px]"></i>
                    </div>
                </div>
            `;
            slider.innerHTML += card;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des demandes :", error);
        slider.innerHTML = "<p class='text-red-400 text-xs px-6'>Erreur de chargement des données.</p>";
    }
}

/**
 * Surveillance de l'état de connexion
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Lancement simultané des deux fonctions
        displayWelcomeMessage(user);
        displayUserLoans(user.uid);
    } else {
        // Redirection si l'utilisateur n'est pas connecté
        window.location.href = "index.html";
    }
});