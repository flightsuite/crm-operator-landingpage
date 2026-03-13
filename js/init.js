(function () {
    fetch('/experts/experts-data.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var count = Array.isArray(data.experts) ? data.experts.length : 0;
            if (count > 0) {
                var el = document.getElementById('expert-count-label');
                if (el) {
                    el.textContent = count + ' verified GoHighLevel experts ready to help';
                }
            }
        })
        .catch(function () { /* fail silently, static fallback shown */ });
})();
