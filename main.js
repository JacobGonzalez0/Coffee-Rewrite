 class Search {

    domObject

    constructor(id){

        this.domObject = document.getElementById(id);
        this.domObject.addEventListener("keyup", event => this.search(event))

    }

    search(e){
        e.preventDefault();

    }
 }

 class Coffee {

    name;
    roast;

    constructor(name = "New Coffee", roast = "dark"){

        this.name = name;
        this.roast = roast;

        return true;
    }

    drawCoffee(target){
        //check if the target is an HTML element
        if(target.constructor.name != "HTMLDivElement") return false;

        var bigName = document.createElement("h3");
        var smallName = document.createElement("h5");
        var container = document.createElement("div");

        bigName.innerHTML = this.name;
        smallName.innerHTML = this.roast;

        bigName.setAttribute("class","");
        smallName.setAttribute("class","px-2 font-weight-normal");

        container.setAttribute("class","d-flex flex-column flex-sm-row align-items-end")

        container.appendChild(bigName);
        container.appendChild(smallName);
        
        target.appendChild(container);
    }
    
 }

 class List{

    domObject;
    coffees;
    display;


    constructor(id){
        this.domObject = document.getElementById(id);
        
        //init the array
        this.coffees = [];
    }

    addCoffee(coffee){
        //check if the target is an HTML element
        if(coffee.constructor.name != "Coffee") return false;

        this.coffees.push(coffee)
    }

    drawList(arr = this.coffees){
        this.domObject.innerHTML = ""
        for(var i = 0; i < arr.length; i++){
            arr[i].drawCoffee(this.domObject)
        }

    }

 }

 var search = new Search("coffeeSearch");
 var list = new List("coffeeList");

 list.addCoffee(new Coffee())
 list.drawList()