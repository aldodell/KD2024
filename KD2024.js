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
    constructor(params) {

        this.id = KD.createId();

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



class KDComponent extends KDObject {
    constructor(params) {
        super(params);

        /**
         * @type {HTMLElement} Elemento DOM que se creara
         */
        this.domElement = null;

        /**
         * @type {string} Tipo de elemento que se creara
         */
        this.htmlElement = "div";
        /**
         * @type {string} Tipo de elemento que se crea (Sub tipo)
         */
        this.htmlType = null;

        this.field = null;

        this.cssText = "";

        this.value = undefined;

        this.isBuilt = false;


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


        this.setValue = function (value) {
            this.value = value;
            if (this.isBuilt) {
                this.domElement.value = value;
            }
        }

        this.getValue = function () {
            if (this.isBuilt) { return this.domElement.value; } else { return this.value }
        }


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


            return this;
        }
    }
}

class KDVisualComponent extends KDComponent {
    constructor(params) {
        super(params);
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
    }
}

class KDVisualComponentContainer extends KDVisualComponent {
    constructor(params) {
        super(params);

        /** Components collection */
        this.components = [];

        /**
         * @type {string} Texto CSS para los elementos internos del contenedor 
         */
        this.cssTextForChildren = ";";


        /**
         * @param {KDVisualComponent}  components Lista de componentes que se agregaran al contenedor
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
         * @returns 
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

    }
}



function KDRow(params) {
    let obj = new KDVisualComponentContainer(params);
    obj.htmlElement = "div";
    //obj.cssText += "display:inline;";
    obj.cssTextForChildren += "display:inline;";
    return obj;
}

/**
 * Hace falta un componente contenedor con componentes internos para mostrar datos
 * un array de objetos con datos para mostrar
 * @param {*} params 
 * @returns 
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


function KDColumn(params) {
    let obj = new KDVisualComponentContainer(params);
    obj.htmlElement = "div";
    //obj.cssText += "display:block;";
    obj.cssTextForChildren += "display:block;";
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

