const http = require("http");
const fs = require("fs");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    const cardsHtml = dataObj
      .map((product) => replaceTemplate(tempCard, product))
      .join("");
    const overviewHtml = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(overviewHtml);
  } else if (pathName === "/product") {
    res.end("This is the product");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
