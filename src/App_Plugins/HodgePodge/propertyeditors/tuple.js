angular.module("umbraco").controller("Our.Umbraco.Tuple.Controller", [
    "$scope",
    "umbPropEditorHelper",
    "Our.Umbraco.HodgePodge.Resources",
    function ($scope, umbPropEditorHelper, hodgePodgeResource) {

        //console.log("init", $scope.model.config.dataTypes, $scope.model.value);

        // take a copy of the config data
        var config = JSON.parse(JSON.stringify($scope.model.config.dataTypes));

        if (!($scope.model.value instanceof Array)) {
            $scope.model.value = JSON.parse(JSON.stringify(config));
        }

        var vm = this;

        vm.controls = [];

        // TODO: Change this to flexbox (or something more, flexible)
        vm.className = "span5";

        if (config.length === 1) {
            vm.className = "span12";
        } else if (config.length === 2) {
            vm.className = "span6";
        } else if (config.length === 3) {
            vm.className = "span4";
        } else if (config.length === 4) {
            vm.className = "span3";
        } else if (config.length === 5 || config.length === 6) {
            vm.className = "span2";
        } else if (config.length === 7 || config.length === 8) {
            vm.className = "span1";
        }

        var dataTypeGuids = _.uniq(config.map(function (item) {
            return item.dtd;
        }));

        hodgePodgeResource.getPropertyTypeScaffoldsByKey(dataTypeGuids).then(function (scaffolds) {

            _.each(config, function (item, index) {

                var valueItem = _.find($scope.model.value, function (v) {
                    return v.key === item.key;
                });

                var propertyType = _.find(scaffolds, function (s) {
                    return s.dataTypeGuid === item.dtd;
                });

                // NOTE: Must be a copy of the config, not the same object reference.
                // Otherwise any config modifications made by the editor will apply to following editors.
                var propertyTypeConfig = JSON.parse(JSON.stringify(propertyType.config));
                var propertyTypeViewPath = umbPropEditorHelper.getViewPath(propertyType.view);

                vm.controls.push({
                    alias: $scope.model.alias + "_item" + index,
                    config: propertyTypeConfig,
                    key: item.key,
                    view: propertyTypeViewPath,
                    value: !!valueItem ? valueItem.value : null
                });
            });

        });

        function setDirty() {
            if ($scope.propertyForm) {
                $scope.propertyForm.$setDirty();
            }
        };

        var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {

            $scope.$broadcast("tupleFormSubmitting");

            var tmpValues = JSON.parse(JSON.stringify(config));

            _.each(vm.controls, function (control, index) {
                tmpValues[index].value = control.value;
            });

            $scope.model.value = tmpValues;
        });

        $scope.$on("$destroy", function () {
            unsubscribe();
        });
    }
]);

angular.module("umbraco.directives").directive("tuplePropertyEditor", [
    function () {

        var link = function ($scope, $element, $attrs, $ctrl) {

            var unsubscribe = $scope.$on("tupleFormSubmitting", function (ev, args) {
                $scope.$broadcast("formSubmitting", { scope: $scope });
            });

            $scope.$on("$destroy", function () {
                unsubscribe();
            });
        };

        return {
            require: "^form",
            restrict: "E",
            rep1ace: true,
            link: link,
            template: '<umb-property-editor model="control" />',
            scope: {
                control: "=model"
            }
        };
    }
]);