/**
 * AllChat - Main Application Logic
 * Multi-LLM Chat Interface with streaming responses
 */

(function () {
  'use strict';

  // ===== State Management =====
  const state = {
    currentPromptIndex: 0,
    conversationSet: 'main', // 'main' or 'alternate'
    focusedLLM: null,
    focusModeStartTime: null,
    isStreaming: false,
    streamingControllers: {},
    currentLayout: 'grid',
    ratings: {} // { 'tarus-0': 'up', 'mock-0': 'down', ... }
  };

  // LLM identifiers
  const LLMS = ['tarus', 'mock', 'shallowfind', 'alpaca'];

  // ===== DOM Elements =====
  let elements = {};

  // ===== Initialization =====
  function init() {
    cacheElements();
    waitForMixpanel().then(() => {
      applyExperimentLayout();
      setupEventListeners();
      showWelcomeState();
    });
  }

  function cacheElements() {
    elements = {
      panelsContainer: document.getElementById('panelsContainer'),
      layoutSwitcher: document.getElementById('layoutSwitcher'),
      promptInput: document.getElementById('promptInput'),
      sendBtn: document.getElementById('sendBtn'),
      nextPromptBtn: document.getElementById('nextPromptBtn'),
      backToAllBtn: document.getElementById('backToAllBtn'),
      resetBtn: document.getElementById('resetBtn'),
      attachBtn: document.getElementById('attachBtn'),
      voiceBtn: document.getElementById('voiceBtn'),
      panels: {},
      messages: {},
      focusBtns: {},
      copyBtns: {},
      regenerateBtns: {},
      ratingBtns: {}
    };

    // Cache panel-specific elements
    LLMS.forEach(llm => {
      elements.panels[llm] = document.getElementById(`panel-${llm}`);
      elements.messages[llm] = document.getElementById(`messages-${llm}`);
      elements.focusBtns[llm] = elements.panels[llm].querySelector('.focus-btn');
      elements.copyBtns[llm] = elements.panels[llm].querySelector('.copy-btn');
      elements.regenerateBtns[llm] = elements.panels[llm].querySelector('.regenerate-btn');
      elements.ratingBtns[llm] = {
        up: elements.panels[llm].querySelector('.thumbs-up'),
        down: elements.panels[llm].querySelector('.thumbs-down')
      };
    });
  }

  function waitForMixpanel() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.allchatConfig && window.allchatConfig.initialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Fallback: resolve after 3 seconds regardless
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 3000);
    });
  }

  function applyExperimentLayout() {
    const layout = window.allchatConfig?.layout || 'grid';
    setLayout(layout, 'experiment');

    // Show/hide layout switcher based on feature flag
    if (window.allchatConfig?.showLayoutSwitcher) {
      elements.layoutSwitcher.style.display = 'flex';
    }
  }

  // ===== Event Listeners =====
  function setupEventListeners() {
    // Send button
    elements.sendBtn.addEventListener('click', handleSendClick);

    // Enter key in input
    elements.promptInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendClick();
      }
    });

    // Input focus tracking
    elements.promptInput.addEventListener('focus', () => {
      mixpanel.track('input_focused');
    });

    // Next prompt button
    elements.nextPromptBtn.addEventListener('click', handleNextPrompt);

    // Back to all button
    elements.backToAllBtn.addEventListener('click', exitFocusMode);

    // Reset button
    elements.resetBtn.addEventListener('click', () => {
      mixpanel.track('reset_clicked');
      if (window.RESET) {
        window.RESET();
      } else {
        window.location.reload();
      }
    });

    // Attach button (demo - shows alert)
    elements.attachBtn.addEventListener('click', () => {
      mixpanel.track('attach_clicked');
      showToast('File attachment coming soon!');
    });

    // Voice button (demo - shows alert)
    elements.voiceBtn.addEventListener('click', () => {
      mixpanel.track('voice_input_clicked');
      showToast('Voice input coming soon!');
    });

    // Layout switcher buttons
    elements.layoutSwitcher.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newLayout = btn.dataset.layout;
        if (newLayout !== state.currentLayout) {
          setLayout(newLayout, 'switcher');
        }
      });
    });

    // Focus buttons and panel clicks
    LLMS.forEach(llm => {
      elements.focusBtns[llm].addEventListener('click', (e) => {
        e.stopPropagation();
        enterFocusMode(llm);
      });

      // Copy button
      elements.copyBtns[llm].addEventListener('click', (e) => {
        e.stopPropagation();
        handleCopy(llm);
      });

      // Regenerate button
      elements.regenerateBtns[llm].addEventListener('click', (e) => {
        e.stopPropagation();
        handleRegenerate(llm);
      });

      // Rating buttons
      elements.ratingBtns[llm].up.addEventListener('click', (e) => {
        e.stopPropagation();
        handleRating(llm, 'up');
      });

      elements.ratingBtns[llm].down.addEventListener('click', (e) => {
        e.stopPropagation();
        handleRating(llm, 'down');
      });
    });
  }

  // ===== Copy & Regenerate =====
  const LLM_DISPLAY_NAMES = {
    tarus: 'Tarus',
    mock: 'Mock',
    shallowfind: 'ShallowFind',
    alpaca: 'Alpaca'
  };

  function handleCopy(llm) {
    const messages = elements.messages[llm].querySelectorAll('.message.assistant');
    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      const text = lastMessage.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${LLM_DISPLAY_NAMES[llm]} response!`);
        mixpanel.track('response_copied', {
          llm_name: llm,
          prompt_index: state.currentPromptIndex,
          character_count: text.length
        });
      }).catch(() => {
        showToast('Failed to copy');
      });
    } else {
      showToast('No response to copy yet');
    }
  }

  function handleRegenerate(llm) {
    mixpanel.track('regenerate_clicked', {
      llm_name: llm,
      prompt_index: state.currentPromptIndex
    });
    showToast(`Regenerating ${LLM_DISPLAY_NAMES[llm]} response...`);
    // In a real app, this would re-fetch the response
  }

  function showToast(message) {
    // Simple toast notification
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // ===== Layout Management =====
  function setLayout(layout, source = 'unknown') {
    const oldLayout = state.currentLayout;
    state.currentLayout = layout;

    elements.panelsContainer.dataset.layout = layout;

    // Update active button in switcher
    elements.layoutSwitcher.querySelectorAll('.layout-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layout === layout);
    });

    // Track layout change
    if (source !== 'experiment') {
      mixpanel.track('layout_changed', {
        new_layout: layout,
        old_layout: oldLayout,
        change_source: source
      });
    }
  }

  // ===== Focus Mode =====
  function enterFocusMode(llm) {
    if (state.focusedLLM) return;

    state.focusedLLM = llm;
    state.focusModeStartTime = Date.now();

    // Hide other panels
    LLMS.forEach(l => {
      if (l !== llm) {
        elements.panels[l].classList.add('hidden');
      }
    });

    // Expand focused panel
    elements.panels[llm].classList.add('focused');

    // Show back button
    elements.backToAllBtn.style.display = 'flex';

    // Track event
    mixpanel.track('focus_mode_entered', {
      llm_name: llm,
      current_layout: state.currentLayout,
      prompt_index: state.currentPromptIndex
    });
  }

  function exitFocusMode() {
    if (!state.focusedLLM) return;

    const llm = state.focusedLLM;
    const duration = Date.now() - state.focusModeStartTime;

    // Remove focus styling
    elements.panels[llm].classList.remove('focused');

    // Show all panels
    LLMS.forEach(l => {
      elements.panels[l].classList.remove('hidden');
    });

    // Hide back button
    elements.backToAllBtn.style.display = 'none';

    // Track event
    mixpanel.track('focus_mode_exited', {
      llm_name: llm,
      duration_ms: duration,
      current_layout: state.currentLayout
    });

    state.focusedLLM = null;
    state.focusModeStartTime = null;
  }

  // ===== Rating System =====
  function handleRating(llm, rating) {
    const key = `${llm}-${state.currentPromptIndex}`;
    const currentRating = state.ratings[key];

    // Toggle rating
    if (currentRating === rating) {
      // Remove rating
      delete state.ratings[key];
      elements.ratingBtns[llm].up.classList.remove('active');
      elements.ratingBtns[llm].down.classList.remove('active');

      mixpanel.track('rating_removed', {
        llm_name: llm,
        previous_rating: rating,
        prompt_index: state.currentPromptIndex
      });
    } else {
      // Set new rating
      state.ratings[key] = rating;
      elements.ratingBtns[llm].up.classList.toggle('active', rating === 'up');
      elements.ratingBtns[llm].down.classList.toggle('active', rating === 'down');

      // Track event
      mixpanel.track('rating_given', {
        llm_name: llm,
        rating: rating,
        prompt_index: state.currentPromptIndex,
        previous_rating: currentRating || null
      });
    }
  }

  function resetRatings() {
    LLMS.forEach(llm => {
      elements.ratingBtns[llm].up.classList.remove('active');
      elements.ratingBtns[llm].down.classList.remove('active');
    });
  }

  // ===== Prompt Handling =====
  function handleSendClick() {
    const text = elements.promptInput.value.trim();
    if (text && !state.isStreaming) {
      // Switch to alternate conversation set for free text
      state.conversationSet = 'alternate';
      state.currentPromptIndex = 0;
      sendPrompt(text, false);
      elements.promptInput.value = '';
    }
  }

  function handleNextPrompt() {
    if (state.isStreaming) return;

    const conversations = CONVERSATIONS[state.conversationSet];
    const fromIndex = state.currentPromptIndex;

    // Randomly select a different prompt
    let toIndex;
    if (conversations.length <= 1) {
      toIndex = 0;
    } else {
      do {
        toIndex = Math.floor(Math.random() * conversations.length);
      } while (toIndex === fromIndex);
    }

    state.currentPromptIndex = toIndex;

    // Get the randomly selected prompt
    const convo = CONVERSATIONS[state.conversationSet][toIndex];
    sendPrompt(convo.prompt, true);

    // Track event
    mixpanel.track('next_prompt_clicked', {
      from_index: fromIndex,
      to_index: toIndex,
      prompt_text: convo.prompt,
      conversation_set: state.conversationSet
    });
  }

  function sendPrompt(promptText, isScripted) {
    if (state.isStreaming) return;

    state.isStreaming = true;
    resetRatings();

    // Track prompt sent
    mixpanel.track('prompt_sent', {
      prompt_text: promptText,
      prompt_index: state.currentPromptIndex,
      is_scripted: isScripted,
      prompt_length: promptText.length,
      conversation_set: state.conversationSet
    });

    // Add user message to all panels
    LLMS.forEach(llm => {
      addMessage(llm, promptText, 'user');
    });

    // Get responses based on current prompt
    let responses;
    if (isScripted) {
      responses = CONVERSATIONS[state.conversationSet][state.currentPromptIndex].responses;
    } else {
      // For free text, cycle through alternate responses
      const altConvos = CONVERSATIONS.alternate;
      const randomIndex = Math.floor(Math.random() * altConvos.length);
      responses = altConvos[randomIndex].responses;
    }

    // Stream responses from all LLMs
    let completedCount = 0;
    LLMS.forEach(llm => {
      const response = responses[llm];
      streamResponse(llm, response.text, response.speed || 30, () => {
        completedCount++;
        if (completedCount === LLMS.length) {
          state.isStreaming = false;
        }
      });
    });
  }

  // ===== Message Display =====
  function addMessage(llm, text, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = text;
    elements.messages[llm].appendChild(messageDiv);
    scrollToBottom(llm);
    return messageDiv;
  }

  function streamResponse(llm, text, baseSpeed, onComplete) {
    const startTime = Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant streaming';
    elements.messages[llm].appendChild(messageDiv);

    let charIndex = 0;
    const speedVariance = LLM_SPEEDS[llm] || { min: 20, max: 40 };

    function typeNextChar() {
      if (charIndex < text.length) {
        messageDiv.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        scrollToBottom(llm);

        // Variable typing speed for realism
        const speed = speedVariance.min + Math.random() * (speedVariance.max - speedVariance.min);

        // Pause longer at punctuation
        const currentChar = text[charIndex - 1];
        const delay = ['.', '!', '?'].includes(currentChar) ? speed * 3 :
          [',', ';', ':'].includes(currentChar) ? speed * 1.5 :
            currentChar === '\n' ? speed * 2 : speed;

        state.streamingControllers[llm] = setTimeout(typeNextChar, delay);
      } else {
        // Streaming complete
        messageDiv.classList.remove('streaming');
        const responseTime = Date.now() - startTime;

        // Track completion
        mixpanel.track('response_completed', {
          llm_name: llm,
          response_time_ms: responseTime,
          character_count: text.length,
          prompt_index: state.currentPromptIndex
        });

        if (onComplete) onComplete();
      }
    }

    // Add LLM-specific initial delay for more variety
    const delayConfig = speedVariance.initialDelay || { min: 200, max: 500 };
    const initialDelay = delayConfig.min + Math.random() * (delayConfig.max - delayConfig.min);
    state.streamingControllers[llm] = setTimeout(typeNextChar, initialDelay);
  }

  function scrollToBottom(llm) {
    const container = elements.messages[llm];
    container.scrollTop = container.scrollHeight;
  }

  // ===== Welcome State =====
  const WELCOME_MESSAGES = {
    tarus: {
      icon: '✨',
      text: 'I blend poetry with science to illuminate the cosmos'
    },
    mock: {
      icon: '😏',
      text: 'Serving truth with a side of sarcasm since... whenever'
    },
    shallowfind: {
      icon: '📊',
      text: 'Data-driven insights. Precision analysis. No fluff.'
    },
    alpaca: {
      icon: '🌱',
      text: 'Let\'s explore life\'s big questions together'
    }
  };

  function showWelcomeState() {
    LLMS.forEach(llm => {
      const welcome = WELCOME_MESSAGES[llm];
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'welcome-message';
      welcomeDiv.innerHTML = `
        <span class="welcome-icon">${welcome.icon}</span>
        <p>${welcome.text}</p>
      `;
      elements.messages[llm].appendChild(welcomeDiv);
    });
  }

  function clearWelcomeState() {
    LLMS.forEach(llm => {
      const welcome = elements.messages[llm].querySelector('.welcome-message');
      if (welcome) {
        welcome.remove();
      }
    });
  }

  // Override sendPrompt to clear welcome on first use
  const originalSendPrompt = sendPrompt;
  sendPrompt = function (promptText, isScripted) {
    clearWelcomeState();
    originalSendPrompt(promptText, isScripted);
  };

  // ===== Start Application =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
