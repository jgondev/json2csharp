# json2csharp
Generate C# classes from a json.
## Installation
```
npm install json2csharp
```
## Usage
```js
import json2csharp from "json2csharp";

const src = `{ 
    "name": "jgondev",
    "age": 32,
    "packages": [
        {
            "name": "json2csharp",
            "release": "2023-01-17T22:29:26.503Z"
        }
    ],
    "keywords": [
        "json",
        "csharp"
    ]
 }`;

const result = json2csharp(src);
```

## Result
```c#
using System;
public class Root
{
    public string Name { get; set; }
    public int Age { get; set; }
    public PackagesItem[] Packages { get; set; }
    public string[] Keywords { get; set; }      
}

public class PackagesItem
{
    public string Name { get; set; }
    public DateTime Release { get; set; }
}
```
---
## Newtonsoft Annotations
**json2csharp** method accepts a second parameter to provide [Newtonsoft annotations](https://www.newtonsoft.com/jsonschema/help/html/GenerateWithJsonNetAttributes.htm)<br><br>
`const result = json2csharp(src, true);`
```c#
using System;
using Newtonsoft.Json;

public class Root
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("age")]
    public int Age { get; set; }

    [JsonProperty("packages")]
    public PackagesItem[] Packages { get; set; }

    [JsonProperty("keywords")]
    public string[] Keywords { get; set; }
}

public class PackagesItem
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("release")]
    public DateTime Release { get; set; }
}
```
---
## Classes model
**json2csharp** is internally calling another method to model the json classes that is then used to generate the classes file.<br><br>This method is called `json2classes` and you can import and use it like this:

```js
import { json2classes } from "json2csharp";

const jsonSrc = [...]

const result = json2classes(jsonSrc);
```

#### Result
```json
[
   {
      "key":"root",
      "props":[
         {
            "type":"string",
            "name":"name"
         },
         {
            "type":"int",
            "name":"age"
         },
         {
            "type":"PackagesItem[]",
            "name":"packages"
         },
         {
            "type":"string[]",
            "name":"keywords"
         }
      ]
   },
   {
      "key":"packagesItem",
      "props":[
         {
            "type":"string",
            "name":"name"
         },
         {
            "type":"DateTime",
            "name":"release"
         }
      ]
   }
]
```