function addSpaceBeforeHttps(input) {
  const parts = input.split("https");
  let modifiedString = parts[0];

  for (let i = 1; i < parts.length; i++) {
    modifiedString += " https" + parts[i];
  }

  return modifiedString;
}
function extractBackgroundImages(jsonObject) {
  const backgrounds = [];
  try {
    if (typeof jsonObject === "object" && jsonObject !== null) {
      _extractBackgroundImagesFromObject(jsonObject, backgrounds);
    }
  } catch (e) {
    // Handle JSON parsing errors if needed
    // console.log("JSON parsing error: " + e);
  }
  return backgrounds.length > 0 ? backgrounds[0] : "";
}

function _extractBackgroundImagesFromObject(obj, backgrounds) {
  // Implement your logic for extracting background images from the object
  // For example, if the background images are stored in a property named "backgrounds"
  if (obj.hasOwnProperty("backgrounds") && Array.isArray(obj["backgrounds"])) {
    backgrounds.push(...obj["backgrounds"]);
  }

  // Add more logic as needed based on your data structure
}

const jsonObject = { backgrounds: ["image1.jpg", "image2.jpg", "image3.jpg"] };
const result = extractBackgroundImages(jsonObject);
function extractBackgroundImagesFromMap(jsonMap, backgrounds) {
  for (const value of Object.values(jsonMap)) {
    if (typeof value === "string" && value.includes("background-image:url")) {
      const match = value.match(/background-image:url\('([^']+)'\)/);
      if (match !== null) {
        backgrounds.push(match[1] || "");
      }
    } else if (typeof value === "object" && value !== null) {
      extractBackgroundImagesFromMap(value, backgrounds);
    }
  }
}
console.log(result);
class AccountNameExtractor {
  extractAccountName(contentHtml) {
    const endIndex = contentHtml.indexOf("</p>—") + 5;
    try {
      return contentHtml.substring(endIndex, contentHtml.indexOf("("));
    } catch (e) {
      // console.log(e);
      return "";
    }
  }
}
function contentExtractor({ titleText }) {
  try {
    const startIdx = titleText.indexOf(":") + 1;
    return titleText.substring(startIdx);
  } catch (e) {
    // console.log(e);
    return titleText;
  }
}
//   const extractor = new AccountNameExtractor();
//   const accountName = extractor.extractAccountName(contentHtml);
module.exports = {
  addSpaceBeforeHttps,
  extractBackgroundImages,
  extractBackgroundImagesFromMap,
  AccountNameExtractor,
  contentExtractor,
};
