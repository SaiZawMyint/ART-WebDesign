window.i = function (selector) {
    var selectors = _(selector);
    function command() {
        [].forEach.call(selectors, cmd);
    }
    return {
        /**
        * Splitor
        * -------
        * 
        * Make a splitable panal by configuration setting.
        * To make a splitable panal, 
        * need to configure left and right panel and main wrapper in setting 
        * (eg. spilitor)
        * To learn more about splitor {@link "www.i-tech.com/doc/ui/splitor"}
        *  
         * @param {Object} setting 
         */
        spilitor: function (setting) {
            command(function (ele) {
                setting.wrapper = ele;
                var splitor = new Splitor(setting);
                splitor.init();
            })
        }
    }
}
/**
 * 
 * @param {*} selector 
 * @returns 
 */
function _(selector) {
    return document.querySelectorAll(selector);
}
function _create(tag) {
    return document.createElement(tag);
}

/**
 
 * @param {Object} setting
 */
class Splitor {
    constructor() {
        this.config = {
            wrapper: new Element(),
            split: new String("x"|"y"),
            size: new Number(),
            location: ''
        };
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
    init(setting) {
        this.config = setting;
        var parent = this.config.wrapper;
        var children = this.initLeftRight(this.config.wrapper);
        var left = children.left;
        var right = children.right;
        this.addComponent(parent, left, right, setting);
    }
    /**
     * Init Children
     * @param {Element} wrapper
     * @return {Object}
     */
    initLeftRight(wrapper) {
        if (wrapper.childElementCount != 2) {
            throw new Error("The wrapper must have two component left and right!");
        }
        return {
            left: function () {  
                return wrapper.firstChild;
            },
            right: function () {
                return wrapper.lastChild;
            }
        }
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