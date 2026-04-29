import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function displayUserLoans(uid) {
    const slider = document.getElementById('loanSlider');
    const q = query(collection(db, "loans"), where("userId", "==", uid));
    
    try {
        const querySnapshot = await getDocs(q);
        
        // On vide le slider avant d'ajouter les cartes
        slider.innerHTML = "";

        if (querySnapshot.empty) {
            slider.innerHTML = "<p class='text-gray-400 text-xs px-6'>Aucune demande en cours.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const loan = doc.data();
            
            // Création de la carte HTML pour chaque demande
            const card = `
                <div class="min-w-[85%] snap-center relative overflow-hidden bg-white rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50/50">
                    <div class="relative flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <i class="fa-solid fa-hand-holding-dollar text-xl"></i>
                        </div>
                        <div>
                            <p class="font-black text-gray-800 text-base leading-tight">${loan.itemType}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Demande #${doc.id.slice(0, 5)}</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between items-end">
                            <span class="text-[11px] font-bold text-emerald-600 italic">${loan.status}</span>
                            <span class="text-sm font-black text-emerald-900">${loan.progress}%</span>
                        </div>
                        <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
                            <div class="h-full bg-emerald-500 rounded-full transition-all duration-1000" style="width: ${loan.progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
            slider.innerHTML += card;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des demandes:", error);
    }
}

// Appelle cette fonction dans ton onAuthStateChanged
auth.onAuthStateChanged((user) => {
    if (user) {
        displayUserLoans(user.uid);
    }
});