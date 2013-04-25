
/**
 * @class ConditionsManager
 */
var ConditionsManager = (function(require){





    // helper method
    var makeImplicit = function(level) {

        var i=0,l=level.length;

        for (;i<l;i++) {

            if (l>3) {

                // binary expression found merge into new level
                level.splice(i,3,level.slice(i,i+3));

                // set new length
                l = level.length;

                // move back to start
                i=-1;

            }
            else if (typeof level[i] !== 'string') {

                // level okay, check lower level
                makeImplicit(level[i]);

            }

        }

    };

    // helper method
    var parseCondition = function(condition) {

        var i=0,
            c,
            k,
            n,
            operator,
            path = '',
            tree = [],
            value = '',
            isValue = false,
            target = null,
            flattened = null,
            parent = null,
            parents = [],
            l=condition.length;


        if (!target) {
            target = tree;
        }

        // read explicit expressions
        for (;i<l;i++) {

            c = condition.charAt(i);

            // check if an expression
            if (c === '{') {

                // now reading the expression
                isValue = true;

                // reset name var
                path = '';

                // fetch name
                k = i-2;
                while(k>=0) {
                    n = condition.charAt(k);
                    if (n === ' ' || n === '(') {
                        break;
                    }
                    path = n + path;
                    k--;
                }

                // on to the next character
                continue;

            }
            else if (c === '}') {

                // add value and
                target.push({'path':path,'value':value});

                // reset vars
                path = '';
                value = '';

                // no longer a value
                isValue = false;

                // on to the next character
                continue;
            }

            // if we are reading an expression add characters to expression
            if (isValue) {
                value += c;
                continue;
            }

            // if not in expression
            if (c === ' ') {

                // get operator
                operator = condition.substr(i,4).match(/and|or/g);

                // if operator found
                if (operator) {

                    // add operator
                    target.push(operator[0]);

                    // skip over operator
                    i+=operator[0].length+1;
                }

                continue;
            }

            // check if goes up a level
            if (c === '(') {

                // create new empty array in target
                target.push([]);

                // remember current target (is parent)
                parents.push(target);

                // set new child slot as new target
                target = target[target.length-1];

            }
            else if (c === ')' || i === l-1) {

                // reset flattened data
                flattened = null;

                // get parent
                parent = parents.pop();

                // if only contains single element flatten array
                if (target.length === 1 || (parent && parent.length===1 && i===l-1)) {
                    flattened = target.concat();
                }

                // restore parent
                target = parent;

                // if data defined
                if (flattened && target) {

                    target.pop();

                    for (k=0;k<flattened.length;k++) {
                        target.push(flattened[k]);
                    }

                }

            }
        }

        // derive implicit expressions
        makeImplicit(tree);

        // return final expression tree
        return tree.length === 1 ? tree[0] : tree;
    };


    // ExpressionBase
    var ExpressionBase = {
        succeeds:function() {
            // override in subclass
        }
    };


    // UnaryExpression
    var UnaryExpression = function(test) {
        this._test = test;
    };
    UnaryExpression.prototype = Object.create(ExpressionBase);
    UnaryExpression.prototype.setTest = function(test) {
        this._test = test;
    };
    UnaryExpression.prototype.succeeds = function() {
        return this._test.succeeds();
    };


    //BinaryExpression
    var BinaryExpression = function(a,o,b) {
        this._a = a;
        this._o = o;
        this._b = b;
    };
    BinaryExpression.prototype = Object.create(ExpressionBase);
    BinaryExpression.prototype.succeeds = function() {

        return this._o==='and' ?

        // is 'and' operator
        this._a.succeeds() && this._b.succeeds() :

        // is 'or' operator
        this._a.succeeds() || this._b.succeeds();

    };




    /**
     * @constructor
     * @param {string} conditions - conditions to be met
     * @param {Element} [element] - optional element to measure these conditions on
     */
    var ConditionsManager = function(conditions,element) {

        // if the conditions are suitable, by default they are
        this._suitable = true;

        // if no conditions, conditions will always be suitable
        if (typeof conditions !== 'string') {
            return;
        }

        // conditions supplied, conditions are now unsuitable by default
        this._suitable = false;

        // set element reference
        this._element = element;

        // load tests
        this._tests = [];

        // change event bind
        this._onResultsChangedBind = this._onTestResultsChanged.bind(this);

        // read test count
        this._count = conditions.match(/(\:\{)/g).length;

        // derive plain expression
        var expression = parseCondition(conditions);

        // load to expression tree
        this._expression = this._loadExpression(expression);

    };



    // prototype shortcut
    ConditionsManager.prototype = {

        /**
         * Returns true if the current conditions are suitable
         * @method getSuitability
         */
        getSuitability:function() {
            return this._suitable;
        },


        /**
         * Loads expression
         * @method _loadExpression
         */
        _loadExpression:function(expression) {

            // if expression is array
            if (expression.length === 3) {

                // is binary expression, create test
                return new BinaryExpression(
                    this._loadExpression(expression[0]),
                    expression[1],
                    this._loadExpression(expression[2])
                );

            }
            else {
                return this._createUnaryExpressionFromTest(expression);
            }

        },


        /**
         * Called to create a unary expression
         * @method _createUnaryExpressionFromTest
         * @param {Object} test
         * @return {UnaryExpression}
         */
        _createUnaryExpressionFromTest:function(test) {

            var unaryExpression = new UnaryExpression(null);
            var instance = null;
            var self = this;

            require(['tests/' + test.path],function(Test){

                // create test instance
                instance = new Test(test.value,self._element);

                // add instance to test set
                self._tests.push(instance);

                // set test to unary expression
                unaryExpression.setTest(instance);

                // lower test count
                self._count--;
                if (self._count===0) {
                    self._onReady();
                }
            });

            return unaryExpression;
        },


        /**
         * Called when all tests are ready
         * @method _onReady
         */
        _onReady:function() {

            // setup
            var l = this._tests.length,test,i;
            for (i=0;i<l;i++) {

                test = this._tests[i];

                // arrange test
                test.arrange();

                // execute test
                test.assert();

                // listen to changes
                Observer.subscribe(test,'change',this._onResultsChangedBind);
            }

            // test current state
            this.test();

            // we are now ready to start testing
            Observer.publish(this,'ready',this._suitable);

        },


        /**
         * Called when a condition has changed
         * @method _onConditionsChanged
         */
        _onTestResultsChanged:function() {
            this.test();
        },


        /**
         * Tests if conditions are suitable
         * @method test
         */
        test:function() {

            // test expression success state
            var suitable = this._expression.succeeds();

            // fire changed event if environment suitability changed
            if (suitable != this._suitable) {
                this._suitable = suitable;
                Observer.publish(this,'change');
            }

        }

    };

    return ConditionsManager;

}(require));
