[Home](index) > [Components](Components) > [Custom](Custom) > **Address with Lat Long**
***

## Examples
> This example shows you how to access other data that is sent to the form when you do an Address search and autocomplete    
> Try a working example<br>
> [View example](https://submit.digital.gov.bc.ca/app/form/submit?f=03690ca6-8d45-4aa5-a15f-00efe7ea891f)

## How do I make it?  

Start with the "BC Address" component or the new "Simple BC Address".
take note of the name of the field shown on the API tab in the field "Property Name".  
For this example I will use the default field label: "BC Address" with its corresponding Property name: "bcaddress".  

For the latitude field you can use the Advanced Text Field.
Name it "Latitude".  
on the data tab entering the following configuration:  

| Configuration Field | Comments                              | Value to Enter.            |     
| ------------------- | ------------------------------------- | -------------------------- |  
| Redraw On           | Select the name of your address field | BC Address                 |  
| Calculated Value > Javascript | "bcaddress" refers to the <br> Property Name | value = data.bcaddress.geometry.coordinates[1]; |   
  

```javascript
// latitude is the second item in the coordinates list    
// if your field is named something else you will need to adjust the javascript from "bcaddress" to the Property Name you chose  
value = data.bcaddress.geometry.coordinates[1];  
```   

For the longitude field also use the Advanced Text Field.
Name it "Longitude".  
on the data tab entering the following configuration:  

| Configuration Field | Comments                              | Value to Enter.            |     
| ------------------- | ------------------------------------- | -------------------------- |  
| Redraw On           | Select the name of your address field | BC Address                 |  
| Calculated Value > Javascript | "bcaddress" refers to the <br> Property Name | value = data.bcaddress.geometry.coordinates[0]; |   
  

```javascript  
// longitude is the first item in the coordinates list   
// if your field is named something else you will need to adjust the javascript from "bcaddress" to the Property Name you chose  
value = data.bcaddress.geometry.coordinates[0];  
```   

Save the field settings, then Save your form and preview to check that it worked.

***
[Terms of Use](Terms-of-Use) | [Privacy](Privacy) | [Security](Security) | [Service Agreement](Service-Agreement) | [Accessibility](Accessibility)
