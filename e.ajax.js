/**
 * .ajaxClick        - Класс для подключения элемента. Работа по клику
 * .ajaxLoad         - Класс для подключения элемента. Работа при загрузке
 * href или data-url - Параметры указывающие путь
 * data-method       - GET или POST
 * data-id           - Указывает на элемент для вывода
 */

/**
 * 
 * @param {string} url - адрес
 * @param {object} data - Данные для сервера
 * @param {function} funSuccess - функция вызывается при успехе
 * @param {function} funError  - функция вызывается при ошибке
 * @param {object} element - элемент инициатор
 */
function ajaxAction(url, data, funSuccess, funError, element = null, method = 'POST') {
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: (method != 'POST' ? null : JSON.stringify(data))
    })
        .then(response => {
            if (response.ok) {
                response.text().then(d => {
                    
                    document.querySelectorAll('.modal').forEach(function(el){
                        let id = el.getAttribute('id');
                        let modal = bootstrap.Modal.getInstance(el);
                        if(modal){
                            modal.dispose();
                        }
                        el.remove();
                    });
                    funSuccess(d);
                  
                    let a = document.getElementById(data['data-id']);
                    if(a){
                        a.innerHTML = '';
                        ajaxLoad(a);                        
                    }
                });
            } else {
                response.text().then(d => {
                    funError();
                });
            }
            if (element && data.href) {
                element.setAttribute('href', data.href);
            }
        })
        .catch(error => {
            console.log(error);
        })
}

/**
 * Активация скриптов 
 */
function setInnerHTMLScript(el) {
    let scripts = [...el.getElementsByTagName("script")];
    for (let script of scripts) {

        try{
            let working = document.createElement("script");
            working.innerHTML = script.innerHTML;            
            script.replaceWith(working);
        }catch(err){
            console.error(err);
        }
        
    }
    // ajaxLoad();
}

/**
 * Возвращает все атрибуты тега
 */
function dataElementsForAax(e) {
    let data = {};
    let atts = e.attributes;
    let n = atts.length;
    for (i = 0; i < n; i++) {
        let att = atts[i];
        data[att.nodeName] = att.nodeValue;
    }
    e.removeAttribute('href');
    return data;
}

/**
 * Возвращает url 
 */
function urlElementForAjax(e) {
    let u1 = e.getAttribute('data-url');
    let u2 = e.getAttribute('href');
    return u1 ? u1 : u2;
}

/**
 * Метод для запроса. По умолчанию - GET
 */
function methodForAjax(e){
    let m = e.getAttribute('data-method');
    return m ? m.toUpperCase() : 'GET';
}

/**
 * Селектор для вставки результата. По умолчанию - ajax
 */
function idForAjax(e){
    let m = e.getAttribute('data-id');
    return m ? m : 'ajax';
}

/**
 * Поиск GET параметра в URL 
 */
function getParam(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

document.addEventListener("DOMContentLoaded", () => {
    urlLoadModal();
    ajaxLoad();
});

/**
 * Загрузка модального окна по GET параметру
 */
function urlLoadModal()
{
    let url = getParam('modal');
    if(url == undefined){
        return;
    }
    document.getElementById(id).remove();
    let id = 'ajax';
    let method = 'GET';
    let el =  document.createElement('div');
    el.setAttribute('id', id);
    document.body.append(el);
    ajaxAction(url, '{}',
        function (d) {
            el.innerHTML = d;
            ajaxLoad(el);
            urlClosedModal(el);
            setInnerHTMLScript(el);
        },
        function (d) {
            console.log(d);
        }, null, method);
}

/**
 * Удаление параметра modal из существующих ссылок на странице
 */
function urlClosedModal(el){
    el.querySelectorAll('[data-bs-dismiss="modal"]').forEach(function(close){
        close.addEventListener('click', function(){
            document.querySelectorAll('[href]').forEach(function(a){
                try{
                    let url = new URL(a.href);
                    let sp = url.searchParams;
                    if(sp != undefined && sp.has('modal')){
                        sp.delete("modal");
                        a.setAttribute('href', sp);                    
                    }
                }catch(err){
                    console.log(err);
                }
            });
            let url = new URL(document.location);
            let sp = url.searchParams;
            sp.delete("modal");
            window.history.pushState({}, '', url.toString());
        });
    });
}

function ajaxLoad(load = null){
    load = load ? load : document;
    load.querySelectorAll('.ajaxLoad').forEach(function (e) {
        this.addEventListener('load', function (event) {
            let id = idForAjax(e);
            let url = urlElementForAjax(e);
            let data = dataElementsForAax(e);
            let method = methodForAjax(e);
            ajaxAction(url, data,
                function (d) {
                    let el = document.getElementById(id);
                    el.innerHTML = d;
                    ajaxLoad(el);
                    urlClosedModal(el);
                    setInnerHTMLScript(el);
                },
                function (d) {
                    console.log(d);
                }, e, method);
        });
    });

    load.querySelectorAll('.ajaxClick').forEach(function (e) {
        e.addEventListener('click', function (event) {
            console.log(654321);
            let id = idForAjax(e);
            let url = urlElementForAjax(e);
            let data = dataElementsForAax(e);
            let method = methodForAjax(e);
            ajaxAction(url, data,
                function (d) {
                    let el = document.getElementById(id);
                    el.innerHTML = d;
                    ajaxLoad(el);
                    urlClosedModal(el);
                    setInnerHTMLScript(el);
                },
                function (d) {
                    console.log(d);
                }, e, method);
        });
    });
}

function ajaxClick(e) {
    let id = e.getAttribute('data-id');
    let url = urlElementForAjax(e);
    let data = dataElementsForAax(e);
    let method = methodForAjax(e);
    ajaxAction(url, data,
        function(d) {
            let el = document.getElementById(id);
            el.innerHTML = d;
            setInnerHTMLScript(el);
        },
        function(d) {
            console.log(d);
        }, e, method);
}