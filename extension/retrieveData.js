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

        if (!isExistInFactCheckRecord(name, username, date)) {
            const header = article.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-1cmwbt1.r-1wtj0ep');
            if (header) {
                // Check if the icon is already added to avoid duplication
                if (header.querySelector('.custom-icon')) return;

                // Create the icon element
                const icon = document.createElement("span");
                icon.classList.add("custom-icon");

                // Style the icon for better visibility
                icon.style.cursor = "pointer";
                icon.style.marginLeft = "8px";

                header.insertAdjacentElement("afterbegin", icon)

                // temp variable
                let rating = 30;
                // Create the popup text box
                const popup = document.createElement("div");
                let boxcolor = "white";
                switch (true) {
                    case (rating <= 20):
                        boxcolor = "red"
                        break;
                    case (rating <= 40):
                        boxcolor = "orange";
                        break;
                    case (rating <= 60):
                        boxcolor = "yellow";
                        break;
                    case (rating <= 80):
                        boxcolor = "yellowgreen";
                        break;
                    case (rating <= 100):
                        boxcolor = "chartreuse";
                        break;
                    default:
                        icon.innerHTML = "?";
                        icon.style.fontFamily = "Segoe UI, Helvetica, Arial, sans-serif";
                        icon.style.fontSize = "20px";
                        rating = "--";
                        break;
                }
                if (!isNaN(rating)) {
                    popup.classList.add("custom-popup");
                    icon.style.width = rating / 5 + 'px';
                    icon.style.height = '10px';
                    icon.style.backgroundColor = boxcolor;
                    icon.style.borderRadius = '0px';
                    icon.style.position = 'relative';
                }
                // Style the popup
                popup.textContent = rating + "%"
                popup.style.position = "absolute"; // Use absolute to make it scroll with content
                popup.style.background = "#333";
                popup.style.padding = "5px 10px";
                popup.style.borderRadius = "5px";
                popup.style.whiteSpace = "nowrap";
                popup.style.zIndex = "1";
                popup.style.display = "none"; // Initially hidden
                popup.style.fontSize = "14px";
                popup.style.pointerEvents = "none"; // Ignore mouse events for better UX
                popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                popup.style.fontFamily = "Segoe UI, Helvetica, Arial, sans-serif";

                // Show popup when clicking the icon
                icon.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent post's click action

                    // Toggle popup visibility
                    if (popup.style.display === "block") {
                        popup.style.display = "none"; // Hide the popup if it's visible
                    } else {
                        popup.style.display = "block"; // Show the popup
                        const rect = event.target.getBoundingClientRect();
                        popup.style.top = (rect.top + window.scrollY - 40) + "px"; // Adjust for scrolling (40px above the icon)
                        popup.style.left = (rect.left + window.scrollX + rect.width / 2) + "px"; // Center horizontally
                        popup.style.transform = "translateX(-50%)";
                    }
                });

                // Hide the popup when clicking anywhere outside of it or the icon
                document.addEventListener("click", (event) => {
                    if (!header.contains(event.target) && !popup.contains(event.target)) {
                        popup.style.display = "none"; // Hide the popup if clicked outside
                    }
                });

                // Scroll handling: Update popup position when page is scrolled
                window.addEventListener("scroll", () => {
                    if (popup.style.display === "block") {
                        const rect = icon.getBoundingClientRect();
                        popup.style.top = (rect.top + window.scrollY - 40) + "px"; // Adjust for scroll position
                        popup.style.left = (rect.left + window.scrollX + rect.width / 2) + "px"; // Center horizontally
                    }
                });

                // Add the popup to the body for fixed positioning
                document.body.appendChild(popup);
            }
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
        if (!isExistInFactCheckRecord(postText, username, date)) {
            console.log(postText);
            sendAPI(postText);
            factCheckRecord.set(key, 90);
        }
    }
}

function isExistInFactCheckRecord(postText, username, date) {
    const key = postText.substring(0, 15) + username + date; //the first 15 chars of the post text + username + date
    return factCheckRecord.has(key);
}

function sendAPI(postText) {
    let apiCall = fetch('http://localhost:8000/fact', {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json', // Specify that we're sending JSON data
        },
        body: JSON.stringify({
            // Replace this with the data you want to send
            text: postText
        })
    }).catch(error => console.error('Error:', error)); // Handle any errors

    apiCall.finally(() => {
        return data;
    });
}