
document.addEventListener('DOMContentLoaded', function () {
    var e_title = document.createElement('div');
    var e_title_op = null;
    e_title.style.position = 'fixed';
    e_title.style.opacity = '0';
    e_title.style.background = '#fff';
    e_title.style.padding = '2px 4px';
    e_title.style.borderRadius = '5px';
    e_title.style.border = '1px solid #ccc';
    e_title.style.color = '#444';
    e_title.style.whiteSpace = 'nowrap';
    e_title.style.overflow = 'hidden';

    document.querySelector('body').append(e_title);
    document.querySelectorAll('[e-title]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            if (e_title_op) { clearInterval(e_title_op) }
            e_title.style.display = 'block';
            e_title.innerText = el.getAttribute('e-title');
            let coord = el.getBoundingClientRect();
            // Точка верх середина елемента
            let topCenter = coord.x + (coord.width / 2);
            let tt = e_title.getBoundingClientRect();
            // Размер title
            let div_w = tt.width;
            let div_h = tt.height;
            e_title.style.top = (coord.y - div_h - 2) + 'px';
            e_title.style.left = (topCenter - (div_w / 2)) + 'px';
            e_title.style.opacity = 0;
            e_title_op = setInterval(function () {
                e_title.style.opacity = Number(e_title.style.opacity) + 0.1;
                if (Number(e_title.style.opacity) >= 0.9) {
                    clearInterval(e_title_op)
                }
            }, 50);
        });
        el.addEventListener('mouseleave', function () {
            if (e_title_op) { clearInterval(e_title_op) }
            e_title_op = setInterval(function () {
                e_title.style.opacity = Number(e_title.style.opacity) - 0.1;
                if (Number(e_title.style.opacity) <= 0) {
                    clearInterval(e_title_op);
                    e_title.innerText = '';
                    e_title.style.display = 'none';
                }
            }, 50);
        });
    });
});

