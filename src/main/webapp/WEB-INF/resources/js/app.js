var app = angular.module('ngApp', []);

app.controller('ngCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.products = [];
    $scope.promotions = [];
    $scope.customers = [];
    $scope.types = {
        "WED": "សំបុត្រការ",
        "CER": "សំបុត្របុណ្យ",
        "DES": "សំបុត្រច្នៃ",
        "HOM": "សំបុត្រទ្បើងផ្ទះ",
        "INV": "វិក័យប័ត្រ",
        "HBD": "សំបុត្រខួបកំណើត"
    };

    $scope.pageSizes = [10, 20, 30, 40, 50, 100];
    $scope.perPage = {
        pageSizes: 10
    };

    $scope.currentPage = 1;
    $scope.itemPerPage = 10;
    $scope.countPage = 0;

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.fetchProduct = function () {
        spinner.appendTo("body");
        $http({
            method: 'POST',
            url: baseUrl + '/products/fetch' + '?offset=' + $scope.currentPage + '&limit=' + $scope.itemPerPage,
        }).then(function (response) {
            console.log(" fetch product response : ", response.data);
            $scope.products = response.data["DATA"];
            $scope.countPage = Math.ceil(response.data.MAP.COUNT / $scope.itemPerPage);
            console.log($scope.countPage);
            spinner.remove();
        }, function (response) {
            console.log(response);
            spinner.remove();
            swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
        });
    };

    $scope.fetchPromotion = function () {
        spinner.appendTo("body");
        $http({
            method: 'POST',
            url: baseUrl + '/promotion/fetch' + '?offset=' + $scope.currentPage + '&limit=' + $scope.itemPerPage,
        }).then(function (response) {
            console.log(response.data);
            $scope.promotions = response.data["DATA"];
            $scope.countPage = Math.ceil(response.data.MAP.COUNT / $scope.itemPerPage);
            spinner.remove();
        }, function (response) {
            console.log(response);
            spinner.remove();
            swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
        });
    };

    $scope.fetchCustomer = function () {
        spinner.appendTo("body");
        $http({
            method: 'POST',
            url: baseUrl + '/customer/fetch',
        }).then(function (response) {
            console.log(response.data["DATA"]);
            $scope.customers = response.data["DATA"];
            spinner.remove();
        }, function (response) {
            console.log(response);
            spinner.remove();
            swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
        });
    };

    $scope.fetchAdvertisement = function () {
        spinner.appendTo("body");
        $http({
            method: 'POST',
            url: baseUrl + '/advertisement/fetch',
        }).then(function (response) {
            console.log(response.data["DATA"]);
            advertisements = response.data["DATA"];
            for (var i = 0; i < advertisements.length; i++) {
                var ad = advertisements[i];
                var span = $("<span class='close' id='" + ad.ID + "' name='" + ad.IMAGE + "'>&times;</span>");
                var img = $("<img name='" + ad.IMAGE + "' class='img-thumbnail' src='" + imageUrl + "/view/" + ad.IMAGE + "' title='" + ad.IMAGE + "' style='height:100px;cursor: pointer;'/>");
                var wrap = $("<div class='img-wrap'></div>");
                span.appendTo(wrap);
                img.appendTo(wrap);
                wrap.appendTo($("#grid"));
                var div = $("<div><a id='" + ad.IMAGE + "' href='" + imageUrl + "/view/" + ad.IMAGE + "'></a></div>");
                div.appendTo($('.gallery'));
                $.fn.imageOnClick(div);
                img.click(function () {
                    $("#" + $(this).attr("name")).click();
                    return false;
                });
                $.fn.spanOnClose(span);
            }
            $('.container').attr('id', "AD");
            $('.gallery').attr('id', "AD");
            spinner.remove();
        }, function (response) {
            console.log(response);
            spinner.remove();
            swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
        });
    };

    $scope.submitProduct = function () {
        var formData = new FormData();
        $scope.txtColor = selectedColors.toString();
        console.log($scope.txtColor);
        var model = {
            "ID": $scope.txtId,
            "CODE": $scope.txtCode,
            "SIZE": $scope.txtSize,
            "PRICE": $scope.txtPrice,
            "COLOR": $scope.txtColor,
            "TYPE": $scope.selectType,
            "CONTACT": {
                "EMAIL": $scope.txtEmail,
                "FACEBOOK": $scope.txtFacebook,
                "PHONE1": $scope.txtPhone1,
                "PHONE2": $scope.txtPhone2
            },
        };

        //part value 'json'-> json data
        formData.append('json', JSON.stringify(model));
        for (var i = 0; i < arrayFile.length; i++) {
            formData.append("files", arrayFile[i], arrayFile[i].name);
        }

        console.log("JSON DATA ===>>> " + formData.get("json"));
        console.log("FILES ===>>> " + formData.get("files"));

        if (isValid()) {
            spinner.appendTo("body");
            $http({
                method: 'POST',
                url: baseUrl + '/product/submit',
                data: formData,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (response) {// success
                    console.log(response);
                    $scope.fetchProduct();
                    $scope.reset();
                    spinner.remove();
                    alertify.log("Submit product successful.", "success", 2000);
                },
                function (response) {// failed
                    console.log(response);
                    spinner.remove();
                    swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
                });
        } else {
            swal({
                title: 'Mandatory Fields!',
                text: 'Please fill in mandatory fields',
                type: 'warning'
            }).catch(swal.noop);
            console.log("====>>>> Can not submit there are invalid field or required");
        }
    };

    $scope.submitPromotion = function () {
        var formData = new FormData();
        var model = {
            "ID": $scope.txtId,
            "CODE": $scope.txtCode,
            "DESC": $scope.txtDesc
        };
        formData.append('json', JSON.stringify(model));
        for (var i = 0; i < arrayFile.length; i++) {
            formData.append("files", arrayFile[i], arrayFile[i].name);
        }
        console.log("JSON DATA ===>>> " + formData.get("json"));
        console.log("FILES ===>>> " + formData.get("files"));
        if (arrayFile.length > 0 || $scope.txtId != null) {
            spinner.appendTo("body");
            $http({
                method: 'POST',
                url: baseUrl + '/promotion/submit',
                data: formData,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (response) {// success
                    console.log(response);
                    $scope.fetchPromotion();
                    $scope.reset();
                    spinner.remove();
                    alertify.log("Submit promotion successful.", "success", 2000);
                },
                function (response) {// failed
                    console.log(response);
                    spinner.remove();
                    swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
                });
        } else {
            swal({
                title: 'Warning!',
                text: 'Please choose image to upload',
                type: 'warning'
            }).catch(swal.noop);
            ;
            console.log("====>>>> Can not submit there are invalid field or required");
        }
    };

    $scope.submitAdvertisement = function () {
        var formData = new FormData();
        for (var i = 0; i < arrayFile.length; i++) {
            formData.append("files", arrayFile[i], arrayFile[i].name);
        }
        console.log("FILES ===>>> " + formData.get("files"));
        if (arrayFile.length > 0) {
            spinner.appendTo("body");
            $http({
                method: 'POST',
                url: baseUrl + '/advertisement/submit',
                data: formData,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function (response) {// success
                    console.log(response);
                    var ads = response.data["DATA"];
                    for (var i = 0; i < ads.length; i++) {
                        var ad = ads[i];
                        advertisements.push(ad);
                        var span = $("<span class='close' id='" + ad.ID + "' name='" + ad.IMAGE + "'>&times;</span>");
                        var img = $("<img name='" + ad.IMAGE + "' class='img-thumbnail' src='" + imageUrl + "/view/" + ad.IMAGE + "' title='" + ad.IMAGE + "' style='height:100px;cursor: pointer;'/>");
                        var wrap = $("<div class='img-wrap'></div>");
                        span.appendTo(wrap);
                        img.appendTo(wrap);
                        wrap.appendTo($('#grid'));
                        //$("#grid").prepend(div);
                        var div = $("<div><a id='" + ad.IMAGE + "' href='" + imageUrl + "/view/" + ad.IMAGE + "'></a></div>");
                        div.appendTo($('.gallery'));
                        $.fn.imageOnClick(div);
                        img.click(function () {
                            $("#" + $(this).attr("name")).click();
                            return false;
                        });
                        $.fn.spanOnClose(span);
                    }
                    $scope.reset();
                    spinner.remove();
                    alertify.log("Submit advertisement successful.", "success", 2000);
                },
                function (response) {// failed
                    console.log(response);
                    spinner.remove();
                    swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
                });
        } else {
            swal({
                title: 'Warning!',
                text: 'Please choose image to upload',
                type: 'warning'
            }).catch(swal.noop);
            console.log("====>>>> Can not submit there are invalid field or required");
        }
    };

    $.fn.spanOnClose = function (span) {
        span.click(function () {
            for (var j = 0; j < advertisements.length; j++) {
                if ($(this).attr("id") == advertisements[j].ID) {
                    $scope.deleteEntity($(this).attr("id"), j, $(this));
                    break;
                }
            }
        });
    };

    $scope.editProduct = function (product) {
        $scope.txtId = product.ID;
        $scope.txtCode = product.CODE;
        $scope.txtSize = product.SIZE;
        $scope.txtPrice = product.PRICE;
        $scope.txtColor = product.COLOR;
        $scope.selectType = product.TYPE;
        $scope.txtPhone1 = product.CONTACT.PHONE1;
        $scope.txtPhone2 = product.CONTACT.PHONE2;
        $scope.txtEmail = product.CONTACT.EMAIL;
        $scope.txtFacebook = product.CONTACT.FACEBOOK;

        if (product.COLOR != null) {
            selectedColors = product.COLOR.split(",");
            editProduct(selectedColors);
        }

        $("html, body").animate({scrollTop: 0}, 600);

    }

    $scope.editPromotion = function (promotion) {
        $scope.txtId = promotion.ID;
        $scope.txtCode = promotion.CODE;
        $scope.txtDesc = promotion.DESC;
        $("html, body").animate({scrollTop: 0}, 600);
    };

    $scope.deleteEntity = function (id, index, val) {
        var msg = "";
        var type;
        if (typeof val === 'string' || val instanceof String) {
            type = val;
        } else {
            type = 'AD';
        }
        var func = function () {
            if (id != null && index > -1 && type != null) {
                spinner.appendTo("body");
                $http({
                    method: 'GET',
                    url: baseUrl + '/entity/delete?id=' + id + '&type=' + type,
                }).then(function (response) {// success
                        console.log(response);
                        if (type == "PRO") {
                            $scope.products.splice(index, 1);
                            msg = "Your product has been deleted."
                            $.get(baseUrl + "/item_deleted?id=" + id + "&type=PRODUCT");
                        }
                        else if (type == "POM") {
                            $scope.promotions.splice(index, 1);
                            msg = "Your promotion has been deleted."
                        }
                        else if (type == "CUS") {
                            $scope.customers.splice(index, 1);
                            msg = "Your customer has been deleted."
                        } else {
                            advertisements.splice(index, 1);
                            $("#" + val.attr("name")).parent("div").remove();
                            val.parent(".img-wrap").remove();
                            msg = "Your advertisement has been deleted."
                            $.get(baseUrl + "/item_deleted?id=" + id + "&type=ADVERTISEMENT");
                        }
                        alertify.log(msg, "success", 2000);
                        spinner.remove();
                    },
                    function (response) {// failed
                        console.log(response);
                        spinner.remove();
                        swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
                    });
            }
        }
        $.fn.confirmDelete(func);
    };

    $scope.viewImage = function (imgs, id, type) {
        console.log("array images id:" + imgs);
        console.log("entity id:" + id);
        console.log("entity type:" + type);
        var key = id + "-" + type;
        $('.container').attr('id', type);
        $('.gallery').attr('id', key);
        for (var i = 0; i < imgs.length; i++) {
            $("<div><a id='" + imgs[i] + "' href='" + imageUrl + "/view/" + imgs[i] + "'></a></div>").appendTo($('.gallery'));
        }
        if (imgs.length > 0) {
            $.getScript('./resources/js/zoom.min.js', function () {
                $(".gallery a")[0].click();
                images = imgs;
            });
        } else {
            swal('Oops...', 'No image available on the server!', 'info').catch(swal.noop).catch(swal.noop);
        }
    };

    $scope.viewCustomer = function (customer) {
        $("#mName").text("ឈ្មោះ: " + customer.GROOM_NAME);
        $("#mFatName").text("ឈ្មោះ​ឪពុក: " + customer.GROOM_DAD_NAME);
        $("#mMomName").text("ឈ្មោះម្តាយ: " + customer.GROOM_MOM_NAME);
        $("#fName").text("ឈ្មោះ: " + customer.BRIDE_NAME);
        $("#fFatName").text("ឈ្មោះ​ឪពុក " + customer.BRIDE_DAD_NAME);
        $("#fMomName").text("ឈ្មោះម្តាយ: " + customer.BRIDE_MOM_NAME);
        $("#home").text("នៅគេហដ្ឋានខាង : " + customer.HOME);
        $("#time").text("នៅវេលាម៉ោង : " + customer.TIME);
        $("#date").text("កាលបរិច្ឆេទ: " + customer.DATE);
        $("#kh-date").text("កាលបរិច្ឆេទ: " + customer.KH_DATE);
        $("#address").text("អាស័យដ្ឋាន: " + customer.ADDRESS);
        $("#tel").text("លេខទូរសព្វ: " + customer.PHONE);
        $("#email").text("សាអេឡិចត្រូនិច: " + customer.EMAIL);
        $("#fb").text("ហ្វេសប៊ុក: " + customer.FACEBOOK);
        $("#map").attr({"href": customer.MAP, "target": "_blank"});
        $("#other").text("ផ្សេង‌ៗ: " + customer.OTHER);
    };

    $scope.reset = function () {
        $scope.txtId = "";
        $scope.txtCode = "";
        $scope.txtSize = "";
        $scope.txtPrice = "";
        $scope.txtColor = "";
        $scope.txtPhone1 = "";
        $scope.txtPhone2 = "";
        $scope.selectType = "";
        $scope.txtEmail = "";
        $scope.txtFacebook = "";
        $scope.txtDesc = "";
        $("#files").val("");
        $("#preview").empty();
        while (arrayFile.length > 0) {
            arrayFile.pop();
        }
        while (selectedColors.length > 0) {
            selectedColors.pop();
            onTagsChange();
        }
    };

    function isValid() {
        return !$scope.txtCode == "" && !$scope.txtSize == ""
            && !$scope.txtColor == "" && !$scope.txtPrice == ""
            && !$scope.selectType == "" && !$scope.txtPhone1 == "";
    }

    $scope.onChangeSize = function () {
        $scope.fetchProduct();
    };

    $scope.prevPage = function () {
        if ($scope.currentPage - 1 >= 1) {
            $scope.currentPage -= 1;
            $scope.fetchProduct();
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage + 1 <= $scope.countPage) {
            $scope.currentPage += 1;
            $scope.fetchProduct();
        }
    };

    // page for promotion
    $scope.onChangeSizePromotion = function () {
        $scope.fetchPromotion();
    };
    $scope.backPromotion = function () {
        if ($scope.currentPage - 1 >= 1) {
            $scope.currentPage -= 1;
            $scope.fetchPromotion();
        }
    };

    $scope.getColors = function (colors) {
        var str = "";
        if (colors.includes("#"))
            str = colors.split(",");
        return str;

    };

    $scope.nexPromotion = function () {
        if ($scope.currentPage + 1 <= $scope.countPage) {
            $scope.currentPage += 1;
            $scope.fetchPromotion();
        }
    };

    $scope.updateStatusCustomer = function (ID) {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to get it back!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay'
        }).then(function () {
            spinner.appendTo("body");
            $http({
                method: 'PUT',
                url: baseUrl + '/customer/status/' + ID,
            }).then(function (response) {  // success
                    console.log(response);
                    $scope.fetchCustomer();
                    spinner.remove();
                    alertify.log("Customer has been removed successful.", "success", 200);
                },
                function (response) {  // failed
                    console.log(response);
                    spinner.remove();
                    swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
                });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                $('#' + ID).prop('checked', true);
            }
        }).catch(swal.noop);
    };

    $scope.onchangeType = function () {
        if ($scope.productType != null) {
            $scope.fetchProductType();
        }
    };

    $scope.fetchProductType = function () {
        spinner.appendTo("body");
        $http({
            method: 'POST',
            url: baseUrl + '/products/fetch/type' + '?type=' + $scope.productType + '&offset=' + $scope.currentPage + '&limit=' + $scope.itemPerPage,
        }).then(function (response) {
            console.log(" fetch product response : ", response.data);
            $scope.products = response.data["DATA"];
            $scope.countPage = Math.ceil(response.data.MAP.COUNT / $scope.itemPerPage);
            console.log($scope.countPage);
            spinner.remove();
        }, function (response) {
            console.log(response);
            spinner.remove();
            swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
        });
    };

    // ENTITY CUSTOMER

    $scope.fetchEntity = function (type) {
        spinner.appendTo("body");
        $http({
            method: 'POST',
            url: baseUrl + '/entities/fetch' + '?type='+ type,
        }).then(function (response) {
            console.log(response);
            $scope.customers = response.data["DATA"];
            spinner.remove();
        }, function (response) {
            console.log(response);
            spinner.remove();
            swal('Oops...', 'Something went wrong please contact to developer!', 'error').catch(swal.noop);
        });
    };

    $scope.viewInvoice = function (customer) {
        $("#cusName").text("ឈ្មោះអតិថិជន: " + customer.ENTITIES.CUSTOMER_NAME);
        $("#comName").text("ឈ្មោះក្រុមហ៊ុន: " + customer.ENTITIES.COMPANY_NAME);
        $("#caddress").text("អាស័យដ្ឋាន: " + customer.ENTITIES.ADDRESS);
        $("#iNDate").text("កាលបរិច្ឆេទ: " + customer.ENTITIES.TIME);
        $("#tel").text("លេខទូរសព្វ: " + customer.ENTITIES.PHONE);
        $("#email").text("សាអេឡិចត្រូនិច: " + customer.ENTITIES.EMAIL);
        $("#fb").text("ហ្វេសប៊ុក: " + customer.ENTITIES.FACEBOOK);
        $("#other").text("ផ្សេង‌ៗ: " + customer.ENTITIES.OTHER);

    };

    $scope.viewBirthday = function (customer) {
        $("#birthName").text("ឈ្មោះម្ចាស់ខួប: " + customer.ENTITIES.CUSTOMER_NAME);
        $("#parentName").text("ឈ្មោះអាណាព្យាបាល: " + customer.ENTITIES.COMPANY_NAME);
        $("#birthAddress").text("អាស័យដ្ឋាន: " + customer.ENTITIES.ADDRESS);
        $("#birthDate").text("កាលបរិច្ឆេទ: " + customer.ENTITIES.TIME);
        $("#birthTel").text("លេខទូរសព្វ: " + customer.ENTITIES.PHONE);
        $("#birthEmail").text("សាអេឡិចត្រូនិច: " + customer.ENTITIES.EMAIL);
        $("#birthFb").text("ហ្វេសប៊ុក: " + customer.ENTITIES.FACEBOOK);
        $("#birthOther").text("ផ្សេង‌ៗ: " + customer.ENTITIES.OTHER);

    };
  $scope.viewCeremony = function (customer) {
        $("#bName").text("កម្មវិធីបុណ្យ: " + customer.ENTITIES.CUSTOMER_NAME);
        $("#gName").text("ឈ្មោះអ្នកស្លាប់  : " + customer.ENTITIES.COMPANY_NAME);
        $("#cerMaker").text("ឈ្មោះអ្នកផ្តើមបុណ្យ : " + customer.ENTITIES.COMPANY_NAME);
        $("#cerAddress").text("អាស័យដ្ឋាន: " + customer.ENTITIES.ADDRESS);
        $("#cerDate").text("កាលបរិច្ឆេទ: " + customer.ENTITIES.TIME);
        $("#certel").text("លេខទូរសព្វ: " + customer.ENTITIES.PHONE);
        $("#eremail").text("សាអេឡិចត្រូនិច: " + customer.ENTITIES.EMAIL);
        $("#erfb").text("ហ្វេសប៊ុក: " + customer.ENTITIES.FACEBOOK);
        $("#cerother").text("ផ្សេង‌ៗ: " + customer.ENTITIES.OTHER);

    };

  $scope.warmingHouse = function (customer) {
        $("#hownerName").text("ឈ្មោះម្ចាស់ផ្ទះ: " + customer.ENTITIES.CUSTOMER_NAME);
        $("#husband").text("ប្តី : " + customer.ENTITIES.COMPANY_NAME);
        $("#wife").text("ប្រពន្ធ : " + customer.ENTITIES.COMPANY_NAME);
        $("#hAddress").text("អាស័យដ្ឋាន: " + customer.ENTITIES.ADDRESS);
        $("#hDate").text("កាលបរិច្ឆេទ: " + customer.ENTITIES.TIME);
        $("#htel").text("លេខទូរសព្វ: " + customer.ENTITIES.PHONE);
        $("#hemail").text("សាអេឡិចត្រូនិច: " + customer.ENTITIES.EMAIL);
        $("#hfb").text("ហ្វេសប៊ុក: " + customer.ENTITIES.FACEBOOK);
        $("#hother").text("ផ្សេង‌ៗ: " + customer.ENTITIES.OTHER);

    };

}]);