

/**
 * Useful framework KD object
 */
const KD = {
    version: "0.1.0",
    idCounter: 0,
    createId: function () {
        return "kd" + KD.idCounter++;
    },


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
    constructor(params) {
        super(params);

        /**
         * @type {HTMLElement}
         */
        this.domElement = null;

        /**
         * @type {string}
         */
        this.htmlElement = "div";
        /**
         * @type {string} 
         */
        this.htmlType = null;

        /**
         * @type {String} 
         */
        this.field = null;

        /**
         * @type {String} 
         */
        this.cssText = "";

        /**
         * @type {any}
         */
        this.value = undefined;

        /**
         * @description If the component is built this property will be true.   
         * @type {boolean} 
         */
        this.isBuilt = false;

        this.events = [];

        if (params !== undefined) {
            for (let param in params) {
                this[param] = params[param];
            }
        }


        this.KDObjectClone = this.clone;
        this.clone = function () {
            let obj = this.KDObjectClone();

            if (this.isBuilt) {
                obj.domElement = this.domElement.cloneNode(true);
                obj.domElement.setAttribute("id", obj.id);
            }

            return obj;
        }

        /**
         * 
         * @param {*} value Set the value of the component.
         */
        this.setValue = function (value) {
            this.value = value;
            if (this.isBuilt) {
                this.domElement.value = value;
            }

            return this;
        }

        /**
         * 
         * @returns {any} Get the value of the component.
         */
        this.getValue = function () {
            if (this.isBuilt) { return this.domElement.value; } else { return this.value }
        }

        /**
         * 
         * @returns {KDVisualComponent} Build the component.
         */
        this.build = function () {
            //Create element
            this.domElement = document.createElement(this.htmlElement);

            //Set isBuilt to true   
            this.isBuilt = true;

            //Assign html type if exists
            if (this.htmlType !== null) {
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

        this.addEvent = function (event, action) {
            this.events[event] = action;
            if (this.isBuilt) {
                for (let e in this.events) {
                    this.domElement.addEventListener(e, this.events[e]);
                }
            }
            return this;
        }

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
    constructor(params) {
        super(params);


        this.width = "300px";
        this.height = "200px";


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


        this.KDComponentBuild = this.build;

        this.build = function () {
            this.KDComponentBuild();

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



        this.show = function (component) {

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

        this.bringToFront = function () {
            if (this.isBuilt) {
                this.domElement.style.zIndex++;
            }
            return this;
        }

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


        this.setSize = function (width, height) {

            if (!isNaN(width)) width = width + "px";
            if (!isNaN(height)) height = height + "px";

            this.width = width;
            this.height = height;

            if (this.isBuilt) {
                this.domElement.style.width = width;
                this.domElement.style.height = height;
            }
            return this;
        }

        this.center = function () {
            if (this.isBuilt) {
                this.appendStyle("position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);");
            }
            return this;
        }

    }
}

/**
 * Base class of all visual components whose contains other components.
 */
class KDVisualComponentContainer extends KDVisualComponent {
    constructor(params) {
        super(params);

        /** Components collection */
        this.components = [];

        /**
         * @description Texto CSS para los elementos internos del contenedor 
         * @type {string} 
         */
        this.cssTextForChildren = ";";


        /**
         * Lista de componentes que se agregaran al contenedor
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
         * 
         * @param {*} field 
         * @param {*} value 
         *
         * @returns itself
         * This code defines a method setValueByField 
         * that takes a field and a value as input. 
         * It loops through the components and sets 
         * the value of the component with the matching field. 
         * Finally, it returns the current object. 
         */
        this.setValueByField = function (field, value) {
            for (let i = 0; i < this.components.length; i++) {
                let comp = this.components[i];
                if (comp.field === field) {
                    comp.setValue(value);
                }
            }
            return this;
        }


        /**
         * This code defines a method setData that takes a JSON object as input and sets the values of components based on the fields in the JSON object. If a field in the JSON object matches a field in a component, the value of that component is updated. Finally, it returns the object itself.
         * @param {*} json 
         * 
         */
        this.setData = function (json) {
            for (let i = 0; i < this.components.length; i++) {
                let comp = this.components[i];
                if (json[comp.field] !== undefined) {
                    if (comp instanceof KDVisualComponentContainer) {
                        comp.setData(json[comp.field])
                    } else {
                        comp.setValue(json[comp.field]);
                    }
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

        /**
         * This code snippet defines a function setValueDeeply that recursively sets values on a component and its nested components based on a JSON object. If the component has nested components, it iterates through them and calls setValueDeeply recursively. If there are no nested components, it sets the value of the component based on the JSON object. Finally, it returns the current context (this).
         * @param {*} component 
         * @param {*} json 
         */
        this.setValueDeeply = function (component, json) {

            if (component.components !== undefined) {
                for (let i = 0; i < component.components.length; i++) {
                    this.setValueDeeply(component.components[i], json);
                }
            } else {
                component.setValue(json[component.field]);
            }

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


    obj.setData = function (data) {
        this.data = data;
        if (this.isBuilt) { this.fill() }
        return this;
    }

    obj.build = function () {
        //this.componentsTemplate = KD.create(this.components)[0];
        this.componentsTemplate = this.components[0].clone();
        this.clear();
        this.KDVisualComponentContainerBuild();
        if (this.data != null) {
            this.fill();
        }
        return this;
    }

    /**
     * Fill the list with data, creating a component for each item in the data array.
     */
    obj.fill = function () {
        for (let i = 0; i < this.data.length; i++) {
            const comps = this.componentsTemplate.clone();
            comps.setValueDeeply(comps, this.data[i]);
            if (comps.isBuilt == false) { comps.build(); };
            this.append(comps);
            console.log(comps);
        }
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

function KDScreen(params) {
    let obj = new KDVisualComponentContainer(params);
    obj.htmlElement = "div";
    obj.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background-color: LemonChiffon ;";
    obj.cssText += "";
    return obj;
}




function KDWindowTheme(params) {
    let obj = new KDObject(params);

    obj.frameStyle = "position:absolute; top:0; left:0; width:200px; height:200px; background-color:LightCyan;";
    obj.headStyle = "position:absolute; top:0; left:0; width:100%; height:32px; text-align:center; padding-top:8px;color:white;";
    obj.bodyStyle = "position:absolute; top:32px; left:0px; width:100%; height:100%; height:calc(100% - 32px);background-color:LightCyan; overflow:scroll;";
    obj.footStyle = "position:absolute; bottom:0; left:0; width:100%; height:32px; background-color:DarkCyan;";

    return obj;
}


function KDWindowThemeDefault(params) {
    let obj = new KDWindowTheme(params);
    obj.frameStyle += "background-color:DodgerBlue; border:4px solid Gray; border-radius:5px;";
    obj.headStyle += "background: linear-gradient(to right, #33ccff 18%, #ff99cc 100%); color:white;";
    obj.bodyStyle += "background-color:GhostWhite;";
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

    frame.head = frame.components[0];
    frame.body = frame.components[1];
    frame.foot = frame.components[2];

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
            this.appendStyle(theme.frameStyle);
            this.head.appendStyle(theme.headStyle);
            this.body.appendStyle(theme.bodyStyle);
            this.foot.appendStyle(theme.footStyle);
        }
        return this;
    }

    frame.KDVisualComponentContainerBuild = frame.build;

    frame.build = function () {

        this.KDVisualComponentContainerBuild();
        this.setTitle(this.title);
        this.makeDraggable(this.head, this);
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



