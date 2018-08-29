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
        totals: {exp: 0, inc: 0},
        budget: 0,
        percentage: -1
    };

    function getNextID(type) {

        if (data.allItems[type].length > 0) {
            return data.allItems[type][data.allItems[type].length - 1].id + 1;
        }

        return 0;
    }

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function (type, description, value) {
            var newItem, id;

            id = getNextID(type);

            if (type === 'exp') {
                newItem = new Expense(id, description, value);
            } else if (type === 'inc') {
                newItem = new Income(id, description, value);
            }

            data.allItems[type].push(newItem);

            return newItem
        },

        deleteItem: function (type, id) {
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
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
        'expensesContainer': '.expenses__list',
        'budgetLabel': '.budget__value',
        'incomeLabel': '.budget__income--value',
        'expensesLabel': '.budget__expenses--value',
        'expensesPercentageLabel': '.budget__expenses--percentage',
        'container': '.container'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },

        getDomStrings: function () {
            return domStrings;
        },

        addListItem: function (objectItem, type) {
            var htmlItem, newHtmlItem, element;

            if (type === 'inc') {
                element = domStrings.incomeContainer;
                htmlItem = '<div class="item clearfix" id="inc-%id%">' +
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
                htmlItem = '<div class="item clearfix" id="exp-%id%">' +
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

        deleteListItem: function (selectorId) {
            document.getElementById(selectorId).remove();
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(domStrings.expensesPercentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.expensesPercentageLabel).textContent = '---';
            }
        }
    }

})();

var AppController = (function (budgetController, UIController) {

    var updateBudget = function () {
        budgetController.calculateBudget();
        var budget = budgetController.getBudget();
        UIController.displayBudget(budget);
    };

    var addItem = function () {
        var item = UIController.getInput();

        if (item.description !== "" && !isNaN(item.value) && item.value > 0) {
            newItem = budgetController.addItem(item.type, item.description, item.value);
            UIController.addListItem(newItem, item.type);
            UIController.clearFields();
            updateBudget();
        }
    };

    var deleteItem = function (event) {
        var itemElemetId, splitID, type, id;
        itemElemetId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemElemetId) {
            splitID = itemElemetId.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            budgetController.deleteItem(type, id);
            UIController.deleteListItem(itemElemetId);
            updateBudget();
        }
    };

    var setUpEventListener = function () {
        var domStrings = UIController.getDomStrings();

        document.querySelector(domStrings.buttonAddItem).addEventListener('click', addItem);

        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                addItem();
            }
        });

        document.querySelector(domStrings.container).addEventListener('click', deleteItem)
    };

    return {
        init: function () {
            console.log("App has started");
            UIController.displayBudget({budget: 0, percentage: -1, totalInc: 0, totalExp: 0});
            setUpEventListener();
        }
    }

})(BudgetController, UIController);

AppController.init();