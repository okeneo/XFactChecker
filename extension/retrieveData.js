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
            if (!isExistInFactCheckRecord(postText, username, date)) {
                console.log("LOADING: " + postText);
                processPostText(postText, username, date, article);
            }
        } else {
            //add "?" when it is empty
            const header = article.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-1cmwbt1.r-1wtj0ep');

            if (header) {
                // Check if the icon is already added to avoid duplication
                if (header.querySelector('.custom-icon')) return;

                // Create the icon element
                const icon = document.createElement("span");
                icon.classList.add("custom-icon");

                // Style the icon for better visibility
                icon.style.cursor = "pointer";
                icon.style.boxSizing = "border-box";

                // temp variable
                // let rating = not;

                // Create a container for the icon, if rating is NaN it will be invisible
                const iconContainer = document.createElement('div');
                iconContainer.style.marginRight = "2.5px";

                // Create the popup text box
                const popup = document.createElement("div");
                popup.classList.add("custom-popup");
                let boxcolor = "white";
                icon.innerHTML = "?";
                icon.style.fontFamily = "Segoe UI, Helvetica, Arial, sans-serif";
                icon.style.fontSize = "20px";
                iconContainer.style.marginBottom = "4px";
                rating = "--";

                iconContainer.appendChild(icon);
                header.insertAdjacentElement("afterbegin", iconContainer);

                // Style the popup
                popup.textContent = "Accuracy Unconfirmed";
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
                icon.addEventListener("mouseenter", (event) => {
                    popup.style.display = "block"; // Show the popup
                    const rect = event.target.getBoundingClientRect();
                    popup.style.top = (rect.top + window.scrollY - 40) + "px"; // Adjust for scrolling (40px above the icon)
                    popup.style.left = (rect.left + window.scrollX + rect.width / 2) + "px"; // Center horizontally
                    popup.style.transform = "translateX(-50%)";
                });
                iconContainer.addEventListener("mouseleave", (event) => {
                    popup.style.display = "none";
                });
v
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

            if (!isExistInFactCheckRecord(postText, username, date)) {
                console.log("LOADING: " + postText);
                processPostText(postText, username, date, article);
            }
        };
    });
});

// Start observing changes in the document body (specifically child elements)
observer.observe(document.body, {
    childList: true,
    subtree: true
});

function processPostText(postText, username, date, article) {
    if (postText && postText.trim() !== "") { //check if postText is empty or null
        const key = postText.substring(0, 15) + username + date; //the first 15 chars of the post text + username + date
        if (!isExistInFactCheckRecord(postText, username, date)) {
            console.log(postText);
            sendAPI(postText, article);
            factCheckRecord.set(key, 90);
        }
    }
}

function isExistInFactCheckRecord(postText, username, date) {
    const key = postText.substring(0, 15) + username + date; //the first 15 chars of the post text + username + date
    return factCheckRecord.has(key);
}

function sendAPI(postText, article) {
    console.log("send API: " + postText);
    fetch('http://localhost:8000/fact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: postText }),
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            console.log(postText + "got API");
            console.log(data);
            const header = article.querySelector('.css-175oi2r.r-1awozwy.r-18u37iz.r-1cmwbt1.r-1wtj0ep');

            if (header) {
                // Check if the icon is already added to avoid duplication
                if (header.querySelector('.custom-icon')) return;

                // Create the icon element
                const icon = document.createElement("span");
                icon.classList.add("custom-icon");

                // Style the icon for better visibility
                icon.style.cursor = "pointer";
                icon.style.boxSizing = "border-box";

                // temp variable
                let rating = data.message

                // Create a container for the icon, if rating is NaN it will be invisible
                const iconContainer = document.createElement('div');
                iconContainer.style.marginRight = "2.5px";

                // Create the popup text box
                const popup = document.createElement("div");
                popup.classList.add("custom-popup");
                let boxcolor = "white";

                switch (true) {
                    case (rating === null):
                        icon.innerHTML = "?";
                        icon.style.fontFamily = "Segoe UI, Helvetica, Arial, sans-serif";
                        icon.style.fontSize = "20px";
                        iconContainer.style.marginBottom = "4px";
                        rating = "--";
                        break;
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
                        iconContainer.style.marginBottom = "4px";
                        rating = "--";
                        break;
                }

                if (rating !== null && !isNaN(rating)) {
                    const desiredWidth = 30;
                    icon.style.width = Math.max(rating, 5) / 100 * desiredWidth + 'px';
                    icon.style.height = '10px';
                    icon.style.backgroundColor = boxcolor;
                    icon.style.borderRadius = '2px';
                    icon.style.position = 'relative';

                    iconContainer.style.width = desiredWidth + 'px';
                    iconContainer.style.height = '10px';
                    iconContainer.style.border = `1.5px solid #71767B`;
                    iconContainer.style.display = 'flex';
                    iconContainer.style.justifyContent = 'left';
                    iconContainer.style.alignItems = 'center';
                    iconContainer.style.boxSizing = 'border-box';
                    iconContainer.style.borderRadius = "2px";
                    iconContainer.style.overflow = "hidden";
                }

                iconContainer.appendChild(icon);
                header.insertAdjacentElement("afterbegin", iconContainer);

                // Style the popup
                popup.textContent = (!isNaN(rating)?rating + "%":"Accuracy Unconfirmed");
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
                iconContainer.addEventListener("mouseenter", (event) => {
                    popup.style.display = "block"; // Show the popup
                    const rect = event.target.getBoundingClientRect();
                    popup.style.top = (rect.top + window.scrollY - 40) + "px"; // Adjust for scrolling (40px above the icon)
                    popup.style.left = (rect.left + window.scrollX + rect.width / 2) + "px"; // Center horizontally
                    popup.style.transform = "translateX(-50%)";
                });
                iconContainer.addEventListener("mouseleave", (event) => {
                    popup.style.display = "none";
                })

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
        })
        .catch(error => console.error('Error:', error));
}
