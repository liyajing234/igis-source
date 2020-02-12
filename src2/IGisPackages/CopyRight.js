class CopyRight {
    constructor() {
        let div=document.createElement("div");
        let text="Copyright @2019 IGIS";
        div.classList.add("ig-copyright");
        div.innerHTML=text;
        document.body.appendChild(div);
    }

}
export {CopyRight}