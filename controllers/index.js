import axios from "axios";
import { JSDOM } from "jsdom";

// Below function gets the html content from the url
const downloadHTMLPage = async (url) => {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data;
    return htmlContent;
  } catch (error) {
    err.message = "Failed to fetch data";
    err.statusCode = 400;
    next(err);
  }
};

/*
Since the html content was huge; I am trying to parse only the portion of the content.
For ex: here, I am only parsing and converting the element with div id "p-1.100(a)" into JSON.
This way it is also easy to visualize recursion that I am using in parseHtmlContentHelper.
If you want to parse the whole html file; simply replace the below id in line 25 to "title-2" 
which happens to be the first element of body
*/
const parseHtmlContent = (htmlContent) => {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const parentNode = document.getElementById("p-1.100(a)");
  return parseHtmlContentHelper(parentNode);
};

const parseHtmlContentHelper = (element) => {
  const json = {
    elementTag: element.tagName.toUpperCase(),
    children: [],
    textContent: "",
  };

  const childrenNodes = Array.from(element.childNodes);

  // If element has no child nodes, for loop does not execute (implicit base case for our recursion) and returns json.
  // Similar to (if !element.children) return json but this is redundant since for loop does not execute when no children

  for (const child of childrenNodes) {
    // If child is regular node than push it to children
    if (child.nodeType === 1) {
      json.children.push(parseHtmlContentHelper(child));
    }
    // If it is the actual text inside an element just add the textContent property
    else if (child.nodeType === 3 && child.textContent.trim()) {
      json.textContent = child.textContent.trim();
    }
  }

  return json;
};

const indexRouteController = async (req, res, next) => {
  try {
    console.log("Parsing HTML Content... Please wait...");
    const htmlContent = await downloadHTMLPage(
      "https://www.ecfr.gov/api/renderer/v1/content/enhanced/2024-03-01/title-2"
    );
    const finalJSON = parseHtmlContent(htmlContent);
    res.status(200).json(finalJSON);
  } catch (err) {
    err.message = "Failed to fetch data..Check URL";
    err.statusCode = 400;
    next(err);
  }
};

export { indexRouteController };
