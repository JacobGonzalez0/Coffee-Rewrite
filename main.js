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

        container.setAttribute("class","col-12 col-lg-6 d-flex flex-row align-items-end ")

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





document.onload = ()=>{
    //default values
    list.addCoffee(new Coffee())

    //sample data
    list.addCoffee(new Coffee("Light City","Light"));
    list.addCoffee(new Coffee("Half City","Light"));
    list.addCoffee(new Coffee("Cinnamon","Light"));
    list.addCoffee(new Coffee("City","Medium"));
    list.addCoffee(new Coffee("American","Medium"));
    list.addCoffee(new Coffee("Breakfast","Medium"));
    list.addCoffee(new Coffee("High","Dark"));
    list.addCoffee(new Coffee("Continental","Dark"));
    list.addCoffee(new Coffee("New Orleans","Dark"));
    list.addCoffee(new Coffee("European","Dark"));
    list.addCoffee(new Coffee("Espresso","Dark"));
    list.addCoffee(new Coffee("Viennese","Dark"));
    list.addCoffee(new Coffee("Italian","Dark"));
    list.addCoffee(new Coffee("French","Dark"));
    
    list.drawList()
}