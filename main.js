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

                if(filter.domObject.value.toLowerCase() == "all" || filter.domObject.value.toLowerCase() == "") return false;
                if(String(coffee[filter.name]).toLowerCase() != filter.domObject.value.toLowerCase()){
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

        //TODO: change to accept any input type for forms
        //if(element.constructor.name != "HTMLSelectElement") return false;

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
    cost;

    constructor(name = "New Coffee", roast = "dark", cost = 2.99){

        this.name = name;
        this.roast = roast;
        this.cost = cost;

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
        this.canvas.style.background = "linear-gradient(180deg, rgba(44,127,213,1) 0%, rgba(94,192,247,1) 100%)";
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

    setBackground(css){
        this.canvas.style.background = css
    }

    updateMouse(e){
        this.mousePos.x = e.clientX
        this.mousePos.y = e.clientY
    }

    resizeCanvas(e){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addLayer(image, x = 0, y = 0, width, height, index = this.layers.length){

        this.ready = false

        var obj = {};

        obj.image = new Image();
        obj.image.onerror = ()=>{
            //if the image doesnt load proper load placeholder
            obj.image.src = "data:image/png;base64,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";
        }
        
        obj.image.src = image;
        
        obj.image.onload = ()=>{
            this.ready = true
        }

        obj.index = index;

        //accepts auto for size
        if(typeof width == "string"){
            width = obj.image.width
        }
        if(typeof height == "string"){
            height = obj.image.height
        }
 
        obj.width = width  || obj.image.width ;
        obj.height = height  || obj.image.height ;
        obj.aspect = obj.width / obj.height
        obj.xPos = x - (obj.width/2);
        obj.yPos = y - (obj.height/2);

        this.layers.push(obj)

    }

    animateLayer(layer, direction, speed){


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
            this.layers.forEach( object =>{

                var width = object.width + this.canvas.width /2       

                this.context.drawImage(
                    object.image,
                    object.xPos + (this.mousePos.x/object.index),
                    object.yPos + (this.mousePos.y/object.index),
                    width ,
                    width / object.aspect
                )

            })
            
        }

        requestAnimationFrame(()=>this.animate())
    }

}




var list = new List("coffeeList");

var search = new Search("coffeeSearch",list);
search.addFilter("roast","roast");
var background = new Background();

background.addLayer("img/mountainback.png", 750, 400, 500, 500,20)
background.addLayer("img/mountainfront.png", 0, 400, 500, 500 ,17)
background.addLayer("img/fronthill.png", 0, 900, "auto", "auto", 4)
background.addLayer("img/backhill.png", 0, 1000, "auto", "auto",10)
background.animate()


window.onload = ()=>{

    //default values
    list.addCoffee(new Coffee())

    //sample data
    list.addCoffee(new Coffee("Light City","Light",99));
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

