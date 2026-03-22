var appml = {
  run: function() {
    document.querySelectorAll("[appml-data]").forEach(el => {
      const url = el.getAttribute("appml-data");

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const repeat = el.querySelector("[appml-repeat]");
          const key = repeat.getAttribute("appml-repeat");
          const template = repeat.outerHTML;

          let html = "";

          data[key].forEach(item => {
            let row = template;
            for (let k in item) {
              row = row.replace(new RegExp("{{" + k + "}}", "g"), item[k]);
            }
            html += row;
          });

          repeat.outerHTML = html;
        });
    });
  }
};

window.onload = function() {
  appml.run();
};