let factCheckRecord = new Map();
console.log("starting retrieveData.js");

const observer = new MutationObserver(() => {
    document.querySelectorAll('article').forEach(article => {

        // Check if there's a "Replying to" section
        let isReply = article.querySelector('div span')?.innerText.includes("Replying to");

        // Get the main post text
        let post = article.querySelector('div[lang]');

        let username = article.querySelector('div[dir="ltr"] span')?.innerText;

        let date = article.querySelector('time')?.getAttribute('datetime');

        // Only log the post if it's NOT a reply
        if (post && !isReply) {
            const postText = post.innerText;
            processPostText(postText, username, date);
        }

        const header = article.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-1cmwbt1.r-1wtj0ep');
        if (header) {
            // Check if the icon is already added to avoid duplication
            if (header.querySelector('.custom-icon')) return;

            // Create the icon element
            const icon = document.createElement("span");
            icon.classList.add("custom-icon");
            icon.innerHTML = date; // Example icon (bell)

            // Style the icon for better visibility
            icon.style.cursor = "pointer";
            icon.style.marginLeft = "8px";

            // Insert the icon before the 3 dots (more options button)
            //header.insertBefore(icon, header.lastChild);
            header.insertAdjacentElement("afterbegin", icon)

            // Optional: Add a click event to the icon
            //icon.addEventListener('click', () => {
            //    alert('Icon clicked!');
            //});
        }
    });
});

// Start observing changes in the document body (specifically child elements)
observer.observe(document.body, {
    childList: true,
    subtree: true
});

function processPostText(postText, username, date) {
    if (postText && postText.trim() !== "") { //check if postText is empty or null
        const key = postText.substring(0, 15) + username + date; //the first 15 chars of the post text + username + date
        if (!(factCheckRecord.has(key))) {
            console.log(postText);
            sendAPI(postText);
            factCheckRecord.set(key, 90);
        }
    }
}

function sendAPI(postText) {
    fetch('http://localhost:8000/fact', {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json', // Specify that we're sending JSON data
        },
        body: JSON.stringify({
            // Replace this with the data you want to send
            text: postText
        })
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => console.log(data)) // Handle the response data
        .catch(error => console.error('Error:', error)); // Handle any errors
}