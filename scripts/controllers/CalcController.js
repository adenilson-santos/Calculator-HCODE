class CalcController {
    constructor () {
        this._locale = "pt-BR"
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        
        this.initialize()
        this.initButtonsEvents()
    }

    initialize () {
        this._displayCalcEl.innerHTML = "0"

        this.setDisplayDateTime()

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)
    }

    initButtonsEvents () {

        const buttons = document.querySelectorAll("#buttons > g, #parts > g")

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, "click drag", e => {
                console.log(btn.className.baseVal.replace("btn-", ""))
            })
        })

    }

    addEventListenerAll (btn, events, fn) {
        events.split(" ").forEach(evt => {
            btn.style.cursor = "pointer"
            btn.addEventListener(evt, fn, false)
        })
    }

    setDisplayDateTime () {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayCalc () {
        return this._displayCalcEl.innerHTML
    }

    set displayCalc (value) {
        return this._displayCalcEl.innerHTML = value
    }

    get displayDate () {
        return this._dateEl.innerHTML
    }

    set displayDate (value) {
        return this._dateEl.innerHTML = value
    }

    get displayTime () {
        return this._timeEl.innerHTML
    }

    set displayTime (value) {
        return this._timeEl.innerHTML = value
    }

    get currentDate () {
        return new Date()
    }

} 