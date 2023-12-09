$('document').ready(function () {
  let obj = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      obj[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete obj[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(obj).join(', '));
  });
});
