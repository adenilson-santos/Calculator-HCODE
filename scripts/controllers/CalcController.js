class CalcController {
    constructor () {
        this._operation = []
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
                this.btnExec(btn.className.baseVal.replace("btn-", ""))
            })
        })

    }

    btnExec (value) {
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
                this.pushOperation()
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
            this.pushOperation(value)
        } else {
            if(this._operation.length > 0) {
                if(isNaN(this.getLastOperation())) {
                    this.pushOperation(value)
                } else {
                    this.setLastOperation(value)
                }
            } else {
                this.pushOperation(value)
            }
        }
        
        console.log(this._operation)
    }

    pushOperation (value) {
        if(this._operation.length > 2) {
            let result = eval(this._operation.join(""))
            
            this._operation = [result]
        }

        this._operation.push(value)
        this.displayCalc = this.getLastNumberToDisplay()
    }

    getLastNumberToDisplay () {
        for(let i = this._operation.length; i > 0; i--) {
            if(!isNaN(this._operation[i-1])) {
                return this._operation[i-1]
            }
        }
    }

    setLastOperation (value) {
        this._operation[this._operation.length-1] = parseInt(this.getLastOperation().toString() + value.toString())
        this.displayCalc = this.getLastNumberToDisplay()
        
    }

    getLastOperation () {
        return this._operation[this._operation.length-1]
    }

    clearEntry () {
        if(this.displayCalc !== "0") {
            this._operation.pop()
            return this.displayCalc = "0"
        }
    }

    clearAll () {
        this.clearEntry()
        this._operation = []
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