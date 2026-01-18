// Active navigation state management
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('.section');

        // Function to update active nav link
        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        // Listen for scroll events
        window.addEventListener('scroll', updateActiveNav);

        // Mobile menu toggle functionality
        const menuToggle = document.getElementById('menuToggle');
        const navLinksContainer = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navLinksContainer.classList.remove('active');
            }
        });








document.addEventListener("DOMContentLoaded", () => {
	const cards = document.querySelectorAll(".card");
	const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

	cards.forEach((card) => {
		const content = card.querySelector(".card-content");
		const rotationFactor =
			parseFloat(card.getAttribute("data-rotation-factor")) || 2;

		if (!isTouchDevice) {
			card.addEventListener("mousemove", (e) => {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const centerX = rect.width / 2;
				const centerY = rect.height / 2;
				const rotateY = (rotationFactor * (x - centerX)) / centerX;
				const rotateX = (-rotationFactor * (y - centerY)) / centerY;

				content.style.transform = `
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;

				card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
				card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
			});

			card.addEventListener("mouseleave", () => {
				content.style.transform = "rotateX(0) rotateY(0)";

				content.style.transition = "transform 0.5s ease";
				setTimeout(() => {
					content.style.transition = "";
				}, 500);
			});
		}

		const randomDelay = Math.random() * 2;
		card.style.animation = `cardFloat 4s infinite alternate ease-in-out ${randomDelay}s`;
	});

	const style = document.createElement("style");
	style.textContent = `
    @keyframes cardFloat {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-5px);
      }
    }
    
    @media (min-width: 768px) {
      @keyframes cardFloat {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-8px);
        }
      }
    }
    
    @media (min-width: 1024px) {
      @keyframes cardFloat {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-10px);
        }
      }
    }
  `;
	document.head.appendChild(style);

	const buttons = document.querySelectorAll(".card-button");
	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			e.stopPropagation();

			const ripple = document.createElement("span");
			ripple.classList.add("ripple");
			button.appendChild(ripple);

			const rect = button.getBoundingClientRect();
			const size = Math.max(rect.width, rect.height) * 2;

			ripple.style.width = ripple.style.height = `${size}px`;
			ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
			ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

			ripple.classList.add("active");

			setTimeout(() => {
				ripple.remove();
			}, 500);
		});
	});

	const rippleStyle = document.createElement("style");
	rippleStyle.textContent = `
    .card-button {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.5s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
	document.head.appendChild(rippleStyle);
});









// text to voice/script.js:


// Saare elements ko select karein
const convertBtn = document.getElementById('btn');
const listenBtn = document.getElementById('listenBtn');
const textInput = document.getElementById('tp');

let hindiVoice = null; // Hindi voice ko store karne ke liye variable

// === HINDI VOICE FIX START ===
// Yeh function browser mein available voices ko load karta hai
function loadVoices() {
    // Sabhi available voices ki list prapt karein
    const voices = speechSynthesis.getVoices();
    
    // Is list mein se 'hi-IN' (Hindi - India) voice ko dhoondhein
    hindiVoice = voices.find(voice => voice.lang === 'hi-IN' || voice.lang.startsWith('hi'));

    if (hindiVoice) {
        console.log("Hindi voice found:", hindiVoice.name);
    } else {
        console.log("Error: Aapke browser ya system mein Hindi voice install nahi hai.");
    }
}

// Voices ko load karne ke liye event listener
// Voices browser mein turant load nahi hoti hain, isliye is event ka intezar karna zaroori hai
speechSynthesis.onvoiceschanged = loadVoices;

// Kuch browsers (jaise Firefox) mein pehle se load karna padta hai
loadVoices();
// === HINDI VOICE FIX END ===


// SpeechRecognition API ko check karein
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

// Agar browser support karta hai toh...
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi (India) mein sunne ke liye
    recognition.interimResults = false;

    // --- Voice-to-Text (Listen) Button ---
    listenBtn.addEventListener('click', () => {
        // Bolne (Speak) ko roko, sunne (Listen) se pehle
        speechSynthesis.cancel();
        
        if (listenBtn.classList.contains('listening')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    // Jab sunna (recognition) shuru ho
    recognition.onstart = () => {
        listenBtn.classList.add('listening'); 
        listenBtn.textContent = 'Listening...';
        textInput.placeholder = "Listening... Bolna shuru karein";
    };

    // Jab result mile
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        const currentText = textInput.value;
        if (currentText.trim() === "") {
            textInput.value = transcript;
        } else {
            textInput.value = currentText + ' ' + transcript;
        }
    };

    // Jab sunna (recognition) band ho
    recognition.onend = () => {
        listenBtn.classList.remove('listening');
        listenBtn.textContent = 'Listen';
        textInput.placeholder = "Yahan text likhein ya bolkar likhwayein...";
    };

    // Agar koi error aaye
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Error: " + event.error);
        listenBtn.classList.remove('listening');
        listenBtn.textContent = 'Listen';
    };

} else {
    // Agar browser support nahi karta
    alert("Sorry, your browser does not support Speech Recognition.");
    listenBtn.disabled = true;
    listenBtn.textContent = "Not Supported";
}

// --- Text-to-Voice (Speak) Button ---
convertBtn.addEventListener('click', () => {
    const text = textInput.value;

    if (text.trim() === "") {
        alert("Please enter some text to convert.");
        return;
    }

    if (recognition) {
        recognition.stop(); 
    }
    speechSynthesis.cancel();

    // Bolne ke liye naya object banayein
    const utterance = new SpeechSynthesisUtterance(text);
    
    // === HINDI VOICE FIX START ===
    // Check karein ki 'hindiVoice' variable set ho gaya hai ya nahi
    if (hindiVoice) {
        utterance.voice = hindiVoice; // Voice ko Hindi par set karein
        utterance.lang = 'hi-IN'; // Language ko bhi 'hi-IN' set karein
    } else {
        // Agar Hindi voice nahi mili toh user ko alert karein
        if (!window.hindiVoiceWarning) {
            alert("Aapke browser mein Hindi voice nahi mili. Ho sakta hai aawaz saaf na aaye. \n\nKripya Google Chrome ka istemaal karein.");
            window.hindiVoiceWarning = true; // Taaki alert baar-baar na aaye
        }
    }
    // === HINDI VOICE FIX END ===
    
    utterance.onend = () => {
        console.log("Speech finished.");
    };
    
    // Text ko bolna shuru karein
    speechSynthesis.speak(utterance);
});