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
      clearAllBtn: document.getElementById('clearAllBtn'),
      backToAllBtn: document.getElementById('backToAllBtn'),
      resetBtn: document.getElementById('resetBtn'),
      attachBtn: document.getElementById('attachBtn'),
      voiceBtn: document.getElementById('voiceBtn'),
      panels: {},
      messages: {},
      focusBtns: {},
      collapseBtns: {},
      copyBtns: {},
      regenerateBtns: {},
      ratingBtns: {},
      toggleAllBtn: document.getElementById('toggleAllBtn')
    };

    // Cache panel-specific elements
    LLMS.forEach(llm => {
      elements.panels[llm] = document.getElementById(`panel-${llm}`);
      elements.messages[llm] = document.getElementById(`messages-${llm}`);
      elements.focusBtns[llm] = elements.panels[llm].querySelector('.focus-btn');
      elements.collapseBtns[llm] = elements.panels[llm].querySelector('.collapse-btn');
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

    // Clear all button
    elements.clearAllBtn.addEventListener('click', handleClearAll);

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

    // Attach button (demo - shows demo file)
    elements.attachBtn.addEventListener('click', () => {
      mixpanel.track('attach_clicked');
      showDemoAttachment();
    });

    // Voice button (demo - shows waveform)
    elements.voiceBtn.addEventListener('click', () => {
      mixpanel.track('voice_input_clicked');
      showDemoVoiceInput();
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

      // Collapse button
      elements.collapseBtns[llm].addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanelCollapse(llm);
      });
    });

    // Toggle all panels button
    elements.toggleAllBtn.addEventListener('click', toggleAllPanels);
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

  // Demo attachment chip
  function showDemoAttachment() {
    // Remove existing attachment if any
    const existing = document.querySelector('.demo-attachment');
    if (existing) {
      existing.remove();
      showToast('Attachment removed');
      return;
    }

    const chip = document.createElement('div');
    chip.className = 'demo-attachment';
    chip.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M3 1a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V5l-4-4H3zm4 0v3a1 1 0 001 1h3"/>
      </svg>
      <span>cosmic_data.json</span>
      <button class="remove-attachment" title="Remove">&times;</button>
    `;

    // Insert before input
    const inputWrapper = document.querySelector('.input-wrapper');
    inputWrapper.insertBefore(chip, elements.promptInput);

    // Remove handler
    chip.querySelector('.remove-attachment').addEventListener('click', (e) => {
      e.stopPropagation();
      chip.remove();
      showToast('Attachment removed');
    });

    showToast('Demo file attached');
  }

  // Demo voice input waveform
  function showDemoVoiceInput() {
    const btn = elements.voiceBtn;

    // Toggle recording state
    if (btn.classList.contains('recording')) {
      btn.classList.remove('recording');
      elements.promptInput.value = "What mysteries lie beyond the event horizon?";
      showToast('Voice transcribed');
      return;
    }

    btn.classList.add('recording');
    showToast('Listening... (click again to stop)');

    // Auto-stop after 3 seconds
    setTimeout(() => {
      if (btn.classList.contains('recording')) {
        btn.classList.remove('recording');
        elements.promptInput.value = "What mysteries lie beyond the event horizon?";
        showToast('Voice transcribed');
      }
    }, 3000);
  }

  // Clear all messages
  function handleClearAll() {
    // Stop any active streaming
    Object.values(state.streamingControllers).forEach(controller => {
      if (controller) clearTimeout(controller);
    });
    state.streamingControllers = {};
    state.isStreaming = false;

    // Clear all message containers
    LLMS.forEach(llm => {
      elements.messages[llm].innerHTML = '';
    });

    // Reset state
    state.currentPromptIndex = 0;
    state.conversationSet = 'main';
    resetRatings();

    // Remove any attachments
    const attachment = document.querySelector('.demo-attachment');
    if (attachment) attachment.remove();

    // Clear input
    elements.promptInput.value = '';

    // Show welcome state again
    showWelcomeState();

    // Track and notify
    mixpanel.track('clear_all_clicked');
    showToast('Conversation cleared');
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

    // Update input placeholder
    elements.promptInput.placeholder = `Continue chatting with ${LLM_DISPLAY_NAMES[llm]}...`;

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

    // Restore input placeholder
    elements.promptInput.placeholder = 'Ask all four LLMs anything...';

    // Track event
    mixpanel.track('focus_mode_exited', {
      llm_name: llm,
      duration_ms: duration,
      current_layout: state.currentLayout
    });

    state.focusedLLM = null;
    state.focusModeStartTime = null;
  }

  // ===== Panel Collapse =====
  function togglePanelCollapse(llm) {
    const panel = elements.panels[llm];
    const isCollapsed = panel.classList.toggle('collapsed');

    // Track event
    mixpanel.track('panel_collapse_toggled', {
      llm_name: llm,
      collapsed: isCollapsed,
      current_layout: state.currentLayout
    });

    // Update toggle all button state
    updateToggleAllButtonState();
  }

  function toggleAllPanels() {
    // Check if any panels are expanded (not collapsed)
    const anyExpanded = LLMS.some(llm => !elements.panels[llm].classList.contains('collapsed'));

    // If any are expanded, collapse all. Otherwise, expand all.
    LLMS.forEach(llm => {
      elements.panels[llm].classList.toggle('collapsed', anyExpanded);
    });

    // Track event
    mixpanel.track('toggle_all_panels', {
      action: anyExpanded ? 'collapse_all' : 'expand_all',
      current_layout: state.currentLayout
    });

    // Update button state
    updateToggleAllButtonState();
  }

  function updateToggleAllButtonState() {
    const allCollapsed = LLMS.every(llm => elements.panels[llm].classList.contains('collapsed'));
    elements.toggleAllBtn.classList.toggle('all-collapsed', allCollapsed);
    elements.toggleAllBtn.title = allCollapsed ? 'Expand all panels' : 'Collapse all panels';
  }

  // ===== Rating System =====
  function handleRating(llm, rating) {
    const key = `${llm}-${state.currentPromptIndex}`;
    const currentRating = state.ratings[key];
    const btn = elements.ratingBtns[llm][rating];

    // Add click animation
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);

    // Toggle rating
    if (currentRating === rating) {
      // Remove rating
      delete state.ratings[key];
      elements.ratingBtns[llm].up.classList.remove('active');
      elements.ratingBtns[llm].down.classList.remove('active');

      showToast(`Rating removed for ${LLM_DISPLAY_NAMES[llm]}`);

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

      const ratingText = rating === 'up' ? 'Liked' : 'Disliked';
      showToast(`${ratingText} ${LLM_DISPLAY_NAMES[llm]}'s response`);

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

    const speedVariance = LLM_SPEEDS[llm] || { min: 20, max: 40 };

    // Split text into chunks (words) for realistic streaming
    const words = text.split(/(\s+)/); // Keep whitespace
    let wordIndex = 0;
    let displayedText = '';

    function streamNextChunk() {
      if (wordIndex < words.length) {
        // Stream 1-3 words at a time for variety
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = words.slice(wordIndex, wordIndex + chunkSize).join('');
        displayedText += chunk;
        wordIndex += chunkSize;

        messageDiv.textContent = displayedText;
        scrollToBottom(llm);

        // Calculate delay
        let delay = speedVariance.min + Math.random() * (speedVariance.max - speedVariance.min);

        // Check last character for punctuation pauses
        const lastChar = chunk.trim().slice(-1);
        if (['.', '!', '?'].includes(lastChar)) {
          delay *= 4; // Longer pause at sentence end
        } else if ([',', ';', ':'].includes(lastChar)) {
          delay *= 2;
        } else if (chunk.includes('\n')) {
          delay *= 3;
        }

        // Random "thinking" pauses (5% chance)
        if (Math.random() < 0.05) {
          delay += 150 + Math.random() * 200;
        }

        // Scale delay by chunk size
        delay *= (chunkSize * 0.7);

        state.streamingControllers[llm] = setTimeout(streamNextChunk, delay);
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
    state.streamingControllers[llm] = setTimeout(streamNextChunk, initialDelay);
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
