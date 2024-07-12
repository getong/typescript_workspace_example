import * as fs from 'fs';
import * as xml2js from 'xml2js';

// Read the XML file
const xml = fs.readFileSync('example.xml', 'utf-8');

// Parse the XML
xml2js.parseString(xml, (err, result) => {
    if (err) {
        console.error("Error parsing XML:", err);
    } else {
        console.log("Parsed XML:", result);
        // Access specific parts of the XML
        console.log("Title:", result.book.title[0]);
        console.log("Author:", result.book.author[0]);
    }
});
