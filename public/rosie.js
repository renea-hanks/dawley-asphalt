/* ROSIE AI - Powered by Claude */

let conversationHistory = [];

function toggleRosie() {
    const win = document.getElementById('rosie-window');
    if (win) {
        win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('rosie-user-input');
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user');
    input.value = '';
    input.disabled = true;

    conversationHistory.push({ role: 'user', content: userText });
    callRosie();
}

async function callRosie() {
    const historyEl = document.getElementById('rosie-chat-history');

    const typing = document.createElement('p');
    typing.style.cssText = 'margin-top:10px; color:#aaa; font-style:italic;';
    typing.innerText = 'Rosie is thinking...';
    historyEl.appendChild(typing);
    historyEl.scrollTop = historyEl.scrollHeight;

    try {
        const fn = firebase.functions().httpsCallable('processInquiry');
        const result = await fn({ messages: conversationHistory });
        const reply = result.data.text;
        conversationHistory.push({ role: 'assistant', content: reply });
        typing.remove();
        appendMessage(reply, 'assistant');
    } catch (err) {
        typing.remove();
        console.error('ROSIE ERROR:', err.code, err.message);
        appendMessage('Something went wrong. Please try again.', 'assistant');
    }

    const input = document.getElementById('rosie-user-input');
    input.disabled = false;
    input.focus();
}

function appendMessage(text, role) {
    const historyEl = document.getElementById('rosie-chat-history');
    const p = document.createElement('p');
    if (role === 'user') {
        p.style.cssText = 'text-align:right; font-style:italic; color:#888; margin-top:10px;';
    } else {
        p.style.cssText = 'margin-top:10px; border-left: 2px solid #1a1a1a; padding-left: 10px;';
    }
    p.innerText = text;
    historyEl.appendChild(p);
    historyEl.scrollTop = historyEl.scrollHeight;
}