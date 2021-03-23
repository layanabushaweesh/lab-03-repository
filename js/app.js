'use strict';
// Constructor
function Animal(animal) {
  this.title = animal.title;
  this.image_url = animal.image_url;
  this.description = animal.description;
  this.keyword = animal.keyword;
  this.horns = animal.horns;
  Animal.all.push(this);
}
Animal.all = [];

Animal.prototype.renderImage = function() {
  let templatePhoto = $('#photo-mustache-template').html();
  let html = Mustache.render(templatePhoto, this);
  $('main').append(html);
};

Animal.prototype.renderFilter = function() {
  let templateFilter = $('#filter-template').html();
  let html = Mustache.render(templateFilter, this);
  $('#select-filter').append(html);
};

// ajax
const ajaxSettings = {
  method: 'get',
  dataType: 'json',
};


function ajaxAndRender(url, pageNum, renderOrNot) {
  $.ajax(url, ajaxSettings).then((data) => {
    data.forEach(item => {
      let newObject = new Animal(item);
      // add page property
      newObject.page = pageNum;

      //render
      if (renderOrNot === true){
        newObject.renderImage();
        newObject.renderFilter();
      }
    });
  });
}

// initial render
ajaxAndRender('data/page-1.json', 1, true);
ajaxAndRender('data/page-2.json', 2, false);

// page selection event
function pageChange(pageNum) {
  ////remove images and filters
  $('.animal').remove();
  $('.filter').remove();
  Animal.all.forEach(element => {
    if (element.page === pageNum){
      element.renderImage();
      element.renderFilter();
    }
  });
}
$('#page-one').click(function() {
  pageChange(1);
});
$('#page-two').click(function() {
  pageChange(2);
});


// filter selection event
$('select').change(function() {
  console.log(this.value);
  Animal.all.forEach(element => {
    if ('default' === this.value){
      $(`.${element.keyword}`).show();
    } else if (element.keyword !== this.value) {
      $(`.${element.keyword}`).hide();
    } else {
      $(`.${element.keyword}`).show();
    }
  });
});