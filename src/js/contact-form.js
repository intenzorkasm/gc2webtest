
import { supabase } from '../lib/supabase.js'

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Visual loading state
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Envoi en cours...`;
            btn.disabled = true;
            statusDiv.classList.add('hidden');
            statusDiv.className = 'hidden text-center text-sm font-bold mt-4';

            // Gather data
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value; // Map to subject or body if needed, currently mapping 'subject' to 'New Contact Request' or we could add a column
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Prepare data object
            // Note: Our table schema has: name, email, subject, message. 
            // We'll append company and phone to the message body for now, or just send them if we update schema.
            // Let's stick to the schema defined in plan: name, email, subject, message.
            const fullMessage = `
                Société: ${company}
                Téléphone: ${phone}
                
                Message:
                ${message}
            `;

            try {
                const { data, error } = await supabase
                    .from('contact_requests')
                    .insert([
                        {
                            name,
                            email,
                            subject: `Nouveau contact de ${company || name}`,
                            message: fullMessage
                        }
                    ]);

                if (error) throw error;

                // Success
                statusDiv.textContent = "Message envoyé avec succès ! Nous vous recontacterons bientôt.";
                statusDiv.classList.remove('hidden');
                statusDiv.classList.add('text-green-500');
                form.reset();

            } catch (error) {
                console.error('Error submitting form:', error);
                statusDiv.textContent = "Erreur lors de l'envoi. Veuillez réessayer.";
                statusDiv.classList.remove('hidden');
                statusDiv.classList.add('text-red-500');
            } finally {
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        });
    }
});
