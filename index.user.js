// ==UserScript==
// @name     Gourmet
// @version  1
// @grant    none
// @require  https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

const KEY_ENTER = 13;
const terms = [];
const alias = {
    "huhn": ["hendl", "henderl", "huehner"],
    "fisch": ["lachs", "kabeljau"],
    "fleisch": ["rind", "schwein", "schinken", "faschiert", "rostbraten", "rotbraten", "schnitzel", "huhn", "hendl", "henderl", "huehner"]
};

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function ($) {
    $("head").append(`<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.1/css/bootstrap.min.css" integrity="sha384-VCmXjywReHh4PwowAiWNagnWcLhlEJLA5buUprzK8rxFgeH0kww/aWY76TfkUoSX" crossorigin="anonymous">`);

    const input = $(`<input type="text" class="form-control" placeholder="blacklist"/>`)
        .keyup(function (e) {
            const value = $(this).val().toLowerCase();
            if (e.which === KEY_ENTER) {
                addFilter(value);
            } else {
                editFilter(value);
            }
        })
    ;
    const tags = $(`<div />`);
    const inputGroup = $(`<div class="input-group p-1"/>`);
    inputGroup.append(tags, input);
    $(".navigationbackground").prepend(inputGroup);


    function addFilter(value) {
        terms.push(value);
        tags.append(createTag(value));
        input.val("");
    }

    function createTag(value) {
        return $(`<a href="#" class="badge badge-pill badge-primary mr-1">${value}</span>`)
            .click(function () {
                $(this).remove();
                removeTag(value);
            });
    }

    function removeTag(value) {
        terms = terms.filter(tag => tag !== value);
        filter(terms);
    }

    function editFilter(value) {
        filter(terms.concat(value).filter(value => !!value));
    }

    function filter(terms) {
        const search = transformSearch(terms);

        $(".navigationitem a")
            .each(function () {
                const href = $(this).attr("href");
                const isFiltered = search.some(value => href.includes(value));

                if (isFiltered) {
                    $(this).css("opacity", "50%");
                } else {
                    $(this).css("opacity", "");
                }
            });
    }

    function transformSearch(terms) {
        return (
            terms
                .map(transformWord)
                .reduce((prev, next) => prev.concat(next), [])
        );
    }

    function transformWord(term) {
        const aliases = alias[term] || [];
        const transformed = [
            term
                .replaceAll("ä", "ae")
                .replaceAll("ö", "oe")
                .replaceAll("ü", "ue")
            , ...aliases
        ];


        return transformed;
    }

    function clearFilter() {
        $(".navigationitem a").css("opacity", "");
    }
});


