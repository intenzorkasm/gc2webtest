
import { supabase } from '../lib/supabase.js'

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    const messagesTableBody = document.getElementById('messages-table-body');
    const refreshBtn = document.getElementById('refresh-btn');

    // Modal Elements
    const modal = document.getElementById('message-modal');
    const closeModal = document.getElementById('close-modal');
    const modalSubject = document.getElementById('modal-subject');
    const modalDate = document.getElementById('modal-date');
    const modalName = document.getElementById('modal-name');
    const modalEmail = document.getElementById('modal-email');
    const modalBody = document.getElementById('modal-body');
    const modalReplyBtn = document.getElementById('modal-reply-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');

    let currentMessageId = null;

    // --- Authentication Check ---
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        showDashboard(session.user);
    } else {
        showLogin();
    }

    // --- Event Listeners ---

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');

        btn.disabled = true;
        btn.innerHTML = 'Connexion...';
        loginMessage.classList.add('hidden');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            loginMessage.textContent = "Erreur: " + error.message;
            loginMessage.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = '<span>Se Connecter</span>';
        } else {
            showDashboard(data.user);
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        showLogin();
    });

    // Refresh
    refreshBtn.addEventListener('click', fetchMessages);

    // Modal Close
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Delete Message
    modalDeleteBtn.addEventListener('click', async () => {
        if (!currentMessageId) return;
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

        const { error } = await supabase
            .from('contact_requests')
            .delete()
            .eq('id', currentMessageId);

        if (error) {
            alert('Erreur: ' + error.message);
        } else {
            modal.classList.add('hidden');
            fetchMessages();
        }
    });


    // --- Functions ---

    function showLogin() {
        loginView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
    }

    function showDashboard(user) {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        userEmailSpan.textContent = user.email;
        fetchMessages();
    }

    async function fetchMessages() {
        messagesTableBody.innerHTML = '<tr><td colspan="5" class="p-12 text-center text-gray-500 italic">Chargement...</td></tr>';

        const { data, error } = await supabase
            .from('contact_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            messagesTableBody.innerHTML = `<tr><td colspan="5" class="p-12 text-center text-red-500">Erreur de chargement: ${error.message}</td></tr>`;
            return;
        }

        renderMessages(data);
    }

    function renderMessages(messages) {
        if (!messages || messages.length === 0) {
            messagesTableBody.innerHTML = '<tr><td colspan="5" class="p-12 text-center text-gray-500">Aucun message pour le moment.</td></tr>';
            return;
        }

        messagesTableBody.innerHTML = '';

        messages.forEach(msg => {
            const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const row = document.createElement('tr');
            row.className = 'hover:bg-white/5 transition group cursor-pointer';
            row.onclick = (e) => {
                // Prevent opening if clicking a button inside (future proofing)
                if (e.target.tagName !== 'BUTTON') openModal(msg);
            };

            row.innerHTML = `
                <td class="p-6 text-gray-400 whitespace-nowrap">${date}</td>
                <td class="p-6 font-semibold text-white">${escapeHtml(msg.name)}</td>
                <td class="p-6 text-gray-400">${escapeHtml(msg.email)}</td>
                <td class="p-6 text-white truncate max-w-xs">${escapeHtml(msg.subject || 'Sans sujet')}</td>
                <td class="p-6 text-right">
                    <button class="text-gc2-orange hover:text-white transition text-xs font-bold uppercase tracking-wider">Voir</button>
                </td>
            `;
            messagesTableBody.appendChild(row);
        });
    }

    function openModal(msg) {
        currentMessageId = msg.id;
        modalSubject.textContent = msg.subject || 'Sans sujet';
        modalDate.textContent = new Date(msg.created_at).toLocaleString('fr-FR');
        modalName.textContent = msg.name;
        modalEmail.textContent = msg.email;
        modalBody.textContent = msg.message;

        modalReplyBtn.href = `mailto:${msg.email}?subject=RE: ${msg.subject || 'GC2 Contact'}`;

        modal.classList.remove('hidden');
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
