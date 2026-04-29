import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnSignup = document.getElementById('btnSignup');
const statusModal = document.getElementById('statusModal');
const loader = document.getElementById('loader');
const successIcon = document.getElementById('successIcon');
const statusTitle = document.getElementById('statusTitle');
const statusMessage = document.getElementById('statusMessage');

btnSignup.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // --- 1. AFFICHER LE POPUP (LOADING) ---
    statusModal.classList.remove('hidden');
    loader.classList.remove('hidden');
    successIcon.classList.add('hidden');
    statusTitle.innerText = "Inscription en cours";
    statusMessage.innerText = "Création de votre espace agricole...";

    try {
        // 2. Création Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 3. Enregistrement Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: name,
            email: email,
            role: "agriculteur",
            createdAt: new Date()
        });

        // --- 4. SUCCÈS : CHANGER L'ICÔNE ---
        loader.classList.add('hidden');
        successIcon.classList.remove('hidden');
        statusTitle.innerText = "Inscription Réussie !";
        statusMessage.innerText = `Bienvenue ${name}, redirection en cours...`;

        // Attendre 2 secondes pour que l'utilisateur voie le succès, puis rediriger
        setTimeout(() => {
            window.location.href = "home.html";
        }, 2000);

    } catch (error) {
        // En cas d'erreur, on ferme le popup et on affiche l'alerte
        statusModal.classList.add('hidden');
        console.error(error);
        alert("Erreur : " + error.message);
    }
});