angular.module("umbraco").controller("Our.Umbraco.CheckboxList.Controller",
    function ($scope) {

        function setupViewModel() {
            $scope.selectedItems = [];

            //now we need to check if the value is null/undefined, if it is we need to set it to "" so that any value that is set
            // to "" gets selected by default
            if ($scope.model.value === null || $scope.model.value === undefined) {
                $scope.model.value = [];
            }

            for (var i = 0; i < $scope.model.prevalues.length; i++) {
                var isChecked = _.contains($scope.model.value, $scope.model.prevalues[i].value);
                $scope.selectedItems.push({
                    checked: isChecked,
                    label: $scope.model.prevalues[i].label,
                    value: $scope.model.prevalues[i].value
                });
            }
        }

        setupViewModel();

        //update the model when the items checked changes
        $scope.$watch("selectedItems", function (newVal, oldVal) {

            $scope.model.value = [];
            for (var x = 0; x < $scope.selectedItems.length; x++) {
                if ($scope.selectedItems[x].checked) {
                    $scope.model.value.push($scope.selectedItems[x].value);
                }
            }

        }, true);

        //here we declare a special method which will be called whenever the value has changed from the server
        //this is instead of doing a watch on the model.value = faster
        $scope.model.onValueChanged = function (newVal, oldVal) {
            //update the display val again if it has changed from the server
            setupViewModel();
        };

    });
