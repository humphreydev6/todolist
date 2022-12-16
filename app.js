//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extented: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your Cogent TodoList! "
});

const item2 = new Item({
    name: "Hit the + button to aff a new item. "
});

const item3 = new Item({
    name: "<-- Hit this to delete an item. "
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to DB.");
                };
            });
            res.redirect("/")

        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });

        }



        //Item.find({}, function(err, foundItems) {
        //     res.render("list", { listTitle: "Today", newListItems: foundItems });
        //  });
    });



});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                //  create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // show an existing list

                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });

            }
        }
    });

});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();

        res.redirect("/");

    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    /*if (req.body.list === "work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");

    }*/


});

app.post("/delete", function(req, res) {
    const checkedItemId = (req.body.checkbox);
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
                console.log("Successfully deleted checked items.")
                res.redirect("/");

            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });

    }


});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res) {
    res.render("about");
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});