const API_BASE = '/api/paste';

let currentPasteId = null;
let currentContent = '';
let currentType = 'text';

// DOM elements
const createView = document.getElementById('create-view');
const pasteArea = document.getElementById('pasteArea');
const textInput = document.getElementById('textInput');
const imagePreview = document.getElementById('imagePreview');
const placeholder = pasteArea.querySelector('.paste-placeholder');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const notification = document.getElementById('notification');
const pastesList = document.getElementById('pastes-list');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Initialize
init();

function init() {
    // Always show create view on homepage
    showCreateView();

    // Event listeners
    pasteArea.addEventListener('paste', handlePaste);
    pasteArea.addEventListener('click', (e) => {
        // If clicking on the textInput itself, let it handle focus
        if (e.target === textInput) {
            return;
        }
        // First click: just show the textInput, don't focus it
        if (!textInput.classList.contains('show')) {
            textInput.classList.add('show');
            placeholder.classList.add('hidden');
        }
    });
    
    // Second click: focus the textInput when user clicks on it
    textInput.addEventListener('click', () => {
        if (!textInput.classList.contains('show')) {
            textInput.classList.add('show');
            placeholder.classList.add('hidden');
        }
        textInput.focus();
    });
    
    textInput.addEventListener('input', () => {
        currentContent = textInput.value;
        currentType = 'text';
        updateSaveButton();
    });

    textInput.addEventListener('paste', handlePaste);

    saveBtn.addEventListener('click', savePaste);
    clearBtn.addEventListener('click', clearPaste);
    deleteAllBtn.addEventListener('click', deleteAllPastes);
    
    // Load pastes list on homepage
    loadPastesList();
}

function handlePaste(e) {
    e.preventDefault();
    
    const items = e.clipboardData.items;
    let plainTextFound = false;
    let imageFound = false;
    
    // First pass: look for images
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
            imageFound = true;
            const blob = item.getAsFile();
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const base64 = event.target.result;
                currentContent = base64;
                currentType = 'image';
                
                // Show image preview
                imagePreview.innerHTML = `<img src="${base64}" alt="Pasted image">`;
                imagePreview.classList.remove('hidden');
                textInput.classList.remove('show');
                placeholder.classList.add('hidden');
                
                updateSaveButton();
            };
            
            reader.readAsDataURL(blob);
            return;
        }
    }
    
    // Second pass: look for plain text (prefer text/plain over text/html)
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'text/plain') {
            plainTextFound = true;
            item.getAsString((text) => {
                // Append to existing content or replace
                const cursorPos = textInput.selectionStart || textInput.value.length;
                const textBefore = textInput.value.substring(0, cursorPos);
                const textAfter = textInput.value.substring(textInput.selectionEnd || cursorPos);
                textInput.value = textBefore + text + textAfter;
                
                // Set cursor position after pasted text
                const newCursorPos = cursorPos + text.length;
                textInput.setSelectionRange(newCursorPos, newCursorPos);
                
                currentContent = textInput.value;
                currentType = 'text';
                
                textInput.classList.add('show');
                placeholder.classList.add('hidden');
                imagePreview.classList.add('hidden');
                
                updateSaveButton();
            });
            return;
        }
    }
    
    // Third pass: if no plain text, try HTML and extract plain text from it
    if (!plainTextFound) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type === 'text/html') {
                item.getAsString((html) => {
                    // Create a temporary div to extract plain text
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    const plainText = tempDiv.textContent || tempDiv.innerText || '';
                    
                    // Append to existing content or replace
                    const cursorPos = textInput.selectionStart || textInput.value.length;
                    const textBefore = textInput.value.substring(0, cursorPos);
                    const textAfter = textInput.value.substring(textInput.selectionEnd || cursorPos);
                    textInput.value = textBefore + plainText + textAfter;
                    
                    // Set cursor position after pasted text
                    const newCursorPos = cursorPos + plainText.length;
                    textInput.setSelectionRange(newCursorPos, newCursorPos);
                    
                    currentContent = textInput.value;
                    currentType = 'text';
                    
                    textInput.classList.add('show');
                    placeholder.classList.add('hidden');
                    imagePreview.classList.add('hidden');
                    
                    updateSaveButton();
                });
                return;
            }
        }
    }
}

function updateSaveButton() {
    saveBtn.disabled = !currentContent.trim();
}

function clearPaste() {
    currentContent = '';
    currentType = 'text';
    textInput.value = '';
    textInput.classList.remove('show');
    imagePreview.classList.add('hidden');
    imagePreview.innerHTML = '';
    placeholder.classList.remove('hidden');
    updateSaveButton();
}

async function savePaste() {
    if (!currentContent.trim()) {
        showNotification('Please paste some content first', 'error');
        return;
    }

    try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: currentContent,
                type: currentType
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save paste');
        }

        const data = await response.json();
        showNotification('🎉 Paste saved to the party! 🎉', 'success');
        
        // Clear input and reload pastes list
        clearPaste();
        await loadPastesList();
        
        // Reset button text after clearing
        saveBtn.textContent = '💾 Save to Party';

    } catch (error) {
        console.error('Error saving paste:', error);
        showNotification('Failed to save paste', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save to Party';
    }
}

function showCreateView() {
    currentPasteId = null;
    createView.classList.remove('hidden');
    clearPaste();
    loadPastesList();
    window.history.pushState({}, '', '/');
}

async function loadPastesList() {
    try {
        const response = await fetch(`${API_BASE}s`);
        
        if (!response.ok) {
            throw new Error('Failed to load pastes');
        }

        const pastes = await response.json();
        renderPastesList(pastes);
        
        // Enable/disable delete all button
        deleteAllBtn.disabled = pastes.length === 0;
    } catch (error) {
        console.error('Error loading pastes list:', error);
        pastesList.innerHTML = '<div class="empty-state"><p>Error loading pastes</p></div>';
    }
}

function renderPastesList(pastes) {
        if (pastes.length === 0) {
            pastesList.innerHTML = '<div class="empty-state"><p>🎭 No pastes yet! Start the party by creating your first paste above! 🎭</p></div>';
            return;
        }

    pastesList.innerHTML = pastes.map(paste => {
        const date = new Date(paste.created);
        const dateStr = date.toLocaleString();
        
        let contentHtml = '';
        if (paste.type === 'image') {
            contentHtml = `
                <div class="paste-item-image">
                    <img src="${paste.content}" alt="Pasted image">
                </div>
            `;
        } else {
            const preview = paste.content.length > 200 
                ? paste.content.substring(0, 200) + '...' 
                : paste.content;
            contentHtml = `
                <div class="paste-item-text">${escapeHtml(preview)}</div>
            `;
        }
        
        return `
            <div class="paste-item" data-id="${paste.id}">
                <div class="paste-item-header">
                    <div class="paste-item-meta">
                        ${dateStr}
                    </div>
                    <div class="paste-item-actions">
                        <button class="btn btn-primary paste-item-copy" onclick="copyPasteItem('${paste.id}', '${paste.type}')">
                            📋 Copy
                        </button>
                        <button class="btn btn-danger paste-item-delete" onclick="deletePasteItem('${paste.id}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
                <div class="paste-item-content">
                    ${contentHtml}
                </div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make deletePasteItem globally accessible for onclick handlers
window.deletePasteItem = async function(id) {
    if (!confirm('Are you sure you want to delete this paste?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete paste');
        }

        showNotification('🗑️ Paste removed from party!', 'success');
        await loadPastesList();

    } catch (error) {
        console.error('Error deleting paste:', error);
        showNotification('Failed to delete paste', 'error');
    }
};

// Make copyPasteItem globally accessible for onclick handlers
window.copyPasteItem = async function(id, type) {
    try {
        // Fetch the full paste content
        const response = await fetch(`${API_BASE}/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch paste');
        }

        const paste = await response.json();

        if (type === 'image') {
            // Show message for image copying
            alert("I don't know how to make this work, for now please just right click and copy the image :)");
            return;
        } else {
            // Copy text to clipboard
            if (!navigator.clipboard) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = paste.content;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('📋 Text copied to clipboard!', 'success');
            } else {
                await navigator.clipboard.writeText(paste.content);
                showNotification('📋 Text copied to clipboard!', 'success');
            }
        }
    } catch (error) {
        console.error('Error copying paste:', error);
        showNotification('Failed to copy to clipboard', 'error');
    }
};

async function deleteAllPastes() {
    if (!confirm('Are you sure you want to delete ALL pastes? This cannot be undone!')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}s`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete all pastes');
        }

        const data = await response.json();
        showNotification(`🎊 Party cleared! ${data.deleted} paste(s) removed! 🎊`, 'success');
        await loadPastesList();

    } catch (error) {
        console.error('Error deleting all pastes:', error);
        showNotification('Failed to delete all pastes', 'error');
    }
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}


