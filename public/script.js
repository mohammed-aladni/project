document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form data collection
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            // Form validation
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.service) {
                showResponseMessage('Please fill all required fields', 'error');
                return;
            }

            if (!validateEmail(formData.email)) {
                showResponseMessage('Please enter a valid email address', 'error');
                return;
            }

            // Submit form with explicit URL and error handling
            fetch('http://localhost:3001/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                mode: 'cors' // Ensure CORS mode is enabled
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showResponseMessage('Thank you! Your message has been sent.', 'success');
                    contactForm.reset();
                } else {
                    showResponseMessage(data.message || 'Error submitting form', 'error');
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                showResponseMessage('Failed to submit form. Please try again.', 'error');
            });
        });
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Display response messages
    function showResponseMessage(message, type) {
        const responseDiv = document.getElementById('responseMessage');
        if (!responseDiv) return;
        
        responseDiv.textContent = message;
        responseDiv.className = type; // 'success' or 'error'
        responseDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            responseDiv.style.display = 'none';
        }, 5000);
    }
});