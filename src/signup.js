import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnSignup = document.getElementById('btnSignup');

btnSignup.addEventListener('click', async () => {
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        // 1. Création du compte dans Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Enregistrement du profil dans Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: name,
            email: email,
            createdAt: new Date()
        });

        alert("Compte créé avec succès ! Bienvenue " + name);
        window.location.href = "home.html"; // Redirection vers l'accueil

    } catch (error) {
        console.error(error);
        alert("Erreur : " + error.message);
    }
});