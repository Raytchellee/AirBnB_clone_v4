$("document").ready(function () {
  $.get("http://0.0.0.0:5001/api/v1/status/", function (res) {
    if (res.status === "OK") {
      $("div#api_status").addClass("available");
    } else {
      $("div#api_status").removeClass("available");
    }
  });

  let obj = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
      obj[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete obj[$(this).attr("data-id")];
    }
    $(".amenities h4").text(Object.values(obj).join(", "));
  });
});
