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
    }

    return {
        addItem: function () {
            
        }
    }

})();

var UIController = (function () {

    var domStrings = {
        'inputType': '.add__type',
        'inputDescription': '.add__description',
        'inputValue': '.add__value',
        'buttonAddItem': '.add__btn'
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
        }
    }

})();

var AppController = (function (budgetController, UIController) {

    var addItem = function () {
        var item = UIController.getInput();
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