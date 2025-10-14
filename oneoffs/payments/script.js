// State management
let currentStep = 1
let paymentData = {
  recipient: null,
  recipientUsername: null,
  recipientAvatar: null,
  amount: "",
  note: "",
  pin: "",
}
let failureAttempts = 0

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  updateUI()
})

function setupEventListeners() {
  // Amount input - only allow numbers and decimal
  const amountInput = document.getElementById("amountInput")
  amountInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^\d.]/g, "")
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].substring(0, 2)
    }
    e.target.value = value
    paymentData.amount = value
    validateStep()
  })

  // Note input
  const noteInput = document.getElementById("noteInput")
  noteInput.addEventListener("input", (e) => {
    paymentData.note = e.target.value
  })

  // PIN inputs
  const pinInputs = ["pin1", "pin2", "pin3", "pin4"]
  pinInputs.forEach((id, index) => {
    const input = document.getElementById(id)

    input.addEventListener("input", (e) => {
      const value = e.target.value.replace(/\D/g, "")
      e.target.value = value

      if (value && index < 3) {
        document.getElementById(pinInputs[index + 1]).focus()
      }

      updatePinState()
    })

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        document.getElementById(pinInputs[index - 1]).focus()
      }
    })
  })

  // Checkboxes for friction
  ;["termsCheck", "confirmCheck", "captchaCheck"].forEach((id) => {
    document.getElementById(id).addEventListener("change", validateStep)
  })

  // Recipient search
  const recipientSearch = document.getElementById("recipientSearch")
  recipientSearch.addEventListener("input", validateStep)

  // Cancel button
  const cancelButton = document.getElementById("cancelButton")
  cancelButton.addEventListener("click", showExitModal)
}

function selectRecipient(name, username) {
  paymentData.recipient = name
  paymentData.recipientUsername = username

  // Generate avatar style
  const colors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ]
  paymentData.recipientAvatar = colors[Math.floor(Math.random() * colors.length)]

  // Animate selection
  const contactItems = document.querySelectorAll(".contact-item")
  contactItems.forEach((item) => {
    if (item.textContent.includes(name)) {
      item.style.background = "rgba(0, 102, 255, 0.1)"
      item.style.transform = "scale(0.98)"
      setTimeout(() => {
        item.style.background = ""
        item.style.transform = ""
      }, 200)
    }
  })

  validateStep()

  // Auto-advance after short delay
  setTimeout(() => {
    if (currentStep === 1) {
      nextStep()
    }
  }, 300)
}

function setAmount(amount) {
  const amountInput = document.getElementById("amountInput")
  amountInput.value = amount
  paymentData.amount = amount

  // Animate button
  event.target.style.transform = "scale(0.95)"
  setTimeout(() => {
    event.target.style.transform = ""
  }, 150)

  validateStep()
}

function updatePinState() {
  const pin1 = document.getElementById("pin1").value
  const pin2 = document.getElementById("pin2").value
  const pin3 = document.getElementById("pin3").value
  const pin4 = document.getElementById("pin4").value

  paymentData.pin = pin1 + pin2 + pin3 + pin4
  validateStep()
}

function validateStep() {
  const nextBtn = document.getElementById("nextBtn")
  let isValid = false

  switch (currentStep) {
    case 1:
      isValid = paymentData.recipient !== null
      break
    case 2:
      isValid = paymentData.amount && Number.parseFloat(paymentData.amount) > 0
      break
    case 3:
      isValid = true
      break
    case 4:
      const termsChecked = document.getElementById("termsCheck").checked
      const confirmChecked = document.getElementById("confirmCheck").checked
      const captchaChecked = document.getElementById("captchaCheck").checked
      const pinComplete = paymentData.pin.length === 4

      isValid = termsChecked && confirmChecked && captchaChecked && pinComplete
      break
  }

  nextBtn.disabled = !isValid
}

function nextStep() {
  if (currentStep === 4) {
    submitPayment()
    return
  }

  currentStep++

  if (currentStep === 3) {
    updateReviewData()
  }

  if (currentStep === 4) {
    updateFinalReview()
  }

  updateUI()
  validateStep()
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--
    updateUI()
    validateStep()
  }
}

function updateUI() {
  // Update step content visibility
  document.querySelectorAll(".step-content").forEach((content, index) => {
    content.classList.toggle("active", index + 1 === currentStep)
  })

  // Update step indicators
  document.querySelectorAll(".step-indicator").forEach((indicator, index) => {
    const stepNum = index + 1
    indicator.classList.toggle("active", stepNum === currentStep)
    indicator.classList.toggle("completed", stepNum < currentStep)
  })

  // Update progress bar
  const progress = (currentStep / 4) * 100
  document.getElementById("progressBar").style.width = progress + "%"

  // Update navigation buttons
  const backBtn = document.getElementById("backBtn")
  const nextBtn = document.getElementById("nextBtn")

  backBtn.style.display = currentStep > 1 ? "flex" : "none"

  if (currentStep === 4) {
    nextBtn.innerHTML = `
            Submit Payment
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16 10l-6 6m0 0l-6-6m6 6V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
  } else {
    nextBtn.innerHTML = `
            Continue
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
  }
}

function updateReviewData() {
  // Update recipient info
  const initials = paymentData.recipient
    .split(" ")
    .map((n) => n[0])
    .join("")
  const reviewAvatar = document.getElementById("reviewAvatar")
  reviewAvatar.textContent = initials
  reviewAvatar.style.background = paymentData.recipientAvatar

  document.getElementById("reviewName").textContent = paymentData.recipient
  document.getElementById("reviewUsername").textContent = paymentData.recipientUsername

  // Update amount
  const amount = Number.parseFloat(paymentData.amount).toFixed(2)
  document.getElementById("reviewAmount").textContent = "$" + amount
  document.getElementById("reviewTotal").textContent = "$" + amount

  // Update note if exists
  if (paymentData.note) {
    document.getElementById("reviewNoteSection").style.display = "block"
    document.getElementById("reviewNote").textContent = paymentData.note
  } else {
    document.getElementById("reviewNoteSection").style.display = "none"
  }
}

function updateFinalReview() {
  const finalRecipientElement = document.getElementById("finalRecipient")
  const initials = paymentData.recipient
    .split(" ")
    .map((n) => n[0])
    .join("")

  // Create recipient display with avatar
  finalRecipientElement.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="width: 32px; height: 32px; border-radius: 50%; background: ${paymentData.recipientAvatar}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">
        ${initials}
      </div>
      <div>
        <div style="font-weight: 600; color: #1a1a1a;">${paymentData.recipient}</div>
        <div style="font-size: 14px; color: #666;">${paymentData.recipientUsername}</div>
      </div>
    </div>
  `

  const amount = Number.parseFloat(paymentData.amount).toFixed(2)
  document.getElementById("finalAmount").textContent = "$" + amount
}

function submitPayment() {
  // Show loading overlay
  const loadingOverlay = document.getElementById("loadingOverlay")
  loadingOverlay.classList.add("show")

  // Simulate processing delay
  setTimeout(() => {
    loadingOverlay.classList.remove("show")

    let shouldSucceed = false
    if (failureAttempts >= 3) {
      shouldSucceed = Math.random() < 0.25
    }

    if (shouldSucceed) {
      showToast("Payment Successful!", "Your payment has been sent successfully.", "success")

      setTimeout(() => {
        showSuccessPage()
      }, 1500)
    } else {
      failureAttempts++

      // Array of frustrating error messages
      const errorMessages = [
        {
          title: "Payment Failed",
          message: "An unexpected error occurred. Please try again later. (Error code: PY-4892)",
        },
        {
          title: "Transaction Declined",
          message: "Your payment could not be processed at this time. Please verify your account details.",
        },
        {
          title: "Network Error",
          message: "Unable to connect to payment server. Check your internet connection and try again.",
        },
        {
          title: "Security Check Failed",
          message: "Your transaction was flagged for security review. Please contact support for assistance.",
        },
        {
          title: "Service Unavailable",
          message: "Payment services are temporarily unavailable. Please try again in a few minutes.",
        },
      ]

      // Pick a random error
      const error = errorMessages[Math.floor(Math.random() * errorMessages.length)]

      // Show error toast
      showToast(error.title, error.message, "error")

      // Shake the submit button
      const nextBtn = document.getElementById("nextBtn")
      nextBtn.style.animation = "shake 0.5s"
      setTimeout(() => {
        nextBtn.style.animation = ""
      }, 500)
    }
  }, 2000)
}

function showToast(title, message, type = "error") {
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toastTitle")
  const toastMessage = document.getElementById("toastMessage")

  toast.className = "toast " + type
  toastTitle.textContent = title
  toastMessage.textContent = message

  setTimeout(() => {
    toast.classList.add("show")
  }, 100)

  // Auto-hide after 6 seconds
  setTimeout(() => {
    hideToast()
  }, 6000)
}

function hideToast() {
  const toast = document.getElementById("toast")
  toast.classList.remove("show")
}

function showExitModal() {
  const modal = document.getElementById("exitModal")
  modal.classList.add("show")
}

function hideExitModal() {
  const modal = document.getElementById("exitModal")
  modal.classList.remove("show")
}

function confirmExit() {
  hideExitModal()
  resetFlow()
}

function resetFlow() {
  currentStep = 1
  failureAttempts = 0
  paymentData = {
    recipient: null,
    recipientUsername: null,
    recipientAvatar: null,
    amount: "",
    note: "",
    pin: "",
  }

  document.getElementById("progressContainer").style.display = "block"
  document.getElementById("stepIndicators").style.display = "flex"
  document.getElementById("navButtons").style.display = "flex"
  document.getElementById("closeBtn").style.display = "block"

  // Reset all inputs
  document.getElementById("recipientSearch").value = ""
  document.getElementById("amountInput").value = ""
  document.getElementById("noteInput").value = ""
  ;["pin1", "pin2", "pin3", "pin4"].forEach((id) => {
    document.getElementById(id).value = ""
  })
  ;["termsCheck", "confirmCheck", "captchaCheck"].forEach((id) => {
    document.getElementById(id).checked = false
  })

  updateUI()
  validateStep()
}

function showSuccessPage() {
  // Hide progress bar and step indicators
  document.getElementById("progressContainer").style.display = "none"
  document.getElementById("stepIndicators").style.display = "none"
  document.getElementById("navButtons").style.display = "none"
  document.getElementById("closeBtn").style.display = "none"

  // Show success step
  document.querySelectorAll(".step-content").forEach((content) => {
    content.classList.remove("active")
  })
  document.getElementById("step5").classList.add("active")

  // Populate success data
  const initials = paymentData.recipient
    .split(" ")
    .map((n) => n[0])
    .join("")

  const successAvatar = document.getElementById("successAvatar")
  successAvatar.textContent = initials
  successAvatar.style.background = paymentData.recipientAvatar

  document.getElementById("successName").textContent = paymentData.recipient
  document.getElementById("successUsername").textContent = paymentData.recipientUsername

  const amount = Number.parseFloat(paymentData.amount).toFixed(2)
  document.getElementById("successAmount").textContent = "$" + amount

  // Generate transaction ID
  const transactionId = "TXN" + Math.random().toString(36).substring(2, 11).toUpperCase()
  document.getElementById("transactionId").textContent = transactionId

  // Set current date
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
  document.getElementById("transactionDate").textContent = dateStr
}
