class ChatListItem extends Component {

    /**
     * Define attribute types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            id: {
                type: "string",
                required: true,
            },
            name: {
                type: "string",
                required: true,
                observe: true
            },
            desc: {
                type: "string",
                observe: true
            },
            avatar: {
                type: "string",
                observe: true
            },
            lastseen: {
                type: "string",
                observe: true
            },
            unreadcount: {
                type: "number",
                observe: true
            },
            online: {
                type: "boolean",
                observe: true
            },
        };
    }

    /**
     * Generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ChatListItem.attrTypes);
    }

    /**
     * Generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatListItem.name);
    }

    /**
     * Styles of component
     * @returns {string}
     */
    static get style() {
        return (`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

                :host {
                    --primaryColor: #3AD07A;
                    --hoverColor: #edfbf3;
                    --fontColor: #333;
                    --secondaryFontColor: #777;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 0.75em 0.5rem;
                    position: relative;
                    cursor: pointer;
                    font-family: 'Roboto', sans-serif;
                    color: var(--fontColor);
                    border-bottom: 1px solid #ececec;
                }
                :host([hidden]) {
                    display: none;
                }
                * {
                    box-sizing: border-box;
                    user-select: none;
                }
                :host(:hover) {
                    background: var(--hoverColor);
                }
                :host([selected]) {
                    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .avatar-container {
                    flex: 0 0 3em;
                    width: 3em;
                    height: 3em;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 1em;
                    background: #efefef;
                    font-weight: bold;
                    font-size: 1em;
                    position: relative;
                    border-radius: 50%;
                }
                .avatar-container img {
                    max-width: 100%;
                    border-radius: 50%;
                    position: relative;
                    z-index: 1;
                }
                .avatar-container .char-avatar {
                    position: absolute;
                    z-index: 0;
                }
                .online-badge {
                    position: absolute;
                    right: 4px;
                    bottom: 0;
                    width: 12px;
                    height: 12px;
                    background: var(--primaryColor);
                    display: inline-block;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    visibility: hidden;
                    opacity: 0;
                    z-index: 2;
                }
                :host([online]) .online-badge {
                    visibility: visible;
                    opacity: 1;
                }
                .item-details {
                    flex: 0 1 100%;
                    position: relative;
                }
                #name {
                    margin: 0 0 0.3em 0;
                    font-size: 1em;
                    font-weight: 500;
                }
                #desc {
                    margin: 0;
                    font-size: 0.8em;
                    color: var(--secondaryFontColor);
                    max-width: 80%;
                    overflow: hidden;
                    display: block;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .item-meta {
                    position: absolute;
                    right: 0;
                    top: 0;
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: center;
                    align-items: flex-end;
                }
                #lastseen {
                    font-size: 0.7em;
                    color: var(--secondaryFontColor);
                    margin-top: 0.65em;
                }
                #unreadcount {
                    background: var(--primaryColor);
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    text-align: center;
                    color: #fff;
                    font-size: 0.7em;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    visibility: hidden;
                    opacity: 0;
                    overflow: hidden;
                    text-overflow: clip;
                }
                :host([unread]) #unreadcount {
                    visibility: visible;
                    opacity: 1;
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
                ${ChatListItem.style}
                <div class="avatar-container">
                    <span class="online-badge"></span>
                    <img src="" id="avatar">
                    <span class="char-avatar"></span>
                </div>
                <div class="item-details">
                    <h3 id="name"></h3>
                    <p id="desc"></p>
                    <div class="item-meta">
                        <span id="lastseen"></span>
                        <span id="unreadcount"></span>
                    </div>
                </div>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatListItem.attrTypes,
            template: ChatListItem.template
        });

        // Render component
        this.render();
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

        // Re-render component
        this.render();
    }

    /**
     * Reflect the selected attr on HTML tag
     * @param value
     */
    set selected(value) {
        if (value) {
            this.setAttribute('selected', '');

        } else {
            this.removeAttribute('selected');
        }
    }

    get selected() {
        return this.hasAttribute('selected');
    }

    // Call on attributes changed
    incrementUnreadCount() {
        let count = 0;
        if (this.getAttribute("unreadcount"))
            count = parseInt(this.getAttribute("unreadcount"));

        this.setAttribute('unreadcount', count + 1);
    }

    /**
     * Call this when you want to reset the unread messages count
     */
    markAllAsRead() {
        this.setAttribute('unreadcount', '0');
    }

    /**
     * Reflect the unread attr on HTML tag
     * Unread counter badge only shows on items that have truly unread attr
     * @param value
     */
    set unread(value) {
        if (value)
            this.setAttribute('unread', '');
        else
            this.removeAttribute('unread');
    }

    get unread() {
        return this.hasAttribute('unread');
    }

    /**
     * Reflect the online attr on HTML tag
     * @param value
     */
    set online(value) {
        if (value)
            this.setAttribute('online', '');
        else
            this.removeAttribute('online');
    }

    get online() {
        return this.hasAttribute('online');
    }

    /**
     * Initialize required listeners
     */
    initListeners() {
        this.on("click", this._onClick)
    }

    /**
     * Remove added listeners
     */
    removeListeners() {
        this.off("click", this._onClick)
    }

    /**
     * This method fires when chat-list-item clicked
     * If the component is not disabled, it emits the
     * clicked item id to above component (chatList) and
     * sets the selected attr
     * @param e
     * @private
     */
    _onClick(e) {
        e.preventDefault();
        if (this.disabled) {
            return;
        }

        // Send selected chat-item id to parent component
        this.emit(APP_EVENTS.CHAT_CLICKED, {id: this.getAttribute("id")});
        this.selected = true;
        // Reset unread counter of this chat
        this.markAllAsRead();
    }

    /**
     * Render component according to template and attributes
     */
    render() {

        // Remove component if id not passed
        if (!("id" in this.attributes)) {
            this.remove()
        }

        // Check the existence of avatar
        // Fetch first char of name to show if avatar not passed
        if (!this.getAttribute("avatar")) {
            // Put first char of name when avatar not passed
            const name = (this.getAttribute("name") || "").toUpperCase();
            this.shadowRoot.querySelector(".char-avatar").innerText = name.substr(0, 1);
        }

        // Loop over attributes and set all
        for (let attr of this.attributes) {
            const target = this.shadowRoot.getElementById(attr.name);
            if (target)
                target.innerText = attr.value;

            switch (attr.name) {
                case "avatar":
                    target.src = attr.value;
                    break;

                case "unreadcount":
                    this.unread = parseInt(attr.value) > 0;
                    break;

            }

        }
    }

}

// Define chat-list-item tag name
customElements.define(ChatListItem.tagName, ChatListItem);
