var BudgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {exp: [], inc: []},
        totals: {exp: 0, inc: 0}
    };

    function getNextID() {

        if (data.allItems.length > 0) {
            return data.allItems[type][data.allItems[type].length - 1].id + 1;
        }

        return 0;
    };

    return {
        addItem: function (type, description, value) {
            var newItem, id;

            id = getNextID();

            if (type === 'exp') {
                newItem = new Expense(id, description, value);
            } else if (type === 'inc') {
                newItem = new Income(id, description, value);
            }

            data.allItems[type].push(newItem);

            return newItem
        }
    }

})();

var UIController = (function () {

    var domStrings = {
        'inputType': '.add__type',
        'inputDescription': '.add__description',
        'inputValue': '.add__value',
        'buttonAddItem': '.add__btn',
        'incomeContainer': '.income__list',
        'expensesContainer': '.expenses__list'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            }
        },

        getDomStrings: function () {
            return domStrings;
        },

        addListItem: function (objectItem, type) {
            var htmlItem, newHtmlItem, element;

            if (type === 'inc') {
                element = domStrings.incomeContainer;
                htmlItem = '<div class="item clearfix" id="income-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            } else if (type === 'exp') {
                element = domStrings.expensesContainer;
                htmlItem = '<div class="item clearfix" id="expense-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            newHtmlItem = htmlItem.replace('%id%', objectItem.id);
            newHtmlItem = newHtmlItem.replace('%description%', objectItem.description);
            newHtmlItem = newHtmlItem.replace('%value%', objectItem.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtmlItem);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current) {
                current.value = "";
            });
            fieldsArray[0].focus();
        }
    }

})();

var AppController = (function (budgetController, UIController) {

    var addItem = function () {
        var item = UIController.getInput();
        newItem = budgetController.addItem(item.type, item.description, item.value);
        UIController.addListItem(newItem, item.type);
        UIController.clearFields();
    };

    var setUpEventListener = function () {
        var domStrings = UIController.getDomStrings();

        document.querySelector(domStrings.buttonAddItem).addEventListener('click', addItem);

        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                addItem();
            }
        });
    };

    return {
        init: function () {
            console.log("App has started");
            setUpEventListener();
        }
    }

})(BudgetController, UIController);

AppController.init();