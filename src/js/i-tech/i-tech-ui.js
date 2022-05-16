window.itech = function (selector) {
    var selectors = _(selector);
    function command(cmd) {
        [].forEach.call(selectors, cmd);
    };
    function storeData(dat, ele, typ) {
        itechData.data.push({ dat });
        itechData.element.push({ ele });
        itechData.type.push({ typ });
    }
    function replaceData(data, ele, typ, index) {
        itechData.data[index] = data;
        itechData.element[index] = ele;
        itechData.type[index] = typ;
    }

    return {
        resizer: function (direction, css) {
            var $ele;
            command(function (element) {
                var res = new Resizer();
                res.addResizer($(element), direction, css);
                $ele = element;
                storeData({ param: { direction: direction, css: css } }, { dom: element, resizeBy: res }, { name: 'resizer' });
            });
            return $ele;
        },
        splitor: function ($left, $right, setting) {
            command(function (ele) {
                var splitor = new Splitor();
                splitor.addComponent($(ele), $left, $right, setting);

                storeData({ param: { left: $left, right: $right, setting: setting } }, { dom: ele, spliteBy: splitor }, { name: 'splitor' });
            });

        },
        folder: function () {
            var evt = new IEvent();
            var data = [];
            command(function (ele) {
                data.push(ele);
            });
            return {
                toggle: function (callback) {
                    command(function (ele) {
                        $(ele).unbind('click');
                        evt.onevent('click', $(ele), (function (e) {
                            $('.tree-branch').each(function () {
                                $(this).removeClass('select');
                            });
                            $(this).parent().toggleClass('active');
                            $(this).children().first().toggleClass('active');
                            callback({ target: $(this), e: e });
                        }));
                    })
                }
            }
        },
        modalBox: function () {
            var modal;
            function generateModal(title, type, $preview, content) {
                command(function (ele) {
                    modal = new ModalBox($(ele));
                    modal.Dialog(title, type, $preview, content);
                    var prev_mod = itechData.type;
                    var skip = false, c = 0;
                    for (var i = 0; i < prev_mod.length; i++) {
                        if (prev_mod[i].typ.name == 'modalbox') {
                            skip = true;
                            c = i;
                        }
                    }
                    !skip ?
                        storeData({ param: { title: title, type: type, preview: $preview, content: content } },
                            { dom: ele, modalBy: modal }, { name: 'modalbox' }) :
                        replaceData({ param: { title: title, type: type, preview: $preview, content: content } },
                            { dom: ele, modalBy: modal }, { name: 'modalbox' }, c)
                        ;
                });
            }
            function getModal() {
                var mods = {
                    container: $('.i-tech-modal-container'),
                    box: $('.i-tech-modal-box')
                };
                return mods;
            };
            function getButtons() {
                var $parent = getModal().box;
                return $parent.find('.i-tech-modal-btn');
            }
            function close() {
                getModal().container.fadeOut(300, function () {
                    $(this).remove();
                });
                getModal().box.fadeOut(300, function () {
                    $(this).remove();
                });
            }
            function data() {
                var datas = [];
                $('.i-tech-modal-data-contents').children().each(function () {
                    var name, value;
                    name = $(this).attr('name');
                    $(this).prev().is("input") ? value = $(this).text() : value = $(this).val();
                    datas.push({
                        name: value
                    });
                });
                return datas;
            }
            return {
                generateModal: function (title, type, $preview, ...content) {
                    generateModal(title, type, $preview, content);
                },
                getModal: getModal,
                button: getButtons,
                data: data,
                close: close
            }
        },
        createTab: function ($tabcontent) {
            command(function (tab) {
                var tabClass = new Tab($(tab), $tabcontent);
                tabClass.initTab({
                    method: 'slideLeft', speed: 500
                });
                storeData({ param: { tabcontent: $tabcontent } }, { dom: tab, tabBy: tabClass }, { name: 'tab' });
            });
        },
        copyStyle: function ($ele) {
            command(function (ele) {
                var designer = new Design();
                $(ele).css(designer.getAllStyle($ele));
                storeData({ param: { ele: $ele } }, { dom: ele, copyBy: designer }, { name: 'copyStyle' });
            });
        },
        event: function (method, callback) {
            command(function (element) {
                var ievent = new IEvent();
                ievent.onevent(method, $(element), callback);
            });
        },
        design: function () {
            var $element;
            command(function (ele) {
                $element = $(ele);
            });
            var design = new Design();
            return {
                list: function () {
                    return {
                        treeList: function (listData) {

                            design.drawList($element).tree(listData);
                        }
                    }
                },
                hover: function (css) {
                    command(function (ele) {
                        design.addHover($(ele), css);
                    });
                }
            }
        },
        tree: function () {
            var ui = new UI();
            return {
                openBranch: function (branch) {
                    ui.openBranch(branch);
                }
            }
        },
        style: function (css) {
            command(function (ele) {
                var design = new Design();
                design.style(ele, css);
            })
        },
        lightData: function () {
            var data = [];
            command(function (element) {
                data.push(element);
            });
            var evt = new IEvent();
            return {
                move: function () {
                    evt.dragAndDrop(data);
                },
                contentEditable: function () {
                    var itext = new IText();
                    function callback(e) {
                        var target = e.target;
                        var onchange = e.onchange;
                        var changes = e.changes;
                        if (!$(target).hasClass('edition-contents')) {
                            var ref_id = $(target).data('edition-list');
                            var ref = i_id(ref_id);
                            var up_val = "";
                            if ($(target).hasClass('up-text')) {
                                onchange ?
                                    ref.innerHTML = changes : null;
                            } else if ($(ref).hasClass('image-editable')) {
                                console.log(changes);
                                onchange ?
                                    $(ref).attr("alt", changes) : null;
                            } else {
                                up_val = itext.convertToClass(changes);
                                if (onchange) {
                                    $(ref).addClass(up_val);
                                    $(ref).attr("data-userdefined", '{"type":"class","data":"' + up_val + '"}');

                                }
                            }
                        } else {
                            if (onchange) {
                                var setting = {
                                    type: 'data-edition-list',
                                    value: target.id
                                }
                                var c = new Calculator();
                                var reftr = c.matchChild($('.layer-list')[0], setting);
                                if ($(target).children().length) {
                                    itech().UI().treeList().updateBranch(reftr);
                                } else {
                                    itech().UI().treeList().openBranch(reftr);
                                    var text = $(reftr).children().find('.up-text')[0];
                                    text.innerHTML = changes;
                                }
                            }

                        }
                    }
                    command(function (ele) {
                        evt.onevent('contentEditable', $(ele), callback);
                    });
                },
            }
        },
        UI: function () {
            return {
                treeList: function () {
                    var ui = new UI();
                    return {
                        createBranch: function (callback) {
                            command(function (ele) {
                                ui.treeList(ele, callback);
                            });
                        },
                        updateBranch: function (branch) {
                            ui.updateTree(branch);
                        },
                        openBranch: function (branch) {
                            ui.openBranch(branch);
                        }
                    }
                },
                dragAndDrop: function (callback) {
                    command(function (ele) {
                        if ($(ele).hasClass('edition-contents')) {
                            ele.setAttribute('data-drapapi', 0);
                        } else {
                            ele.setAttribute('data-dragapi', 1);
                        }
                        ele.DragAndDrop(callback);
                    });
                }
            }
        },
        defaultTemplate: function () {
            var template = new UI();
            command(function (ele) {
                i_append(ele, template.Template());
            });
        },
        textEditor: function () {
            var text = new TextEditor();
            command(function (ele) {
                text.intiEditor(ele);
            });
        },
        default: function () {
            var all = [];
            command(function (ele) {
                all.push(ele);
            });
            return all;
        }
    }
};
Element.prototype.DragAndDrop = function (callback) {
    var x = "test";
    var y = "y test";
    var json = {
        x: x,
        y: y
    }
    var drag = new DragAPI();
    drag.fired(this, function (data) {
        console.log(data);
    });
    callback(json);
};
document.addEventListener('mousemove', function (e) {
    document.dispatchEvent(new MouseEvent(`move`, e));
}, true);
document.addEventListener('mouseup', function (e) {
    document.dispatchEvent(new MouseEvent(`up`, e));
}, true);
window.itechData = {
    data: [],
    element: [],
    type: [],
    events: []
};
var defaultTextEditorSetting,
    advanceSetting,
    ignor,
    layoutSetting;
$.getJSON("../src/js/setting.json", function (data) {
    defaultTextEditorSetting = data.defaultTextEditorSetting;
    advanceSetting = data.advanceSetting;
    ignor = data.ignor;
    layoutSetting = data.layoutSetting;
});
var isTextEditorOpen = false,
    isFloatListBoxOpen = false;
var temp = {
    count: 0,
    org_style: []
};
var id = 1;
//short function
function _(selector) {
    return document.querySelectorAll(selector);
}
function i_id(id) {
    return document.getElementById(id);
}
function i_class(cls) {
    return document.getElementsByClassName(cls);
}
function i_create(tag) {
    return document.createElement(tag);
}
function i_append(parent, ...children) {
    children.forEach(child => {
        parent.appendChild(child);
    });
}
function i_lists(...lists) {
    var ul = i_create('ul');
    var design = new Design();
    lists.forEach(list => {
        var li = i_create(list.li);
        ('attr' in list) ?
            li.setAttribute(list.attr.key, list.attr.value) :
            null;
        ('title' in list) ?
            li.setAttribute("title", list.title) :
            null;

        design.style(li, { padding: 0 });
        if ('child' in list) {
            var child = i_create(list.child);
            design.style(child, { 'padding': '5px', color: 'inherit' });
            list.child == 'a' ?
                child.href = "#" : null;

            ('content' in list) ?
                child.innerHTML = list.content : null;

            design.style(child, { display: 'inline-block' });
            i_append(li, child);
            ('class' in list) ?
                $(child).addClass(list.class) : null;
        } else {
            li.innerHTML = list.content;
        }
        i_append(ul, li);
    });
    return ul;
}
function i_addClass(parent, ...classes) {
    classes.forEach(cls => {
        parent.classList.add(cls);
    });
}
//UI
//Resizer
class Resizer {
    constructor() {
        this.$ele;
        this.$resizer;
        this.key;
    }
    addResizer($ele, direction, cusCss) {
        $ele.css({ 'position': 'relative', 'z-index': '1' });
        this.$ele = $ele;
        this.initializeDeirection(direction, cusCss);
    }
    initializeDeirection(direction, cusCss) {
        for (const key in direction) {
            if (Object.hasOwnProperty.call(direction, key)) {
                var element = direction[key];
                if (element) {
                    this.applyResizePosition(key, cusCss)
                }
            }
        }
    }
    applyResizePosition(key, cusCss) {
        var $anr = $('<div></div>');
        $anr.css({
            position: 'absolute',
        });
        $anr.addClass('i-tech-resizer');
        this.$resizer = $anr[0];

        var dir = this.specifyDir(key)[0];
        for (const k in dir) {
            if (dir.hasOwnProperty.call(dir, k)) {
                var element = dir[k];
                $anr.css(k, element);
            }
        }
        $anr.css({

        });
        for (const key in cusCss) {
            if (Object.hasOwnProperty.call(cusCss, key)) {
                $anr.css(key, cusCss[key]);
            }
        }
        this.$ele.append($anr);
        this.key = key;
    }
    specifyDir(key) {
        var dir = [];
        key == 'top' ? dir.push({ top: '0', left: '0', width: '100%', height: '5px', cursor: 'n-resize' }) : null;
        key == 'left' ? dir.push({ top: '0', left: '0', width: '5px', height: '100%', cursor: 'e-resize' }) : null;
        key == 'bottom' ? dir.push({ left: '0', bottom: '0', width: '100%', height: '5px', cursor: 'n-resize' }) : null;
        key == 'right' ? dir.push({ top: '0', right: '0', width: '5px', height: '100%', cursor: 'e-resize' }) : null;
        return dir;
    }

    action() {
        var key = this.key;
        var isResizing = false, lastDown = 0, curwidth = 0;
        var $parent = this.$ele;
        curwidth = $parent.outerWidth();
        $(this.$resizer).on('mousedown', function (e) {
            isResizing = true;
            lastDown = e.clientX;
            curwidth = $parent.outerWidth();
        });
        $(document).on('mousemove', function (e) {
            e.preventDefault();
            if (!isResizing) {
                return;
            }
            $('body').css('cursor', getCursor(key));
            key == 'right' || key == 'left' ? resizeWidth(key, e) :
                key == 'top' || key == 'bottom' ? resizeHeight(key, e) : null;
        }).on('mouseup', function (e) {
            isResizing = false;
            $('body').css('cursor', 'default');
        });
        function resizeWidth(direction, e) {
            var ex = e.clientX;
            var x = $parent.offset().left;
            if (direction == 'right') {
                $parent.css('width', ex - x + 'px');
            }
        }
        function resizeHeight(direction, e) {

        }
        function getCursor(key) {
            if (key == 'left' || key == 'right')
                return 'e-resize'
            if (key == 'top' || key == 'bottom')
                return 'n-resize'
        }
    }

}
//splitor
class Splitor {
    constructor() {
        this.$left;
        this.$right;
        this.$parent;
        this.$splitor;
        this.splitor_btn;
        this.ls = 0;
        this.setting = {
            direction: 'splitX',
            left: 30,
            resizeHandle: true,
            navigator: { nav: null, action: '' }
        };
    }

    refreshSplitor() {
        var splitor = this;
        var wh = 'width';
        var direction = splitor.setting.direction;
        direction == 'splitX' ? wh = 'width' : wh = 'height';
        splitor.initSize(wh, splitor.$parent);
    }
    addComponent($parent, $left, $right, setting) {
        this.setting = setting;
        this.$parent = $parent;
        var direction = 'splitX';
        var left = 30;
        var wh = 'width';
        ('direction' in setting) ? direction = setting.direction : direction = 'splitX';
        direction == 'splitX' ? wh = 'width' : wh = 'height';
        ('size' in setting) ? left = setting.size : left = 30;

        var $splitor = $('<div></div>');
        this.$splitor = $splitor;
        var designer = new Design();
        var dtype = 0;
        wh == 'width' ? dtype = designer.type.SPLITOR_ROW : dtype = designer.type.SPLITOR_COLUMN;
        designer.draw($splitor, dtype);

        var resize = new Resizer();
        if (direction == 'splitX') {
            resize.addResizer($left, { right: true });
        } else if (direction == 'splitY') {
            resize.addResizer($left, { bottom: true });
        } else {
            resize.addResizer($left, { right: true });
        }

        var resizer = resize.$resizer;
        this.splitor_btn = resizer;

        this.$left = $left;
        this.$right = $right;

        this.action(resizer, direction);

        $splitor.append($left);
        $splitor.append($right);
        $parent.append($splitor);
        this.initSize(wh, this.$parent);
        this.OnChangeActions();


        var rhd = true;
        ('resizeHandle' in setting) ? rhd = setting.resizeHandle : null;
        rhd ? this.resizeHandle() : null;

        ('navigator' in setting) ? this.generateNav() : null;
    }
    get mainSize() {
        var ms = 0;
        this.setting.direction == 'splitX' ?
            ms = this.$parent.width() :
            ms = this.$parent.height();
        return ms;
    }
    get wh() {
        var wh = 'width';
        this.setting.direction == 'splitX' ?
            wh = 'width' :
            this.setting.direction == 'splitY' ?
                wh = 'height' : null;
        return wh;
    }
    generateNav() {
        var act = 'left';
        var splitor = this;
        var navigator = this.setting.navigator;
        ('action' in navigator) ? act = navigator.action : act = 'left';
        var $nav = navigator.nav;
        var $changer = this.$left;
        if (act == 'left') {
            $changer = this.$left
        } else if (act == 'right') {
            $changer = this.$right;
        }
        var org = splitor.ls;
        if (splitor.setting.direction == 'splitX') {
            if (act == 'left') {
                mth = 'slideLeft';
            } else {
                mth = 'slideRight'
            }

        } else if (splitor.setting.direction == 'splitX') {
            if (act == 'left') {
                mth = 'slideUp';
            } else {
                mth = 'slideDown'
            }

        }

        var mth = 'slideLeft';
        act == 'left' ? mth = 'slideLeft' : mth = 'slideRight';

        $nav.on('click', function (e) {
            e.preventDefault();
            var cmd = $(this).attr('data-tab');
            var $this = $(this);
            $this.removeClass('active');
            $nav.each(function () {
                if (!$(this).is($this)) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            });
            org = splitor.ls;
            toggle(cmd);
        });
        function toggle(cmd) {
            $changer.children().each(function () {
                if ($(this).hasClass('i-tech-resizer')) {
                    return
                }
                var $id = $(this).attr('id');
                var $this = $(this);
                var mainsize = splitor.mainSize;
                var cur = splitor.wh;
                if ($id == cmd) {
                    if (!$this.hasClass('active')) {
                        $this.addClass('active');
                        splitor.resize(cur, org, mainsize - org);
                        $this.show();
                    } else {
                        $this.removeClass('active');
                        splitor.resize(cur, 0, mainsize);
                    }

                } else {
                    $(this).fadeOut();
                    $(this).removeClass('active');
                }
            });
        }
    }
    resizeHandle() {
        var ev = new IEvent();
        var $parent = this.$parent;
        var main = this;
        ev.onevent('resize', this.$left, function (data) {
            var check = data.checkSizing;
            var checked = {};
            for (const key in check) {
                if (Object.hasOwnProperty.call(check, key)) {
                    var c = check[key];
                    c ? checked.key = c : null;
                }
            }
            var whatchange = 'width';
            ('heightIncrease' in checked) || ('heightDecrease' in checked) ? whatchange = 'height' : null;
            ('widthIncrease' in checked) || ('widthDecrease' in checked) ? whatchange = 'width' : null;

            var new_val = 0;
            whatchange == 'width' ? new_val = data.data.new_size.width : null;
            whatchange == 'height' ? new_val = data.data.new_size.height : null;

            var mainSize = 0;
            whatchange == 'width' ? mainSize = $parent.outerWidth() : mainSize = $parent.outerHeight();
            var new_val1 = mainSize - new_val;
            main.resize(whatchange, new_val, new_val1);
        });
    }
    initSize(wh, $parent) {
        var mainSize = 0;
        wh == 'width' ? mainSize = $parent.outerWidth() : mainSize = $parent.outerHeight();
        this.$splitor.css(wh, mainSize);
        var calc = new Calculator();
        var left = this.setting.size;
        var right = 100 - left;
        this.$left.css(wh, calc.percentage(mainSize, left) + 'px');
        this.$right.css(wh, calc.percentage(mainSize, right) + 'px');
        this.ls = this.$left.width();
    }
    styleResizer(css) {
        $(this.splitor_btn).css(css);
    }
    OnChangeActions() {
        var splitor = this;
        var wh = 'width';
        var direction = splitor.setting.direction;
        direction == 'splitX' ? wh = 'width' : wh = 'height';
        $(window).on('resize', function (e) {
            e.preventDefault();
            splitor.initSize(wh, splitor.$parent);
        });
    }
    action(resizer, direction) {
        var isResizing = false;
        var $rlf = this.$left;
        var $rgh = this.$right;
        var $parent = this.$parent;
        var main = this;
        var cur = 'width';
        direction == 'splitX' ? cur = 'width' : cur = 'height';
        resizer.addEventListener('mousedown', function (e) {
            isResizing = true;
        });

        document.addEventListener(`move`, function (e) {
            e.preventDefault();
            if (!isResizing) {
                return;
            }
            $rlf.css('transition', 'unset');
            $rgh.css('transition', 'unset');
            $('body').css('cursor', getCursor(cur));

            cur == 'width' ? main.analyseSize('x', e) : main.analyseSize('y', e);
        });
        document.addEventListener('up', function (e) {
            e.stopPropagation();
            isResizing = false;
            $('body').css('cursor', 'default');
        });
        function getCursor(w) {
            if (w == 'width')
                return 'e-resize'
            else if (w == 'height')
                return 'n-resize'
        }
    }

    analyseSize(d, e) {
        var cur = 'width';
        this.setting.direction == 'splitX' ? cur = 'width' : cur = 'height';
        var $parent = this.$parent;
        var $rlf = this.$left;
        var $rgh = this.$right;
        var ex, lx;
        d == 'x' ? ex = e.clientX : ex = e.clientY;
        d == 'x' ? lx = $rlf.offset().left : lx = $rlf.offset().top;

        var rs = parseInt($parent.css(cur)) - parseInt($rlf.css(cur));

        var val1 = ex - lx;
        var val2 = rs;
        this.resize(cur, val1, val2);
        this.ls = parseInt(this.$left.css(cur));
    }
    resize(cur, val1, val2) {
        this.$left.css('transition', 'all .4s');
        this.$right.css('transition', 'all .4s');
        this.$left.css(cur, val1 + 'px');
        this.$right.css(cur, val2 + 'px');

    }
}
//ModalBox
class ModalBox {
    constructor($bdy) {
        this.$bdy = $bdy;
        this.$box = null;
        this.$container = null;
        this.btns = [];
        this.elements = [];
    }
    Dialog(title, type, preview, content) {
        var $nti = $('<div></div>');
        var $div = $('<div></div>');
        var $hdr = $('<h2></h2>');
        var designer = new Design();
        $hdr.addClass('font-awesome-usage ' + type.type + '-nti-ico');
        var $cls = $('<span></span>');
        $cls.addClass('font-awesome-usage ' + type.type + '-nti-cls-ico');
        designer.draw($cls, designer.type.CONTENTCENTER,
            {
                'width': '20px', 'height': '20px', 'cursor': 'pointer',
                'border-radius': '50%', 'float': 'right'
            });
        designer.addHover($cls, { 'background-color': '#0000004c', 'color': 'red' });

        this.$bdy.css({ postion: 'relative' });
        $hdr.css({
            'box-sizing': 'border-box',
            'color': '#e337a8',
            'width': '100%',
            'padding': '0px'
        });

        $hdr.text(title);
        $hdr.append($cls);

        var $cont = this.Content(content, preview);
        var $ftr = $('<div></div>');
        $ftr.css('text-align', 'center');
        var cc = new Design($ftr);
        cc.draw($ftr, cc.type.CONTENTCENTER, null);
        var or = this.lightBtn(type.btns);

        for (const o of or) {
            $ftr.append(o);
        }
        designer.draw($nti, designer.type.MODALCONTAINER, null);
        designer.draw($div, designer.type.MODALBOX, null);
        $nti.addClass('i-tech-modal-container');
        $div.addClass('i-tech-modal-box');
        $div.append($hdr);
        $div.append($cont);
        $div.append($ftr);
        this.$bdy.append($nti);
        this.$bdy.append($div);
        $('.i-tech-modal-data-contents::before').css({
            width: '100%',
            height: '10px',
            'background-color': 'red',
            'content': ''
        });
        $nti.fadeIn();
        $div.fadeIn();
        this.$box = $nti[0];
        this.$container = $div[0];
        this.closeNoti([$nti, $cls], $nti, $div);
    }

    lightBtn(btns) {
        var buttons = [];
        var t = '';
        if (Array.isArray(btns)) {
            for (const btn of btns) {
                var $b = $('<button></button>');
                $b.text(btn.name);

                btn.name.toLowerCase() == 'ok' ? t = 'submit' :
                    btn.name.toLowerCase() == 'cancle' ? t = 'cancle' : t = 'otr';
                $b.addClass('i-tech-modal-btn');
                $b.attr('data-i-tech-modal', t);
                var drawer = new Design();
                drawer.draw($b, drawer.type.BUTTON, null);
                drawer.addHover($b, { 'background-color': '#0000004c' });
                this.btns[btn.name] = $b;
                buttons.push($b);
            }

        } else {
            var $b = $('<button></button>');
            $b.text(btns.name);
            $b.addClass('i-tech-modal-btn');
            btn.name.toLowerCase() == 'ok' ? t = 'submit' :
                btn.name.toLowerCase() == 'cancle' ? t = 'cancle' : t = 'otr';
            $b.attr('data-i-tech-modal', t);
            var drawer = new Design();
            drawer.draw($b, drawer.type.BUTTON, null);
            drawer.addHover($b, { 'background-color': '#0000004c' });
            this.btns[btns.name] = $b;
            buttons.push($b);
        }
        return buttons;
    }

    Content(args, $preview) {
        var $div = $('<div></div>');
        $div.addClass('i-tech-modal-data-contents');

        var $child = null;
        var x = 0;
        args.forEach(arg => {
            for (const key in arg) {

                if (Object.hasOwnProperty.call(arg, key)) {
                    var value = arg[key];

                    if (key == 'element') {
                        $child = $('<' + value + '>' + '</' + value + '>');
                        this.elements.push($child);
                    } else if (key == 'attr') {
                        for (var att in value) {
                            if (Object.hasOwnProperty.call(value, att)) {
                                var v = value[att];
                                $child.attr(att, v);
                            }
                        }
                    } else {
                        this.mapKey($child, key, value);
                    }
                    this.addStylish($child, value);
                    $child.css('margin', '5px 0px');

                    $div.append($child);

                }

            }
        });

        var $parent = $('<div></div>');
        var design = new Design();
        design.clearFix($parent);
        if ($preview != null) {
            $div.css({ width: '60%', maxWidth: '50%', 'box-sizing': 'border-box', 'padding': '15px', 'float': 'left' });
            $parent.append($div);
            var $prev = $('<div></div>');
            $parent.css({ display: 'flex' });
            $prev.css({ width: '40%', 'box-sizing': 'border-box', 'padding': '15px', 'float': 'right' });
            var $clone = $('<ul class="layout-list"></ul>');
            $clone[0].innerHTML = '<li class="default-theme"><a href="#" class="layout-link" data-cmd="blank"><h2>Default Theme</h2></a></li>';
            $prev.append($clone);
            $parent.append($prev);
            var design = new Design();
            design.clearFix($parent);
        } else {
            $parent.append($div);
        }
        return $parent;
    }
    mapKey($child, key, value) {

        key == 'type' ? $child.attr(key, value) :
            key == 'text' ? $child.text(value) :
                key == 'name' ? $child.attr(key, value) :
                    $child.css(key, value);
        $child.css('box-sizing', 'border-box');
        return $child;
    }
    addStylish($ele, type) {
        var inp = new Design();
        if (type == 'input') {
            inp.draw($ele, inp.type.INPUT, null);
        }
        if (type == 'p') {
            inp.draw($ele, inp.type.P, null);
        }
    }
    Action($elem, event) {

    }
    closeNoti($eles, ...$args) {
        if (Array.isArray($eles)) {
            $eles.forEach($ele => {
                $ele.on('click', function () {
                    $args.forEach($arg => {
                        $arg.fadeOut(300, function () {
                            $(this).remove();
                        });
                    });
                });
            });
        } else {
            $eles.on('click', function () {
                $args.forEach($arg => {
                    $arg.fadeOut(300, function () {
                        $(this).remove();
                    });
                });
            });
        }

    }
    getButtons() {
        return this.btns;
    }
    getModal() {
        var modal = [this.$container, this.$box];
        return modal;
    }
}
//Tab
class Tab {
    constructor($tab, $tabcontent) {
        this.$tab = $tab;
        this.$tabcontent = $tabcontent;
    }
    initTab(behaviour) {
        var $tab = this.$tab;
        var $tabcontent = this.$tabcontent;
        var method = behaviour.method;
        var callback;
        ('callback' in behaviour) ? callback = behaviour.callback : callback = null;
        var speed = 0;
        ('speed' in behaviour) ? speed = behaviour.speed : speed = 300;
        $tab.on('click', function (e) {
            e.preventDefault();
            var cmd = $(this).attr('data-tab');
            toggleTabContent(cmd);
        });
        function toggleTabContent(cmd) {
            $tabcontent.children().each(function () {
                var $id = $(this).attr('id');
                var $this = $(this);
                if ($id == cmd) {
                    var animation = new IAnimation();
                    animation.animate($tabcontent, {
                        method: method, speed: speed, callback: function () {
                            callback ? callback() : null;

                        }
                    });
                    $this.addClass('active');
                } else {
                    $(this).hide();
                    $(this).removeClass('active');
                }
            });
        }

    }
}
//Design
class Design {
    constructor() {
        this.type = {
            BUTTON: 1,
            INPUT: 2,
            P: 3,
            MODALCONTAINER: 4,
            MODALBOX: 5,
            MODALBOX_BTN: 6,
            CONTENTCENTER: 7,
            CONTENTCENTERX: 8,
            CONTENTCENTERY: 9,
            FlEXROW: 10,
            FLEXCOLUMN: 11,
            SPLITOR_ROW: 12,
            SPLITOR_COLUMN: 13,
            WRAPPER: 14,
            HEADER: 15,
            SECTION: 16,
            FOOTER: 17,
            CONTAINER: 18,
            NAVIGTION_LIST: 19,
            HEADER_SECTION: 20,
            TEXTEDITOR_BOX: 21,
            LAYOUT_PANEL: 22
        }
        this.Color = {
            getColor: function ($ele, color) {
                var design = new Design();
                return design.getColor($ele, color);
            },

        }
    }
    //constructor
    DesignerColor() {
        var C = new Color();
        return {
            getColor: function ($ele, color) {
                C.getColor($ele, color);
            },
            isColor: function (color) {
                C.isColor(color);
            },
            colorType: function (color) {
                C.colorType(color);
            },
            convertRGBToHEX: function (color) {
                C.convertRGBToHEX(color);
            },
            convertHEXToRGB: function (color) {
                C.convertHEXToRGB(color);
            },
            oppsiteColor: function (color) {
                C.oppsiteColor(color);
            }
        }
    }
    //designerColor
    draw($ele, type, additionalCss) {

        if (type == this.type.BUTTON) {
            $ele.css({
                'padding': '5px 8px',
                'margin': '5px',
                'border': '0',
                'outline': '0',
                'border-radius': '5px',
                'background-color': '#e3e4f7',
                'box-shadow': '1px 1px 3px #a59da890',
                'font-size': '.9em',
                'cursor': 'pointer'
            });
        }
        if (type == this.type.INPUT) {
            $ele.css({
                width: '100%',
                padding: '5px',
                margin: '5px 0px',
                border: '0',
                outline: '0',
                borderBottom: '2px solid'
            });
            var typ = $ele.attr('type');
            if (typ == 'Number') {
                $ele.attr('min', 0);
            }
            this.addFocus($ele, { 'border-bottom': '2px solid #7d7dd2' });
        }
        if (type == this.type.MODALCONTAINER) {
            $ele.css({
                position: 'fixed',
                width: '100%',
                height: '100%',
                background: '#313131cc',
                'z-index': '150',
                display: 'none'
            });
        }
        if (type == this.type.MODALBOX) {
            $ele.css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                background: '#ffffff',
                display: 'flex',
                'flex-direction': 'column',
                height: 'fit-content',
                maxHeight: '90%',
                width: 'fit-content',
                overflow: 'hidden auto',
                padding: '10px',
                'z-index': '160',
                'box-sizing': 'border-box',
                'border-radius': '5px',
                display: 'none'
            });
        }
        if (type == this.type.SPLITOR_ROW || type == this.type.FlEXROW) {
            $ele.css({
                display: 'flex',
                'flex-direction': 'row',
                'width': '100%',
                'height': '100%'
            });
        }
        if (type == this.type.SPLITOR_COLUMN || type == this.type.FLEXCOLUMN) {
            $ele.css({
                display: 'flex',
                'flex-direction': 'column',
                'width': '100%',
                'height': '100%'
            });
        }
        if (type == this.type.CONTENTCENTER) {
            $ele.css({
                'width': '100%',
                'height': 'fit-content',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'background-color': 'transparent'
            });
        }
        if (type == this.type.P) {
            $ele.css({
                'box-sizing': 'border-box',
                'text-align': 'center',
                'padding': '15px'
            });
        }
        if (type == this.type.WRAPPER) {
            this.style($ele[0], {
                width: '100%',
                'max-width': '1920px',
            });
        }
        if (type == this.type.HEADER || type == this.type.SECTION
            || type == this.type.FOOTER) {
            this.style($ele[0], {
                'width': '100%',
                'margin': '0px auto',
                overflow: 'hidden',
                'padding': '20px',
                'box-sizing': 'border-box',
            });
        }
        if (type == this.type.CONTAINER) {
            this.style($ele[0], {
                'width': '1280px',
                'max-width': '100%',
                'margin': '0px auto'
            });
        }
        if (type == this.type.NAVIGTION_LIST) {
            $ele.css('list-style', 'none');
            $ele.addClass('clearfix');
            $ele.children().each(function () {
                $(this).css({
                    float: 'left',
                    margin: '5px',
                    'text-align': 'center'
                });
            });
        }
        if (type == this.type.HEADER_SECTION) {
            $ele.css({
                width: '100%',
                background: 'url(src/img/img_nb_01.jfif) no-repeat',
                'background-size': '100%',
                'background-position': 'top',

            })
        }
        if (type == this.type.TEXTEDITOR_BOX) {
            $ele.css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'background-color': '#FFF',
                'box-shadow': '3px 2px 7px #0000004c',
                'box-sizing': 'border-box',
                'padding': '3px',
                'border-radius': '5px',
            });
        }

        for (const key in additionalCss) {
            if (Object.hasOwnProperty.call(additionalCss, key)) {
                if (type != this.type.NAVIGTION_LIST) {
                    $ele.css(key, additionalCss[key]);
                } else {
                    $ele.children().each(function () {
                        $(this).css(key, additionalCss[key]);
                    });
                }


            }
        }
    }
    //draw list float box
    drawFloatListBox(numOfChild, childtype) {
        var box = i_create('div');
        var gridSty = numOfChild >= 6 ? "auto auto auto" : "auto auto";
        this.style(box, {
            display: 'grid',
            'grid-template-columns': gridSty,
            'background-color': '#FFF',
            'padding': '5px',
            'position': 'absolute',
            'box-sizing': 'border-box'

        });
        for (var i = 0; i < numOfChild; i++) {
            var a = i_create(childtype);
            childtype == 'a' ?
                a.href = "#" : null;
            this.style(a, { padding: '5px', 'text-align': 'center' });
            box.append(a);
        }
        box.classList.add('itech-float-list-box');
        isFloatListBoxOpen = true;
        return box;
    }
    //draw default ui
    addHover($ele, before) {
        this.removeHover($ele);
        $ele.on('mouseover mouseout', function (e) {
            if (e.type === 'mouseover') {
                e.stopPropagation();
                for (var key in before) {
                    if (Object.hasOwnProperty.call(before, key)) {
                        temp.org_style[temp.count] = {
                            key: key,
                            value: this.style.getPropertyValue(key)
                        };
                        var value = before[key];
                        $(this).css(key, value);
                    }
                }
            }
            if (e.type === 'mouseout') {
                e.stopPropagation();
                for (var key in before) {
                    if (Object.hasOwnProperty.call(before, key)) {
                        $(this).css(key, '');
                    }
                }
            }

        });
        temp.count++;
    }
    //addHover
    removeHover($ele) {
        $ele.unbind('mouseover mouseout');
    }
    addFocus($ele, before) {
        var org_style = [];
        $ele.focus(function () {
            for (var key in before) {
                if (Object.hasOwnProperty.call(before, key)) {
                    org_style.push({
                        key: key,
                        value: $ele.css(key)
                    });
                    var value = before[key];
                    $(this).css(key, value);
                }
            }
        });
        $ele.blur(function () {
            var i = 0;
            for (var key in before) {
                if (Object.hasOwnProperty.call(before, key)) {
                    $(this).css(key, org_style[i].value);
                    i++;
                }
            }
            org_style = [];
        });
    }
    //addFocus
    initialHover(ele, before) {
        var org_style = [];
        $(ele).on('mouseenter', function (e) {
            e.stopPropagation();
            for (var key in before) {
                if (Object.hasOwnProperty.call(before, key)) {
                    org_style.push({
                        key: key,
                        value: this.style.getPropertyValue(key)
                    });
                    console.log(org_style);
                    var value = before[key];
                    $(this).css(key, value);
                }
            }
        }).on('mouseleave', function (e) {
            e.stopPropagation();
            for (var key in before) {
                if (Object.hasOwnProperty.call(before, key)) {
                    $(this).css(key, temp.org_style[count].value);
                    i++;
                }
            }
        });
        temp.count++;
    }

    clearFix($ele) {
        var $div = $('<div></div>');
        $div.css({
            display: 'block',
            clear: 'both',
            height: '0px',
            visibility: 'hidden',
            'font-size': '0px',
        });
        $ele.append($div);
    }
    //clearfix
    getAllStyle($ele) {
        var sheets = document.styleSheets, orginal = {};
        for (var i in sheets) {
            var rules = sheets[i].rules || sheets.cssRules;
            for (var r in rules) {
                if ($ele.is(rules[r].selectorText)) {
                    orginal = $.extend(orginal, cssProperty(rules[r].style), cssProperty($ele.attr('style')));
                }
            }
        }
        function cssProperty(css) {
            var result = {};
            if (!css) return result;
            if (css instanceof CSSStyleDeclaration) {
                for (var i in css) {
                    if ((css[i]).toLowerCase) {
                        result[(css[i]).toLowerCase()] = (css[css[i]]);
                    }
                }
            } else if (typeof css == 'string') {
                css = css.split("; ");
                for (var i in css) {
                    var local = css[i].split(': ');
                    result[local[0].toLowerCase()] = (local[1]);
                }
            }
            return result;
        }
        return orginal;

    }
    //copy all element style sheet
    dynamicCloneElement($ele) {

        var tag = $ele[0].tagName.toLowerCase();
        var $new_ele;
        tag == 'li' || tag == 'a' ? $new_ele = $('<div></div>') :
            $new_ele = $('<' + tag + '></' + tag + '>');

        $new_ele.css(this.getAllStyle($ele));
        if ($ele.children().length) {
            initChild($ele, $new_ele);
        }
        function initChild($parent, $new) {
            $parent.children().each(function () {
                var $new_child = $('<' + $(this)[0].tagName.toLowerCase() + '></' + $(this)[0].tagName.toLowerCase() + '>');
                var design = new Design();
                $new_child.css(design.getAllStyle($(this)));

                if ($(this).children().length) {
                    initChild($(this), $new_child);
                } else {
                    $new_child.text($(this).text());
                }
                $new.append($new_child);
            });

        }
        return $new_ele;
    }
    //normal clone 
    cloneElement($ele) {
        var tag = $ele[0].tagName.toLowerCase();
        var org = $ele[0];
        var new_ele = i_create(tag);
        org.style.length ? new_ele.style = org.style : null;
        for (var i = 0; i < org.attributes.length; i++) {
            $(new_ele).attr(org.attributes[i].nodeName, org.attributes[i].nodeValue);
        }
        new_ele.innerHTML = org.innerHTML;

        return $(new_ele);
    }
    //clone to new element
    drawList($ele) {
        function tree(listData) {
            for (const iterator of listData) {
                $ele.append(initTree(iterator));
            }
            function initTree(listData) {
                var $parent;
                for (const key in listData) {
                    if (Object.hasOwnProperty.call(listData, key)) {
                        if (key == 'element') {
                            $parent = listData[key];
                        } else if (key == 'child') {
                            if ('element' in listData[key]) {
                                var $child = initTree(listData[key]);
                                $parent.append($child);
                            }
                        }
                    }
                }
                return $parent;
            }
        }
        return {
            tree: function (listData) {
                tree(listData);
            },
            float: function (listData) {

            },

        }
    }
    //stylish
    style(ele, css) {
        if (typeof ele == 'array') {
            ele.forEach(e => {
                for (const key in css) {
                    if (Object.hasOwnProperty.call(css, key)) {
                        const value = css[key];
                        e.style.setProperty(key, value);
                    }
                }
            });
        } else {
            for (const key in css) {
                if (Object.hasOwnProperty.call(css, key)) {
                    const value = css[key];
                    ele.style.setProperty(key, value);
                }
            }
        }

    }
}
//treeList
class Tree {
    constructor() {
        this.isDragging = false;
    }
    initTree($ele) {
        var tree = this;
        initChild($ele);

        function initChild($ele) {
            $ele.children().each(function () {
                if (!$(this).next().hasClass('tree')) {
                    tree.dropTarget($(this));
                } else {
                    mainBranchEvent($(this));
                    $(this).next().hide();
                }
                $(this).attr('draggable', 'true');
                if (!$(this).hasClass('tree')) {
                    tree.branchEvent($ele, $(this));
                }
            });
        }
        function mainBranchEvent($main) {
            $main.on('click', function () {
                $(this).show();
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active');
                    if ($(this).next().hasClass('tree')) {
                        $(this).next().slideDown();
                        $(this).next().children().each(function () {
                            $(this).slideDown();
                        });
                    }
                } else {
                    $(this).removeClass('active');
                    if ($(this).next().hasClass('tree')) {
                        $(this).next().slideUp();
                        $(this).next().children().each(function () {
                            $(this).slideUp();
                        });
                    }
                }
            });
        }
    }
    dropTarget($ele) {
        var typ = $ele[0].tagName.toLowerCase();
        var $drop_target = $('<' + typ + '></' + typ + '>');
        $drop_target.addClass('itech-tree-dropable');
        $drop_target.css({ width: '100%', height: '10px', 'background-color': 'transparent' });
        $ele.after($drop_target);
        this.dropTargetEvent($drop_target);
    }
    dropTargetEvent($drop_target) {
        var tree = this;
        $drop_target.on('mouseenter', function () {
            if (tree.isDragging) {
                $(this).css('background-color', '#7d7dd24c');
            }
        }).on('mouseout', function () {
            if (tree.isDragging) {
                $(this).css('background-color', 'unset');
            }
        });
    }
    branchEvent($ele, $branch) {
        var tree = this;
        var evt = new IEvent();
        var $target, $source, isDragging;
        evt.onevent('clientdrag', { field: $ele, target: $branch }, function (evt) {
            h(evt);
        });
        function h(evt) {
            tree.isDragging = evt.isDragging;
            $target = $(evt.target);
            $source = evt.source;

            $(document).on('mouseup', function () {
                if ($target.hasClass('itech-tree-dropable')) {
                    var design = new Design();

                    var $new_target = design.cloneElement($source);
                    $target.replaceWith($new_target);

                    $source.remove();
                }
            });
        }
    }
    addParentAction($ele) {

    }
}
//Color
class Color {
    getColor($ele, color) {
        return $ele.css(color);
    }
    isColor(color) {
        const checker = new Option().style;
        checker.color = color;
        return checker.color !== '';
    }
    colorType(color) {
        if (isColor(color)) {
            var col = color.trim();
            if (col[0] == '#')
                return 'HEX';
            else if (col[0].toLowerCase() == 'r')
                return 'RGB';
            else
                return 'Another Type';
        }
    }
    convertRGBToHEX(color) {
        if (colorType(color) == 'RGB') {
            var col = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')'));
            col = col + ',';
            var rgb = [];
            var count = 0;
            for (var char of col) {
                char == ',' ? count++ : '';
            }
            for (var i = 0; i < count; i++) {
                var r = col.substring(0, col.indexOf(','));
                rgb[i] = r;
                col = col.substring(col.indexOf(',') + 1, col.length);
            }
            var hex = "#";
            for (var i = 0; i < rgb.length; i++) {
                hex += componentToHex(rgb[i]);
            }
            return hex;
        }
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
    }
    convertHEXToRGB(color) {
        if (colorType(color) == 'HEX') {
            var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (res) {
                var r = parseInt(res[1], 16);
                var g = parseInt(res[2], 16);
                var b = parseInt(res[3], 16);
                return 'rgb( ' + r + ', ' + g + ', ' + b + ')';
            }
        }
    }
    oppsiteColor(color) {
        if (colorType(color) == 'HEX') {
            return convertHEX(color);
        }
        if (colorType(color) == 'RGB') {
            return convertHEXtoRGB(convertRGB(color));
        }
        function convertHEX(hex) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            var r = (225 - parseInt(hex.slice(0, 2), 16)).toString(16),
                g = (225 - parseInt(hex.slice(2, 4), 16)).toString(16),
                b = (225 - parseInt(hex.slice(4, 6), 16)).toString(16);
            return '#' + padZero(r) + padZero(g) + padZero(b);
        }
        function convertRGB(rgb) {
            var x = rgb.slice(rgb.indexOf('(') + 1, rgb.lastIndexOf(')'));
            x = x + ",";
            var R = [];
            for (var i = 0; i < 3; i++) {
                R.push((x.slice(0, x.indexOf(','))).trim());
                x = x.slice(x.indexOf(',') + 1, x.length);
            }
            var hex = '#' + RGBconvertor(R[0]) + RGBconvertor(R[1]) + RGBconvertor(R[2]);

            function RGBconvertor(rgb) {
                var hex = Number(rgb).toString(16);
                if (hex.length < 2) {
                    hex = "0" + hex;
                }
                return hex;
            }
            return convertHEX(hex);
        }

        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
    }
}
//Animation
class IAnimation {
    //simple animaiton
    animate($ele, animation) {
        var method = animation.method;
        var speed = animation.speed;
        var callback = animation.callback;
        if (method == 'fadeIn') {
            $ele.fadeIn(speed, callback);
        } else if (method == 'fadeOut') {
            $ele.fadeOut(speed, callback);
        } else if (method == 'slideUp') {
            $ele.show();
            $ele.slideUp(speed, callback);
        } else if (method == 'slideDown') {
            $ele.slideDown(speed, callback);
        } else if (method == 'slideLeft') {
            $ele.animate({ width: 'toggle' }, speed, callback);
        } else if (method == 'slideRight') {
            var marginr = $ele.width();
            $ele.css({
                'margin-left': marginr + 'px',
                width: '0px',

            });
            $ele.show();
            $ele.animate({ 'margin-left': '0px', width: marginr + 'px' }, speed, callback);
        } else if (method == 'width' || method == 'height') {
            $ele.animate({ method: animation.value + 'px' }, {
                duration: speed, queue: false, complete: callback
            });
        }
    }
    //smooth scoll to
    scroll($scroller, $target) {
        var c = new Calculator();
        var pos = c.currentPos($target[0]);
        $scroller.animate({ scrollTop: pos.top - 100 }, 250);
    }
}
//Dragging API
class DragAPI {
    constructor() {
        this.designer = new Design();
        this.target = null;
        this.ref = null;
        this.positions = {
            curTarget: {
                from: 0,
                to: 0
            },
            refTarget: {
                from: 0,
                to: 0
            }
        };
        this.dataHandling = {
            option: "",
            data: {
                drag: new Object(),
                drop: new Object()
            },
            parents: {
                drag: new Object(),
                drop: new Object()
            }
        };
    }
    static markPartents = {
        drag: new Object(),
        drop: new Object(),
        rule: new Object()
    };

    fired(ele, callback) {
        var dragger = this;
        $(ele).unbind('dragstart drop');

        $(ele).on('dragstart', function (e) {
            var data = DragAPI.handlingPos(this, e);
            dragger.triggerStart(data);
            dragger.dataHandling.option = "dragstart";
            dragger.dataHandling.data = dragger.positions;
            DragAPI.markPartents.drag = data.parents;
            DragAPI.markPartents.rule = this.dataset['dragapi'];
            dragger.dataHandling.parents.drag = DragAPI.markPartents.drag;
            callback(dragger.dataHandling);
        }).on('dragenter', function (e) {
            e.preventDefault();
        }).on('dragover', function (e) {
            e.preventDefault();
        }).on('drop', function (e) {
            if (!DragAPI.isValid(this)) {
                return false;
            }
            var data = DragAPI.handlingPos(this, e);
            dragger.triggerEnd(data);
            dragger.dataHandling.option = "drop";
            dragger.dataHandling.data = dragger.positions;
            dragger.dataHandling.parents.drag = DragAPI.markPartents.drag;
            dragger.dataHandling.parents.drop = data.parents;
            callback(dragger.dataHandling);
            DragAPI.markPartents = {
                drag: new Object(),
                drop: new Object()
            }
        });
    }
    triggerStart(data) {
        this.positions.curTarget.from = data.target;
        this.positions.refTarget.from = data.ref;
    }
    triggerEnd(data) {
        this.positions.curTarget.to = data.target;
        this.positions.refTarget.to = data.ref;
    }
    static handlingPos(ele, e, option) {
        e.stopPropagation();
        var t = {
            element: null,
            from: null,
            parent: null
        };
        var r = {
            element: null,
            from: null,
            parent: null
        }
        t.element = ele;
        t.from = DragAPI.markPos(ele.parentElement, ele);
        t.parent = ele.parentElement;
        if (!$(ele).hasClass('edition-contents')) {
            r.element = i_id($(ele).data('edition-list'));
            r.from = DragAPI.markPos(r.element.parentElement, r.element);
            r.parent = r.element.parentElement;
        } else {
            $('.layer').find('*').filter('li').each(function () {
                if ($(this).data('edition-list') == t.element.id) {
                    r.element = this;
                    r.from = DragAPI.markPos(r.element.parentElement, r.element);
                    r.parent = r.element.parentElement;
                }
            });
        }
        if (option == "drag") {
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/html', ele.innerHTML);
        }

        return {
            target: t.from,
            ref: r.from,
            parents: {
                target: t.parent,
                ref: r.parent
            }
        }
    }
    static isValid = (ele) => {
        return DragAPI.markPartents.rule == ele.dataset['dragapi'];
    }
    /**
     * 
     * @param {Element} p 
     * @param {Element} ele 
     * @returns 
     */
    static markPos(p, ele) {
        var x = 0;
        for (var i = 0; i < p.children.length; i++) {
            if (p.children[i] === ele) {
                x = i;
            }
        }
        return x;
    }
}
//Events
class IEvent {
    constructor() {

    }
    matchOuterGlobalEvent($ele) {
        return match($ele);
        function match($ele) {
            if (!$ele.parent().is('body')) {
                if ($._data(($ele.parent()[0]), "events")) {
                    return {
                        target: $ele.parent(),
                        event: $._data(($ele.parent()[0]), "events")
                    };
                } else {
                    if ($ele.parent()) {
                        match($ele.parent());
                    }
                }
            } else {
                console.log('end');
                return {
                    target: null,
                    event: null
                };
            }

        }
    }
    matchOuterEvent($ele) {
        console.log(itechData);
    }
    onevent(method, $ele, callback) {
        if (method == 'resize') {
            this.resizeHandle($ele, callback);
        } else if (method == 'clientdrag') {
            this.featureMouseHandle($ele, callback);
        } else if (method == 'contentEditable') {
            this.contentEditableEvent($ele, callback);
        } else if (method == 'popupmenu') {
            this.popUpMenuEvent($ele, callback);
        } else {
            $ele.on(method, callback);
        }
        itechData.events.push({ element: $ele, method: method, callback: callback });
    }

    dragAndDrop(elements, limiteddragField) {
        var evt = this;
        var design = new Design();
        var target, ref;
        var t_index = 0, o_index = 0, r_index = 0, ro_index = 0;
        function handleDragStart(e) {
            e.originalEvent.stopPropagation();
            if (!evt.validate(limiteddragField).isAccess()) {
                return false;
            }
            target = this;
            design.style(this, { 'opacity': '0.4' });
            t_index = markPos(target.parentElement, target);
            if (!$(this).hasClass('edition-contents')) {
                ref = i_id(this.getAttribute('data-edition-list'));
                r_index = markPos(ref.parentElement, ref);
            } else {
                $('.layer').find('*').filter('li').each(function () {
                    if ($(this).data('edition-list') == target.id) {
                        ref = this;
                        r_index = markPos(ref.parentElement, ref);
                    }
                });
            }
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
        }
        function handleDragEnd() {
            if (!evt.validate(limiteddragField).isAccess()) {
                return;
            }
            design.style(this, { opacity: '' });
            $(elements).removeClass('over');
        }
        function handleDragOver(e) {
            if (e.originalEvent.preventDefault) {
                e.originalEvent.preventDefault();
            }
            return false;
        }
        function handleDragLeave(e) {
            if (!evt.validate(limiteddragField).isAccess()) {
                return;
            }
            this.classList.remove('over');
        }
        function handleDragEnter(e) {
            if (!evt.validate(limiteddragField).isAccess()) {
                return;
            }
            !$(this).hasClass('drop-not-allow') ?
                this.classList.add('over') :
                null;
        }
        function replace(target, org) {
            var t_p = target.ele.parentElement;
            var o_p = org.ele.parentElement;

            t_p.insertBefore(org.ele, t_p.children[target.index]);
            o_p.insertBefore(target.ele, o_p.children[org.index]);
        }
        function markPos(p, ele) {
            var x = 0;
            for (var i = 0; i < p.children.length; i++) {
                if (p.children[i] === ele) {
                    x = i;
                }
            }
            return x;
        }
        function handleDrop(e) {
            if ($(target).hasClass('fd')) {
                if (!$(this).hasClass('fd')) {
                    return;
                }
            }
            if ($(target).hasClass('fl')) {
                if (!$(this).hasClass('fl')) {
                    return;
                }
            }
            if (!evt.validate(limiteddragField).isAccess()) {
                return;
            }
            e.originalEvent.stopPropagation();
            if (target !== this && !$(this).hasClass('drop-not-allow')) {
                executeDrop(this);
            } else if (target !== this && $(this).hasClass('drop-not-allow')
                && $(target).hasClass('drop-not-allow')) {
                executeDrop(this);
            }

            function executeDrop(ele) {
                $(ele).removeClass('over');
                $(ele).css('opacity', '');
                if ($(target).hasClass('edition-contents') &&
                    $(ele).hasClass('edition-contents')) {
                    o_index = markPos(ele.parentElement, ele);
                    var mrk;
                    $('.layer').find('*').filter('li').each(function () {
                        if ($(this).data('edition-list') == ele.id) {
                            mrk = this;
                            ro_index = markPos(mrk.parentElement, mrk);
                        }
                    });
                    replace({ ele: target, index: t_index }, { ele: ele, index: o_index });
                    replace({ ele: ref, index: r_index }, { ele: mrk, index: ro_index });
                } else {
                    o_index = markPos(ele.parentElement, ele);
                    var tt = i_id(ele.getAttribute('data-edition-list'));
                    ro_index = markPos(tt.parentElement, tt);
                    replace({ ele: target, index: t_index }, { ele: ele, index: o_index });
                    replace({ ele: ref, index: r_index }, { ele: tt, index: ro_index });
                }
            }

            return false;
        }
        elements.forEach(ele => {
            $(ele).unbind('dragstart');
            $(ele).unbind('dragover');
            $(ele).unbind('dragenter');
            $(ele).unbind('dragleave');
            $(ele).unbind('dragend');
            $(ele).unbind('drop');
            $(ele).on('dragstart', handleDragStart);
            $(ele).on('dragover', handleDragOver);
            $(ele).on('dragenter', handleDragEnter);
            $(ele).on('dragleave', handleDragLeave);
            $(ele).on('dragend', handleDragEnd);
            $(ele).on('drop', handleDrop);
        });

    }
    //drag and drop event
    featureMouseHandle($eles, callback) {
        var $field = $eles.field;
        $field.css('position', 'relative');
        var $ele = $eles.target;
        var $evt_trg = null;
        var isDragging = false, islimit = false;
        var ievent = {};
        var design, $cloneSource;
        design = new Design();
        $cloneSource = design.cloneElement($ele);
        $ele.on('mousedown', function (e) {
            e.preventDefault();
            isDragging = true;
            checkClone();
        });
        $(document).on('mousemove', function (e) {
            if (!isDragging) return;
            ievent = {
                data: e,
                source: $ele,
                target: e.target,
                isDragging: isDragging
            };
            $cloneSource.css('background-color', '#0000004c');
            $field.append($cloneSource);
            popupElement($cloneSource, e);
            $('body').css('cursor', 'none');
            if (islimit) {
                $cloneSource.hide();
                $('body').css('cursor', 'not-allowed');
            } else {
                $cloneSource.show(300);
                $('body').css('cursor', 'none');
            }
            callback(ievent);
        }).on('mouseup', function (e) {
            if (isDragging) {
                isDragging = false;
                ievent = {
                    data: e,
                    source: $ele,
                    target: e.target,
                    isDragging: isDragging
                };
                islimit = false;
                $cloneSource.css('background-color', $ele.css('background-color'));
                $cloneSource.remove();
                $('body').css('cursor', 'default');
                callback(ievent);
            }
        });
        $field.on('mouseleave', function () {
            if (!isDragging) return;
            islimit = true;
        });
        $field.on('mouseenter', function () {
            if (!isDragging) return;
            islimit = false;
        });

        function popupElement($source, e) {
            e.preventDefault();
            $source.show();
            var x = e.clientX - $field.offset().left, y = e.clientY - $field.offset().top;
            var orgw = $source[0].clientWidth, orgh = $source[0].clientHeight;
            var new_y = y - (orgh / 2);
            var new_x = x + 5;
            $source.css({ top: new_y, left: new_x });
        }
        function checkClone() {
            $cloneSource.addClass('itech-ievent-clone-source');
            $cloneSource.css({ position: 'absolute', top: 0, left: 0, 'z-index': 500 });
            $cloneSource.hide();
        }
    }
    resizeHandle($ele, callback) {
        var $e = $ele;
        var org_size = {
            width: $e.outerWidth(),
            height: $e.height()
        }
        var mth = "resize click musedown mouseup focous blur keydown change dbclick mouseover mouseout mousewheel keydown keyup keypress textinput touchstart touchmove touchend touchcancel resize scroll zoom select change submit reset";
        $(document).on(mth,
            function () {
                var new_size = {
                    width: $e.width(),
                    height: $e.height()
                };

                if (org_size.width != new_size.width || org_size.height != new_size.height) {

                    var size = {
                        heightIncrease: false,
                        heightDecrease: false,
                        widthIncrease: false,
                        widthDecrease: false
                    };
                    org_size.width > new_size.width ? size.widthDecrease = true :
                        org_size.width < new_size.width ? size.widthIncrease = true : null;
                    org_size.height > new_size.height ? size.heightDecrease = true :
                        org_size.height < new_size.height ? size.heightIncrease = true : null;

                    var diff = {
                        width: new_size.width - org_size.width,
                        height: new_size.height - org_size.height
                    }
                    var size_data = {
                        original_size: org_size,
                        new_size: new_size,
                        diff: diff
                    }
                    org_size = new_size;
                    var res_data = {
                        event: 'itechEvent',
                        handleObj: 'resize',
                        currentTarget: $e,
                        data: size_data,
                        checkSizing: size
                    }
                    callback(res_data);
                }
            });
    }
    //element resize handler
    contentEditableEvent($ele, callback) {
        var design = new Design();
        $ele.unbind('dblclick');
        $ele.on('dblclick', function (e) {
            if (!$(this).hasClass('content-editable')) {
                return;
            }
            if (!$(this).hasClass('edition-contents')) {
                e.stopPropagation();
                $(this).css('text-overflow', 'unset');
            } else {
                design.removeHover($(this));
                this.style.boxShadow = "";
            }
            $(this).attr('contenteditable', 'true');
            $(this).attr('autofocus', 'true');
            var data = {
                original_event: e,
                target: this,
                org_val: this.innerHTML,
                changes: '',
                onchange: false
            }
            $(this).unbind('click');
            $(this).on('click', function (e) {
                e.stopPropagation();
            })
            this.focus();

            if (!$(this).hasClass('edition-contents')) {
                design.style(this, { 'cursor': 'text', 'background-color': '#FFFFFF' });
            } else {
                design.style(this, { 'cursor': 'text' });
            }
            $(this).parent().addClass('active');
            $(this).unbind('blur');
            $(this).on('blur', function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                execute(this);
                return false;
            });
            $(this).unbind('keydown');
            $(this).on('keydown', function (e) {
                if (e.which === 13) {
                    execute(this);
                    return false;
                }
            });
            function execute(ele) {
                if (!isTextEditorOpen) {
                    if (ele.innerHTML != data.org_val) {
                        data.onchange = true;
                        data.changes = ele.innerHTML;
                    }
                    if (!$(ele).hasClass('edition-content')) {
                        ele.scrollLeft = 0;
                        $(ele).css('text-overflow', 'ellipsis');
                    } else {
                        design.addHover($(this), { "box-shadow": "inset 0px 0px 0px 2px lightblue" });
                    }
                    $(ele).unbind('click');
                    $(ele).removeAttr('contenteditable');
                    $(ele).removeAttr('autofocus');
                    $(ele).parent().removeClass('active');
                    if (!$(ele).hasClass('editon-contents')) {
                        design.style(ele, { 'cursor': 'unset', 'background-color': 'unset' });
                    } else {
                        design.style(ele, { 'cursor': 'unset' });
                    }
                    callback(data);
                }
            }
            callback(data);
        });
    }
    //content editable
    popUpMenuEvent($ele, callback) {
        $ele.on('contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = e.currentTarget;
            var data = {
                target: target,
                originalEvent: e
            }
            callback(data);
        });
    }
    //validator
    validate(selector) {
        var c = new Calculator();
        var validate = true;
        $(selector).on('mouseleave', function (e) {
            e.preventDefault();
            validate = false;
        });
        return {
            isAccess: function () {
                return validate;
            }
        }
    }

}
//Math
class Calculator {
    constructor() {

    }
    //percentage calculator
    percentage(main, percent) {
        var calculateR = 0.00;
        if (percent < 100) {
            if (percent < 10) {
                percent = percent * 100;
                var c = percent / 100;
                calculateR = c * 0.01;
            } else {
                percent = percent * 10;
                var c = percent / 100;
                calculateR = c * 0.1;
            }
        } else {
            calculateR = percent / 100;
        }
        var result = (calculateR * (main));
        return result;
    }
    //match parents
    matchParent(child, selector) {
        var parent = null;
        $(child).parents().each(function () {
            if ($(this).hasClass(selector)) {
                parent = this;
                return false;
            }
        });
        return parent;
    }
    //match child
    matchChild(parent, setting) {
        var matchby = setting.type;
        var matchvalue = setting.value;
        var found = false;
        function match(parent) {
            var result;
            $(parent).children().each(function () {
                var select;
                for (var i = 0; i < this.attributes.length; i++) {
                    if (this.attributes[i].nodeName == matchby &&
                        this.attributes[i].value == matchvalue) {
                        select = this;
                        found = true;
                        break;
                    }
                }
                if (found) {
                    result = select;
                    return false;
                } else {
                    if ($(this).children().length) {
                        select = match(this);
                        if (select) {
                            result = select;
                            return false;
                        }
                    }
                }
            });
            return result;
        }
        return match(parent);
    }
    //avoid multiple time
    loadFunction(callback) {
        if (advanceSetting.last >= (Date.now() - advanceSetting.delay)) {
            return;
        }
        advanceSetting.last = Date.now();
        callback(arguments);
    }
    //get child index
    childIndex(parent, child) {
        var index = 0;
        if ($(parent).children().length) {
            $(parent).children().each(function (i) {
                if (this == child) {
                    index = i;
                    return false;
                }
            });
        }
        return index;
    }
    //match text nodes
    coverText(parent) {
        parent.find(":not(iframe)").addBack().contents().filter(function () {
            return this.nodeType === Node.TEXT_NODE;
        }).each(function () {
            var tag = this.parentElement.tagName.toLowerCase();
            var spec = "";
            if (tag == 'u') {
                spec = "text-decoration: inherit;";
            }
            if ($(this).parent().text() != "") {
                if (!$(this).parent().hasClass('itech-text')) {
                    $(this).replaceWith('<span class="itech-text" style="display:inline;' + spec + '">'
                        + $(this).text() + '</span>');
                } else if ($(this).parent().children().length) {
                    $(this).replaceWith('<span class="itech-text" style="display:inline;' + spec + '">'
                        + $(this).text() + '</span>');
                }
            } else {
                $(this).remove();
            }
        });
    }
    analyseID(parent) {
        var c = this;
        var tag;
        $(parent).children().each(function () {
            tag = this.tagName;
            if (tag in ignor) {
                return;
            }
            if ($(this).children().length) {
                $(this).attr('id', 'editor-' + id);
                id++;
                c.analyseID(this);
                this.classList.add('drop-not-allowed');
                this.classList.add('main-c-selector');

            } else {
                $(this).attr('id', 'editor-' + id);
                id++;
                if ($(this).hasClass('itech-text') || $(this).hasClass('itech-img')) {
                    this.classList.add('move-content');
                    this.setAttribute('draggable', 'true');
                    this.classList.add('main-selector');
                }
            }
            this.classList.add('edition-contents');
        });
    }
    //get position
    currentPos(element, parent) {
        const bound = element.getBoundingClientRect();
        var pos = {
            top: bound.top,
            left: bound.left
        }
        if (parent) {
            var pb = parent.getBoundingClientRect();
            pos.top = pb.top - bound.top;
            pos.left = pb.left - bound.left;
        }
        return pos;
    }
    CUI(selector) {
        return {
            tree: function () {
                function isTreeType() {
                    return $(selector).attr("itech-data-tree") ? true : false;
                }
                return {
                    isTree: function () {
                        return isTreeType();
                    },
                    thumbnail: function () {
                        return isTreeType() ? $(selector).children().find('.thumbnail') :
                            null;
                    },
                    data: function () {
                        return isTreeType() ? $(selector).children().find('.branch-name')[0].innerText :
                            "";
                    }
                }
            },
            getType: function () {

            }
        }
    }
    //scrollable element offsets
    getOffset(ele) {
        var orgOf = {
            x: 0,
            y: 0
        },
            newOf = {
                x: 0,
                y: 0
            };
        if (ele != null) {
            ele.scrollLeft ? orgOf.x = ele.scrollLeft : null;
            ele.scrollTop ? orgOf.y = ele.scrollTop : null;
            ele.offsetLeft ? orgOf.x -= ele.offsetLeft : null;
            ele.offsetTop ? orgOf.y -= ele.offsetTop : null;
            if (ele.parentNode !== undefined) {
                newOf = this.getOffset(ele.parentNode);
            }
            orgOf.x = orgOf.x - newOf.x;
            orgOf.y = orgOf.y - newOf.y;
        }
        return orgOf;
    }
}
//UI
class UI {
    constructor() {
        this.calc = new Calculator();
        this.data = {
            layout: {
                data: {
                    setting: 0,
                    text: 0,
                }
            }
        }
    }
    //tree menu list
    treeList(body, callback) {
        function matchChild(parent) {

            var ul = i_create('ul');
            ul.classList.add('layer-list');
            var evt = new IEvent();
            var ui = new UI();
            if ($(parent).children().length) {
                $(parent).children().each(function () {
                    var ptg = this.tagName;
                    if (ptg in ignor) {
                        return;
                    }
                    var lab = initLab();
                    var editorTar = this;
                    $(lab.hide).on('click', function (e) {
                        e.stopPropagation();
                        if ($(this).hasClass('active')) {
                            $(editorTar).fadeTo("fast", 1);
                            $(this).removeClass('active');
                        } else {
                            $(editorTar).fadeTo("fast", 0);
                            $(this).addClass('active');
                        }
                    });
                    evt.onevent('popupmenu', $(lab.list), function (e) {
                        var loc = {
                            x: e.originalEvent.clientX,
                            y: e.target.offsetTop + ($(e.target).children().first().outerHeight() / 2)
                        }
                        $(e.target).children().first().addClass('active');
                        ui.popUpMenu(e.target, loc, 'treelist');
                    });
                    if ($(this).children().length) {
                        lab.main.classList.add('folder');
                        lab.logo.classList.add('gp-ico');
                        lab.list.classList.add('drop-not-allow');
                        lab.list.classList.add('fd');
                        $(this).removeClass('itech-text');
                        var tag = this.tagName.toLowerCase();
                        lab.content.innerHTML = tag;
                        lab.list.appendChild(matchChild(this));
                    } else {
                        lab.list.classList.add('fl');
                        if (ptg.toLowerCase() == "span") {
                            if ($(this).hasClass('itech-text')) {
                                var tag = this.innerText;
                                lab.content.innerHTML = tag;
                                lab.logo.classList.add('txt-ico');
                                lab.content.classList.add('up-text');
                            } else {
                                var tag = this.tagName.toLowerCase();
                                lab.content.innerHTML = tag;
                                lab.logo.classList.add('ele-ico');
                            }
                        } else if (ptg.toLowerCase() == 'img') {
                            lab.content.innerHTML = $(this).attr('alt');
                            lab.logo.classList.add('image-ico');
                        }
                        if (this.tagName.toLowerCase() == 'br') {
                            $(lab.list).addClass('edition-contents');
                        }
                    }
                    lab.content.setAttribute('data-edition-list', this.id);
                    lab.list.setAttribute('data-edition-list', this.id);
                    ul.appendChild(lab.list);
                });
            } else {
                return 'no branches found.';
            }
            return ul;
        }
        function initLab() {
            var li = i_create('li');
            li.setAttribute('draggable', 'true');
            li.setAttribute('itech-data-tree', true);
            li.classList.add('move-content');
            li.classList.add('main-branch');
            var div = i_create('div');
            div.classList.add('tree-branch');
            var lgo = i_create('span');
            lgo.classList.add('thumbnail');
            var spn = i_create('span');
            spn.classList.add('content-editable');
            spn.classList.add('branch-name');
            var right = i_create('span');
            right.classList.add('rgo');
            var hide = i_create('span');
            var del = i_create('span');
            hide.classList.add('thumbnail');
            hide.classList.add('hide-ico');
            hide.title = "Show/Hide";
            del.classList.add('thumbnail');
            del.classList.add('customize-ico');
            del.title = "Customize element";
            i_append(right, hide, del);
            var spnwrapper = i_create('div');
            spnwrapper.classList.add('spn-wrapper');
            i_append(spnwrapper, spn, right);
            i_append(div, lgo, spnwrapper);
            li.appendChild(div);
            return {
                list: li,
                main: div,
                logo: lgo,
                content: spn,
                hide: hide,
                del: del
            }
        }
        callback(matchChild(body));
    }
    //Open hidden branch
    openBranch(branch) {
        $('.tree-branch').removeClass('select');

        $(branch).children().first().addClass('select');
        $(branch).parents().children().each(function () {
            if ($(this).hasClass('folder')) {
                $(this).parent().addClass('active');
                $(this).children().first().addClass('active');
            }
        });
        var animaiton = new IAnimation();
        animaiton.scroll($('.layer'), $(branch).children().first());
    }
    //update curent tree
    updateTree(branch) {
        this.openBranch(branch);
        function update() {
            $(branch).children().first().addClass('select');

            $(branch).children().each(function () {
                if ($(this).hasClass('layer-list')) {
                    $(this).remove();
                }
            });
            var x = i_id($(branch).attr('data-edition-list'));
            var t = new IText();
            t.analyseText(x);
            var cal = new Calculator();
            cal.analyseID(x);
            var thumbnail = $(branch).children().find('.thumbnail')[0];
            var cont = $(branch).children().find('.content-editable')[0];
            $(thumbnail).removeClass('txt-ico');
            thumbnail.innerHTML = "";
            $(cont).removeClass('up-text');
            var tg = x.tagName.toLowerCase();
            cont.innerHTML = tg;
            var ui = new UI();
            var newb;
            ui.treeList(x, function (data) {
                newb = data;
            });
            var t = new IText();
            t.analyseText(newb);
            branch.classList.add('drop-not-allow');
            $(branch).children().first().addClass('folder');
            $(branch).children().first().children().first().removeClass('ele-ico');
            $(branch).children().first().children().first().addClass('gp-ico');
            branch.appendChild(newb);
            itech('.folder').folder().toggle(function (e) {
                e.e.preventDefault();
            });
            itech('.content-editable').lightData().contentEditable();
            itech('.move-content').lightData().move();
            var design = new Design();
            design.addHover($('.edition-contents.content-editable'),
                { 'box-shadow': '0px 0px 0px 2px lightblue' });
            if (!$(branch).hasClass('active')) {
                $(branch).children().first()[0].click();
            }
            analyseUse(branch);
            return branch;
        }
        function analyseUse(branch) {
            $(branch).children().find('.content-editable').each(function () {
                if (this.innerHTML == null || this.innerHTML.trim().length == 0) {
                    var ref_id = $(this).data("edition-list");
                    var x = i_id(ref_id);
                    $(x).remove();
                    $(this).parents().each(function () {
                        if ($(this).hasClass('tree-branch')) {
                            $(this).remove();
                            return false;
                        }
                    })
                }
            })
        }
        return this.calc.loadFunction(update);
    }
    //Pop up menu
    popUpMenu(parent, loc, type) {
        var cmd = "";
        var evt = new IEvent();
        const createMenu = function (name) {
            var m = i_create('nav');
            m.innerHTML = name;
            return m;
        }
        const data = {
            treeList: {
                'Source': [{
                    name: 'Layouts',
                    element: createMenu('Layouts')
                }, {
                    name: 'Style',
                    element: createMenu('Style')
                },
                {
                    name: 'Contents',
                    element: createMenu('Contents')
                }
                ],
                'Edit': [{
                    name: 'Select/Unselect',
                    element: createMenu('Select/Unselect')
                }, {
                    name: 'Add',
                    element: createMenu('Add')
                }, {
                    name: 'Copy',
                    element: createMenu('Copy')
                },
                {
                    name: 'Paste',
                    element: createMenu('Paste')
                },
                {
                    name: 'Delete',
                    element: createMenu('Delete')
                }],
                'Group': [{
                    name: 'Group/Ungroup',
                    element: createMenu('Group/Ungroup')
                }, {
                    name: 'Send Forward',
                    element: createMenu('Send Forward')
                },
                {
                    name: 'Send Backward',
                    element: createMenu('Send Backward')
                }
                ],
                'Export': [{
                    name: 'Export',
                    element: createMenu('Export')
                }, {
                    name: 'Export as Image',
                    element: createMenu('Export as Image')
                }
                ],
            },
        }
        var design = new Design();

        init();
        function init() {
            createPopUp();
        }
        function createPopUp() {
            var p = i_create('div');
            var c = i_create('div');
            design.style(p, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '0',
                left: '0',
                'z-index': '110',
                'font-size': '.9em'
            });
            design.style(c, {
                position: 'absolute',
                width: '300px',
                left: loc.x + 'px',
                'z-index': '120',
                'background-color': '#FFFFFF',
                'box-shadow': '5px 5px 10px #000000cc',
                'max-height': '90%',
                'overflow-y': 'auto',
                'overflow-x': 'hidden',
                'box-sizing': 'border-box',
                'display': 'none',
                'border-radius': '5px'
            });
            menu(c, type);
            p.appendChild(c);
            $(c).fadeIn(350);
            evt.onevent('click', $(p), function (e) {
                $(p).fadeOut(function () {
                    $(this).remove();
                });
                $(parent).children().first().removeClass('active');
            });
            $('body').append(p);
            analysePos(loc, c);
        }
        function analysePos(loc, c) {
            var l = loc.y + $(c).outerHeight();
            if (l > window.innerHeight) {
                design.style(c, { top: window.innerHeight - ($(c).outerHeight() + 5) + 'px' });
            } else {
                design.style(c, {
                    top: loc.y + 'px',
                });
            }
        }
        function menu(ele, type) {
            if (type = 'treelist') {
                cmd = parent.getAttribute('data-edition-list');
                var list = data.treeList;
                for (const key in list) {
                    if (Object.hasOwnProperty.call(list, key)) {
                        const value = list[key];
                        var box = i_create('div');
                        design.style(box, { 'border-bottom': '2px solid #666' });
                        value.forEach(val => {
                            box.appendChild(val.element);
                            design.style(val.element, {
                                padding: '5px 10px',
                                'box-sizing': 'border-box',
                                'cursor': 'pointer'
                            });
                            design.addHover($(val.element), { 'background-color': '#0000004c' });
                            evt.onevent('click', $(val.element), function (e) {
                                //   e.stopPropagation();

                                var lightBox = new LightBox();
                                var box = lightBox.makeLightBox();
                                var content = i_create("h2");
                                var layout = new UI.Layout();
                                var layoutlist = layout.LayoutPanel();
                                content.innerHTML = "Layouts";
                                $(content).css('text-align', 'center');
                                var button = new UI.Button();
                                var btnwrapper = button.generateButtons([
                                    "Apply", "Close"
                                ]);
                                i_append(lightBox.viewer, content, layoutlist, btnwrapper);
                                button.btns.forEach(btn => {
                                    $(btn).on('click', function (e) {
                                        e.preventDefault();
                                        layout.applyBehaviour(i_id(cmd), {
                                            layout: Number(layoutSetting.layout)
                                        });
                                    });
                                });
                                $('body').append(box);
                                $(box).fadeIn(350);

                            });
                        });
                        ele.appendChild(box);
                    }
                }
            }
        }
    }
    //Template
    Template(template) {
        var design = new Design();
        function defaultTemplate() {
            var wrapper = i_create('div');
            var hdr_sec = i_create('section');
            var header = i_create('header');
            var container_01 = i_create('div');
            var container_011 = i_create('div');
            var container_02 = i_create('div');
            var container_03 = i_create('div');
            var section = i_create('section');
            var footer = i_create('footer');
            var logo = i_create('h1');
            var a = i_create('a');
            a.style.color = "#FFFFFF";
            var navigation = i_create('nav');
            var hdr_blk = i_create('div');
            var hdr_h2 = i_create('h2');
            hdr_h2.style.color = "#ffd700";
            var hdr_p = i_create('p');
            hdr_p.style.color = "#f5f5dc";
            var img = i_create('img');
            img.alt = "My Photo";
            img.src = "/src/img/img_default_template.jpg";

            var navs = i_lists({ li: 'li', child: 'a', content: 'Home' },
                { li: 'li', child: 'a', content: 'Simple' },
                { li: 'li', child: 'a', content: 'About Us' },
                { li: 'li', child: 'a', content: 'Contact Us' });
            navs.style.color = "#FFFFFF";
            var h2 = i_create('h2');
            var p = i_create('p');
            var cpy = i_create('small');
            cpy.innerHTML = '<span>Copy &copy; Right Reserved, POWER BY </span><a href="#" style="color:rgb(38, 81, 160);">i-TECH</a>';
            h2.innerHTML = 'HELLO WORLD';
            p.innerHTML = 'Welcome to ART-Web Design. Make your first a powerful, stylish, fast and easy website. We offered many free tools for you.Try it now!';
            a.innerHTML = 'LOGO';
            a.href = "#";
            hdr_h2.innerHTML = "WELCOME TO ART-WEB DESIGN";
            hdr_p.innerHTML = "Start making your awesome websit today";

            design.draw($(wrapper), design.type.WRAPPER);
            design.draw($(header), design.type.HEADER);
            design.draw($(container_01), design.type.CONTAINER);
            design.draw($(container_02), design.type.CONTAINER, { 'text-align': 'center', 'padding': '150px 0px' });
            design.draw($(container_03), design.type.CONTAINER, { 'text-align': 'center' });
            design.draw($(container_011), design.type.CONTAINER, { 'text-align': 'center' });
            design.draw($(hdr_sec), design.type.HEADER_SECTION);
            design.draw($(section), design.type.SECTION);
            design.draw($(footer), design.type.FOOTER);
            design.draw($(navs), design.type.NAVIGTION_LIST);
            design.style(logo, { float: 'left' });
            design.style(navigation, { float: 'right' });
            design.style(a, { display: 'inline-block' });
            design.style(p, { padding: '0px 50px', width: '60%', margin: '0px auto' });
            design.style(hdr_blk, {
                'width': '80%', 'margin': '100px auto', 'padding': '10px',
                'box-sizing': 'border-box', 'text-align': 'center', 'color': '#FFFFFF'
            });
            design.style(hdr_h2, { 'font-size': '35px' });
            design.style(img, { width: '40%', margin: '5px auto' });
            container_01.classList.add('clearfix');

            i_append(logo, a);
            i_append(navigation, navs);
            i_append(container_01, logo, navigation);
            i_append(container_011, hdr_blk);
            i_append(hdr_blk, hdr_h2, hdr_p);
            i_append(header, container_01, container_011);
            i_append(hdr_sec, header);
            i_append(container_02, h2, p, img);
            i_append(section, container_02);
            i_append(container_03, cpy);
            i_append(footer, container_03);
            i_append(wrapper, hdr_sec, section, footer);

            wrapper.id = 'editor-0';
            return wrapper;
        }
        if (!template) {
            var wrapper = defaultTemplate();
            var text = new IText();
            text.analyseText(wrapper);
            analyseContents(wrapper);
            var cal = new Calculator();
            cal.analyseID(wrapper);
            return wrapper;
        }

        function analyseContents(wrapper) {
            match(wrapper);
            var ignor = { 'BR': 0 };
            function match(parent) {
                $(parent).children().each(function () {
                    if ($(this).children().length) {
                        match(this);
                    } else {
                        $(this).addClass('content-editable');
                        if (this.tagName.toLowerCase() == 'img') {
                            $(this).addClass('image-editable move-content itech-img');
                        }
                    }
                });
            }
        }
    }
    //Layout
    static Layout = class {
        constructor() {
            this.data = {
                layoutItems: [],
                alignItems: []
            };
            this.behaviour = {
                HORIZONTAL_FLEX: 0,
                VARTICAL_FLEX: 1,
                GRID: 2,
                FLOAT: 3,
                ABSOLUTE: 4
            }
        }
        LayoutPanel() {
            var layout = this;
            var wrap = i_create('div');
            var ul = i_create('ul');
            $(wrap).css({
                'width': '100%',
                'padding': '15px',
                'box-sizing': 'border-box'
            });

            var ul = i_lists({ li: 'li', child: 'span', class: 'layout-data', title: 'Horizontal Flex Layout', content: 'Horizontal Flex Layout', attr: { key: 'data-layout', value: 0 } },
                { li: 'li', child: 'span', class: 'layout-data', title: 'Horizontal Flex Layout', content: 'Horizontal Flex Layout', attr: { key: 'data-layout', value: 1 } },
                { li: 'li', child: 'span', class: 'layout-data', title: 'Grid Layout', content: 'Grid Layout', attr: { key: 'data-layout', value: 2 } },
                { li: 'li', child: 'span', class: 'layout-data', title: 'Float Layout', content: 'Float Layout', attr: { key: 'data-layout', value: 3 } },
                { li: 'li', child: 'span', class: 'layout-data', title: 'Absolute Layout', content: 'Absolute Layout', attr: { key: 'data-layout', value: 4 } }
            );
            $(ul).css({
                'list-style': 'none',
                'text-align': 'center',
                'padding': '10px',
                'box-sizing': 'border-box'
            });
            $(ul).children().css({
                'display': 'inline',
                'text-align': 'left',
                'padding': '5px',
                'box-sizing': 'border-box',
                'border-radius': '5px',
                'width': '100%',
                'margin': '5px auto',
                'cursor': 'pointer'
            });
            $(ul).children().each(function () {
                layout.data.layoutItems.push(this);
                $(this).on('click', function (e) {
                    e.preventDefault();
                    $(ul).children().css('color', 'inherit');
                    $(this).css('color', '#c2185b');
                    layoutSetting.layout = this.dataset['layout'];
                });
            });
            wrap.appendChild(ul);
            return wrap;
        }
        /**
         * Data to apply
         * @param {Element} element
         * @param {JSON} data 
         */
        applyBehaviour(element, data) {
            var designer = new Design();
            console.log(element, data.layout);
            if (data.layout == this.behaviour.HORIZONTAL_FLEX) {
                designer.draw($(element), designer.type.FLEXCOLUMN);
            }
            if (data.layout == this.behaviour.VARTICAL_FLEX) {
                designer.draw($(element), designer.type.FlEXROW);
            }
            if (data.layout == this.behaviour.GRID) {
                designer.draw($(element), designer.type.FLEXCOLUMN);
            }
            if (data.layout == this.behaviour.HORIZONTAL_FLEX) {
                designer.draw($(element), designer.type.FLEXCOLUMN);
            }
        }
    }
    //buttons
    static Button = class {
        constructor() {
            this.btns = [];
        }
        /**
         * generate buttons
         * @param {Array<String>} btns 
         */
        generateButtons(btns) {
            var designer = new Design();
            var btnwrapper = i_create('div');
            designer.draw($(btnwrapper), designer.type.CONTENTCENTER);
            btns.forEach(btn => {
                var button = i_create('button');
                designer.draw($(button), designer.type.BUTTON);
                designer.addHover($(button), { backgroundColor: '#0000004c' });
                button.innerHTML = btn;
                $(button).attr('data-btns', btn);
                this.btns.push(button);
                btnwrapper.appendChild(button);
            });
            return btnwrapper;
        }
    }
}
//text editor
class TextEditor {
    constructor() {
        this.editor = i_create('div');
    }
    intiEditor(ele) {
        this.editorAction(ele);
    }
    generateEditor() {
        var design = new Design();
        var editor = i_create('div');
        design.draw($(editor), design.type.TEXTEDITOR_BOX, { 'display': 'none' });
        editor.classList.add('itech-text-editor-box');
        var navs = i_lists({ li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon bold-ico', title: 'Bold' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon italic-ico', title: 'Italic' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon underline-ico', title: 'Undeline' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon font-ico', title: 'Font' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon edit-ico', title: 'Edit Content' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon color-ico', title: 'Color' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon hiliteColor-ico', title: 'Hightlight Color' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon align-ico', title: 'Text Align' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon hyper-link-ico', title: 'Create Link' },
            { li: 'li', child: 'a', class: 'font-awesome-usage itech-text-editor-icon close-ico', title: 'close' }
        );


        design.draw($(navs), design.type.NAVIGTION_LIST, { margin: 0 });
        i_append(editor, navs);

        return editor;
    }

    editorAction(element) {
        var design = new Design();
        var mianEdit = this;
        $(element).on('click', function (e) {
            e.stopPropagation();
        });
        design.style(element, { position: 'relative' });
        $(element).unbind('mouseup');
        $(element).on('mouseup', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var selection = window.getSelection().toString().trim();
            if (selection.length >= 1) {
                if (!isTextEditorOpen) {
                    mianEdit.editor = mianEdit.generateEditor();
                    $(element).append($(mianEdit.editor));
                    var client_loc = initLoc(e, this);
                    commandAction();
                    design.style(mianEdit.editor, {
                        'top': client_loc.y + 'px',
                        'left': client_loc.x + 'px'
                    });
                    $(mianEdit.editor).slideDown();
                    isTextEditorOpen = true;
                }

            } else {

                if (isTextEditorOpen) {
                    mianEdit.restoreDefault();
                }
            }
            function initLoc(e, ele) {
                var width = $(mianEdit.editor).outerWidth(),
                    parentWith = $(ele).outerWidth() + $(ele).offset().left;
                var loc = {
                    x: e.clientX - $(ele).offset().left,
                    y: (e.clientY - $(ele).offset().top) + ele.scrollTop
                };
                if (e.clientX > parentWith - width) {
                    loc.x = loc.x - width;
                }
                return loc;
            }
            removeUnused();
        });
        function commandAction() {
            var editordata = ['bold', 'italic', 'underline', 'font', 'edit', 'color', 'hiliteColor', 'align', 'link', 'close'];
            $(mianEdit.editor).children().first().children().each(function (i) {
                $(this).attr('data-itech-text-editor-cmd', editordata[i]);
                $(this).on('click', function (e) {
                    e.preventDefault();
                    var cmd = $(this).data('itech-text-editor-cmd');
                    executeSelection(this, cmd);
                });
            });
        }
        function executeSelection(parent, cmd) {
            var design = new Design();
            switch (cmd) {
                case 'font':
                    isFloatListBoxOpen ? $('.itech-float-list-box').remove() : null;
                    var inp = design.drawFloatListBox(6, 'a');
                    design.style(parent, { 'position': 'relative' });
                    $(inp).children().addClass('font-awesome-usage itech-text-editor-icon');
                    var fontdata = ['letter-spacing', 'lineheight', 'text-shadow', 'strikeThrough', 'subscript', 'superscript'];
                    $(inp).children().each(function (i) {
                        $(this).addClass(fontdata[i]);
                        $(this).attr('title', fontdata[i]);
                        $(this).on('click', function (e) {
                            execAddition(fontdata[i], null);
                        });
                    });

                    inp.style.left = "0";
                    inp.style.top = "100%";
                    parent.appendChild(inp);
                    break;
                case 'align':
                    isFloatListBoxOpen ? $('.itech-float-list-box').remove() : null;
                    var inp = design.drawFloatListBox(4, 'a');
                    design.style(parent, { 'position': 'relative' });
                    $(inp).children().addClass('font-awesome-usage itech-text-editor-icon');
                    var data = ['justifyFull', 'justifyLeft', 'justifyCenter', 'justifyRight'];
                    $(inp).children().each(function (i) {
                        $(this).addClass(data[i]);
                        $(this).attr('title', data[i]);
                        $(this).on('click', function (e) {
                            e.preventDefault();
                            execAddition(data[i], null);
                        })
                    });


                    inp.style.left = "0";
                    inp.style.top = "100%";
                    parent.appendChild(inp);
                    break;
                case 'color':
                    isFloatListBoxOpen ? $('.itech-float-list-box').remove() : null;
                    var inp = design.drawFloatListBox(9, 'a');
                    design.style(parent, { 'position': 'relative' });
                    $(inp).children().addClass('font-awesome-usage itech-text-editor-icon color-sq-ico');
                    var data = [
                        '#CAE7DF', '#3778C2', '#28559A',
                        '#EE7879', '#E42C6A', '#E12B38',
                        '#FCD02C', '#FCC133', '#3EB650'
                    ];
                    $(inp).children().each(function (i) {
                        $(this).css('color', data[i]);
                        $(this).attr('title', data[i]);
                        $(this).on('click', function (e) {
                            e.preventDefault();
                            execAddition('foreColor', data[i]);
                        });
                    });
                    inp.style.left = "0";
                    inp.style.top = "100%";
                    parent.appendChild(inp);
                    break;
                case 'edit':
                    isFloatListBoxOpen ? $('.itech-float-list-box').remove() : null;
                    var inp = design.drawFloatListBox(1, 'input');
                    parent.append(inp);
                    design.style(parent, { 'position': 'relative' });
                    var cust = inp.firstElementChild;
                    cust.value = window.getSelection().toString().trim();
                    var node = getParentSelection();
                    var span;
                    if (node.innerHTML == window.getSelection().toString().trim()
                        || $(node).parent().hasClass('qr-edit')) {
                        span = node;
                    } else {
                        span = createRange('span');
                    }
                    var orgV = {
                        'background-color': node.style.backgroundColor,
                        'color': node.style.color
                    };

                    design.style(span, { 'background-color': 'blue', 'color': '#FFFFFF' });
                    cust.focus();
                    $(cust).on('click mouseup mousedown', function (e) {
                        e.stopPropagation();
                    });
                    $(cust).on('input', function (e) {
                        e.preventDefault();
                        span.innerHTML = this.value;
                    });
                    $(cust).on('keydown', function (e) {
                        e.stopPropagation();
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            e.preventDefault();
                            design.style(span, orgV);
                            mianEdit.restoreDefault();
                            return false;
                        }
                    });
                    $(cust).on('blur', function (e) {
                        e.preventDefault();
                        design.style(span, orgV);
                        mianEdit.restoreDefault();
                    });
                    break;
                case 'hiliteColor':
                    isFloatListBoxOpen ? $('.itech-float-list-box').remove() : null;
                    var inp = design.drawFloatListBox(9, 'a');
                    design.style(parent, { 'position': 'relative' });
                    $(inp).children().addClass('font-awesome-usage itech-text-editor-icon color-sq-ico');
                    var data = [
                        '#CAE7DF', '#3778C2', '#28559A',
                        '#EE7879', '#E42C6A', '#E12B38',
                        '#FCD02C', '#3EB650', 'transparent'
                    ];
                    $(inp).children().each(function (i) {
                        if (data[i] == 'transparent') {
                            $(this).css('color', '#0000004c');
                        } else {
                            $(this).css('color', data[i]);
                        }
                        $(this).attr('title', data[i]);
                        $(this).on('click', function (e) {
                            e.preventDefault();
                            execAddition(cmd, data[i]);
                        });
                    });
                    inp.style.left = "0";
                    inp.style.top = "100%";
                    parent.appendChild(inp);
                    break;
                case 'link':
                    isFloatListBoxOpen ? $('.itech-float-list-box').remove() : null;
                    var inp = design.drawFloatListBox(1, 'input');
                    parent.append(inp);
                    design.style(parent, { 'position': 'relative' });
                    var cust = inp.firstElementChild;
                    cust.value = "https:/" + window.getSelection().toString().trim();
                    var node = getParentSelection();
                    var span = createRange('a');
                    span.href = "https:/" + cust.value;
                    var orgV = {
                        'background-color': node.style.backgroundColor,
                        'color': node.style.color
                    };

                    design.style(span, { 'background-color': 'blue', 'color': '#FFFFFF' });
                    cust.focus();
                    $(cust).on('click mouseup mousedown', function (e) {
                        e.stopPropagation();
                    });
                    $(cust).on('input', function (e) {
                        e.preventDefault();
                        span.href = this.value;
                    });
                    $(cust).on('keydown', function (e) {
                        e.stopPropagation();
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            e.preventDefault();
                            design.style(span, orgV);
                            mianEdit.restoreDefault();
                            return false;
                        }
                    });
                    $(cust).on('blur', function (e) {
                        e.preventDefault();
                        design.style(span, orgV);
                        mianEdit.restoreDefault();
                    });
                    break;
                case 'close':
                    document.execCommand(null, false, null);
                    mianEdit.restoreDefault();
                    break;
                default:
                    document.execCommand(cmd, false, null);
                    addRangeId();
                    mianEdit.restoreDefault();
            }
            function execAddition(cmd, value) {
                if (cmd in defaultTextEditorSetting) {
                    execCustom(cmd);
                } else {
                    document.execCommand(cmd, false, value);
                    addRangeId();
                    mianEdit.restoreDefault();
                }
            }
            function execCustom(cmd) {
                var node = getParentSelection();
                var selection = window.getSelection().toString().trim();
                var org = node.style.getPropertyValue(cmd);
                if (node.innerHTML == selection) {
                    if (org) {
                        node.style.setProperty(cmd, '');
                    } else {
                        node.style.setProperty(cmd, defaultTextEditorSetting[cmd]);
                    }
                } else {
                    var span = createRange('span');
                    if ($(node).hasClass('qr-edit')) {
                        $(node).remove();
                    }
                    if (org != '') {
                        span.style.setProperty(cmd, '');
                    } else {
                        span.style.setProperty(cmd, defaultTextEditorSetting[cmd]);
                    }
                }
                mianEdit.restoreDefault();
            }
            function getParentSelection() {
                var parent = null, sel;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.rangeCount) {
                        parent = sel.getRangeAt(0).commonAncestorContainer;
                        if (parent.nodeType != 1) {
                            parent = parent.parentNode;
                        }
                    }
                } else if ((sel = document.section) && sel.type != 'Control') {
                    parent = sel.createRange().parentElement();
                }
                return parent;
            }
            function createRange(node) {
                var text = window.getSelection();
                var span = i_create(node);
                span.textContent = text.toString().trim();
                var rang = text.getRangeAt(0);
                rang.deleteContents();
                rang.insertNode(span);
                span.classList.add('qr-edit');
                span.classList.add('itech-text');
                span.id = "editor-" + id;
                id++;
                return span;
            }
            function addRangeId() {
                var selectnode = window.getSelection().focusNode.parentNode;
                selectnode.id = "editor-" + id;
                id++;
            }
        }
        function removeUnused() {
            $('.qr-edit').each(function () {
                if (this.innerHTML == "") {
                    this.remove();
                }
            });
        }
    }

    restoreDefault() {
        if (window.getSelection) {
            window.getSelection().empty ?
                window.getSelection().empty() :
                window.getSelection().removeAllRanges ?
                    window.getSelection().removeAllRanges() :
                    null;
        }
        if (isTextEditorOpen) {
            $(this.editor).slideUp(350, function () {
                $(this).remove();
            });
        }
        isTextEditorOpen = false;
        isFloatListBoxOpen = false;
    }
}
//text 
class IText {
    constructor() {

    }
    analyseText(parent) {
        var c = new Calculator();
        c.coverText($(parent));
    }
    convertToClass(text) {
        var x = text.toLowerCase().trim();
        return x.replace(/ /g, "-");
    }
}
//layour
class Layout {
    constructor() {
        this.layout = {
            FLOAT: 0,
            FLEX: 1,
            GRID: 2,
            ABSOLUTE: 3,
            OTHER: -1
        }
    }
    getLayout(element) {
        if (element && $(element).children().length) {
            var mark = "";
            if (element.style.display) {
                mark = element.style.display;
            } else if (element.style.position) {
                mark = element.style.position;
            } else {
                $(element).children().each(function () {
                    if (this.style.float) {
                        mark = "float";
                        return false;
                    }
                });
            }
            return getMarked(mark);
        } else {
            return "Cannot load layout of the selected element!";
        }
        function getMarked(mark) {
            if (mark.includes("float")) {
                return new Layout().layout.FLOAT;
            } else
                if (mark.includes("flex")) {
                    return new Layout().layout.FLEX;
                } else
                    if (mark.includes("grid")) {
                        return new Layout().layout.GRID;
                    } else
                        if (mark.includes("relative") || mark.includes("absolute") || mark.includes("fixed")) {
                            return new Layout().layout.ABSOLUTE;
                        } else {
                            return new Layout().layout.OTHER;
                        }
        }
    }
}
/*
 * Model box
*/
class LightBox {
    constructor() {
        this.designer = new Design();
        this.viewer = null;
        this.model = null;
    }
    makeLightBox() {
        var wrap = this.wrapper();
        var box = this.box(true);
        this.viewer = box;
        this.model = wrap;
        $(wrap).append(box);
        return wrap;
    }
    wrapper() {
        var wrap = i_create('div');
        this.designer.draw($(wrap), this.designer.type.MODALCONTAINER);
        wrap.classList.add('data-model-wrapper');
        $(wrap).on('click', function (e) {
            e.preventDefault();
            $(this).fadeOut(250, function () {
                $(this).remove();
            });
        });
        return wrap;
    }
    box(closable) {
        var boxer = i_create('div');
        this.designer.draw($(boxer), this.designer.type.MODALBOX, { 'display': 'block' });
        boxer.classList.add('data-model-box');
        if (closable) {
            $(boxer).css({ 'position': 'relative' });
            var icon = i_create('span');
            $(boxer).append(icon);
            $(icon).addClass('font-awesome-usage notification-nti-cls-ico');
            this.designer.draw($(icon), this.designer.type.CONTENTCENTER,
                {
                    'width': '20px', 'height': '20px', 'cursor': 'pointer',
                    'border-radius': '50%', 'position': 'absolute', 'top': '5px', 'right': '5px'
                });
            this.designer.addHover($(icon), { 'background-color': '#0000004c', 'color': 'red' });
            $(icon).on('click', function (e) {
                e.stopPropagation();
                $('.data-model-wrapper')[0].click();
            });
        }
        $(boxer).on('click', function (e) {
            e.stopPropagation();
        });

        return boxer;
    }
    addView(view) {
        this.viewer.appendChild(view);
    }
    distory() {
        $(this.model).remove();
    }
}
//var d = 1000;
//var m = 10000;
//function currency(m) {
//    return m / d;
//}
//function percentage(m) {
//    return (2 /100)  * currency(m);
//}
//console.log(currency(m) - percentage(m));