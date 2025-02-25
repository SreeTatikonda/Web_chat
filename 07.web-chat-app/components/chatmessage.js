class ChatMessage extends Component {

    /**
     * Define attribute types
     * @returns {Object}
     */
    static get attrTypes() {
        return {
            sender: {
                type: "string",
                observe: true
            },
            position: {
                type: "string",
                observe: true
            },
            lastingroup: {
                type: "boolean",
                observe: true
            },
            text: {
                type: "string",
                observe: true
            },
            audio: {
                type: "string",
                observe: true
            },
            time: {
                type: "string",
                observe: true
            },
        };
    }

    /**
     * Generate observed attributes array from attr types object
     */
    static get observedAttributes() {
        return super.getObservedAttrs(ChatMessage.attrTypes);
    }

    /**
     * Generate tag-name from component class name
     * @returns {string}
     */
    static get tagName() {
        return super.generateTagName(ChatMessage.name);
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
                    --primaryColor:  #3AD07A;
                    --hoverColor: #edfbf3;
                    --fontColor: #333;
                    --secondaryFontColor: #777;
                    position: relative;
                    display: block;
                    background: #fff;
                    border-radius: 8px;
                    margin: 0 0 0.3em 0; 
                    padding: 0.5em 0.5em 1em;
                    font-family: 'Roboto', sans-serif;
                    color: var(--fontColor);
                }
                :host([hidden]) {
                    display: none;
                }
                * {
                    box-sizing: border-box;
                    user-select: none;                        
                }
                :host([position=left]),
                :host([position=right]) {
                    max-width: 50%;
                    margin-right: 0.5rem;
                    margin-left: auto;
                    width: auto;
                    min-width: 180px;
                    background-color: var(--primaryColor);
                    color: #fff;
                    box-shadow: -1px 1px 3px 0 rgba(0, 0, 0, 0.14);
                }
                @media screen and (max-width: 768px) {
                    :host([position=left]),
                    :host([position=right]) {
                        min-width: 80%;
                    }
                }
                :host([position=left]) {
                    margin-left: 0.5rem;
                    margin-right: auto;
                    background-color: #fff;
                    color: #444;
                    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.14);
                }
                :host([position=left]) .audio-control #audio-play {
                    border: 1px solid #3ad07a;
                    color: #3ad07a;
                }
                :host([lastingroup]) {
                    margin-bottom: 1em;
                }
                :host([position=left][lastingroup]):before,
                :host([position=right][lastingroup]):before {
                    content: '';
                    display: block;
                    width: 0.25rem;
                    height: 0.5rem;
                    position: absolute;
                    left: calc(100% - 0.4em);
                    bottom: 0;
                    border-bottom: 0.5rem solid var(--primaryColor);
                    border-right: 0.5rem solid transparent;
                }
                :host([position=left][lastingroup]):before {
                    border-bottom: 0.5rem solid #fff;
                    border-left: 0.5rem solid transparent;
                    border-right: none;
                    left: -0.4em;
                }
                #text {
                    font-size: 16px;
                    line-height: 20px;
                    margin: 0 0 0.2em;          
                    white-space: pre-line;          
                }
                #time {
                    font-size: 12px;
                    opacity: 0.7;
                    position: absolute;
                    right: 0.5em;
                    bottom: 0.3em;
                }
                .audio-control {
                    display: none;
                    align-items: center;
                }
                .audio-control button {
                    margin-right: 0.5rem;
                }
                .audio-control #audio-play {
                    background-color: transparent;
                    border-radius: 50%;
                    border: 1px solid #fff;
                    color: #fff;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    outline: none;
                    cursor: pointer;
                }
                .audio-control #audio-play svg {
                    margin-left: 2px;
                }
                .audio-control #audio-play .pause-icon {
                    display: none;
                }
                .audio-control #audio-play.playing .play-icon {
                    display: none;
                }
                .audio-control #audio-play.playing .pause-icon {
                    display: inline-block;
                    margin-left: 0;
                }
                .audio-control #audio-duration {
                    font-size: 14px;
                    opacity: 0.8;
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
                ${ChatMessage.style}
                <p id="text"></p>
                <div class="audio-control">
                    <button id="audio-play">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="play-icon">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="pause-icon">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                    </button>
                    <span id="audio-duration">00:00</span>
                </div>
                <span id="time"></span>
            </template>
            `)
    }

    constructor() {
        super({
            attrTypes: ChatMessage.attrTypes,
            template: ChatMessage.template
        });

        this._textElement = this.shadowRoot.getElementById("text");
        this._timeElement = this.shadowRoot.getElementById("time");

        this._audioMessageCtrl = this.shadowRoot.querySelector(".audio-control");
        this._audioPlayBtn = this.shadowRoot.getElementById("audio-play");
        this._audioDurationElm = this.shadowRoot.getElementById("audio-duration");

    }

    onMount() {
        this._audioPlayBtn.addEventListener("click", this._onAudioPlayBtnClick.bind(this))
    }

    onUnmount() {
        this._audioPlayBtn.removeEventListener("click", this._onAudioPlayBtnClick.bind(this))
    }

    // Call on attributes changed
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        // Re-render component
        this.render();
    }

    /**
     * Reflect the text attr on HTML tag
     * @param value
     */
    set text(value) {
        if (value) {
            this.setAttribute('text', value);
        } else {
            this.removeAttribute('text');
        }
    }

    get text() {
        return this.getAttribute('text');
    }

    /**
     * Reflect the audio attr on HTML tag
     * @param audioObj
     */
    set audio(audioObj) {
        if (audioObj) {

            // Set received object as _audio and do some process on it and
            // Add some listeners to control the play status or timing
            this._audio = audioObj;
            const {audio, duration, audioUrl} = audioObj;
            this._audioElement = audio || new Audio(audioUrl);

            this._audioDurationElm.innerText = duration;

            const onPause = () => {
                // Handle icon changing for btn
                this._audioPlayBtn.classList.remove("playing");
            };

            const onEnded = () => {
                // Reset the duration text and handle icon changing for btn
                this._audioDurationElm.innerText = duration;
                this._audioPlayBtn.classList.remove("playing");
            };

            const onTimeUpdate = () => {
                // Calc duration and update the text when audio is playing
                const passedTime = Recorder.secToTimeStr(this._audioElement.currentTime);
                this._audioDurationElm.innerText = `${passedTime} / ${duration}`;
            };

            const onPlay = () => {
                this._audioPlayBtn.classList.add("playing");
            };
            this._audioElement.onended = onEnded;
            this._audioElement.onpause = onPause;
            this._audioElement.onplay = onPlay;
            this._audioElement.ontimeupdate = onTimeUpdate;

        } else {
            // Set the _audio as null to remove it from component
            this._audio = null;
        }
    }

    get audio() {
        return this._audio;
    }

    setTimeObject(value) {
        this._timeObject = value;
    }

    get timeObject() {
        return this._timeObject;
    }

    /**
     * Reflect the time attr on HTML tag
     * @param value
     */
    set time(value) {
        if (value) {
            this.setAttribute('time', value);
        } else {
            this.removeAttribute('time');
        }
    }

    get time() {
        return this.getAttribute('time');
    }

    /**
     * Reflect the sender attr on HTML tag
     * @param value
     */
    set sender(value) {
        if (value) {
            this.setAttribute('sender', value);
        } else {
            this.removeAttribute('sender');
        }
    }

    get sender() {
        return this.getAttribute('sender');
    }

    /**
     * Reflect the islastingroup attr on HTML tag
     * @param value
     */
    set isLastInGroup(value) {
        if (value) {
            this.setAttribute('lastingroup', '');
        } else {
            this.removeAttribute('lastingroup');
        }
    }

    get isLastInGroup() {
        return this.hasAttribute('lastingroup');
    }

    /**
     * Fire when audio message play btn clicked and toggle the playing status
     * @private
     */
    _onAudioPlayBtnClick() {
        if (!this._audioElement)
            return;

        if (this._audioElement.paused) {
            this._audioElement.play();
        } else {
            this._audioElement.pause();
        }
    }

    /**
     * Render message by attributes
     */
    render() {
        this._textElement.innerHTML = this.text;
        this._timeElement.innerHTML = this.time;
        this._audioMessageCtrl.style.display = this.audio ? "flex" : "none";
    }

}

// Define chat-message tag name
customElements.define(ChatMessage.tagName, ChatMessage);
