$(document).ready(function () {
  let obj = {};

  $("li :checkbox").change(function () {
    if (this.checked) {
      obj[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete obj[$(this).attr("data-id")];
    }
    let str = "";
    let count = 0;
    for (let item in obj) {
      if (obj.hasOwnProperty(item)) {
        if (count > 0) {
          str = str.concat(", ");
        }
        str = str.concat(obj[item]);
        count++;
      }
    }

    $("div.amenities h4").text(str);
    $("h4").css({
      height: "100%",
      overflow: "hidden",
      "text-overflow": "ellipsis",
      "white-space": "nowrap",
    });
  });

  $.get("http://0.0.0.0:5001/api/v1/status/", (res) => {
    if (res.status === "OK") {
      $("div#api_status").addClass("available");
    } else {
      console.log("No");
      $("div#api_status").removeClass("available");
    }
  });

  $.ajaxSetup({ contentType: "application/json" });

  function handleAmntySearch () {
    $.post("http://0.0.0.0:5001/api/v1/places_search/", "{}", (res, stat) => {
      for (let idx in res) {
        $("section.places").prepend(
          `<article>
            <div class="price_by_night"></div>
              <h2></h2>
              <div class="informations">
              <div class="max_guest"></div>
                <div class="number_rooms"></div>
                <div class="number_bathrooms"></div>
              </div>
              <div class="description"></div>
              </article>`
        );
        $("section.places h2").first().text(res[idx].name);
        $(".price_by_night").first().text(res[idx].price_by_night);
        $(".max_guest")
          .first()
          .text(res[idx].max_guest + " Guests");
        $(".number_rooms")
          .first()
          .text(res[idx].number_rooms + " Rooms");
        $(".number_bathrooms")
          .first()
          .text(res[idx].number_bathrooms + " Bathrooms");
        $(".description").first().text(res[idx].description);
      }
    });
  }
});
