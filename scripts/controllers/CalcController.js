class CalcController {
    constructor () {

        this._audio = new Audio("click.mp3")
        this._togglePlayAudio = false
        this._operation = []
        this._locale = "pt-BR"
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        
        this.initialize()
        this.initButtonsEvents()
        this.initKeyboard()

    }

    initialize () {
        this.displayCalc = "0"

        this.setDisplayDateTime()

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)


        document.querySelectorAll(".btn-ac").forEach( btn => {
            btn.ondblclick = e => this.togglePlayAudio()
        })
    }


    togglePlayAudio() {

        this._togglePlayAudio = !this._togglePlayAudio

    }

    playAudio () {

        if(this._togglePlayAudio) {
            this._audio.currentTime = 0
            this._audio.play()
        }

    }

    copyToClipboard () {

        const inputCopy = document.createElement("input")

        inputCopy.value = this.displayCalc

        document.body.appendChild(inputCopy)

        inputCopy.select()

        document.execCommand("copy")

        inputCopy.remove()

    }

    pasteFromClipboard () {

        document.onpaste = e => {
            let text = e.clipboardData.getData('Text')
        
            this.displayCalc = parseFloat(text)
        }

    }

    initKeyboard () {
        document.onkeyup = e => {

            
            switch(e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                    this.playAudio()
                    this.addOperation(parseInt(e.key))
                    break;
    
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                case '.':
                this.playAudio()
                    this.addOperation(e.key)
                    break;

                case '=':
                case 'Enter':
                this.playAudio()
                    this.calc('=')
                    break;

                case 'c':
                    if(e.ctrlKey) {    
                        this.playAudio()
                        this.copyToClipboard()
                    }
                    break;
                case 'v':
                    if(e.ctrlKey) {    
                        this.playAudio()
                        this.pasteFromClipboard()
                    }
                    break;

                case 'Backspace':
                    this.playAudio()
                    this.clearEntry()
                    break;
                case 'Escape':
                    this.playAudio()
                    this.clearAll()
                    break;
            }

        }
    }

    initButtonsEvents () {

        const buttons = document.querySelectorAll("#buttons > g, #parts > g")

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, "click drag", e => {
                this.btnExec(btn.className.baseVal.replace("btn-", ""))
            })
        })

    }

    btnExec (value) {

        this.playAudio()

        switch (value) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                this.addOperation(parseInt(value))
                break;

            case 'soma':
                this.addOperation('+')
                break;
            case 'subtracao':
                this.addOperation('-')
                break;
            case 'divisao':
                this.addOperation('/')
                break;
            case 'multiplicacao':
                this.addOperation('*')
                break;
            case 'porcento':
                this.addOperation('%')
                break;
            case 'ponto':
                this.addOperation(".")
                break;
            case 'igual':
                this.calc("=")
                break;
            case 'ce':
                this.clearEntry()
                break;
            case 'ac':
                this.clearAll()
                break;
            
            default:
                this.setError()
                break;
        }
    }
    
    addOperation (value) {
        if(isNaN(value)) {
            if(isNaN(this.getLastOperation()) && value !== ".")
                this.setLastOperation(value)
            else if (value === ".")
                this.addDot()
            else 
                this.calc(value)
        } else {
            if(this._operation.length > 0) {
                if(isNaN(this.getLastOperation())) {
                    this.calc(value)
                } else {
                    this.setLastOperation(value)
                }
            } else {
                this.calc(value)
            }
        }
        
        console.log(this._operation)
    }

    addDot () {

        if(this.getLastOperation() && this.getLastOperation().toString().indexOf('.') > -1) return

        if(isNaN(this.getLastOperation()) || !this.getLastOperation()) {
            this._operation.push("0.")
        } else {
            console.log(this.getLastOperation() + ".")
            this.setLastOperation(this.getLastOperation().toString() + ".")
        }

        this.setLastNumberToDisplay()
    }

    calc (value) {
        let result;

        if(value == "=" && this._lastNumber && this._operation.length < 3) {
            if(this._operation.length == 2) this._operation.pop()
            
            result = eval(this.getLastOperation().toString() + this._lastOperator + this._lastNumber)
            this._operation = [result]
        } else {
            if(value == "%") {
                result = eval(this._operation.join(""))
                result /= 100
    
                this._operation = [result]
            } else if(this._operation.length > 2) {
                this._lastNumber = this.getLastOperation()
                this._lastOperator = this._operation[1]
                
                result = eval(this._operation.join("")) 
                this._operation = [result]
            }    

            if(value != "=")
                this._operation.push(value)
        }

        this.setLastNumberToDisplay()
    }

    setLastNumberToDisplay () {
        let last;

        if(this._operation.length < 1) {
            return this.displayCalc = "0"
        }

        for(let i = this._operation.length; i > 0; i--) {
            if(!isNaN(this._operation[i-1])) {
                last = this._operation[i-1]
                break;
            }
        }

        this.displayCalc = last
    }

    setLastOperation (value) {
        
        if(typeof value == "string" || isNaN(value))
            return this._operation[this._operation.length-1] = value
        
        this._operation[this._operation.length-1] = this.getLastOperation().toString() + value.toString()
        this.setLastNumberToDisplay()
        
    }

    getLastOperation () {
        return this._operation[this._operation.length-1]
    }

    clearEntry () {
        if(this.displayCalc !== "0") {
            this._operation.pop()
            this.setLastNumberToDisplay()
        }
    }

    clearAll () {
        this._operation = []
        this._lastNumber = ""
        this._lastOperator = ""

        this.setLastNumberToDisplay()
    }

    setError () {
        return this.displayCalc = 'Error'
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

        if(value.toString().length > 10) return this.setError()

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