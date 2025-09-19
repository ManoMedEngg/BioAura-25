document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    lucide.createIcons();
 
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById("theme-toggle");
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) { htmlEl.classList.add(savedTheme); } 
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) { htmlEl.classList.add("dark"); }
    themeToggle.addEventListener("click", () => {
        htmlEl.classList.toggle("dark");
        localStorage.setItem("theme", htmlEl.classList.contains("dark") ? "dark" : "light");
    });

    // --- COUNTDOWN TIMER ---
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        const symposiumDate = new Date("2025-10-10T09:00:00").getTime();
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = symposiumDate - now;
            if (distance < 0) {
                // If the date is in the past, show all zeros
                document.getElementById("days").innerText = 0;
                document.getElementById("hours").innerText = 0;
                document.getElementById("minutes").innerText = 0;
                document.getElementById("seconds").innerText = 0;
                clearInterval(timerInterval);
                return;
            }
            document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
        };
        const timerInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
    
    // --- EVENT TABS ---
    const tabTriggers = document.querySelectorAll(".tab-trigger");
    const tabContents = document.querySelectorAll(".tab-content");
    tabTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const targetTab = trigger.getAttribute("data-tab");
            tabTriggers.forEach(t => t.classList.remove("active"));
            trigger.classList.add("active");
            tabContents.forEach(content => {
                content.classList.remove("active");
                if (content.id === targetTab) {
                    content.classList.add("active");
                }
            });
        });
    });

    // --- EVENT ACCORDION ---
    const eventCards = document.querySelectorAll(".event-card");
    eventCards.forEach(card => {
        const header = card.querySelector(".event-header");
        header.addEventListener("click", () => {
            card.classList.toggle("expanded");
        });
    });

    // --- BROCHURE MODAL (use encoded URL for filenames with apostrophes/spaces) ---
    const brochureModal = document.getElementById("brochure-modal");
    const viewBtn = document.getElementById("view-brochure-btn");
    const modalImg = document.getElementById("brochure-img");
    const downloadLink = document.getElementById("brochure-download");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalCloseBtnSecondary = document.getElementById("modal-close-btn-2");

    function openBrochureModal(brochurePath) {
        if (!brochureModal) return;
        const encodedPath = brochurePath ? encodeURI(brochurePath) : '';
        if (modalImg) modalImg.src = encodedPath;
        if (downloadLink) {
            downloadLink.href = encodedPath;
            downloadLink.setAttribute('download', brochurePath || '');
        }
        brochureModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        // move focus into modal for accessibility
        if (modalCloseBtn) modalCloseBtn.focus();
    }

    function closeBrochureModal() {
        if (!brochureModal) return;
        brochureModal.classList.remove('is-open');
        document.body.style.overflow = '';
        if (modalImg) modalImg.src = '';
        // return focus to the button that opened the modal
        if (viewBtn) viewBtn.focus();
    }

    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const brochurePath = viewBtn.dataset.brochure || "Bioaura'25-Brochure.png";
            openBrochureModal(brochurePath);
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBrochureModal);
    if (modalCloseBtnSecondary) modalCloseBtnSecondary.addEventListener('click', closeBrochureModal);

    if (brochureModal) {
        brochureModal.addEventListener('click', (event) => {
            if (event.target === brochureModal) closeBrochureModal();
        });
    }

    // close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && brochureModal && brochureModal.classList.contains('is-open')) {
            closeBrochureModal();
        }
    });

    // =========== NEW CHATBOT LOGIC ===========
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('chatbot-send-btn');

    const toggleChatbot = () => {
        chatbotWindow.classList.toggle('is-open');
        chatbotToggle.classList.toggle('is-open');
    };

    chatbotToggle.addEventListener('click', toggleChatbot);

    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const addMessage = (text, isUser) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user' : 'bot');
        
        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        textDiv.textContent = text;
        
        messageDiv.appendChild(textDiv);
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    };

    const showTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing-indicator');
        typingDiv.innerHTML = `<span></span><span></span><span></span>`;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const indicator = messagesContainer.querySelector('.typing-indicator');
        if (indicator) {
            messagesContainer.removeChild(indicator);
        }
    };
    
    const getBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        if (message.includes('hello') || message.includes('hi')) return "Hello! How can I help you with BioAura'25?";
        if (message.includes('event')) return "We have exciting technical events like Xenomedica, Medniche, and Medmystery, plus several non-technical events. Check the 'Events' section for more!";
        if (message.includes('register')) return "You can register using the 'Register Now' button on our page. It links to a Google Form.";
        if (message.includes('date') || message.includes('when')) return "BioAura'25 is on October 10, 2025, from 9:00 AM to 5:00 PM.";
        if (message.includes('location') || message.includes('where')) return "The event is at Kings Engineering College in Sriperumbudur, Chennai. See the map on our site for directions.";
        if (message.includes('contact') || message.includes('phone') || message.includes('email')) return "You can email us at bioaura25@gmail.com or call +91 73588 78062.";
        if (message.includes('fee') || message.includes('cost')) return "The registration fee is just Rs. 150 per participant, which includes food.";
        if (message.includes('coordinator') || message.includes('team')) return "Please see our 'Meet Our Team' section for a full list of faculty and student coordinators.";
        return "Sorry, I'm not sure about that. Try asking about events, registration, dates, or location.";
    };

    const handleSendMessage = () => {
        const messageText = inputField.value.trim();
        if (!messageText) return;

        addMessage(messageText, true);
        inputField.value = '';
        sendButton.disabled = true;

        setTimeout(() => {
            showTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator();
                const botResponse = getBotResponse(messageText);
                addMessage(botResponse, false);
            }, 1200);

        }, 300);
    };
    
    inputField.addEventListener('keyup', () => {
        sendButton.disabled = inputField.value.trim() === '';
    });

    sendButton.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Initial bot message
    setTimeout(() => {
        addMessage("Hello! I'm the BioAura'25 chatbot. How can I help you today?", false);
    }, 1000);
});
