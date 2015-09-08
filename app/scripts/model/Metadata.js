
class Metadata {
    constructor(metadata) {
        this.map = metadata;
    }

    entries() {
        return Object.entries(this.map);
    }
    
    get(key) {
        return this.map[key].value;
    }
}

export default Metadata;
