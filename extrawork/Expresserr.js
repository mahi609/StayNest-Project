class Expresserr extends Error{
    constructor(status, message){
        // 1. Call super() first, passing the message to initialize the Error object.
        super(message); 
        
        // 2. Set custom properties after calling super().
        this.status = status; 
        
        // OPTIONAL: If you want to customize the Error name for debugging
        this.name = 'Expresserr'; 
    }
}

module.exports = Expresserr;