const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: contactForm.querySelector('input[placeholder="Your Name"]').value,
        email: contactForm.querySelector('input[placeholder="Your Email"]').value,
        project_type: contactForm.querySelector('select').value,
        message: contactForm.querySelector('textarea').value
    };

    try {
        const response = await fetch('https://YOUR-APP.up.railway.app/api/inquiry', ...{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Success! Your inquiry has been stored in MySQL.');
            contactForm.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        /*alert('Could not connect to the database server.');*/
    }
});