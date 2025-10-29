const BASEURL = window.location.origin;
const WHATSAPP_NUMBER = "263777124998";
const particlesJS = window.particlesJS;
const bootstrap = window.bootstrap;

// Uptime tracking
let uptimeStartTime = Date.now();

document.addEventListener("DOMContentLoaded", async () => {
  const loadingScreen = document.getElementById("loadingScreen");
  const body = document.body;
  body.classList.add("no-scroll");
  document.body.classList.add("dark-mode");

  // Initialize particles
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#6c5ce7" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#6c5ce7",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
    },
  });

  // Animate elements on scroll
  const animateElements = document.querySelectorAll(".animate");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  animateElements.forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";
    observer.observe(el);
  });

  try {
    const settings = await fetch(BASEURL + "/src/settings.json").then((res) => res.json());

    // Set page content
    const setContent = (id, property, value) => {
      const element = document.getElementById(id);
      if (element) element[property] = value;
    };

    document.getElementById("currentYear").textContent = new Date().getFullYear();
    setContent("page", "textContent", settings.name || "Hookrest API");
    setContent("header", "textContent", settings.name || "Hookrest API");
    setContent("footerBrand", "textContent", settings.name || "Hookrest API");
    setContent("name", "textContent", settings.name || "Hookrest API");
    setContent("copyrightName", "textContent", settings.name || "Hookrest API");
    setContent("description", "textContent", settings.description || "Simple API's");
    setContent("baseUrlDoc", "textContent", BASEURL);

    const apiContent = document.getElementById("apiContent");

    // Calculate total endpoints
    let totalEndpoints = 0;
    settings.categories.forEach((category) => {
      totalEndpoints += category.items.length;
    });

    // Update stats
    const endpointsCounter = document.getElementById("endpointsCounter");
    const totalEndpointsSpan = document.getElementById("totalEndpoints");
    const totalEndpointsDisplay = document.getElementById("totalEndpointsDisplay");
    
    if (endpointsCounter && totalEndpointsSpan) {
      totalEndpointsSpan.textContent = totalEndpoints;
      endpointsCounter.style.display = "flex";
    }
    
    if (totalEndpointsDisplay) {
      totalEndpointsDisplay.textContent = totalEndpoints;
    }

    // Render categories
    settings.categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "api-category animate";
      
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "api-category-header";
      categoryHeader.innerHTML = `
        <span><i class="fas fa-folder-open me-2"></i>${category.name}</span>
        <div class="category-badge">
          <span>${category.items.length} endpoints</span>
          <i class="fas fa-chevron-down"></i>
        </div>
      `;
      categoryDiv.appendChild(categoryHeader);
      
      const categoryBody = document.createElement("div");
      categoryBody.className = "api-category-content";
      categoryBody.style.display = "none";
      
      const sortedItems = category.items.sort((a, b) => a.name.localeCompare(b.name));
      
      sortedItems.forEach((item) => {
        const endpointCard = document.createElement("div");
        endpointCard.className = "api-endpoint-card";
        endpointCard.dataset.apiPath = item.path;
        endpointCard.dataset.apiName = item.name;
        endpointCard.dataset.apiDesc = item.desc;
        endpointCard.dataset.apiInnerDesc = item.innerDesc || "";
        endpointCard.innerHTML = `
          <span class="method-badge">GET</span>
          <div class="endpoint-text">
            <span class="endpoint-path">${item.path.split("?")[0]}</span>
            <span class="endpoint-name">${item.name}</span>
          </div>
          <i class="fas fa-lock lock-icon"></i>
          <i class="fas fa-chevron-right endpoint-arrow"></i>
        `;
        categoryBody.appendChild(endpointCard);
      });
      
      categoryDiv.appendChild(categoryBody);
      apiContent.appendChild(categoryDiv);
      observer.observe(categoryDiv);

      categoryHeader.addEventListener("click", () => {
        const isOpen = categoryBody.style.display !== "none";
        categoryBody.style.display = isOpen ? "none" : "grid";
        categoryHeader.classList.toggle("collapsed");
        const icon = categoryHeader.querySelector(".category-badge .fas");
        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
      });
    });

    // Search functionality
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      document.querySelectorAll(".api-endpoint-card").forEach((item) => {
        const name = item.dataset.apiName.toLowerCase();
        const path = item.dataset.apiPath.toLowerCase();
        item.style.display = name.includes(searchTerm) || path.includes(searchTerm) ? "flex" : "none";
      });
      
      document.querySelectorAll(".api-category").forEach((categoryDiv) => {
        const categoryBody = categoryDiv.querySelector(".api-category-content");
        const visibleItems = categoryBody.querySelectorAll('.api-endpoint-card[style*="display: flex"]');
        if (visibleItems.length > 0) {
          categoryDiv.style.display = "";
          categoryBody.style.display = "grid";
          categoryDiv.querySelector(".api-category-header").classList.remove("collapsed");
        } else {
          categoryDiv.style.display = "none";
        }
      });
    });

    // API card click handler
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".api-endpoint-card")) return;
      const card = event.target.closest(".api-endpoint-card");
      const { apiPath, apiName, apiDesc, apiInnerDesc } = card.dataset;
      const modal = new bootstrap.Modal(document.getElementById("apiResponseModal"));
      
      const modalRefs = {
        label: document.getElementById("apiResponseModalLabel"),
        desc: document.getElementById("apiResponseModalDesc"),
        modalApiDescription: document.getElementById("modalApiDescription"),
        modalEndpointPath: document.getElementById("modalEndpointPath"),
        queryInputContainer: document.getElementById("apiQueryInputContainer"),
        submitBtn: document.getElementById("submitQueryBtn"),
        clearBtn: document.getElementById("clearQueryBtn"),
      };
      
      modalRefs.label.textContent = apiName;
      modalRefs.desc.textContent = apiDesc;
      modalRefs.modalApiDescription.textContent = apiDesc;
      modalRefs.modalEndpointPath.textContent = apiPath.split("?")[0];
      modalRefs.queryInputContainer.innerHTML = "";
      
      document.getElementById("apiCurlContent").textContent = "";
      document.getElementById("apiRequestUrlContent").textContent = "";
      document.getElementById("apiResponseCode").textContent = "";
      document.getElementById("apiResponseBody").innerHTML = "";
      document.getElementById("apiResponseHeaders").textContent = "";
      
      document.querySelector(".tab-button[data-tab='parameters']").click();
      document.querySelector(".response-tab-button[data-response-tab='code']").click();

      const baseApiUrl = `$${BASEURL}$$ {apiPath.split("?")[0]}`;
      const params = new URLSearchParams(apiPath.split("?")[1]);
      let currentParams = {};

      modalRefs.submitBtn.style.display = "inline-block";
      modalRefs.clearBtn.style.display = "none";

      if (params.toString()) {
        modalRefs.clearBtn.style.display = "inline-block";
        
        const paramContainer = document.createElement("div");
        paramContainer.className = "param-container";
        
        params.forEach((_, param) => {
          const paramGroup = document.createElement("div");
          paramGroup.className = "param-group";
          paramGroup.innerHTML = `
            <label>
              ${param.charAt(0).toUpperCase() + param.slice(1)} 
              <span class="required-star">*</span> 
              <span class="param-type">string (query)</span>
            </label>
            <input type="text" class="form-control" placeholder="Enter ${param}..." data-param="${param}" required>
            <p class="param-description">Enter ${param} parameter value</p>
          `;
          
          paramGroup.querySelector("input").addEventListener("input", (e) => {
            currentParams[param] = e.target.value.trim();
            updateCurlAndRequestUrl(baseApiUrl, currentParams);
          });
          
          paramContainer.appendChild(paramGroup);
        });

        if (apiInnerDesc) {
          const innerDescDiv = document.createElement("div");
          innerDescDiv.className = "text-muted mt-3";
          innerDescDiv.style.fontSize = "0.875rem";
          innerDescDiv.innerHTML = apiInnerDesc.replace(/\n/g, "<br>");
          paramContainer.appendChild(innerDescDiv);
        }

        modalRefs.queryInputContainer.appendChild(paramContainer);
        updateCurlAndRequestUrl(baseApiUrl, currentParams);

        modalRefs.submitBtn.onclick = async () => {
          const newParams = new URLSearchParams();
          let isValid = true;
          
          modalRefs.queryInputContainer.querySelectorAll("input").forEach((input) => {
            if (!input.value.trim()) {
              isValid = false;
              input.classList.add("is-invalid");
            } else {
              input.classList.remove("is-invalid");
              newParams.append(input.dataset.param, input.value.trim());
            }
          });
          
          if (isValid) {
            handleApiRequest(`${baseApiUrl}?${newParams.toString()}`, apiName);
          }
        };

        modalRefs.clearBtn.onclick = () => {
          modalRefs.queryInputContainer.querySelectorAll("input").forEach((input) => (input.value = ""));
          currentParams = {};
          updateCurlAndRequestUrl(baseApiUrl, currentParams);
        };
      } else {
        updateCurlAndRequestUrl(baseApiUrl, {});
        modalRefs.submitBtn.onclick = async () => {
          handleApiRequest(baseApiUrl, apiName);
        };
      }

      modal.show();
    });

    // Tab switching
    document.querySelectorAll(".tab-button, .response-tab-button").forEach((button) => {
      button.addEventListener("click", function () {
        const isMainTab = this.classList.contains("tab-button");
        const groupClass = isMainTab ? "tab-button" : "response-tab-button";
        const paneClass = isMainTab ? ".tab-pane" : ".response-tab-pane";
        
        this.parentElement.querySelectorAll(`.${groupClass}`).forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        
        const tabId = isMainTab
          ? `${this.dataset.tab}Tab`
          : `response${this.dataset.responseTab.charAt(0).toUpperCase() + this.dataset.responseTab.slice(1)}Tab`;
        
        const parentPane = this.closest(".tab-content-wrapper") || this.closest(".modal-body");
        if (parentPane) {
                    parentPane.querySelectorAll(paneClass).forEach((pane) => pane.classList.remove("active"));
          const activePane = document.getElementById(tabId);
          if (activePane) activePane.classList.add("active");
        }
      });
    });

    // Copy buttons
    document.getElementById("copyCurl").addEventListener("click", () =>
      copyToClipboard(document.getElementById("apiCurlContent").textContent, "Curl command copied!")
    );
    
    document.getElementById("copyRequestUrl").addEventListener("click", () =>
      copyToClipboard(document.getElementById("apiRequestUrlContent").textContent, "Request URL copied!")
    );
    
    document.getElementById("copyResponseBody").addEventListener("click", () => {
      const responseBodyElement = document.getElementById("apiResponseBody");
      let textToCopy = "";

      if (responseBodyElement.querySelector("img, audio, video")) {
        textToCopy = "Media content - use download button to save the file";
      } else {
        textToCopy = responseBodyElement.textContent || responseBodyElement.innerText;
      }

      copyToClipboard(textToCopy, "Response body copied!");
    });
    
    document.getElementById("downloadResponse").addEventListener("click", () => {
      const responseText = document.getElementById("apiResponseBody").textContent;
      const blob = new Blob([responseText], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "response.json";
      a.click();
      URL.revokeObjectURL(a.href);
      showToast("Response downloaded successfully!", "success");
    });

    // Documentation toggle
    const docsToggle = document.getElementById("docsToggle");
    const docsContent = document.getElementById("docsContent");
    
    if (docsToggle && docsContent) {
      docsToggle.addEventListener("click", () => {
        const isOpen = docsContent.style.display !== "none" && docsContent.style.display !== "";
        docsContent.style.display = isOpen ? "none" : "block";
        docsToggle.classList.toggle("active");
        const icon = docsToggle.querySelector(".fa-chevron-down");
        if (icon) {
          icon.classList.toggle("fa-chevron-up");
        }
      });
    }

    // Feedback button handlers
    const feedbackBtn = document.getElementById("feedbackBtn");
    const footerFeedbackBtn = document.getElementById("footerFeedbackBtn");
    const feedbackModal = new bootstrap.Modal(document.getElementById("feedbackModal"));

    if (feedbackBtn) {
      feedbackBtn.addEventListener("click", (e) => {
        e.preventDefault();
        feedbackModal.show();
      });
    }

    if (footerFeedbackBtn) {
      footerFeedbackBtn.addEventListener("click", (e) => {
        e.preventDefault();
        feedbackModal.show();
      });
    }

    // Feedback form submission
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const feedbackType = document.getElementById("feedbackType").value;
        const feedbackMessage = document.getElementById("feedbackMessage").value;
        
        if (!feedbackType || !feedbackMessage) {
          showToast("Please fill in all fields", "error");
          return;
        }

        // Create WhatsApp message
        const message = `*${feedbackType}*%0A%0A${encodeURIComponent(feedbackMessage)}%0A%0A_Sent from API Documentation_`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, "_blank");
        
        // Close modal and reset form
        feedbackModal.hide();
        feedbackForm.reset();
        showToast("Redirecting to WhatsApp...", "success");
      });
    }

    // Update uptime display
    updateUptimeDisplay();
    setInterval(updateUptimeDisplay, 60000); // Update every minute

  } catch (error) {
    console.error("Error loading settings:", error);
    showToast("Error loading API documentation", "error");
  } finally {
    setTimeout(() => {
      loadingScreen.style.opacity = 0;
      setTimeout(() => {
        loadingScreen.style.display = "none";
        body.classList.remove("no-scroll");
      }, 300);
    }, 500);
  }
});

// Update uptime display
function updateUptimeDisplay() {
  const uptimeElement = document.getElementById("uptimeText");
  const footerUptimeElement = document.getElementById("footerUptime");
  const uptimeDisplay = document.getElementById("uptimeDisplay");
  
  const uptime = Date.now() - uptimeStartTime;
  const hours = Math.floor(uptime / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  
  let uptimeText = "Online";
  if (hours > 0) {
    uptimeText = `$${hours}h$$ {minutes}m`;
  } else {
    uptimeText = `${minutes}m`;
  }
  
  if (uptimeElement) {
    uptimeElement.textContent = uptimeText;
  }
  
  if (footerUptimeElement) {
    footerUptimeElement.textContent = "99.9%";
  }
  
  if (uptimeDisplay) {
    uptimeDisplay.textContent = "99.9%";
  }
}

// Copy to clipboard function
function copyToClipboard(text, successMessage) {
  navigator.clipboard
    .writeText(text)
    .then(() => showToast(successMessage, "success"))
    .catch((err) => {
      console.error("Could not copy text: ", err);
      showToast("Failed to copy to clipboard", "error");
    });
}

// Show toast notification
function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";

  toast.innerHTML = `
    <i class="${icon} toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 400);
  }, 3000);
}

// Update curl and request URL
function updateCurlAndRequestUrl(baseApiUrl, params) {
  const newParams = new URLSearchParams(params);
  const fullRequestUrl = `$${baseApiUrl}$$ {newParams.toString() ? "?" + newParams.toString() : ""}`;
  
  document.getElementById("apiRequestUrlContent").textContent = fullRequestUrl;
  document.getElementById("apiCurlContent").textContent = `curl -X 'GET' \\\n  '${fullRequestUrl}' \\\n  -H 'accept: */*'`;
}

// Convert Blob to Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Handle API request
async function handleApiRequest(apiUrl, apiName) {
  const apiResponseCode = document.getElementById("apiResponseCode");
  const apiResponseBody = document.getElementById("apiResponseBody");
  const apiResponseHeaders = document.getElementById("apiResponseHeaders");

  apiResponseCode.textContent = "Loading...";
  apiResponseBody.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Fetching data...</p>
    </div>
  `;
  apiResponseHeaders.textContent = "Loading...";

  document.querySelector(".tab-button[data-tab='responses']").click();

  const startTime = Date.now();

  try {
    const response = await fetch(apiUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const headers = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });

    // Update response time display
    const responseTimeDisplay = document.getElementById("responseTimeDisplay");
    if (responseTimeDisplay) {
      responseTimeDisplay.textContent = `~${responseTime}ms`;
    }

    apiResponseCode.textContent = `$${response.status}$$ {response.statusText} (${responseTime}ms)`;
    apiResponseHeaders.textContent = Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      try {
        const errorData = await response.json();
        apiResponseBody.textContent = JSON.stringify(errorData, null, 2);
      } catch (e) {
        apiResponseBody.textContent = await response.text();
      }
      showToast(`Request failed with status ${response.status}`, "error");
      return;
    }

    // Handle different content types
    if (contentType.startsWith("image/") || contentType.startsWith("audio/") || contentType.startsWith("video/")) {
      const blob = await response.blob();
      const base64data = await blobToBase64(blob);

      if (contentType.startsWith("image/")) {
        apiResponseBody.innerHTML = `
          <div class="media-preview">
            <img src="${base64data}" alt="${apiName}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          </div>
        `;
      } else if (contentType.startsWith("audio/")) {
        apiResponseBody.innerHTML = `
          <div class="media-preview">
            <audio controls src="${base64data}" style="width: 100%;"></audio>
          </div>
        `;
      } else if (contentType.startsWith("video/")) {
        apiResponseBody.innerHTML = `
          <div class="media-preview">
            <video controls src="${base64data}" style="max-width: 100%; border-radius: 8px;"></video>
          </div>
        `;
      }
      showToast("Media loaded successfully!", "success");
    } else if (contentType.includes("application/json")) {
      const data = await response.json();
      apiResponseBody.textContent = JSON.stringify(data, null, 2);
      showToast("Request successful!", "success");
    } else if (contentType.startsWith("text/")) {
      apiResponseBody.textContent = await response.text();
      showToast("Request successful!", "success");
    } else {
      apiResponseBody.textContent = "Preview for this content type is not available.";
      showToast("Response received but preview unavailable", "success");
    }
  } catch (error) {
    apiResponseCode.textContent = "Error";
    apiResponseBody.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h4>Request Failed</h4>
        <p>${error.message}</p>
      </div>
    `;
    apiResponseHeaders.textContent = "N/A";
    showToast(`Network error: ${error.message}`, "error");
  }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  // Escape to close modals
  if (e.key === "Escape") {
    const modals = document.querySelectorAll(".modal.show");
    modals.forEach((modal) => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });
  }
});

// Add loading states for better UX
document.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button && button.type === "submit") {
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = originalText;
    }, 2000);
  }
});

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now();
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
  
  // Update response time display with actual load time
  const responseTimeDisplay = document.getElementById("responseTimeDisplay");
  if (responseTimeDisplay && loadTime < 1000) {
    responseTimeDisplay.textContent = `~${Math.round(loadTime)}ms`;
  }
});
