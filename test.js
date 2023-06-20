$(function () {  
  $('.tools').draggable({
    containment: $('.box-wrapper'),
  //  revert: true, //to revert element if dropped in invalid target
    cursor: "copy",
    helper: "clone"
  });
  $('.edition-field').droppable({
    drop: handleDrop
  });
  
  $('.lab').on('click', function (e) {  
    e.preventDefault();
    $(this).parent().toggleClass('active');
  })
})

//handleDrop
function handleDrop(e, ui) { 
  var tool = ui.draggable;
  var data =  $(tool).data("drop");
  if ($(tool).hasClass("layout-li")) {
    this.layout(data);
  }
  if ($(tool).hasClass("comp-li")) {
    this.component(data);
  }
}
const style = {
  "layout": {
    "normal": {
      "css": 'text-align:center;',
      "cmd": 'blank'
    },
    "two-column": {
      "css": "display:flex;flex-direction:row;",
      "cmd": 'tow-column'
    },
    "two-row": {
      "css": "display:flex;flex-direction:column;",
      "cmd": "tow-row"
    },
    "float": {
      "css": "width: auto;height: auto;",
      "cmd": "float"
    }
  },
  "component": {
    "div": {
      element: function(){return $("<div class='comp-li div ed'></div>")[0]} 
    },
    "list": {
      element: $("<ul class='comp-li list ed'></ul>")[0]
    },
    "text": {
      element: function () { return $("<div class='comp-li text ed'><textarea placeholder='Enter text'></textarea></div>")[0] }
    },
    "circle": {
      element: function () { return $("<div class='comp-li circle ed'></div>")[0] }
    },
    "photo": {
      element: choosePhoto()
    }
  }
};
//Panel generator
class PanelGenerator{
  static elements = [];
  get(index) {
    return this.elements[index];
  }
  /**
   * Generate Panel
   * @param {Element} element 
   */
  generate(element) {
    if (element instanceof jQuery) {
      element = element[0];
    }
    if (!PanelGenerator.elements.includes(element)) {
      PanelGenerator.elements.push(element);
    }
  }
  static refresh(element) {
    if (!PanelGenerator.elements.includes(element)) {
      return false;
    }
  }
}
//Layout configuration
Element.prototype.layout = function (cmd) {  
  console.log(this);
  if (cmd == 'normal') {
    $(this).attr('style', style.layout.normal.css);
    $(this).attr('data-layout', style.layout.normal.cmd);
  }
  if (cmd == 'two-column') {
    $(this).attr('style', style.layout["two-column"].css);
    $(this).attr('data-layout', style.layout["two-column"].cmd);
  }
  if (cmd == 'two-row') {
    $(this).attr('style', style.layout["two-row"].css);
    $(this).attr('data-layout', style.layout["two-row"].cmd);
  }
  if (cmd == 'float') {
    $(this).attr('style', style.layout.float.css);
    $(this).attr('data-layout', style.layout.float.cmd);
  }
  this.layoutAnalyser();
  return this;
}

Element.prototype.component = function (cmd) {
  if (cmd == "div") {
    $(this).append(style.component.div.element().appendPopUpEditor());
  }
  if (cmd == "text") {
    $(this).append(style.component.text.element().appendPopUpEditor());
  }
  if (cmd == "circle") {
    $(this).append(style.component.circle.element().appendPopUpEditor());
  }
  this.layoutAnalyser();
}
Element.prototype.appendPopUpEditor = function () {
  var pop = $("<span class='pop-up'><span class='fa-usage style-ico'></span><span class='fa-usage setting-ico'></span><span class='fa-usage move-ico'></span></span>");
  $(this).append(pop);
  return this;
}
/**
 * 
 * @param {Element} marker 
 */
Element.prototype.layoutAnalyser = function() {
  var cmd = $(this).data('layout');
  $(this).children().each(function () {
    $(this).removeClass("lf");
  })
  if (cmd == 'float') {
    $(this).children().each(function () {
      $(this).addClass("lf");
    })
  }
 // innerEditor($('.ed'));
}
/**
 * 
 * @param {Element} element 
 */
function innerEditor(element) {
  element.droppable({
    drop: handleDrop
  })
}
function choosePhoto() {
  
}

class GeneratePanel{
  constructor() {
    
  }
}