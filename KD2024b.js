/**
 * @description Test framework
 */




/**
 * @description Global object for the framework
 */
let KD = {

    idCounter: 0,
    createId: function () {
        return "kd" + KD.idCounter++;
    }
}


/**
 * @description Master class of all objects. The constructor method initializes the object with the given parameters and assigns a unique ID to the object.
The setDefaultParam method sets a default value for a parameter if it is undefined in the object.
 */
class KDObject {

    processParams(params) {
        if (params !== undefined) {
            for (let param in params) {
                this[param] = params[param];
            }
        }
        return this;
    }

    constructor(params) {
        this.processParams(params);
        this.id = KD.createId();
    }

    /**
     * Set default value for a parameter if it is undefined.
     *
     * @param {any} param - the parameter to set a default value for
     * @param {any} defaultValue - the default value to set if the parameter is undefined
     * @return {void} 
     */
    setDefaultParam(param, defaultValue) {
        if (this[param] === undefined) {
            this[param] = defaultValue

        }
    }
}


/**
 * @description Master class of all visual components. The constructor method initializes the object with the given parameters and assigns a unique ID to the object.
 * constructor(params): Initializes a new instance of the KDComponent class, calling the constructor of the parent class KDObject and passing the params.
 */

class KDComponent extends KDObject {
    /**
     * Constructor for creating a new instance.
     *
     * @param {params} params - The parameters for the constructor
     */
    constructor(params) {
        super(params);
    }
}

class KDVisualComponent extends KDComponent {
    /**
     * Constructor for initializing the object with default parameters.
     *
     * @param {params} params - the parameters for object initialization
     */
    constructor(params) {
        super(params);

        setDefaultParam("htmlElement", "div");
        setDefaultParam("isBuilt", false);
        setDefaultParam("domElement", null);
        setDefaultParam("htmlType", null);
        setDefaultParam("cssText", null);
        setDefaultParam("events", []);
    }

    /**
     * The build function creates a new dom element, sets a self reference, 
     * sets isBuilt to true, assigns html type if it exists, and assigns css text.
     *
     * @return {Object} The current object after building.
     */
    build() {

        //Create dom element
        this.domElement = document.createElement(this.htmlElement);

        //Set self reference
        this.domElement.kd = this;

        //set isBuilt to true
        this.isBuilt = true;

        //Assign html type if exists
        if (this.htmlType !== undefined) {
            this.domElement.setAttribute("type", this.htmlType);
        }

        //Assign css text
        if (this.cssText !== null) {
            this.domElement.style.cssText = this.cssText;
        }

        return this;
    }

    show(surface) {

        if (!this.isBuilt) {
            this.build();
        }

        if (surface === undefined) {
            surface = document.body;
        }

        surface.appendChild(this.domElement);
        return this;
    }


}


function KDInputButton(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "button";
    return obj;
}