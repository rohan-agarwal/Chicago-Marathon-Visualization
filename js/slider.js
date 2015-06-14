$("#slider").slider();

$("#slider").slider({
    max: 11
});

$("#slider").slider({
    min: 1
});

$("#slider").slider({
    change: function (event, ui) {
        updateData(ui.value);
    }
});

