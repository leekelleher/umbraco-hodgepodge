angular.module("umbraco").controller("Our.Umbraco.DataTypePicker.Controller", [
    "$scope",
    "dataTypeHelper",
    "dataTypeResource",
    "entityResource",
    "Our.Umbraco.HodgePodge.Resources",
    function ($scope, dataTypeHelper, dataTypeResource, entityResource, hodgePodgeResource) {

        const maxItems = 8;

        $scope.model.value = $scope.model.value || [];

        var vm = this;

        vm.selectedDataTypes = [];
        vm.allowAdd = $scope.model.value.length < maxItems;
        vm.allowRemove = true;
        vm.allowOpen = true;
        vm.allowEdit = true;
        vm.sortable = true;

        vm.sortableOptions = {
            axis: "y",
            containment: "parent",
            cursor: "move",
            opacity: 0.7,
            scroll: true,
            tolerance: "pointer",
            stop: function (e, ui) {

                var uids = vm.selectedDataTypes.map(function (item) {
                    return item.uid;
                });

                $scope.model.value.sort(function (a, b) {
                    return uids.indexOf(a.key) - uids.indexOf(b.key);
                });

                setDirty();
            }
        };

        vm.add = add;
        vm.edit = edit;
        vm.open = open;
        vm.remove = remove;

        if ($scope.model.value.length > 0) {
            var guids = $scope.model.value.map(function (item) {
                return item.dtd;
            });

            hodgePodgeResource.getDataTypesByKey(guids).then(function (dataTypes) {
                _.each($scope.model.value, function (item, index) {
                    var dataType = _.find(dataTypes, function (d) {
                        return d.key === item.dtd;
                    });
                    vm.selectedDataTypes.push(angular.extend({ uid: item.key }, dataType));
                });
            });
        }

        function add() {
            open(-1, {}); // might seem odd, but it's the intended behaviour
        };

        function edit(index, item) {
            dataTypeResource.getById(item.id).then(function (dataType) {

                vm.editorSettingsOverlay = {};
                vm.editorSettingsOverlay.title = "Editor settings";
                vm.editorSettingsOverlay.view = "views/common/overlays/contenttypeeditor/editorsettings/editorsettings.html";
                vm.editorSettingsOverlay.dataType = dataType;
                vm.editorSettingsOverlay.show = true;

                vm.editorSettingsOverlay.submit = function (model) {
                    var preValues = dataTypeHelper.createPreValueProps(model.dataType.preValues);
                    dataTypeResource.save(model.dataType, preValues, false).then(function (newDataType) {
                        vm.selectedDataTypes[index].name = newDataType.name;
                        vm.editorSettingsOverlay.show = false;
                        vm.editorSettingsOverlay = null;
                    });
                };

                vm.editorSettingsOverlay.close = function (oldModel) {
                    vm.editorSettingsOverlay.show = false;
                    vm.editorSettingsOverlay = null;
                };

            });
        };

        function open(index, item) {
            vm.editorPickerOverlay = {
                property: item,
                view: "views/common/overlays/contenttypeeditor/editorpicker/editorpicker.html",
                show: true
            };

            vm.editorPickerOverlay.submit = function (model) {
                setModelValue(model.property, index);

                vm.editorPickerOverlay.show = false;
                vm.editorPickerOverlay = null;
            };

            vm.editorPickerOverlay.close = function (model) {
                vm.editorPickerOverlay.show = false;
                vm.editorPickerOverlay = null;
            };
        };

        function remove(index) {
            $scope.model.value.splice(index, 1);
            vm.selectedDataTypes.splice(index, 1);

            vm.allowAdd = $scope.model.value.length < maxItems;

            setDirty();
        };

        function setModelValue(property, index) {
            entityResource.getById(property.dataTypeId, "DataType").then(function (entity) {

                var dataType = {
                    id: entity.id,
                    key: entity.key,
                    name: entity.name,
                    icon: property.dataTypeIcon,
                    description: property.editor
                };

                if (index === -1) {

                    dataType.uid = generateUid();

                    $scope.model.value.push({ key: dataType.uid, dtd: entity.key });
                    vm.selectedDataTypes.push(dataType);

                    vm.allowAdd = $scope.model.value.length < maxItems;

                } else {

                    dataType.uid = $scope.model.value[index].key;

                    $scope.model.value[index].dtd = entity.key;
                    vm.selectedDataTypes[index] = dataType;

                }
            });
        };

        function setDirty() {
            if ($scope.propertyForm) {
                $scope.propertyForm.$setDirty();
            }
        };

        var lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
        function generateUid() {
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
        };
    }
]);
