const fs = require('fs');
const output = [];
const RSVP = require('rsvp');
var wasteData = require('./wasteTable.json');
//declaring our class to create objects
class ClassTrash {
    constructor(name, category, sub_category) {
        this.name = name;
        this.category = category;
        this.sub_category = sub_category;
    }
}
//helper function that extracts any other titles in .title. eg: (title: 'sometitle ('someothertitle') -> 'someothertitle')
const titleTransform = (aName) => {
    var dataTitle = aName.match(/\(([^)]*)\)/);
    return dataTitle;
}
//transforms every single object from wasteTable (JSON array) into our desired classTrash objects
const cleanUp = (rawData) => {
    //forlooping every object
    for (const dataItem of rawData) {
        //creating a temporary array consisting of all the keywords in dataItem.keywords
        let tempData = dataItem.keywords;
        let tempArr = tempData.split(", ");
        //looping over temporary array so we can create a new ClassTrash object for every single keyword
        for (let i = 0; i < tempArr.length; i++) {
            // checking if the item has an alternate name (paper towel & napkin)
            // instantiate new ClassTrash object based of if else
            if (titleTransform(dataItem.title) == null) {
                var newTrash = new ClassTrash(tempArr[i].toUpperCase(), dataItem.category, 'no subcategory')
            } else {
                var newTrash = new ClassTrash(tempArr[i].toUpperCase(), dataItem.category, titleTransform(dataItem.title)[1])
            }
            // pushing to output array
            // transforming our new ClassTrash object with JSON.stringify()
            output.push(JSON.stringify(newTrash, null, 2));
        }
    };
};
//executing all our code here:
cleanUp(wasteData);
var promise = new RSVP.Promise(function (fulfill, reject) {
    var firstWriting = fs.writeFile('output.json', '[', function (err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
    fulfill(firstWriting);
});
//we're manually adding the square brackets to meet .json file requirement i.e: [{}, {}]
//output does't write to output.json with square brackets
//we add them ourselves by chaining promises
promise.then(function () {
    fs.appendFile('output.json', output, function (err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
}, null).then(function () {
    fs.appendFile('output.json', ']', function (err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
}, null);