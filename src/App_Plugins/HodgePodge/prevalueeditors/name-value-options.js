angular.module("umbraco").controller("Our.Umbraco.NameValueOptions.Controller",
    function ($scope) {

        //NOTE: We need to make each item an object, not just a string because you cannot 2-way bind to a primitive.

        $scope.newItem = {
            key: "",
            value: ""
        };
        $scope.hasError = false;

        if (!angular.isArray($scope.model.value)) {
            //make an array from the dictionary
            var items = [];
            for (var i in $scope.model.value) {
                items.push({
                    value: $scope.model.value[i],
                    key: i
                });
            }
            //now make the editor model the array
            $scope.model.value = items;
        }


        $scope.remove = function (item, evt) {

            evt.preventDefault();

            $scope.model.value = _.reject($scope.model.value, function (x) {
                return x.key === item.key && x.value === item.value;
            });

        };

        $scope.add = function (evt) {

            evt.preventDefault();

            if ($scope.newItem.key && $scope.newItem.value) {
                if (!_.contains($scope.model.value, function (x) {
                    return x.value === item.value;
                })) {
                    $scope.model.value.push({
                        key: $scope.newItem.key,
                        value: $scope.newItem.value
                    });
                    $scope.newItem = {
                        key: "",
                        value: ""
                    };
                    $scope.hasError = false;
                    return;
                }
            }

            //there was an error, do the highlight (will be set back by the directive)
            $scope.hasError = true;
        };

    });
