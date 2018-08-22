angular.module("umbraco").controller("Our.Umbraco.NamedDropdown.Controller",
    function ($scope) {

        //setup the default config
        var config = {
            items: [],
        };

        //map the user config
        angular.extend(config, $scope.model.config);

        //map back to the model
        $scope.model.config = config;

        //now we need to check if the value is null/undefined, if it is we need to set it to "" so that any value that is set
        // to "" gets selected by default
        if ($scope.model.value === null || $scope.model.value === undefined) {
            $scope.model.value = "";
        }

    });
