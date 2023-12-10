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
                <div class="reviews">
                  <h2>
                    <span id="${item.id}s" class="header-review">Reviews</span>
                    <span id="${item.id}" onclick="handleDisplay(this)">Show</span>
                  </h2>
                  <ul id="${item.id}list"></ul>,
                </div>
              </article>`;
        })
      );
    },
  });
}

function showReviews (item) {
  if (!item) {
    return;
  }
  if (item.textContent === 'Show') {
    item.textContent = 'Hide';
    $.get(`http://0.0.0.0:5001/api/v1/places/${item.id}/reviews`, (res, stat) => {
      if (stat === 'success') {
        $(`#${item.id}s`).html(res.length + ' Reviews');
        for (const elem of res) {
          displayRes(elem, item);
        }
      }
    });
  } else {
    item.textContent = 'Show';
    $(`#${item.id}s`).html('Reviews');
    $(`#${item.id}list`).empty();
  }
}

function displayRes (elem, item) {
  const dt = new Date(elem.created_at);
  const d = getDay(dt.getDate());
  const option = { month: 'long' };
  const m = dt.toLocaleString('en', option);

  if (elem.user_id) {
    $.get(`http://0.0.0.0:5001/api/v1/users/${elem.user_id}`, (res, stat) => {
      if (stat === 'success') {
        $(`#${item.id}list`).append(
          `<li>
            <h3>From ${res.first_name} ${res.last_name} the ${d + ' ' + m + ' ' + dt.getFullYear()}</h3>
            <p>${elem.text}</p>
          </li>`);
      }
    });
  }
}

function getDay (day) {
  let quotient = Math.floor(day/10);
  let rem = day % 10;

  if (quotient == 3 || quotient == 2 || quotient == 0) {
    if (rem == 1) {
      `${day} st`;
    } else if (rem == 2) {
      `${day} nd`;
    } else if (rem == 3) {
      `${day} rd`;
    } else {
      `${day} th`;
    }
  } else {
    return `${day} th`;
  }
}
