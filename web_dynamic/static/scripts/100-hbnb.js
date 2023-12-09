$("document").ready(function () {
  $.get(`http://0.0.0.0:5001/api/v1/status/`, function (res) {
    if (res.status === "OK") {
      $("div#api_status").addClass("available");
    } else {
      $("div#api_status").removeClass("available");
    }
  });
  let s_obj = {};
  let c_obj = {};
  let obj = {};

  $('.locations > ul > h2 > input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
      s_obj[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete s_obj[$(this).attr("data-id")];
    }
    const idx = Object.assign({}, s_obj, c_obj);
    $(".locations h4").text(Object.values(idx).join(", "));
  });

  $('.locations > ul > ul > li input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
      c_obj[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete c_obj[$(this).attr("data-id")];
    }
    const idx = Object.assign({}, s_obj, c_obj);
    $(".locations h4").text(Object.values(idx).join(", "));
  });

  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
      obj[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete obj[$(this).attr("data-id")];
    }
    $(".amenities h4").text(Object.values(obj).join(", "));
  });

  $("button").click(function () {});
});

function handleSearchPlaces() {
  $.ajax({
    url: "http://0.0.0.0:5001/api/v1/places_search/",
    type: "POST",
    data: JSON.stringify({
      states: Object.keys(s_obj),
      cities: Object.keys(c_obj),
      amenities: Object.keys(obj),
    }),
    contentType: "application/json",
    dataType: "json",
    success: function (res) {
      $("section.places").empty();
      $("section.places").append(
        res.map((item) => {
          return `
            <article>
              <div class="title">
                <h2>${item.name}</h2>
                  <div class="price_by_night">
                    ${item.price_by_night}
                  </div>
                </div>
                <div class="information">
                  <div class="max_guest">
                    <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                    </br>
                    ${item.max_guest} Guests
                  </div>
                  <div class="number_rooms">
                    <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                    </br>
                    ${item.number_rooms} Bedrooms
                  </div>
                  <div class="number_bathrooms">
                    <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                    </br>
                    ${item.number_bathrooms} Bathrooms
                  </div>
                </div>
                <div class="description">
                  ${item.description}
                </div>
              </article>`;
        })
      );
    },
  });
}
