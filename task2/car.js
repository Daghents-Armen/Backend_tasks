class Car{
    constructor(brand, model, year){
        this.brand = brand;
        this.model = model;
        this.year = year;
    }

    getInfo(){
        return this.model;
    }

    drive(){
        return `starting... ${this.brand}`;
    }
}

module.exports = Car;