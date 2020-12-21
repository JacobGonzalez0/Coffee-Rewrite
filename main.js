class Search {

    domObject
    data
    filters

    constructor(id, list){

        if(list == null){
            document.body.append("No List specified on search")
            document.body.style.background = "red"
        }

        if(list.constructor.name != "List"){
            document.body.append("Invalid List")
            document.body.style.background = "red"
        }
        
        this.data = list

        this.filters = []

        this.domObject = document.getElementById(id);
        this.domObject.addEventListener("keyup", event => this.search(event))

    }

    search(e){
        e.preventDefault();
        
        var searchValue = e.target.value.toLowerCase();
        //if search is empty
        var filteredData = []

        this.data.coffees.forEach( coffee =>{

            //switches the coffee name to lowercase for the compare to be accurate
            var coffeeCase = coffee.name.toLowerCase()
            //check if coffee name has any part of the search term in there
            var filterCheck = false;

            this.filters.forEach( filter =>{

                if(filter.domObject.value.toLowerCase() == "all") return false;
                if(coffee[filter.name].toLowerCase() != filter.domObject.value.toLowerCase()){
                    console.log("hits")
                    filterCheck = true;
                }
                
            })

            if(coffeeCase.indexOf(searchValue) == -1 || filterCheck){
                return false; 
            }else{
                filteredData.push(coffee);
            }   
        })

        this.data.drawList(filteredData)
        
    }

    addFilter(domObject, filterName = `filter${this.filters.length}`){

        var element = document.getElementById(domObject);
        if(element.constructor.name != "HTMLSelectElement") return false;

        this.filters.push({
            domObject: element,
            name: filterName
        })

       element.addEventListener("change", event => this.filter())

    }

    filter(e){
        this.search({
            preventDefault : ()=>{
                return
            },
            target : this.domObject
        })
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

class Background{

    canvas
    context
    layers
    limiter
    mousePos
    ready

    constructor(){

        this.canvas = document.createElement("canvas")
        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.overflow = "hidden";
        this.canvas.style.background = "lightgray";
        this.canvas.zIndex = "-2";


        this.context = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)

        this.layers = []

        this.limiter = {
            fps: 60,
            then: new Date().getTime(),
            now: new Date().getTime(),
            delta: null,
            interval: null,
        }

        this.limiter.interval = 1000 / this.limiter.fps

        this.mousePos = {
            x:0,
            y:0
        }

        document.addEventListener("mousemove", event => this.updateMouse(event) )
        window.addEventListener("resize", event => this.resizeCanvas(event) )

        this.resizeCanvas()
        this.ready = false;
    }

    updateMouse(e){
        this.mousePos.x = e.clientX
        this.mousePos.y = e.clientY
    }

    resizeCanvas(e){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addLayer(image, x = 0, y = 0, width, height,  index = this.layers.length){

        this.ready = false

        var obj = {};

        obj.image = new Image();
        obj.image.src = image;
        obj.image.onload = ()=>{
            this.ready = true
        }

        obj.index = index;
    
        obj.width = width || obj.image.width;
        obj.height = height || obj.image.height;
        obj.xPos = x + (obj.width/2);
        obj.yPos = y + (obj.height/2);

        this.layers.push(obj)

        
    }

    animate(){

        this.limiter.now = new Date().getTime();
        this.limiter.delta = this.limiter.now - this.limiter.then

        
        if(this.limiter.delta > this.limiter.interval && this.ready ){
            this.limiter.then = this.limiter.now - (this.limiter.delta % this.limiter.interval)

            //exec loop
            
            //sorts out the index 
            this.layers.sort((a, b) => b.index - a.index ) 
            
            //clears canvas
            this.context.clearRect(0,0,this.canvas.width, this.canvas.height)

            //draws all objects 
            this.context.rect(0,-600,20,20)

            this.context.fillRect(
                0 + (this.mousePos.x),
                0 + (this.mousePos.y),
                20,
                20
            )

            this.layers.forEach( object =>{

                this.context.drawImage(
                    object.image,
                    object.xPos + (this.mousePos.x/object.index),
                    object.yPos + (this.mousePos.y/object.index),
                    object.width,
                    object.height
                )

            })
            

        }

        requestAnimationFrame(()=>this.animate())
    }

}

var list = new List("coffeeList");

var search = new Search("coffeeSearch",list);
search.addFilter("roast","roast")
var background = new Background()

background.addLayer("img/mountains.png", 0,0 ,200,200,20)
background.animate()


window.onload = ()=>{

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

