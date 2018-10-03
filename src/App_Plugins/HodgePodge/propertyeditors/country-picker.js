angular.module("umbraco").controller("Our.Umbraco.CountryPicker.Controller", [
    "$scope",
    function ($scope) {

        $scope.model.value = $scope.model.value || [];

        var vm = this;

        vm.allowAdd = true;
        vm.allowRemove = true;

        vm.overlayConfig = {
            selection: $scope.model.value,
            show: false,
            title: "Select countries",
            view: Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + "/HodgePodge/propertyeditors/country-picker.overlay.html",
            submit: function (model) {
                vm.overlayConfig.show = false;
                //console.info("overlayConfig.submit", model, $scope.model.value);
            },
            close: function (oldModel) {
                if (oldModel.selection) {
                    $scope.model.value = oldModel.selection;
                }
                vm.overlayConfig.show = false;
                //console.info("overlayConfig.close", oldModel, $scope.model.value);
            }
        };

        vm.add = add;
        vm.remove = remove;

        function add() {
            //console.info("add", vm.overlayConfig);
            vm.overlayConfig.show = true;
        };

        function remove($index) {
            //console.info("remove", $index);
            $scope.model.value.splice($index, 1);
            setDirty();
        };

        function setDirty() {
            if ($scope.propertyForm) {
                $scope.propertyForm.$setDirty();
            }
        };
    }
]);

angular.module("umbraco").controller("Our.Umbraco.CountryPicker.Overlay.Controller", [
    "$scope",
    "Our.Umbraco.CountryPicker.Resources",
    function ($scope, countryPickerResources) {

        var vm = this;
        vm.countries = [];
        vm.loading = false;
        vm.select = select;

        function select(country) {
            //console.info("select", country, $scope.model.selection);
            if (country.selected === false) {
                country.selected = true;
                $scope.model.selection.push(country);
            } else {
                angular.forEach($scope.model.selection, function (selected, idx) {
                    if (selected.iso === country.iso) {
                        country.selected = false;
                        $scope.model.selection.splice(idx, 1);
                    }
                });
            }
        };

        function initialize() {
            vm.loading = true;

            if (!$scope.model.selection) {
                $scope.model.selection = [];
            }

            // Get the countries
            countryPickerResources.getCountries().then(function (data) {

                vm.countries = data;

                if ($scope.model.selection && $scope.model.selection.length > 0) {
                    angular.forEach($scope.model.selection, function (selected) {
                        angular.forEach(vm.countries, function (country) {
                            if (selected.iso === country.iso) {
                                country.selected = true;
                            }
                        });
                    });
                }

                vm.loading = false;
            });
        };

        initialize();

    }
]);

angular.module("umbraco.filters").filter("umcoGetCountryNames", function () {
    return function (input) {
        return _.pluck(input, "name").join(", ");
    };
});

angular.module("umbraco.resources").factory("Our.Umbraco.CountryPicker.Resources", [
    "$http",
    "umbRequestHelper",
    function ($http, umbRequestHelper) {
        return {
            getCountries: function () {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: umbRequestHelper.convertVirtualToAbsolutePath("~/umbraco/backoffice/CountryPicker/CountryPickerApi/GetCountries"),
                        method: "GET"
                    }),
                    "Failed to retrieve countries"
                );
            }
        };
    }
]);