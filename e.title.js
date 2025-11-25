document.addEventListener('DOMContentLoaded', function () {
	var e_title = document.createElement('div');
	var e_title_op = null;

	e_title.style.position = 'absolute';
	e_title.style.opacity = '0';
	e_title.style.background = '#fff';
	e_title.style.padding = '2px 4px';
	e_title.style.borderRadius = '5px';
	e_title.style.border = '1px solid #ccc';
	e_title.style.color = '#444';
	e_title.style.whiteSpace = 'nowrap';
	e_title.style.overflow = 'hidden';
	e_title.style.pointerEvents = 'none';
	e_title.style.zIndex = '9999';

	document.body.append(e_title);

	document.querySelectorAll('[e-title]').forEach(function (el) {
		el.addEventListener('mouseenter', function () {
			if (e_title_op) { clearInterval(e_title_op); }

			e_title.style.display = 'block';
			e_title.innerText = el.getAttribute('e-title');
			e_title.style.opacity = 0;

			let coord = el.getBoundingClientRect();
			let scrollX = window.scrollX;
			let scrollY = window.scrollY;

			let topCenter = coord.x + (coord.width / 2);

			e_title.style.top = '0px';
			e_title.style.left = '0px';
			let tt = e_title.getBoundingClientRect();
			let div_w = tt.width;
			let div_h = tt.height;

			let top = coord.y + scrollY - div_h - 8;
			let left = topCenter + scrollX - (div_w / 2);

			let docW = document.documentElement.clientWidth;
			let docH = document.documentElement.clientHeight;

			if (left < scrollX + 4) left = scrollX + 4;
			if (left + div_w > scrollX + docW) left = scrollX + docW - div_w - 4;

			if (top < scrollY) {
				top = coord.y + scrollY + coord.height + 8;
			}
			if (top + div_h > scrollY + docH) {
				top = scrollY + docH - div_h - 4;
			}

			e_title.style.top = top + 'px';
			e_title.style.left = left + 'px';

			e_title_op = setInterval(function () {
				e_title.style.opacity = Number(e_title.style.opacity) + 0.1;
				if (Number(e_title.style.opacity) >= 0.9) {
					clearInterval(e_title_op);
				}
			}, 50);
		});

		el.addEventListener('mouseleave', function () {
			if (e_title_op) { clearInterval(e_title_op); }
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