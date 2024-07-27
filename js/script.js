// Code JavaScript pour l'application transcription en temps réel 
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

const resultsDiv = document.getElementById('results');
const lampState = document.getElementById('lampState');
const ws = new WebSocket('ws://localhost:8765');

// État initial de la connexion
resultsDiv.classList.remove('connected', 'error');
resultsDiv.innerHTML = '<p>Connecting...</p>';

// Connexion ouverte
ws.onopen = () => {
    resultsDiv.innerHTML = '<p>Connected.</p>';
    resultsDiv.classList.add('connected');
    resultsDiv.classList.remove('error');
};

// Reception d'un message
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'partial') {
        resultsDiv.innerHTML = '<p><em>Résultat partiel : ' + message.text + '</em></p>';
    } else if (message.type === 'result') {
        resultsDiv.innerHTML += '<p>Reconnu : ' + message.text + '</p>';
    } else if (message.type === 'keyword_detected') {
        resultsDiv.innerHTML += '<p><strong>Mot clé détecté. Activation de l\'écoute...</strong></p>';
    }
};

// Erreur de connexion 
ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    resultsDiv.innerHTML = '<p>Error.</p>';
    resultsDiv.classList.add('error');
    resultsDiv.classList.remove('connected');
};

// Fermeture de la connexion
ws.onclose = () => {
    resultsDiv.innerHTML = '<p>Disconnected.</p>';
    resultsDiv.classList.remove('connected', 'error');
};

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnjCQWWOiL3-A7zRwyyEmQcA51FagHxT8",
    authDomain: "monitoring-423811.firebaseapp.com",
    databaseURL: "https://monitoring-423811-default-rtdb.firebaseio.com",
    projectId: "monitoring-423811",
    storageBucket: "monitoring-423811.appspot.com",
    messagingSenderId: "504772212612",
    appId: "1:504772212612:web:699900bb53a3d05209cfd1",
    measurementId: "G-KLNR3STH3N"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Référence à l'état de la lampe dans Firebase
const lampRef = database.ref('/Compteur1/Lamp');

// Écouter les changements de l'état de la lampe
lampRef.on('value', (snapshot) => {
    const state = snapshot.val();
    lampState.innerText = state ? "Allumée" : "Éteinte";
}, (error) => {
    console.error('Error fetching lamp state:', error);
});
