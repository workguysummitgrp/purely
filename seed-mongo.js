function convertIds(arr) {
  return arr.map(doc => {
    if (doc._id && doc._id['$oid']) doc._id = ObjectId(doc._id['$oid']);
    for (let k in doc) {
      if (doc[k] && typeof doc[k] === 'object') {
        if (doc[k]['$oid']) doc[k] = ObjectId(doc[k]['$oid']);
        if (doc[k]['$date']) doc[k] = new Date(doc[k]['$date']);
      }
    }
    return doc;
  });
}

const catData = convertIds(JSON.parse(fs.readFileSync('sample-data/purely_category_service.categories.json', 'utf8')));
db = db.getSiblingDB('purely_category_service');
db.categories.drop();
db.categories.insertMany(catData);
print('Categories imported: ' + db.categories.countDocuments());

const prodData = convertIds(JSON.parse(fs.readFileSync('sample-data/purely_product_service.products.json', 'utf8')));
db = db.getSiblingDB('purely_product_service');
db.products.drop();
db.products.insertMany(prodData);
print('Products imported: ' + db.products.countDocuments());
