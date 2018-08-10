const fs = require('fs');
const output = [];
const someData = {
    name: '',
    category: '',
    sub_category: ''
}
const titleTransform = (aName) => {
    var dataTitle = aName.match(/\(([^)]*)\)/);
    // console.log(" the title ", dataTitle);
    return dataTitle;
}

const cleanUp = (rawData) => {
    // console.log(rawData);
    // console.log(typeof(rawData));

        for (let dataItem of rawData) 
        {
            // console.log("******************************");
            // console.log(dataItem.keywords);
            // console.log("******************************");
            let tempData = dataItem.keywords;
            let tempArr = tempData.split(", ");
            for( let i = 0; i < tempArr.length; i++){
                someData.name = tempArr[i].toUpperCase();
                someData.category = dataItem.category;
                someData.sub_category = titleTransform(dataItem.title);
                output.push(someData);
            }
        };
    // return console.log(output);
};


fs.readFile('wasteTable.json', 'utf-8', function (err, buf) {
    const bufObj = JSON.parse(buf);
    // const bufObj = JSON.stringify(buf);
    console.log('reading file');
    // console.log(typeof(buf));
    // console.log(bufObj);
    // cleanUp(buf);
    cleanUp(bufObj);
    console.log('done');
});



fs.writeFile('output.json', output, function (err, data) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});