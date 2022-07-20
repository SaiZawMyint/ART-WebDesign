
$(function () {
  ////prevent link click
  //$('body').on('mousedown mouseup', 'a, a *', function (e) {
  //  e.preventDefault();
  //  console.log("over")
  //});
  var globalDesign = new Design();
  for (let key in hoverSettings) {
    if (Object.hasOwnProperty.call(hoverSettings, key)) {
      globalDesign.addHover(key, hoverSettings[key]);
    }
  }

  //nav activer
  $('.navigation').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });
  $('.navigation').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  //Accordion
  $('.toggle').click(function (e) {
    e.preventDefault();
    $('.toggle').removeClass('active');
    let $this = $(this);
    if (!$this.hasClass('active')) {
      $this.addClass('active');
    }
    if ($this.next().hasClass('show')) {
      $this.next().removeClass('show');
      $this.removeClass('active');
      $this.next().slideUp(350);
    } else {
      $this.parent().parent().find('li .inner').removeClass('show');
      $this.parent().parent().find('li .inner').slideUp(350);
      $this.next().toggleClass('show');
      $this.next().slideToggle(350);
    }
  });

  //add layout
  itech('.layout-link').event('click', function (e) {
    e.preventDefault();
    cmd = this.dataset['cmd'];
    if (cmd == "new") {
      itech('body').modalBox().generateModal(
        $(this).attr('data-cmd'),
        { "type": 'notification', "btns": [{ name: 'OK' }, { name: 'Cancle' }] },
        $(this).parent(),
        ({
          element: 'input',
          type: 'text',
          name: 'template-Name',
          attr: { 'placeholder': 'Template Name' }
        }),
        ({
          element: 'input',
          type: 'number',
          attr: { 'min': 0, 'max': '1920', 'placeholder': 'Container Width', 'value': '1400' },
          name: 'template-container'
        }),

      );

      $btn = itech('body').modalBox().button();

      $btn.on('click', function () {
        var cmd = $(this).data('i-tech-modal');
        if (cmd == 'submit') {
          itech('.convert-tree').defaultTemplate();
          //treeList
          itech('.convert-tree').UI().treeList().createBranch(function (data) {
            $('.layer').append(data);
            //folder
            itech('.folder').folder().toggle(function (e) {
              e.e.preventDefault();
            });
            //move action
            itech('.move-content').lightData().move();
            //content-editabel
            itech('.content-editable').lightData().contentEditable();
            //var design = new Design();
            $('.edition-contents').on('click', function (e) {
              e.stopPropagation();
              var setting = {
                type: 'data-edition-list',
                value: this.id
              }
              var c = new Calculator();
              var reftr = c.matchChild($('.layer-list')[0], setting);
              var ui = new UI();
              ui.openBranch(reftr);

              //open detail config
              itech('.editor-field').style({ 'width': 'calc(100% - 300px)' });
              
            });

            itech('.convert-tree a').event('click', function (e) {
              e.preventDefault();
            });
          });
          $('.tab')[1].click();
        }
        itech('body').modalBox().close();

      });
    }
    if (cmd == "new") {

    }

  });

  //Right bar splitor
  itech('.template-container').splitor($('.pref-container'), $('.template-box'), {
    direction: 'splitX', size: 20, resizeHandle: true,
    navigator: { nav: $('.tab'), action: 'left' }
  });
  //left bar editor
  //itech('.editor-panel').splitor($('.editor-field'),$('.detail-config-box'),{
  //  direction: 'splitX', size: 75, resizeHandle: true
  //});
  //generate text-editor
  itech('.convert-tree').textEditor();

  //main editor
  itech('.main-editor').event('click', function (e) {
    e.preventDefault();
    $('.main-editor').removeClass('active');
    $(this).addClass('active');
    var cmd = this.dataset['main'];
    console.log(cmd);
    updateMainEditor(cmd);
  });

});

//main editor
function updateMainEditor(cmd) {
  if (cmd == 'selector') {
    $('.main-selector').addClass('content-editable');
    $('.main-c-selector').removeClass('c-selector-active');
  }
  if (cmd == 'c-selector') {
    $('.main-selector').removeClass('content-editable');
    $('.main-c-selector').addClass('c-selector-active');
  }

}