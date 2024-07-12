import { create } from "xmlbuilder2";
import axios from "axios";

// Build the XML
const xml = create({ version: "1.0", encoding: "UTF-8" })
  .ele("soapenv:Envelope", {
    "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
    "xmlns:ws": "http://ws.iap.samsung.com/",
  })
  .ele("soapenv:Header")
  .up()
  .ele("soapenv:Body")
  .ele("ws:createServiceToken")
  .ele("secret")
  .txt("123456789012")
  .end({ prettyPrint: true });

// Print the XML to console (for debugging)
console.log(xml);

// // Send the SOAP request
// axios.post('http://your-soap-endpoint.com', xml, {
//     headers: {
//         'Content-Type': 'text/xml',
//         'SOAPAction': '' // Optional, set if needed by the SOAP service
//     }
// })
//     .then(response => {
//         console.log('Response:', response.data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

//     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
// xmlns:ws="http://ws.iap.samsung.com/">
//     <soapenv:Header/>
//     <soapenv:Body>
//     <ws:createServiceToken>
//     <secret>123456789012</secret>
// </ws:createServiceToken>
// </soapenv:Body>
// </soapenv:Envelope>

// <?xml version="1.0" encoding="UTF-8"?>
// <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.iap.samsung.com/">
// <soapenv:Header/>
// <soapenv:Body>
// <ws:createServiceToken>
// <secret>123456789012</secret>
// </ws:createServiceToken>
// </soapenv:Body>
// </soapenv:Envelope>
