class ChatBox extends Component {

    /**
     * Define attribute types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            hidden: {
                type: "boolean",
                observe: true
            },
            resizable: {
                type: "boolean",
                observe: true
            },
        };
    }

    /**
     * Generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ChatBox.attrTypes);
    }

    /**
     * Generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatBox.name);
    }

    /**
     * Styles of component
     * @returns {string}
     */
    static get style() {
        return (`
            <style>
                :host {
                    --primaryColor:  #3AD07A;
                    --hoverColor: #edfbf3;
                    display: block;
                    height: 100%;
                    max-height: 100%;
                    flex-grow: 1;
                    position: relative;
                    resize: both;
                    overflow: auto;
                }
                :host([hidden]) .chat-box-inner {
                    visibility: hidden;
                    opacity: 0;
                }
                :host(:not([hidden])) .chat-placeholder {
                    display: none;
                }
                * {
                    box-sizing: border-box;
                    user-select: none;                        
                }
                .chat-box-inner {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .chat-box-inner .chat-list-wrapper {
                    position: relative;
                    background: #3ad07a1f url(./static/chat-box-bg.png);
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    min-height: 0;
                    overflow: hidden;
                }
                .chat-box-inner .scrollable {
                    position: relative;
                    overflow: hidden;
                    overflow-y: auto;
                    min-height: 0;
                    padding: 1em 1em 1.5em;
                    display: grid;
                }
                .chat-box-inner .chat-list-wrapper:before,
                .chat-box-inner .chat-list-wrapper:after {
                    content: '';
                    position: absolute;
                    top: -2px;
                    width: 100%;
                    height: 1px;
                    box-shadow: 0px -2px 10px 3px rgba(0,0,0,0.16);
                    z-index: 1;
                }
                .chat-box-inner .chat-list-wrapper:after {
                    top: unset;
                    bottom: -2px;
                    box-shadow: 0px -2px 10px 1px rgba(0,0,0,0.16);
                }
                .chat-day {
                    margin: 2em 0;
                    text-align: center; 
                }
                .chat-day span {
                    font-size: 14px;
                    padding: .5rem 1.5rem;
                    border-radius: 25px;
                    background: rgba(0,0,0,.2);
                    color: #fff;
                }
                .chat-placeholder {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    padding: 2em;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: #fdfdfd;
                    text-align: center;
                    color: #666;
                }
                .chat-placeholder img {
                    max-width: 500px;
                    margin-bottom: 1rem;
                }
                .chat-placeholder h2 {
                    font-size: calc(.51vh + 2vw + .1vmin);
                    white-space: pre-wrap;
                    font-weight: 500;
                }
                .chat-placeholder p {
                    opacity: .7;
                    line-height: 26px;
                    font-size: 16px;
                    font-weight: 300;
                    max-width: 550px;
                    width: 100%;
                }
                #scroll-to-bottom {
                    position: absolute;
                    right: 1.5rem;
                    bottom: 1.5rem;
                    color: var(--primaryColor);
                    background-color: #fff;
                    border: none;
                    outline: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    box-shadow: 0 0 8px 2px rgba(0,0,0,0.16);
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 16px;
                    transform: translateY(100px);
                    transition: transform .2s ease-in-out;
                }
                #scroll-to-bottom.show {
                    transform: translateY(0px);                    
                }
                @media screen and (max-width: 564px) {
                    .chat-placeholder {
                        display: none;
                    }
                }
                .typing-indicator {
                    display: none;
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: var(--primaryColor);
                    font-style: italic;
                }
                .typing-indicator.show {
                    display: block;
                }
            </style>`)
    }

    /**
     * HTML template of component
     * @returns {string}
     */
    static get template() {
        return (`
            <template>
                ${ChatBox.style}
                <div class="chat-box-inner">
                    <active-chat></active-chat>
                    <div class="chat-list-wrapper">
                        <div class="scrollable" id="chat-list"></div>
                        <button id="scroll-to-bottom">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <div class="typing-indicator" id="typing-indicator">User is typing...</div>
                    </div>
                    <new-message></new-message>
                </div>
                <div class="chat-placeholder">
                    <img src="./static/chat-placeholder.svg" alt="chat-placeholder">
                    <h2>Hi there! \n Select a chat to start messaging.</h2>
                    <p>This app is one of the projects that developed under name 
                    <a href="https://github.com/behnamazimi/simple-web-projects" target="_blank">
                    <strong>practical front-end projects</strong></a> for educational purposes. 
                    This project developed with <strong>Web Components</strong> without any third-party libs.</p>
                </div>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatBox.attrTypes,
            template: ChatBox.template
        });

        this._chatList = this.shadowRoot.getElementById("chat-list");
        this._newMessageBox = this.shadowRoot.querySelector("new-message");
        this._scrollToBottomBtn = this.shadowRoot.getElementById("scroll-to-bottom");
        this._activeChatElm = this.shadowRoot.querySelector("active-chat");
        this._typingIndicator = this.shadowRoot.getElementById("typing-indicator");
    }

    // Call on mounting
    onMount() {
        this.initListeners();
    }

    // Call on un-mounting
    onUnmount() {
        this.removeListeners();
    }

    // Call on attributes changed
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        if (attrName === "readonly")
            this.checkNewMessageBoxVisibility();
    }

    /**
     * Reflect the readOnly attr on HTML tag
     * @param value
     */
    set readOnly(value) {
        if (value) {
            this.setAttribute('readonly', '');

        } else {
            this.removeAttribute('readonly');
        }
    }

    get readOnly() {
        return this.hasAttribute('readonly');
    }

    /**
     * Use this to set active chat of ChatBox
     * @param chat
     */
    setActiveChat(chat) {
        // If chat is not valid do nothing
        if (!chat || !chat.id)
            return;

        this._activeChat = chat;

        // Make chatBox visibility visible anyway
        // Clear the chats list
        // And clear the lastMessage flag
        this.hidden = false;
        this._chatList.innerHTML = '';
        this.lastMessage = null;

        // Render the chatBox header with activeChat
        this.renderChatBoxHeader();
    }

    /**
     * Active chat getter
     * @returns {*|{id}}
     */
    get activeChat() {
        return this._activeChat;
    }

    /**
     * Reflect the hidden attr on HTML tag
     * @param value
     */
    set hidden(value) {
        if (value) {
            this.setAttribute("hidden", '');
        } else {
            this.removeAttribute("hidden");
        }
    }

    get hidden() {
        return this.hasAttribute("hidden")
    }

    /**
     * Initialize required listeners
     */
    initListeners() {
        // Listen for user sign-in
        this.on(APP_EVENTS.USER_SIGN_IN, this._userSignIn.bind(this));
        // Listen for new messages that send from authed user
        this._newMessageBox.on(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, this._onAuthedMessageReceive.bind(this));

        // Control the visibility and the behavior of scrollToBottom button in chats list
        this._chatList.addEventListener("scroll", this.checkScrollToBottomBtnVisibility.bind(this));
        this._scrollToBottomBtn.addEventListener("click", this.scrollToEnd.bind(this));

        this._activeChatElm.on(APP_EVENTS.CHAT_BOX_BACK_CLICKED, this._onBackBtnClicked.bind(this));
        
        // Listen for typing indicator
        this.on(APP_EVENTS.USER_TYPING, this._showTypingIndicator.bind(this));
        this.on(APP_EVENTS.USER_STOP_TYPING, this._hideTypingIndicator.bind(this));
    }

    /**
     * Remove added listeners
     */
    removeListeners() {
        this._newMessageBox.off(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, this._onAuthedMessageReceive.bind(this));
        this.off(APP_EVENTS.USER_SIGN_IN, this._userSignIn.bind(this));
        this._scrollToBottomBtn.removeEventListener("click", this.scrollToEnd.bind(this));
        this._chatList.removeEventListener("scroll", this.checkScrollToBottomBtnVisibility.bind(this));
        this.off(APP_EVENTS.USER_TYPING, this._showTypingIndicator.bind(this));
        this.off(APP_EVENTS.USER_STOP_TYPING, this._hideTypingIndicator.bind(this));
    }

    /**
     * Render message object and add to chats-box
     * @param sender
     * @param text
     * @param audio
     * @param time
     * @param forceScrollToEnd
     */
    renderMessage({sender, text, audio, time}, forceScrollToEnd = false) {
        // If the message is invalid do nothing
        if (!sender || (!text && !audio) || !time || !(time instanceof Date))
            return;

        const isFromAuthedUser = sender === this._authedUserId;
        const isSameSender = this.lastMessage && this.lastMessage.sender === sender;

        // Get time string to show in message bubble
        const timeToShow = `${time.getHours()}:${time.getMinutes()}`;

        // Create component element and set attributes
        const msg = document.createElement("chat-message");

        if (text)
            msg.text = text;

        if (audio)
            msg.audio = audio;

        msg.setAttribute("position", isFromAuthedUser ? "right" : "left");
        msg.setAttribute("sender", sender);
        msg.setTimeObject(time);
        msg.setAttribute("time", timeToShow);
        msg.setAttribute("title", time.toLocaleString());
        msg.isLastInGroup = true;

        // Check if the message is the last one that sender has been sent
        // It's just for styling bubbles
        if (this.lastMessage && isSameSender)
            this.lastMessage.isLastInGroup = false;

        // Render the day date and add to chat-box if needs
        if (!this.lastMessage || this._isMessageForDifferentDay(time)) {
            this._appendDateToChatList(time);
        }

        // Check if the user not scrolled top
        // And the last message in chatBox is observable
        const isLastMessageInView = this._chatList.scrollTop >= this._chatList.scrollHeight - this._chatList.clientHeight;

        // Set lastMessage flat and append createdElement to chatList
        this.lastMessage = msg;
        this._chatList.appendChild(msg);

        // Clear the newMessage input box if the sender is the authedUser
        if (isFromAuthedUser)
            this._newMessageBox.clear();

        if (isLastMessageInView || forceScrollToEnd)
            this.scrollToEnd();

        // Check the viability of scrollToBottom button
        this.checkScrollToBottomBtnVisibility();
    }

    /**
     * Fire when a user signed in and set the this._authedUserId
     * @param detail
     * @private
     */
    _userSignIn({detail}) {
        this._authedUserId = detail.id;
    }

    /**
     * Fires when back btn clicked in active-chat component
     * @private
     */
    _onBackBtnClicked() {
        this.hidden = true;

        // Send action to parent
        this.emit(APP_EVENTS.CHAT_BOX_BACK_CLICKED)
    }

    /**
     * Fire when a signed user send a message
     * This will render the message and emit it to parent
     * @param detail
     * @private
     */
    _onAuthedMessageReceive({detail}) {
        if (!this.activeChat)
            return;

        detail.toChat = this.activeChat.id;
        detail.sender = this._authedUserId;
        this.renderMessage(detail, true);
        this.emit(APP_EVENTS.AUTHED_USER_NEW_MESSAGE, detail);
    }

    /**
     * Compare the time of the last received message with this._lastMessage flag
     * @param time
     * @returns {boolean}
     * @private
     */
    _isMessageForDifferentDay(time) {
        if (!this.lastMessage || !time)
            return false;

        return time.toDateString() !== this.lastMessage.timeObject.toDateString();
    }

    /**
     * This generate the day title and a chat-day element put the time on element
     * and append it to chat-list
     * @param time
     * @private
     */
    _appendDateToChatList(time) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.assert(time, "Message time not passed");

        let dayTitle = `${monthNames[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;
        if (time.toDateString() === new Date().toDateString())
            dayTitle = "Today";

        const dateNode = document.createElement("div");
        dateNode.classList.add("chat-day");
        dateNode.innerHTML = `<span>${dayTitle}</span>`;

        this._chatList.appendChild(dateNode);
    }

    /**
     * Check the scroll height and scrollTop of chat-list
     * and toggle the visibility of the scrollToBottom button
     * @param e
     */
    checkScrollToBottomBtnVisibility(e) {
        if (this._chatList.scrollTop + 200 < this._chatList.scrollHeight - this._chatList.clientHeight) {
            this._scrollToBottomBtn.classList.add("show")
        } else {
            this._scrollToBottomBtn.classList.remove("show");
        }
    }

    /**
     * Scroll the chat list to the end
     */
    scrollToEnd() {
        this._chatList.scrollTo({
            top: this._chatList.scrollHeight,
        })
    }

    /**
     * Render the activeChat component of the chatBox using this._activeChat
     */
    renderChatBoxHeader() {
        const activeChatNode = this.shadowRoot.querySelector("active-chat");
        this.assert(activeChatNode, "The active-chat node not found in chat-box");

        activeChatNode.setAttribute("id", this._activeChat.id);
        activeChatNode.setAttribute("name", this._activeChat.name);
        activeChatNode.setAttribute("avatar", this._activeChat.avatar || "");
        if (this._activeChat.online)
            activeChatNode.setAttribute("online", '');
        else
            activeChatNode.removeAttribute("online");
    }

    /**
     * Check the new message box visibility
     */
    checkNewMessageBoxVisibility() {

        // Remove newMessageBox component if
        // the chatBox is readOnly for logged in user
        if (this.readOnly) {
            this._newMessageBox.remove();
        }

    }
    
    /**
     * Show typing indicator
     */
    _showTypingIndicator() {
        this._typingIndicator.classList.add("show");
    }

    /**
     * Hide typing indicator
     */
    _hideTypingIndicator() {
        this._typingIndicator.classList.remove("show");
    }

}

// Define chat-box tag name
customElements.define(ChatBox.tagName, ChatBox);
