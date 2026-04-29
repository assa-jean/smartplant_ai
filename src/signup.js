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

    // 1. Récupération des valeurs (Ne pas oublier le PHONE ici)
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value; // <--- AJOUTÉ ICI

    // Validation
    if (!name || !email || !password || !phone) {
        alert("Veuillez remplir tous les champs, y compris le numéro de téléphone.");
        return;
    }

    // --- AFFICHER LE POPUP (LOADING) ---
    statusModal.classList.remove('hidden');
    loader.classList.remove('hidden');
    successIcon.classList.add('hidden');
    statusTitle.innerText = "Inscription en cours";
    statusMessage.innerText = "Création de votre espace agricole...";

    try {
        // 2. Création du compte Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 3. Enregistrement des données dans Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: name,
            email: email,
            phone: phone, // Maintenant cette variable existe !
            role: "agriculteur",
            createdAt: new Date()
        });

        // --- 4. SUCCÈS : MISE À JOUR DU POPUP ---
        loader.classList.add('hidden');
        successIcon.classList.remove('hidden');
        statusTitle.innerText = "Inscription Réussie !";
        statusMessage.innerText = `Bienvenue ${name}, redirection en cours...`;

        // Petite pause pour l'UX puis redirection
        setTimeout(() => {
            window.location.href = "home.html";
        }, 2000);

    } catch (error) {
        // En cas d'erreur (ex: email déjà utilisé)
        statusModal.classList.add('hidden');
        console.error("Erreur d'inscription:", error);
        
        // Message d'erreur plus clair
        if (error.code === 'auth/email-already-in-use') {
            alert("Cet email est déjà utilisé.");
        } else {
            alert("Erreur : " + error.message);
        }
    }
});