const normalize = (src) =>
  /^\d$/.test(src.charAt(0))
    ? `N${src}`
    : src.charAt(0).toUpperCase() + src.slice(1);

const isDate = (src) =>
  /^(\d{4})(-(0[1-9]|1[0-2])(-([12]\d|0[1-9]|3[01]))([T\s]((([01]\d|2[0-3])((:)[0-5]\d))([\:]\d+)?)?(:[0-5]\d([\.]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)$/.test(
    src
  );

const getPrimitiveProp = (obj, key) => {
  const type = typeof obj;
  switch (type) {
    case "string":
      return { type: isDate(obj) ? "DateTime" : "string", name: key };
    case "number":
      return { type: Number.isInteger(obj) ? "int" : "double", name: key };
    case "boolean":
      return { type: "bool", name: key };
    default:
      return;
  }
};

const handleObject = (classes, obj, key, skip) => {
  let target = classes.find((x) => x.key == key);
  if (!target) {
    target = { key, props: [] };
    if (!skip) classes.push(target);
  }

  Object.keys(obj).forEach((k) => {
    const keyName = isNaN(k) ? k : `${key}Item`;
    let prop;
    if (typeof obj[k] == "object") {
      if (Array.isArray(obj[k])) {
        if (Array.from(obj[k]).length > 0) {
          if (typeof obj[k][0] == "object") {
            handleObject(classes, obj[k], keyName, true);
            prop = {
              type: normalize(`${keyName}Item[]`),
              name: keyName,
            };
          } else {
            prop = getPrimitiveProp(obj[k][0], keyName);
            prop.type = prop.type + "[]";
          }
        }
      } else {
        handleObject(classes, obj[k], keyName);
        prop = { type: normalize(keyName), name: keyName };
      }
    } else {
      prop = getPrimitiveProp(obj[k], keyName);
    }

    if (prop && !target.props.some((x) => x.name == prop.name))
      target.props.push(prop);
  });
};

export const json2classes = (src) => {
  const classes = [];
  handleObject(classes, JSON.parse(src), "root");
  return classes;
};

const json2csharp = (src, annotations) => {
  const classes = json2classes(src);
  let result = "";
  result += "using System;\n";
  result += annotations ? "using Newtonsoft.Json;\n\n" : "\n";
  classes.forEach((c) => {
    result += `public class ${normalize(c.key)}\n`;
    result += "{";
    result += annotations ? "" : "\n";
    c.props.forEach((p) => {
      result += annotations ? `\n\t[JsonProperty("${p.name}")]\n` : "";
      result += `\tpublic ${p.type} ${normalize(p.name)} { get; set; }\n`;
    });
    result += "}\n\n";
  });

  return result;
};

export default json2csharp;
