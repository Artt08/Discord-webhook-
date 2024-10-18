// Function to auto-adjust the textarea height
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
}

document.addEventListener('DOMContentLoaded', () => {
    // Load the saved webhook URL and message when the popup is opened
    chrome.storage.sync.get(['webhookUrl', 'lastMessage'], (result) => {
        if (result.webhookUrl) {
            document.getElementById('webhookUrl').value = result.webhookUrl;
        }
        if (result.lastMessage) {
            document.getElementById('messageContent').value = result.lastMessage;
        }
        
        // Auto resize the textareas on load
        autoResizeTextarea(document.getElementById('webhookUrl'));
        autoResizeTextarea(document.getElementById('messageContent'));
    });

    // Save the webhook URL and message whenever they are updated
    document.getElementById('webhookUrl').addEventListener('input', () => {
        const webhookUrl = document.getElementById('webhookUrl').value;
        chrome.storage.sync.set({ webhookUrl });
        autoResizeTextarea(document.getElementById('webhookUrl')); // Auto-resize on input
    });

    document.getElementById('messageContent').addEventListener('input', () => {
        const lastMessage = document.getElementById('messageContent').value;
        chrome.storage.sync.set({ lastMessage });
        autoResizeTextarea(document.getElementById('messageContent')); // Auto-resize on input
    });
});

document.getElementById('sendMessageButton').addEventListener('click', () => {
    const webhookUrl = document.getElementById('webhookUrl').value;
    const messageContent = document.getElementById('messageContent').value;
    const messageDisplay = document.getElementById('message');

    // Clear previous message
    messageDisplay.style.display = 'none';
    messageDisplay.textContent = '';

    if (!webhookUrl || !messageContent) {
        messageDisplay.textContent = 'Please enter both the webhook URL and message.';
        messageDisplay.style.display = 'block';
        return;
    }

    const data = {
        content: messageContent
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 204) {
            messageDisplay.textContent = 'Message sent successfully!';
        } else {
            messageDisplay.textContent = `Failed to send message: ${response.status}`;
        }
        messageDisplay.style.display = 'block'; // Show message
    })
    .catch(error => {
        messageDisplay.textContent = 'An error occurred: ' + error;
        messageDisplay.style.display = 'block'; // Show message
    });
});
