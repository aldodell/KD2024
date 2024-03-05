/**
 * @description Test framework
 */





let KD = {

    idCounter: 0,
    createId: function () {
        return "kd" + KD.idCounter++;
    }
}


class KDObject {
    constructor(params) {
        if (params !== undefined) {
            for (let param in params) {
                this[param] = params[param];
            }
        }

        this.id = KD.createId();
    }
}


class KDComponent extends KDObject {
    constructor(params) {
        super(params);
    }
}

class KDVisualComponent extends KDComponent {
    constructor(params) {
        super(params);

        this.htmlElement = "div";
        this.isBuilt = false;
        this.domElement = null;
        this.htmlType = "text";


    }

    build() {

        this.domElement = document.createElement(this.htmlElement);
        this.domElement.kd = this;
        this.isBuilt = true;
        return this;
    }



}


function KDInputButton(params) {
    let obj = new KDVisualComponent(params);
    obj.htmlElement = "input";
    obj.htmlType = "button";
    return obj;
}