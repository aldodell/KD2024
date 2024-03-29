

/**
 * 
 * 
 * @constant {Object} KD Useful framework KD object
 */
const KD = {
    version: "0.1.0",
    idCounter: 0,
    createId: function () {
        return "kd" + KD.idCounter++;
    },

    kernel: {
        applications: [],
        append: function (app) {
            obj.applications.push(app);
            return obj;
        },
        sendMessage: function (message) {
            for (let i = 0; i < this.applications.length; i++) {
                if (message.target == this.applications[i].name) {
                    return this.applications[i].processMesage(message);
                }
            }

        },
        exists: function (name) {
            for (let i = 0; i < this.applications.length; i++) {
                if (name == this.applications[i].name) {
                    return true;
                }
            }
            return false;
        }


    }
}



/*

Master class of all objects`s
*/
class KDObject {
    /**
     * A constructor for creating a new KDObject.
     *
     * @param {params} params - The parameters for creating the KDObject.
     * @return {KDObject} Clone of the given KD object.
     */
    constructor(params) {

        /**
         * ID Is a unique identifier used on the DOM and JS objects.
         * @type {String}
         */
        this.id = KD.createId();


        //Proccess the params
        if (params !== undefined) {
            for (let param in params) {
                this[param] = params[param];
            }
        }


        /**
         * 
         * @returns {KDObject} Clone of the given KD object.
         */
        this.clone = function () {
            let obj = new KDObject();
            for (let p in this) {
                if (p != "id") {
                    obj[p] = this[p];
                }
            }
            return obj;
        }



    }
}


/**
 * Base class of all components.
 */
class KDComponent extends KDObject {
    /**
     * Constructor for creating a new KDVisualComponent.
     *
     * @param {Object} params - The parameters for initializing the component.
     * @return {KDVisualComponent} The newly created KDVisualComponent.
     */
    constructor(params) {
        super(params);

        /**
         * @description The DOM element of the component
         * @type {HTMLElement}
         */
        this.domElement = null;

        /**
         * @description The HTML element's name of the component
         * @type {string}
         */
        this.htmlElement = "div";

        /**
         * @description The HTML element's type of the component
         * @type {string} 
         */
        this.htmlType = null;

        /**
         * @description The name of the field, which is used to store the value of the component
         * @type {String} 
         */
        this.field = null;

        /**
         * @description The CSS text of the component
         * @type {String} 
         */
        this.cssText = "";

        /**
         * @description The value of the component
         * @type {any}
         */
        this.value = null;

        /**
         * @description If the component is built this property will be true.   
         * @type {boolean} 
         */
        this.isBuilt = false;

        /**
         * @description The events array of the component
         * @type {Array}
         */
        this.events = [];


        //Subclassing the clone method
        this.KDObjectClone = this.clone;
        /**
         * Clones the current object.
         *
         * @return {KDComponent} The KDComponent cloned object.
         */
        this.clone = function () {
            let obj = this.KDObjectClone();

            if (this.isBuilt) {
                obj.domElement = this.domElement.cloneNode(true);
                obj.domElement.setAttribute("id", obj.id);
            }

            return obj;
        }

        /**
         * @description Set the value of the component
         * @param {*} value 
         */
        this.setValue = function (value) {
            this.value = value;
            if (this.isBuilt) {
                this.domElement.value = value;
            }

            return this;
        }

        /**
         * @description Get the value of the component
         * @returns {any} 
         */
        this.getValue = function () {
            if (this.isBuilt) { return this.domElement.value; } else { return this.value }
        }

        /**
         * @description Set the name of the field
         * @param {*} name 
         * @returns itself component
         */
        this.setField = (name) => {
            this.field = name;
            return this;
        }

        /**
         * @description Build the component
         * @returns {KDVisualComponent}
         */
        this.build = function () {
            //Create element
            this.domElement = document.createElement(this.htmlElement);

            //Set isBuilt to true   
            this.isBuilt = true;

            //Assign html type if exists
            if (this.htmlType != null) {
                this.domElement.setAttribute("type", this.htmlType);
            }

            //Udpate ID
            this.domElement.setAttribute("id", this.id);

            //Assigne events if exists
            for (let e in this.events) {
                this.domElement.addEventListener(e, this.events[e]);
            }

            this.domElement.kd = this;
            return this;
        }

        /**
         * Adds an event and its associated action to the events object. If the widget is already built,
         * it also adds the event listener to the DOM element.
         *
         * @param {string} event - The name of the event.
         * @param {function} action - The action to be associated with the event.
         * @return {KDComponent} - The current object instance.
         */
        this.addEvent = function (event, action) {
            this.events[event] = action;
            if (this.isBuilt) {
                for (let e in this.events) {
                    this.domElement.addEventListener(e, this.events[e]);
                }
            }
            return this;
        }

        /**
         * Set the ID of the element and update the DOM if the element is already built.
         *
         * @param {type} id - The new ID to set
         * @return {KDComponent} this - The instance for method chaining
         */
        this.setId = function (id) {
            this.id = id;
            if (this.isBuilt) {
                this.domElement.setAttribute("id", this.id);
            }
            return this;
        }
    }
}

/**
 * Base class of all visual components.
 */
class KDVisualComponent extends KDComponent {
    /**
     * Constructor for initializing the visual component with default width and height.
     *
     * @param {Object} params - parameters for initialization
     */
    constructor(params) {
        super(params);

        /**
         * @description The width of the component
         * @type {int}
         */
        this.width = 300;

        /** 
         *  @description The height of the component
         * @type {int}
         */
        this.height = 200;


        /**
         * Append a style property and value to the cssText, and update the domElement style if the object is already built.
         *
         * @param {string} property - The CSS property to be added.
         * @param {string} value - The value of the CSS property.
         * @return {object} - The object itself for chaining.
         */
        this.appendStyle = function (property, value) {

            if (this.cssText === null) {
                this.cssText = "";
            }

            this.cssText += property + ":" + value + ";";

            if (this.isBuilt) {
                this.domElement.style.cssText = this.cssText;
            }

            return this;
        }

        /**
         * Appends the given CSS text to the existing CSS text of the element and updates the element's style if it's built.
         *
         * @param {string} cssText - The CSS text to append
         * @return {Object} - The updated object
         */
        this.appendCssText = function (cssText) {

            if (this.cssText === null) {
                this.cssText = "";
            }

            this.cssText += cssText + ";";

            if (this.isBuilt) {
                this.domElement.style.cssText = this.cssText;
            }

            return this;
        }


        this.KDComponentBuild = this.build;

        /**
         * Builds the component and sets its width, height, cssText, and value.
         *
         * @return {KDVisualComponent} The built component
         */
        this.build = function () {
            this.KDComponentBuild();

            if (!isNaN(this.width)) this.width = this.width + "px";
            if (!isNaN(this.height)) this.height = this.height + "px";

            this.domElement.style.width = this.width;
            this.domElement.style.height = this.height;

            if (this.cssText !== null) {
                this.domElement.style.cssText = this.cssText;
            }

            if (this.value !== undefined) {
                this.setValue(this.value);
            }
            return this;
        }



        /**
         * publish the component on the surface.
         *
         * @param {Object} component - the component to be publishn
         * @return {KDVisualComponent} - the modified object
         */
        this.publish = function (component) {

            if (!this.isBuilt) {
                this.build();
            }
            let surface = null;
            if (component === undefined) {
                surface = document.body;
            } else if (typeof component === "KDVisualComponent") {
                surface = component.domElement;
            }

            surface.appendChild(this.domElement);
            return this;
        }

        /**
         * Bring the element to the front if it is built.
         *
         * @return {Object} The current object
         */
        this.bringToFront = function () {
            if (this.isBuilt) {
                this.domElement.style.zIndex++;
            }
            return this;
        }

        /**
         * Pushes the element to the back by decreasing its z-index if it's built.
         *
         * @return {Object} The current object for method chaining.
         */
        this.pushToBack = function () {
            if (this.isBuilt) {
                let z = this.domElement.style.zIndex;
                if (z > 0) {
                    this.domElement.style.zIndex--;
                }

            }
            return this;
        }


        /**
         * Make the component draggable.
         * @param {*} pointer Component that will receive the drag action from mouse.
         * @param {*} movable  Component that will be moved
         */
        this.makeDraggable = function (pointer, movable) {

            if (movable === undefined) {
                movable = pointer;
            }

            pointer.domElement.onmousedown = function (event) {
                let rect = pointer.domElement.getBoundingClientRect();
                movable.dragX = event.clientX - rect.x;
                movable.dragY = event.clientY - rect.y;
                pointer.domElement.style.cursor = "grab";


                movable.domElement.onmousemove = function (event) {
                    movable.domElement.style.transform = null;
                    movable.domElement.style.left = event.clientX - movable.dragX + "px";
                    movable.domElement.style.top = event.clientY - movable.dragY + "px";
                }

                movable.domElement.onmouseup = function () {
                    movable.domElement.onmousemove = null;
                    movable.domElement.onmouseup = null;
                    pointer.domElement.style.cursor = "auto";

                };

            };
        }


        /**
         * Sets the size of the element.
         *
         * @param {number|string} width - The width of the element in pixels or as a string with units.
         * @param {number|string} height - The height of the element in pixels or as a string with units.
         * @return {KDVisualComponent} - Returns the current object for method chaining.
         */
        this.setSize = function (width, height) {


            if (width != null) {
                if (typeof width === "number") {
                    width = width + "px";
                }
                this.width = width;

                if (this.isBuilt) {
                    this.domElement.style.width = width;
                }

            }

            if (height != null) {
                if (typeof height === "number") {
                    height = height + "px";
                }
                this.height = height;
                if (this.isBuilt) {
                    this.domElement.style.height = height;
                }
            }


            return this;
        }

        /**
         * Centers the element on the surface.
         *
         * @return {KDVisualComponent} The current object for chaining.
         */
        this.center = function () {

            this.appendCssText("position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);");

            return this;
        }

        /**
         * Sets the visibility of the element based on the input.
         *
         * @param {boolean} yesOrNo - true to make the element visible, false to hide it
         * @return {object} this - the object itself for chaining
         */
        this.setVisible = function (yesOrNo) {
            if (this.isBuilt) {
                if (yesOrNo) {
                    this.domElement.style.visibility = "visible";
                } else {
                    this.domElement.style.visibility = "hidden";
                }
            }
            return this;
        }

    }
}

/**
 * Base class of all visual components whose contains other components.
 */
class KDVisualComponentContainer extends KDVisualComponent {
    /**
     * Constructor method for creating a new instance of the class.
     *
     * @param {params} params - The parameters for the constructor
     * @return {KDVisualComponentContainer} The newly created instance
     */
    constructor(params) {
        super(params);

        /** 
         * @description Components collection
         * */
        this.components = [];

        /**
         * @description The CSS text for the children of the component
         * @type {string} 
         */
        this.cssTextForChildren = ";";

        /**
         * JSON data
         */
        this.data = null;


        /**
         * 
         * @description Appends the components
         * @param {KDVisualComponent}  
         * */
        this.append = function (components) {
            for (let i = 0; i < arguments.length; i++) {
                let comp = arguments[i];

                if (this.isBuilt) {
                    if (!comp.isBuilt) comp.build();
                    this.domElement.appendChild(comp.domElement);
                }
                this.components.push(comp);
            }
            return this;
        }


        /**
         * This code defines a method setData that takes a JSON object as input and sets the values of components based on the fields in the JSON object. If a field in the JSON object matches a field in a component, the value of that component is updated. Finally, it returns the object itself.
         * @param {*} json 
         * 
         */
        this.setData = function (json) {

            this.data = json;

            //If this component has a field, set the value of the component based on the field in the JSON object
            if (this.field != null) {
                if (json[this.field] != undefined) {
                    this.setValue(json[this.field]);
                }
            }

            //If this component has nested components, set the value of the component based on the field in the JSON object
            for (let i = 0; i < this.components.length; i++) {
                let comp = this.components[i];

                if (comp instanceof KDVisualComponentContainer) {
                    comp.setData(json[comp.field])
                } else {
                    comp.setValue(json[comp.field]);
                }

                return this;
            }
            return this
        }


        //Save build method from parent
        this.KDVisualComponentBuild = this.build;

        this.build = function () {
            this.KDVisualComponentBuild();
            for (let i = 0; i < this.components.length; i++) {
                let comp = this.components[i];
                comp.cssText += this.cssTextForChildren;
                if (comp.domElement === null || !comp.isBuilt) {
                    comp.build();

                    if (this.data != null) {
                        this.setData(this.data);
                    }
                }

                this.domElement.appendChild(comp.domElement);
            }
            return this;
        }

        this.clear = function () {
            if (this.isBuilt) {
                while (this.domElement.firstChild) {
                    this.domElement.removeChild(this.domElement.firstChild);
                }
            }
            this.components = [];
            return this;
        }


        this.KDVisualComponentClone = this.clone;
        this.clone = function () {
            let obj = this.KDVisualComponentClone();
            obj.components = [];
            for (let i = 0; i < this.components.length; i++) {
                let comp = this.components[i];
                obj.components.push(comp.clone());
            }
            return obj;
        }


        /**
         * This code snippet defines a method appendChildrenStyle that adds a CSS property and value to the cssTextForChildren property. It then iterates through the components array, adding the cssTextForChildren to each component's cssText property and updating the DOM element's style if the component is already built. Finally, it returns the current object.
         * @param {*} property 
         * @param {*} value  
         */
        this.appendChildrenStyle = function (property, value) {

            if (this.cssTextForChildren === null) {
                this.cssTextForChildren = "";
            }

            this.cssTextForChildren += property + ":" + value + ";";

            for (let i = 0; i < this.components.length; i++) {

                let comp = this.components[i];
                comp.cssText += this.cssTextForChildren;
                if (comp.isBuilt == true) {
                    comp.domElement.style.cssText = comp.cssText;
                    comp.cssText = comp.domElement.style.cssText;
                }
            }

            return this;
        }


        /**
         * Executes the provided callback function once for each component in the array.
         *
         * @param {function} callback - The function to execute for each component
         * @return {object} this
         */
        this.forEachComponent = function (callback) {
            for (let i = 0; i < this.components.length; i++) {
                callback(this.components[i]);
            }

            return this;
        }

        /**
         * Loops through the components and calls the callback function for the component with the specified id.
         *
         * @param {string} id - The id of the component to search for
         * @param {function} callback - The callback function to be called for the matching component
         * @return {Object} - The current object
         */
        this.forComponentById = function (id, callback) {
            for (let i = 0; i < this.components.length; i++) {
                let comp = this.components[i];
                if (comp.id === id) {
                    callback(comp);
                } else if (comp instanceof KDVisualComponentContainer) {
                    comp.forComponentById(id, callback);
                }
            }
            return this;
        }
    }
}


/**
 * Constructor for KDLayer class.
 *
 * @param {type} params - description of parameter
 * @return {type} instance of KDVisualComponentContainer
 */
function KDLayer(params) {
    let obj = new KDVisualComponentContainer(params);
    obj.htmlElement = "div";
    obj.cssTextForChildren += ";position:relative;";

    obj.setValue = function (value) {
        this.value = value;
        if (this.isBuilt) {
            let content = document.createTextNode(this.value);
            this.domElement.appendChild(content);
            //  this.domElement.innerHTML = this.value;
        }
        return obj;
    }

    obj.KDVisualComponentContainerBuild = obj.build;
    obj.build = function () {
        this.KDVisualComponentContainerBuild();
        if (this.value !== undefined) {
            this.setValue(this.value);
        }
        return obj;
    }
    return obj;
}


/**
 * Create a new KDRow object with the given parameters and return it.
 *
 * @param {type} params - description of parameters
 * @return {type} the newly created KDRow object
 */
function KDRow(params) {
    let obj = KDLayer(params);
    obj.cssTextForChildren += "display:inline;";
    return obj;
}


/**
 * Constructor function for KDColumn.
 *
 * @param {Object} params - parameters for KDColumn
 * @return {Object} - an object representing KDColumn
 */
function KDColumn(params) {
    let obj = KDLayer(params);
    obj.cssTextForChildren += "display:block;";
    return obj;
}


/**
 * Create a new KDList component.
 *
 * @param {Object} params - the parameters for the KDList component
 * @return {Object} the newly created KDList component
 */
function KDList(params) {

    let obj = new KDVisualComponentContainer(params);
    obj.htmlElement = "div";
    obj.KDVisualComponentContainerBuild = obj.build;
    obj.componentsTemplate = null;
    obj.data = null;

    obj.build = function () {
        this.KDVisualComponentContainerBuild();
        this.componentsTemplate = this.components[0].clone();
        return this;
    }

    /**
     * Fill the list with data, creating a component for each item in the data array.
     * Data mut be and array of objects
     */
    obj.setArrayData = function (arrayData) {
        obj.arrayData = arrayData;
        if (obj.isBuilt) {
            obj.clear();
            obj.arrayData.map(function (row) {
                const comps = obj.componentsTemplate.clone();
                comps.setData(row);
                if (comps.isBuilt == false) { comps.build(); };
                obj.append(comps);
            });
            return obj;
        }
        return obj;
    }
    return obj;
}



function KDInputButton(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "button";
    return obj;
}

function KDInputText(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "text";
    return obj;
}

function KDInputCheckBox(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "checkbox";
    obj.setValue =
        function (value) {
            if (value) {
                this.domElement.checked = true;
            } else {
                this.domElement.checked = false;
            }
        }
    obj.getValue = function () {
        return this.domElement.checked;
    }
    return obj;
}

function KDInputColorPicker(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "color";
    return obj;
}

function KDInputDatePicker(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "date";
    return obj;
}

function KDInputDateTimePicker(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "datetime-local";
    return obj;
}

function KDInputEmail(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "email";
    return obj;
}

function KDInputFile(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "file";
    return obj;
}

function KDInputHidden(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "hidden";

    return obj;
}

function KDInputImage(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "image";

    obj.setValue = function (value) {
        this.value = value;
        if (this.isBuilt) {
            this.domElement.src = this.value;
        }
        return obj;

    }

    return obj;
}



function KDImage(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "img";
    //obj.htmlType = "image";

    obj.setValue = function (value) {
        this.value = value;
        if (this.isBuilt) {
            this.domElement.src = this.value;
        }
        return obj;

    }

    return obj;
}






function KDInputMonth(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "month";
    return obj;
}

function KDInputNumber(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "number";
    return obj;
}

function KDInputPassword(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "password";
    return obj;
}

function KDInputRadio(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "radio";
    return obj;
}

function KDInputRange(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "range";
    return obj;
}

function KDInputReset(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "reset";
    return obj;
}

function KDInputSearch(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "search";
    return obj;
}

function KDInputSubmit(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "submit";
    return obj;
}

function KDInputTel(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "tel";
    return obj;
}

function KDInputTime(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "time";
    return obj;
}

function KDInputUrl(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "url";
    return obj;
}

function KDInputWeek(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "week";
    return obj;
}


function KDHorizontalLine(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "hr";
    obj.cssText = "position:absolute; top:0; left:0; width:100%; height:1px; background-color:Gray;";
    return obj;
}


function KDScreen(params) {
    let obj = new KDVisualComponentContainer(params);
    obj.htmlElement = "div";
    obj.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background-color: Snow; border:1px solid Black; box-sizing:border-box;";
    obj.cssText += "";
    return obj;
}

function KDDesktop(params) {
    let desktop = new KDScreen(params);

    //Esquina superior izquierda
    let corner = new KDVisualComponentContainer(params);
    corner.htmlElement = "div";
    corner.cssText = "position:absolute; top:-10vw; left:-10vw; width:20vw; height:20vw; border-radius:50%;  background: linear-gradient(to right, #33ccff 18%, #ff99cc 100%);box-shadow: 10px 10px 5px #888888;";
    corner.build();

    corner.addEvent("mouseover", function (e) {
        corner.domElement.animate(
            [{ transform: "scale(2.0, 2.0)" }],
            { duration: 1000, fill: "forwards" }
        );

        corner.domElement.animate(
            [{ background: "linear-gradient(to right, white 18%, blue 100%)" }],
            { duration: 100, direction: "alternate", iterations: 3 }
        );
    })

    corner.addEvent("mouseout", function (e) {
        corner.domElement.animate(
            [{ transform: "scale(1.0, 1.0)" }],
            { duration: 1000, fill: "forwards" }
        );



    })

    let applicationsList = [];
    KD.kernel.applications.map((app) =>
        applicationsList.push({ "name": app.name, "icon": app.icon })
    )
    console.log(applicationsList);

    // applications layer:
    let appLayer = KDList()
        .appendCssText("position:absolute; width:25%; height:25%; top:50%; left:50%; transform:translate(-50%, -50%);")
        .appendCssText("border:1px solid black;")
        .appendCssText("padding:8px;")
        .appendCssText("z-index:10;")
        .append(
            KDRow()
                .setField("icon")
                .append(
                    KDLayer()
                        .setField("name")
                        .addEvent("click", () => { KD.kernel.sendMessage(KDMessage({ "source": "desktop", "target": "terminal", "data": "SHOW_terminal" })) })
                )

        )
        .setArrayData(applicationsList)
        .build();

    desktop.append(corner);
    desktop.append(appLayer);

    return desktop;

}

function KDWindowTheme(params) {
    let obj = new KDObject(params);

    obj.frameStyle = "position:absolute; top:0; left:0; width:200px; height:200px; box-shadow: 10px 10px 5px #888888;";
    obj.headStyle = "position:absolute; top:0; left:0; width:100%; height:32px; text-align:center; padding-top:8px;color:white;";
    obj.bodyStyle = "position:absolute; top:32px; left:0px; width:100%; height:100%; height:calc(100% - 64px); overflow:scroll;";
    obj.footStyle = "position:absolute; bottom:0; left:0; width:100%; height:32px; background-color:DarkCyan;";

    return obj;
}


function KDWindowThemeDefault(params) {
    let obj = new KDWindowTheme(params);
    obj.frameStyle += "background-color:DodgerBlue; border:4px solid Gray; border-radius:5px;";
    obj.headStyle += "background: linear-gradient(to right, #33ccff 18%, #ff99cc 100%); color:white;";
    obj.bodyStyle += "background-color:white;";
    obj.footStyle += "background: linear-gradient(to right, #33ccff 18%, #ff99cc 100%);";
    return obj;
}


function KDWindowThemeGold(params) {
    let obj = new KDWindowTheme(params);
    obj.frameStyle += "background-color:Blue;";
    obj.headStyle += "background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); color:white;";
    obj.bodyStyle += "background-color:Gold;";
    obj.footStyle += "background-color:Gold;";
    return obj;
}


function KDWindow(params) {
    let frame = new KDVisualComponentContainer(params);
    frame.htmlElement = "div";
    frame.theme = KDWindowThemeDefault();
    frame.title = "";

    frame.append(KDLayer());
    frame.append(KDLayer());
    frame.append(KDLayer());
    frame.append(KDLayer());
    frame.append(KDLayer());


    frame.head = frame.components[0];
    frame.body = frame.components[1];
    frame.foot = frame.components[2];
    frame.superHead = frame.components[3];
    frame.minimizeButton = frame.components[4];

    //Super frame is a Special Frame
    frame.superHead.cssText = "position:absolute; top:-20px; left: -20px; width:calc(100% + 40px); height:48px;";

    //Minimize Button
    frame.minimizeButton.cssText = "position:absolute; top:2px; right:4px; width:28px; height:24px; border:1px solid Black;";
    frame.minimizeButton.cssTextForChildren = "position:absolute;";
    frame.minimizeButton.append(
        KDHorizontalLine()
            .appendCssText("position:absolute; top:8px; left:2px; width:calc(100% - 6px); height:4px;")
    );
    frame.minimizeButton.addEvent("click", function () {
        frame.setVisible(false);
    })


    /**
     * This code snippet defines a function forBody on the frame object, which takes a callback as an argument. Inside the function, it calls the callback with frame.body as the argument and then returns this.
     * @param {*} callback 
     */
    frame.forBody = function (callback) {
        callback(this.body);
        return this;
    }

    frame.setTitle = function (title) {
        this.title = title;
        if (this.isBuilt) {
            this.head.domElement.innerHTML = title;
        }
        return this;
    }

    frame.applyTheme = function (theme) {
        this.theme = theme;
        if (this.isBuilt) {
            this.appendCssText(theme.frameStyle);
            this.head.appendCssText(theme.headStyle);
            this.body.appendCssText(theme.bodyStyle);
            this.foot.appendCssText(theme.footStyle);
        }
        return this;
    }

    frame.KDVisualComponentContainerBuild = frame.build;

    frame.build = function () {

        this.KDVisualComponentContainerBuild();
        this.setTitle(this.title);
        this.makeDraggable(this.superHead, this);
        this.applyTheme(this.theme);


        return this;
    }

    frame.append = function () {
        for (let i = 0; i < arguments.length; i++) {
            this.body.append(arguments[i]);
        }
        return this;
    }

    return frame;
}


function KDMessage(params) {
    let obj = new KDObject(params);
    obj.source = obj.source ? obj.source : "";
    obj.target = obj.target ? obj.target : "";
    obj.data = obj.data ? obj.data : "";
    return obj;
}


/**
 * The KDApplication class is the base class for all applications.
 */
class KDApplication extends KDObject {
    /**
     * Constructor for creating a new instance.
     *
     * @param {params} params - the parameters for the constructor
     * @return {KDApplication} The newly created instance
     */
    constructor(params) {
        super(params);
        KD.kernel.applications.push(this);
        this.name = this.name ? this.name : "Application";
        this.category = this.category ? this.category : "system";

        // Generics commands:
        this.SHOW = "SHOW_" + this.name;
        this.CLOSE = "CLOSE_" + this.name;

    }

    run() {
        return this;
    }

    processMesage(message) {
        return this;
    }
}



(function KDTerminalApplication(params) {

    if (params === undefined) params = {};
    params["name"] = "terminal";
    let app = new KDApplication(params);
    app.focusedLine = null;

    app.processLine = function (line) {

        let re1 = /(\w+)\s*=\s*(\w+|"[^"]+?")|("[^"]+?")|(\w+)/g;

        let args = new Object();
        let command;

        let tokens = line.split("|");
        tokens.map(function (token) {
            command = undefined;
            token = token.trim();

            for (const m of token.matchAll(re1)) {
                console.log(m);

                if (m[4] != undefined) {
                    command = m[4];
                } else if (m[3] != undefined) {
                    args = m[3];
                } else {
                    args[m[1]] = m[2];
                }
            }

            if (KD.kernel.exists(command)) {
                args = KD.kernel.sendMessage(KDMessage({ "source": "terminal", "target": command, "data": args }));
                if (args == undefined) { args = new Object(); }
            }



        });


        if (args != undefined) {
            app.newLine(args);
            args = undefined;
        }

        return app;
    }


    app.newLine = function (text) {
        app.window.append(
            KDInputText()
                .setValue(text === undefined ? "" : text)
                .appendCssText("width:100%; border:none; outline:none;")
                .addEvent("keydown", function (e) {
                    app.focusedLine = e.target;
                    if (e.keyCode == 13 || e.keyCode == 10) {
                        app.processLine(app.focusedLine.value);

                        if (app.focusedLine.nextElementSibling == null) {
                            app.newLine();
                        }
                        app.focusedLine.nextElementSibling.focus();
                    } else if (e.keyCode == 38) {
                        let q = e.target.previousElementSibling;
                        if (q != null) q.focus();
                    } else if (e.keyCode == 40) {
                        let q = e.target.nextElementSibling;
                        if (q != null) q.focus();
                    }

                })
                .addEvent("mousedown", function (e) {
                    app.focusedLine = e.target;
                })

        )
        return app;
    }

    app.run = function () {

        if (params === undefined) params = {};
        if (params["width"] === undefined) params["width"] = 400;
        if (params["height"] === undefined) params["height"] = 300;

        //Hacemos la ventana
        app.window = new KDWindow()
            .publish()
            .center()
            .setSize(params["width"], params["height"])
            .setTitle("Terminal");

        app.newLine();

        return app;
    }

    app.processMesage = (message) => {

        if (message.data == app.SHOW) {
            if (app.window == undefined) {
                app.run();
            } else {
                app.window.setVisible(true);
            }

        } else if (message.data == app.CLOSE) {
            app.window.setVisible(false);
        } else {
            app.newLine(message.data);
        }

        return undefined;

    }

    return app;
})();



/**
 * Creates a new console application. 
 * Useful for debugging purposes.
 * On terminal type: console [message].
 */
(function KDConsoleAppication(params) {
    let app = new KDApplication({ name: "console" });

    app.run = function (args) {
        return app;
    }


    app.processMesage = function (message) {
        console.log(message.data);
        return message.data;
    }

    return app;
})();

/**
 * Creates a new eval application. 
 * Useful for debugging purposes.
 * On terminal type: eval [message].
 * [message] can be a javascript expression.
 */
(function KDEval(params) {
    let app = new KDApplication({ name: "eval" });

    app.processMesage = function (message) {
        let r = eval(message.data);
        let m = KDMessage({ "source": "eval", "target": message.source, "data": r });
        return r; //KD.kernel.sendMessage(m);
    }

    return app;
})();

/**
 * Creates a new alert application. 
 * Useful for debugging purposes.
 * On terminal type: alert [message].
 * [message] show an alert message.
 */
(function KDAlertAppication(params) {
    let app = new KDApplication({ name: "alert" });

    app.run = function (args) {
        return app;
    }


    app.processMesage = function (message) {
        window.alert(message.data);
        return message.data;
    }

    return app;
})();


(function KDAlertRandom(params) {
    let app = new KDApplication({ name: "random" });

    app.run = function (args) {
        return app;
    }


    app.processMesage = function (message) {

        let r;

        if (message.data != undefined) {
            let min = parseInt(message.data["min"] ? message.data["min"] : 0);
            let max = parseInt(message.data["max"] ? message.data["max"] : 1);
            r = Math.floor(Math.random() * (max - min + 1) + min);
        } else {
            r = Math.random();
        }
        return r;

    }

    return app;
})();



